import React, { useState, useEffect, useRef, useCallback } from "react";

// ---------------------------------------------------------------------------
// LOCAL GRAPHICS IMAGES
// Put your image files in src/assets/images/ and uncomment + fix the
// filenames below. Vite will bundle and optimize them automatically.
// ---------------------------------------------------------------------------
// import tournamentKeyArt from "./assets/images/tournament-key-art.jpg";
// import chandigarhKingsVisual from "./assets/images/chandigarh-kings-visual.jpg";
// import metaAdsCreative from "./assets/images/meta-ads-creative.jpg";

// ---------------------------------------------------------------------------
// Crafted by Avian — React conversion
// Original: single-page vanilla HTML/CSS/JS site with DOM-based "sub-page"
// switching. Converted to a single React component using useState for view
// routing, useEffect + IntersectionObserver for scroll-reveal, and a small
// curtain-wipe transition between views.
// ---------------------------------------------------------------------------

const SKILLS = [
  "Premiere Pro",
  "After Effects",
  "Illustrator",
  "Figma",
  "DaVinci Resolve",
];

const TESTIMONIALS = [
  {
    quote:
      "While in his time at Rotaract he was an invaluable asset to the team he helped us manage events with more than 4k footfall while being an exceptional editor he is...hoping for an opportunity to work with him again",
    name: "Rotaract Club of SD College",
    role: "Organization",
    avatar: "a1",
    initials: "RC",
    avatarImg: "/rotaract-avatar.jpg"
  },
  {
    quote:
      "Avian just gets it. Every edit feels like it's made to keep viewers hooked till the very end. Super easy to work with and always brings fresh ideas.",
    name: "Venom",
    role: "Creator",
    avatar: "a2",
    initials: "V",
    avatarImg: "/venom-avatar.jpg"
  },
  {
    quote:
      "In THF we were unable to provide him with the best raw footage YET he manage to exceed our expectations providing us with content far beyond our initial expectations, totally worth working with him its a delight always",
    name: "The Himalayan Foundation Chandigarh",
    role: "Organization",
    avatar: "a3",
    initials: "TH",
    avatarImg: "/thf-avatar.jpg"
  },
  {
    quote:
      "One of the smoothest collaborations I've had. Avian not only edits but also understands content strategy. The videos performed way better after his touch.",
    name: "MJ",
    role: "Creator",
    avatar: "a4",
    initials: "MJ",
    avatarImg: "/mj-avatar.jpg"
  },
  {
    quote:
      "Fast, reliable, and insanely talented. He took our rough footage and turned it into something we were proud to showcase. Couldn't recommend enough!",
    name: "Noxiee",
    role: "Creator",
    avatar: "a5",
    initials: "N",
    avatarImg: "/noxiee-avatar.jpg"
  },
  {
    quote:
      "During his time he mainly handled everything related to the Prom night we organise and it's our pleasure to say that he was the one doing it from A to Z, exceptionally good work must say",
    name: "Enactus Ggdsd",
    role: "Organization",
    avatar: "a6",
    initials: "EG",
    avatarImg: "/enactlgo.jpeg"
  },
];

const REELS = [
  {
    "videoId": "FARmdZ_YjOI",
    "title": "CINEMATIC FAST-PACED EDITS",
    "desc": "High energy visual pacing, advanced color grading, and dynamic sound effects built to maximize continuous watch time loops.",
    "badge": "AFTER EFFECTS & DAVINCI"
  },
  {
    "videoId": "V5AYaMBRhog",
    "title": "BRAND STORYTELLING & VFX",
    "desc": "Seamless compositing work with modern text structures tracking raw, fast-cutting footage for high viewer retention metrics.",
    "badge": "VFX & MOTION GRAPHICS"
  },
  {
    "videoId": "kJB9xZj9UCw",
    "title": "TRAILER REEL",
    "desc": "A high-octane showcase of cinematic video editing and dynamic motion graphics. Features precise pacing, seamless transitions, and creative color grading designed to build high energy and engagement.",
    "badge": "Video Editing"
  },
  {
    "videoId": "RmA_vHOzM8I",
    "title": "TRENDING REEL",
    "desc": "Dynamic short-form video optimized for social media platforms and high viewer retention. Crafted with attention-grabbing hooks, fast-paced narrative cuts, clean audio leveling, and kinetic pacing engineered to maximize scroll-stopping engagement and algorithmic performance.",
    "badge": "Social Media Editing"
  }
];

