import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  Camera,
  CheckCircle2,
  Database,
  Github,
  Linkedin,
  MessagesSquare,
  MoveRight,
  MousePointer2,
  Ratio,
  ScanLine,
  Send,
  ShieldCheck,
  TestTube2,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  lazy,
  Suspense,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { ProjectVisual } from "./components/ProjectVisuals";
import { projects, type Project } from "./data/projects";

const GITHUB_URL = "https://github.com/Maddy-Mk";
const LINKEDIN_URL = "https://www.linkedin.com/in/manoj-kumar-87033a2b4";
const DISCORD_URL = "https://discord.com/users/681857641680732179";
const CONTACT_EMAIL = "manoj.kumar.sl.dev@gmail.com";
const CONTACT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
const AVATAR_URL = `${import.meta.env.BASE_URL}images/manoj-avatar.png`;
const HandScene = lazy(() =>
  import("./components/HandScene").then((module) => ({
    default: module.HandScene,
  })),
);

function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={`external-link ${className}`.trim()}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <ArrowUpRight aria-hidden="true" size={18} />
    </a>
  );
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Manoj Kumar, back to top">
        MK<span>/26</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#work">Work</a>
        <a href="#case-study">Case study</a>
        <a className="nav-optional" href="#approach">Approach</a>
        <a
          className="github-nav"
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Open Manoj Kumar's GitHub profile"
        >
          <Github aria-hidden="true" size={18} />
          <span>GitHub</span>
        </a>
      </nav>
    </header>
  );
}

