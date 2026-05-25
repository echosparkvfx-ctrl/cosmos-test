import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState("home");
  const location = useLocation();

  const nav = [
    { label: "Home", href: "/#home", id: "home" },
    { label: "About Us", href: "/#about", id: "about" },
    { label: "Services", href: "/#services", id: "services" },
    { label: "Training", to: "/training", route: "/training" },
    { label: "Why COSMOS", href: "/#why", id: "why" },
    { label: "Careers", href: "/#careers", id: "careers" },
  ];

  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Scroll-spy: highlight the nav link for the section currently in view.
  // Only runs on the home page (where the anchor sections exist).
  React.useEffect(() => {
    if (location.pathname !== "/") return;

    const ids = nav.filter((n) => n.id).map((n) => n.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport among those intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [location.pathname]);

  const isActive = (n) => {
    if (n.route) return location.pathname === n.route;
    if (n.id) return location.pathname === "/" && n.id === activeId;
    return false;
  };

  return (
    <header className="navWrap">
      <div className="container nav">
        <a href="/#home" className="brand" aria-label="COSMOS Home">
          <img
            src="/images/cosmos-logo-transparent.webp"
            alt="COSMOS Logo"
            className="navLogo"
            width="54"
            height="54"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
          <span className="brandCopy">
            <span className="brandText">COSMOS</span>
          </span>
        </a>

        <nav className="links desktop" aria-label="Primary">
          {nav.map((n) =>
            n.to ? (
              <Link
                key={n.label}
                to={n.to}
                className={`navLink ${isActive(n) ? "navLinkActive" : ""}`}
                aria-current={isActive(n) ? "page" : undefined}
              >
                {n.label}
              </Link>
            ) : (
              <a
                key={n.label}
                href={n.href}
                className={`navLink ${isActive(n) ? "navLinkActive" : ""}`}
                aria-current={isActive(n) ? "page" : undefined}
              >
                {n.label}
              </a>
            )
          )}
        </nav>

        <div className="navActions desktop">
          <Link to="/login/applicant" className="navAuthBtn navLogin">
            Login
          </Link>
          <Link to="/register" className="navAuthBtn navRegister">
            Register
          </Link>
        </div>

        <button
          className="mobileBtn"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`bar barTop ${open ? "open" : ""}`} />
          <span className={`bar barBottom ${open ? "open" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="mobileMenu" role="dialog" aria-label="Mobile menu">
          <div className="container mobileInner">
            {nav.map((n) =>
              n.to ? (
                <Link
                  key={n.label}
                  to={n.to}
                  className={`mobileLink ${isActive(n) ? "mobileLinkActive" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </Link>
              ) : (
                <a
                  key={n.label}
                  href={n.href}
                  className={`mobileLink ${isActive(n) ? "mobileLinkActive" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </a>
              )
            )}
            <div className="mobileAuthRow">
              <Link to="/login/applicant" className="mobileAuthBtn mobileLogin" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="mobileAuthBtn mobileRegister" onClick={() => setOpen(false)}>
                Register
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .navWrap {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(10, 14, 26, 0.92);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
        }

        .navWrap::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 3px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733, #7ddfbb, #13b8c8, #ff5fa2);
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          min-height: 76px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          min-width: max-content;
        }

        .navLogo {
          width: 54px;
          height: 54px;
          object-fit: contain;
        }

        .brandCopy {
          display: inline-flex;
          align-items: center;
        }

        .brandText {
          position: relative;
          display: inline-flex;
          align-items: center;
          color: #f5f5f5;
          font-size: 24px;
          font-weight: 950;
          letter-spacing: 0.055em;
          line-height: 0.95;
          text-transform: uppercase;
        }

        .brandText::after {
          content: "";
          position: absolute;
          left: 2px;
          right: 3px;
          bottom: -8px;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733, #0f766e);
        }

        .links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 999px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.04));
        }

        .navLink {
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          padding: 0 13px;
          border-radius: 999px;
          color: rgba(245, 245, 245, 0.7);
          font-size: 13px;
          font-weight: 850;
          white-space: nowrap;
          transition: color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
        }

        .navLink:hover {
          color: #f5f5f5;
          background: rgba(255, 255, 255, 0.05);
          box-shadow: inset 0 0 0 1px rgba(255, 107, 74, 0.18);
        }

        .navLink {
          position: relative;
        }

        .navLinkActive {
          color: #f5f5f5;
          background: rgba(255, 255, 255, 0.06);
        }

        .navLinkActive::after {
          content: "";
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 4px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733);
        }

        .navActions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .navAuthBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 38px;
          padding: 0 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 850;
          white-space: nowrap;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .navLogin {
          color: rgba(245, 245, 245, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.05);
        }

        .navLogin:hover {
          color: #f5f5f5;
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(247, 183, 51, 0.3);
          transform: translateY(-1px);
        }

        .navRegister {
          color: #0a0e1a;
          background: linear-gradient(135deg, #f7b733, #ffb86b);
          box-shadow: 0 8px 20px rgba(247, 183, 51, 0.28);
        }

        .navRegister:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(247, 183, 51, 0.36);
        }

        .mobileAuthRow {
          display: flex;
          gap: 10px;
          margin-top: 4px;
        }

        .mobileAuthBtn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 46px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 850;
          text-align: center;
          transition: opacity 0.2s;
        }

        .mobileLogin {
          color: rgba(245, 245, 245, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.05);
        }

        .mobileRegister {
          color: #0a0e1a;
          background: linear-gradient(135deg, #f7b733, #ffb86b);
          box-shadow: 0 8px 20px rgba(247, 183, 51, 0.22);
        }

        .navCta,
        .mobileCta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 18px;
          border-radius: 999px;
          color: #f5f5f5;
          font-size: 14px;
          font-weight: 950;
          background: linear-gradient(135deg, #f7b733, #ffb86b, #ff6b4a);
          box-shadow: 0 16px 34px rgba(255, 107, 74, 0.2);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }

        .navCta:hover,
        .mobileCta:hover {
          transform: translateY(-2px);
          box-shadow: 0 24px 48px rgba(255, 122, 61, 0.24);
        }

        .mobileBtn {
          display: none;
          position: relative;
          width: 42px;
          height: 42px;
          place-items: center;
          align-content: center;
          justify-items: center;
          row-gap: 5px;
          padding: 0;
          border: 1px solid rgba(7, 0, 26, 0.08);
          border-radius: 13px;
          background:
            linear-gradient(145deg, rgba(3, 0, 14, 0.08), rgba(255, 255, 255, 0.08)),
            rgba(255, 255, 255, 0.08);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
          cursor: pointer;
          transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
        }

        .mobileBtn:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 107, 74, 0.28);
          box-shadow: 0 16px 34px rgba(255, 107, 74, 0.14);
        }

        .mobileBtn:focus-visible {
          outline: 3px solid rgba(247, 183, 51, 0.26);
          outline-offset: 3px;
        }

        .bar {
          display: block;
          width: 18px;
          height: 2px;
          border-radius: 999px;
          background: #f5f5f5;
          transition: transform 0.22s ease, width 0.22s ease, background 0.22s ease;
        }

        .barBottom {
          width: 13px;
          justify-self: end;
          margin-right: 12px;
        }

        .barTop {
          margin: 0;
        }

        .barTop.open {
          width: 18px;
          transform: translateY(3.5px) rotate(45deg);
          background: #ff6b4a;
        }

        .barBottom.open {
          width: 18px;
          justify-self: center;
          margin-right: 0;
          transform: translateY(-3.5px) rotate(-45deg);
          background: #ff6b4a;
        }

        .mobileMenu {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(15, 19, 32, 0.99);
        }

        .mobileInner {
          display: grid;
          gap: 8px;
          padding-top: 14px;
          padding-bottom: 18px;
        }

        .mobileLink {
          padding: 13px 14px;
          border-radius: 10px;
          color: rgba(245, 245, 245, 0.75);
          font-weight: 850;
          background: rgba(255, 255, 255, 0.05);
        }

        .mobileLinkActive {
          color: #f5f5f5;
          background: rgba(255, 107, 74, 0.12);
          box-shadow: inset 2px 0 0 #ff6b4a;
        }

        .mobileCta {
          margin-top: 4px;
        }

        @media (max-width: 1040px) {
          .navLink {
            padding: 0 10px;
          }
        }

        @media (max-width: 930px) {
          .desktop,
          .navActions {
            display: none;
          }

          .mobileBtn {
            display: grid;
          }
        }
      `}</style>
    </header>
  );
}