const EVENTS = [
  {
    "videoId": "kJB9xZj9UCw",
    "stat": "4,000+",
    "statLabel": "ACTIVE STADIUM AUDIENCE FOOTFALL",
    "title": "ROTARACT CLUB SPORTS INITIATIVES",
    "desc": "Coordinated primary event design frameworks and interactive sports content marketing pipelines, driving large student engagement across multiple high-traffic operational venues.",
    "badge": "EVENT COORDINATOR & VIDEO LEAD"
  },
  {
    "videoId": "7EmybvvJVVM",
    "stat": "2,500+",
    "statLabel": "FULL EXECUTION PIPELINE (A TO Z)",
    "title": "ENACTUS PROM NIGHT GALA",
    "desc": "Directed comprehensive tactical promotional structures, site coordination blueprints, brand execution frameworks, and complete visual theme asset rendering across the entire event.",
    "badge": "OPERATIONS & SOCIAL MEDIA HANDLING"
  }
];

const GRAPHICS = [
  {
    "title": "RIWAYAT KEY ART",
    "desc": "Custom poster layouts designed for digital engagement and local print distribution.",
    "badge": "EVENT PROMO",
    "imageUrl": "/rotarct.jpg"
  },
  {
    "title": "CHANDIGARH KINGS VISUAL IDENTITY",
    "desc": "Full team corporate brand creation architecture, custom uniform kit designs, and high-contrast vector primary logo components.",
    "badge": "LOGO BRANDING",
    "imageUrl": "/chandigarhkings.jpeg"
  },
  {
    "title": "META ADS HIGH-CONVERSION CREATIVE",
    "desc": "High-performance conversion poster layouts balancing data typography hierarchies with clean aesthetic structural space parameters.",
    "badge": "MARKETING IDENTITY ASSET",
    "imageUrl": "/thf.jpg"
  }
];

