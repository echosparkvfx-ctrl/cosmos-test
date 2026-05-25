import React from "react";

const trainingAreas = [
    {
        title: "Foundational Technical Training",
        desc: "Core programming, cloud fundamentals, and system design for new and growing teams.",
    },
    {
        title: "Cloud & DevOps Enablement",
        desc: "AWS/Azure/GCP, CI/CD, IaC, observability—hands-on training that matches how teams ship.",
    },
    {
        title: "Skills Assessment & Training Plans",
        desc: "Pre-training assessments to identify gaps and build targeted learning paths.",
    },
    {
        title: "Certifications & Post-Training Validation",
        desc: "Knowledge checks, certifications guidance, and reinforcement to keep skills sticky.",
    },
];

export default function Training() {
    return (
        <main className="trainingPage">
            <section className="trainingHero">
                <div className="trainingHeroImage" aria-hidden="true">
                    <img
                        src="/images/cosmos-training-visual.webp"
                        alt=""
                        loading="eager"
                        fetchpriority="high"
                        decoding="async"
                    />
                </div>
                <div className="container">
                    <div className="trainingEyebrow">COSMOS Training</div>
                    <h1 className="title">Training & Education</h1>
                    <p className="subtitle">
                        Practical technology training designed to close skill gaps, accelerate adoption,
                        and turn learning into execution.
                    </p>

                    <div className="ctaRow">
                        <a className="btnPrimary" href="/#contact">Request Training</a>
                    </div>

                    <div className="trainingPillRow">
                        <span className="pill">Instructor-led</span>
                        <span className="pill">Self-paced options</span>
                        <span className="pill">Custom curriculum</span>
                    </div>
                </div>
            </section>

            <section className="section section-light">
                <div className="container">
                    <h2 className="section-title">What we offer</h2>
                    <p className="section-subtitle">
                        Training built by engineers who actually ship production systems — not slide-deck merchants.
                    </p>

                    <div className="trainingGrid">
                        {trainingAreas.map((t) => (
                            <div key={t.title} className="card trainingCard">
                                <div className="kicker">Training Track</div>
                                <div className="headline">{t.title}</div>
                                <p className="copy">{t.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section section-light">
                <div className="container">
                    <h2 className="section-title">How it works</h2>

                    <div className="howGrid">
                        <div className="card howCard">
                            <div className="headline">Assess</div>
                            <p className="copy">We baseline skills, roles, and goals. No guessing. No vibes.</p>
                        </div>

                        <div className="card howCard">
                            <div className="headline">Train</div>
                            <p className="copy">Hands-on sessions using real examples aligned to your stack.</p>
                        </div>

                        <div className="card howCard">
                            <div className="headline">Validate</div>
                            <p className="copy">Post-training checks + optional certification support.</p>
                        </div>
                    </div>

                    <div className="bottomCta">
                        <a className="btnPrimary" href="/#contact">Talk to us about Training</a>
                    </div>
                </div>
            </section>

            <style>{`
        .trainingPage {
          background: #0a0e1a;
        }

        .trainingHero {
          position: relative;
          overflow: hidden;
          padding: 98px 0 78px;
          color: #f5f5f5;
          background: #0a0e1a;
        }

        .trainingHero::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(90deg, rgba(0, 0, 0, 0.94), rgba(0, 0, 0, 0.76), rgba(0, 0, 0, 0.18)),
            linear-gradient(180deg, rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.94));
        }

        .trainingHero .container {
          position: relative;
          z-index: 2;
        }

        .trainingHeroImage {
          position: absolute;
          inset: 0;
        }

        .trainingHeroImage img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 68% center;
        }

        .trainingEyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          color: #ff6b4a;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .trainingEyebrow::before {
          content: "";
          width: 36px;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733, #f7b733);
        }

        .title {
          max-width: 760px;
          font-size: clamp(36px, 5.5vw, 58px);
          line-height: 1.04;
          margin: 0 0 18px;
          letter-spacing: 0;
          color: #f5f5f5;
          font-weight: 950;
        }

        .subtitle {
          margin: 0 0 28px;
          max-width: 760px;
          color: rgba(245, 245, 245, 0.7);
          line-height: 1.85;
          font-size: 16.5px;
        }

        .ctaRow {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }

        .trainingPillRow {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .trainingGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .trainingCard,
        .howCard {
          position: relative;
          padding: 26px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: var(--radius-lg);
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(20px);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .trainingCard::before,
        .howCard::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 3px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733);
        }

        .trainingCard:hover,
        .howCard:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 107, 74, 0.28);
          box-shadow: 0 28px 70px rgba(255, 107, 74, 0.14);
        }

        .kicker {
          font-size: 12px;
          color: #ff6b4a;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .headline {
          font-size: 18.5px;
          font-weight: 900;
          color: #f5f5f5;
          margin-bottom: 10px;
        }

        .copy {
          margin: 0;
          color: rgba(245, 245, 245, 0.65);
          line-height: 1.7;
          font-size: 14.5px;
        }

        .howGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .bottomCta {
          margin-top: 26px;
          display: flex;
        }

        @media(max-width: 900px) {
          .trainingHero {
            padding: 78px 0 62px;
          }

          .trainingGrid,
          .howGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </main>
    );
}
