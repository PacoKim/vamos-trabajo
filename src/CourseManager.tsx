import { useEffect, useState } from "react";
import { CalendarDays, Check, ChevronDown, ChevronUp, ExternalLink, FileText, Play, Plus, Target, Upload } from "lucide-react";
import "./courses.css";

export const COURSE_URL = "https://www.inflearn.com/course/%EC%A0%84%EB%8F%99%ED%82%A5%EB%B3%B4%EB%93%9C%EA%B0%9C%EB%B0%9C-%EC%9E%84%EB%B2%A0%EB%94%94%EB%93%9C-%EA%B0%9C%EB%B0%9C%EC%9E%90";
export const COURSE_KEY = "ahw-kickboard-course-v1";
export const LECTURES_KEY = "ahw-kickboard-lectures-v1";
export const EVIDENCE_KEY = "ahw-kickboard-evidence-v1";

const skillAreas = ["회로 기초", "전자부품", "STM32", "MCU 주변장치", "C·임베디드 펌웨어", "전력전자", "MOSFET", "게이트 드라이버", "벅 컨버터", "3상 인버터", "BLDC 모터", "전류 측정", "PCB 설계", "4층 PCB", "전원·접지", "노이즈", "측정", "디버깅"];
const evidenceTypes = ["블록도", "회로 계산", "데이터시트 분석", "회로도", "PCB", "펌웨어", "측정", "디버깅", "기술 노트", "포트폴리오"];
const phases = [
  ["1단계", "교육 기반 HW 프로젝트", "2026.08–10", "전동킥보드 개발 과정을 따라가며 HW 개발 전체 흐름을 경험"],
  ["2단계", "자동차 전장 확장", "강의 완료 후", "CAN·LIN·차량 전원·보호·EMC·ESD 개념 확장"],
  ["3단계", "독립 자동차 HW 프로젝트", "기초 개념 확보 후", "자동차 CAN 센서 ECU를 요구사항부터 독립 설계"],
  ["4단계", "취업 준비", "프로젝트와 병행", "포트폴리오·자소서·기술/인성면접·인적성"],
];
const defaultCourse = { title: "전동킥보드로 배우는 임베디드 실전 프로젝트", platform: "인프런", category: "GUIDED PROJECT", totalLectures: 159, officialLectureCount: 152, startDate: "2026-08-24", targetDate: "2026-10-31", weeklyGoal: "핵심 목표 최대 3개 · 강의 진도보다 이해와 결과물 우선", guidedProject: "Electric Kickboard BLDC Motor Controller", independentProject: "Automotive CAN Sensor ECU" };
const emptyNotes = { learned: "", practiced: "", unknown: "", problem: "", hypothesis: "", attempt: "", result: "", internship: "", automotive: "", interview: "" };
export const makeLectures = (count = 159) => Array.from({ length: count }, (_, i) => ({ id: `kickboard-lecture-${i + 1}`, number: i + 1, section: "", title: "", duration: 0, assignedWeek: 0, status: "시작 전", plannedDate: "", startedDate: "", studyDate: "", studyMinutes: 0, steps: { watch: false, understand: false, practice: false, explain: false, apply: false }, memo: "", skill: "", notes: { ...emptyNotes } }));
const load = <T,>(key: string, fallback: T): T => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
const normalizeLecture = (row: any, index: number) => ({ id: row.id || `kickboard-lecture-${row.number || index + 1}`, number: Number(row.number || row.lectureNumber || index + 1), section: row.section || "", title: row.title || "", duration: Number(row.duration || 0), assignedWeek: Number(row.assignedWeek || row.week || 0), status: row.status || "시작 전", difficulty: row.difficulty || "보통", plannedDate: row.plannedDate || "", startedDate: row.startedDate || "", studyDate: row.studyDate || "", studyMinutes: Number(row.studyMinutes || row.studyTime || 0), steps: { watch: false, understand: false, practice: false, explain: false, apply: false, ...(row.steps || {}) }, memo: row.memo || "", skill: row.skill || "", notes: { ...emptyNotes, ...(row.notes || {}) } });

const todayKey = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
const actualStatus = (lecture: any) => {
  if (lecture.steps?.watch || lecture.status === "완료") return "완료";
  if (lecture.status === "진행 중" || lecture.startedDate || lecture.steps?.understand || lecture.steps?.practice) return "진행 중";
  return "시작 전";
};

