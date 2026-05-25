const services = [
  {
    code: "01",
    title: "Consulting",
    desc: "Experienced software consultants and analysts who partner with you to design, build, and deliver solutions that move the business forward.",
    tags: ["Discovery", "Architecture", "Roadmaps"],
    accent: "#ff6b4a",
    span: "1",
  },
  {
    code: "02",
    title: "Staffing",
    desc: "High-quality IT talent for fast-moving teams — contract, contract-to-hire, or direct placement across local and national engagements.",
    tags: ["Contract", "Direct hire", "Embedded"],
    accent: "#f7b733",
    span: "1",
  },
  {
    code: "03",
    title: "Upskill & Training",
    desc: "Practical technology training and upskilling programs to help teams adopt modern platforms, tools, and best practices with confidence.",
    tags: ["Cohort training", "Mentoring"],
    accent: "#f7b733",
    span: "1",
  },
  {
    code: "04",
    title: "Data Engineering & AI",
    desc: "Pipelines, warehousing, analytics foundations, ML enablement, and production-grade data systems — the boring infrastructure that makes the exciting things possible.",
    tags: ["dbt", "Snowflake", "Kafka", "RAG", "Vector DB", "MLOps"],
    accent: "#ff6b4a",
    span: "feature",
  },
  {
    code: "05",
    title: "Cloud Services",
    desc: "AWS, Azure, GCP — architecture, migrations, cost optimization, and security baselines built to last.",
    tags: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes"],
    accent: "#ff6b4a",
    span: "wide",
  },
];

