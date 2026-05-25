export default function About() {
  return (
    <section id="about" className="section sectionAbout">
      <div className="aboutAmbient" aria-hidden="true">
        <div className="aboutOrb aboutOrb-a" />
        <div className="aboutOrb aboutOrb-b" />
        <div className="aboutGridBg" />
      </div>

      <div className="container aboutInner">
        <div className="aboutHeader">
          <span className="aboutEyebrow">
            <span className="aboutEyebrowDot" />
            About COSMOS
          </span>
          <h2 className="aboutTitle">
            A senior engineering studio
            <br />
            <em>built for serious software.</em>
          </h2>
          <p className="aboutLede">
            COSMOS partners with organizations to deliver modern software, cloud
            solutions, and the right technical talent — from advisory and
            architecture to implementation and staffing.
          </p>
        </div>

        <div className="aboutGrid">
          <article className="aboutCard">
            <span className="aboutKicker">What we do</span>
            <h3 className="aboutHeadline">Build, modernize, and scale.</h3>
            <p className="aboutCopy">
              We design and deliver cloud-ready systems, applications, and data
              platforms — built to be maintainable, secure, and ready for growth.
            </p>
            <ul className="aboutList">
              <li>Cloud architecture & migration</li>
              <li>Product engineering</li>
              <li>Data platforms & AI</li>
            </ul>
          </article>

          <article className="aboutCard">
            <span className="aboutKicker">How we work</span>
            <h3 className="aboutHeadline">Consultative + delivery-driven.</h3>
            <p className="aboutCopy">
              We start with clarity: requirements, architecture, timelines, and
              measurable goals. Then we execute with agile delivery, frequent
              touchpoints, and fast feedback loops.
            </p>
            <ul className="aboutList">
              <li>Discovery & architecture</li>
              <li>Two-week iterations</li>
              <li>Weekly stakeholder demos</li>
            </ul>
          </article>

          <article className="aboutCard aboutCard-feature">
            <div className="aboutCardSparkle" aria-hidden="true">
              <span /><span /><span />
            </div>
            <span className="aboutKicker aboutKicker-light">How we support</span>
            <h3 className="aboutHeadline aboutHeadline-light">
              Consulting & staffing that fits.
            </h3>
            <p className="aboutCopy aboutCopy-light">
              Need expertise or extra capacity? We provide skilled consultants,
              business analysts, and vetted engineers to support initiatives —
              contract, contract-to-hire, or direct hire.
            </p>
            <ul className="aboutList aboutList-light">
              <li>Contract & contract-to-hire</li>
              <li>Embedded teams</li>
              <li>Direct placement</li>
            </ul>
          </article>
        </div>
      </div>

      <style>{`
        .sectionAbout {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding: 120px 0 110px;
          color: #f5f5f5;
          background: linear-gradient(180deg, #07090f 0%, #0a0e1a 60%, #07090f 100%);
        }

        .aboutAmbient {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .aboutOrb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.55;
        }

        .aboutOrb-a {
          width: 480px; height: 480px;
          left: -100px; top: 80px;
          background: radial-gradient(circle, rgba(255, 107, 74, 0.4), transparent 70%);
        }

        .aboutOrb-b {
          width: 420px; height: 420px;
          right: -120px; bottom: 60px;
          background: radial-gradient(circle, rgba(247, 183, 51, 0.35), transparent 70%);
        }

        .aboutGridBg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(180deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, #000, transparent 80%);
          opacity: 0.7;
        }

        .aboutInner {
          position: relative;
          z-index: 2;
        }

        .aboutHeader {
          max-width: 800px;
          margin-bottom: 56px;
        }

        .aboutEyebrow {
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

        .aboutEyebrowDot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b4a, #f7b733);
        }

        .aboutTitle {
          margin: 22px 0 20px;
          color: #f5f5f5;
          font-size: clamp(36px, 5.4vw, 64px);
          line-height: 1;
          letter-spacing: -0.018em;
          font-weight: 950;
        }

        .aboutTitle em {
          font-style: italic;
          font-weight: 500;
          color: rgba(245, 245, 245, 0.5);
          letter-spacing: -0.01em;
        }

        .aboutLede {
          max-width: 680px;
          margin: 0;
          color: rgba(245, 245, 245, 0.72);
          font-size: 17px;
          line-height: 1.72;
        }

        /* Cards grid */
        .aboutGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .aboutCard {
          position: relative;
          overflow: hidden;
          padding: 32px 28px 30px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.035);
          box-shadow: 0 22px 58px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(22px);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.3s ease;
        }

        .aboutCard::before {
          content: "";
          position: absolute;
          left: 0; right: 0; top: 0;
          height: 3px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733, #f7b733, #f7b733);
        }

        .aboutCard:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 107, 74, 0.28);
          box-shadow: 0 28px 70px rgba(255, 107, 74, 0.14);
        }

        .aboutCardIcon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 46px; height: 46px;
          margin-bottom: 22px;
          border-radius: 12px;
          color: #ff6b4a;
          background: linear-gradient(135deg, rgba(255, 244, 196, 0.6), rgba(255, 184, 107, 0.2));
          border: 1px solid rgba(255, 107, 74, 0.18);
        }

        .aboutKicker {
          display: inline-block;
          margin-bottom: 12px;
          color: #ff6b4a;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .aboutHeadline {
          margin: 0 0 12px;
          color: #f5f5f5;
          font-size: 22px;
          line-height: 1.22;
          font-weight: 950;
          letter-spacing: -0.005em;
        }

        .aboutCopy {
          margin: 0 0 20px;
          color: rgba(245, 245, 245, 0.7);
          font-size: 14.5px;
          line-height: 1.7;
        }

        .aboutList {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 8px;
        }

        .aboutList li {
          position: relative;
          padding-left: 20px;
          color: rgba(245, 245, 245, 0.7);
          font-size: 13.5px;
          font-weight: 600;
        }

        .aboutList li::before {
          content: "";
          position: absolute;
          left: 0; top: 7px;
          width: 12px; height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733);
        }

        /* Feature card (dark) */
        .aboutCard-feature {
          color: #ffffff;
          background:
            radial-gradient(ellipse at 100% 0%, rgba(255, 244, 196, 0.16), transparent 60%),
            radial-gradient(ellipse at 100% 0%, rgba(255, 107, 74, 0.25), transparent 60%), linear-gradient(135deg, #1a2236 0%, #141a2a 100%);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .aboutCard-feature::before {
          background: linear-gradient(90deg, #f7b733, #ff6b4a, #f7b733);
        }

        .aboutCardIcon-light {
          color: #f7b733;
          background: linear-gradient(135deg, rgba(255, 244, 196, 0.18), rgba(247, 183, 51, 0.12));
          border-color: rgba(255, 244, 196, 0.28);
        }

        .aboutKicker-light { color: #f7b733; }
        .aboutHeadline-light { color: #ffffff; }
        .aboutCopy-light { color: rgba(255, 255, 255, 0.7); }

        .aboutList-light li { color: rgba(255, 255, 255, 0.72); }
        .aboutList-light li::before {
          background: linear-gradient(90deg, #f7b733, #f7b733);
        }

        .aboutCardSparkle {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .aboutCardSparkle span {
          position: absolute;
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #f7b733;
          opacity: 0.6;
          animation: aboutTwinkle 3s ease-in-out infinite;
        }

        .aboutCardSparkle span:nth-child(1) { top: 18%; right: 12%; animation-delay: 0s; }
        .aboutCardSparkle span:nth-child(2) { bottom: 28%; right: 28%; animation-delay: 1s; background: #f7b733; }
        .aboutCardSparkle span:nth-child(3) { top: 56%; right: 6%; animation-delay: 2s; background: #f7b733; }

        @keyframes aboutTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1.4); }
        }

        @media (max-width: 980px) {
          .aboutGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .aboutCard-feature {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 640px) {
          .sectionAbout {
            padding: 80px 0 72px;
          }

          .aboutGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
