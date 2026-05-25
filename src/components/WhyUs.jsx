const points = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17" cy="14" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 20c0-3 2.7-5 6-5M14 20c0-2 1.3-3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    title: "Collaborative Delivery",
    desc: "Frequent stakeholder touchpoints and demos across all phases — no surprises at handover.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="18" cy="18" r="2" fill="currentColor" />
      </svg>
    ),
    title: "Multi-Stack Engineering",
    desc: "Full-stack capability across platforms and architecture layers — frontend to infrastructure.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
    title: "DevOps Support",
    desc: "From maintenance bursts to full lifecycle build + deploy support, with observability built-in.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Quality-First Standards",
    desc: "Clean code, best practices, real testing — not vibes. Every PR reviewed by a senior.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
    title: "Fast Delivery / Agile",
    desc: "Iterative releases with clear scope and predictable outcomes — two-week cadence by default.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 2L4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Secure & Scalable",
    desc: "Cloud-native designs with security and performance baked in from day one.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M17 18a4 4 0 100-8h-1a6 6 0 10-11 3 4 4 0 003 7h9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
    title: "Cloud-Native Expertise",
    desc: "AWS, Azure, GCP — deployment strategies aligned to your needs and your budget.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    title: "Calm Operations",
    desc: "No 11pm pings, no manufactured urgency. Sustainable pace produces better systems.",
  },
];

export default function WhyUs() {
  return (
    <section id="why" className="section sectionWhy">
      <div className="whyAmbient" aria-hidden="true">
        <div className="whyOrb whyOrb-a" />
        <div className="whyOrb whyOrb-b" />
        <div className="whyGridBg" />
      </div>

      <div className="container whyInner">
        <div className="whyHeader">
          <div>
            <span className="whyEyebrow">
              <span className="whyEyebrowDot" />
              Why COSMOS
            </span>
            <h2 className="whyTitle">
              You're not hiring a vendor.
              <br />
              <em>You're hiring an engineering partner.</em>
            </h2>
          </div>
          <p className="whyLede">
            Eight operating principles we've refined over hundreds of
            engagements. Lightweight where it can be, rigorous where it matters.
          </p>
        </div>

        <div className="whyGrid">
          {points.map((p, i) => (
            <article key={p.title} className="whyCard" style={{ "--i": i }}>
              <div className="whyCardIcon" aria-hidden="true">
                {p.icon}
              </div>
              <h3 className="whyCardTitle">{p.title}</h3>
              <p className="whyCardDesc">{p.desc}</p>
              <span className="whyCardNumber">0{i + 1}</span>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .sectionWhy {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding: 120px 0 110px;
          color: #f5f5f5;
          background:
            radial-gradient(ellipse at 8% 8%, rgba(255, 107, 74, 0.14), transparent 32%),
            radial-gradient(ellipse at 88% 12%, rgba(255, 107, 74, 0.16), transparent 34%),
            linear-gradient(180deg, #0a0e1a 0%, #0a0e1a 50%, #0a0e1a 100%);
        }

        .whyAmbient {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .whyOrb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.55;
        }

        .whyOrb-a {
          width: 460px; height: 460px;
          left: -100px; top: 60px;
          background: radial-gradient(circle, rgba(255, 107, 74, 0.4), transparent 70%);
        }

        .whyOrb-b {
          width: 480px; height: 480px;
          right: -100px; bottom: 60px;
          background: radial-gradient(circle, rgba(255, 107, 74, 0.4), transparent 70%);
        }

        .whyGridBg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(180deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, #000, transparent 80%);
          opacity: 0.7;
        }

        .whyInner {
          position: relative;
          z-index: 2;
        }

        .whyHeader {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: 48px;
          align-items: end;
          margin-bottom: 48px;
        }

        .whyEyebrow {
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

        .whyEyebrowDot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b4a, #f7b733);
        }

        .whyTitle {
          margin: 22px 0 0;
          color: #f5f5f5;
          font-size: clamp(36px, 5.4vw, 60px);
          line-height: 1;
          letter-spacing: -0.018em;
          font-weight: 950;
        }

        .whyTitle em {
          font-style: italic;
          font-weight: 500;
          color: rgba(245, 245, 245, 0.5);
        }

        .whyLede {
          margin: 0;
          color: rgba(245, 245, 245, 0.7);
          font-size: 16px;
          line-height: 1.72;
        }

        .whyGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .whyCard {
          position: relative;
          overflow: hidden;
          padding: 28px 24px 26px;
          min-height: 220px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.035);
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(20px);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.3s ease;
        }

        .whyCard::before {
          content: "";
          position: absolute;
          left: 0; right: 0; top: 0;
          height: 3px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733, #ff6b4a, #f7b733);
        }

        .whyCard:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 107, 74, 0.3);
          box-shadow: 0 28px 70px rgba(255, 107, 74, 0.16);
        }

        .whyCardIcon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px; height: 44px;
          margin-bottom: 18px;
          border-radius: 12px;
          color: #ff6b4a;
          background: linear-gradient(135deg, rgba(255, 107, 74, 0.14), rgba(247, 183, 51, 0.1));
          border: 1px solid rgba(255, 107, 74, 0.2);
        }

        .whyCardIcon svg {
          width: 22px;
          height: 22px;
        }

        .whyCardTitle {
          margin: 0 0 10px;
          color: #f5f5f5;
          font-size: 17px;
          line-height: 1.28;
          font-weight: 950;
          letter-spacing: -0.005em;
        }

        .whyCardDesc {
          margin: 0;
          color: rgba(245, 245, 245, 0.7);
          font-size: 14px;
          line-height: 1.65;
        }

        .whyCardNumber {
          position: absolute;
          right: 18px; top: 18px;
          font-size: 11px;
          font-weight: 950;
          color: rgba(255, 255, 255, 0.22);
          letter-spacing: 0.1em;
        }

        @media (max-width: 1080px) {
          .whyHeader {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .whyGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .sectionWhy {
            padding: 80px 0 72px;
          }

          .whyGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