export default function Services() {
  return (
    <section id="services" className="section sectionServices">
      <div className="svcAmbient" aria-hidden="true">
        <div className="svcOrb svcOrb-a" />
        <div className="svcOrb svcOrb-b" />
        <div className="svcGridBg" />
      </div>

      <div className="container svcInner">
        <div className="svcHeader">
          <div className="svcHeaderLeft">
            <span className="svcEyebrow">
              <span className="svcEyebrowDot" />
              What we do
            </span>
            <h2 className="svcTitle">
              Services that
              <br />
              <em>ship to production.</em>
            </h2>
          </div>
          <p className="svcLede">
            The short answer: we build the stuff that keeps modern businesses
            alive. The long answer is below — five tightly-integrated practices,
            one senior team, no handoffs to vendors you've never met.
          </p>
        </div>

        {/* Showcase banner */}
        <div className="svcShowcase">
          <div className="svcShowcaseGlow" aria-hidden="true" />
          <div className="svcShowcaseContent">
            <span className="svcShowcaseKicker">One operating model</span>
            <strong className="svcShowcaseHead">
              Consulting, cloud, data, and talent — under one roof.
            </strong>
            <p className="svcShowcasePitch">
              Every engagement is staffed by senior people. No offshore handoffs,
              no vendor stack, no surprises in week three.
            </p>
          </div>
          <div className="svcShowcaseRing" aria-hidden="true">
            {["Consulting", "Cloud", "Data", "AI", "Talent", "Training"].map((label, i) => (
              <span
                key={label}
                className="svcShowcaseChip"
                style={{ "--i": i, "--total": 6 }}
              >
                {label}
              </span>
            ))}
            <div className="svcShowcaseHub">
              <span>COSMOS</span>
            </div>
          </div>
        </div>

        {/* Bento grid */}
        <div className="svcGrid">
          {services.map((s) => (
            <article
              key={s.code}
              className={`svcCard svcCard-${s.span}`}
              style={{ "--accent": s.accent }}
            >
              <div className="svcCardHead">
                <span className="svcCardCode">{s.code}</span>
                <span className="svcCardArrow" aria-hidden="true">→</span>
              </div>
              <h3 className="svcCardTitle">{s.title}</h3>
              <p className="svcCardDesc">{s.desc}</p>
              <div className="svcCardTags">
                {s.tags.map((t) => (
                  <span key={t} className="svcChip">{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .sectionServices {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding: 120px 0 110px;
          color: #f5f5f5;
          background:
            radial-gradient(ellipse at 12% 0%, rgba(247, 183, 51, 0.16), transparent 36%),
            radial-gradient(ellipse at 90% 0%, rgba(247, 183, 51, 0.18), transparent 36%),
            linear-gradient(180deg, #0a0e1a 0%, #0f1320 50%, #0a0e1a 100%);
        }

        .svcAmbient {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .svcOrb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.55;
        }

        .svcOrb-a {
          width: 460px; height: 460px;
          left: -100px; top: 40px;
          background: radial-gradient(circle, rgba(247, 183, 51, 0.45), transparent 70%);
        }

        .svcOrb-b {
          width: 500px; height: 500px;
          right: -120px; bottom: 80px;
          background: radial-gradient(circle, rgba(247, 183, 51, 0.4), transparent 70%);
        }

        .svcGridBg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(180deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, #000, transparent 80%);
          opacity: 0.7;
        }

        .svcInner {
          position: relative;
          z-index: 2;
        }

        /* Header */
        .svcHeader {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
          gap: 48px;
          align-items: end;
          margin-bottom: 48px;
        }

        .svcEyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 7px 14px 7px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.4);
          font-size: 12px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ff6b4a;
        }

        .svcEyebrowDot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f7b733, #f7b733);
        }

        .svcTitle {
          margin: 22px 0 0;
          color: #f5f5f5;
          font-size: clamp(36px, 5.4vw, 64px);
          line-height: 1;
          letter-spacing: -0.018em;
          font-weight: 950;
        }

        .svcTitle em {
          font-style: italic;
          font-weight: 500;
          color: rgba(245, 245, 245, 0.5);
        }

        .svcLede {
          margin: 0;
          color: rgba(245, 245, 245, 0.7);
          font-size: 16px;
          line-height: 1.72;
        }

        /* Showcase */
        .svcShowcase {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          align-items: center;
          gap: 32px;
          padding: 36px 40px;
          margin-bottom: 28px;
          border-radius: 22px;
          color: #ffffff;
          background:
            linear-gradient(90deg, rgba(20, 26, 42, 0.92) 0%, rgba(20, 26, 42, 0.7) 45%, rgba(20, 26, 42, 0.55) 100%),
            radial-gradient(ellipse at 0% 100%, rgba(255, 107, 74, 0.45), transparent 50%),
            radial-gradient(ellipse at 100% 0%, rgba(247, 183, 51, 0.4), transparent 55%),
            radial-gradient(ellipse at 100% 0%, rgba(255, 107, 74, 0.3), transparent 60%),
            url("/images/cosmos-services-visual.webp") center/cover no-repeat,
            linear-gradient(135deg, #1a2236 0%, #141a2a 100%);
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5);
        }

        .svcShowcaseGlow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(180deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, #000, transparent 85%);
          opacity: 0.6;
        }

        .svcShowcaseContent {
          position: relative;
          z-index: 1;
        }

        .svcShowcaseKicker {
          display: inline-block;
          margin-bottom: 16px;
          color: #f7b733;
          font-size: 11.5px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .svcShowcaseHead {
          display: block;
          margin-bottom: 14px;
          color: #ffffff;
          font-size: clamp(22px, 3vw, 32px);
          line-height: 1.16;
          font-weight: 950;
          letter-spacing: -0.01em;
        }

        .svcShowcasePitch {
          margin: 0;
          max-width: 520px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 15px;
          line-height: 1.7;
        }

        .svcShowcaseRing {
          position: relative;
          width: 280px;
          height: 280px;
          margin: 0 auto;
          justify-self: end;
        }

        .svcShowcaseHub {
          position: absolute;
          inset: 50% auto auto 50%;
          transform: translate(-50%, -50%);
          width: 92px; height: 92px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f7b733, #ff6b4a);
          color: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.1em;
          box-shadow: 0 0 60px rgba(255, 184, 107, 0.5);
          z-index: 2;
        }

        .svcShowcaseRing::before,
        .svcShowcaseRing::after {
          content: "";
          position: absolute;
          inset: 50% auto auto 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1px dashed rgba(255, 255, 255, 0.18);
        }

        .svcShowcaseRing::before {
          width: 200px; height: 200px;
        }

        .svcShowcaseRing::after {
          width: 280px; height: 280px;
          animation: svcRingSpin 60s linear infinite;
        }

        @keyframes svcRingSpin {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .svcShowcaseChip {
          position: absolute;
          left: 50%;
          top: 50%;
          padding: 6px 11px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #ffffff;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.04em;
          white-space: nowrap;
          backdrop-filter: blur(10px);
          transform:
            translate(-50%, -50%)
            rotate(calc(360deg / var(--total) * var(--i)))
            translateY(-130px)
            rotate(calc(-360deg / var(--total) * var(--i)));
        }

        /* Bento grid */
        .svcGrid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 14px;
        }

        .svcCard {
          position: relative;
          overflow: hidden;
          padding: 26px 24px 24px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.035);
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(20px);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.3s ease;
          grid-column: span 2;
        }

        .svcCard-feature {
          grid-column: span 4;
          background:
            radial-gradient(ellipse at 0% 0%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 60%),
             background: rgba(255, 255, 255, 0.035);
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
        }

        .svcCard-wide {
          grid-column: span 2;
        }

        .svcCard::before {
          content: "";
          position: absolute;
          left: 0; right: 0; top: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 50%, transparent));
        }

        .svcCard:hover {
          transform: translateY(-6px);
          border-color: color-mix(in srgb, var(--accent) 35%, transparent);
          box-shadow: 0 28px 70px color-mix(in srgb, var(--accent) 18%, transparent);
        }

        .svcCardHead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .svcCardCode {
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.16em;
          color: var(--accent);
        }

        .svcCardArrow {
          color: rgba(245, 245, 245, 0.35);
          font-size: 18px;
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .svcCard:hover .svcCardArrow {
          transform: translate(3px, -3px);
          color: var(--accent);
        }

        .svcCardTitle {
          margin: 0 0 10px;
          color: #f5f5f5;
          font-size: 21px;
          line-height: 1.22;
          font-weight: 950;
          letter-spacing: -0.005em;
        }

        .svcCardDesc {
          margin: 0 0 18px;
          color: rgba(245, 245, 245, 0.7);
          font-size: 14.5px;
          line-height: 1.7;
        }

        .svcCardTags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .svcChip {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          color: rgba(245, 245, 245, 0.7);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        @media (max-width: 1080px) {
          .svcHeader {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .svcShowcase {
            grid-template-columns: 1fr;
            padding: 32px 28px;
          }

          .svcShowcaseRing {
            display: none;
          }

          .svcGrid {
            grid-template-columns: repeat(4, 1fr);
          }

          .svcCard {
            grid-column: span 2;
          }

          .svcCard-feature,
          .svcCard-wide {
            grid-column: span 4;
          }
        }

        @media (max-width: 640px) {
          .sectionServices {
            padding: 80px 0 72px;
          }

          .svcGrid {
            grid-template-columns: 1fr;
          }

          .svcCard,
          .svcCard-feature,
          .svcCard-wide {
            grid-column: 1 / -1;
          }

          .svcShowcase {
            padding: 26px 22px;
          }
        }
      `}</style>
    </section>
  );
}
