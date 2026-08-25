import { useEffect, useMemo, useState } from "react";
import CircuitStarter from "./CircuitStarter";
import CourseManager from "./CourseManager";
import {
  connectCloud,
  disconnectCloud,
  downloadCloud,
  generateSyncCode,
  getSyncCredentials,
  startCloudAutoSync,
  uploadCloud,
} from "./cloudSync";
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
  | "courses"
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
const employmentCoursePlan = [
  [
    "강의 준비와 회로 기초 점검",
    "COURSE PREP",
    [
      "강의 도구·KiCad·저장공간 준비",
      "전압·전류·저항·전력 복습",
      "Training과 Independent Project 구분",
      "Evidence 폴더 구조 만들기",
    ],
    ["학습환경 Checklist", "기초 계산 노트"],
    "이 강의를 취업 역량으로 어떻게 변환할 것인가?",
  ],
  [
    "System-level과 HW 설계 Flow",
    "COURSE W1",
    [
      "Lecture 1–7 시청·노트",
      "Power Flow와 Signal Flow 직접 그리기",
      "현대차·기아·모비스 HW 공고와 역량 연결",
      "다른 사람에게 System-level 설명",
    ],
    ["System Block Diagram"],
    "System-level 관점이 회로설계에 왜 필요한가?",
  ],
  [
    "Requirement와 부품 선택 I",
    "COURSE W2",
    [
      "Lecture 8–12 학습",
      "요구사항을 전기적 사양으로 변환",
      "MCU·PHY·ADC·Motor Driver 후보 비교",
      "Datasheet 핵심 Parameter 기록",
    ],
    ["Requirement Sheet", "후보 부품 비교표"],
    "요구사항에서 부품 사양을 어떻게 도출했는가?",
  ],
  [
    "부품 선택 II와 Block Diagram",
    "COURSE W3",
    [
      "Lecture 13–16 학습",
      "MOSFET·DAC·MIC·I2C 선정 근거",
      "정격·대안·원가 비교",
      "Training Board Block Diagram 완성",
    ],
    ["Component Selection Table", "Block Diagram"],
    "왜 이 부품과 정격을 선택했는가?",
  ],
  [
    "Power Budget와 STM32 전원",
    "COURSE W4",
    [
      "Lecture 17–24 학습",
      "Rail별 전압·전류·전력 계산",
      "Decoupling 위치와 값 근거 확인",
      "차량 12V→MCU 전원 문제 추가학습",
    ],
    ["Power Budget", "STM32 Power Tree"],
    "MCU 전원핀 주변 커패시터는 왜 필요한가?",
  ],
  [
    "STM32 Clock·Reset·Debug 회로",
    "COURSE W5",
    [
      "Lecture 25–33 학습",
      "Clock Tree·Reset·Boot·SWD 분석",
      "데이터시트 권장회로와 강의 회로 비교",
      "회로를 블록별로 3분 설명",
    ],
    ["MCU Schematic Analysis", "3분 설명 노트"],
    "첫 전원 인가 전 MCU 회로에서 무엇을 확인하는가?",
  ],
  [
    "PHY·ESD·EMI와 보호경로",
    "COURSE W6",
    [
      "Lecture 34–40 학습",
      "ESD Current Path 가설 그리기",
      "Protection·Bead·Transformer 배치 근거",
      "차량 Connector·CAN 보호로 변환",
    ],
    ["ESD Path Analysis", "Protection Placement Note"],
    "ESD 보호소자는 왜 커넥터 가까이에 배치하는가?",
  ],
  [
    "Motor·ADC·DAC·LDO",
    "COURSE W7",
    [
      "Lecture 41–59 학습",
      "Load·Switching·Thermal 기준 비교",
      "ADC Resolution·Sampling·Reference 분석",
      "LDO PSRR·Dropout·Ripple 확인",
    ],
    ["Analog·Power 부품 선정표", "계산·Datasheet Evidence"],
    "Mixed-signal 회로의 전원과 Ground를 어떻게 검토하는가?",
  ],
  [
    "Mixed-Signal PCB Layout",
    "COURSE W8",
    [
      "Lecture 60–76 학습",
      "Placement·Return Path·GND·Differential 검토",
      "Power·Analog·Digital 영역 설명",
      "3D·DRC와 Rework Risk 기록",
    ],
    ["PCB Layout Review", "Design Review Checklist"],
    "PCB 배치와 배선 순서를 어떤 근거로 정했는가?",
  ],
  [
    "강의 Mastery와 취업 Evidence 완성",
    "COURSE REVIEW",
    [
      "복습 필요 강의 재학습",
      "Explain·Apply 미완료 항목 보완",
      "Training Project Report 작성",
      "강의 내용과 직접 수행 범위 구분",
    ],
    ["Training Project Technical Report", "Course Evidence Index"],
    "완강률과 실제 설계 역량의 차이는 무엇인가?",
  ],
  [
    "Automotive 요구사항 변환",
    "INDEPENDENT",
    [
      "강의 보드를 그대로 복제하지 않기",
      "12V·CAN·Sensor 요구사항 정의",
      "신뢰성·성능·원가 우선순위 설정",
      "검증 가능한 완료 기준 작성",
    ],
    ["Automotive ECU Requirements"],
    "Training 지식을 자동차 요구사항으로 어떻게 변환했는가?",
  ],
  [
    "Automotive ECU Architecture",
    "INDEPENDENT",
    [
      "12V Input·Protection·Power·MCU·CAN 구조",
      "입출력과 Interface 정의",
      "Failure Mode 후보 정리",
      "Block별 검증 방법 계획",
    ],
    ["ECU Block Diagram", "Verification Plan"],
    "ECU 구조를 왜 이렇게 나누었는가?",
  ],
  [
    "Automotive 부품 선정",
    "INDEPENDENT",
    [
      "Regulator·MCU·CAN Transceiver 선정",
      "TVS·역극성·Connector 검토",
      "정격·대안·원가·수급 비교",
      "Datasheet 근거 페이지 기록",
    ],
    ["Automotive Component Table"],
    "일반 부품과 자동차용 부품의 선택 기준 차이는?",
  ],
  [
    "전원·보호회로 Simulation",
    "INDEPENDENT",
    [
      "12V→5V→3.3V 전원 설계",
      "입력 보호와 Decoupling 검토",
      "LTspice로 주요 조건 비교",
      "예상·Simulation 차이 기록",
    ],
    ["Power Simulation Report"],
    "차량 전원에서 고려해야 할 과도조건은 무엇인가?",
  ],
  [
    "ECU Schematic",
    "INDEPENDENT",
    [
      "Power·MCU·CAN·Sensor 회로 작성",
      "Training 회로 참고 범위 표시",
      "ERC와 Design Review",
      "Block별 선정 근거 설명",
    ],
    ["ECU Schematic V1"],
    "직접 설계한 부분과 참고한 부분을 구분해보라.",
  ],
  [
    "ECU PCB Layout",
    "INDEPENDENT",
    [
      "Placement 우선순위 결정",
      "Power·Ground·CAN Return Path 검토",
      "Protection과 Decoupling 배치",
      "DRC·3D Review",
    ],
    ["ECU PCB V1", "Layout Review"],
    "EMC를 고려해 어떤 배치 결정을 했는가?",
  ],
  [
    "제작 준비와 Review",
    "BUILD",
    [
      "BOM·Gerber·정격 재검토",
      "전원 Short·극성 Checklist",
      "가능하면 PCB 주문",
      "제작하지 못하면 Peer Review 강화",
    ],
    ["Gerber·BOM", "Bring-up Checklist"],
    "제작 전 어떤 위험을 제거했는가?",
  ],
  [
    "Bring-up과 Measurement",
    "VALIDATION",
    [
      "전류 제한 후 단계별 전원 인가",
      "Rail Voltage·Current 측정",
      "MCU·Sensor·CAN 확인",
      "예상값과 측정값 비교",
    ],
    ["Measurement Result"],
    "첫 전원 인가 절차와 판단 기준은?",
  ],
  [
    "Debugging과 개선",
    "VALIDATION",
    [
      "Problem·Hypothesis 작성",
      "측정으로 원인 후보 축소",
      "수정 후 동일 조건 재시험",
      "확인된 사실과 추정 구분",
    ],
    ["Debugging Report"],
    "회로 문제를 어떤 순서로 분석했는가?",
  ],
  [
    "취업 포트폴리오와 면접",
    "PORTFOLIO",
    [
      "Training·Independent Project 구분",
      "요구사항→근거→측정 Story 작성",
      "자소서 STAR와 3분 발표",
      "현대차·기아·모비스 직무별 강조점 조정",
    ],
    ["Automotive HW Portfolio", "Interview Deck"],
    "직접 만든 회로와 설계 판단을 설명해보라.",
  ],
] as const;
const kickboardCoursePlan = [
  ["전동킥보드 시스템과 회로 기초 I", "GUIDED HW PROJECT", ["Battery→Controller→Motor 전력·신호 흐름", "전압·전류·저항·전력 및 KVL·KCL", "전체 System Block Diagram 작성"], ["Kickboard System Block Diagram", "Circuit Fundamental Note"], "전동킥보드의 전력은 어떤 블록을 거쳐 모터로 전달되는가?"],
  ["전동킥보드 시스템과 회로 기초 II", "GUIDED HW PROJECT", ["MCU·Inverter·Motor 역할 설명", "Voltage Divider·Capacitor·Inductor·Diode 복습", "블록별 입력·출력·검증 방법 기록"], ["Power/Signal Flow 설명자료"], "Controller 안에서 MCU와 Inverter의 역할은 어떻게 다른가?"],
  ["Electronic Components I", "GUIDED HW PROJECT", ["저항·커패시터·인덕터·다이오드 역할", "Datasheet 정격과 허용오차 확인", "실제 회로에서 부품의 고장 영향 기록"], ["Component Selection Note"], "각 수동소자의 정격은 어떤 조건으로 정하는가?"],
  ["MOSFET과 Switching", "GUIDED HW PROJECT", ["BJT·MOSFET·Switching 비교", "Vds·Vgs·Id·Rds(on)·손실 확인", "MOSFET Datasheet 후보 비교"], ["MOSFET Datasheet Analysis"], "Rds(on)이 손실과 발열에 미치는 영향은?"],
  ["STM32 Fundamentals", "GUIDED HW PROJECT", ["CPU·Memory·GPIO·ADC·PWM·Timer", "Clock·Reset·Watchdog 구조", "STM32 Block Diagram과 주요 Pin 확인"], ["STM32 Architecture Note"], "STM32는 Motor Controller에서 어떤 역할을 하는가?"],
  ["Embedded Firmware", "GUIDED HW PROJECT", ["C·Register·GPIO·Interrupt", "Timer·PWM·ADC 동작 이해", "LED·PWM·ADC 최소 실습"], ["STM32 Peripheral Practice"], "PWM과 ADC는 제어 시스템에서 어떻게 연결되는가?"],
  ["Power Electronics", "GUIDED HW PROJECT", ["Switching·Buck Converter 동작", "MOSFET·Gate Driver·효율·손실", "Buck Block Diagram과 파형 설명"], ["Buck Converter Technical Note"], "Gate Driver가 필요한 이유는 무엇인가?"],
  ["3-Phase Inverter", "GUIDED HW PROJECT", ["Half Bridge·High/Low Side", "Dead Time·3-Phase PWM", "MOSFET Switching Sequence 작성"], ["3-Phase Inverter Analysis"], "Dead Time이 없으면 어떤 문제가 생기는가?"],
  ["BLDC Motor Control", "GUIDED HW PROJECT", ["Rotor·Stator·Hall Sensor", "Commutation·PWM·Current·Torque", "BLDC Control Flow Diagram 작성"], ["BLDC Motor Control Note"], "Hall Sensor 정보로 어떻게 Commutation하는가?"],
  ["PCB Design과 4-Layer", "GUIDED HW PROJECT", ["Schematic·Footprint·Placement·Routing", "Power/Ground·Via·고전류 경로", "강의 프로젝트 PCB Design Review"], ["PCB Design Review Note"], "고전류 경로와 Signal Return Path를 어떻게 구분하는가?"],
  ["Measurement와 Debugging", "GUIDED HW PROJECT", ["멀티미터·전원공급기·오실로스코프", "전압·전류·PWM·Noise 측정 계획", "무엇을 어디서 왜 측정할지 기록"], ["Hardware Measurement Checklist"], "첫 전원 인가 전에 무엇을 어떤 순서로 확인하는가?"],
  ["Guided Project Technical Review", "GUIDED HW PROJECT", ["요구사항→부품→회로→PCB→Firmware 복기", "MCU·MOSFET·Gate Driver·Buck 선정 이유", "교육 제공 범위와 직접 수행 범위 구분"], ["Guided Project Technical Review"], "강의에서 배운 것과 독립 설계한 것은 어떻게 다른가?"],
  ["Automotive Power", "AUTOMOTIVE HW EXTENSION", ["Vehicle 12V·과전압·저전압·과도", "역극성·Load Dump·TVS·Fuse", "12V Input Protection Block Diagram"], ["Automotive Power Protection Note"], "차량 12V 입력에는 어떤 보호가 필요한가?"],
  ["Automotive Communication", "AUTOMOTIVE HW EXTENSION", ["CAN H/L·차동·Dominant/Recessive", "CAN Transceiver·Termination·LIN", "CANalyzer 경험과 CAN Architecture 연결"], ["Automotive CAN Architecture"], "CAN Controller와 Transceiver의 차이는?"],
  ["EMI·EMC·ESD", "AUTOMOTIVE HW EXTENSION", ["ESD·EMI·EMC·Filtering·Decoupling", "PCB Current Path와 TVS 배치", "인턴 ESD 시험 사실·추정 구분"], ["ESD/EMC Technical Note", "ESD Internship STAR Draft"], "ESD 시험에서 확인한 사실과 추정은 무엇인가?"],
  ["CAN Sensor ECU Requirements", "INDEPENDENT PROJECT", ["12V·Power·MCU·CAN·Sensor 요구사항", "독립 System Block Diagram", "기능별 검증 기준 정의"], ["Requirements Document", "System Block Diagram"], "Guided Project와 달리 직접 결정한 요구사항은 무엇인가?"],
  ["CAN Sensor ECU Component Selection", "INDEPENDENT PROJECT", ["MCU·Regulator·CAN·TVS·Sensor 선정", "정격·온도·원가·수급·대안 비교", "Datasheet 근거 페이지 기록"], ["Component Selection Table"], "왜 이 부품을 선택했고 대안은 무엇인가?"],
  ["CAN Sensor ECU Schematic", "INDEPENDENT PROJECT", ["Power·Protection·MCU·CAN·Sensor", "Debug Connector·Test Point", "ERC와 Block별 Design Review"], ["ECU Schematic V1"], "전체 회로를 Block 단위로 설명해보라."],
  ["PCB·Prototype", "INDEPENDENT PROJECT", ["Placement·Power/Ground·CAN Routing", "Protection·Decoupling·Test Point 배치", "DRC·Gerber·BOM 및 가능하면 주문"], ["PCB V1", "Gerber", "BOM"], "PCB 배치와 배선 순서를 어떤 근거로 정했는가?"],
  ["Measurement·Debugging·Portfolio", "EMPLOYMENT PREPARATION", ["전원 인가·Rail·MCU·CAN·Sensor 검증", "문제→가설→측정→수정→재시험", "Guided/Independent 구분 Portfolio 작성"], ["Automotive CAN Sensor ECU Portfolio V1"], "직접 결정한 설계와 측정 근거를 설명해보라."],
] as const;
const weeks: Week[] = raw.map((w, i) => ({
  n: i + 1,
  dates: w[0],
  title: kickboardCoursePlan[i][0],
  phase: kickboardCoursePlan[i][1],
  tasks: [...kickboardCoursePlan[i][2]],
  deliverables: [...kickboardCoursePlan[i][3]],
  question: kickboardCoursePlan[i][4],
}));
const parallelTracks = (week: Week) => {
  const n = week.n;
  const automotive = n <= 4 ? "자동차 전장 용어 2개와 강의 내용 연결" : n <= 8 ? "차량 전원·보호 또는 CAN 개념 30분" : n <= 12 ? "Guided 회로를 자동차 환경 기준으로 비교" : "CAN·차량 전원·EMC Evidence 1개 보완";
  const independent = n <= 4 ? "CAN Sensor ECU 요구사항 아이디어 1개 기록" : n <= 8 ? "CAN Sensor ECU Block·후보 부품 1개 검토" : n <= 12 ? "독립 프로젝트 요구사항·검증 기준 1개 확정" : n <= 15 ? "자동차 확장 내용을 ECU 설계에 반영" : "CAN Sensor ECU 설계·측정·문서화 진행";
  return [
    ["전동킥보드 강의", "배정한 전동킥보드 강의 학습과 노트"],
    ["HW 실습", `${week.title} 관련 계산·회로·펌웨어·측정 중 1개`],
    ["자동차 전장", automotive],
    ["독립 프로젝트", independent],
    ["취업 준비", "주간 결과물·면접 답변·포트폴리오 근거 1개"],
    ["영어·인적성", "통근 영어 3회 이상·인적성 2회 이상"],
  ];
};
const koreanPhase = (phase: string) => ({
  "GUIDED HW PROJECT": "교육 기반 HW 프로젝트",
  "AUTOMOTIVE HW EXTENSION": "자동차 전장 확장",
  "INDEPENDENT PROJECT": "독립 프로젝트",
  "EMPLOYMENT PREPARATION": "취업 준비",
}[phase] || phase);
const optimizedDailySchedule = [
  {
    day: "일요일", type: "보충·회고·재계획", focus: "다음 주를 가볍게 만드는 날",
    events: [["오전 60~90분", "주말 보충함의 가장 중요한 항목 1개"], ["오후", "헬스 1시간 30분과 충분한 휴식"], ["20:30–21:00", "주간 회고와 미완료 처리 결정"], ["21:00–21:20", "다음 주 목표 3개·월요일 자료 준비"]],
  },
  {
    day: "월요일", type: "회복·회로 기초", focus: "부담 없이 학습 흐름 재개",
    events: [["출퇴근", "영어 20분 또는 TOEIC Speaking 1세트"], ["19:00–21:00", "헬스·샤워·저녁"], ["21:30–21:50", "이번 주 회로 개념과 계산 복습"], ["21:50–22:20", "전동킥보드 Lecture 1개 또는 30분"], ["22:20–22:25", "배운 것·모르는 것 기록"]],
  },
  {
    day: "화요일", type: "강의·HW 실습", focus: "주중 첫 집중 학습",
    events: [["출퇴근", "인적성 10문제 또는 오답 10분"], ["19:00–20:00", "저녁과 휴식"], ["20:00–20:40", "전동킥보드 강의와 핵심 노트"], ["20:50–21:40", "관련 계산·회로·Firmware 실습"], ["21:40–21:50", "직접 한 것과 결과 기록"]],
  },
  {
    day: "수요일", type: "회복·자동차 확장", focus: "짧게 연결하고 오래 지속",
    events: [["출퇴근", "영어 20분 또는 TOEIC Speaking 1세트"], ["19:00–21:00", "헬스·샤워·저녁"], ["21:30–21:50", "CAN·차량 전원·보호·EMC 중 1개"], ["21:50–22:05", "강의 내용과 자동차 적용 차이 정리"], ["22:05–22:10", "모르는 점과 확인할 것 기록"]],
  },
  {
    day: "목요일", type: "독립 CAN ECU", focus: "주중 프로젝트 집중",
    events: [["출퇴근", "인적성 10문제 또는 오답 10분"], ["19:00–20:00", "저녁과 휴식"], ["20:00–21:10", "CAN Sensor ECU 설계 결정 1개"], ["21:10–21:30", "선정 근거·검증 방법 정리"], ["21:30–21:40", "문제·가설·다음 행동 기록"]],
  },
  {
    day: "금요일", type: "회복·취업 Evidence", focus: "공부보다 정리와 회복",
    events: [["출퇴근", "영어 20분 또는 TOEIC Speaking 1세트"], ["19:00–21:00", "헬스·샤워·저녁"], ["21:30–21:50", "Evidence 또는 면접 답변 1개"], ["21:50–22:00", "빠진 학습 확인·자소서용 사실 기록"], ["이후", "휴식"]],
  },
  {
    day: "토요일", type: "HW 실습·주말 보충", focus: "한 주의 실제 결과물 완성",
    events: [["오전 2~3시간", "회로·Firmware·측정 실습"], ["오후 60~90분", "평일 미완료 중 중요한 항목부터 보충"], ["30분", "영어 또는 인적성 20문제"], ["20분", "사진·수치·결과를 Evidence로 정리"]],
  },
] as const;
const nav: [[View, string, any], ...any[]] = [
  ["dashboard", "대시보드", BarChart3],
  ["careerHub", "취업 준비", Target],
  ["learningHub", "학습·프로젝트", BookOpen],
  ["journal", "기록·경험", Sparkles],
  ["recruitHub", "지원·면접", BriefcaseBusiness],
  ["settings", "설정·백업", Settings],
];
const careerHubItems: [View, string, string, any][] = [
  [
    "career",
    "취업 준비 전략",
    "영어·인적성·자소서·포트폴리오 준비 기준",
    Target,
  ],
];
const viewTitles: Partial<Record<View, string>> = {
  career: "취업 준비",
  planner: "주간 일정",
  study: "20주 학습",
  project: "HW 프로젝트",
  circuitStarter: "회로 프로젝트 입문",
  courses: "회로 강의 관리",
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
  courses: "learningHub",
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
    [menu, setMenu] = useState(false),
    [dashboardRevision, setDashboardRevision] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>(() =>
    JSON.parse(localStorage.getItem("ahw-kickboard-curriculum-done-v1") || "{}"),
  );
  const [journal, setJournal] = useState(
    () => localStorage.getItem("ahw-journal") || "",
  );
  useEffect(
    () => localStorage.setItem("ahw-kickboard-curriculum-done-v1", JSON.stringify(done)),
    [done],
  );
  useEffect(() => localStorage.setItem("ahw-journal", journal), [journal]);
  useEffect(() => startCloudAutoSync(), []);
  const recommendedWeek =
    weeks.find((item) =>
      item.tasks.some((_, index) => !done[`w${item.n}-${index}`]),
    )?.n || 20;
  useEffect(() => setWeek(recommendedWeek), [recommendedWeek]);
  const current = weeks[week - 1],
    completed = weeks.reduce(
      (sum, item) =>
        sum + item.tasks.filter((_, index) => done[`w${item.n}-${index}`]).length,
      0,
    ),
    total = weeks.reduce((sum, item) => sum + item.tasks.length, 0);
  const go = (v: View) => {
    setView(
      v === "careerHub" && careerHubItems.length === 1
        ? careerHubItems[0][0]
        : v,
    );
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
            자동차 전장<small>HW R&D 취업 준비</small>
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
          <small>최종 목표</small>
          <b>자동차 전장 HW R&amp;D 취업</b>
          <span>취업할 때까지 준비 계속</span>
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
            setDone={setDone}
            dataRevision={dashboardRevision}
            onDashboardDataChange={() => setDashboardRevision((value) => value + 1)}
            go={go}
          />
        )}{" "}
        {view === "careerHub" && careerHubItems.length > 1 && (
          <NavigationHub
            title="취업 준비"
            sub="목표 직무 전략과 준비 우선순위를 한곳에서 확인합니다."
            go={go}
            items={careerHubItems}
          />
        )}{" "}
        {view === "learningHub" && (
          <NavigationHub
            title="학습·프로젝트"
            sub="강의 학습 → 주간 실행 → 독립 프로젝트, 세 가지만 따라가면 됩니다."
            go={go}
            items={[
              [
                "courses",
                "전동킥보드 강의",
                "강의·노트·실습·취업 Evidence를 한곳에서 관리",
                BookOpen,
              ],
              [
                "study",
                "20주 병렬 계획",
                "이번 주 핵심 3개와 6개 취업 트랙 체크",
                GraduationCap,
              ],
              [
                "project",
                "독립 CAN ECU 프로젝트",
                "요구사항·부품·회로·PCB·측정 결과만 집중 관리",
                FolderKanban,
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
                "질문 직접 생성·수정과 실제 경험 기반 답변 메모",
                FileQuestion,
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
            go={go}
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
        {view === "courses" && (
          <CourseManager
            onQuickNote={(text, date) => {
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
      <div className={`navigation-hub ${items.length === 3 ? "compact-three" : ""}`}>
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
function DailyAgenda({
  go,
  current,
  done,
  setDone,
  onDataChange,
}: {
  go: (v: View) => void;
  current: Week;
  done: Record<string, boolean>;
  setDone: (value: Record<string, boolean>) => void;
  onDataChange: () => void;
}) {
  const schedules = optimizedDailySchedule;
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const dateKey = new Date(now.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 10);
  const schedule = schedules[now.getDay()];
  const mainSuggestions = current.tasks
    .map((text, index) => ({
      text,
      track: "회로·HW 핵심",
      curriculumId: `w${current.n}-${index}`,
      minimum: true,
    }))
    .filter((task) => !done[task.curriculumId])
    .slice(0, 1);
  const maintenanceByDay = [
    ["주간 정리", "이번 주 완료 내용 확인과 다음 주 첫 할 일 정하기"],
    ["영어", "통근 영어 20분 또는 말하기 1세트"],
    ["인적성", "인적성 10문제만 풀고 오답 1개 확인"],
    ["경험 기록", "오늘 있었던 일을 10분 동안 일기로 기록"],
    ["영어", "통근 영어 20분 또는 말하기 1세트"],
    ["취업 준비", "공고 1개 확인 또는 자소서 소재 1개 검토"],
    ["주말 보충", "이번 주 미완료 항목 중 가장 중요한 1개만 수행"],
  ][now.getDay()];
  const nextKickboardLecture = (() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("ahw-kickboard-lectures-v1") || "[]",
      );
      return Array.isArray(saved)
        ? saved.find((lecture: any) => !lecture.steps?.watch && lecture.status !== "완료")
        : null;
    } catch {
      return null;
    }
  })();
  const kickboardTask = {
    track: "전동킥보드 강의",
    text: nextKickboardLecture
      ? `${nextKickboardLecture.number}강 · ${nextKickboardLecture.title || "실제 강의 제목 확인"} 수강 후 핵심 3줄 기록`
      : "전동킥보드 강의 1강 수강 후 핵심 3줄 기록",
    minimum: true,
  };
  const minimumTasks = [
    ...mainSuggestions.slice(0, 1),
    kickboardTask,
    { track: maintenanceByDay[0], text: maintenanceByDay[1], minimum: true },
  ].slice(0, 3);
  const checklistStart = new Date("2026-08-24T00:00:00+09:00");
  const checklistStarted = now >= checklistStart;
  const defaultTasks = checklistStarted
      ? minimumTasks.map((task, index) => ({
        id: `daily-plan-v4-${dateKey}-${index}`,
        ...task,
        done: false,
      }))
    : [];
  const latestCompletedCircuitTask = weeks
    .flatMap((weekItem) => weekItem.tasks.map((text, index) => ({
      text,
      track: "회로·HW 핵심",
      curriculumId: `w${weekItem.n}-${index}`,
      minimum: true,
      done: !!done[`w${weekItem.n}-${index}`],
    })))
    .filter((task) => task.done)
    .at(-1);
  const [allTasks, setAllTasks] = useState<Record<string, any[]>>(() => {
    const saved = JSON.parse(
      localStorage.getItem("ahw-daily-checklists") || "{}",
    );
    const initializedDays = JSON.parse(
      localStorage.getItem("ahw-daily-plan-days-v4") || "{}",
    );
    if (initializedDays[dateKey]) return saved;
    const previousTasks = saved[dateKey] || [];
    const userTasks = previousTasks.filter((task: any) => {
      const id = String(task.id || "");
      return !id.startsWith("daily-auto-") &&
        !id.startsWith("daily-plan-v2-") &&
        !id.startsWith("daily-plan-v3-") &&
        !id.startsWith("daily-plan-v4-") &&
        !id.startsWith(`parallel-${dateKey}-`);
    });
    const previousAutomatic = previousTasks.filter((task: any) => {
      const id = String(task.id || "");
      return id.startsWith("daily-auto-") || id.startsWith("daily-plan-v2-") || id.startsWith("daily-plan-v3-");
    });
    const previousCircuit = previousAutomatic.find((task: any) => task.track === "회로·HW 핵심" || task.curriculumId);
    const previousCourse = previousAutomatic.find((task: any) => task.track === "전동킥보드 강의");
    const previousSupport = previousAutomatic.find((task: any) => task.track !== "회로·HW 핵심" && task.track !== "전동킥보드 강의" && !task.curriculumId);
    const generatedCircuit = defaultTasks.find((task: any) => task.track === "회로·HW 핵심");
    const generatedCourse = defaultTasks.find((task: any) => task.track === "전동킥보드 강의");
    const generatedSupport = defaultTasks.find((task: any) => task.track !== "회로·HW 핵심" && task.track !== "전동킥보드 강의");
    const stableDefaults = [
      previousCircuit || latestCompletedCircuitTask || generatedCircuit,
      previousCourse || generatedCourse,
      previousSupport || generatedSupport,
    ]
      .filter(Boolean)
      .slice(0, 3)
      .map((task: any, index) => ({ ...task, id: `daily-plan-v4-${dateKey}-${index}`, done: !!task.done }));
    return { ...saved, [dateKey]: [...stableDefaults, ...userTasks] };
  });
  const [newTask, setNewTask] = useState("");
  const tasks = allTasks[dateKey] || [];
  useEffect(
    () => {
      localStorage.setItem("ahw-daily-items-cleared-v1", "done");
      localStorage.setItem("ahw-daily-checklists", JSON.stringify(allTasks));
      const initializedDays = JSON.parse(
        localStorage.getItem("ahw-daily-plan-days-v4") || "{}",
      );
      localStorage.setItem(
        "ahw-daily-plan-days-v4",
        JSON.stringify({ ...initializedDays, [dateKey]: true }),
      );
      onDataChange();
    },
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
  const toggleDailyTask = (task: any) => {
    const next = !task.done;
    setTasks(tasks.map((item) => item.id === task.id ? { ...item, done: next } : item));
    if (task.curriculumId) {
      setDone({ ...done, [task.curriculumId]: next });
    }
  };
  const completed = tasks.filter((task) => task.done).length;
  const monday = new Date(now);
  monday.setHours(12, 0, 0, 0);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const weekdayKeys = Array.from({ length: 5 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return new Date(day.getTime() - day.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  });
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;
  const catchUpTasks = weekdayKeys.flatMap((key) =>
    key === dateKey && !isWeekend
      ? []
      : (allTasks[key] || [])
          .filter((task) => !task.done)
          .map((task) => ({ ...task, sourceDate: key })),
  );
  const finishCatchUpTask = (sourceDate: string, id: string) => {
    const sourceTask = (allTasks[sourceDate] || []).find((task) => task.id === id);
    if (sourceTask?.curriculumId) {
      setDone({ ...done, [sourceTask.curriculumId]: true });
    }
    setAllTasks((all) => ({
      ...all,
      [sourceDate]: (all[sourceDate] || []).map((task) =>
        task.id === id ? { ...task, done: true, caughtUp: dateKey } : task,
      ),
    }));
  };
  return (
    <section className="daily-overview">
      <article className="today-schedule">
        <div className="daily-heading">
          <div>
            <small>오늘 · {dateKey.replaceAll("-", ".")}</small>
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
            <small>일일 체크리스트 · 자동 최적화</small>
            <h2>오늘 할 일</h2>
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
                  onChange={() => toggleDailyTask(task)}
                />
                <i>{task.done && <Check />}</i>
                <span>
                  {task.track && <small>{task.track} · {task.minimum ? "최소" : "추가"}</small>}
                  {task.text}
                </span>
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
            <p>
              {checklistStarted
                ? "오늘의 할 일을 직접 추가해보세요."
                : "자동 체크리스트는 2026년 8월 24일 월요일부터 시작합니다."}
            </p>
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
        <div className={`weekend-catchup ${isWeekend ? "active" : ""}`}>
          <div className="catchup-heading">
            <div>
              <small>{isWeekend ? "주말 보충" : "주말 보충 예정"}</small>
              <h3>{isWeekend ? "이번 주 미완료 보충" : "주말 보충 예정"}</h3>
            </div>
            <strong>{catchUpTasks.length}개</strong>
          </div>
          {catchUpTasks.length ? (
            <div className="catchup-tasks">
              {catchUpTasks.map((task) => (
                <label key={`${task.sourceDate}-${task.id}`}>
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => finishCatchUpTask(task.sourceDate, task.id)}
                  />
                  <i><Check /></i>
                  <span>
                    <b>{task.text}</b>
                    <small>{task.sourceDate.replaceAll("-", ".")} 미완료</small>
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <p>
              {isWeekend
                ? "이번 주에 밀린 일이 없습니다. 충분히 쉬고 다음 주를 준비하세요."
                : "현재 주말로 넘길 미완료 항목이 없습니다."}
            </p>
          )}
          <p className="catchup-guide">
            평일에 체크하지 못한 항목은 자동으로 이곳에 모입니다. 주말에 완료하면 원래 날짜의 체크리스트에도 반영됩니다.
          </p>
        </div>
      </article>
    </section>
  );
}
function CourseSnapshot({ go }: { go: (v: View) => void }) {
  const lectures = (() => {
    try {
      return JSON.parse(localStorage.getItem("ahw-kickboard-lectures-v1") || "[]");
    } catch {
      return [];
    }
  })();
  const completed = lectures.filter((x: any) => x.steps?.watch || x.status === "완료").length;
  const current = lectures.find((x: any) => !x.steps?.watch && x.status !== "완료") || {
    number: 1,
    title: "실제 강의 제목을 입력하세요",
    section: "구역 미입력",
    steps: {},
  };
  const total = lectures.length || 159;
  const video = Math.round((completed / total) * 100);
  const mastery = lectures.length
    ? Math.round(
        (lectures.reduce(
          (sum: number, x: any) =>
            sum + ["understand", "practice", "explain", "apply"].filter((key) => x.steps?.[key]).length,
          0,
        ) /
          (total * 4)) *
          100,
      )
    : 0;
  const hwSkill = lectures.length
    ? Math.round((lectures.filter((x: any) => x.steps?.practice || x.steps?.explain).length / total) * 100)
    : 0;
  const automotiveSkill = lectures.length
    ? Math.round((lectures.filter((x: any) => x.steps?.apply || x.notes?.automotive?.trim()).length / total) * 100)
    : 0;
  const independentEvidence = (() => {
    try {
      const items = JSON.parse(localStorage.getItem("ahw-kickboard-evidence-v1") || "[]");
      return Math.min(100, items.filter((x: any) => x.project === "Independent Project").length * 10);
    } catch {
      return 0;
    }
  })();
  return (
    <section className="course-snapshot">
      <div>
        <small>현재 단계 · 교육 기반 HW 프로젝트</small>
        <h2>전동킥보드 임베디드 프로젝트</h2>
        <p>BLDC 모터 제어기 · 인프런 · {total}강 관리</p>
      </div>
      <div className="course-snapshot-stats">
        <span>
          <b>{completed}/{total}</b>강의
        </span>
        <span>
          <b>{video}%</b>시청
        </span>
        <span>
          <b>{mastery}%</b>숙련도
        </span>
        <span>
          <b>{hwSkill}%</b>HW 역량
        </span>
        <span>
          <b>{automotiveSkill}%</b>자동차 전장
        </span>
        <span>
          <b>{independentEvidence}%</b>독립 프로젝트
        </span>
      </div>
      <div className="today-hw-study">
        <small>오늘의 HW 학습</small>
        <b>
          강의 {current.number} · {current.title}
        </b>
        <span>{current.section}</span>
        <p>오늘의 질문: 강의에서 제공된 것과 내가 직접 수행한 것은 무엇인가?</p>
      </div>
      <button onClick={() => go("courses")}>강의 학습 열기 →</button>
    </section>
  );
}
function Dashboard({
  current,
  done,
  setDone,
  dataRevision,
  onDashboardDataChange,
  go,
}: {
  current: Week;
  done: Record<string, boolean>;
  setDone: (value: Record<string, boolean>) => void;
  dataRevision: number;
  onDashboardDataChange: () => void;
  go: (v: View) => void;
}) {
  void dataRevision;
  const wp = Math.round(
    (current.tasks.filter((_, i) => done[`w${current.n}-${i}`]).length /
      current.tasks.length) *
      100,
  );
  const priorityTask =
    current.tasks.find((_, index) => !done[`w${current.n}-${index}`]) ||
    "이번 단계 핵심 과제를 모두 완료했습니다";
  const savedDaily = (() => {
    try {
      return JSON.parse(localStorage.getItem("ahw-daily-checklists") || "{}");
    } catch {
      return {};
    }
  })();
  const today = new Date();
  const todayKey = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  const todayTasks: any[] = savedDaily[todayKey] || [];
  const dailyProgress = todayTasks.length
    ? Math.round((todayTasks.filter((task) => task.done).length / todayTasks.length) * 100)
    : 0;
  const allDailyTasks: any[] = Object.values(savedDaily).flat() as any[];
  const englishTasks = allDailyTasks.filter(
    (task) => task.track === "영어" || /영어|TOEIC|OPIc/i.test(task.text || ""),
  );
  const englishProgress = englishTasks.length
    ? Math.round((englishTasks.filter((task) => task.done).length / englishTasks.length) * 100)
    : 0;
  const lectures: any[] = (() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ahw-kickboard-lectures-v1") || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  })();
  const completedLectures = lectures.filter(
    (lecture) => lecture.steps?.watch || lecture.status === "완료",
  ).length;
  const circuitProgress = Math.round((completedLectures / (lectures.length || 159)) * 100);
  const experienceCount = (() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ahw-experiences") || "[]");
      return Array.isArray(saved) ? saved.length : 0;
    } catch {
      return 0;
    }
  })();
  const experienceProgress = Math.min(100, Math.round((experienceCount / Math.max(1, current.n)) * 100));
  const curriculumCompleted = weeks.reduce(
    (sum, item) => sum + item.tasks.filter((_, index) => done[`w${item.n}-${index}`]).length,
    0,
  );
  const curriculumTotal = weeks.reduce((sum, item) => sum + item.tasks.length, 0);
  const curriculumProgress = Math.round((curriculumCompleted / curriculumTotal) * 100);
  const totalProgress = Math.round(
    (englishProgress + circuitProgress + experienceProgress + curriculumProgress) / 4,
  );
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">2026 신입 취업 로드맵</p>
          <h1>
            자동차 전장
            <br />
            <em>HW R&D 취업 준비</em>
          </h1>
          <p>이론을 아는 사람에서, 직접 설계하고 설명할 수 있는 엔지니어로.</p>
        </div>
        <aside className="target">
          <small>목표 기업</small>
          {["01  현대자동차", "02  현대모비스", "03  기아"].map((x) => (
            <b key={x}>{x}</b>
          ))}
          <hr />
          <small>목표 직무</small>
          <p>
            자동차 R&D · 전자 하드웨어
            <br />
            회로 설계 · ECU 하드웨어
            <br />
            PCB / MCU / CAN
          </p>
        </aside>
      </section>
      <section className="metrics">
        <article className="priority-metric">
          <small>지금 가장 먼저 할 일</small>
          <strong>{priorityTask}</strong>
          <span>완료하면 다음 우선순위가 자동으로 표시됩니다.</span>
        </article>
        <article>
          <small>오늘 완료율</small>
          <strong>{dailyProgress}%</strong>
          <div className="bar"><i style={{ width: dailyProgress + "%" }} /></div>
        </article>
        <article>
          <small>이번 주 완료율</small>
          <strong>{wp}%</strong>
          <div className="bar">
            <i style={{ width: wp + "%" }} />
          </div>
        </article>
        <article>
          <small>전체 취업 준비</small>
          <strong>{totalProgress}%</strong>
          <div className="bar"><i style={{ width: totalProgress + "%" }} /></div>
        </article>
      </section>
      <section className="preparation-progress">
        <div className="preparation-progress-head">
          <div><small>전체 완성률 상세</small><h2>취업 준비 영역별 진행도</h2></div>
          <p>체크·강의 수강·경험 저장처럼 직접 완료한 내용만 반영합니다.</p>
        </div>
        <div className="preparation-progress-grid">
          {[
            ["영어", englishProgress, `${englishTasks.filter((task) => task.done).length}/${englishTasks.length || 0}회 완료`],
            ["회로 공부", circuitProgress, `${completedLectures}/${lectures.length || 159}강 수강`],
            ["경험 기록", experienceProgress, `${experienceCount}/${Math.max(1, current.n)}개 · 인턴·창업·캡스톤 등`],
          ].map(([label, value, detail]) => (
            <article key={String(label)}>
              <span><b>{label}</b><strong>{value}%</strong></span>
              <div className="bar"><i style={{ width: `${value}%` }} /></div>
              <small>{detail}</small>
            </article>
          ))}
        </div>
      </section>
      <section className="restart-banner">
        <div>
          <small>교육과정 운영 원칙</small>
          <b>전동킥보드 Guided Project 중심 20주 과정</b>
        </div>
        <p>
          미완료분은 자동 누적하지 않습니다. 매주 핵심 목표는 최대 3개로 제한하고,
          강의 개수보다 이해·실습·검증 가능한 결과물을 우선합니다.
        </p>
      </section>
      <CourseSnapshot go={go} />
      <DailyAgenda
        go={go}
        current={current}
        done={done}
        setDone={setDone}
        onDataChange={onDashboardDataChange}
      />
      <section className="dash priorities-only">
        <article className="panel job-priorities">
          <small>취업 준비 우선순위</small>
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
              "현대자동차·현대모비스·기아의 직무 차이를 설명할 수 있는가?",
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
  go,
}: {
  current: Week;
  week: number;
  setWeek: (n: number) => void;
  done: Record<string, boolean>;
  setDone: (v: Record<string, boolean>) => void;
  go: (v: View) => void;
}) {
  const tracks = parallelTracks(current);
  const mainCompleted = current.tasks.filter((_, i) => done[`w${week}-${i}`]).length;
  const trackCompleted = tracks.filter((_, i) => done[`p${week}-${i}`]).length;
  const weekRate = Math.round(((mainCompleted + trackCompleted) / (current.tasks.length + tracks.length)) * 100);
  return (
    <Page
      title="20주 학습 계획"
      sub="전동킥보드 강의를 중심으로 HW 실습·자동차 확장·독립 프로젝트·영어·취업 준비를 매주 병렬로 진행합니다."
    >
      <article className="study-restart">
        <b>새 시작 원칙</b>
        <span>체크한 결과에 따라 가장 먼저 남은 주차로 자동 이동</span>
        <span>6개 취업 트랙을 매주 최소 단위로 병행</span>
        <span>평일 최대 2시간·주간 핵심 목표 최대 3개</span>
      </article>
      <div className="study-utilities">
        <span>필요할 때만 열기</span>
        <button onClick={() => go("planner")}>주간 시간표</button>
        <button onClick={() => go("review")}>주간 회고</button>
      </div>
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
                  {w.dates} · {koreanPhase(w.phase)}
                </small>
              </span>
            </button>
          ))}
        </div>
        <article className="week">
          <div className="weekhead">
            <div>
              <small>
                {String(week).padStart(2, "0")}주차 · {current.dates}
              </small>
              <h2>{current.title}</h2>
              <b>{koreanPhase(current.phase)}</b>
            </div>
            <strong>
              {weekRate}%
            </strong>
          </div>
          <h3>핵심 학습과 실습</h3>
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
          <h3>병렬 학습 · 매주 끊기지 않게</h3>
          <div className="parallel-track-checks">
            {tracks.map(([name, task], i) => {
              const id = `p${week}-${i}`;
              return <label key={id}>
                <input type="checkbox" checked={!!done[id]} onChange={() => setDone({ ...done, [id]: !done[id] })} />
                <i>{done[id] && <Check />}</i>
                <span><b>{name}</b><small>{task}</small></span>
              </label>;
            })}
          </div>
          <div className="deliver">
            <small>주간 결과물</small>
            {current.deliverables.map((x) => (
              <b key={x}>↗ {x}</b>
            ))}
          </div>
          <div className="question">
            <FileQuestion />
            <div>
              <small>예상 면접 질문</small>
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
      ["현대자동차", "현대모비스", "기아"].indexOf(a.company) -
      ["현대자동차", "현대모비스", "기아"].indexOf(b.company),
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
      title="직무 역량"
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
              "설명 가능",
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
  const activityTypes = ["인턴", "창업", "캡스톤디자인", "공모전", "개인 프로젝트", "팀 프로젝트", "연구", "동아리", "봉사·멘토링", "아르바이트", "교육·강의", "기타"];
  const [activity, setActivity] = useState(() =>
    JSON.parse(localStorage.getItem("ahw-journal-activity") || '{"category":"인턴","title":"","organization":"","role":""}'),
  );
  const [gptAnswer, setGptAnswer] = useState("");
  const [revision, setRevision] = useState(0);
  const [saved, setSaved] = useState(false);
  useEffect(() => localStorage.setItem("ahw-journal-date", date), [date]);
  useEffect(() => localStorage.setItem("ahw-journal-activity", JSON.stringify(activity)), [activity]);
  const formatDate = (v: string) => {
    const [y, m, d] = v.split("-");
    return `${y}. ${Number(m)}. ${Number(d)}.`;
  };
  const gptPrompt = `아래 내용은 자소서 초안이 아니라 ${formatDate(date)}에 작성한 개인 일기야. 여러 날짜의 기록을 충분히 모은 뒤, 나중에 서로 합쳐 자소서를 작성할 계획이야. 지금은 이 하루의 기록에서 실제로 자소서에 보탤 만한 사실이 있는지만 엄격하게 선별해줘.\n\n[활동 정보]\n- 활동 유형: ${activity.category}\n- 활동명: ${activity.title || "미입력"}\n- 기관·팀: ${activity.organization || "미입력"}\n- 내 역할: ${activity.role || "미입력"}\n- 목표 직무: 자동차 전장 HW R&D\n- 목표 기업: 1순위 현대자동차, 2순위 현대모비스, 3순위 기아\n\n[이날의 일기 원문]\n${value}\n\n[판단 원칙]\n1. 모든 날짜에서 억지로 자소서 소재를 만들지 마. 직무 역량, 문제 해결, 협업, 책임감, 도전, 개선, 수치로 확인되는 결과 중 실제 근거가 있을 때만 뽑아줘.\n2. 기록에 없는 행동·성과·수치·의도는 절대 추측하거나 만들어내지 마.\n3. 완성된 STAR나 자소서 문장을 쓰지 마. 나중에 여러 날짜의 기록과 합칠 수 있는 짧은 후보 메모만 만들어줘.\n4. 일상적인 내용뿐이거나 근거가 부족하면 솔직하게 “이 날은 자소서에 활용할 만한 소재가 없습니다.”라고 답해줘.\n5. 답변은 홈페이지에 그대로 붙여넣을 것이므로 아래 형식과 제목을 유지하고 짧고 읽기 쉽게 작성해줘.\n\n[출력 형식]\n[판정]\n활용 후보 있음 / 없음 중 하나\n\n판정이 ‘없음’이면 아래 한 줄만 추가:\n[짧은 이유]\n이 날은 자소서에 활용할 만한 소재가 없습니다. — 이유를 한 문장으로 작성\n\n판정이 ‘활용 후보 있음’이면 아래만 작성:\n[소재 한 줄]\n핵심 사실을 1문장으로 요약\n\n[쓸 수 있는 근거]\n- 원문에서 확인되는 행동·결과를 최대 3개\n\n[보이는 역량]\n- 역량 키워드 최대 3개\n\n[나중에 합칠 키워드]\n- 같은 문제·프로젝트·역량의 다른 날짜 기록을 찾기 위한 키워드 최대 3개\n\n[추가로 확인할 사실]\n- 수치, 본인 기여 범위 등 정말 필요한 질문만 최대 2개`;
  const copyPrompt = async () => {
    if (!value.trim()) return;
    await navigator.clipboard.writeText(gptPrompt);
    alert("GPT 질문이 복사되었습니다. ChatGPT에 붙여 넣어 질문하세요.");
  };
  const save = () => {
    if (!value.trim() || !gptAnswer.trim()) return;
    const noMaterial = /\[판정\]\s*없음|활용할 만한 소재가 없습니다/.test(gptAnswer);
    const materialLine = gptAnswer.match(/\[소재 한 줄\]\s*\n?([^\n]+)/)?.[1]?.trim();
    const old = JSON.parse(localStorage.getItem("ahw-experiences") || "[]");
    localStorage.setItem(
      "ahw-experiences",
      JSON.stringify([
        ...old,
        {
          id: Date.now(),
          date,
          category: activity.category,
          title: activity.title || `${formatDate(date)} ${activity.category} 경험`,
          organization: activity.organization,
          role: activity.role,
          source: value,
          gptPrompt,
          gptAnswer,
          screeningVersion: 1,
          usable: !noMaterial,
          usefulness: noMaterial ? "없음" : "보통",
          summary: noMaterial
            ? "이 날은 자소서에 활용할 만한 소재가 없습니다."
            : materialLine || "GPT가 선별한 자소서 활용 후보가 있습니다.",
        },
      ]),
    );
    setRevision((v) => v + 1);
    setSaved(true);
    setGptAnswer("");
    setValue("");
  };
  return (
    <Page
      title="빠른 기록·경험 보관함"
      sub="일기를 날짜별로 쌓고, 나중에 합칠 만한 자소서 소재가 있는 날만 짧게 선별합니다."
    >
      <article className="security">
        인턴·창업·공모전 기록에는 회사 또는 팀의 기밀정보, 실제 제품명·고객사·비공개 자료를 적지 마세요.
      </article>
      <article className="panel journal">
        <div className="activity-meta">
          <label>활동 유형<select value={activity.category} onChange={(e) => setActivity({ ...activity, category: e.target.value })}>{activityTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
          <label>활동명<input value={activity.title} onChange={(e) => setActivity({ ...activity, title: e.target.value })} placeholder="예: 스마트 모빌리티 캡스톤디자인" /></label>
          <label>기관·팀<input value={activity.organization} onChange={(e) => setActivity({ ...activity, organization: e.target.value })} placeholder="회사·학교·팀 이름" /></label>
          <label>내 역할<input value={activity.role} onChange={(e) => setActivity({ ...activity, role: e.target.value })} placeholder="예: 회로 설계·팀장·기획" /></label>
        </div>
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
            "오늘 한 일",
            "기억에 남은 문제",
            "내가 한 판단·행동",
            "결과와 느낀 점",
            "나중에 기억할 사실",
          ].map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
        <textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSaved(false);
          }}
          placeholder={
            "오늘 있었던 일을 편하게 일기처럼 적어주세요.\n작은 문제, 내가 한 행동, 들은 피드백이나 숫자가 있다면 사실 그대로 남겨두세요.\n자소서에 쓸 내용이 없어도 괜찮습니다."
          }
        />
        <div className="journal-flow">
          <b>정리 순서</b>
          <span>
            ① 일기 작성 → ② GPT 선별 질문 복사 → ③ 답변 붙여넣기 → ④ 기록 저장
          </span>
        </div>
        <section className="gpt-workspace">
          <div>
            <small>GPT 자소서 소재 선별 질문</small>
            <p>
              자소서를 바로 쓰지 않고, 이 날의 일기에서 나중에 합칠 만한
              사실이 있는지만 짧게 판단하도록 요청합니다.
            </p>
            <button type="button" onClick={copyPrompt} disabled={!value.trim()}>
              GPT 질문 복사
            </button>
          </div>
          <label>
            <b>GPT 선별 결과 붙여넣기</b>
            <textarea
              value={gptAnswer}
              onChange={(e) => setGptAnswer(e.target.value)}
              placeholder="GPT 답변을 제목과 줄바꿈 그대로 붙여 넣으세요.\n소재가 없는 날은 ‘이 날은 자소서에 활용할 만한 소재가 없습니다.’라는 판단도 기록으로 저장됩니다."
            />
          </label>
        </section>
        <div className="actions">
          <small>일기 원문은 자동 저장됩니다. GPT 답변을 붙여 넣은 뒤 함께 보관하세요.</small>
          <button onClick={save} disabled={!value.trim() || !gptAnswer.trim()}>
            <Save /> 일기와 선별 결과 저장
          </button>
        </div>
      </article>
      {saved && (
        <div className="save-notice">
          일기와 GPT 선별 결과가 저장되었습니다. 아래 목록에서 확인할 수 있습니다.
        </div>
      )}
      <section className="bank-section">
        <div className="section-heading">
          <small>경험 보관함</small>
          <h2>날짜별 일기와 자소서 소재 후보</h2>
          <p>
            소재가 없는 날도 그대로 보관하고, 나중에 여러 날짜를 함께 검토하세요.
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
    const standard = defaults.map((item) => ({
      ...item,
      ...(saved.find((x: any) => x.week === item.week) || {}),
    }));
    const custom = saved.filter(
      (item: any) =>
        item.custom || !defaults.some((base) => base.week === item.week),
    );
    return [...standard, ...custom];
  });
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    q: "",
    answer: "",
  });
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
  const saveNew = (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      ...newQuestion,
      week: Date.now(),
      custom: true,
    };
    const updated = [...qs, item];
    setQs(updated);
    localStorage.setItem("ahw-interview", JSON.stringify(updated));
    setNewQuestion({ title: "", q: "", answer: "" });
    setCreating(false);
  };
  const removeQuestion = (week: number) => {
    const updated = qs.filter((item) => item.week !== week);
    setQs(updated);
    localStorage.setItem("ahw-interview", JSON.stringify(updated));
  };
  return (
    <Page
      title="면접 질문 보관함"
      sub="질문을 내 지원 직무에 맞게 수정하고, 실제 경험에 근거한 답변을 준비합니다."
    >
      <div className="interview-toolbar">
        <div>
          <b>내 질문을 직접 추가할 수 있습니다.</b>
          <span>
            지원 공고나 면접 후 받은 질문을 저장하고 답변을 준비하세요.
          </span>
        </div>
        <button onClick={() => setCreating(!creating)}>
          <Plus /> {creating ? "작성 닫기" : "새 질문 만들기"}
        </button>
      </div>
      {creating && (
        <form className="interview-create" onSubmit={saveNew}>
          <label>
            질문 분류
            <input
              required
              value={newQuestion.title}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, title: e.target.value })
              }
              placeholder="예: 현대자동차 직무면접·회로설계"
            />
          </label>
          <label>
            면접 질문
            <textarea
              required
              value={newQuestion.q}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, q: e.target.value })
              }
              placeholder="질문을 정확하게 입력하세요."
            />
          </label>
          <label>
            내 답변 메모
            <textarea
              value={newQuestion.answer}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, answer: e.target.value })
              }
              placeholder="상황 → 문제 → 직접 한 행동 → 결과 → 배운 점"
            />
          </label>
          <button type="submit">
            <Save /> 질문 저장
          </button>
        </form>
      )}
      <div className="questions">
        {qs.map((x) => (
          <article className="interview-card" key={x.week}>
            <b>{x.custom ? "MY" : `W${x.week}`}</b>
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
            {x.custom && (
              <button
                className="interview-delete-button"
                onClick={() => removeQuestion(x.week)}
              >
                삭제
              </button>
            )}
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
            <small>프로젝트 진행률</small>
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
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("활용도순");
  const [visibleLimit, setVisibleLimit] = useState(12);
  const experienceCategories = ["전체", "인턴", "창업", "캡스톤디자인", "공모전", "개인 프로젝트", "팀 프로젝트", "연구", "동아리", "봉사·멘토링", "아르바이트", "교육·강의", "기타"];
  const usefulnessLevels = ["높음", "보통", "보류", "없음"];
  const getUsefulness = (item: any) =>
    item.usefulness ||
    (item.usable === false ? "없음" : item.usable === true || item.gptAnswer ? "보통" : "보류");
  const usefulnessScore: Record<string, number> = { 높음: 3, 보통: 2, 보류: 1, 없음: 0 };
  const visibleItems = items
    .filter((item) => categoryFilter === "전체" || (item.category || "인턴") === categoryFilter)
    .filter((item) => {
      const keyword = search.trim().toLowerCase();
      if (!keyword) return true;
      return [item.date, item.category, item.title, item.organization, item.role, item.summary, item.source, item.gptAnswer]
        .some((value) => String(value || "").toLowerCase().includes(keyword));
    })
    .sort((a, b) => sortOrder === "최신순"
      ? String(b.date || b.id).localeCompare(String(a.date || a.id))
      : usefulnessScore[getUsefulness(b)] - usefulnessScore[getUsefulness(a)] ||
        String(b.date || b.id).localeCompare(String(a.date || a.id)));
  const shownItems = visibleItems.slice(0, visibleLimit);
  const updateUsefulness = (item: any, usefulness: string, event: React.ChangeEvent<HTMLSelectElement>) => {
    event.stopPropagation();
    const updated = items.map((current) => current.id === item.id ? { ...current, usefulness } : current);
    setItems(updated);
    localStorage.setItem("ahw-experiences", JSON.stringify(updated));
  };
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
          <p>날짜별 일기와 GPT가 짧게 선별한 자소서 소재 후보를 확인하세요.</p>
        </div>
      )}
      <div className="experience-filter">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setVisibleLimit(12); }}
          placeholder="날짜·활동·기관·키워드 검색"
          aria-label="저장 기록 검색"
        />
        <select aria-label="활동 유형 필터" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setVisibleLimit(12); }}>
          {experienceCategories.map((category) => <option key={category}>{category}</option>)}
        </select>
        <select aria-label="기록 정렬" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option>활용도순</option>
          <option>최신순</option>
        </select>
        <span>{shownItems.length}/{visibleItems.length}개 표시</span>
      </div>
      <div className="experience-list">
        {!visibleItems.length && (
          <div className="experience-empty">
            <Sparkles />
            <b>아직 직접 저장한 경험이 없습니다.</b>
            <span>
              위 빠른 기록에 실제로 한 일을 작성하고 분석한 뒤 저장하면 여기에
              표시됩니다.
            </span>
          </div>
        )}
        {shownItems.map((x: any) => (
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
                <small>{x.date ? `${x.date} · ` : ""}{x.category || "인턴"}{x.organization ? ` · ${x.organization}` : ""}{x.role ? ` · ${x.role}` : ""}</small>
                <h2>{x.title}</h2>
                {x.screeningVersion && (
                  <em className={x.usable ? "material-status usable" : "material-status empty"}>
                    {x.usable ? "활용 후보 있음" : "이 날은 소재 없음"}
                  </em>
                )}
                <p>{x.summary}</p>
              </div>
              <div className="experience-actions">
                <label onClick={(event) => event.stopPropagation()}>
                  <small>활용도</small>
                  <select
                    aria-label={`${x.title} 자소서 활용도`}
                    value={getUsefulness(x)}
                    onChange={(event) => updateUsefulness(x, event.target.value, event)}
                  >
                    {usefulnessLevels.map((level) => <option key={level}>{level}</option>)}
                  </select>
                </label>
                {x.source && (
                  <button type="button" onClick={(e) => startEdit(x, e)}>
                    수정
                  </button>
                )}
                <b>{open === x.id ? "접기 −" : "기록 보기 +"}</b>
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
                        <small>저장한 경험 수정</small>
                        <h3>저장한 경험 수정</h3>
                      </div>
                      <span>수정 내용은 이 기기에 자동 반영됩니다.</span>
                    </div>
                    <div className="edit-grid">
                      <label>
                        활동 유형
                        <select value={draft.category || "인턴"} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                          {experienceCategories.filter((category) => category !== "전체").map((category) => <option key={category}>{category}</option>)}
                        </select>
                      </label>
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
                        자소서 활용도
                        <select value={draft.usefulness || getUsefulness(draft)} onChange={(e) => setDraft({ ...draft, usefulness: e.target.value })}>
                          {usefulnessLevels.map((level) => <option key={level}>{level}</option>)}
                        </select>
                      </label>
                      <label>
                        기관·팀
                        <input value={draft.organization || ""} onChange={(e) => setDraft({ ...draft, organization: e.target.value })} />
                      </label>
                      <label>
                        내 역할
                        <input value={draft.role || ""} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
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
                        GPT 자소서 소재 선별 결과
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
                {x.screeningVersion ? (
                  <div className="screening-result">
                    <div>
                      <small>GPT 선별 결과</small>
                      <b>{x.usable ? "나중에 합쳐볼 소재 후보" : "이 날은 활용 소재 없음"}</b>
                    </div>
                    <p>{x.gptAnswer}</p>
                    <button
                      type="button"
                      onClick={async (event) => {
                        event.stopPropagation();
                        await navigator.clipboard.writeText(x.gptAnswer || "");
                      }}
                    >
                      선별 결과 복사
                    </button>
                  </div>
                ) : (<>
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
                </>)}
                {x.source && (
                  <div className="saved-material">
                    <h3>내가 기록한 원문</h3>
                    <p>{x.source}</p>
                  </div>
                )}
                {x.gptAnswer && !x.screeningVersion && (
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
      {shownItems.length < visibleItems.length && (
        <button className="experience-more" onClick={() => setVisibleLimit((value) => value + 12)}>
          다음 기록 12개 더 보기
        </button>
      )}
    </>
  );
}
function Review({ completed, total }: { completed: number; total: number }) {
  const rate = Math.round((completed / total) * 100);
  const [text, setText] = useState(
    () => localStorage.getItem("ahw-review") || "",
  );
  const [courseReview, setCourseReview] = useState<Record<string, string>>(() =>
    JSON.parse(localStorage.getItem("ahw-kickboard-review-v1") || "{}"),
  );
  useEffect(() => localStorage.setItem("ahw-review", text), [text]);
  useEffect(
    () =>
      localStorage.setItem("ahw-kickboard-review-v1", JSON.stringify(courseReview)),
    [courseReview],
  );
  return (
    <Page
      title="주간 회고"
      sub="일요일 30분, 밀린 일을 자동으로 쌓지 말고 다음 주를 다시 설계합니다."
    >
      <div className="review-grid">
        <article className="panel score">
          <small>주간 완료율</small>
          <strong>{rate}%</strong>
          <div className="bar">
            <i style={{ width: rate + "%" }} />
          </div>
          <p>
            {completed}개 완료 · {total - completed}개 남음
          </p>
        </article>
        <article className="panel">
          <h2>미완료 항목 처리</h2>
          <div className="review-options">
            {[
              "다음 주로 이동",
              "생략",
              "범위 축소",
              "날짜 재조정",
              "다른 활동에서 완료",
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
      <article className="panel course-review">
        <small>교육 프로젝트 주간 회고</small>
        <h2>전동킥보드 강의가 실제 HW 역량으로 바뀌었는지 확인</h2>
        <div>
          {[
            ["lectures", "이번 주에 실제로 본 강의"],
            ["time", "강의·실습 실제 학습시간"],
            ["practice", "직접 수행한 회로·펌웨어·측정"],
            ["deliverable", "결과물 보관함에 남긴 증거"],
            ["learned", "배운 것과 직접 해본 것의 차이"],
            ["unknown", "이해하지 못한 것·부족한 증거"],
            ["explain", "부품·회로 선정 이유를 설명할 수 있는가?"],
            ["automotive", "자동차 전장으로 확장할 내용"],
            ["internship", "한국알프스 경험 연결(기밀 제외)"],
            ["carryDecision", "미완료 처리: 다음 주 이동 / 범위 축소 / 날짜 재조정 / 생략 / 다른 활동에서 완료"],
            ["next", "다음 주 핵심 목표 최대 3개"],
          ].map(([key, label]) => (
            <label key={key}>
              {label}
              <textarea
                value={courseReview[key] || ""}
                onChange={(e) =>
                  setCourseReview({ ...courseReview, [key]: e.target.value })
                }
              />
            </label>
          ))}
        </div>
        <small>자동 저장됨</small>
      </article>
    </Page>
  );
}
function SettingsPage() {
  const savedCredentials = getSyncCredentials();
  const [syncCode, setSyncCode] = useState(savedCredentials.code);
  const [syncPin, setSyncPin] = useState(savedCredentials.pin);
  const [syncConnected, setSyncConnected] = useState(!!savedCredentials.code);
  const [syncStatus, setSyncStatus] = useState(savedCredentials.code ? "이 기기는 클라우드 동기화에 연결되어 있습니다." : "아직 연결되지 않았습니다.");
  const [syncWorking, setSyncWorking] = useState(false);
  useEffect(() => {
    const onStatus = (event: Event) => setSyncStatus((event as CustomEvent<string>).detail);
    window.addEventListener("ahw-sync-status", onStatus);
    return () => window.removeEventListener("ahw-sync-status", onStatus);
  }, []);
  const runSync = async (work: () => Promise<unknown>, success: string) => {
    setSyncWorking(true);
    try {
      await work();
      setSyncStatus(success);
      return true;
    } catch (error) {
      setSyncStatus(error instanceof Error ? error.message : "동기화에 실패했습니다.");
      return false;
    } finally {
      setSyncWorking(false);
    }
  };
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
      title="설정·백업"
      sub="노트북과 휴대폰을 연결하고 데이터를 안전하게 백업합니다."
    >
      <article className="panel cloud-sync">
        <div className="cloud-sync-heading">
          <div>
            <small>PC ↔ 모바일</small>
            <h2>암호화 클라우드 동기화</h2>
            <p>두 기기에 같은 동기화 코드와 비밀번호를 입력하면 15초 안에 최신 기록이 반영됩니다.</p>
          </div>
          <span className={syncConnected ? "connected" : ""}>{syncConnected ? "연결됨" : "연결 안 됨"}</span>
        </div>
        <div className="cloud-sync-form">
          <label>
            동기화 코드
            <input value={syncCode} onChange={(event) => setSyncCode(event.target.value.toUpperCase())} placeholder="두 기기에 같은 코드 입력" />
          </label>
          <button type="button" className="secondary" onClick={() => setSyncCode(generateSyncCode())}>새 코드 만들기</button>
          <label>
            동기화 비밀번호
            <input type="password" value={syncPin} onChange={(event) => setSyncPin(event.target.value)} placeholder="6자 이상 · 두 기기에서 동일하게" />
          </label>
          <button
            type="button"
            disabled={syncWorking}
            onClick={async () => {
              if (await runSync(() => connectCloud(syncCode, syncPin), "클라우드 동기화 연결이 완료되었습니다.")) setSyncConnected(true);
            }}
          >
            이 기기 연결
          </button>
        </div>
        <div className="cloud-sync-actions">
          <button disabled={syncWorking || !syncConnected} onClick={() => runSync(() => uploadCloud(syncCode, syncPin), "이 기기의 최신 데이터를 클라우드에 저장했습니다.")}>지금 클라우드에 저장</button>
          <button disabled={syncWorking || !syncConnected} onClick={() => runSync(() => downloadCloud(syncCode, syncPin), "클라우드 데이터를 가져왔습니다.")}>클라우드에서 다시 받기</button>
          <button
            className="disconnect"
            disabled={syncWorking || !syncConnected}
            onClick={() => {
              disconnectCloud();
              setSyncStatus("이 기기의 동기화 연결을 해제했습니다. 클라우드 데이터는 삭제되지 않습니다.");
              setSyncCode("");
              setSyncPin("");
              setSyncConnected(false);
            }}
          >이 기기 연결 해제</button>
        </div>
        <p className="sync-status">{syncWorking ? "동기화 중…" : syncStatus}</p>
        <aside>일기와 지원 정보는 이 기기에서 암호화된 뒤 전송됩니다. 동기화 코드와 비밀번호를 잃어버리면 복구할 수 없으니 따로 보관하세요.</aside>
      </article>
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
      sub="현대자동차·현대모비스·기아 자동차 전장 HW/회로설계 지원을 위해 무엇을 준비하고 어떤 증거를 남길지 정리했습니다."
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
    ...optimizedDailySchedule.slice(1),
    optimizedDailySchedule[0],
  ];
  return (
    <Page
      title="주간 일정"
      sub="인턴·출퇴근·헬스를 유지하면서 요일별 체크리스트를 실제 수행할 수 있도록 배치한 시간표입니다."
    >
      <article className="schedule-rule">
        <b>일정 운영 원칙</b>
        <span>월·수·금 30~50분 회복형</span>
        <span>화·목 80~100분 집중형</span>
        <span>토 실습 · 일 보충과 회고</span>
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
