import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Send,
  ShoppingCart,
  Target,
  Wrench,
} from "lucide-react";
import "./circuit-starter.css";

type Purchase = {
  id: string;
  category: string;
  name: string;
  reason: string;
  purchased: boolean;
  model: string;
  price: number | string;
  link: string;
  memo: string;
};
type Lab = {
  id: string;
  name: string;
  status: string;
  blocked: string;
  action: string;
  result: string;
  date: string;
  purpose?: string;
  io?: string;
  parts?: string;
  calculation?: string;
  difference?: string;
  lesson?: string;
  next?: string;
};

const stages = [
  {
    title: "회로 기초",
    learn: "전압·전류·저항·전력, 옴의 법칙, 직렬·병렬",
    parts: "LTspice 또는 종이와 계산기",
    task: "LED 저항값과 전압분배 계산",
    done: "계산 과정과 부품 역할을 말로 설명",
  },
  {
    title: "브레드보드 실습",
    learn: "전원 레일과 노드, 극성, 멀티미터 측정",
    parts: "브레드보드·점퍼선·LED·저항·버튼",
    task: "LED와 버튼 회로를 직접 연결",
    done: "회로도와 실제 연결을 서로 대조",
  },
  {
    title: "MCU·센서",
    learn: "GPIO·ADC·UART와 센서 인터페이스",
    parts: "NUCLEO-G431RB·가변저항 또는 센서 모듈",
    task: "센서값을 읽고 조건에 따라 LED 제어",
    done: "입력값과 출력 동작을 기록",
  },
  {
    title: "CAN 통신",
    learn: "CAN Controller·Transceiver·종단저항",
    parts: "Nucleo 2개·3.3V Transceiver 2개·120Ω",
    task: "두 보드 사이 센서 데이터 송수신",
    done: "메시지 ID·주기·데이터를 확인",
  },
  {
    title: "12V 전원·보호",
    learn: "Buck·퓨즈·역극성·TVS·전류 제한",
    parts: "DC 전원공급기·Buck 모듈·보호 부품",
    task: "12V를 5V 또는 3.3V로 안전하게 변환",
    done: "입출력 전압·전류와 발열 기록",
  },
  {
    title: "KiCad 회로도",
    learn: "Symbol·Net·ERC·Block 설계",
    parts: "KiCad와 검증된 데이터시트",
    task: "전원·MCU·CAN 블록별 회로도 작성",
    done: "각 부품값과 선정 근거 기록",
  },
  {
    title: "PCB·측정·디버깅",
    learn: "배치·배선·DRC·Bring-up·가설 검증",
    parts: "PCB·납땜도구·멀티미터·필요 시 오실로스코프",
    task: "전원부터 순서대로 조립·측정",
    done: "실패와 수정 전후 결과를 포트폴리오화",
  },
];

const productTypes = [
  [
    "단일 부품",
    "저항·LED·커패시터·다이오드·IC",
    "주변회로와 연결을 직접 구성해야 합니다.",
  ],
  [
    "모듈",
    "센서나 전원 IC가 작은 PCB에 조립된 제품",
    "점퍼선으로 쉽게 연결해 기능을 먼저 검증합니다.",
  ],
  [
    "개발보드",
    "MCU·전원·USB·디버거가 포함된 보드",
    "프로그래밍과 제어를 안전하게 연습합니다.",
  ],
  [
    "완성 회로·키트",
    "설명서와 실습 부품이 함께 제공되는 제품",
    "기초회로를 순서대로 따라 하기에 적합합니다.",
  ],
];

