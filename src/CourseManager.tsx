import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Plus,
  Save,
  Target,
} from "lucide-react";
import "./courses.css";

export const COURSE_URL =
  "https://www.inflearn.com/course/pcb-hw%EC%84%A4%EA%B3%84%EC%8B%A4%EB%AC%B4-stm32";
export const COURSE_KEY = "ahw-course-main";
export const LECTURES_KEY = "ahw-course-lectures";
export const EVIDENCE_KEY = "ahw-course-evidence";

const sections = [
  [1, 1, "Orientation", "HW 경험이 취업에서 필요한 이유"],
  [
    2,
    7,
    "PCB HW 설계와 System-level 이해",
    "Power·Signal Flow와 HW 설계 프로세스",
  ],
  [
    8,
    16,
    "Requirement 분석과 부품 선택",
    "요구사항·MCU·PHY·ADC·Motor·MOSFET·Block Diagram",
  ],
  [
    17,
    33,
    "Power Budget·MCU Schematic",
    "Power Tree·STM32 전원·Clock·Reset·Debug",
  ],
  [34, 40, "PHY Schematic", "Ethernet PHY·ESD·Bead·Interface"],
  [41, 50, "Motor Driver·ADC·DAC", "Driver·MOSFET·Analog Interface"],
  [51, 59, "MIC·LDO Schematic", "Analog Power·Noise·PSRR·Signal Quality"],
  [
    60,
    76,
    "Mixed-Signal Board Layout",
    "Placement·GND·Return Path·EMI/ESD·3D 검토",
  ],
] as const;
const known: Record<number, string> = {
  1: "취준생과 현직자에게 PCB HW 경험이 필수인 이유",
  2: "System-level 이란?",
  3: "PCB HW 직무기술서 파헤쳐보기",
  4: "PCB HW 설계 Flow",
  5: "Analog 회로에서 System-level 찾아보기",
  6: "Digital 회로에서 System-level 찾아보기",
  7: "[과제1] Power & Signal Flow Exploration",
  8: "Requirement Sheet 분석하기",
  9: "Micro-controller & Debugger 선택하기",
  10: "Ethernet PHY 선택하기",
  11: "ADC & TTL 선택하기",
  12: "Motor Driver 선택하기",
  13: "MOSFET 선택하기",
  14: "DAC / MIC / I2C Interface 선택하기",
  15: "Block Diagram 작성하기",
  16: "[과제2] IC Device Study + Block Diagram",
};
const skillFor = (section: string) =>
  section.includes("Power")
    ? "Automotive Power"
    : section.includes("PHY")
      ? "EMI·ESD Protection"
      : section.includes("Motor")
        ? "Power Electronics"
        : section.includes("MIC")
          ? "Analog Electronics"
          : section.includes("Layout")
            ? "PCB Design"
            : section.includes("Requirement")
              ? "Component Selection"
              : "MCU Hardware";
export const makeLectures = () =>
  Array.from({ length: 76 }, (_, i) => {
    const n = i + 1,
      s = sections.find((x) => n >= x[0] && n <= x[1])!;
    return {
      id: `lecture-${n}`,
      number: n,
      section: s[2],
      title: known[n] || `${s[2]} · Lecture ${n}`,
      duration: 0,
      status: "시작 전",
      difficulty: "보통",
      studyDate: "",
      studyMinutes: 0,
      understanding: 0,
      steps: {
        watch: false,
        understand: false,
        practice: false,
        explain: false,
        apply: false,
      },
      memo: "",
      notes: {
        learned: "",
        concept: "",
        circuit: "",
        parts: "",
        datasheet: "",
        whyPart: "",
        whyValue: "",
        unknown: "",
        next: "",
        internship: "",
        automotive: "",
        interview: "",
      },
      skill: skillFor(s[2]),
      project: "STM32 Mixed-Signal Board Design",
      practice: "",
      extension: "",
    };
  });
