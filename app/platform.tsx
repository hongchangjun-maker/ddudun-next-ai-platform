"use client";

import { useMemo, useState } from "react";
import type { CompanySettings } from "./lib/company";

type Journey = "consult" | "claim" | "partner";
type ChatMessage = { role: "guide" | "user"; text: string };

const journeys = {
  consult: {
    eyebrow: "맞춤 상담",
    title: "보험·상조 고민을 한 번에 정리해요",
    body: "상품 권유보다 현재 상황과 필요한 도움부터 차분하게 구조화합니다.",
    action: "상담 설계 시작",
    image: "/images/service-consult-v2.jpg",
    alt: "조용한 공간에서 상담 중인 두 여성",
    detail: "상황 정리 · 상담 연결",
  },
  claim: {
    eyebrow: "보험금 청구",
    title: "놓치기 쉬운 준비물을 먼저 확인해요",
    body: "사고 유형과 진행 단계를 바탕으로 필요한 준비 과정을 확인합니다.",
    action: "청구 준비 시작",
    image: "/images/service-claim-v2.jpg",
    alt: "태블릿으로 보험금 청구 준비를 확인하는 고객과 안내자",
    detail: "준비물 확인 · 진행 점검",
  },
  partner: {
    eyebrow: "파트너 활동",
    title: "나에게 맞는 활동 방식인지 검토해요",
    body: "겸업 기준, 활동 방식, 보상 유의사항을 투명하게 확인합니다.",
    action: "활동 적합성 살펴보기",
    image: "/images/service-partner-v2.jpg",
    alt: "고급스러운 라운지에서 대화하는 세 명의 전문직 파트너",
    detail: "기준 확인 · 활동 관리",
  },
} as const;

const prompts: Record<Journey, string[]> = {
  consult: ["무엇을 상담받고 싶으신가요?", "거주 지역과 편한 상담 시간을 알려주세요."],
  claim: ["어떤 사고나 진료에 대한 청구인가요?", "현재 보유한 서류를 알려주세요."],
  partner: ["현재 본업과 가능한 활동 시간을 알려주세요.", "가장 궁금한 활동 기준은 무엇인가요?"],
};