const basePurchases: Purchase[] = [
  ...[
    [
      "nucleo1",
      "NUCLEO-G431RB 개발보드 1개",
      "USB 디버거 내장, MCU·ADC·CAN 학습",
    ],
    ["breadboard", "830포인트 브레드보드", "납땜 전 예제 회로 구성"],
    ["jumpers", "수–수·수–암 점퍼선", "보드와 모듈 연결"],
    ["resistors", "1/4W 저항 키트", "LED·풀업·전압분배 실습"],
    ["led", "LED 세트", "GPIO 출력 확인"],
    ["switch", "택트 스위치", "디지털 입력 실습"],
    ["pot", "10kΩ 가변저항", "ADC 센서 입력 모사"],
    ["meter", "디지털 멀티미터", "전압·저항·연속성 측정"],
    ["usb", "개발보드용 USB 케이블", "전원·다운로드·디버깅"],
    ["sensor", "BME280·BH1750·NTC 중 1개", "실제 센서 데이터 실습"],
  ].map((x) => ({
    id: x[0],
    category: "지금 구매",
    name: x[1],
    reason: x[2],
    purchased: false,
    model: "",
    price: "",
    link: "",
    memo: "",
  })),
  ...[
    ["nucleo2", "NUCLEO-G431RB 추가 1개", "두 노드 사이 CAN 송수신"],
    ["canmodule", "3.3V SN65HVD230 모듈 2개", "CAN 물리 신호 변환"],
    ["term", "120Ω 종단저항 2개", "버스 양 끝 반사 억제"],
    ["twist", "CAN용 꼬임선", "CAN High·Low 연결"],
    ["sensor2", "센서 모듈 1개", "CAN 데이터 생성"],
  ].map((x) => ({
    id: x[0],
    category: "기초 실습 후 구매",
    name: x[1],
    reason: x[2],
    purchased: false,
    model: "",
    price: "",
    link: "",
    memo: "",
  })),
  ...[
    ["psu", "전류 제한 0~30V DC 전원공급기", "안전한 12V 입력 실습"],
    ["buck", "LM2596 Buck 모듈", "전원 변환 원리 학습"],
    ["fuse", "퓨즈 또는 PTC", "과전류 보호"],
    ["schottky", "쇼트키 다이오드", "역극성 보호 실습"],
    ["tvs", "TVS 다이오드", "과도전압 보호 이해"],
    ["caps", "전해·세라믹 커패시터", "전원 안정화·필터링"],
  ].map((x) => ({
    id: x[0],
    category: "CAN 성공 후 구매",
    name: x[1],
    reason: x[2],
    purchased: false,
    model: "",
    price: "",
    link: "",
    memo: "",
  })),
  ...[
    ["iron", "온도조절 인두기", "PCB 조립"],
    ["solder", "납·플럭스·흡착선", "납땜과 수정"],
    ["tweezers", "정밀 핀셋", "소형 부품 조립"],
    ["pcbparts", "PCB와 실제 설계 부품", "최종 시제품 제작"],
  ].map((x) => ({
    id: x[0],
    category: "PCB 설계 직전 구매",
    name: x[1],
    reason: x[2],
    purchased: false,
    model: "",
    price: "",
    link: "",
    memo: "",
  })),
  ...[
    ["scope", "오실로스코프", "PWM·CAN 파형·Ripple 측정"],
    ["battery", "자동차 배터리", "초보 실습에는 위험하고 불필요"],
    ["usbcan", "고가 USB-CAN 분석기", "초기에는 보드 2개로 대체"],
    ["partsbulk", "대용량 종합 부품 키트", "필요한 부품부터 구매"],
  ].map((x) => ({
    id: x[0],
    category: "지금은 사지 않아도 되는 것",
    name: x[1],
    reason: x[2],
    purchased: false,
    model: "",
    price: "",
    link: "",
    memo: "",
  })),
];

const labNames = [
  "LED 저항값 계산과 점등",
  "버튼 및 풀업·풀다운",
  "가변저항 ADC 측정",
  "센서값 UART 출력",
  "센서값에 따른 LED 제어",
  "두 STM32 사이 CAN 송수신",
  "CAN 센서 데이터 전송",
  "12V에서 5V 또는 3.3V 변환",
  "KiCad 블록별 회로도",
  "PCB 제작 및 측정",
];
const baseLabs: Lab[] = labNames.map((name, i) => ({
  id: `lab-${i + 1}`,
  name,
  status: "시작 전",
  blocked: "",
  action: "",
  result: "",
  date: "",
  ...(i < 3
    ? {
        purpose: "",
        io: "",
        parts: "",
        calculation: "",
        difference: "",
        lesson: "",
        next: "",
      }
    : {}),
}));
const categories = [
  "지금 구매",
  "기초 실습 후 구매",
  "CAN 성공 후 구매",
  "PCB 설계 직전 구매",
  "지금은 사지 않아도 되는 것",
];

