const CASES = [
  {
    sector: "Fintech",
    client: "Northwind Bank",
    title: "Embedded payments + KYC pipeline",
    summary:
      "Rebuilt a regulated, multi-tenant payments service across 8 markets with a unified KYC/AML pipeline meeting SOC 2 + PCI DSS.",
    metrics: [
      ["Auth latency", "142ms"],
      ["Onboarding", "−74%"],
      ["Markets live", "8"],
    ],
    accent: "#f7b733",
    duration: "8 weeks",
  },
  {
    sector: "Energy / IoT",
    client: "Helio Energy",
    title: "Real-time grid telemetry platform",
    summary:
      "A high-throughput ingestion + analytics platform processing 2.4M sensor events per minute, replacing a fragile legacy stack.",
    metrics: [
      ["Events / min", "2.4M"],
      ["p99 latency", "180ms"],
      ["Cost / event", "−68%"],
    ],
    accent: "#ff6b4a",
    duration: "14 weeks",
  },
  {
    sector: "Legal AI",
    client: "Atlas Labs",
    title: "AI co-pilot for legal research",
    summary:
      "A RAG-driven research assistant grounded in 18M case documents, with citation-faithful answers and a custom evaluation harness.",
    metrics: [
      ["Documents", "18M"],
      ["Precision @ 5", "93%"],
      ["Hallucinations", "<0.4%"],
    ],
    accent: "#f7b733",
    duration: "20 weeks",
  },
];

export default function CaseStudies() {
  return (
    <section className="sectionCases">
      <div className="casesAmbient" aria-hidden="true">
        <div className="casesOrb casesOrb-a" />
        <div className="casesOrb casesOrb-b" />
        <div className="casesGridBg" />
      </div>

      <div className="container casesInner">
        <div className="casesHeader">
          <div>
            <span className="casesEyebrow">
              <span className="casesEyebrowDot" />
              Selected work
            </span>
            <h2 className="casesTitle">
              Quiet code,
              <br />
              <em>loud results.</em>
            </h2>
          </div>
          <p className="casesLede">
            A glimpse of what we ship. Under NDA we ship far more — reach out
            if you'd like to discuss a project relevant to yours.
          </p>
        </div>

        <div className="casesGrid">
          {CASES.map((c) => (
            <article
              key={c.client}
              className="caseCard"
              style={{ "--accent": c.accent }}
            >
              <div className="caseHead">
                <span className="caseSector">{c.sector}</span>
                <span className="caseDuration">{c.duration}</span>
              </div>
              <h3 className="caseClient">{c.client}</h3>
              <p className="caseTitle">{c.title}</p>
              <p className="caseSummary">{c.summary}</p>

              <div className="caseMetrics">
                {c.metrics.map(([label, value]) => (
                  <div key={label} className="caseMetric">
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <a className="caseLink" href="#contact">
                Read the story
                <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .sectionCases {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding: 120px 0 110px;
          color: #f5f5f5;
          background:
            radial-gradient(ellipse at 12% 0%, rgba(255, 107, 74, 0.14), transparent 36%),
            radial-gradient(ellipse at 90% 100%, rgba(247, 183, 51, 0.16), transparent 36%),
            linear-gradient(180deg, #07090f 0%, #0a0e1a 50%, #0f1320 100%);
        }

        .casesAmbient {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .casesOrb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.5;
        }

        .casesOrb-a {
          width: 480px; height: 480px;
          left: -100px; top: 60px;
          background: radial-gradient(circle, rgba(255, 107, 74, 0.4), transparent 70%);
        }

        .casesOrb-b {
          width: 460px; height: 460px;
          right: -120px; bottom: 60px;
          background: radial-gradient(circle, rgba(255, 107, 74, 0.35), transparent 70%);
        }

        .casesGridBg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(180deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, #000, transparent 80%);
          opacity: 0.7;
        }

        .casesInner {
          position: relative;
          z-index: 2;
        }

        .casesHeader {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: 48px;
          align-items: end;
          margin-bottom: 48px;
        }

        .casesEyebrow {
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

        .casesEyebrowDot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b4a, #f7b733);
        }

        .casesTitle {
          margin: 22px 0 0;
          color: #f5f5f5;
          font-size: clamp(36px, 5.4vw, 60px);
          line-height: 1;
          letter-spacing: -0.018em;
          font-weight: 950;
        }

        .casesTitle em {
          font-style: italic;
          font-weight: 500;
          color: rgba(245, 245, 245, 0.5);
        }

        .casesLede {
          margin: 0;
          color: rgba(245, 245, 245, 0.7);
          font-size: 16px;
          line-height: 1.72;
        }

        .casesGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .caseCard {
          position: relative;
          overflow: hidden;
          padding: 28px 26px 26px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          box-shadow: 0 22px 58px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(20px);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .caseCard::before {
          content: "";
          position: absolute;
          left: 0; right: 0; top: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 40%, transparent));
        }

        .caseCard:hover {
          transform: translateY(-6px);
          border-color: color-mix(in srgb, var(--accent) 35%, transparent);
          box-shadow: 0 28px 70px color-mix(in srgb, var(--accent) 18%, transparent);
        }

        .caseHead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .caseSector {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
        }

        .caseDuration {
          font-size: 11px;
          font-weight: 800;
          color: rgba(245, 245, 245, 0.45);
          letter-spacing: 0.04em;
        }

        .caseClient {
          margin: 0 0 4px;
          color: #f5f5f5;
          font-size: 22px;
          line-height: 1.18;
          font-weight: 950;
          letter-spacing: -0.01em;
        }

        .caseTitle {
          margin: 0 0 12px;
          color: rgba(245, 245, 245, 0.85);
          font-size: 14.5px;
          line-height: 1.45;
          font-weight: 700;
        }

        .caseSummary {
          margin: 0 0 22px;
          color: rgba(245, 245, 245, 0.62);
          font-size: 13.5px;
          line-height: 1.66;
          flex: 1;
        }

        .caseMetrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          padding: 16px;
          margin-bottom: 18px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .caseMetric {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: center;
        }

        .caseMetric strong {
          color: #f5f5f5;
          font-size: 16px;
          font-weight: 950;
          line-height: 1;
          letter-spacing: -0.005em;
        }

        .caseMetric span {
          color: rgba(245, 245, 245, 0.5);
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .caseLink {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--accent);
          font-size: 13px;
          font-weight: 850;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition: gap 0.3s ease;
        }

        .caseLink:hover {
          gap: 12px;
        }

        @media (max-width: 1080px) {
          .casesHeader {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .casesGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .caseCard:last-child {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 640px) {
          .sectionCases {
            padding: 80px 0 72px;
          }

          .casesGrid {
            grid-template-columns: 1fr;
          }

          .caseCard:last-child {
            grid-column: auto;
          }
        }
      `}</style>
    </section>
  );
}
