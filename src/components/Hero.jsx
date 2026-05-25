import React from "react";

/**
 * Animated counter — counts from 0 to `end` once it scrolls into view.
 * Runs only once per page load.
 *   end       — final numeric value (e.g. 120, 99.99, 94)
 *   suffix    — text appended after the number (e.g. "+", "%")
 *   decimals  — how many decimal places to display
 *   duration  — milliseconds to animate over (default 1500)
 */
function Counter({ end, suffix = "", decimals = 0, duration = 1500 }) {
  const ref = React.useRef(null);
  const [value, setValue] = React.useState(0);
  const playedRef = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !playedRef.current) {
          playedRef.current = true;
          const startTs = performance.now();
          const tick = (now) => {
            const elapsed = now - startTs;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutCubic — fast then slow, feels natural
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(end * eased);
            if (progress < 1) requestAnimationFrame(tick);
            else setValue(end);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <strong ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </strong>
  );
}

export default function Hero() {
  return (
    <section id="home" className="hero">
      {/* Ambient layered backgrounds */}
      <div className="heroAmbient" aria-hidden="true">
        <div className="heroPhoto" />
        <div className="heroPhotoOverlay" />
        <div className="heroOrb heroOrb-a" />
        <div className="heroOrb heroOrb-b" />
        <div className="heroOrb heroOrb-c" />
        <div className="heroGrid" />
        <div className="heroNoise" />
      </div>

      <div className="container heroInner">
        <div className="heroTop">
          <h1 className="heroTitle">
            Building the{" "}
            <span className="heroTitleAccent">
              NextGen
              <svg
                className="heroTitleUnderline"
                viewBox="0 0 320 14"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="nextgen-stroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ff6b4a" />
                    <stop offset="50%" stopColor="#f7b733" />
                    <stop offset="100%" stopColor="#f7b733" />
                  </linearGradient>
                </defs>
                <path
                  d="M2 9 C 60 2, 120 2, 180 7 S 300 11, 318 5"
                  fill="none"
                  stroke="url(#nextgen-stroke)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="heroSub">
            Product engineering, cloud platforms, and consulting & staffing — built to scale. From strategy to delivery to talent, we help teams ship secure, reliable systems fast.
          </p>

          <div className="heroActions">
            <a className="btnPrimary heroBtnPrimary" href="#contact">
              Start a conversation
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
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
            <a className="btnGhost heroBtnGhost" href="#services">
              Explore Services
            </a>
          </div>

          {/* Inline trust strip */}
          <div className="heroProof" aria-label="Track record">
            <div className="heroProofItem">
              <Counter end={120} suffix="+" />
              <span>Projects shipped</span>
            </div>
            <span className="heroProofDivider" aria-hidden="true" />
            <div className="heroProofItem">
              <Counter end={99.99} suffix="%" decimals={2} />
              <span>Platform uptime</span>
            </div>
            <span className="heroProofDivider" aria-hidden="true" />
            <div className="heroProofItem">
              <Counter end={94} suffix="%" />
              <span>Client retention</span>
            </div>
          </div>
        </div>

        {/* Capability cards */}
        <div className="heroCards" aria-label="COSMOS capabilities">
          <article className="heroCard heroCard-1">
            <h3 className="heroCardTitle">Advisory · Teams · Talent</h3>
            <p className="heroCardBody">
              Exceptional IT consultants paired with real business goals — from
              short engagements to embedded teams.
            </p>
            <div className="heroCardFoot">
              <span className="heroChip">CTO advisory</span>
              <span className="heroChip">Embedded teams</span>
              <span className="heroChip">Talent</span>
            </div>
          </article>

          <article className="heroCard heroCard-2">
            <h3 className="heroCardTitle">AWS · Azure · GCP</h3>
            <p className="heroCardBody">
              Architecture, migration, and optimization for resilient,
              cost-aware platforms that scale with you.
            </p>
            <div className="heroCardFoot">
              <span className="heroChip">Architecture</span>
              <span className="heroChip">Migration</span>
              <span className="heroChip">FinOps</span>
            </div>
          </article>

          <article className="heroCard heroCard-3 heroCard-feature">
            <div className="heroCardSparkle" aria-hidden="true">
              <span /><span /><span />
            </div>
            <span className="heroCardKicker heroCardKicker-light">
              The NextGen Engineers
            </span>
            <h3 className="heroCardManifesto">
              Serious engineering.
              <br />
              <em>No fluff — just outcomes.</em>
            </h3>
            <a className="heroCardLink" href="#why">
              Why teams choose us
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
        </div>

        {/* Marquee — capability tape */}
        <div className="heroMarquee" aria-label="Capabilities at a glance">
          <div className="heroMarqueeTrack">
            {[0, 1].map((dup) => (
              <div className="heroMarqueeRow" key={dup} aria-hidden={dup === 1}>
                {[
                  "Microservices",
                  "DevOps & SRE",
                  "Cloud Migration",
                  "Data Engineering",
                  "AI Integration",
                  "Product Engineering",
                  "Mobile",
                  "UI / UX",
                  "Platform",
                  "Security",
                  "IT Staffing",
                  "IT Consulting",
                ].map((label) => (
                  <span className="heroMarqueeItem" key={`${dup}-${label}`}>
                    <span className="heroMarqueeDot" />
                    {label}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hero {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          margin-top: -76px;
          padding: 100px 0 28px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #f5f5f5;
          background: #07090f;
        }

        .heroAmbient {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .heroPhoto {
          position: absolute;
          inset: 0;
          background-image: url("/images/cosmos-hero-visual.webp");
          background-size: cover;
          background-position: center right;
          background-repeat: no-repeat;
        }

        .heroPhotoOverlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, #07090f 0%, rgba(7, 9, 15, 0.92) 30%, rgba(7, 9, 15, 0.55) 60%, rgba(7, 9, 15, 0.35) 100%),
            linear-gradient(180deg, rgba(7, 9, 15, 0.4) 0%, transparent 30%, transparent 70%, rgba(7, 9, 15, 0.6) 100%);
        }

        .heroOrb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.7;
          mix-blend-mode: screen;
        }

        .heroOrb-a {
          width: 520px; height: 520px;
          left: -120px; top: -160px;
          background: radial-gradient(circle, rgba(255, 107, 74, 0.55), transparent 70%);
          animation: heroFloat 14s ease-in-out infinite;
        }

        .heroOrb-b {
          width: 460px; height: 460px;
          right: -120px; top: -80px;
          background: radial-gradient(circle, rgba(247, 183, 51, 0.45), transparent 70%);
          animation: heroFloat 18s ease-in-out infinite reverse;
        }

        .heroOrb-c {
          width: 380px; height: 380px;
          left: 38%; bottom: -160px;
          background: radial-gradient(circle, rgba(247, 183, 51, 0.38), transparent 70%);
          animation: heroFloat 22s ease-in-out infinite;
        }

        @keyframes heroFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.06); }
        }

        .heroGrid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(180deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 70% 60% at 20% 30%, #000, transparent 70%);
          opacity: 0.35;
        }

        .heroNoise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
          opacity: 0.05;
          mix-blend-mode: multiply;
        }

        .heroInner {
          position: relative;
          z-index: 2;
          display: grid;
          gap: 28px;
        }

        .heroTop {
          max-width: 880px;
          animation: heroRise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes heroRise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .heroTitle {
          margin: 0 0 14px;
          color: #f5f5f5;
          font-size: clamp(38px, 5.6vw, 68px);
          line-height: 0.98;
          letter-spacing: -0.018em;
          font-weight: 950;
        }

        .heroTitle em {
          font-style: italic;
          font-weight: 500;
          color: rgba(245, 245, 245, 0.5);
          letter-spacing: -0.01em;
        }

        .heroTitleAccent {
          position: relative;
          display: inline-block;
          background: linear-gradient(135deg, #ff6b4a 0%, #ffb86b 40%, #fff176 70%, #f7b733 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          padding: 0 0.04em;
        }

        .heroTitleUnderline {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -0.18em;
          width: 100%;
          height: 0.18em;
          overflow: visible;
        }

        .heroTitleUnderline path {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: heroDraw 1.2s 0.4s cubic-bezier(0.65, 0, 0.35, 1) both;
        }

        @keyframes heroDraw {
          to { stroke-dashoffset: 0; }
        }

        .heroSub {
          max-width: 640px;
          margin: 0 0 20px;
          color: rgba(245, 245, 245, 0.72);
          font-size: 15.5px;
          line-height: 1.6;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 22px;
        }

        .heroBtnPrimary svg {
          transition: transform 0.25s ease;
        }

        .heroBtnPrimary:hover svg {
          transform: translateX(3px);
        }

        .heroProof {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 18px;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          max-width: 720px;
        }

        .heroProofItem {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .heroProofItem strong {
          font-size: 19px;
          font-weight: 950;
          color: #f5f5f5;
          letter-spacing: -0.01em;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .heroProofItem span {
          font-size: 11.5px;
          font-weight: 700;
          color: rgba(245, 245, 245, 0.55);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .heroProofDivider {
          width: 1px;
          height: 28px;
          background: rgba(253, 251, 251, 0.1);
        }

        .heroCards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          animation: heroRise 1.1s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .heroCard {
          position: relative;
          overflow: hidden;
          padding: 18px 18px 16px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          box-shadow: 0 22px 58px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(22px);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.3s ease;
        }

        .heroCard:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.16);
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.5);
        }

        .heroCard::before {
          content: "";
          position: absolute;
          left: 0; right: 0; top: 0;
          height: 3px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733, #f7b733, #f7b733);
          opacity: 0.85;
        }

        .heroCardKicker {
          color: #ff6b4a;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
          
        .heroCardTitle {
          margin: 0 0 8px;
          color: #f5f5f5;
          font-size: 16px;
          line-height: 1.3;
          font-weight: 950;
          letter-spacing: -0.005em;
        }

        .heroCardBody {
          margin: 0 0 12px;
          color: rgba(245, 245, 245, 0.65);
          font-size: 12.5px;
          line-height: 1.55;
        }

        .heroCardFoot {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .heroChip {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.02em;
          color: rgba(245, 245, 245, 0.7);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .heroCard-feature {
          color: #ffffff;
          background:
            radial-gradient(ellipse at 100% 0%, rgba(255, 244, 196, 0.16), transparent 60%),
            radial-gradient(ellipse at 100% 0%, rgba(255, 107, 74, 0.25), transparent 60%), linear-gradient(135deg, #1a2236 0%, #141a2a 100%);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .heroCard-feature::before {
          background: linear-gradient(90deg, #f7b733, #ff6b4a, #f7b733);
        }

        .heroCardKicker-light {
          display: inline-block;
          margin-bottom: 12px;
          color: #f7b733;
        }

        .heroCardManifesto {
          margin: 0 0 14px;
          color: #ffffff;
          font-size: 18px;
          line-height: 1.18;
          font-weight: 950;
          letter-spacing: -0.005em;
        }

        .heroCardManifesto em {
          display: inline-block;
          margin-top: 4px;
          color: rgba(255, 255, 255, 0.62);
          font-style: italic;
          font-weight: 500;
        }

        .heroCardLink {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #f7b733;
          font-size: 13.5px;
          font-weight: 850;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition: gap 0.3s ease;
        }

        .heroCardLink:hover {
          gap: 12px;
        }

        .heroCardSparkle {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .heroCardSparkle span {
          position: absolute;
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #f7b733;
          opacity: 0.7;
          animation: heroTwinkle 3s ease-in-out infinite;
        }

        .heroCardSparkle span:nth-child(1) { top: 24%; left: 78%; animation-delay: 0s; }
        .heroCardSparkle span:nth-child(2) { top: 62%; left: 22%; animation-delay: 1s; background: #f7b733; }
        .heroCardSparkle span:nth-child(3) { top: 38%; left: 92%; animation-delay: 2s; background: #f7b733; }

        @keyframes heroTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1.4); }
        }

        .heroMarquee {
          position: relative;
          overflow: hidden;
          padding: 12px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }

        .heroMarqueeTrack {
          display: flex;
          width: max-content;
          animation: heroMarqueeScroll 38s linear infinite;
        }

        @keyframes heroMarqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .heroMarqueeRow {
          display: flex;
          gap: 38px;
          padding-right: 38px;
          flex-shrink: 0;
        }

        .heroMarqueeItem {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: rgba(245, 245, 245, 0.7);
          font-size: 14.5px;
          font-weight: 800;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }

        .heroMarqueeDot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b4a, #f7b733);
        }

        @media (max-width: 980px) {
          .hero {
            padding-top: 144px;
          }

          .heroPhotoOverlay {
            background:
              linear-gradient(90deg, #07090f 0%, rgba(7, 9, 15, 0.85) 50%, rgba(7, 9, 15, 0.7) 100%),
              linear-gradient(180deg, rgba(7, 9, 15, 0.5) 0%, transparent 30%, transparent 60%, rgba(7, 9, 15, 0.75) 100%);
          }

          .heroPhoto {
            background-position: 70% center;
          }

          .heroCards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .heroCard-feature {
            grid-column: 1 / -1;
          }

          .heroProof {
            gap: 18px;
          }
        }

        @media (max-width: 640px) {
          .hero {
            padding: 132px 0 48px;
          }

          .heroTitle {
            font-size: clamp(38px, 11vw, 54px);
          }

          .heroSub {
            font-size: 15.5px;
          }

          .heroCards {
            grid-template-columns: 1fr;
          }

          .heroProof {
            gap: 14px 18px;
          }

          .heroProofDivider {
            display: none;
          }

          .heroProofItem strong {
            font-size: 19px;
          }
        }
      `}</style>
    </section>
  );
}