export function Platform({ company }: { company: CompanySettings | null }) {
  const [journey, setJourney] = useState<Journey>("consult");
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const selected = journeys[journey];

  const progress = useMemo(
    () => Math.min(100, messages.filter((message) => message.role === "user").length * 50),
    [messages],
  );

  function start(next: Journey) {
    setJourney(next);
    setMessages([]);
    setStep(0);
    setDraft("");
    setWorkspaceOpen(true);
  }

  function submit() {
    const clean = draft.trim();
    if (!clean) return;
    setMessages((current) => [
      ...current,
      { role: "user", text: clean },
      {
        role: "guide",
        text:
          step === 0
            ? "좋아요. 필요한 내용을 한 단계 더 확인할게요."
            : "입력하신 내용을 안전하게 정리했습니다. 현재는 AI 모델이 연결되지 않아 결과를 만들어내지 않고, 전문 상담 연결 전 준비 내용만 보여드립니다.",
      },
    ]);
    setDraft("");
    setStep((current) => Math.min(current + 1, 2));
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="AI유니패스 파트너 홈">
          <span className="brand-mark">U</span>
          <span className="brand-name">AI유니패스 <b>파트너</b></span>
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#journeys">서비스</a>
          <a href="#workspace">AI 워크스페이스</a>
          <a href="#trust">안심 기준</a>
        </nav>
        <button className="header-cta" onClick={() => start("consult")}>
          상담 시작 <span aria-hidden="true">↗</span>
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-photo" role="img" aria-label="고급 라운지에서 태블릿을 보며 상담하는 전문가와 고객" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> HUMAN-FIRST LIFE PARTNER</p>
          <h1>
            복잡한 선택 앞에서
            <br />
            <em>당신의 다음 길</em>을
            <br />
            함께 찾습니다.
          </h1>
          <p className="hero-lede">
            먼저 묻고, 꼭 필요한 정보만 정리합니다.
            <br />
            상담·청구·파트너 활동을 하나의 흐름으로 연결하는 생활금융 워크스페이스.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={() => start("consult")}>
              무료 상담 시작하기 <span>↗</span>
            </button>
            <a className="text-link light" href="#journeys">서비스 살펴보기 <span>↓</span></a>
          </div>
        </div>
        <aside className="hero-console" aria-label="서비스 선택">
          <div className="console-top">
            <span>PERSONAL CONCIERGE</span>
            <i>OPEN</i>
          </div>
          <p>지금 가장 필요한 도움은 무엇인가요?</p>
          <div className="console-options">
            {(Object.keys(journeys) as Journey[]).map((key, index) => (
              <button key={key} onClick={() => start(key)}>
                <span>0{index + 1}</span>
                <b>{journeys[key].eyebrow}</b>
                <i>→</i>
              </button>
            ))}
          </div>
        </aside>
        <div className="hero-proof" aria-label="서비스 원칙">
          <span>01</span><p>가입 강요 없이</p>
          <span>02</span><p>과장된 약속 없이</p>
          <span>03</span><p>최종 판단은 사람에게</p>
        </div>
      </section>

      <section className="intro section" aria-labelledby="intro-title">
        <div className="intro-label">
          <span>AI UNIPASS PARTNER</span>
          <p>상담부터 파트너 활동까지<br />하나의 자연스러운 여정</p>
        </div>
        <div className="intro-copy">
          <p className="eyebrow dark">A CLEARER WAY FORWARD</p>
          <h2 id="intro-title">답을 서두르기보다,<br /><em>당신을 먼저 이해합니다.</em></h2>
          <p>복잡한 정보를 쉽게 풀고, 지금 해야 할 일과 다음에 만날 사람을 연결합니다. 기술은 조용히 돕고 결정권은 언제나 당신에게 남습니다.</p>
        </div>
      </section>

      <section className="journeys section" id="journeys">
        <div className="section-heading">
          <div><p className="eyebrow dark">THREE CLEAR PATHS</p><span>01 — 03</span></div>
          <h2>필요한 순간마다<br />가장 알맞은 길로.</h2>
          <p className="section-note">고객의 상담과 파트너의 활동을 분리해 부담 없이 다음 단계를 선택할 수 있습니다.</p>
        </div>
        <div className="journey-grid">
          {(Object.keys(journeys) as Journey[]).map((key, index) => {
            const item = journeys[key];
            return (
              <article key={key} className="journey-card">
                <div className="journey-image">
                  <img src={item.image} alt={item.alt} loading={index === 0 ? "eager" : "lazy"} />
                  <span>0{index + 1}</span>
                </div>
                <div className="journey-content">
                  <div><p>{item.eyebrow}</p><small>{item.detail}</small></div>
                  <h3>{item.title}</h3>
                  <p className="card-body">{item.body}</p>
                  <button onClick={() => start(key)}>{item.action} <span>↗</span></button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="workspace section" id="workspace">
        <div className="workspace-copy">
          <p className="eyebrow">HUMAN-FIRST AI</p>
          <h2>AI는 정리하고,<br /><em>사람은 결정합니다.</em></h2>
          <p>답을 단정하거나 상품을 밀어붙이지 않습니다. 입력한 정보를 구조화하고 다음 질문, 준비물, 연결 가능한 도움을 보여줍니다.</p>
          <ul>
            <li><span>01</span><div><b>필요한 만큼만 질문</b><small>민감정보 입력 전 안내하고 최소한으로 수집합니다.</small></div></li>
            <li><span>02</span><div><b>근거와 상태를 함께 표시</b><small>AI 연결 여부와 안내의 한계를 숨기지 않습니다.</small></div></li>
            <li><span>03</span><div><b>전문가에게 맥락 그대로 연결</b><small>반복 설명 없이 정리된 상담 메모로 인계합니다.</small></div></li>
          </ul>
        </div>
        <div className="workspace-stage">
          <div className="stage-aura" />
          <div className="workspace-demo">
            <div className="demo-header">
              <div><span className="brand-mark small">U</span><b>AI 가이드</b></div>
              <span className="status-wait">모델 연결 대기</span>
            </div>
            <div className="chat-area">
              <p className="system-chip">규칙 기반 준비 화면</p>
              <div className="message guide">안녕하세요. 상품 추천보다 지금 필요한 도움부터 함께 정리할게요.</div>
              <div className="message user">보험금 청구가 처음이라 어떤 서류가 필요한지 모르겠어요.</div>
              <div className="message guide">괜찮아요. 사고·진료 유형과 현재 가진 서류부터 차근차근 확인하겠습니다.</div>
            </div>
            <button className="demo-button" onClick={() => start("claim")}>내 상황으로 시작하기 <span>→</span></button>
          </div>
          <div className="stage-note"><span>PRIVATE BY DESIGN</span><b>필요한 정보만<br />안전하게 정리</b></div>
        </div>
      </section>

      <section className="trust section" id="trust">
        <div className="trust-title">
          <p className="eyebrow dark">TRUST BY DESIGN</p>
          <h2>가능성은 열고,<br /><em>과장은 닫았습니다.</em></h2>
          <p>신뢰는 화려한 약속이 아니라, 지키는 기준에서 시작됩니다.</p>
        </div>
        <div className="trust-grid">
          <article><span>01</span><h3>고정 수익을<br />약속하지 않아요.</h3><p>보상은 활동량·성과와 정책에 따라 달라집니다.</p></article>
          <article><span>02</span><h3>겸업 가능 여부를<br />먼저 확인해요.</h3><p>취업규칙과 소속사 내부 기준을 직접 확인합니다.</p></article>
          <article><span>03</span><h3>보험 모집과<br />명확히 구분해요.</h3><p>일반 상조 파트너 활동은 보험계약 체결을 포함하지 않습니다.</p></article>
          <article><span>04</span><h3>상담과 활동은<br />각각 자유로워요.</h3><p>충분히 설명을 확인한 뒤 원하는 경우에만 선택합니다.</p></article>
        </div>
      </section>

      <section className="closing">
        <div className="closing-image" role="img" aria-label="고급 라운지에서 대화하는 전문 파트너들" />
        <div className="closing-content">
          <p className="eyebrow">READY WHEN YOU ARE</p>
          <h2>지금 필요한 도움부터,<br /><em>가볍게 시작해 보세요.</em></h2>
          <p>당신의 상황에 맞는 첫 질문부터 차분히 시작합니다.</p>
          <div>
            <button className="primary champagne" onClick={() => start("consult")}>상담 시작하기 <span>↗</span></button>
            <button className="secondary light-button" onClick={() => start("partner")}>파트너 활동 알아보기</button>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <span className="brand-mark">U</span>
          <div><b>AI유니패스 파트너</b><p>상담과 활동 사이, 다음 선택을 선명하게.</p></div>
        </div>
        <div className="footer-links"><a href="#journeys">서비스</a><a href="#trust">안심 기준</a><a href="/admin">관리자 설정</a></div>
        {company && (
          <div className="company-info">
            {company.name && <p>{company.name}</p>}
            {[company.representative, company.registrationNumber, company.address, company.phone, company.email].filter(Boolean).join(" · ")}
          </div>
        )}
        <p className="copyright">© 2026 AI UNIPASS PARTNER. 관리자 설정에서 회사 정보를 입력하기 전에는 공개되지 않습니다.</p>
      </footer>

      {workspaceOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setWorkspaceOpen(false)}>
          <section className="intake-modal" role="dialog" aria-modal="true" aria-label={`${selected.eyebrow} 시작`}>
            <div className="modal-head">
              <div><span className="brand-mark small">U</span><b>{selected.eyebrow} 워크스페이스</b></div>
              <button aria-label="닫기" onClick={() => setWorkspaceOpen(false)}>×</button>
            </div>
            <div className="progress"><span style={{ width: `${progress}%` }} /></div>
            <div className="model-notice"><b>AI 모델 연결 전</b><span>현재는 입력 정리만 제공하며 AI 답변을 꾸며내지 않습니다.</span></div>
            <div className="modal-chat">
              <div className="message guide">{prompts[journey][Math.min(step, 1)]}</div>
              {messages.map((message, index) => <div key={index} className={`message ${message.role}`}>{message.text}</div>)}
              {step >= 2 && (
                <div className="summary-box">
                  <p>상담 준비 요약</p>
                  <h3>{selected.title}</h3>
                  <ul>{messages.filter((message) => message.role === "user").map((message, index) => <li key={index}>{message.text}</li>)}</ul>
                  <small>이 내용은 AI 분석 결과가 아닌 사용자가 입력한 내용을 정리한 것입니다.</small>
                </div>
              )}
            </div>
            {step < 2 ? (
              <div className="composer">
                <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="개인식별정보는 입력하지 마세요." aria-label="상담 내용" />
                <button onClick={submit} disabled={!draft.trim()}>보내기 ↑</button>
              </div>
            ) : (
              <button className="modal-finish" onClick={() => setWorkspaceOpen(false)}>준비 내용 확인 완료</button>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