const defaultCourse = {
  title: "PCB HW설계 실무 : STM32를 활용한 Mixed-signal 보드 설계 프로젝트",
  platform: "인프런",
  totalLectures: 76,
  totalMinutes: 918,
  startDate: "2026-09-01",
  targetDate: "2026-10-31",
  lastStudyDate: "",
  weeklyGoal: "주 2~4시간: 강의 1~2시간 + 회로 분석·실습·Evidence",
  currentSection: "Orientation",
  relatedSkills: [
    "MCU Hardware",
    "Circuit Design",
    "Automotive Power",
    "EMI·ESD",
    "PCB Design",
  ],
  trainingProject: "STM32 Mixed-Signal Board Design",
  independentProject: "Automotive CAN Sensor ECU",
};
const questions = [
  "왜 이 회로가 필요한가?",
  "왜 이 부품인가?",
  "왜 이 값인가?",
  "다른 부품으로 변경하면 어떻게 되는가?",
  "정격은 어떻게 선정했는가?",
  "Datasheet에서 어떤 Parameter를 확인해야 하는가?",
  "고장나면 어떤 현상이 발생할 수 있는가?",
  "어떻게 측정해서 정상 동작을 확인할 수 있는가?",
  "자동차 환경이라면 무엇을 추가로 고려해야 하는가?",
];
const eightWeeks = [
  ["9/1–9/6", "Orientation·System-level", "L1–7", "Power·Signal Flow 1장"],
  ["9/7–9/13", "Requirement·부품 선택 I", "L8–12", "Requirement와 후보 부품표"],
  [
    "9/14–9/20",
    "부품 선택 II·Block Diagram",
    "L13–16",
    "Block Diagram·Datasheet 근거",
  ],
  [
    "9/21–9/27",
    "Power Budget·STM32 I",
    "L17–24",
    "Power Budget·MCU Power Tree",
  ],
  ["9/28–10/4", "STM32 Schematic II", "L25–33", "Clock·Reset·Debug 회로 설명"],
  ["10/5–10/11", "PHY·ESD·EMI", "L34–40", "ESD Path·Protection 배치 노트"],
  [
    "10/12–10/18",
    "Motor·ADC·DAC·LDO",
    "L41–59",
    "부품 선정표·Analog Power 분석",
  ],
  [
    "10/19–10/31",
    "Mixed-Signal Layout·종합",
    "L60–76",
    "Layout Review·Training Report",
  ],
];
const conversion = [
  ["STM32 Power", "ECU MCU Power·Power Budget"],
  ["Decoupling", "Power Integrity·EMC"],
  ["ESD", "Vehicle Input·CAN Protection"],
  ["Motor Driver", "Automotive Load Driver"],
  ["ADC", "Vehicle Sensor Input"],
  ["PCB Layout", "ECU Placement·Return Path"],
];
const noteLabels: Record<string, string> = {
  learned: "오늘 배운 내용",
  concept: "핵심 개념",
  circuit: "중요한 회로",
  parts: "중요한 부품",
  datasheet: "Datasheet 확인",
  whyPart: "왜 이 부품인가?",
  whyValue: "왜 이 값인가?",
  unknown: "이해하지 못한 부분",
  next: "추가 공부",
  internship: "인턴 경험 연결(기밀 제외)",
  automotive: "자동차 전장 적용",
  interview: "예상 면접 질문",
};
function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export default function CourseManager({
  onQuickNote,
}: {
  onQuickNote: (text: string, date: string) => void;
}) {
  const [course, setCourse] = useState(() => load(COURSE_KEY, defaultCourse));
  const [lectures, setLectures] = useState<any[]>(() =>
    load(LECTURES_KEY, makeLectures()),
  );
  const [evidence, setEvidence] = useState<any[]>(() => load(EVIDENCE_KEY, []));
  const [open, setOpen] = useState<number | null>(1),
    [filter, setFilter] = useState("전체"),
    [newEvidence, setNewEvidence] = useState({
      title: "",
      type: "Datasheet Analysis",
      description: "",
    });
  useEffect(
    () => localStorage.setItem(COURSE_KEY, JSON.stringify(course)),
    [course],
  );
  useEffect(
    () => localStorage.setItem(LECTURES_KEY, JSON.stringify(lectures)),
    [lectures],
  );
  useEffect(
    () => localStorage.setItem(EVIDENCE_KEY, JSON.stringify(evidence)),
    [evidence],
  );
  const update = (n: number, patch: any) =>
    setLectures((v) => v.map((x) => (x.number === n ? { ...x, ...patch } : x)));
  const completed = lectures.filter((x) => x.status === "완료").length,
    video = Math.round((completed / 76) * 100);
  const mastery = Math.round(
    (lectures.reduce(
      (sum, x) => sum + Object.values(x.steps).filter(Boolean).length,
      0,
    ) /
      (76 * 5)) *
      100,
  );
  const studyTime = lectures.reduce(
    (sum, x) => sum + Number(x.studyMinutes || 0),
    0,
  );
  const current = lectures.find((x) => x.status !== "완료") || lectures[75];
  const list =
    filter === "전체" ? lectures : lectures.filter((x) => x.section === filter);
  const saveEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      ...newEvidence,
      id: Date.now(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setEvidence([...evidence, item]);
    setNewEvidence({ title: "", type: "Datasheet Analysis", description: "" });
  };
  return (
    <section className="page courses-page">
      <div className="course-hero">
        <div>
          <small>CURRENT COURSE · TRAINING PROJECT</small>
          <h1>PCB HW설계 실무</h1>
          <p>{course.title}</p>
          <a href={COURSE_URL} target="_blank" rel="noreferrer">
            인프런 강의 열기 <ExternalLink />
          </a>
        </div>
        <div className="course-numbers">
          <span>
            <b>{completed}/76</b>강의 완료
          </span>
          <span>
            <b>{video}%</b>Video Progress
          </span>
          <span>
            <b>{mastery}%</b>Mastery
          </span>
          <span>
            <b>
              {Math.floor(studyTime / 60)}h {studyTime % 60}m
            </b>
            실제 학습시간
          </span>
        </div>
      </div>
      <section className="course-meta">
        <label>
          시작일
          <input
            type="date"
            value={course.startDate}
            onChange={(e) =>
              setCourse({ ...course, startDate: e.target.value })
            }
          />
        </label>
        <label>
          목표 완료일
          <input
            type="date"
            value={course.targetDate}
            onChange={(e) =>
              setCourse({ ...course, targetDate: e.target.value })
            }
          />
        </label>
        <label>
          이번 주 목표
          <input
            value={course.weeklyGoal}
            onChange={(e) =>
              setCourse({ ...course, weeklyGoal: e.target.value })
            }
          />
        </label>
        <div>
          <small>현재 Section</small>
          <b>{current.section}</b>
        </div>
        <div>
          <small>관련 독립 프로젝트</small>
          <b>Automotive CAN Sensor ECU</b>
        </div>
      </section>
      <section className="course-section">
        <div className="course-heading">
          <div>
            <small>SEPTEMBER → OCTOBER</small>
            <h2>8주 완주 계획</h2>
            <p>
              15시간 영상을 15시간 만에 끝내지 않고 매주 취업 Evidence를
              남깁니다.
            </p>
          </div>
        </div>
        <div className="course-weeks">
          {eightWeeks.map((w, i) => (
            <article key={w[0]}>
              <i>W{i + 1}</i>
              <b>
                {w[0]} · {w[1]}
              </b>
              <span>{w[2]}</span>
              <p>주간 결과물: {w[3]}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="course-section">
        <div className="course-heading">
          <div>
            <small>LECTURE MANAGEMENT</small>
            <h2>76강 학습 관리</h2>
            <p>
              Watch와 Mastery를 분리하고, 직접 설명·적용할 수 있는지를
              확인합니다.
            </p>
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>전체</option>
            {sections.map((s) => (
              <option key={s[2]}>{s[2]}</option>
            ))}
          </select>
        </div>
        <div className="lecture-list">
          {list.map((x) => (
            <article
              key={x.id}
              className={open === x.number ? "lecture open" : "lecture"}
            >
              <header
                onClick={() => setOpen(open === x.number ? null : x.number)}
              >
                <i>{x.number}</i>
                <div>
                  <small>
                    {x.section} · {x.skill}
                  </small>
                  <h3>{x.title}</h3>
                </div>
                <em>{x.status}</em>
                {open === x.number ? <ChevronUp /> : <ChevronDown />}
              </header>
              {open === x.number && (
                <div className="lecture-body">
                  <div className="lecture-controls">
                    <label>
                      상태
                      <select
                        value={x.status}
                        onChange={(e) =>
                          update(x.number, {
                            status: e.target.value,
                            lastStudyDate: new Date()
                              .toISOString()
                              .slice(0, 10),
                          })
                        }
                      >
                        {["시작 전", "시청 중", "완료", "복습 필요"].map(
                          (v) => (
                            <option key={v}>{v}</option>
                          ),
                        )}
                      </select>
                    </label>
                    <label>
                      난이도
                      <select
                        value={x.difficulty}
                        onChange={(e) =>
                          update(x.number, { difficulty: e.target.value })
                        }
                      >
                        {["쉬움", "보통", "어려움", "매우 어려움"].map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      학습일
                      <input
                        type="date"
                        value={x.studyDate}
                        onChange={(e) =>
                          update(x.number, { studyDate: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      학습시간(분)
                      <input
                        type="number"
                        min="0"
                        value={x.studyMinutes}
                        onChange={(e) =>
                          update(x.number, {
                            studyMinutes: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                    <label>
                      이해도 {x.understanding}%
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={x.understanding}
                        onChange={(e) =>
                          update(x.number, {
                            understanding: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  </div>
                  <div className="mastery-steps">
                    {(
                      [
                        "watch",
                        "understand",
                        "practice",
                        "explain",
                        "apply",
                      ] as const
                    ).map((k) => (
                      <label key={k}>
                        <input
                          type="checkbox"
                          checked={x.steps[k]}
                          onChange={() =>
                            update(x.number, {
                              steps: { ...x.steps, [k]: !x.steps[k] },
                            })
                          }
                        />
                        <i>{x.steps[k] && <Check />}</i>
                        <span>{k.toUpperCase()}</span>
                      </label>
                    ))}
                  </div>
                  <div className="why-questions">
                    {questions.map((q) => (
                      <span key={q}>{q}</span>
                    ))}
                  </div>
                  <div className="lecture-notes">
                    {Object.entries(noteLabels).map(([k, label]) => (
                      <label key={k}>
                        {label}
                        <textarea
                          value={x.notes[k]}
                          onChange={(e) =>
                            update(x.number, {
                              notes: { ...x.notes, [k]: e.target.value },
                            })
                          }
                        />
                      </label>
                    ))}
                  </div>
                  <div className="practice-extension">
                    <label>
                      Section Practice
                      <textarea
                        value={x.practice}
                        onChange={(e) =>
                          update(x.number, { practice: e.target.value })
                        }
                        placeholder="직접 그린 회로·Datasheet 분석·계산·측정 결과"
                      />
                    </label>
                    <label>
                      Automotive Extension
                      <textarea
                        value={x.extension}
                        onChange={(e) =>
                          update(x.number, { extension: e.target.value })
                        }
                        placeholder="이 내용을 차량 ECU에 적용하면 무엇을 추가 고려해야 하는가?"
                      />
                    </label>
                  </div>
                  <div className="lecture-actions">
                    <button
                      onClick={() =>
                        onQuickNote(
                          `[HW 강의 학습]\nLecture ${x.number}: ${x.title}\n배운 내용: ${x.notes.learned}\n핵심 개념: ${x.notes.concept}\n이해하지 못한 부분: ${x.notes.unknown}\n직접 실습: ${x.practice}\n자동차 전장 적용: ${x.extension}\n면접 질문: ${x.notes.interview}`,
                          x.studyDate || new Date().toISOString().slice(0, 10),
                        )
                      }
                    >
                      <FileText /> 빠른 기록으로 보내기
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
      <section className="course-section conversion">
        <div className="course-heading">
          <div>
            <small>FROM TRAINING TO AUTOMOTIVE PROJECT</small>
            <h2>따라 만든 보드를 독립 설계 역량으로 변환</h2>
          </div>
        </div>
        <div>
          {conversion.map((x) => (
            <p key={x[0]}>
              <b>{x[0]}</b>
              <i>→</i>
              <span>{x[1]}</span>
            </p>
          ))}
        </div>
        <aside>
          <b>표현 원칙</b>
          <span>
            강의 보드는 TRAINING PROJECT로 표시합니다. 독립 설계로 주장하지
            않고, 배운 원리를 Automotive CAN Sensor ECU에서 요구사항과 부품을
            다시 선택해 적용합니다.
          </span>
        </aside>
      </section>
      <section className="course-section evidence">
        <div className="course-heading">
          <div>
            <small>EMPLOYMENT EVIDENCE</small>
            <h2>취업에 사용할 결과물</h2>
          </div>
        </div>
        <form onSubmit={saveEvidence}>
          <input
            required
            value={newEvidence.title}
            onChange={(e) =>
              setNewEvidence({ ...newEvidence, title: e.target.value })
            }
            placeholder="결과물 이름"
          />
          <select
            value={newEvidence.type}
            onChange={(e) =>
              setNewEvidence({ ...newEvidence, type: e.target.value })
            }
          >
            {[
              "Course Completion",
              "Circuit Calculation",
              "Datasheet Analysis",
              "Schematic",
              "Simulation",
              "PCB Layout",
              "Measurement",
              "Debugging",
              "Technical Report",
              "GitHub",
              "Portfolio",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <input
            value={newEvidence.description}
            onChange={(e) =>
              setNewEvidence({ ...newEvidence, description: e.target.value })
            }
            placeholder="내가 직접 한 것과 검증 결과"
          />
          <button>
            <Plus />
            추가
          </button>
        </form>
        <div className="evidence-list">
          {evidence.length ? (
            evidence.map((x) => (
              <article key={x.id}>
                <Target />
                <div>
                  <small>
                    {x.type} · {x.createdAt}
                  </small>
                  <b>{x.title}</b>
                  <p>{x.description}</p>
                </div>
              </article>
            ))
          ) : (
            <p>
              아직 Evidence가 없습니다. 매주 최소 하나의 결과물을 추가하세요.
            </p>
          )}
        </div>
      </section>
    </section>
  );
}
