import { useEffect, useMemo, useState } from "react";
import CircuitStarter from "./CircuitStarter";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Check,
  Circle,
  Download,
  FileQuestion,
  FolderKanban,
  GraduationCap,
  Home,
  Menu,
  Plus,
  RotateCcw,
  Save,
  Settings,
  Sparkles,
  Target,
  Upload,
  Wrench,
  X,
} from "lucide-react";

type View =
  | "dashboard"
  | "careerHub"
  | "learningHub"
  | "recruitHub"
  | "career"
  | "planner"
  | "study"
  | "applications"
  | "skills"
  | "journal"
  | "interview"
  | "project"
  | "circuitStarter"
  | "experience"
  | "review"
  | "settings";
type Week = {
  n: number;
  dates: string;
  title: string;
  phase: string;
  tasks: string[];
  deliverables: string[];
  question: string;
};
const raw = [
  [
    "8/24–8/30",
    "회로설계 다시 시작하기",
    "FOUNDATION",
    [
      "전압·전류·저항·전력",
      "Ohm's Law / KVL / KCL",
      "Series / Parallel Circuit",
      "Voltage Divider 계산",
      "LTspice 설치 및 결과 비교",
    ],
    ["Voltage Divider 계산 노트", "LTspice 첫 Simulation"],
    "KVL과 KCL의 차이는?",
  ],
  [
    "8/31–9/6",
    "Capacitor와 RC Circuit",
    "FOUNDATION",
    [
      "Capacitance / Charge",
      "RC Time Constant",
      "Charging / Discharging",
      "Low / High Pass Filter",
      "Decoupling / Bypass Capacitor",
      "LTspice Transient Simulation",
    ],
    ["RC Simulation 비교자료"],
    "Decoupling Capacitor의 역할은?",
  ],
  [
    "9/7–9/13",
    "Diode",
    "FOUNDATION",
    [
      "PN Junction / Forward Voltage",
      "Schottky / Zener / TVS",
      "Reverse Polarity",
      "Inductive Load Protection",
      "일반 Diode와 Zener 비교",
    ],
    ["Automotive Protection Diode 정리"],
    "TVS와 Zener Diode의 차이는?",
  ],
  [
    "9/14–9/20",
    "MOSFET",
    "FOUNDATION",
    [
      "N/P-channel, Gate·Drain·Source",
      "Vgs / Rds(on)",
      "LED/Load Switching Simulation",
      "Reverse Battery Protection",
    ],
    ["MOSFET Switching Simulation"],
    "Rds(on)은 왜 중요한가?",
  ],
  [
    "9/21–9/27",
    "OP AMP / Comparator",
    "CIRCUIT",
    [
      "Inverting / Non-Inverting",
      "Voltage Follower",
      "LTspice OP AMP Simulation",
      "Sensor Signal Conditioning",
    ],
    ["Sensor Input Circuit Simulation"],
    "OP AMP와 Comparator의 차이는?",
  ],
  [
    "9/28–10/4",
    "전원회로 기초",
    "CIRCUIT",
    [
      "Linear Regulator / LDO",
      "Buck / Boost Converter",
      "Efficiency / Ripple",
      "12V→5V→3.3V 구조 비교",
    ],
    ["Automotive ECU Power Block Diagram"],
    "LDO와 Buck의 선택 기준은?",
  ],
  [
    "10/5–10/11",
    "MCU 기초",
    "MCU & CAN",
    [
      "CPU / Memory / GPIO",
      "ADC / PWM / Timer",
      "Clock / Reset / Watchdog",
      "STM32 Datasheet 읽기",
    ],
    ["MCU Block Diagram 정리"],
    "Watchdog은 왜 필요한가?",
  ],
  [
    "10/12–10/18",
    "MCU 주변회로",
    "MCU & CAN",
    [
      "Power Pin / Decoupling",
      "Reset / Clock Circuit",
      "Programming Interface",
      "STM32 Board 회로도 분석",
    ],
    ["MCU Minimum System Circuit 정리"],
    "MCU 전원핀 근처 Capacitor의 역할은?",
  ],
  [
    "10/19–10/25",
    "CAN Communication",
    "MCU & CAN",
    [
      "CAN High / CAN Low",
      "Differential Signal",
      "Dominant / Recessive",
      "CAN Transceiver / 120Ω Termination",
      "CANalyzer 경험 정리",
    ],
    ["MCU → CAN Transceiver → CAN Bus Diagram"],
    "CAN에서 120Ω을 쓰는 이유는?",
  ],
  [
    "10/26–11/1",
    "Automotive Protection",
    "AUTOMOTIVE",
    [
      "ESD / EMI / EMC",
      "TVS / Reverse Polarity",
      "Over Voltage / Current",
      "Ground / Filtering",
      "ESD 경험 재분석(기밀 제외)",
    ],
    ["ESD Experience Technical Report"],
    "ESD와 EMC의 차이는?",
  ],
  [
    "11/2–11/8",
    "KiCad 시작",
    "PCB",
    [
      "Schematic / Symbol / Footprint",
      "Net / ERC / PCB",
      "LED + Resistor",
      "Connector / Power Circuit",
    ],
    ["첫 KiCad Schematic"],
    "ERC는 무엇을 검사하는가?",
  ],
  [
    "11/9–11/15",
    "PCB 기초",
    "PCB",
    [
      "Component Placement",
      "Trace / Via / Ground Plane",
      "Power vs Signal Trace",
      "Decoupling Placement",
    ],
    ["첫 PCB Layout"],
    "Decoupling 배치가 중요한 이유는?",
  ],
  [
    "11/16–11/22",
    "CAN Sensor ECU 설계 시작",
    "ECU PROJECT",
    [
      "Requirements 작성",
      "12V Input 정의",
      "Power / MCU / CAN",
      "Sensor Input / LED Output",
      "System Block Diagram",
    ],
    ["Requirements Document", "System Block Diagram"],
    "요구사항에서 구조를 어떻게 도출했는가?",
  ],
  [
    "11/23–11/29",
    "ECU Component Selection",
    "ECU PROJECT",
    [
      "Regulator / MCU / CAN 선정",
      "Protection / Connector 선정",
      "정격과 선정 이유",
      "대안 부품과 가격",
      "Datasheet 근거 기록",
    ],
    ["Component Selection Table"],
    "왜 이 부품을 선택했는가?",
  ],
  [
    "11/30–12/6",
    "ECU Schematic",
    "ECU PROJECT",
    [
      "Power / MCU / CAN",
      "Sensor / Output",
      "Protection",
      "KiCad 전체 회로",
      "ERC 실행",
    ],
    ["ECU Schematic V1"],
    "회로도를 Block 단위로 설명해보라.",
  ],
  [
    "12/7–12/13",
    "PCB Layout",
    "ECU PROJECT",
    [
      "Component Placement",
      "Ground / Power Routing",
      "CAN Routing",
      "Decoupling / Connector Placement",
    ],
    ["ECU PCB V1"],
    "PCB 배치 순서를 어떻게 정했는가?",
  ],
  [
    "12/14–12/20",
    "Review / PCB 제작",
    "BUILD",
    [
      "Datasheet 재확인",
      "ERC / DRC",
      "Gerber / BOM",
      "Design Review",
      "가능하면 PCB 주문",
    ],
    ["Gerber", "BOM", "Design Review Note"],
    "DRC와 ERC의 차이는?",
  ],
  [
    "12/21–12/27",
    "Bring-up / Measurement",
    "BUILD",
    [
      "Visual / Short Check",
      "Current Limit 설정",
      "Rail Voltage 확인",
      "Oscilloscope 측정",
      "MCU / CAN 확인",
    ],
    ["Bring-up Checklist", "Measurement Result"],
    "첫 전원 인가 전 무엇을 확인하는가?",
  ],
  [
    "12/28–1/3",
    "Debugging",
    "VALIDATION",
    [
      "Problem / Hypothesis",
      "Measurement / Evidence",
      "Root Cause Candidate",
      "Modification / Retest",
    ],
    ["Debugging Report"],
    "회로 문제에 어떻게 접근하는가?",
  ],
  [
    "1/4–1/10",
    "Portfolio 완성",
    "PORTFOLIO",
    [
      "Requirement / Architecture",
      "Component Selection / Circuit",
      "PCB / Prototype / Measurement",
      "Debugging / Improvement",
      "What I Learned",
    ],
    ["Automotive CAN Sensor ECU Portfolio"],
    "직접 설계한 회로를 설명해보라.",
  ],
] as const;
const weeks: Week[] = raw.map((w, i) => ({
  n: i + 1,
  dates: w[0],
  title: w[1],
  phase: w[2],
  tasks: [...w[3]],
  deliverables: [...w[4]],
  question: w[5],
}));
const nav: [[View, string, any], ...any[]] = [
  ["dashboard", "대시보드", BarChart3],
  ["careerHub", "취업 준비", Target],
  ["learningHub", "학습·프로젝트", BookOpen],
  ["journal", "기록·경험", Sparkles],
  ["recruitHub", "지원·면접", BriefcaseBusiness],
  ["settings", "설정·백업", Settings],
];
const viewTitles: Partial<Record<View, string>> = {
  career: "취업 전략",
  planner: "주간 일정",
  study: "20주 학습",
  project: "HW 프로젝트",
  circuitStarter: "회로 프로젝트 입문",
  applications: "지원 관리",
  skills: "역량 관리",
  interview: "면접 질문",
  review: "주간 회고",
  experience: "경험 보관함",
};
const navGroup: Partial<Record<View, View>> = {
  career: "careerHub",
  planner: "learningHub",
  study: "learningHub",
  project: "learningHub",
  circuitStarter: "learningHub",
  skills: "learningHub",
  review: "learningHub",
  applications: "recruitHub",
  interview: "recruitHub",
  experience: "journal",
};
const skillNames = [
  "Circuit Fundamentals",
  "Analog Circuit",
  "Power Circuit",
  "MCU Hardware",
  "CAN",
  "Automotive Protection",
  "KiCad / PCB",
];