function Hero({ reducedMotion }: { reducedMotion: boolean }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.12], [0, -48]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.24]);

  return (
    <>
      <section className="hero" id="top">
        <motion.div
          className="hero-inner page-shell"
          style={reducedMotion ? undefined : { y, opacity }}
        >
          <div className="hero-copy">
            <p className="eyebrow"><span>01</span> Third-year B.Tech student · India</p>
            <h1>MANOJ<br />KUMAR</h1>
            <p className="hero-role">
              Computer vision + full-stack systems
            </p>
            <p className="hero-statement">
              I build software that turns human intent into useful action —
              from webcam gestures to connected operational workflows.
            </p>
            <div className="hero-actions">
              <a className="text-action" href="#work">
                Explore the work <ArrowDown aria-hidden="true" size={18} />
              </a>
              <ExternalLink href={GITHUB_URL}>GitHub profile</ExternalLink>
            </div>
          </div>

          <div className="scene-readout" aria-hidden="true">
            <div><span>INPUT</span><strong>CAMERA / HAND</strong></div>
            <div><span>MODEL</span><strong>21 LANDMARKS</strong></div>
            <div><span>OUTPUT</span><strong>USEFUL ACTION</strong></div>
          </div>
        </motion.div>
      </section>

      <section className="signal-band" aria-label="Portfolio summary">
        <div className="page-shell signal-grid">
          <p><span>FOCUS</span> Human input → system response</p>
          <p><span>WORK</span> 03 public systems</p>
          <p><span>PROOF</span> 14 automated gesture tests</p>
          <p><span>SCROLL</span> Follow the signal <MoveRight size={16} /></p>
        </div>
      </section>
    </>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <motion.article
      className={`project-row project-row--${project.accent}`}
    >
      <div className="project-heading">
        <span className="project-index">{project.index}</span>
        <div>
          <p className="project-category">{project.category}</p>
          <h3>{project.title}</h3>
        </div>
      </div>

      <div className="project-copy">
        <p className="project-hook">{project.hook}</p>
        <p>{project.description}</p>
        <ul className="stack-list" aria-label={`${project.title} technology stack`}>
          {project.stack.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <ExternalLink href={project.repository}>View repository</ExternalLink>
      </div>

      <div className="project-media">
        <ProjectVisual type={project.visual} />
      </div>

      <dl className="project-stats">
        {project.stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </motion.article>
  );
}

function SelectedWork() {
  return (
    <section className="work-section" id="work">
      <div className="page-shell">
        <div className="section-heading">
          <p className="eyebrow"><span>02</span> Selected systems</p>
          <h2>Useful software,<br />under the surface.</h2>
          <p>
            Three projects at different scales. Each one is presented through
            the problem it handles, the system behind it, and evidence that can
            be inspected.
          </p>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <ProjectRow key={project.index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

const caseSteps = [
  {
    number: "01",
    label: "Observe",
    icon: ScanLine,
    title: "Track structure, not pixels.",
    body:
      "MediaPipe returns 21 landmarks for each detected hand. A small typed tracker owns model setup, camera frames, mirroring, and guaranteed cleanup — keeping vision concerns out of the gesture logic.",
    proof: "Camera → tracker → landmark observation",
  },
  {
    number: "02",
    label: "Normalize",
    icon: Ratio,
    title: "Make distance relative.",
    body:
      "A fixed pixel threshold changes when the hand moves toward the camera. The gesture layer divides finger distances by palm scale, then adds hysteresis, smoothing, and temporal state so intent survives noisy frames.",
    proof: "Palm-relative ratios → stable gesture state",
  },
  {
    number: "03",
    label: "Act",
    icon: MousePointer2,
    title: "Fire once, then wait.",
    body:
      "Edge-triggered pinches prevent a held gesture from clicking repeatedly. Separate Windows adapters handle master volume, global media keys, and pointer output without coupling operating-system effects to recognition.",
    proof: "Gesture event → volume / media / mouse adapter",
  },
];

function FeaturedCaseStudy() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="case-study" id="case-study">
      <div className="page-shell case-grid">
        <div className="case-intro">
          <p className="eyebrow"><span>03</span> Featured case study</p>
          <h2>A webcam became<br />the controller.</h2>
          <p>
            The hard part was not detecting a hand. It was turning uncertain
            movement into control that feels deliberate.
          </p>
          <ExternalLink href={projects[0].repository}>Read the source</ExternalLink>
        </div>

        <div className="case-steps">
          {caseSteps.map(({ number, label, icon: Icon, title, body, proof }) => (
            <motion.article
              className="case-step"
              key={number}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ amount: 0.55 }}
              transition={{ duration: 0.55, ease: [0.2, 0.75, 0.2, 1] }}
            >
              <div className="case-step-meta">
                <span>{number}</span>
                <Icon aria-hidden="true" size={22} />
              </div>
              <p className="case-label">{label}</p>
              <h3>{title}</h3>
              <p>{body}</p>
              <div className="case-proof"><CheckCircle2 size={17} /> {proof}</div>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="proof-band">
        <div className="page-shell proof-grid">
          <div><strong>21</strong><span>tracked landmarks</span></div>
          <div><strong>04</strong><span>working modes</span></div>
          <div><strong>14</strong><span>pure gesture tests</span></div>
          <div><strong>3×</strong><span>Python CI versions</span></div>
        </div>
      </div>
    </section>
  );
}

const capabilities = [
  {
    icon: Camera,
    name: "Computer vision",
    evidence:
      "Landmark tracking, scale-independent geometry, temporal gestures, and output smoothing.",
    tools: "MediaPipe · OpenCV · NumPy",
  },
  {
    icon: Database,
    name: "Backend systems",
    evidence:
      "Authenticated APIs, role-aware access, relational schemas, constraints, and operational workflows.",
    tools: "Node.js · Express · MySQL · Flask",
  },
  {
    icon: Braces,
    name: "Interface engineering",
    evidence:
      "Responsive states, clear feedback, keyboard input, and motion that explains system behavior.",
    tools: "React · JavaScript · HTML · CSS",
  },
  {
    icon: TestTube2,
    name: "Testing and delivery",
    evidence:
      "Pure domain tests, dependency boundaries, linting, documentation, and repeatable Windows CI.",
    tools: "pytest · Ruff · GitHub Actions",
  },
];

function Approach() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="approach-section" id="approach">
      <div className="page-shell">
        <div className="section-heading section-heading--compact">
          <p className="eyebrow"><span>04</span> Engineering approach</p>
          <h2>Make the behavior<br />credible.</h2>
          <p>
            I care about the decisions that survive beyond a screenshot: clear
            boundaries, understandable state, and proof that the critical path
            behaves as intended.
          </p>
        </div>

        <div className="capability-list">
          {capabilities.map(({ icon: Icon, name, evidence, tools }, index) => (
            <motion.article
              className="capability-row"
              key={name}
              initial={reducedMotion ? false : { x: -16, opacity: 0 }}
              whileInView={reducedMotion ? undefined : { x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
            >
              <span className="capability-number">0{index + 1}</span>
              <Icon aria-hidden="true" />
              <h3>{name}</h3>
              <p>{evidence}</p>
              <span className="capability-tools">{tools}</span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about-section" id="about">
      <div className="page-shell about-grid">
        <div className="about-image">
          <img
            src={AVATAR_URL}
            alt="Pixel-art GitHub profile picture used by Manoj Kumar"
            loading="lazy"
            decoding="async"
          />
          <span>GITHUB PROFILE ART / MADDY-MK</span>
        </div>
        <div className="about-copy">
          <p className="eyebrow"><span>05</span> About</p>
          <h2>I like the layer<br />between intent<br />and response.</h2>
          <p>
            I am currently in the third year of my B.Tech, building across
            Python, Node, databases, and the browser — especially where
            software has to make sense of noisy input, real workflows, or
            state that people need to trust.
          </p>
          <p>
            The goal is not complexity for its own sake. It is a system that
            feels clear on the surface because the engineering underneath is
            deliberate.
          </p>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const senderEmail = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const website = String(data.get("website") ?? "").trim();

    if (website) {
      setStatus("success");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: senderEmail,
          message,
          _subject: `Portfolio message from ${name}`,
          _template: "table",
          _captcha: "false",
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success === false || result?.success === "false") {
        throw new Error("Contact form request failed");
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="contact-section" id="contact">
      <div className="page-shell contact-shell">
        <p className="eyebrow contact-eyebrow"><span>06</span> Contact</p>
        <h2>Get in touch</h2>
        <p className="contact-lead">
          Have a project in mind? Let&apos;s create something useful together.
        </p>

        <form className="contact-form" onSubmit={submitMessage}>
          <label className="contact-honey" aria-hidden="true">
            <span>Website</span>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>

          <label className="contact-field">
            <span>Name</span>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              autoComplete="name"
              required
            />
          </label>

          <label className="contact-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="contact-field">
            <span>Message</span>
            <textarea
              name="message"
              placeholder="Tell me about your project..."
              rows={6}
              required
            />
          </label>

          <button
            className="contact-submit"
            type="submit"
            disabled={status === "sending"}
          >
            <Send aria-hidden="true" size={19} />
            {status === "sending" ? "Sending..." : "Send message"}
          </button>

          <p
            className={`contact-status contact-status--${status}`}
            aria-live="polite"
          >
            {status === "success" && "Message sent. I will get back to you soon."}
            {status === "error" && "Message could not be sent. Please try again."}
          </p>
        </form>

        <div className="contact-socials" aria-label="Social profiles">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            title="GitHub"
          >
            <Github aria-hidden="true" />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
            title="LinkedIn"
          >
            <Linkedin aria-hidden="true" />
          </a>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Discord profile, user ID 681857641680732179"
            title="Discord"
          >
            <MessagesSquare aria-hidden="true" />
          </a>
        </div>

        <p className="discord-id"></p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="page-shell footer-inner">
        <span>© 2026 Manoj Kumar</span>
        <span>Designed around input → interpretation → action</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="site-frame">
      <a className="skip-link" href="#work">Skip to selected work</a>
      <Suspense
        fallback={
          <div className="scene-layer scene-poster" aria-hidden="true">
            <span>Loading interaction rig</span>
          </div>
        }
      >
        <HandScene
          progress={scrollYProgress}
          reducedMotion={Boolean(prefersReducedMotion)}
        />
      </Suspense>
      <motion.div
        className="progress-rail"
        style={{ scaleY: progressScale }}
        aria-hidden="true"
      />
      <Header />
      <main>
        <Hero reducedMotion={Boolean(prefersReducedMotion)} />
        <SelectedWork />
        <FeaturedCaseStudy />
        <Approach />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
