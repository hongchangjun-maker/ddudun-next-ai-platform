"use client";

import { useState } from "react";
import type { CompanySettings } from "../lib/company";

const blank: CompanySettings = { name: "", representative: "", registrationNumber: "", address: "", phone: "", email: "" };

export function AdminSettings({ user, initial }: { user: string; initial: CompanySettings | null }) {
  const [form, setForm] = useState(initial ?? blank);
  const [status, setStatus] = useState("");

  async function save() {
    setStatus("저장 중…");
    const response = await fetch("/api/company", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(response.ok ? "저장되었습니다. 공개 화면에 즉시 반영됩니다." : "저장하지 못했습니다.");
  }

  return (
    <main className="admin-shell">
      <aside>
        <a className="brand" href="/"><span className="brand-mark">ㄸ</span><span>뚜둔 <b>NEXT</b></span></a>
        <nav><b>관리자 설정</b><a className="active" href="#company">회사 정보</a><a href="#ai">AI 연결</a><a href="#privacy">개인정보·보안</a></nav>
        <a href="/">← 공개 화면으로</a>
      </aside>
      <section className="admin-main">
        <div className="admin-top"><div><p>ADMIN CONSOLE</p><h1>플랫폼 설정</h1></div><span>{user}</span></div>
        <div className="admin-card" id="company">
          <div className="admin-card-head"><div><h2>회사 정보</h2><p>비어 있는 항목은 공개 화면에 표시되지 않습니다.</p></div><span className="safe-chip">비공개 기본값</span></div>
          <div className="form-grid">
            {[
              ["name", "상호명", "예: 뚜둔랩스"],
              ["representative", "대표자명", "대표자 또는 개인정보 보호책임자"],
              ["registrationNumber", "사업자등록번호", "000-00-00000"],
              ["phone", "고객센터", "연락 가능한 번호"],
              ["email", "이메일", "help@example.com"],
              ["address", "사업장 주소", "도로명 주소"],
            ].map(([key, label, placeholder]) => (
              <label key={key} className={key === "address" ? "wide" : ""}>{label}<input value={form[key as keyof CompanySettings]} placeholder={placeholder} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></label>
            ))}
          </div>
          <div className="admin-actions"><p>{status}</p><button onClick={save}>변경사항 저장</button></div>
        </div>
        <div className="admin-card muted" id="ai"><h2>AI 연결</h2><p>현재 공개 화면은 모델 미연결 상태를 명확히 표시합니다. 실제 AI 연결 시 서버 측 비밀키와 검증된 안내 정책이 필요합니다.</p><span className="status-wait">연결 대기</span></div>
        <div className="admin-card muted" id="privacy"><h2>개인정보·보안</h2><p>관리자 화면은 ChatGPT 로그인을 요구합니다. 공개 배포 전에는 별도 관리자 허용 목록과 보관·파기 정책을 설정하세요.</p></div>
      </section>
    </main>
  );
}