export default function App() {
  const [view, setView] = useState<View>("dashboard"),
    [week, setWeek] = useState(() => {
      const elapsed = Math.floor(
        (Date.now() - new Date("2026-08-24T00:00:00+09:00").getTime()) /
          604800000,
      );
      return Math.min(20, Math.max(1, elapsed + 1));
    }),
    [menu, setMenu] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>(() =>
    JSON.parse(localStorage.getItem("ahw-done") || "{}"),
  );
  const [journal, setJournal] = useState(
    () => localStorage.getItem("ahw-journal") || "",
  );
  useEffect(
    () => localStorage.setItem("ahw-done", JSON.stringify(done)),
    [done],
  );
  useEffect(() => localStorage.setItem("ahw-journal", journal), [journal]);
  const current = weeks[week - 1],
    completed = Object.values(done).filter(Boolean).length,
    total = weeks.reduce((a, w) => a + w.tasks.length, 0),
    progress = Math.round((completed / total) * 100);
  const go = (v: View) => {
    setView(v);
    setMenu(false);
  };
  return (
    <div className="shell">
      <aside className={menu ? "side open" : "side"}>
        <button className="close" onClick={() => setMenu(false)}>
          <X />
        </button>
        <div className="logo">
          <span>AH</span>
          <b>
            AUTOMOTIVE<small>HW R&D PREP</small>
          </b>
        </div>
        <nav>
          {nav.map(([id, label, Icon]) => (
            <button
              key={id}
              className={view === id || navGroup[view] === id ? "active" : ""}
              onClick={() => go(id)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <footer>
          <small>현재 인턴</small>
          <b>한국알프스</b>
          <span>종료일 2026.12.31</span>
        </footer>
      </aside>
      <main className="content">
        <header>
          <button className="hamb" onClick={() => setMenu(true)}>
            <Menu />
          </button>
          <div>
            <small>2026년 취업 준비</small>
            <b>{nav.find((n) => n[0] === view)?.[1] || viewTitles[view]}</b>
          </div>
          <div className="deadline">
            <Target size={16} /> 최종 목표 <b>자동차 전장 HW R&D 취업</b>
          </div>
        </header>
        {view === "dashboard" && (
          <Dashboard
            current={current}
            done={done}
            progress={progress}
            go={go}
          />
        )}{" "}
        {view === "careerHub" && (
          <NavigationHub
            title="취업 준비"
            sub="목표 직무 전략과 준비 우선순위를 한곳에서 확인합니다."
            go={go}
            items={[
              [
                "career",
                "취업 전략",
                "영어·인적성·자소서·포트폴리오 준비 기준",
                Target,
              ],
              [
                "applications",
                "기업·직무 정보",
                "현대자동차·기아·현대모비스 비교와 공고 관리",
                BriefcaseBusiness,
              ],
            ]}
          />
        )}{" "}
        {view === "learningHub" && (
          <NavigationHub
            title="학습·프로젝트"
            sub="일정, 회로 입문, ECU 프로젝트와 역량 증거를 단계별로 관리합니다."
            go={go}
            items={[
              [
                "planner",
                "주간 일정",
                "출퇴근·헬스 일정을 반영한 일주일 학습 계획",
                BookOpen,
              ],
              [
                "study",
                "20주 학습",
                "회로 기초부터 PCB·측정까지 이어지는 커리큘럼",
                GraduationCap,
              ],
              [
                "circuitStarter",
                "회로 프로젝트 입문",
                "장비 구매·기초 실습·CAN·12V 전원 안내",
                Wrench,
              ],
              [
                "project",
                "CAN Sensor ECU",
                "요구사항부터 PCB와 디버깅까지 프로젝트 관리",
                FolderKanban,
              ],
              [
                "skills",
                "역량 관리",
                "지식·시뮬레이션·구현·측정·설명 증거",
                BarChart3,
              ],
              [
                "review",
                "주간 회고",
                "완료율과 미완료 작업을 다음 주 계획으로 연결",
                RotateCcw,
              ],
            ]}
          />
        )}{" "}
        {view === "recruitHub" && (
          <NavigationHub
            title="지원·면접"
            sub="지원 공고와 기술면접 답변을 함께 준비합니다."
            go={go}
            items={[
              [
                "applications",
                "지원 공고 관리",
                "공고·부서·근무지·마감일·지원 상태 저장",
                BriefcaseBusiness,
              ],
              [
                "interview",
                "면접 질문 보관함",
                "질문 수정과 실제 경험 기반 답변 메모",
                FileQuestion,
              ],
              [
                "journal",
                "경험·자소서 자료",
                "빠른 기록을 STAR 경험과 GPT 분석으로 전환",
                Sparkles,
              ],
            ]}
          />
        )}{" "}
        {view === "career" && <CareerStrategy />}{" "}
        {view === "planner" && <Planner />}{" "}
        {view === "study" && (
          <Study
            current={current}
            week={week}
            setWeek={setWeek}
            done={done}
            setDone={setDone}
          />
        )}{" "}
        {view === "project" && <Project go={go} />}{" "}
        {view === "circuitStarter" && (
          <CircuitStarter
            onSendToJournal={(text, date) => {
              setJournal(text);
              localStorage.setItem("ahw-journal-date", date);
              go("journal");
            }}
          />
        )}{" "}
        {view === "applications" && <Applications />}{" "}
        {view === "skills" && <Skills completed={completed} />}{" "}
        {view === "journal" && (
          <Journal value={journal} setValue={setJournal} go={go} />
        )}{" "}
        {view === "experience" && <Experience />}{" "}
        {view === "interview" && <Interview />}{" "}
        {view === "review" && <Review completed={completed} total={total} />}{" "}
        {view === "settings" && <SettingsPage />}
      </main>
      <nav className="bottom">
        {[
          ["dashboard", "홈", Home],
          ["learningHub", "학습", BookOpen],
          ["journal", "기록", Sparkles],
          ["recruitHub", "지원", BriefcaseBusiness],
          ["careerHub", "취업", Target],
        ].map(([id, label, Icon]: any) => (
          <button
            key={id}
            className={view === id || navGroup[view] === id ? "active" : ""}
            onClick={() => go(id)}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      {menu && <div className="scrim" onClick={() => setMenu(false)} />}
    </div>
  );
}
function NavigationHub({
  title,
  sub,
  items,
  go,
}: {
  title: string;
  sub: string;
  items: any[];
  go: (v: View) => void;
}) {
  return (
    <Page title={title} sub={sub}>
      <div className="navigation-hub">
        {items.map(([id, name, description, Icon]) => (
          <button key={id} onClick={() => go(id)}>
            <Icon />
            <span>
              <b>{name}</b>
              <small>{description}</small>
            </span>
            <i>열기 →</i>
          </button>
        ))}
      </div>
    </Page>
  );
}
function DailyAgenda({ go }: { go: (v: View) => void }) {
  const schedules = [
    {
      day: "일요일",
      focus: "마무리·재계획",
      events: [
        ["오전", "프로젝트 또는 미완료 핵심 범위"],
        ["오후", "헬스 1시간 30분"],
        ["저녁", "영어·인적성 및 주간 회고"],
      ],
    },
    {
      day: "월요일",
      focus: "회복·가벼운 복습",
      events: [
        ["출퇴근", "TOEIC Speaking·전장 용어"],
        ["19:00", "헬스와 저녁"],
        ["21:30", "이번 주 회로 개념 복습"],
      ],
    },
    {
      day: "화요일",
      focus: "회로·Simulation",
      events: [
        ["출퇴근", "영어·인적성"],
        ["20:00", "회로이론·전자회로"],
        ["21:00", "LTspice 실습"],
      ],
    },
    {
      day: "수요일",
      focus: "회복·정리",
      events: [
        ["출퇴근", "영어 Speaking"],
        ["19:00", "헬스와 저녁"],
        ["21:30", "Datasheet·기술노트 복습"],
      ],
    },
    {
      day: "목요일",
      focus: "HW 프로젝트 집중",
      events: [
        ["출퇴근", "영어·인적성"],
        ["20:00", "Automotive CAN Sensor ECU"],
        ["마무리", "실수·선택 근거 기록"],
      ],
    },
    {
      day: "금요일",
      focus: "휴식 우선",
      events: [
        ["출퇴근", "영어 Speaking"],
        ["19:00", "헬스와 저녁"],
        ["이후", "휴식 또는 20분 복습"],
      ],
    },
    {
      day: "토요일",
      focus: "주간 핵심 실습",
      events: [
        ["오전", "회로·HW 프로젝트 3~4시간"],
        ["오후", "영어 또는 인적성 1시간"],
        ["마무리", "프로젝트 과정 기록 20분"],
      ],
    },
  ];
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const dateKey = new Date(now.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 10);
  const schedule =
    now < new Date("2026-08-24T00:00:00+09:00")
      ? {
          day: "준비 주간",
          focus: "밀린 일 정리 대신 새 출발 준비",
          events: [
            ["20분", "학습 공간과 필요한 프로그램 점검"],
            ["20분", "다음 주 목표를 최대 3개로 정리"],
            ["나머지", "충분히 쉬고 월요일부터 시작"],
          ],
        }
      : schedules[now.getDay()];
  const defaultTasks = schedule.events.map((event, i) => ({
    id: `${dateKey}-${i}`,
    text: event[1],
    done: false,
  }));
  const [allTasks, setAllTasks] = useState<Record<string, any[]>>(() => {
    const saved = JSON.parse(
      localStorage.getItem("ahw-daily-checklists") || "{}",
    );
    return saved[dateKey] ? saved : { ...saved, [dateKey]: defaultTasks };
  });
  const [newTask, setNewTask] = useState("");
  const tasks = allTasks[dateKey] || [];
  useEffect(
    () =>
      localStorage.setItem("ahw-daily-checklists", JSON.stringify(allTasks)),
    [allTasks],
  );
  const setTasks = (next: any[]) =>
    setAllTasks((all) => ({ ...all, [dateKey]: next }));
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      { id: `${dateKey}-${Date.now()}`, text: newTask.trim(), done: false },
    ]);
    setNewTask("");
  };
  const completed = tasks.filter((task) => task.done).length;
  return (
    <section className="daily-overview">
      <article className="today-schedule">
        <div className="daily-heading">
          <div>
            <small>TODAY · {dateKey.replaceAll("-", ".")}</small>
            <h2>{schedule.day} 일정</h2>
          </div>
          <span>{schedule.focus}</span>
        </div>
        <div className="schedule-lines">
          {schedule.events.map((event) => (
            <p key={`${event[0]}-${event[1]}`}>
              <b>{event[0]}</b>
              <span>{event[1]}</span>
            </p>
          ))}
        </div>
        <button onClick={() => go("planner")}>전체 주간 일정 보기 →</button>
      </article>
      <article className="daily-checklist">
        <div className="daily-heading">
          <div>
            <small>DAILY CHECKLIST</small>
            <h2>오늘 해야 할 일</h2>
          </div>
          <strong>
            {completed}/{tasks.length}
          </strong>
        </div>
        <div className="daily-progress">
          <i
            style={{
              width: `${tasks.length ? Math.round((completed / tasks.length) * 100) : 0}%`,
            }}
          />
        </div>
        <div className="daily-tasks">
          {tasks.length ? (
            tasks.map((task) => (
              <label key={task.id}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() =>
                    setTasks(
                      tasks.map((x) =>
                        x.id === task.id ? { ...x, done: !x.done } : x,
                      ),
                    )
                  }
                />
                <i>{task.done && <Check />}</i>
                <span>{task.text}</span>
                <button
                  type="button"
                  aria-label={`${task.text} 삭제`}
                  onClick={(e) => {
                    e.preventDefault();
                    setTasks(tasks.filter((x) => x.id !== task.id));
                  }}
                >
                  <X />
                </button>
              </label>
            ))
          ) : (
            <p>오늘의 할 일을 직접 추가해보세요.</p>
          )}
        </div>
        <form onSubmit={addTask}>
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="오늘 할 일 추가"
          />
          <button type="submit">
            <Plus /> 추가
          </button>
        </form>
      </article>
    </section>
  );
}
function Dashboard({
  current,
  done,
  progress,
  go,
}: {
  current: Week;
  done: Record<string, boolean>;
  progress: number;
  go: (v: View) => void;
}) {
  const wp = Math.round(
    (current.tasks.filter((_, i) => done[`w${current.n}-${i}`]).length /
      current.tasks.length) *
      100,
  );
  const internshipD = Math.max(
    0,
    Math.ceil(
      (new Date("2026-12-31T23:59:59+09:00").getTime() - Date.now()) / 86400000,
    ),
  );
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">2026 NEW GRADUATE ROADMAP</p>
          <h1>
            AUTOMOTIVE
            <br />
            <em>HW R&D PREP</em>
          </h1>
          <p>이론을 아는 사람에서, 직접 설계하고 설명할 수 있는 엔지니어로.</p>
        </div>
        <aside className="target">
          <small>TARGET COMPANIES</small>
          {["01  현대자동차", "02  기아", "03  현대모비스"].map((x) => (
            <b key={x}>{x}</b>
          ))}
          <hr />
          <small>TARGET ROLE</small>
          <p>
            Automotive R&D · Electronic Hardware
            <br />
            Circuit Design · ECU Hardware
            <br />
            PCB / MCU / CAN
          </p>
        </aside>
      </section>
      <section className="metrics">
        <article>
          <small>CURRENT CURRICULUM</small>
          <strong>
            WEEK {current.n} <i>/ 20</i>
          </strong>
          <span>{current.title}</span>
          <span>{current.dates}</span>
        </article>
        <article>
          <small>WEEKLY COMPLETION</small>
          <strong>{wp}%</strong>
          <div className="bar">
            <i style={{ width: wp + "%" }} />
          </div>
        </article>
        <article>
          <small>HARDWARE PROJECT</small>
          <strong>{progress}%</strong>
          <span>CAN Sensor ECU</span>
        </article>
        <article>
          <small>INTERNSHIP D-DAY</small>
          <strong>D-{internshipD}</strong>
          <span>한국알프스 R&D</span>
        </article>
      </section>
      <section className="restart-banner">
        <div>
          <small>CURRICULUM RESTART</small>
          <b>2026년 8월 24일 월요일부터 WEEK 1 재시작</b>
        </div>
        <p>
          이번 주 미완료분은 누적하지 않습니다. 주말에는 환경 점검과 다음 주
          핵심 목표 3개만 준비하고, 20주 과정은 2027년 1월 10일까지 진행합니다.
        </p>
      </section>
      <DailyAgenda go={go} />
      <section className="dash">
        <article className="panel">
          <small>THIS WEEK · W{current.n}</small>
          <h2>{current.title}</h2>
          {current.tasks.slice(0, 3).map((t, i) => (
            <div className="goal" key={t}>
              <i>{i + 1}</i>
              <span>{t}</span>
              {done[`w${current.n}-${i}`] ? <Check /> : <Circle />}
            </div>
          ))}
          <button className="link" onClick={() => go("study")}>
            주간 학습 열기 →
          </button>
        </article>
        <article className="panel job-priorities">
          <small>JOB PREPARATION PRIORITY</small>
          <h2>지금 취업을 위해 먼저 확인할 것</h2>
          {[
            [
              "1",
              "직무 증거",
              "직접 설계·측정·디버깅한 결과물이 있는가?",
              "circuitStarter",
            ],
            [
              "2",
              "경험 정리",
              "인턴과 프로젝트에서 내가 직접 한 행동이 구분되는가?",
              "journal",
            ],
            [
              "3",
              "영어·인적성",
              "지원 시점까지 필요한 점수와 반복 학습 계획이 있는가?",
              "career",
            ],
            [
              "4",
              "기업·공고 분석",
              "현대자동차·기아·현대모비스의 직무 차이를 설명할 수 있는가?",
              "applications",
            ],
            [
              "5",
              "자소서·면접",
              "주장을 뒷받침할 수치와 실제 사례가 준비되어 있는가?",
              "interview",
            ],
          ].map(([rank, title, question, target]) => (
            <button key={rank} onClick={() => go(target as View)}>
              <i>{rank}</i>
              <span>
                <b>{title}</b>
                <small>{question}</small>
              </span>
              <em>점검 →</em>
            </button>
          ))}
        </article>
      </section>
    </>
  );
}
function Study({
  current,
  week,
  setWeek,
  done,
  setDone,
}: {
  current: Week;
  week: number;
  setWeek: (n: number) => void;
  done: Record<string, boolean>;
  setDone: (v: Record<string, boolean>) => void;
}) {
  return (
    <Page
      title="Weekly Study"
      sub="2026년 8월 24일부터 기초 → 실습 → 자동차 적용 → 설명 순서로 다시 시작합니다."
    >
      <article className="study-restart">
        <b>새 시작 원칙</b>
        <span>지난주 미완료 작업을 그대로 쌓지 않기</span>
        <span>WEEK 1부터 순서대로 진행</span>
        <span>평일 최대 2시간·주간 핵심 목표 최대 3개</span>
      </article>
      <div className="study">
        <div className="timeline">
          {weeks.map((w) => (
            <button
              key={w.n}
              className={week === w.n ? "selected" : ""}
              onClick={() => setWeek(w.n)}
            >
              <b>W{String(w.n).padStart(2, "0")}</b>
              <span>
                {w.title}
                <small>
                  {w.dates} · {w.phase}
                </small>
              </span>
            </button>
          ))}
        </div>
        <article className="week">
          <div className="weekhead">
            <div>
              <small>
                WEEK {String(week).padStart(2, "0")} · {current.dates}
              </small>
              <h2>{current.title}</h2>
              <b>{current.phase}</b>
            </div>
            <strong>
              {Math.round(
                (current.tasks.filter((_, i) => done[`w${week}-${i}`]).length /
                  current.tasks.length) *
                  100,
              )}
              %
            </strong>
          </div>
          <h3>STUDY & PRACTICE</h3>
          <div className="checks">
            {current.tasks.map((t, i) => {
              const id = `w${week}-${i}`;
              return (
                <label key={id}>
                  <input
                    type="checkbox"
                    checked={!!done[id]}
                    onChange={() => setDone({ ...done, [id]: !done[id] })}
                  />
                  <i>{done[id] && <Check />}</i>
                  <span>{t}</span>
                </label>
              );
            })}
          </div>
          <div className="deliver">
            <small>WEEKLY DELIVERABLE</small>
            {current.deliverables.map((x) => (
              <b key={x}>↗ {x}</b>
            ))}
          </div>
          <div className="question">
            <FileQuestion />
            <div>
              <small>INTERVIEW QUESTION</small>
              <b>{current.question}</b>
            </div>
          </div>
        </article>
      </div>
    </Page>
  );
}
function Applications() {
  const profiles = [
    {
      company: "현대자동차",
      priority: "1순위",
      place:
        "주요 R&D 거점: 남양연구소(경기 화성), 의왕연구소, 마북연구소 및 공고별 근무지",
      intro:
        "완성차 관점에서 차량 전체 시스템을 개발하고 통합합니다. 같은 전자개발이어도 차량제어, 바디·편의, 샤시, 전동화, 인포테인먼트 등 담당 시스템에 따라 업무가 달라집니다.",
      roles: [
        [
          "차량 전자·제어기 HW",
          "ECU 요구사항, 회로·인터페이스 설계, 부품 선정, 시험·검증과 차량 통합",
        ],
        [
          "차량시스템개발",
          "전동화·샤시·바디 시스템 개발과 통합, 성능 최적화 및 품질 완성",
        ],
        ["전자개발", "차량 통신·편의 시스템 등 전자 기술 개발과 검증"],
      ],
      skills: [
        "회로이론·아날로그/디지털 회로",
        "MCU와 차량 통신 CAN/LIN",
        "전원·보호회로 및 EMC/ESD",
        "측정·Debugging과 시스템 통합",
        "협업·요구사항 분석",
      ],
    },
    {
      company: "현대모비스",
      priority: "3순위",
      place:
        "주요 관련 거점: 마북연구소(경기 용인), 의왕연구소, 강남연구소 및 공고별 근무지",
      intro:
        "자동차 부품과 모빌리티 솔루션을 개발합니다. 전장BU는 자율주행·IVI 등 전자부품의 연구개발부터 시험평가·생산·납품까지 담당하며, BU와 세부 직무에 따라 제품이 달라집니다.",
      roles: [
        [
          "전장BU HW 회로",
          "IVI·ADAS·Cluster·차량제어기 등의 디지털/인터페이스 회로 설계와 검증",
        ],
        [
          "샤시안전BU HW/평가",
          "제동·조향·현가·에어백 관련 제어기 또는 전장품 설계·평가",
        ],
        [
          "전동화/모듈BU",
          "구동·전력변환·배터리 시스템과 모듈 연구개발·시험평가",
        ],
      ],
      skills: [
        "회로 설계와 성능 최적화",
        "Datasheet·정격·신뢰성 검토",
        "CAN/LIN 및 인터페이스 회로",
        "EMC/ESD·환경 신뢰성 시험",
        "양산·원가·품질 관점",
      ],
    },
    {
      company: "기아",
      priority: "2순위",
      place:
        "본사: 서울 / 주요 통합 R&D: 남양연구소(경기 화성), 환경기술연구소(용인) 및 공고별 근무지",
      intro:
        "완성차 및 PBV 등 모빌리티 제품을 개발합니다. 현대차·기아 통합 R&D 거점을 활용하며, 직무는 차량 시스템·제어·시험·전자개발 등 공고와 조직에 따라 구체 업무가 달라집니다.",
      roles: [
        [
          "차량 제어·전자 HW",
          "차량 기능 요구사항을 제어기·센서·통신·전원 관점에서 설계하고 검증",
        ],
        ["차량시스템 R&D", "차량 단위 시스템 통합, 성능 개발과 문제 분석"],
        [
          "PBV·전동화 관련 R&D",
          "목적기반 모빌리티와 전동화 시스템의 HW·SW·서비스 통합",
        ],
      ],
      skills: [
        "차량 시스템과 ECU 이해",
        "회로·MCU·CAN 기반 HW",
        "검증·측정·고장 분석",
        "전동화·전원·보호 기초",
        "직무 간 협업과 문제해결",
      ],
    },
  ];
  const sortedProfiles = [...profiles].sort(
    (a, b) =>
      ["현대자동차", "기아", "현대모비스"].indexOf(a.company) -
      ["현대자동차", "기아", "현대모비스"].indexOf(b.company),
  );
  const [apps, setApps] = useState<any[]>(() =>
    JSON.parse(localStorage.getItem("ahw-apps") || "[]"),
  );
  const [open, setOpen] = useState("");
  const [formCompany, setFormCompany] = useState("현대자동차");
  const save = (e: any) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const item = {
      id: Date.now(),
      company: String(f.get("company")),
      title: String(f.get("title")),
      role: String(f.get("role")),
      department: String(f.get("department")),
      location: String(f.get("location")),
      deadline: String(f.get("deadline")),
      url: String(f.get("url")),
      status: String(f.get("status")),
      memo: String(f.get("memo")),
    };
    const v = [...apps, item];
    setApps(v);
    localStorage.setItem("ahw-apps", JSON.stringify(v));
    e.currentTarget.reset();
    setFormCompany(item.company);
  };
  const remove = (id: number) => {
    const v = apps.filter((a) => a.id !== id);
    setApps(v);
    localStorage.setItem("ahw-apps", JSON.stringify(v));
  };
  return (
    <Page
      title="지원 공고 관리"
      sub="직접 찾은 공고를 저장하고, 회사·부서·직무별 차이와 필요한 역량을 함께 비교합니다."
    >
      <div className="companies">
        {sortedProfiles.map((p, i) => (
          <article
            className={
              open === p.company ? "company-card open" : "company-card"
            }
            key={p.company}
          >
            <small>{p.priority}</small>
            <h2>{p.company}</h2>
            <p>{p.intro}</p>
            <div className="company-actions">
              <button onClick={() => setFormCompany(p.company)}>
                <Plus /> 이 회사 공고 입력
              </button>
              <button
                className="outline"
                onClick={() => setOpen(open === p.company ? "" : p.company)}
              >
                {open === p.company ? "정보 접기" : "회사·직무 정보"}
              </button>
            </div>
            {open === p.company && (
              <div className="company-detail">
                <h3>회사와 근무지</h3>
                <p>{p.place}</p>
                <h3>관심 직무별 업무 차이</h3>
                {p.roles.map((r) => (
                  <div className="role-info" key={r[0]}>
                    <b>{r[0]}</b>
                    <span>{r[1]}</span>
                  </div>
                ))}
                <h3>공통적으로 필요한 역량</h3>
                <ul>
                  {p.skills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <small>
                  실제 업무·근무지는 채용공고의 조직과 직무기술서를 반드시 우선
                  확인하세요.
                </small>
              </div>
            )}
          </article>
        ))}
      </div>
      <article className="panel posting-form">
        <div>
          <small>새 채용공고</small>
          <h2>찾은 공고 저장하기</h2>
        </div>
        <form onSubmit={save}>
          <label>
            회사
            <select
              name="company"
              value={formCompany}
              onChange={(e) => setFormCompany(e.target.value)}
            >
              {sortedProfiles.map((p) => (
                <option key={p.company}>{p.company}</option>
              ))}
            </select>
          </label>
          <label className="wide">
            공고명
            <input
              name="title"
              required
              placeholder="예: 2027 상반기 연구개발 신입채용"
            />
          </label>
          <label>
            목표 직무
            <input
              name="role"
              required
              placeholder="예: 디지털/인터페이스 회로설계"
            />
          </label>
          <label>
            부서·사업부
            <input name="department" placeholder="예: 전장BU HW 회로" />
          </label>
          <label>
            근무지
            <input name="location" placeholder="예: 남양연구소" />
          </label>
          <label>
            마감일
            <input name="deadline" type="date" />
          </label>
          <label className="wide">
            공고 링크
            <input name="url" type="url" placeholder="https://..." />
          </label>
          <label>
            지원 상태
            <select name="status">
              <option>관심 공고</option>
              <option>지원 준비</option>
              <option>서류 제출</option>
              <option>인적성</option>
              <option>면접</option>
              <option>최종 결과</option>
            </select>
          </label>
          <label className="wide">
            메모
            <textarea
              name="memo"
              placeholder="필요 역량, 자소서 문항, 부족한 점"
            />
          </label>
          <button className="save-posting">
            <Save /> 공고 저장
          </button>
        </form>
      </article>
      <article className="panel saved-postings">
        <h2>저장한 채용공고</h2>
        {apps.length ? (
          apps.map((a) => (
            <div className="posting" key={a.id}>
              <div>
                <small>
                  {a.company} · {a.department || "부서 미입력"}
                </small>
                <h3>{a.title || a.role}</h3>
                <p>
                  {a.role} · {a.location || "근무지 미정"} · 마감{" "}
                  {a.deadline || "미정"}
                </p>
                {a.memo && <p>{a.memo}</p>}
              </div>
              <div>
                <em>{a.status}</em>
                {a.url && (
                  <a href={a.url} target="_blank" rel="noreferrer">
                    공고 열기
                  </a>
                )}
                <button onClick={() => remove(a.id)}>삭제</button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty">
            아직 저장한 채용공고가 없습니다. 위 입력란에 찾은 공고를 저장하세요.
          </p>
        )}
      </article>
    </Page>
  );
}
function Skills({ completed }: { completed: number }) {
  return (
    <Page
      title="Engineering Skills"
      sub="체크 하나로 숙련도가 완성되지 않습니다. 다섯 축으로 증거를 쌓습니다."
    >
      <div className="skills">
        {skillNames.map((s, i) => (
          <article key={s}>
            <h2>{s}</h2>
            {[
              "Knowledge",
              "Simulation",
              "Implementation",
              "Measurement",
              "Can Explain",
            ].map((x, j) => {
              const v = Math.min(
                90,
                Math.max(0, completed * 2 + i * 3 - j * 8),
              );
              return (
                <div className="skill" key={x}>
                  <span>{x}</span>
                  <div className="bar">
                    <i style={{ width: v + "%" }} />
                  </div>
                  <b>{v}%</b>
                </div>
              );
            })}
          </article>
        ))}
      </div>
    </Page>
  );
}
function Journal({
  value,
  setValue,
}: {
  value: string;
  setValue: (v: string) => void;
  go: (v: View) => void;
}) {
  const today = () => {
    const d = new Date(),
      offset = d.getTimezoneOffset();
    return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
  };
  const [date, setDate] = useState(
    () => localStorage.getItem("ahw-journal-date") || today(),
  );
  const [result, setResult] = useState<any>(null);
  const [gptAnswer, setGptAnswer] = useState("");
  const [revision, setRevision] = useState(0);
  const [saved, setSaved] = useState(false);
  useEffect(() => localStorage.setItem("ahw-journal-date", date), [date]);
  const formatDate = (v: string) => {
    const [y, m, d] = v.split("-");
    return `${y}. ${Number(m)}. ${Number(d)}.`;
  };
  const analyze = () => {
    if (!value.trim()) return;
    setSaved(false);
    const short = value.trim().slice(0, 110);
    setResult({
      summary: `업무 기록: ${short}${value.length > 110 ? "…" : ""}`,
      situation: "한국알프스 R&D 회로설계기술팀 인턴 업무 중 관찰·시험한 상황",
      action: "기록에 나타난 비교, 확인, 측정 또는 관계자 논의 활동",
      lesson:
        "확인된 사실과 추정 원인을 구분하고 Reliability·Performance·Cost를 함께 검토해야 함",
      missing:
        "측정 조건, 본인이 직접 수행한 범위, 비교 결과와 후속 결정의 근거",
    });
  };
  const gptPrompt = `다음은 ${formatDate(date)}에 직접 수행한 경험 기록이야. 자동차 전장 HW R&D 직무(1순위 현대자동차·2순위 기아·3순위 현대모비스) 자소서에 활용하려고 해.\n\n[원문 기록]\n${value}\n\n다음 기준으로 분석해줘.\n1. 사실을 과장하거나 없던 행동을 만들지 말 것\n2. 상황(S)·과제(T)·행동(A)·결과(R)로 구분할 것\n3. 내가 직접 한 행동, 사용한 장비·기술, 판단 근거를 찾아줄 것\n4. 부족한 수치나 확인해야 할 사실은 질문으로 남길 것\n5. 자소서에서 유리한 역량과 적합한 문항을 추천할 것\n6. 700자 자소서 초안을 작성할 것`;
  const copyPrompt = async () => {
    if (!value.trim()) return;
    await navigator.clipboard.writeText(gptPrompt);
    alert("GPT 질문이 복사되었습니다. ChatGPT에 붙여 넣어 질문하세요.");
  };
  const save = () => {
    if (!result) return;
    const old = JSON.parse(localStorage.getItem("ahw-experiences") || "[]");
    localStorage.setItem(
      "ahw-experiences",
      JSON.stringify([
        ...old,
        {
          id: Date.now(),
          date,
          title: `${formatDate(date)} 업무 경험`,
          source: value,
          gptPrompt,
          gptAnswer,
          ...result,
        },
      ]),
    );
    setRevision((v) => v + 1);
    setSaved(true);
    setResult(null);
    setGptAnswer("");
    setValue("");
  };
  return (
    <Page
      title="빠른 기록·경험 보관함"
      sub="날짜별 원문부터 GPT 분석, 자소서 활용 자료와 저장된 경험까지 한곳에서 관리합니다."
    >
      <article className="security">
        회사 기밀정보, 실제 제품명·고객사·비공개 회로도·부품번호·내부 측정
        데이터는 기록하지 마세요.
      </article>
      <article className="panel journal">
        <div className="journal-date">
          <label htmlFor="journal-date">기록 날짜</label>
          <input
            id="journal-date"
            type="date"
            value={date}
            max={today()}
            onChange={(e) => setDate(e.target.value)}
          />
          <small>
            과거에 했던 활동도 해당 날짜를 선택해 기록할 수 있습니다.
          </small>
        </div>
        <div className="prompts">
          {[
            "그날 한 업무",
            "문제와 확인 방법",
            "사용 장비",
            "선배에게 배운 것",
            "결과와 다음 행동",
          ].map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
        <textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setResult(null);
          }}
          placeholder={
            "선택한 날짜에 어떤 일을 했나요?\n문제가 있었다면 무엇이었고 어떻게 확인했나요?\n선배나 설계자에게 무엇을 배웠나요?"
          }
        />
        <div className="journal-flow">
          <b>정리 순서</b>
          <span>
            ① 원문 작성 → ② GPT 질문 복사 → ③ 답변 붙여넣기 → ④ 분석·저장
          </span>
        </div>
        <section className="gpt-workspace">
          <div>
            <small>GPT에게 물어볼 질문</small>
            <p>
              현재 기록을 STAR 구조, 직무 역량, 보완 질문과 700자 자소서
              초안으로 요청합니다.
            </p>
            <button type="button" onClick={copyPrompt} disabled={!value.trim()}>
              GPT 질문 복사
            </button>
          </div>
          <label>
            <b>GPT 답변 붙여넣기</b>
            <textarea
              value={gptAnswer}
              onChange={(e) => setGptAnswer(e.target.value)}
              placeholder="ChatGPT에서 받은 STAR 분석과 자소서 초안을 여기에 붙여 넣으세요. 경험과 함께 저장됩니다."
            />
          </label>
        </section>
        <div className="actions">
          <small>작성 중인 내용과 날짜는 자동 저장됩니다.</small>
          <button onClick={analyze}>
            <Sparkles /> 취업 경험으로 분석
          </button>
        </div>
      </article>
      {result && (
        <article className="analysis panel">
          <small>
            선택 날짜 · {formatDate(date)} / 실제로 하지 않은 행동은 생성하지
            않습니다
          </small>
          <h2>Technical Summary</h2>
          <p>{result.summary}</p>
          <div className="analysis-grid">
            <div>
              <b>Situation</b>
              <p>{result.situation}</p>
            </div>
            <div>
              <b>Action</b>
              <p>{result.action}</p>
            </div>
            <div>
              <b>Lesson / Engineering Insight</b>
              <p>{result.lesson}</p>
            </div>
            <div>
              <b>Missing Information</b>
              <p>{result.missing}</p>
            </div>
          </div>
          <button onClick={save}>
            <Save /> 경험 보관함에 저장
          </button>
        </article>
      )}
      {saved && (
        <div className="save-notice">
          경험이 저장되었습니다. 아래 목록에서 바로 확인할 수 있습니다.
        </div>
      )}
      <section className="bank-section">
        <div className="section-heading">
          <small>EXPERIENCE BANK</small>
          <h2>저장된 경험과 자소서 활용법</h2>
          <p>
            카드를 눌러 STAR 구조, 추천 문항과 저장한 GPT 답변을 확인하세요.
          </p>
        </div>
        <Experience key={revision} embedded />
      </section>
    </Page>
  );
}
function Interview() {
  const defaults = useMemo(
    () =>
      weeks.map((w) => ({
        week: w.n,
        title: w.title,
        q: w.question,
        answer: "",
      })),
    [],
  );
  const [qs, setQs] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("ahw-interview") || "[]");
    return defaults.map((item) => ({
      ...item,
      ...(saved.find((x: any) => x.week === item.week) || {}),
    }));
  });
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<any>(null);
  const startEdit = (item: any) => {
    setEditing(item.week);
    setDraft({ ...item });
  };
  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = qs.map((item) => (item.week === draft.week ? draft : item));
    setQs(updated);
    localStorage.setItem("ahw-interview", JSON.stringify(updated));
    setEditing(null);
    setDraft(null);
  };
  return (
    <Page
      title="면접 질문 보관함"
      sub="질문을 내 지원 직무에 맞게 수정하고, 실제 경험에 근거한 답변을 준비합니다."
    >
      <div className="questions">
        {qs.map((x) => (
          <article className="interview-card" key={x.week}>
            <b>W{x.week}</b>
            <div>
              <small>{x.title}</small>
              <h2>{x.q}</h2>
              {x.answer ? (
                <p className="answer-preview">{x.answer}</p>
              ) : (
                <p>문제–가설–측정–결과 구조로 답변을 준비하세요.</p>
              )}
            </div>
            <button
              className="interview-edit-button"
              onClick={() => startEdit(x)}
            >
              수정
            </button>
            {editing === x.week && draft && (
              <form className="interview-edit" onSubmit={saveEdit}>
                <label>
                  학습 주제
                  <input
                    value={draft.title}
                    onChange={(e) =>
                      setDraft({ ...draft, title: e.target.value })
                    }
                  />
                </label>
                <label>
                  면접 질문
                  <textarea
                    required
                    value={draft.q}
                    onChange={(e) => setDraft({ ...draft, q: e.target.value })}
                  />
                </label>
                <label>
                  내 답변 메모
                  <textarea
                    value={draft.answer}
                    onChange={(e) =>
                      setDraft({ ...draft, answer: e.target.value })
                    }
                    placeholder="실제 상황 → 문제와 가설 → 직접 한 행동 → 측정 결과 → 배운 점"
                  />
                </label>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(null);
                      setDraft(null);
                    }}
                  >
                    취소
                  </button>
                  <button type="submit">
                    <Save /> 수정 내용 저장
                  </button>
                </div>
              </form>
            )}
          </article>
        ))}
      </div>
    </Page>
  );
}
function Project({ go }: { go: (v: View) => void }) {
  const stages = [
    "Requirements",
    "Block Diagram",
    "Component Selection",
    "LTspice Simulation",
    "Schematic",
    "PCB Layout",
    "PCB Order",
    "Assembly",
    "Bring-up",
    "Measurement",
    "Debugging",
    "Improvement",
    "Portfolio Documentation",
  ];
  const [done, setDone] = useState<Record<string, boolean>>(() =>
    JSON.parse(localStorage.getItem("ahw-project") || "{}"),
  );
  const toggle = (s: string) => {
    const v = { ...done, [s]: !done[s] };
    setDone(v);
    localStorage.setItem("ahw-project", JSON.stringify(v));
  };
  const p = Math.round(
    (stages.filter((s) => done[s]).length / stages.length) * 100,
  );
  return (
    <Page
      title="Automotive CAN Sensor ECU"
      sub="자동차 전장 HW 회로설계 지원을 위한 실물 포트폴리오 프로젝트입니다."
    >
      <div className="architecture">
        <span>12V Input</span>
        <i>→</i>
        <span>Input Protection</span>
        <i>→</i>
        <span>DC-DC / LDO</span>
        <i>→</i>
        <span>MCU</span>
        <i>→</i>
        <span>CAN Transceiver</span>
        <i>→</i>
        <span>CAN Bus</span>
      </div>
      <article className="panel project">
        <div className="project-head">
          <div>
            <small>PROJECT PROGRESS</small>
            <h2>Version 1 → Measurement & Improvement</h2>
          </div>
          <strong>{p}%</strong>
        </div>
        {stages.map((s, i) => (
          <label key={s}>
            <input
              type="checkbox"
              checked={!!done[s]}
              onChange={() => toggle(s)}
            />
            <i>{done[s] ? <Check /> : i + 1}</i>
            <span>
              <b>{s}</b>
              <small>
                {
                  [
                    "요구사항과 완료 기준 정의",
                    "전체 시스템 Block 연결",
                    "정격·원가·대안 비교",
                    "전원·보호회로 검증",
                    "KiCad 전체 회로도",
                    "Placement·Ground·CAN Routing",
                    "Gerber·BOM 제작",
                    "납땜 및 육안검사",
                    "전류 제한 후 전원 인가",
                    "Oscilloscope·Multimeter 측정",
                    "가설→측정→수정→재시험",
                    "설계 개선점 정리",
                    "지원용 Portfolio 완성",
                  ][i]
                }
              </small>
            </span>
          </label>
        ))}
      </article>
      <button className="starter-link" onClick={() => go("circuitStarter")}>
        장비가 없고 회로가 처음이라면 · 회로 프로젝트 입문 열기 →
      </button>
    </Page>
  );
}
function Experience({ embedded = false }: { embedded?: boolean }) {
  const [items, setItems] = useState<any[]>(() =>
    JSON.parse(localStorage.getItem("ahw-experiences") || "[]"),
  );
  const [open, setOpen] = useState<number | string>("");
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<any>(null);
  const startEdit = (x: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(x.id);
    setEditing(x.id);
    setDraft({ ...x });
  };
  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(null);
    setDraft(null);
  };
  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const savedItems = JSON.parse(
      localStorage.getItem("ahw-experiences") || "[]",
    ).map((item: any) => (item.id === draft.id ? draft : item));
    localStorage.setItem("ahw-experiences", JSON.stringify(savedItems));
    setItems((current) =>
      current.map((item) => (item.id === draft.id ? draft : item)),
    );
    setEditing(null);
    setDraft(null);
  };
  return (
    <>
      {!embedded && (
        <div className="section-heading">
          <h1>경험 보관함</h1>
          <p>카드를 눌러 자소서 활용법과 STAR 작성 구조를 확인하세요.</p>
        </div>
      )}
      <div className="experience-list">
        {!items.length && (
          <div className="experience-empty">
            <Sparkles />
            <b>아직 직접 저장한 경험이 없습니다.</b>
            <span>
              위 빠른 기록에 실제로 한 일을 작성하고 분석한 뒤 저장하면 여기에
              표시됩니다.
            </span>
          </div>
        )}
        {items.map((x: any) => (
          <article
            className={
              open === x.id
                ? "panel experience-card open"
                : "panel experience-card"
            }
            key={x.id}
            onClick={() => setOpen(open === x.id ? "" : x.id)}
          >
            <div className="experience-summary">
              <div>
                <small>{x.category || "업무 기록에서 저장한 경험"}</small>
                <h2>{x.title}</h2>
                <p>{x.summary}</p>
              </div>
              <div className="experience-actions">
                {x.source && (
                  <button type="button" onClick={(e) => startEdit(x, e)}>
                    수정
                  </button>
                )}
                <b>{open === x.id ? "접기 −" : "활용법 보기 +"}</b>
              </div>
            </div>
            {open === x.id && (
              <div className="experience-detail">
                {editing === x.id && draft && (
                  <form
                    className="experience-edit"
                    onSubmit={saveEdit}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="edit-heading">
                      <div>
                        <small>SAVED EXPERIENCE EDIT</small>
                        <h3>저장한 경험 수정</h3>
                      </div>
                      <span>수정 내용은 이 기기에 자동 반영됩니다.</span>
                    </div>
                    <div className="edit-grid">
                      <label>
                        기록 날짜
                        <input
                          type="date"
                          value={draft.date || ""}
                          onChange={(e) =>
                            setDraft({ ...draft, date: e.target.value })
                          }
                        />
                      </label>
                      <label>
                        경험 제목
                        <input
                          required
                          value={draft.title || ""}
                          onChange={(e) =>
                            setDraft({ ...draft, title: e.target.value })
                          }
                        />
                      </label>
                      <label className="wide">
                        요약
                        <textarea
                          value={draft.summary || ""}
                          onChange={(e) =>
                            setDraft({ ...draft, summary: e.target.value })
                          }
                        />
                      </label>
                      <label className="wide">
                        내가 기록한 원문
                        <textarea
                          required
                          value={draft.source || ""}
                          onChange={(e) =>
                            setDraft({ ...draft, source: e.target.value })
                          }
                        />
                      </label>
                      <label className="wide">
                        GPT 분석·자소서 초안
                        <textarea
                          value={draft.gptAnswer || ""}
                          onChange={(e) =>
                            setDraft({ ...draft, gptAnswer: e.target.value })
                          }
                        />
                      </label>
                    </div>
                    <div className="edit-buttons">
                      <button
                        type="button"
                        className="cancel"
                        onClick={cancelEdit}
                      >
                        취소
                      </button>
                      <button type="submit">
                        <Save /> 수정 내용 저장
                      </button>
                    </div>
                  </form>
                )}
                <div className="advantage-box">
                  <small>자소서에서 유리한 이유</small>
                  <p>
                    {x.advantage ||
                      "실제 본인이 수행한 행동과 배운 점을 구체화하면 직무 경험 소재로 활용할 수 있습니다."}
                  </p>
                </div>
                <h3>추천 자소서 문항</h3>
                <div className="question-tags">
                  {(
                    x.questions || [
                      "직무 역량을 키운 경험",
                      "문제를 해결한 경험",
                    ]
                  ).map((q: string) => (
                    <span key={q}>{q}</span>
                  ))}
                </div>
                <h3>STAR 작성 순서</h3>
                <ol>
                  {(
                    x.guide || [
                      "상황을 짧게 설명",
                      "본인의 과제와 역할 구분",
                      "직접 한 행동을 구체화",
                      "결과와 근거 기록",
                      "직무 관점의 배움 연결",
                    ]
                  ).map((g: string) => (
                    <li key={g}>{g}</li>
                  ))}
                </ol>
                <div className="caution">
                  <b>표현할 때 주의</b>
                  <br />
                  {x.missing}
                </div>
                {x.source && (
                  <div className="saved-material">
                    <h3>내가 기록한 원문</h3>
                    <p>{x.source}</p>
                  </div>
                )}
                {x.gptAnswer && (
                  <div className="saved-material gpt-answer">
                    <h3>GPT 분석·자소서 초안</h3>
                    <p>{x.gptAnswer}</p>
                  </div>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
function Review({ completed, total }: { completed: number; total: number }) {
  const rate = Math.round((completed / total) * 100);
  const [text, setText] = useState(
    () => localStorage.getItem("ahw-review") || "",
  );
  useEffect(() => localStorage.setItem("ahw-review", text), [text]);
  return (
    <Page
      title="Weekly Review"
      sub="일요일 30분, 밀린 일을 자동으로 쌓지 말고 다음 주를 다시 설계합니다."
    >
      <div className="review-grid">
        <article className="panel score">
          <small>WEEKLY COMPLETION</small>
          <strong>{rate}%</strong>
          <div className="bar">
            <i style={{ width: rate + "%" }} />
          </div>
          <p>
            {completed}개 완료 · {total - completed}개 남음
          </p>
        </article>
        <article className="panel">
          <h2>미완료 Task 처리</h2>
          <div className="review-options">
            {[
              "Carry Over",
              "Skip",
              "Reduce Scope",
              "Reschedule",
              "Completed Elsewhere",
            ].map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        </article>
      </div>
      <article className="panel review-note">
        <h2>이번 주 회고</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            "잘한 점\n못한 점과 이유\n다음 주 개선사항\n다음 주 가장 중요한 목표 3개"
          }
        />
        <small>자동 저장됨</small>
      </article>
    </Page>
  );
}
function SettingsPage() {
  const exportData = () => {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith("ahw-")) data[k] = localStorage.getItem(k) || "";
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `automotive-hw-prep-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const importData = (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = JSON.parse(String(reader.result));
        Object.entries(d).forEach(([k, v]) => {
          if (k.startsWith("ahw-") && typeof v === "string")
            localStorage.setItem(k, v);
        });
        location.reload();
      } catch {
        alert("올바른 백업 파일이 아닙니다.");
      }
    };
    reader.readAsText(f);
  };
  return (
    <Page
      title="Settings & Backup"
      sub="기기의 데이터를 JSON으로 백업하고 다시 복원할 수 있습니다."
    >
      <div className="settings-grid">
        <article className="panel">
          <Download />
          <h2>전체 데이터 내보내기</h2>
          <p>
            학습, 프로젝트, 일기, 경험, 지원 데이터를 하나의 JSON 파일로
            저장합니다.
          </p>
          <button onClick={exportData}>백업 파일 다운로드</button>
        </article>
        <article className="panel">
          <Upload />
          <h2>데이터 가져오기</h2>
          <p>이 앱에서 내보낸 JSON 파일로 현재 데이터를 복원합니다.</p>
          <label className="upload">
            백업 파일 선택
            <input
              type="file"
              accept="application/json"
              onChange={importData}
            />
          </label>
        </article>
      </div>
      <article className="panel sync">
        <h2>PC ↔ 모바일 데이터</h2>
        <p>
          현재 MVP는 기기별 LocalStorage를 사용합니다. 다른 기기에는 JSON 백업을
          가져와 복원하세요. 실시간 동기화는 다음 단계에서 인증과 Supabase
          저장소를 연결하도록 데이터 계층을 분리합니다.
        </p>
      </article>
    </Page>
  );
}
function CareerStrategy() {
  const sections = [
    {
      title: "1. 직무 핵심 준비",
      tag: "최우선",
      items: [
        "회로도를 Block 단위로 읽고 입력·출력·부품 역할 설명",
        "Datasheet 근거로 정격·부품값·대안·원가 비교",
        "LTspice Simulation → KiCad 회로도 → PCB Layout 경험",
        "Multimeter·Oscilloscope·Power Supply 측정 경험",
        "CAN Transceiver, ECU 전원, ESD/EMC 보호회로 이해",
      ],
      proof:
        "CAN Sensor ECU 프로젝트의 계산서·Simulation·회로도·PCB·측정·Debugging 기록",
    },
    {
      title: "2. 영어",
      tag: "병행",
      items: [
        "현재 TOEIC 430 / TOEIC Speaking 90을 기준으로 Speaking 우선",
        "통근시간에 표현·답변 구조·발음 연습",
        "주 1회 모의시험으로 약점과 점수 기록",
        "지원 공고에서 요구하는 유효기간과 기준 점수 확인",
        "Datasheet 핵심 문장을 읽고 기술 내용을 한국어로 설명",
      ],
      proof: "실제 시험 성적, 주간 Speaking 기록, Datasheet 요약 노트",
    },
    {
      title: "3. 인적성",
      tag: "유지",
      items: [
        "주 2~3회 통근시간에 짧게 문제 풀이",
        "오답은 계산·자료해석·추리 등 유형별 분류",
        "주말에 시간 제한 모의 세트",
        "HW 프로젝트 시간을 침범하지 않도록 학습량 제한",
      ],
      proof: "모의검사 점수 추이, 유형별 오답률과 개선 기록",
    },
    {
      title: "4. 자소서",
      tag: "경험 중심",
      items: [
        "직무 지원동기: 자동차 전장 HW를 선택한 계기와 준비 과정",
        "직무 역량: CAN Sensor ECU를 직접 설계·검증한 과정",
        "문제해결: 인턴 ESD 평가에서 비교시험·조건 변경·검토한 경험",
        "협업: 설계자와 시험 결과 및 Cost 영향을 논의한 경험",
        "성장: 부족한 실무 회로설계 역량을 20주 동안 결과물로 보완",
      ],
      proof: "상황–과제–행동–결과–배움이 구분된 Experience Bank",
    },
    {
      title: "5. 면접·포트폴리오",
      tag: "설명 가능",
      items: [
        "왜 이 부품과 정격을 선택했는가",
        "회로 문제가 생겼을 때 어떤 가설과 측정을 했는가",
        "CAN 120Ω Termination과 Differential Signal 설명",
        "ESD 시험 경험에서 확인한 사실과 추정을 구분",
        "성능·신뢰성·원가가 충돌할 때 판단 기준 설명",
      ],
      proof: "3분 프로젝트 설명, Block Diagram, 측정 파형, 실패와 개선 내용",
    },
  ];
  return (
    <Page
      title="취업 준비 전략"
      sub="현대자동차·기아·현대모비스 자동차 전장 HW/회로설계 지원을 위해 무엇을 준비하고 어떤 증거를 남길지 정리했습니다."
    >
      <div className="priority-banner">
        <b>준비 우선순위</b>
        <span>① HW 프로젝트·회로설계</span>
        <i>→</i>
        <span>② 인턴 경험 기술화</span>
        <i>→</i>
        <span>③ 영어</span>
        <i>→</i>
        <span>④ 인적성·자소서·면접</span>
      </div>
      <div className="strategy-grid">
        {sections.map((s) => (
          <article className="panel" key={s.title}>
            <div className="strategy-head">
              <h2>{s.title}</h2>
              <span>{s.tag}</span>
            </div>
            <ul>
              {s.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <div className="evidence">
              <small>남겨야 할 증거</small>
              <b>{s.proof}</b>
            </div>
          </article>
        ))}
      </div>
      <article className="panel advantage">
        <small>자소서에서 특히 유리한 점</small>
        <h2>“수업에서 배웠다”가 아니라 “직접 확인하고 판단했다”는 경험</h2>
        <div>
          <p>
            <b>한국알프스 인턴</b> 자동차 전장제품 평가, 회로도 분석,
            ESD·측정장비 경험은 직무 연관성이 높습니다. 단, 보조한 일과 직접
            수행한 일을 정확히 구분해야 합니다.
          </p>
          <p>
            <b>ESD Capacitor 사례</b> 비교시험, 조건 변경, 설계자 논의, Cost
            때문에 변경을 보류한 과정은 문제해결과 엔지니어링 판단을 함께
            보여줍니다. 용량 증가가 원인 해결이라고 단정하지 않는 태도도
            강점입니다.
          </p>
          <p>
            <b>CAN Sensor ECU</b> 부족한 PCB·Simulation 역량을 스스로 파악하고
            요구사항부터 측정·Debugging까지 완주하면 가장 강한 직무 증거가
            됩니다.
          </p>
          <p>
            <b>로봇·연구·멘토 경험</b> 로봇 프로젝트는 구현과 협업, BCI 연구는
            탐구력, 멘토 활동은 소통과 책임감 질문에 활용할 수 있습니다.
          </p>
        </div>
      </article>
    </Page>
  );
}
function Planner() {
  const days = [
    {
      day: "월요일",
      type: "회복·가벼운 복습",
      events: [
        ["출퇴근", "TOEIC Speaking / 자동차 전장 용어"],
        ["19:00–21:00", "헬스 + 샤워"],
        ["21:00–21:30", "저녁"],
        ["21:30–22:10", "이번 주 회로 개념 가벼운 복습"],
      ],
    },
    {
      day: "화요일",
      type: "회로·Simulation",
      events: [
        ["출퇴근", "TOEIC Speaking / 인적성"],
        ["19:00–20:00", "저녁 및 휴식"],
        ["20:00–21:00", "회로이론 / 전자회로"],
        ["21:00–22:00", "LTspice 실습"],
      ],
    },
    {
      day: "수요일",
      type: "회복·정리",
      events: [
        ["출퇴근", "영어 Speaking"],
        ["19:00–21:00", "헬스 + 샤워"],
        ["21:30–22:10", "Datasheet 또는 기술노트 복습"],
      ],
    },
    {
      day: "목요일",
      type: "HW 프로젝트 집중",
      events: [
        ["출퇴근", "영어 / 인적성"],
        ["19:00–20:00", "저녁 및 휴식"],
        ["20:00–22:00", "Automotive CAN Sensor ECU 프로젝트"],
      ],
    },
    {
      day: "금요일",
      type: "휴식 우선",
      events: [
        ["출퇴근", "영어 Speaking"],
        ["19:00–21:00", "헬스 + 샤워"],
        ["이후", "휴식 또는 20~30분 짧은 복습"],
      ],
    },
    {
      day: "토요일",
      type: "주간 핵심 실습",
      events: [
        ["3~4시간", "회로 / HW 프로젝트 결과물 제작"],
        ["1시간", "영어 또는 인적성"],
        ["20분", "프로젝트 과정·실수 기록"],
      ],
    },
    {
      day: "일요일",
      type: "마무리·재계획",
      events: [
        ["1시간 30분", "헬스"],
        ["1~2시간", "프로젝트 또는 미완료 핵심 범위"],
        ["1시간", "영어 / 인적성"],
        ["30분", "주간 회고 및 다음 주 목표 3개"],
      ],
    },
  ];
  return (
    <Page
      title="주간 일정"
      sub="출퇴근 3시간과 헬스 일정을 고려해 GPT가 설계한 지속 가능한 기본 시간표입니다."
    >
      <article className="schedule-rule">
        <b>일정 운영 원칙</b>
        <span>평일 핵심 학습은 최대 2시간</span>
        <span>매주 핵심 목표는 최대 3개</span>
        <span>미완료 작업은 회고에서 재결정</span>
      </article>
      <div className="schedule-grid">
        {days.map((d) => (
          <article className="panel day-card" key={d.day}>
            <div>
              <h2>{d.day}</h2>
              <span>{d.type}</span>
            </div>
            {d.events.map((e) => (
              <p key={e[0] + e[1]}>
                <b>{e[0]}</b>
                <span>{e[1]}</span>
              </p>
            ))}
          </article>
        ))}
      </div>
      <article className="panel schedule-tips">
        <h2>공부가 밀렸을 때</h2>
        <div>
          {[
            ["Carry Over", "다음 주 핵심 목표에 포함할 가치가 있을 때만 이동"],
            ["Skip", "현재 취업 목표에 중요하지 않다면 생략"],
            ["Reduce Scope", "전체 대신 핵심 개념·실습 하나만 완료"],
            ["Reschedule", "프로젝트 순서상 필요한 날짜로 다시 배치"],
            [
              "Completed Elsewhere",
              "인턴·수업 등 다른 활동으로 이미 증거를 만들었을 때",
            ],
          ].map((x) => (
            <p key={x[0]}>
              <b>{x[0]}</b>
              <span>{x[1]}</span>
            </p>
          ))}
        </div>
      </article>
    </Page>
  );
}
function Page({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: any;
}) {
  return (
    <section className="page">
      <div className="title">
        <p className="eyebrow">자동차 전장 HW R&D 취업 준비</p>
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>
      {children}
    </section>
  );
}