// ---------------------------------------------------------------------------
// Click-to-play video preview. Shows the YouTube thumbnail first (fast,
// lightweight) and only mounts the real iframe once the user clicks —
// avoids loading 6+ embeds up front.
// ---------------------------------------------------------------------------
function VideoPreview({ videoId, title }) {
  const [loaded, setLoaded] = useState(false);
  // Strip any query string (e.g. "?si=...") to build a clean thumbnail URL.
  const bareId = videoId.split("?")[0];
  // Try the 1280x720 thumbnail first; not every video has one, so fall back
  // to hqdefault (480x360) when YouTube serves its tiny gray placeholder.
  const [thumb, setThumb] = useState(`https://img.youtube.com/vi/${bareId}/maxresdefault.jpg`);

  if (loaded) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  const fallback = () =>
    setThumb(`https://img.youtube.com/vi/${bareId}/hqdefault.jpg`);

  return (
    <button
      className="video-preview-btn"
      onClick={() => setLoaded(true)}
      aria-label={`Play ${title}`}
    >
      <img
        className="video-preview-thumb"
        src={thumb}
        alt=""
        loading="lazy"
        onError={fallback}
        onLoad={(e) => {
          // YouTube returns a 120x90 gray placeholder when maxres is missing.
          if (e.currentTarget.naturalWidth <= 120 && thumb.includes("maxresdefault")) {
            fallback();
          }
        }}
      />
      <span className="video-preview-play">▶</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Image preview for the Graphics grid. Falls back to a clearly-labeled
// placeholder if no imageUrl has been supplied yet.
// ---------------------------------------------------------------------------
function ImagePreview({ imageUrl, title }) {
  const [failed, setFailed] = useState(false);
  if (!imageUrl || failed) {
    return (
      <div className="image-preview-placeholder">
        <span>Add image for &quot;{title}&quot;</span>
      </div>
    );
  }
  return (
    <img
      className="image-preview-img"
      src={imageUrl}
      alt={title}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

// ---------------------------------------------------------------------------
// Testimonial avatar: photo if provided (falls back to initials if the photo
// fails to load), otherwise initials, otherwise the plain colored circle.
// ---------------------------------------------------------------------------
function Avatar({ avatar, avatarImg, initials, name }) {
  const [failed, setFailed] = useState(false);
  const showImg = avatarImg && !failed;
  return (
    <div className={`avatar ${avatar}`}>
      {showImg ? (
        <img
          src={avatarImg}
          alt={name}
          className="avatar-img"
          onError={() => setFailed(true)}
        />
      ) : initials ? (
        <span className="avatar-initials">{initials}</span>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scroll-reveal hook (replaces the vanilla IntersectionObserver block)
// ---------------------------------------------------------------------------
function useRevealOnScroll(deps = []) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState({});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cards = container.querySelectorAll("[data-reveal-id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-reveal-id");
            setVisible((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { containerRef, visible };
}

export default function App() {
  // 'main' | 'reels-view' | 'events-view' | 'graphics-view'
  const [view, setView] = useState("main");
  const [closing, setClosing] = useState(false); // curtain animation state
  const workRef = useRef(null);
  const aboutRef = useRef(null);

  const { containerRef: gridRef, visible: cardsVisible } = useRevealOnScroll([view]);

  // Runs `callback` while the curtains are closed, then reopens them.
  const triggerTransition = useCallback((callback) => {
    setClosing(true);
    setTimeout(() => {
      callback();
      setClosing(false);
    }, 800);
  }, []);

  const goHome = () => {
    triggerTransition(() => {
      window.scrollTo(0, 0);
    });
  };

  const goToWork = () => {
    triggerTransition(() => {
      setView("main");
      requestAnimationFrame(() => {
        workRef.current?.scrollIntoView({ behavior: "auto" });
      });
    });
  };

  const enterPortfolio = () => {
    triggerTransition(() => {
      workRef.current?.scrollIntoView();
    });
  };

  const openSubPage = (target) => {
    triggerTransition(() => {
      setView(target);
      window.scrollTo(0, 0);
    });
  };

  const backToPortfolio = () => {
    triggerTransition(() => {
      setView("main");
      requestAnimationFrame(() => {
        workRef.current?.scrollIntoView();
      });
    });
  };

  return (
    <div className="avian-root">
      <style>{CSS}</style>

      {/* Cinematic curtains */}
      <div className={`curtain-panel curtain-left ${closing ? "close" : ""}`} />
      <div className={`curtain-panel curtain-right ${closing ? "close" : ""}`} />

      <div className="video-bg-placeholder" />

      {/* Navigation */}
      <nav>
        <h2 id="home-logo" onClick={goHome}>
          CRAFTED BY AVIAN
        </h2>
        <div className="nav-links">
          <a
            href="#"
            className="nav-home"
            onClick={(e) => {
              e.preventDefault();
              if (view !== "main") {
                backToPortfolio();
              } else {
                goHome();
              }
            }}
          >
            Home
          </a>
          <a
            href="#work"
            id="nav-work"
            onClick={(e) => {
              e.preventDefault();
              if (view !== "main") {
                backToPortfolio();
              } else {
                goToWork();
              }
            }}
          >
            Work
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              if (view !== "main") {
                triggerTransition(() => {
                  setView("main");
                  requestAnimationFrame(() => aboutRef.current?.scrollIntoView());
                });
              } else {
                aboutRef.current?.scrollIntoView();
              }
            }}
          >
            About Me
          </a>
          <a
            href="#about"
            className="nav-btn"
            onClick={(e) => {
              e.preventDefault();
              if (view !== "main") {
                triggerTransition(() => {
                  setView("main");
                  requestAnimationFrame(() => aboutRef.current?.scrollIntoView());
                });
              } else {
                aboutRef.current?.scrollIntoView();
              }
            }}
          >
            Contact Me
          </a>
        </div>
      </nav>

      {/* ==================== MAIN HOMEPAGE ==================== */}
      {view === "main" && (
        <div id="main-view">
          <header className="hero">
            <h1>
              Pixels &<br />
              Timelines.
            </h1>
            <p>Directing the eye through design and motion.</p>
            <a id="portfolio-btn" className="btn-glass" href="#work" onClick={(e) => { e.preventDefault(); enterPortfolio(); }}>
              Enter Portfolio
            </a>
          </header>

          <div className="marquee-container">
            <div className="marquee-content">
              {[...SKILLS, ...SKILLS].map((skill, i) => (
                <React.Fragment key={i}>
                  <span>{skill}</span>
                  <span>✦</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Portfolio Section */}
          <section id="work" ref={workRef} className="section">
            <div className="grid" ref={gridRef}>
              <a
                href="#"
                data-reveal-id="card-reels"
                className={`card portfolio-link ${cardsVisible["card-reels"] ? "show" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  openSubPage("reels-view");
                }}
              >
                Reels by Avian
              </a>
              <a
                href="#"
                data-reveal-id="card-events"
                className={`card portfolio-link ${cardsVisible["card-events"] ? "show" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  openSubPage("events-view");
                }}
              >
                Events Promotions
              </a>
              <a
                href="#"
                data-reveal-id="card-graphics"
                className={`card portfolio-link ${cardsVisible["card-graphics"] ? "show" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  openSubPage("graphics-view");
                }}
              >
                Graphic Designs
              </a>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="section">
            <h2 className="section-title">What People Say</h2>
            <div className="section-divider" />
            <div className="testimonials-grid">
              {TESTIMONIALS.map((t, i) => (
                <div className="test-card" key={i}>
                  <p>&quot;{t.quote}&quot;</p>
                  <div className="test-author">
                    <Avatar
                      avatar={t.avatar}
                      avatarImg={t.avatarImg}
                      initials={t.initials}
                      name={t.name}
                    />
                    <div className="author-info">
                      <h4>{t.name}</h4>
                      <span>{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* About / Contact */}
          <section id="about" ref={aboutRef} className="about-wrapper">
            <div className="about-card">
              <h2>HI THERE, I&apos;M AVIAN</h2>
              <p>
                I help brands and creators craft compelling visuals that captivate audiences and
                drive engagement. As a video editor and graphic designer, I combine creative
                editing, eye-catching graphics, and seamless storytelling to transform raw ideas
                into content that leaves a lasting impression.
              </p>
              <p>
                Let&apos;s create content that not only looks great but delivers real results.{" "}
                <a href="mailto:aayushmaannain1@gmail.com">Connect</a> with me and let&apos;s make
                it happen!
              </p>
              <div className="social-icons">
                <a
                  href="https://www.instagram.com/aayushmaan_nain/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="mailto:aayushmaannain1@gmail.com" aria-label="Email">
                  <svg viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </a>
                <a
                  href="https://discordapp.com/users/1033723282400223283"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discord"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        </div>
      )}
      {/* ==================== END MAIN HOMEPAGE ==================== */}

      {/* ==================== SUB-PAGES ==================== */}

      {view === "reels-view" && (
        <section className="sub-page section" style={{ display: "block" }}>
          <button className="back-btn" onClick={backToPortfolio}>
            ← Back to Portfolio
          </button>
          <h2 className="section-title">MOTION & REELS</h2>
          <div className="section-divider" />

          <div className="detail-grid two-col">
            {REELS.map((reel, i) => (
              <div className="detail-card" key={i}>
                <div className="media-box video-tall">
                  <VideoPreview videoId={reel.videoId} title={`YouTube Short / Reel ${i + 1}`} />
                </div>
                <div className="detail-content">
                  <h4>{reel.title}</h4>
                  <p>{reel.desc}</p>
                  <span className="badge">{reel.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {view === "events-view" && (
        <section className="sub-page section" style={{ display: "block" }}>
          <button className="back-btn" onClick={backToPortfolio}>
            ← Back to Portfolio
          </button>
          <h2 className="section-title">EVENT PROMOTION OPERATIONS</h2>
          <div className="section-divider" />

          <div className="detail-grid">
            {EVENTS.map((ev, i) => (
              <div className="detail-card" key={i}>
                <div className="media-box video-wide">
                  <VideoPreview videoId={ev.videoId} title={`Event Video ${i + 1}`} />
                </div>
                <div className="detail-content">
                  <div className="stat-header">
                    <h3>{ev.stat}</h3>
                    <span>{ev.statLabel}</span>
                  </div>
                  <h4>{ev.title}</h4>
                  <p>{ev.desc}</p>
                  <span className="badge">{ev.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {view === "graphics-view" && (
        <section className="sub-page section" style={{ display: "block" }}>
          <button className="back-btn" onClick={backToPortfolio}>
            ← Back to Portfolio
          </button>
          <h2 className="section-title">GRAPHIC DESIGN & POSTERS</h2>
          <div className="section-divider" />

          <div className="detail-grid">
            {GRAPHICS.map((g, i) => (
              <div className="detail-card" key={i}>
                <div className="media-box image-wide">
                  <ImagePreview imageUrl={g.imageUrl} title={g.title} />
                </div>
                <div className="detail-content">
                  <h4>{g.title}</h4>
                  <p>{g.desc}</p>
                  <span className="badge">{g.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer>
        <div className="footer-left">© 2026 Avian. All rights reserved.</div>
        <div className="footer-logo">AVIAN</div>
        <div className="footer-links">
          <a href="https://www.instagram.com/aayushmaan_nain/" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href="mailto:aayushmaannain1@gmail.com">Email</a>
          <a href="https://discordapp.com/users/1033723282400223283" target="_blank" rel="noopener noreferrer">
            Discord
          </a>
        </div>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// All original CSS, ported verbatim (selectors unchanged since React renders
// the same class names via JSX className).
// ---------------------------------------------------------------------------
const CSS = `
.avian-root, .avian-root * { margin: 0; padding: 0; box-sizing: border-box; }
.avian-root {
  font-family: 'Helvetica Neue', sans-serif;
  background-color: #000;
  color: #fff;
  overflow-x: hidden;
}

.video-bg-placeholder {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: linear-gradient(45deg, #000000, #151515, #0a0a0a, #000000);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  z-index: -1;
}
@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.avian-root nav {
  position: fixed;
  top: 0; width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 5%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 100;
}
.avian-root nav h2 { font-weight: 900; letter-spacing: 1px; text-transform: uppercase; font-size: 1.2rem; cursor: pointer; }
.avian-root .nav-links { display: flex; align-items: center; gap: 2rem; }
.avian-root .nav-links a { color: #ccc; text-decoration: none; font-weight: 400; transition: all 0.3s; font-size: 0.95rem; }
.avian-root .nav-links a:hover { color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.5); }
.avian-root .nav-btn {
  background: #1a1a1a;
  color: #fff !important;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
}
.avian-root .nav-btn:hover {
  background: #fff;
  color: #000 !important;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255,255,255,0.2);
}

.avian-root .hero {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 5%;
}
.avian-root .hero h1 {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  text-transform: uppercase;
  line-height: 0.9;
  margin-bottom: 1rem;
  letter-spacing: -2px;
}
.avian-root .hero p { font-size: 1.5rem; font-weight: 300; opacity: 0.8; margin-bottom: 3rem; }

.avian-root .btn-glass {
  padding: 1rem 3rem;
  font-size: 1.2rem;
  color: #fff;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-block;
}
.avian-root .btn-glass:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.4);
}

.avian-root .marquee-container {
  width: 100%;
  overflow: hidden;
  background: #000;
  padding: 1rem 0;
  border-top: 1px solid rgba(255,255,255,0.1);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.avian-root .marquee-content {
  display: flex;
  white-space: nowrap;
  animation: marquee 20s linear infinite;
}
.avian-root .marquee-content span {
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.5);
  margin-right: 3rem;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.avian-root .section { padding: 6rem 5%; }
.avian-root .section-title { text-align: center; font-size: 2.5rem; font-weight: 900; letter-spacing: 2px; margin-bottom: 1rem; text-transform: uppercase; }
.avian-root .section-divider { width: 60px; height: 3px; background: #fff; margin: 0 auto 4rem; }

.avian-root .grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
.avian-root .card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  aspect-ratio: 16/9;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Komika Axis', 'Helvetica Neue', sans-serif;
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  padding: 0 1rem;
  font-weight: 400; color: #ffffff; text-decoration: none;
  cursor: pointer; opacity: 0; transform: translateY(50px);
  transition: opacity 0.8s ease, transform 0.8s ease, border-color 0.4s ease, box-shadow 0.4s ease;
}
.avian-root .card.show { opacity: 1; transform: translateY(0); }
.avian-root .card.show:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-10px);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 20px 40px rgba(255, 255, 255, 0.15);
}

@media (min-width: 768px) {
  .avian-root .grid { grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr; }
  .avian-root .card:nth-child(1) { grid-column: 1 / 2; grid-row: 1 / 3; aspect-ratio: auto; min-height: 500px; transition-delay: 0.1s; }
  .avian-root .card:nth-child(2) { grid-column: 2 / 3; grid-row: 1 / 2; transition-delay: 0.2s; }
  .avian-root .card:nth-child(3) { grid-column: 2 / 3; grid-row: 2 / 3; transition-delay: 0.3s; }
}

.avian-root .sub-page { padding-top: 120px; min-height: 100vh; }
.avian-root .back-btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: transparent; color: #aaa; border: none;
  font-size: 1rem; cursor: pointer; transition: color 0.3s;
  margin-bottom: 2rem; font-weight: bold; text-transform: uppercase;
}
.avian-root .back-btn:hover { color: #fff; }

.avian-root .detail-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; margin-top: 2rem; }
@media (min-width: 768px) {
  .avian-root .detail-grid { grid-template-columns: repeat(3, 1fr); }
  .avian-root .detail-grid.two-col { grid-template-columns: repeat(2, 1fr); max-width: 1000px; margin-left: auto; margin-right: auto; }
}

.avian-root .detail-card {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, border-color 0.3s;
}
.avian-root .detail-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.2); }

.avian-root .media-box {
  width: 100%;
  background: #1a1a1a;
  position: relative;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
}
.avian-root .media-box.video-tall { aspect-ratio: 9/16; }
.avian-root .media-box.video-wide { aspect-ratio: 16/9; }
.avian-root .media-box.image-wide { aspect-ratio: 4/5; }

.avian-root .media-box iframe {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  border: none;
}

.avian-root .video-preview-btn {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  border: none;
  cursor: pointer;
  background-color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  overflow: hidden;
}
.avian-root .video-preview-thumb {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
}
.avian-root .video-preview-play { position: relative; z-index: 1; }
.avian-root .video-preview-play {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  transition: transform 0.2s ease, background 0.2s ease;
}
.avian-root .video-preview-btn:hover .video-preview-play {
  transform: scale(1.1);
  background: rgba(255,255,255,0.25);
}

.avian-root .image-preview-img {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
}
.avian-root .image-preview-placeholder {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  color: #666;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px dashed rgba(255,255,255,0.15);
}

.avian-root .detail-content { padding: 2rem; flex-grow: 1; display: flex; flex-direction: column; }
.avian-root .stat-header { margin-bottom: 1rem; }
.avian-root .stat-header h3 { font-size: 2.2rem; font-weight: 900; line-height: 1; margin-bottom: 0.2rem; }
.avian-root .stat-header span { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 1px; }

.avian-root .detail-content h4 { font-size: 1.2rem; font-weight: 800; text-transform: uppercase; margin-bottom: 0.8rem; line-height: 1.3;}
.avian-root .detail-content p { font-size: 0.9rem; color: #999; line-height: 1.6; margin-bottom: 1.5rem; flex-grow: 1; }
.avian-root .badge {
  align-self: flex-start; background: rgba(255,255,255,0.1);
  padding: 0.4rem 0.8rem; border-radius: 4px; font-size: 0.7rem;
  text-transform: uppercase; letter-spacing: 1px; color: #ddd; font-weight: 600;
}

.avian-root .testimonials-grid { column-count: 1; column-gap: 1.5rem; max-width: 1200px; margin: 0 auto; }
@media (min-width: 768px) { .avian-root .testimonials-grid { column-count: 2; } }
@media (min-width: 1024px) { .avian-root .testimonials-grid { column-count: 3; } }

.avian-root .test-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  break-inside: avoid;
  display: inline-block;
  width: 100%;
  font-weight: 300;
  line-height: 1.6;
  color: #eaeaea;
  transition: box-shadow 0.3s ease;
}
.avian-root .test-card:hover { box-shadow: 0 10px 30px rgba(255, 255, 255, 0.05); }
.avian-root .test-author { display: flex; align-items: center; margin-top: 1.5rem; gap: 1rem; }
.avian-root .avatar {
  width: 40px; height: 40px; border-radius: 50%; background: #333;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; flex-shrink: 0;
}
.avian-root .avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avian-root .avatar-initials { font-size: 0.8rem; font-weight: 700; color: #fff; letter-spacing: 0.5px; }
.avian-root .a1 { background: #555; } .avian-root .a2 { background: #777; } .avian-root .a3 { background: #444; }
.avian-root .a4 { background: #888; } .avian-root .a5 { background: #666; } .avian-root .a6 { background: #999; }
.avian-root .author-info h4 { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.2rem; color: #fff;}
.avian-root .author-info span { font-size: 0.75rem; color: #aaa; }

.avian-root .about-wrapper { display: flex; justify-content: center; align-items: center; padding: 4rem 5%; }
.avian-root .about-card {
  background: #0a0a0a;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 16px;
  padding: 4rem;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(255, 255, 255, 0.1);
}
.avian-root .about-card h2 { font-size: 2.5rem; font-weight: 900; text-transform: uppercase; margin-bottom: 2rem; }
.avian-root .about-card p { font-size: 1rem; font-weight: 400; line-height: 1.8; margin-bottom: 1.5rem; color: #ccc; text-transform: uppercase; }
.avian-root .about-card a { color: #fff; text-decoration: underline; text-underline-offset: 4px; transition: text-shadow 0.3s; }
.avian-root .about-card a:hover { text-shadow: 0 0 10px rgba(255,255,255,0.8); }

.avian-root .social-icons { display: flex; gap: 1.5rem; margin-top: 3rem; }
.avian-root .social-icons a { display: inline-flex; }
.avian-root .social-icons svg { width: 24px; height: 24px; fill: #fff; transition: all 0.3s; cursor: pointer; }
.avian-root .social-icons a:hover svg { opacity: 1; filter: drop-shadow(0 0 8px rgba(255,255,255,0.8)); transform: translateY(-2px); }

.avian-root footer {
  display: flex; justify-content: space-between; align-items: center; padding: 2rem 5%;
  border-top: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.5);
  backdrop-filter: blur(10px); font-size: 0.85rem; color: #888;
}
.avian-root .footer-logo { font-weight: 900; color: #fff; font-size: 1.2rem; letter-spacing: 1px; }
.avian-root .footer-links { display: flex; gap: 1.5rem; }
.avian-root .footer-links a { color: #888; text-decoration: none; transition: color 0.3s; }
.avian-root .footer-links a:hover { color: #fff; text-shadow: 0 0 8px rgba(255,255,255,0.5); }

.avian-root .curtain-panel {
  position: fixed; top: 0; width: 50vw; height: 100vh; background: #000;
  z-index: 9999; pointer-events: none; transition: transform 0.8s cubic-bezier(0.86, 0, 0.07, 1);
}
.avian-root .curtain-left { left: 0; transform: translateX(-100%); }
.avian-root .curtain-right { right: 0; transform: translateX(100%); }
.avian-root .curtain-left.close, .avian-root .curtain-right.close { transform: translateX(0); }

@media (max-width: 768px) {
  .avian-root .nav-links a:not(.nav-btn) { display: none; }
  .avian-root .about-card { padding: 2rem; }
  .avian-root footer { flex-direction: column; gap: 1rem; text-align: center; }
}
`;