const careerGuides = [
  [
    "기초 회로 계산과 검증",
    "계산값과 실제 LED 전류가 달랐던 상황",
    "전압·저항·전류·오차율",
    "저항값을 어떤 기준으로 선택했습니까?",
  ],
  [
    "입력회로와 논리 이해",
    "Floating 또는 채터링이 발생한 상황",
    "HIGH·LOW 전압, 저항값",
    "풀업과 풀다운의 차이는 무엇입니까?",
  ],
  [
    "ADC·센서 인터페이스",
    "ADC 값이 불안정하거나 예상과 달랐던 상황",
    "기준전압·ADC count·측정전압",
    "ADC 분해능과 오차 원인은 무엇입니까?",
  ],
  [
    "MCU 주변장치와 데이터 확인",
    "UART 출력이 깨지거나 값이 갱신되지 않은 상황",
    "Baud rate·주기·데이터 범위",
    "UART 설정을 어떻게 검증했습니까?",
  ],
  [
    "요구사항 기반 제어",
    "임계값 부근에서 LED가 반복 동작한 상황",
    "임계값·응답시간·반복 횟수",
    "Hysteresis가 필요한 이유는 무엇입니까?",
  ],
  [
    "CAN 통신·디버깅",
    "메시지가 수신되지 않거나 Error가 발생한 상황",
    "Bitrate·ID·종단저항·배선길이",
    "CAN에서 120Ω을 사용하는 이유는?",
  ],
  [
    "센서와 차량통신 통합",
    "센서 데이터 형식이나 주기가 맞지 않은 상황",
    "Scaling·Offset·주기·DLC",
    "센서값을 CAN 데이터로 어떻게 정의했습니까?",
  ],
  [
    "전원·보호와 안전한 Bring-up",
    "출력전압 강하·발열·과전류 상황",
    "입출력 전압·전류·Ripple·온도",
    "LDO와 Buck의 선택 기준은 무엇입니까?",
  ],
  [
    "회로도와 설계 근거",
    "ERC 오류나 핀 연결 누락 상황",
    "정격·부품값·데이터시트 페이지",
    "회로를 블록 단위로 설명해보세요.",
  ],
  [
    "PCB·측정·문제해결",
    "첫 전원 인가 실패 또는 측정값 불일치",
    "수정 전후 파형·전압·전류",
    "Bring-up 순서와 고장 분석 방법은?",
  ],
];

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function won(v: number | string) {
  return Number(v || 0).toLocaleString("ko-KR") + "원";
}

