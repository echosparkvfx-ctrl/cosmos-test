const footerLinks = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Training", href: "/training" },
  { label: "Why COSMOS", href: "/#why" },
  { label: "Careers", href: "/#careers" },
  { label: "Contact", href: "/#contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footerTopline" />

      <div className="container footerMain">
        <section className="footerIntro" aria-label="COSMOS footer summary">
          <a href="/#home" className="footerBrandLockup" aria-label="COSMOS home">
            <img src="/images/cosmos-logo-transparent.webp" alt="COSMOS Logo" className="footerLogo" loading="lazy" decoding="async" width="48" height="48" />
            <span className="footerBrandText">
              <span className="footerBrand">COSMOS</span>
            </span>
          </a>

          <p className="footerPitch">
            Product engineering, cloud platforms, and consulting built for teams that need dependable delivery.
          </p>

          <div className="footerBadges" aria-label="Compliance and social links">
            <div className="footerCompliance">
              <span className="footerComplianceText">An E-Verify® Participant</span>
            </div>

            <div className="footerEverify" aria-label="E-Verify® Participant">
              <img src="/images/e-verify-logo.webp" alt="E-Verify® logo" className="footerEverifyLogo" loading="lazy" decoding="async" />
            </div>

            <a
              className="footerSocial"
              href="https://www.linkedin.com/company/cosmos-nextgen-it/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="COSMOS LinkedIn posts"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11.032 20.485h-2.8v-9.299h2.8v9.299zm-1.4-10.598c-.898 0-1.624-.73-1.624-1.627 0-.897.726-1.626 1.624-1.626s1.625.729 1.625 1.626c0 .897-.727 1.627-1.625 1.627zm12.432 10.598h-2.8v-4.76c0-1.137-.02-2.599-1.585-2.599-1.587 0-1.83 1.238-1.83 2.517v4.842h-2.8v-9.299h2.688v1.272h.038c.374-.707 1.287-1.45 2.649-1.45 2.833 0 3.355 1.865 3.355 4.29v5.187z" />
              </svg>
            </a>
          </div>
        </section>

        <section className="footerContact" aria-label="Contact information">
          <p className="footerEyebrow">Austin, Texas</p>
          <address className="footerAddress">
            <strong>COSMOS NextGen IT LLC</strong>
            <span>5900 Balcones Drive, Suite 100</span>
            <span>Austin, TX 78731</span>
          </address>
          <a className="footerContactLink" href="tel:+12103909950">
            <span>Call</span>
            <strong>210.390.9950</strong>
          </a>
        </section>

        <nav className="footerNav" aria-label="Footer navigation">
          <p className="footerEyebrow">Explore</p>
          <ul className="footerNavList">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <section className="footerCta" aria-label="Start a conversation">
          <p className="footerEyebrow">Ready when you are</p>
          <h2>Build with a team that knows the path from plan to production.</h2>
          <a className="footerCtaLink" href="/#contact">
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
        </section>
      </div>

      <div className="container footerBottom">
        <span>&copy; {year} COSMOS NextGen IT LLC. All rights reserved.</span>
        <span>Building the NextGen.</span>
      </div>

      <style>{`
        .footer {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          color: #f5f5f5;
          background:
            radial-gradient(ellipse at 80% 0%, rgba(255, 107, 74, 0.12), transparent 50%),
            linear-gradient(180deg, #07090f 0%, #0a0e1a 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .footer::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(180deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 72px 72px, 72px 72px;
          opacity: 0.7;
        }

        .footerTopline {
          height: 4px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733, #7ddfbb, #13b8c8, #ff5fa2);
        }

        .footerMain {
          display: grid;
          grid-template-columns: minmax(260px, 1.35fr) minmax(210px, 0.9fr) minmax(160px, 0.7fr) minmax(260px, 1fr);
          gap: 36px;
          padding-top: 56px;
          padding-bottom: 38px;
        }

        .footerIntro,
        .footerContact,
        .footerNav,
        .footerCta {
          min-width: 0;
        }

        .footerBrandLockup {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          color: inherit;
          text-decoration: none;
        }

        .footerLogo {
          width: 64px;
          height: 64px;
          object-fit: contain;
        }

        .footerBrandText {
          display: inline-flex;
          align-items: center;
        }

        .footerBrand {
          position: relative;
          display: inline-flex;
          align-items: center;
          color: #f5f5f5;
          font-size: 28px;
          line-height: 0.95;
          font-weight: 950;
          letter-spacing: 0.055em;
        }

        .footerBrand::after {
          content: "";
          position: absolute;
          left: 2px;
          right: 3px;
          bottom: -9px;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733, #0f766e);
        }

        .footerPitch,
        .footerAddress,
        .footerBottom {
          color: rgba(245, 245, 245, 0.65);
        }

        .footerPitch {
          max-width: 390px;
          margin: 24px 0 0;
          font-size: 15px;
          line-height: 1.75;
        }

        .footerBadges {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .footerCompliance {
          display: flex;
          align-items: center;
          min-height: 48px;
        }

        .footerComplianceText {
          max-width: 110px;
          color: rgba(245, 245, 245, 0.65);
          font-size: 11px;
          line-height: 1.35;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .footerEverify {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 172px;
          min-height: 84px;
          padding: 28px;
          background: #ffffff;
        }

        .footerEverifyLogo {
          display: block;
          width: 116px;
          min-width: 100px;
          height: auto;
          object-fit: contain;
        }

        .footerSocial {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          color: #ffffff;
          background: #0a66c2;
          box-shadow: 0 16px 34px rgba(10, 102, 194, 0.28);
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }

        .footerSocial:hover {
          transform: translateY(-3px);
          background: #0b78df;
          box-shadow: 0 22px 42px rgba(10, 102, 194, 0.36);
        }

        .footerSocial svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        .footerEyebrow {
          margin: 0 0 18px;
          color: #ff6b4a;
          font-size: 12px;
          font-weight: 850;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .footerAddress {
          display: grid;
          gap: 7px;
          margin: 0;
          font-style: normal;
          font-size: 14px;
          line-height: 1.55;
        }

        .footerAddress strong {
          color: #f5f5f5;
        }

        .footerContactLink {
          display: inline-grid;
          gap: 2px;
          margin-top: 22px;
          padding: 14px 16px;
          min-width: 190px;
          color: #f5f5f5;
          text-decoration: none;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(135deg, rgba(255, 241, 118, 0.26), rgba(247, 183, 51, 0.2));
          transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }

        .footerContactLink span {
          color: rgba(245, 245, 245, 0.55);
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .footerContactLink strong {
          font-size: 17px;
          letter-spacing: 0.01em;
        }

        .footerContactLink:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 107, 74, 0.32);
          background: linear-gradient(135deg, rgba(255, 241, 118, 0.38), rgba(255, 184, 107, 0.22));
        }

        .footerNavList {
          display: grid;
          grid-template-columns: 1fr;
          gap: 11px;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footerNavList a {
          display: inline-flex;
          width: fit-content;
          color: rgba(245, 245, 245, 0.7);
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.22s ease, transform 0.22s ease;
        }

        .footerNavList a:hover {
          color: #f5f5f5;
          transform: translateX(4px);
        }

        .footerCta {
          padding: 22px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(10, 14, 26, 0.7);
          box-shadow: 0 22px 58px rgba(0, 0, 0, 0.5);
        }

        .footerCta h2 {
          margin: 0;
          color: #f5f5f5;
          font-size: 24px;
          line-height: 1.25;
          letter-spacing: 0;
        }

        .footerCtaLink {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 24px;
          padding: 13px 16px;
          border-radius: 8px;
          color: #000000;
          background: linear-gradient(135deg, #f7b733, #ffb86b, #ff6b4a);
          font-size: 14px;
          font-weight: 850;
          text-decoration: none;
          box-shadow: 0 16px 32px rgba(255, 107, 74, 0.22);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .footerCtaLink:hover {
          transform: translateY(-2px);
          box-shadow: 0 22px 40px rgba(255, 107, 74, 0.32);
        }

        .footerCtaLink svg {
          transition: transform 0.25s ease;
        }

        .footerCtaLink:hover svg {
          transform: translateX(3px);
        }

        .footerBottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-top: 22px;
          padding-bottom: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 13px;
          font-weight: 650;
          flex-wrap: wrap;
        }

        @media (max-width: 1080px) {
          .footerMain {
            grid-template-columns: minmax(260px, 1fr) minmax(240px, 1fr);
          }

          .footerCta {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 680px) {
          .footerMain {
            grid-template-columns: 1fr;
            gap: 32px;
            padding-top: 42px;
          }

          .footerLogo {
            width: 58px;
            height: 58px;
          }

          .footerPitch {
            max-width: none;
          }

          .footerNavList {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .footerCta {
            padding: 20px;
          }

          .footerCta h2 {
            font-size: 21px;
          }

          .footerBottom {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 380px) {
          .footerBadges {
            align-items: flex-start;
            flex-direction: column;
          }

          .footerNavList {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
