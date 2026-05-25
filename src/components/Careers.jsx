export default function Careers() {
  return (
    <section id="careers" className="section section-light">
      <div className="container">
        <h2 className="section-title">Careers</h2>
        <p className="section-subtitle">
          Join our team and build the future with us.
        </p>

        <div className="careersVisual" aria-hidden="true">
          <img src="/images/cosmos-talent-visual.webp" alt="" loading="lazy" decoding="async" />
          <div className="careersVisualCopy">
            <span>Talent Network</span>
            <strong>Built for teams that need capability, clarity, and momentum.</strong>
          </div>
        </div>

        <div className="careersContent">
          <div className="careersCard">
            <h3 className="careersHeading">Equal Employment Opportunity (EEO)</h3>
            <p className="careersText">
              Cosmos is an Equal Employment Opportunity employer. All qualified
              applicants will receive consideration for employment without regard
              to race, color, religion, sex, sexual orientation, gender identity,
              national origin, disability, age, veteran status, or any other
              characteristic protected by applicable federal, state, or local laws.
            </p>
          </div>

          <div className="careersCard">
            <h3 className="careersHeading">E-Verify® Participation</h3>
            <p className="careersText">
              Cosmos participates in E-Verify® and will provide the federal
              government with Form I-9 information to confirm that employees are
              authorized to work in the United States.
            </p>
          </div>
        </div>

        <div className="careersFooter">
          <p>Want current job openings and company updates?</p>
          <a className="linkedInBtn" href="https://www.linkedin.com/company/cosmos-nextgen-it/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
            Follow us on LinkedIn
          </a>
        </div>
      </div>

      <style>{`
        #careers.section-light {
          color: #f5f5f5;
          background:
            radial-gradient(ellipse at 12% 10%, rgba(247, 183, 51, 0.12), transparent 34%),
            radial-gradient(ellipse at 86% 12%, rgba(247, 183, 51, 0.18), transparent 34%),
            linear-gradient(135deg, #0a0e1a 0%, #0a0e1a 42%, #0a0e1a 100%);
        }

        #careers .section-subtitle {
          color: rgba(245, 245, 245, 0.7);
        }

        .careersVisual {
          position: relative;
          min-height: 300px;
          margin: 0 0 22px;
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #0f1320;
          box-shadow: 0 28px 74px rgba(0, 0, 0, 0.5);
        }

        .careersVisual img {
          width: 100%;
          height: 100%;
          min-height: 300px;
          object-fit: cover;
          object-position: center;
        }

        .careersVisual::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(23, 32, 44, 0.7), rgba(23, 32, 44, 0.08)),
            linear-gradient(180deg, transparent, rgba(23, 32, 44, 0.56));
        }

        .careersVisualCopy {
          position: absolute;
          z-index: 1;
          left: 28px;
          right: 28px;
          bottom: 28px;
          max-width: 560px;
        }

        .careersVisualCopy span {
          display: block;
          margin-bottom: 14px;
          color: #f7b733;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .careersVisualCopy strong {
          display: block;
          color: #ffffff;
          font-size: clamp(22px, 2.8vw, 32px);
          line-height: 1.12;
          font-weight: 950;
        }

        .careersContent {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
          margin-top: 34px;
        }

        .careersCard {
          position: relative;
          overflow: hidden;
          padding: 28px;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(20px);
        }

        .careersCard::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 4px;
          background: linear-gradient(90deg, #f7b733, #f7b733, #f7b733);
        }

        .careersHeading {
          font-weight: 900;
          font-size: 17px;
          color: #f5f5f5;
          margin: 0 0 16px 0;
          letter-spacing: 0;
        }

        .careersText {
          color: rgba(245, 245, 245, 0.65);
          line-height: 1.7;
          font-size: 14.5px;
          margin: 0;
        }

        .careersFooter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
          margin-top: 22px;
          padding: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-lg);
          background:
            linear-gradient(135deg, rgba(255, 241, 118, 0.22), rgba(247, 183, 51, 0.18), rgba(247, 183, 51, 0.12)),
            rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(18px);
        }

        .careersFooter p {
          color: #f5f5f5;
          font-size: 15px;
          font-weight: 800;
          margin: 0;
          line-height: 1.6;
        }

        .linkedInBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 44px;
          padding: 0 18px;
          background: linear-gradient(135deg, #0a66c2, #00509d);
          border: 1px solid rgba(10, 102, 194, 0.6);
          border-radius: var(--radius);
          color: #ffffff;
          font-weight: 850;
          text-decoration: none;
          box-shadow: 0 8px 20px rgba(10, 102, 194, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .linkedInBtn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 22px rgba(10, 102, 194, 0.45);
        }

        .linkedInBtn:active {
          transform: translateY(0);
          box-shadow: 0 8px 14px rgba(10, 102, 194, 0.35);
        }

        @media (max-width: 900px) {
          .careersContent {
            grid-template-columns: 1fr;
          }

          .careersFooter {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}
