import { SubHeader } from '../components/SubHeader'

export function PrivacyPolicyPage() {
  return (
    <main className="app">
      <SubHeader title="개인정보 처리방침" showMenu={false} />
      <main className="app-main">
        <article className="policy-page">
          <header className="policy-page__header">
            <h1 className="policy-page__title">개인정보 처리방침</h1>
            <p className="policy-page__meta">시행일: 2026-07-18 | 버전: 1.0</p>
          </header>

          <section className="policy-page__section">
            <p>
              인생책 서비스(https://app.chaptersofu.com)은(는) 정보주체의 자유와 권리 보호를 위해
              「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고
              안전하게 관리하고 있습니다.
            </p>
            <p>
              이에 「개인정보 보호법」 제30조에 따라 정보주체에게 개인정보의 처리와 보호에 관한 절차
              및 기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여
              다음과 같이 개인정보 처리방침을 수립·공개합니다.
            </p>
          </section>

          <section className="policy-page__section">
            <h2>개인정보의 처리 목적 및 수집 항목</h2>

            <h3>1. 개인정보의 처리 목적</h3>
            <p>책추천 서비스은(는) 다음의 목적을 위하여 개인정보를 처리합니다.</p>
            <ul>
              <li>회원 가입 및 관리</li>
              <li>콘텐츠 제공</li>
              <li>법적 의무 이행</li>
              <li>부정이용 방지</li>
              <li>안전 및 보안</li>
              <li>마케팅 및 광고 활용</li>
              <li>맞춤형 서비스</li>
              <li>연구 및 개발</li>
              <li>통계 분석</li>
            </ul>

            <h3>2. 수집하는 개인정보 항목</h3>
            <p>필수 항목: 국적</p>

            <h3>수집 방법</h3>
            <p>홈페이지 회원가입, 모바일 앱 회원가입, 웹 로그 분석, 쿠키(Cookie), IP 주소</p>
          </section>

          <section className="policy-page__section">
            <h2>개인정보 보호책임자 및 권익침해 구제방법</h2>

            <h3>개인정보 보호책임자</h3>
            <dl>
              <div>
                <dt>성명</dt>
                <dd>이우주</dd>
              </div>
              <div>
                <dt>이메일</dt>
                <dd>hack4569@naver.com</dd>
              </div>
            </dl>

            <h3>권익침해 구제기관</h3>
            <ul>
              <li>개인정보분쟁조정위원회 (1833-6972)</li>
              <li>개인정보침해신고센터 (118)</li>
            </ul>
          </section>

          <section className="policy-page__section">
            <h2>개인정보의 보유 기간 및 파기</h2>

            <h3>보유 기간</h3>
            <p>기본 보유기간: 회원 탈퇴 시까지</p>

            <h3>파기 절차 및 방법</h3>
            <p>
              파기 절차: 파기 사유가 발생한 개인정보를 선정하고, 개인정보 보호책임자의 승인을 받아
              개인정보를 파기합니다.
            </p>
            <ul>
              <li>전자파일: 물리적 파괴</li>
              <li>종이문서: 분쇄기로 분쇄</li>
            </ul>
          </section>

          <section className="policy-page__section">
            <h2>개인정보 처리방침의 변경</h2>
            <p>이 개인정보 처리방침은 2026-07-18부터 적용됩니다.</p>
            <p>변경 고지 방법: 앱 내 공지</p>
          </section>
        </article>
      </main>
    </main>
  )
}
