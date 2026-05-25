const PARTNERS = [
  "Northwind", "Helio", "Atlas Labs", "Meridian", "Polaris",
  "Quantum.io", "Vector", "Lumen", "Foundry", "Nimbus",
  "Stratos", "Echo", "Forma", "Kepler", "Astra",
];

export default function TrustLogos() {
  const doubled = [...PARTNERS, ...PARTNERS];
  return (
    <section className="sectionTrust" aria-label="Trusted by">
      <div className="container trustHead">
        <span className="trustEyebrow">
          <span className="trustLine" />
          Trusted by ambitious teams across 14 countries
          <span className="trustLine" />
        </span>
      </div>

      <div className="trustMarqueeWrap">
        <div className="trustFadeLeft" aria-hidden="true" />
        <div className="trustFadeRight" aria-hidden="true" />
        <div className="trustTrack">
          {doubled.map((name, i) => (
            <div key={`${name}-${i}`} className="trustItem">
              <span className="trustDot" />
              <span className="trustName">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .sectionTrust {
          position: relative;
          padding: 56px 0 64px;
          overflow: hidden;
          background: linear-gradient(180deg, #07090f 0%, #0a0e1a 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .trustHead {
          display: flex;
          justify-content: center;
          margin-bottom: 36px;
        }

        .trustEyebrow {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          color: rgba(245, 245, 245, 0.55);
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .trustLine {
          display: block;
          width: 36px;
          height: 1px;
          background: rgba(255, 255, 255, 0.16);
        }

        .trustMarqueeWrap {
          position: relative;
          overflow: hidden;
        }

        .trustFadeLeft,
        .trustFadeRight {
          position: absolute;
          top: 0; bottom: 0;
          width: 120px;
          z-index: 2;
          pointer-events: none;
        }

        .trustFadeLeft {
          left: 0;
          background: linear-gradient(90deg, #07090f, transparent);
        }

        .trustFadeRight {
          right: 0;
          background: linear-gradient(-90deg, #07090f, transparent);
        }

        .trustTrack {
          display: flex;
          width: max-content;
          gap: 56px;
          animation: trustScroll 50s linear infinite;
        }

        @keyframes trustScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .trustItem {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(245, 245, 245, 0.35);
          transition: color 0.3s ease;
        }

        .trustItem:hover {
          color: #f5f5f5;
        }

        .trustDot {
          width: 8px; height: 8px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.25);
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .trustItem:hover .trustDot {
          background: linear-gradient(135deg, #ff6b4a, #f7b733);
          border-color: transparent;
        }

        .trustName {
          font-size: 22px;
          font-weight: 950;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .trustName {
            font-size: 18px;
          }

          .trustTrack {
            gap: 38px;
          }
        }
      `}</style>
    </section>
  );
}