export default function CircuitStarter({
  onSendToJournal,
}: {
  onSendToJournal: (text: string, date: string) => void;
}) {
  const [openStage, setOpenStage] = useState(0);
  const [purchases, setPurchases] = useState<Purchase[]>(() =>
    load("ahw-circuit-purchases", basePurchases),
  );
  const [labs, setLabs] = useState<Lab[]>(() =>
    load("ahw-circuit-labs", baseLabs),
  );
  const [openLab, setOpenLab] = useState(0);
  const [careerOpen, setCareerOpen] = useState<number | null>(null);
  useEffect(
    () =>
      localStorage.setItem("ahw-circuit-purchases", JSON.stringify(purchases)),
    [purchases],
  );
  useEffect(
    () => localStorage.setItem("ahw-circuit-labs", JSON.stringify(labs)),
    [labs],
  );
  const updatePurchase = (id: string, key: keyof Purchase, value: any) =>
    setPurchases((v) =>
      v.map((x) => (x.id === id ? { ...x, [key]: value } : x)),
    );
  const updateLab = (id: string, key: keyof Lab, value: string) =>
    setLabs((v) => v.map((x) => (x.id === id ? { ...x, [key]: value } : x)));
  const total = useMemo(
    () => purchases.reduce((s, x) => s + Number(x.price || 0), 0),
    [purchases],
  );
  const bought = purchases.filter((x) => x.purchased).length;
  const completed = labs.filter((x) => x.status === "완료").length;
  const currentLab = labs.findIndex((x) => x.status !== "완료");
  const send = (lab: Lab) => {
    const d = lab.date || new Date().toISOString().slice(0, 10);
    const text = `[회로 프로젝트 실습]\n실습명: ${lab.name}\n상태: ${lab.status}\n목표·계산/선정 근거: ${lab.purpose || "없음"}\n막힌 점·해결 행동: ${lab.action || lab.blocked || "없음"}\n측정·검증 결과와 배운 점: ${lab.result || "없음"}`;
    onSendToJournal(text, d);
  };
  return (
    <section className="page circuit-starter">
      <div className="starter-hero">
        <div>
          <p className="eyebrow">ZERO EQUIPMENT → AUTOMOTIVE HW PORTFOLIO</p>
          <h1>회로 프로젝트 입문</h1>
          <p>
            처음부터 ECU를 설계하지 않습니다. 검증된 작은 회로를 계산하고
            연결하고 측정한 뒤, 블록을 하나씩 합칩니다.
          </p>
        </div>
        <div className="starter-status">
          <small>현재 할 일</small>
          <b>
            {currentLab < 0
              ? "10개 실습 완료"
              : `${currentLab + 1}. ${labs[currentLab].name}`}
          </b>
          <div>
            <span>
              구매 {bought}/{purchases.length}
            </span>
            <span>실습 {completed}/10</span>
          </div>
        </div>
      </div>
      <div className="starter-principles">
        {[
          "기초 → 예제 → MCU·센서 → CAN → 12V → PCB",
          "개발보드와 모듈로 동작부터 확인",
          "장비는 필요한 단계에만 구매",
          "자동차 배터리는 초보 실습에 사용 금지",
        ].map((x, i) => (
          <span key={x}>
            <b>0{i + 1}</b>
            {x}
          </span>
        ))}
      </div>

      <section className="starter-section">
        <div className="starter-title">
          <small>STEP ROADMAP</small>
          <h2>7단계 진행 흐름</h2>
          <p>단계를 눌러 공부할 내용과 완료 기준을 확인하세요.</p>
        </div>
        <div className="stage-grid">
          {stages.map((s, i) => (
            <article
              className={openStage === i ? "stage-card open" : "stage-card"}
              key={s.title}
              onClick={() => setOpenStage(openStage === i ? -1 : i)}
            >
              <header>
                <i>{i + 1}</i>
                <div>
                  <small>STEP {i + 1}</small>
                  <h3>{s.title}</h3>
                </div>
                {openStage === i ? <ChevronUp /> : <ChevronDown />}
              </header>
              {openStage === i && (
                <div className="stage-detail">
                  <p>
                    <b>학습</b>
                    {s.learn}
                  </p>
                  <p>
                    <b>준비물</b>
                    {s.parts}
                  </p>
                  <p>
                    <b>실습</b>
                    {s.task}
                  </p>
                  <p>
                    <b>완료 기준</b>
                    {s.done}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="starter-section">
        <div className="starter-title">
          <small>WHAT IS SOLD?</small>
          <h2>시중 제품의 네 가지 형태</h2>
          <p>처음에는 단일 IC보다 개발보드와 모듈로 동작을 먼저 확인하세요.</p>
        </div>
      <div className="product-types">
          {productTypes.map((x, i) => (
            <article key={x[0]}>
              <b>0{i + 1}</b>
              <h3>{x[0]}</h3>
              <strong>{x[1]}</strong>
              <p>{x[2]}</p>
            </article>
        ))}
      </div>
      <div className="nucleo-note">
        <b>첫 개발보드 추천 · NUCLEO-G431RB</b>
        <span>
          USB ST-LINK 디버거가 내장되어 별도 프로그래머 없이 시작할 수
          있습니다. ST가 공개한 공식 회로도에서 LED·버튼·전원·MCU 연결을
          블록별로 찾아보며 회로 읽기를 연습하세요.
        </span>
      </div>
      </section>

      <section className="starter-section tech-guide">
        <div className="starter-title">
          <small>CONNECTION GUIDE</small>
          <h2>CAN과 12V 전원은 이렇게 확장합니다</h2>
        </div>
        <div className="tech-columns">
          <article>
            <small>CAN COMMUNICATION</small>
            <h3>두 보드 사이 CAN 통신</h3>
            <div className="signal-flow">
              {[
                "STM32 A",
                "Transceiver",
                "CAN H / CAN L",
                "Transceiver",
                "STM32 B",
                ].map((x, i) => (
                  <span key={`${x}-${i}`}>
                  {x}
                  {i < 4 && <i>→</i>}
                </span>
              ))}
            </div>
            <p>
              <b>CAN Controller</b> MCU 내부에서 프레임·ID·송수신을 처리합니다.
            </p>
            <p>
              <b>CAN Transceiver</b> MCU 신호를 CAN High·Low 물리 신호로
              바꿉니다.
            </p>
            <p>SN65HVD230 모듈은 3.3V 계열, 최대 1Mbps 학습에 사용합니다.</p>
            <div className="warning">
              <b>MCP2515 모듈 확인</b>
              <span>
                단품 단종 상태 · 5V/3.3V 호환 · 8/16MHz Crystal · 120Ω 내장 여부
                확인. 최종 신규 설계 부품으로 권장하지 않습니다.
              </span>
            </div>
          </article>
          <article>
            <small>12V POWER & PROTECTION</small>
            <h3>안전한 전원 실습 순서</h3>
            <div className="signal-flow power">
              {[
                "12V PSU",
                "Fuse/PTC",
                "역극성",
                "TVS",
                "Buck",
                "5V/3.3V",
                "MCU",
              ].map((x, i) => (
                <span key={x}>
                  {x}
                  {i < 6 && <i>→</i>}
                </span>
              ))}
            </div>
            <p>
              <b>전원공급기 기준</b> 0~30V · 전류 제한 · 전압/전류 표시 · 출력
              ON/OFF · 단락 보호
            </p>
            <p>
              LM2596 모듈은 전원 변환 학습용이며 최종 자동차 ECU에 그대로
              사용하지 않습니다.
            </p>
            <div className="danger">
              자동차 배터리를 초보 실습 전원으로 직접 사용하지 마세요.
            </div>
          </article>
        </div>
      </section>

      <section className="starter-section scope-guide">
        <div>
          <Wrench />
          <small>지금 가능한 측정</small>
          <h3>멀티미터와 개발보드로 시작</h3>
          <p>저항·전압, LED·버튼, ADC 센서값, UART 출력, CAN 메시지 송수신</p>
        </div>
        <div>
          <Target />
          <small>오실로스코프가 필요한 시점</small>
          <h3>파형과 빠른 변화를 볼 때</h3>
          <p>
            PWM, CAN H·L, 전원 Ripple, 통신 오류, 과도응답. 구매 전
            학교·메이커스페이스를 활용하고 구매 시 2채널·50MHz 이상을
            검토하세요.
          </p>
        </div>
      </section>

      <section className="starter-section">
        <div className="starter-title cost-head">
          <div>
            <small>SHOPPING CHECKLIST</small>
            <h2>단계별 구매 관리</h2>
            <p>가격을 입력하면 단계별 합계와 전체 예상 비용을 계산합니다.</p>
          </div>
          <strong>
            {won(total)}
            <small>전체 예상 비용</small>
          </strong>
        </div>
        {categories.map((cat) => {
          const list = purchases.filter((x) => x.category === cat),
            sum = list.reduce((s, x) => s + Number(x.price || 0), 0);
          return (
            <details
              className="purchase-group"
              key={cat}
              open={cat === "지금 구매"}
            >
              <summary>
                <span>
                  <ShoppingCart />
                  {cat}
                </span>
                <b>
                  {list.filter((x) => x.purchased).length}/{list.length} ·{" "}
                  {won(sum)}
                </b>
              </summary>
              <div className="purchase-list">
                {list.map((x) => (
                  <article key={x.id} className={x.purchased ? "bought" : ""}>
                    <label className="purchase-check">
                      <input
                        type="checkbox"
                        checked={x.purchased}
                        onChange={(e) =>
                          updatePurchase(x.id, "purchased", e.target.checked)
                        }
                      />
                      <i>{x.purchased && <Check />}</i>
                      <span>
                        <b>{x.name}</b>
                        <small>{x.reason}</small>
                      </span>
                    </label>
                    <div className="purchase-fields">
                      <label>
                        실제 구매 제품
                        <input
                          value={x.model}
                          onChange={(e) =>
                            updatePurchase(x.id, "model", e.target.value)
                          }
                          placeholder="모델명·판매처"
                        />
                      </label>
                      <label>
                        가격
                        <input
                          type="number"
                          min="0"
                          value={x.price}
                          onChange={(e) =>
                            updatePurchase(x.id, "price", e.target.value)
                          }
                          placeholder="원"
                        />
                      </label>
                      <label>
                        구매 링크
                        <div className="link-input">
                          <input
                            type="url"
                            value={x.link}
                            onChange={(e) =>
                              updatePurchase(x.id, "link", e.target.value)
                            }
                            placeholder="https://..."
                          />
                          {x.link && (
                            <a href={x.link} target="_blank" rel="noreferrer">
                              <ExternalLink />
                            </a>
                          )}
                        </div>
                      </label>
                    </div>
                  </article>
                ))}
              </div>
            </details>
          );
        })}
      </section>

      <section className="starter-section">
        <div className="starter-title cost-head">
          <div>
            <small>PRACTICE TRACKER</small>
            <h2>10개 실습 진행 관리</h2>
            <p>상태를 체크하고, 목표·문제 해결·측정 결과만 짧게 남기세요.</p>
          </div>
          <strong>
            {completed * 10}%<small>실습 완료율</small>
          </strong>
        </div>
        <div className="lab-list">
          {labs.map((lab, i) => (
            <article
              className={openLab === i ? "lab-card open" : "lab-card"}
              key={lab.id}
            >
              <header onClick={() => setOpenLab(openLab === i ? -1 : i)}>
                <i>{i + 1}</i>
                <div>
                  <h3>{lab.name}</h3>
                  <small>
                    {lab.status}
                    {lab.date && ` · ${lab.date}`}
                  </small>
                </div>
                {openLab === i ? <ChevronUp /> : <ChevronDown />}
              </header>
              {openLab === i && (
                <div className="lab-body">
                  <div className="lab-status">
                    {["시작 전", "진행 중", "완료"].map((s) => (
                      <button
                        className={lab.status === s ? "active" : ""}
                        key={s}
                        onClick={() => {
                          updateLab(lab.id, "status", s);
                          if (s === "완료" && !lab.date) updateLab(lab.id, "date", new Date().toISOString().slice(0, 10));
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="lab-record-grid">
                    <label>
                      실습 목표·계산 또는 선정 근거
                      <textarea
                        value={lab.purpose || ""}
                        onChange={(e) =>
                          updateLab(lab.id, "purpose", e.target.value)
                        }
                        placeholder="무엇을 확인하며, 어떤 계산·근거를 사용했나요?"
                      />
                    </label>
                    <label>
                      막힌 점과 해결 행동
                      <textarea
                        value={lab.action || lab.blocked}
                        onChange={(e) =>
                          updateLab(lab.id, "action", e.target.value)
                        }
                        placeholder="문제가 있었을 때만 가설·측정·수정을 적으세요."
                      />
                    </label>
                    <label className="wide">
                      측정·검증 결과와 배운 점
                      <textarea
                        value={lab.result}
                        onChange={(e) =>
                          updateLab(lab.id, "result", e.target.value)
                        }
                        placeholder="핵심 수치, 예상과 실제 차이, 배운 점"
                      />
                    </label>
                  </div>
                  <div className="lab-actions">
                    <button
                      onClick={() => setCareerOpen(careerOpen === i ? null : i)}
                    >
                      자소서 활용법
                    </button>
                    <button className="send" onClick={() => send(lab)}>
                      <Send /> 빠른 기록·경험으로 보내기
                    </button>
                  </div>
                  {careerOpen === i && (
                    <div className="career-use">
                      <h4>이 실습을 자소서·면접으로 연결하는 법</h4>
                      <p>
                        <b>증명 역량</b>
                        {careerGuides[i][0]}
                      </p>
                      <p>
                        <b>문제 소재</b>
                        {careerGuides[i][1]}
                      </p>
                      <p>
                        <b>반드시 기록</b>
                        {careerGuides[i][2]}
                      </p>
                      <p>
                        <b>예상 면접</b>
                        {careerGuides[i][3]}
                      </p>
                      <p>
                        <b>STAR</b>상황은 짧게, 본인의 과제와 직접 행동을
                        구분하고, 측정한 결과와 직무 관점의 배움으로
                        마무리하세요.
                      </p>
                      <div>
                        과장 금지: 예제 회로를 참고한 범위와 직접 바꾼 부분을
                        구분하고, 확인하지 않은 원인을 단정하지 마세요.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
      <section className="starter-section writing-rules">
        <small>APPLICATION EVIDENCE RULE</small>
        <h2>“만들었다”보다 “왜 선택하고 어떻게 검증했는가”</h2>
        <div>
          {[
            "부품 선정 이유와 계산 근거",
            "예상값과 측정값 비교",
            "실패와 수정 전후 결과",
            "직접 수행과 참고 예제 구분",
            "신뢰성·성능·원가 관점 연결",
          ].map((x) => (
            <span key={x}>
              <Check />
              {x}
            </span>
          ))}
        </div>
      </section>
    </section>
  );
}