export default function CourseManager({ onQuickNote }: { onQuickNote: (text: string, date: string) => void }) {
  const [course, setCourse] = useState(() => load(COURSE_KEY, defaultCourse));
  const [lectures, setLectures] = useState<any[]>(() => load(LECTURES_KEY, makeLectures()));
  const [evidence, setEvidence] = useState<any[]>(() => load(EVIDENCE_KEY, []));
  const [open, setOpen] = useState<number | null>(1);
  const [filter, setFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [importText, setImportText] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [newEvidence, setNewEvidence] = useState({ title: "", type: "Block Diagram", description: "", skill: "", project: "Course", interview: false, resume: false });
  useEffect(() => localStorage.setItem(COURSE_KEY, JSON.stringify(course)), [course]);
  useEffect(() => localStorage.setItem(LECTURES_KEY, JSON.stringify(lectures)), [lectures]);
  useEffect(() => localStorage.setItem(EVIDENCE_KEY, JSON.stringify(evidence)), [evidence]);
  const update = (number: number, patch: any) => setLectures((items) => items.map((item) => item.number === number ? { ...item, ...patch } : item));
  const setLectureStatus = (number: number, status: string) => {
    const today = todayKey();
    setLectures((items) => items.map((item) => {
      if (item.number !== number) return item;
      if (status === "완료") return { ...item, status, startedDate: item.startedDate || today, studyDate: today, steps: { ...item.steps, watch: true } };
      if (status === "진행 중") return { ...item, status, startedDate: item.startedDate || today, steps: { ...item.steps, watch: false } };
      return { ...item, status, startedDate: "", studyDate: "", steps: { ...item.steps, watch: false } };
    }));
  };
  const watched = lectures.filter((x) => x.steps.watch || x.status === "완료").length;
  const video = Math.round((watched / Math.max(lectures.length, 1)) * 100);
  const summarized = lectures.filter((x) => x.notes.learned.trim()).length;
  const understood = lectures.filter((x) => x.steps.understand).length;
  const practiced = lectures.filter((x) => x.steps.practice || x.notes.practiced.trim()).length;
  const today = todayKey();
  const nextLecture = lectures.find((x) => actualStatus(x) !== "완료");
  const todayLectures = lectures.filter((x) => x.plannedDate === today && actualStatus(x) !== "완료");
  const overdueLectures = lectures.filter((x) => x.plannedDate && x.plannedDate < today && actualStatus(x) !== "완료");
  const completedToday = lectures.filter((x) => x.studyDate === today && actualStatus(x) === "완료").length;
  const list = lectures.filter((x) => {
    const status = actualStatus(x);
    const matches = filter === "전체" || filter === status || (filter === "오늘" && x.plannedDate === today && status !== "완료") || (filter === "밀림" && x.plannedDate && x.plannedDate < today && status !== "완료");
    const q = search.trim().toLowerCase();
    return matches && (!q || `${x.number} ${x.section} ${x.title} ${x.skill}`.toLowerCase().includes(q));
  });
  const resizeLectures = (count: number) => { const safe = Math.max(1, Math.min(500, count || 1)); setCourse({ ...course, totalLectures: safe }); setLectures((items) => safe > items.length ? [...items, ...makeLectures(safe).slice(items.length)] : items.slice(0, safe)); };
  const importLectures = () => {
    try {
      const trimmed = importText.trim(); if (!trimmed) return;
      let rows: any[];
      if (trimmed.startsWith("[") || trimmed.startsWith("{")) { const parsed = JSON.parse(trimmed); rows = Array.isArray(parsed) ? parsed : parsed.lectures; }
      else { const lines = trimmed.split(/\r?\n/).filter(Boolean); const headers = lines[0].split(",").map((x) => x.trim().toLowerCase()); rows = lines.slice(1).map((line) => { const cells = line.split(",").map((x) => x.trim().replace(/^"|"$/g, "")); const get = (...keys: string[]) => cells[headers.findIndex((h) => keys.includes(h))] || ""; return { number: get("number", "lecturenumber", "lecture number"), section: get("section"), title: get("title"), duration: get("duration"), assignedWeek: get("week", "assignedweek", "assigned week") }; }); }
      if (!Array.isArray(rows)) throw new Error("목록 형식이 아닙니다.");
      const imported = rows.map(normalizeLecture); const merged = [...lectures];
      imported.forEach((item) => { const index = merged.findIndex((x) => x.number === item.number); if (index >= 0) merged[index] = { ...merged[index], ...item, steps: { ...merged[index].steps, ...item.steps }, notes: { ...merged[index].notes, ...item.notes } }; else merged.push(item); });
      merged.sort((a, b) => a.number - b.number); setLectures(merged); setCourse({ ...course, totalLectures: merged.length }); setImportMessage(`${imported.length}개 강의를 불러왔습니다.`); setImportText("");
    } catch (error) { setImportMessage(`불러오기 실패: ${error instanceof Error ? error.message : "형식을 확인하세요."}`); }
  };
  const saveEvidence = (event: React.FormEvent) => { event.preventDefault(); setEvidence([...evidence, { ...newEvidence, id: Date.now(), createdAt: new Date().toISOString().slice(0, 10), course: course.title }]); setNewEvidence({ title: "", type: "Block Diagram", description: "", skill: "", project: "Course", interview: false, resume: false }); };
  const progressItems: [string, number][] = [
    ["강의 시청", video],
    ["내용 이해", Math.round((understood / Math.max(lectures.length, 1)) * 100)],
    ["핵심 정리", Math.round((summarized / Math.max(lectures.length, 1)) * 100)],
    ["직접 실습", Math.round((practiced / Math.max(lectures.length, 1)) * 100)],
  ];

  const startNextLecture = () => {
    if (!nextLecture) return;
    setLectureStatus(nextLecture.number, "진행 중");
    update(nextLecture.number, { plannedDate: nextLecture.plannedDate || today });
    setOpen(nextLecture.number);
  };

  return <section className="page courses-page kickboard-course">
    <div className="course-hero"><div><small>현재 강의 · 교육 기반 프로젝트</small><h1>전동킥보드 임베디드 프로젝트</h1><p>{course.title}</p><a href={COURSE_URL} target="_blank" rel="noreferrer">인프런 강의 열기 <ExternalLink /></a></div><div className="course-numbers"><span><b>{watched}/{lectures.length}</b>강의 시청</span><span><b>{video}%</b>시청 진행률</span><span><b>{summarized}</b>핵심 정리</span><span><b>{practiced}</b>직접 실습</span></div></div>
    <aside className="guided-warning"><b>교육 기반 프로젝트 표현 원칙</b><p>이 과정은 최종 독립 프로젝트가 아닙니다. 포트폴리오에는 반드시 “온라인 실무교육 기반 프로젝트”라고 표시하고, 제공된 설계와 직접 판단·수정한 범위를 구분합니다.</p></aside>
    <section className="course-live-plan">
      <div><small>오늘의 실제 학습</small><h2>{todayLectures.length ? `예정 강의 ${todayLectures.length}개` : nextLecture ? `${nextLecture.number}강부터 이어서 학습` : "모든 강의 완료"}</h2><p>{overdueLectures.length ? `밀린 강의 ${overdueLectures.length}개가 있습니다. 오늘 일정에 먼저 반영하세요.` : "밀린 일정 없이 진행 중입니다."}</p></div>
      <div className="live-plan-stats"><span><b>{completedToday}</b>오늘 완료</span><span><b>{lectures.filter((x) => actualStatus(x) === "진행 중").length}</b>진행 중</span><span><b>{lectures.length - watched}</b>남은 강의</span></div>
      {nextLecture && <button type="button" onClick={startNextLecture}><Play /> 다음 강의 시작</button>}
    </section>
    <section className="course-meta"><label>시작일<input type="date" value={course.startDate} onChange={(e) => setCourse({ ...course, startDate: e.target.value })} /></label><label>목표 완료일<input type="date" value={course.targetDate} onChange={(e) => setCourse({ ...course, targetDate: e.target.value })} /></label><label>관리 강의 수<input type="number" min="1" max="500" value={course.totalLectures} onChange={(e) => resizeLectures(Number(e.target.value))} /></label><label>이번 주 원칙<input value={course.weeklyGoal} onChange={(e) => setCourse({ ...course, weeklyGoal: e.target.value })} /></label><div><small>교육 기반 프로젝트</small><b>전동킥보드 BLDC 모터 제어기</b></div><div><small>독립 프로젝트</small><b>자동차 CAN 센서 ECU</b></div></section>
    <section className="course-section"><div className="course-heading"><div><small>4단계 로드맵</small><h2>강의에서 독립 설계와 취업까지</h2></div></div><div className="phase-roadmap">{phases.map((phase) => <article key={phase[0]}><i>{phase[0]}</i><b>{phase[1]}</b><small>{phase[2]}</small><p>{phase[3]}</p></article>)}</div></section>
    <section className="course-section skill-progress-section"><div className="course-heading"><div><small>필수 진행률</small><h2>시청·이해·핵심 정리·직접 실습</h2><p>완료 체크 후, 취업에 연결할 내용이 있는 강의만 근거와 실습 결과를 적으세요.</p></div></div><div className="separated-progress">{progressItems.map(([label, value]) => <article key={label}><span><b>{label}</b><em>{value}%</em></span><i><u style={{ width: `${value}%` }} /></i></article>)}</div></section>
    <section className="course-section lecture-import"><div className="course-heading"><div><small>강의 목록 가져오기</small><h2>실제 강의 목록 가져오기</h2><p>제목을 임의로 생성하지 않습니다. 직접 편집하거나 CSV·JSON을 붙여 넣으세요.</p></div></div><textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder={'CSV: 번호,구역,제목,시간,주차\n1,구역 이름,실제 강의 제목,10,1\n\n또는 JSON 배열'} /><div className="import-actions"><button type="button" onClick={importLectures}><Upload /> CSV·JSON 불러오기</button><span>{importMessage}</span></div></section>
    <section className="course-section"><div className="course-heading lecture-heading"><div><small>실제 강의 기록</small><h2>{lectures.length}개 강의 관리</h2><p>상태와 날짜는 직접 학습한 기록만 반영됩니다. 강의 제목과 메모는 기존 내용을 그대로 보존합니다.</p></div><div><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="번호·제목 검색" /><select value={filter} onChange={(e) => setFilter(e.target.value)}><option>전체</option><option>오늘</option><option>밀림</option><option>진행 중</option><option>시작 전</option><option>완료</option></select></div></div>
      <div className="lecture-list">{list.map((x) => { const status = actualStatus(x); return <article key={x.id} className={open === x.number ? "lecture open" : "lecture"}><header onClick={() => setOpen(open === x.number ? null : x.number)}><i>{x.number}</i><div><small>{x.section || "구역 미입력"} · {x.plannedDate ? `${x.plannedDate} 예정` : "일정 미정"}</small><h3>{x.title || "실제 강의 제목을 입력하세요"}</h3></div><em className={`status-${status.replace(" ", "-")}`}>{status}</em>{open === x.number ? <ChevronUp /> : <ChevronDown />}</header>{open === x.number && <div className="lecture-body">
        <div className="lecture-identity lecture-real-schedule"><label>실제 강의 제목<input value={x.title} onChange={(e) => update(x.number, { title: e.target.value })} /></label><label>학습 예정일<input type="date" value={x.plannedDate || ""} onChange={(e) => update(x.number, { plannedDate: e.target.value })} /></label><label>실제 시작일<input type="date" value={x.startedDate || ""} onChange={(e) => update(x.number, { startedDate: e.target.value, status: e.target.value && status === "시작 전" ? "진행 중" : x.status })} /></label><label>완료일<input type="date" value={x.studyDate || ""} onChange={(e) => update(x.number, { studyDate: e.target.value, status: e.target.value ? "완료" : (x.startedDate ? "진행 중" : "시작 전"), steps: { ...x.steps, watch: Boolean(e.target.value) } })} /></label></div>
        <div className="lecture-status-actions"><span><CalendarDays /> 실제 상태</span>{["시작 전", "진행 중", "완료"].map((value) => <button type="button" key={value} className={status === value ? "active" : ""} onClick={() => setLectureStatus(x.number, value)}>{value}</button>)}</div>
        <div className="mastery-steps essential-steps">{(["watch", "understand", "practice"] as const).map((key) => <label key={key}><input type="checkbox" checked={key === "watch" ? status === "완료" : x.steps[key]} onChange={() => { const checked = key === "watch" ? status !== "완료" : !x.steps[key]; if (key === "watch") setLectureStatus(x.number, checked ? "완료" : (x.startedDate ? "진행 중" : "시작 전")); else update(x.number, { status: checked && status === "시작 전" ? "진행 중" : x.status, startedDate: checked ? (x.startedDate || today) : x.startedDate, steps: { ...x.steps, [key]: checked } }); }} /><i>{(key === "watch" ? status === "완료" : x.steps[key]) && <Check />}</i><span>{{ watch: "시청 완료", understand: "핵심 이해", practice: "직접 실습" }[key]}</span></label>)}</div>
        <div className="lecture-notes essential-notes medium">{Object.entries({ learned: "핵심 내용 · 최대 3줄", result: "중요한 계산·부품 선정 근거", practiced: "직접 해본 것과 결과", unknown: "막힌 점과 다음에 확인할 것" }).map(([key, label]) => <label key={key}>{label}<textarea value={x.notes[key]} onChange={(e) => update(x.number, { notes: { ...x.notes, [key]: e.target.value } })} /></label>)}</div>
        <div className="lecture-actions"><button onClick={() => onQuickNote(`[전동킥보드 강의 ${x.number}] ${x.title || "제목 미입력"}\n핵심 내용: ${x.notes.learned || "없음"}\n계산·선정 근거: ${x.notes.result || "없음"}\n직접 해본 것과 결과: ${x.notes.practiced || "없음"}\n막힌 점·다음 행동: ${x.notes.unknown || "없음"}`, x.studyDate || new Date().toISOString().slice(0, 10))}><FileText /> 경험 보관함으로 보내기</button></div>
      </div>}</article>; })}</div>
    </section>
    <section className="course-section conversion"><div className="course-heading"><div><small>프로젝트 구분</small><h2>교육 프로젝트와 독립 프로젝트 구분</h2></div></div><div className="project-boundaries"><article><small>프로젝트 01 · 교육 기반</small><b>전동킥보드 BLDC 모터 제어기</b><p>역할: 온라인 강의 기반 교육 프로젝트</p></article><article><small>프로젝트 02 · 독립 설계</small><b>자동차 CAN 센서 ECU</b><p>역할: 독립 하드웨어 설계 프로젝트</p></article></div><aside><b>취업 표현 원칙</b><span>강의에서 제공된 설계와 직접 수행한 범위를 분리합니다. 교육 프로젝트에서 배운 방법을 이용해 CAN ECU의 요구사항·부품·회로·검증을 스스로 결정한 증거를 남깁니다.</span></aside></section>
    <section className="course-section evidence"><div className="course-heading"><div><small>주간 결과물 · 역량 증거</small><h2>취업에 사용할 결과물</h2><p>실제로 수행한 결과만 저장하고 강의·역량·프로젝트·면접·자소서와 연결합니다.</p></div></div><form onSubmit={saveEvidence} className="rich-evidence-form"><input required value={newEvidence.title} onChange={(e) => setNewEvidence({ ...newEvidence, title: e.target.value })} placeholder="결과물 이름" /><select value={newEvidence.type} onChange={(e) => setNewEvidence({ ...newEvidence, type: e.target.value })}>{evidenceTypes.map((v) => <option key={v}>{v}</option>)}</select><select value={newEvidence.skill} onChange={(e) => setNewEvidence({ ...newEvidence, skill: e.target.value })}><option value="">연결 역량</option>{skillAreas.map((v) => <option key={v}>{v}</option>)}</select><select value={newEvidence.project} onChange={(e) => setNewEvidence({ ...newEvidence, project: e.target.value })}><option value="Course">강의</option><option value="Guided Project">교육 프로젝트</option><option value="Independent Project">독립 프로젝트</option></select><input value={newEvidence.description} onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })} placeholder="내가 직접 한 것·수치·검증 결과" /><label><input type="checkbox" checked={newEvidence.interview} onChange={(e) => setNewEvidence({ ...newEvidence, interview: e.target.checked })} /> 면접 연결</label><label><input type="checkbox" checked={newEvidence.resume} onChange={(e) => setNewEvidence({ ...newEvidence, resume: e.target.checked })} /> 자소서 연결</label><button><Plus /> 추가</button></form><div className="evidence-list">{evidence.length ? evidence.map((x) => <article key={x.id}><Target /><div><small>{x.type} · {x.skill || "역량 미연결"} · {x.project} · {x.createdAt}</small><b>{x.title}</b><p>{x.description}</p><em>{[x.interview && "면접", x.resume && "자소서"].filter(Boolean).join(" · ")}</em></div></article>) : <p>아직 결과물이 없습니다. 매주 최소 하나의 검증 가능한 결과물을 남기세요.</p>}</div></section>
  </section>;
}
