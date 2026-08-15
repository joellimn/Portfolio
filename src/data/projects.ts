export type CaseStudyMetaItem = {
  label: string;
  lines: string[];
};

export type CaseStudyBlock =
  | {
      type: "text";
      label?: string;
      heading?: string;
      body?: string;
    }
  | {
      type: "callout";
      tone: "blue" | "pink" | "yellow";
      body: string;
    }
  | {
      type: "media";
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      /** Two images side-by-side — used when a research artifact should sit
       * next to the following solution frame. */
      type: "mediaPair";
      left: { src: string; alt: string };
      right: { src: string; alt: string };
    }
  | {
      type: "split";
      label?: string;
      heading: string;
      body: string;
      /** An optional highlighted follow-up sentence, rendered as a callout
       * chip beneath the body copy (e.g. "here's how I solved it"). */
      note?: { tone: "blue" | "pink" | "yellow"; body: string };
      media: { src: string; alt: string };
      /** Where the media sits relative to the text. "bottom" stacks the
       * media full-width below the text instead of side-by-side. */
      mediaPosition: "start" | "end" | "bottom";
      /** Side media only — "narrow" keeps the frame smaller beside copy. */
      mediaWidth?: "default" | "narrow";
    }
  | {
      type: "insightGrid";
      label: string;
      heading: string;
      subheading: string;
      body: string;
      items: { heading: string; quote: string }[];
      media?: { src: string; alt: string };
      /** "quote" wraps item bodies in quotation marks (default).
       * "finding" renders plain research insight copy. */
      itemStyle?: "quote" | "finding";
    }
  | {
      type: "calloutList";
      label: string;
      intro: string;
      tone: "blue" | "pink" | "yellow";
      items: string[];
    };

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  coverSrc: string;
  /**
   * Optional Cover Flow reveal shown while this cover is centered.
   * Videos (mp4) use the framed phone/window layout; stills (png/jpg)
   * full-bleed crossfade over the static cover.
   */
  coverVideoSrc?: string;
  /** Square "album art" style image shown beside the title on the case
   * study's Now Playing hero. */
  heroArt?: { src: string; alt: string };
  /**
   * Full-width case-study banner. When set, the case study uses a
   * traditional banner hero instead of the Cover Flow album art.
   */
  heroBanner?: { src: string; alt: string };
  meta?: CaseStudyMetaItem[];
  /** Rich, block-based case study content. Falls back to `sections` when
   * omitted so simpler projects can stay lightweight. */
  blocks?: CaseStudyBlock[];
  sections: { heading: string; body: string }[];
};

const wttinAsset = (file: string) => `/assets/case-studies/wttin/${file}`;
const wearittAsset = (file: string) => `/assets/case-studies/wearitt/${file}`;
const soarAsset = (file: string) => `/assets/case-studies/soar/${file}`;
const umgAsset = (file: string) => `/assets/case-studies/umg/${file}`;

/** Cover Flow left → right: SOAR, UMG, Wearitt, WTTIN */
export const projects: Project[] = [
{
    id: "soar",
    title: "160th SOAR",
    subtitle:
      "Dashboard Design & User Research: Streamlining Special Ops Candidate Evaluations",
    coverSrc: "/assets/covers/soar.png?v=2",
    coverVideoSrc: "/assets/covers/soar-cover.mp4",
    heroArt: {
      src: soarAsset("hero-art.jpg"),
      alt: "SOAR project cover mark",
    },
    heroBanner: {
      src: soarAsset("hero-banner.png"),
      alt: "160th SOAR assessment dashboard on desktop and mobile",
    },
    meta: [
      { label: "Role", lines: ["Product Designer"] },
      { label: "Timeline", lines: ["January 2026 –", "May 2026"] },
      { label: "Team", lines: ["3 Product Designers"] },
      {
        label: "Tools/Skills",
        lines: ["User Research,", "Figma Make, Figma,", "Miro"],
      },
    ],
    blocks: [
      {
        type: "text",
        label: "Context",
        body: "The 160th Special Operations Aviation Regiment (SOAR) is the U.S. Army\u2019s elite rotary-wing night-strike force (\u201cNight Stalkers\u201d). Operating within Vanderbilt University\u2019s Enterprise Design Thinking program, our team was tasked with diagnosing and optimizing their 90-day officer application assessment process. Evaluating candidates requires coordinating multiple reviewers across separate battalions, airframe specialties (MH-60 Blackhawk, MH-47 Chinook, AH-6 Little Bird), and administrative command tiers.",
      },
      {
        type: "callout",
        tone: "blue",
        body: "How might we replace a fragmented, manual SharePoint packet review process with a standardized, high-density operational dashboard that ensures application assessments are interpreted and scored consistently across reviewers?",
      },
      {
        type: "text",
        label: "Research & Discovery",
        heading: "Mapping the \u201cVoting Wheel\u201d & Systemic Bottlenecks",
        body: "Through 8 qualitative research and prototype testing sessions across 5 primary stakeholders\u2014including Sean (Assessment Office), Seth & Tony (Personnel Office), Mr. Shorey (Data Entry/Admin), and CPT Josh Clemmons (Training Battalion Commander)\u2014we mapped out the end-to-end packet lifecycle.",
      },
      {
        type: "media",
        src: soarAsset("research-map.jpg"),
        alt: "As-is scenario map of the SOAR packet review workflow",
      },
      {
        type: "insightGrid",
        label: "Findings",
        heading: "Key research findings & pain points",
        subheading: "What broke the existing process",
        body: "Three systemic issues kept resurfacing across stakeholder sessions.",
        itemStyle: "finding",
        items: [
          {
            heading: "The \u201cVoting Wheel\u201d & Manual Upload Bottlenecks",
            quote:
              "Packets moved sequentially through manual data entry and SharePoint uploads. Constant back-and-forth loops between reviewers created severe administrative fatigue.",
          },
          {
            heading: "Subjective Judgments & Comment Drift",
            quote:
              "Lacking a rubric, reviewers evaluated 44-page PDFs using personal \u201cgut feel.\u201d Readers relied heavily on previous comments rather than full packets, allowing early bias to skew decisions.",
          },
          {
            heading: "External Systemic Constraints",
            quote:
              "Candidate throughput was ultimately capped by fixed annual training seats (66\u201384 slots) rather than review speed alone. A required 9-month buffer between review and duty demanded a balance of speed and operational flexibility.",
          },
        ],
      },
      {
        type: "split",
        label: "Ideation & Convergence",
        heading: "Importance vs. Feasibility prioritization",
        body: "To translate research insights into actionable concepts, we ran a structured ideation sprint and plotted solutions onto an Importance vs. Feasibility matrix\u2014objectively scoring ideas for standardizing evaluations and eliminating bottlenecked handoffs.",
        note: {
          tone: "blue",
          body: "This matrix locked our two-part core strategy: a Standardized Rubric to solve scoring inconsistency, paired with a Centralized Dashboard to streamline administrative throughput.",
        },
        media: {
          src: soarAsset("prioritization-matrix.jpg"),
          alt: "Importance versus feasibility prioritization matrix",
        },
        mediaPosition: "end",
      },
      {
        type: "text",
        label: "Prototyping",
        heading: "The prototyping innovation: AI-first (\u201cVibe Coding\u201d)",
        body: "With our core strategy locked in, I pioneered a hybrid workflow to bridge the gap between our prioritization matrix and a tangible product: using AI to vibe-code an interactive prototype first, followed by deep product design and UX refinement.",
      },
      {
        type: "calloutList",
        label: "Why AI first?",
        intro:
          "Prototyping an operational app of this scale manually in Figma within a one-week sprint was impossible. Leveraging AI provided three critical advantages:",
        tone: "yellow",
        items: [
          "Overcoming sprint constraints — Generated a functional baseline in days, enabling rapid design iterations between stakeholder feedback sessions.",
          "Generating synthetic edge-case data — Bulk-created realistic candidate dossiers covering complex criteria, including legal/drug flags, flight hour thresholds (500 total / 50 PIC), and diverse evaluation histories.",
          "Live flow testing — Converted basic flowcharts into an interactive prototype via Figma Make, allowing stakeholders like Seth and Mr. Shorey to test real candidate queues instead of clicking static frames.",
        ],
      },
      {
        type: "text",
        label: "Usability Testing",
        heading: "Two rounds of iterative feedback",
        body: "To evaluate the AI-generated baseline, we ran a joint prototype walkthrough with Seth and Mr. Shorey focused on the web dashboard, clean UI, and digital rubric\u2014then followed with individual usability sessions where users shared their screens and navigated live.",
      },
      {
        type: "calloutList",
        label: "Key User Responses",
        intro: "What stakeholders pushed for next.",
        tone: "blue",
        items: [
          "Nuanced feedback — Users requested optional comments on specific sections, such as Officer Evaluation Reports (OERs), to provide context for assigned scores.",
          "Workflow optimization — Comments must remain optional so the process never becomes an administrative burden.",
          "High utility — Stakeholders said the prototype successfully acted on long-standing problems they had discussed internally for years.",
        ],
      },
      {
        type: "text",
        label: "Deep UX Design",
        heading: "Dashboard architecture",
        body: "Post-testing, I executed deep design iterations to rebuild the AI baseline into a high-density, production-ready enterprise dashboard.",
      },
      {
        type: "text",
        heading: "Figma Make vs. Redesign comparison",
      },
      {
        type: "mediaPair",
        left: {
          src: soarAsset("figma-make-dashboard.jpg"),
          alt: "AI-generated Figma Make dashboard baseline",
        },
        right: {
          src: soarAsset("redesign-inbox.jpg"),
          alt: "Redesigned assessment packet review inbox",
        },
      },
      {
        type: "split",
        heading: "Side Tab",
        body: "Replaced basic top-level flows with a persistent, collapsible sidebar that maximizes screen real estate for dense data tables and seamless tab switching\u2014while isolating finished candidate packages into a dedicated Completed view so evaluated packets never pile up in the active queue.",
        media: {
          src: soarAsset("sidebar-recording.mov"),
          alt: "Collapsible sidebar navigation on the assessment dashboard",
        },
        mediaPosition: "bottom",
      },
      {
        type: "text",
        heading: "Analytics View",
        body: "Added a dedicated analytics hub tracking macro-level operational metrics across the assessment pipeline.",
      },
      {
        type: "media",
        src: soarAsset("analytics-dashboard.jpg"),
        alt: "Detailed overview analytics dashboard with charts and status gauges",
      },
      {
        type: "calloutList",
        label: "Value & Impact",
        intro:
          "By shifting from a fragmented, manual SharePoint workflow to a centralized, AI-accelerated evaluation engine, the 160th SOAR assessment process was transformed across three key dimensions:",
        tone: "blue",
        items: [
          "Eliminated administrative overhead — Standardized data entry and consolidated candidate dossiers into a single interface, ending the manual back-and-forth email loops across the \u201cVoting Wheel.\u201d",
          "Objective, consistent evaluations — Replaced subjective \u201cgut feel\u201d reviews with benchmarked scoring across the four most critical evaluation areas (Physical Fitness, Legal/Moral, LORs, and OERs).",
          "Pipeline transparency & speed — Gave administrators real-time visibility into packet progress and turnaround metrics, preventing evaluated files from piling up in active queues.",
        ],
      },
      {
        type: "callout",
        tone: "pink",
        body: "\u201CThis is again, this is awesome. I wish it wasn\u2019t a prototype.\u201D \u2014 Seth, Personnel Office (S1)",
      },
      {
        type: "media",
        src: soarAsset("team-photo.jpg"),
        alt: "EDT Spring 26 team at Fort Campbell",
        caption: "EDT Spring 26 @ Fort Campbell",
      },
    ],
    sections: [
      {
        heading: "Overview",
        body: "A dashboard architecture project for the 160th SOAR officer assessment packet review process.",
      },
      {
        heading: "Approach",
        body: "Research-led mapping of the Voting Wheel, then an AI-first prototype refined into a high-density operational dashboard.",
      },
      {
        heading: "Outcome",
        body: "A centralized evaluation engine with consistent scoring, clearer pipeline visibility, and far less administrative overhead.",
      },
    ],
  },
{
    id: "umg",
    title: "Universal Music Group",
    subtitle:
      "AI Migration Workflow: Automating Low-Code Tool Conversion with Figma MCP",
    coverSrc: "/assets/covers/umg.png?v=2",
    heroArt: {
      src: umgAsset("hero-art.jpg"),
      alt: "Universal Music Group mark",
    },
    heroBanner: {
      src: umgAsset("hero-banner.png"),
      alt: "Universal Music Group mark on teal",
    },
    meta: [
      { label: "Role", lines: ["User Experience Intern"] },
      { label: "Timeline", lines: ["June 2026 –", "August 2026"] },
      { label: "Team", lines: ["UMG Collaboration", "Tech"] },
      {
        label: "Tools/Skills",
        lines: ["Figma, MCP,", "AI Agents,", "Low-Code Migration"],
      },
    ],
    blocks: [
      {
        type: "callout",
        tone: "pink",
        body: "A good chunk of my recent work is sitting safely behind NDAs! If you\u2019re curious to hear the story behind these protected projects, shoot me an email \u2014 I\u2019d love to chat.",
      },
      {
        type: "text",
        label: "Context & Challenge",
        body: "Universal Music Group relied on hundreds of fragmented, low-code internal apps that built up severe technical debt. I was tasked with systematically migrating these legacy tools to code-based applications while upgrading their user experience.",
      },
      {
        type: "calloutList",
        label: "What I Did",
        intro:
          "Three workstreams defined how legacy tools moved from low-code debt into production-ready code.",
        tone: "blue",
        items: [
          "AI Migration Workflows — Built automation pipelines using AI agents to parse low-code app logic and translate it into clean, code-based architectures.",
          "Figma MCP Integration — Connected AI agents directly to Figma using the Model Context Protocol (MCP), enabling design system context to feed straight into code generation.",
          "Intentional UX Refinements — Used the Figma MCP pipeline to fix legacy UI flaws, standardize tokens, and elevate interface quality before final compilation.",
        ],
      },
      {
        type: "calloutList",
        label: "Key Impact",
        intro: "What the AI-assisted migration unlocked across design and engineering.",
        tone: "yellow",
        items: [
          "Automated Migration — Drastically accelerated the refactoring of legacy tools into production-ready code.",
          "Bridge Design & Code — Established a repeatable, AI-driven pipeline that eliminated manual pixel-pushing.",
          "Elevated Enterprise UX — Modernized internal app usability across departments without adding design overhead.",
        ],
      },
    ],
    sections: [
      {
        heading: "Overview",
        body: "Migrated fragmented low-code internal apps at Universal Music Group into code-based tools with AI-assisted UX upgrades.",
      },
      {
        heading: "Focus",
        body: "AI migration workflows, Figma MCP integration, and intentional UX refinements on legacy enterprise interfaces.",
      },
      {
        heading: "Impact",
        body: "Faster refactoring, a repeatable design-to-code pipeline, and modernized usability across internal departments.",
      },
    ],
  },
{
    id: "wearitt",
    title: "Wearitt",
    subtitle:
      "Design System: Building Scalable Component Systems for Smart Wardrobes",
    coverSrc: "/assets/covers/wearitt.png?v=2",
    coverVideoSrc: "/assets/covers/wearitt-cover.png",
    heroArt: {
      src: wearittAsset("hero-art.jpg"),
      alt: "Wearitt logo mark",
    },
    heroBanner: {
      src: wearittAsset("hero-banner.png"),
      alt: "Wearitt design system — wardrobe app screens and component library on phone mockups",
    },
    meta: [
      { label: "Role", lines: ["UX Design Intern"] },
      { label: "Timeline", lines: ["December 2025 –", "May 2026"] },
      {
        label: "Team",
        lines: ["2 UX Design Interns", "3 UX Designers"],
      },
      { label: "Tools/Skills", lines: ["Figma, Design Systems"] },
    ],
    blocks: [
      {
        type: "text",
        label: "Context",
        body: "Wearitt is an AI-powered digital wardrobe mobile app established in 2023 to eliminate daily outfit decision fatigue through generative AI and closet cataloging. Joining the team of three product designers as a UX Design Intern, I was immediately integrated into a critical structural challenge: feature fragmentation.",
      },
      {
        type: "text",
        label: "Challenge",
        body: "While the baseline mission was clear, the application lacked a strategic hierarchy and was fractured across four competing product pillars: AI Virtual Try-On, Outfit Collage Maker, Digital Closet, and Outfit Inspiration Feed.",
      },
      {
        type: "callout",
        tone: "blue",
        body: "How might we balance these diverse, high-utility features and bring structural cohesion to the user interface to maximize Wearitt\u2019s core value proposition?",
      },
      {
        type: "insightGrid",
        label: "Research & Discovery",
        heading:
          "To understand why the application felt fragmented, I audited our design files",
        subheading: "Design File Audit",
        body: "I quickly discovered that the lack of strategic product focus was being compounded by severe visual and systemic design inconsistencies. Because multiple designers had been working on separate feature tracks in isolation, the interface was split by conflicting micro-interactions.",
        items: [
          {
            heading: "Inconsistent UI Patterns",
            quote:
              "Button weights, corner radiuses, and padding schemas varied wildly between the Digital Closet canvas and the AI Try-On interaction windows.",
          },
          {
            heading: "Component Fragmentation",
            quote:
              "Shared structural elements—like top navigation bars, asset cards, and action states—were being custom-built per screen rather than pulling from a single source of truth.",
          },
        ],
      },
      {
        type: "text",
        body: "This analysis shifted my direction: to fix the macro product cohesion, we first had to standardize the micro-interaction layers. I stepped forward to build and launch an ecosystem-wide Design System and Component Library.",
      },
      {
        type: "text",
        label: "The Solution",
        heading:
          "To resolve feature fragmentation, I applied Brad Frost\u2019s Atomic Design framework to build a centralized component library.",
      },
      {
        type: "text",
        heading: "1. Atoms — Foundations & Design Tokens",
        body: "The raw visual assets and sub-atomic style rules that form the baseline language of the app: an 8pt spacing metric, tokenized Primary / Secondary / Tertiary / Neutral palettes, and rigid typography line-heights with clean default, outlined, selected, and deselected button states.",
      },
      {
        type: "mediaPair",
        left: {
          src: wearittAsset("research-system.jpg"),
          alt: "Wearitt spacing system and layout documentation",
        },
        right: {
          src: wearittAsset("atoms-foundations.jpg"),
          alt: "Wearitt color tokens, buttons, and typography foundations",
        },
      },
      {
        type: "split",
        heading: "2. Molecules — Simple Component Groups",
        body: "Combinations of atoms functioning together as a simple, recognizable unit—view selection tabs pairing typography with container rules (e.g. My Closet vs Wishlist), and input fields that unify profile inputs and outfit-tagging modules.",
        media: {
          src: wearittAsset("molecules-components.jpg"),
          alt: "Wearitt tabs, buttons, and chip molecule components",
        },
        mediaPosition: "end",
        mediaWidth: "narrow",
      },
      {
        type: "split",
        heading: "3. Organisms — Complex Interface Components",
        body: "Complex UI sections composed of molecules and atoms stitched together to guide the user journey: global navigation bars that reconnect feature branches, plus canvas modals and cards that house user assets cleanly across the Inspiration Feed and Outfit Collage Maker.",
        media: {
          src: wearittAsset("organisms-interface.jpg"),
          alt: "Wearitt bottom navigation bar states and central action button",
        },
        mediaPosition: "end",
      },
      {
        type: "text",
        label: "Challenges",
      },
      {
        type: "callout",
        tone: "pink",
        body: "Navigating new terrain",
      },
      {
        type: "text",
        heading: "Navigating an Established Project",
        body: "Entering an established product running since 2023 required adapting to pre-existing design debt, which was a first for me.",
      },
      {
        type: "callout",
        tone: "blue",
        body: "Instead of rushing into new screen design features, I paused to read all historic product documentation and focus strictly on understanding the core mission. By auditing these legacy files, I discovered the root cause of the team\u2019s feature disconnect—identifying the clear need for a standardized design system.",
      },
      {
        type: "text",
        heading: "Global Remote Collaboration",
        body: "Collaborating with multiple designers stationed across different time zones made synchronized workflows difficult.",
      },
      {
        type: "callout",
        tone: "blue",
        body: "To address this, I leveraged project management and communication stacks like Trello and Slack to maintain asynchronous task tracking, crystal-clear documentation, and explicit daily milestone updates.",
      },
      {
        type: "calloutList",
        label: "Key Takeaways",
        intro:
          "This project marked my first experience interning as a UX designer. I learned so many things, but here are some of my key takeaways.",
        tone: "blue",
        items: [
          "A component library is far more than a formatting tool; it is a functional architectural blueprint that ensures multi-designer alignment and fluid engineering handoffs.",
          "Navigating an active product environment taught me how to respect and adapt to project footprints while safely executing modern UX improvements.",
          "Collaborating daily with design peers refined my cross-functional literacy, teaching me how to ground critiques in objective product logic rather than subjective styling debates.",
        ],
      },
    ],
    sections: [
      {
        heading: "Overview",
        body: "An AI wardrobe product concept exploring how recommendation and closet tools can feel cohesive instead of fragmented across competing features.",
      },
      {
        heading: "Insight",
        body: "Feature fragmentation was a systems problem—conflicting patterns and one-off components made the product feel like four apps instead of one.",
      },
      {
        heading: "Design",
        body: "An Atomic Design system—tokens, molecules, and organisms—restored a shared language across try-on, collage, closet, and inspiration surfaces.",
      },
    ],
  },
{
    id: "wttin",
    title: "Where to Turn in Nashville",
    subtitle:
      "End-to-End Design: Mobile Platform for Emergency Relief Services",
    coverSrc: "/assets/covers/wttin.png?v=2",
    coverVideoSrc: "/assets/covers/wttin-cover.mp4",
    heroArt: {
      src: wttinAsset("hero-art.jpg"),
      alt: "Where to Turn in Nashville logo mark",
    },
    heroBanner: {
      src: wttinAsset("hero-banner.png"),
      alt: "Where to Turn in Nashville app — map and AI chat on phone mockups",
    },
    meta: [
      { label: "Role", lines: ["Lead UX Designer"] },
      { label: "Timeline", lines: ["September 2025 –", "April 2026"] },
      {
        label: "Team",
        lines: [
          "1\u00A0Product Manager",
          "1\u00A0Engineering Manager",
          "1\u00A0Product Designer",
          "8\u00A0Developers",
        ],
      },
      { label: "Tools/Skills", lines: ["Figma, User Research,", "Prototyping"] },
    ],
    blocks: [
      {
        type: "text",
        label: "Context",
        body: "For over a decade, Where to Turn in Nashville has distributed over 100,000 physical \u201cpocket-sized phone books\u201d and managed a desktop resource directory to connect vulnerable residents with local aid. However, when community members, case workers, or university students are actively out on the streets, flipping through physical pages or navigating a heavy desktop webpage is slow and impractical.",
      },
      {
        type: "callout",
        tone: "blue",
        body: "How might we adapt a massive print and web database into a fast, lightweight mobile connect point for users requiring immediate access to emergency resources?",
      },
      {
        type: "insightGrid",
        label: "Research",
        heading:
          "First, I analyzed existing gaps to map out the necessary features for the mobile solution",
        subheading: "Speaking to Real Users",
        body: "I conducted discovery interviews with 4 vendors from The Contributor, who are part of the high-need population and represent WTTIN\u2019s primary user base.",
        items: [
          {
            heading: "Need for location mapping",
            quote: "There\u2019s no clear way to see what resources are near me.",
          },
          {
            heading: "Need for live status",
            quote: "I don\u2019t know which places are open or closed.",
          },
          {
            heading: "Need for easier search",
            quote: "The search bar on the website doesn\u2019t work sometimes.",
          },
        ],
        media: {
          src: wttinAsset("research-collage.jpg"),
          alt: "Photos from vendor discovery interviews",
        },
      },
      {
        type: "text",
        label: "Stakeholder Discovery",
        body: "I then conducted primary user research via deep interviews with three key organizational stakeholders to distill the exact taxonomy used in the 2025 handbook layout.",
      },
      {
        type: "split",
        heading: "Logic Mapping",
        body: "This allowed me to build a rigorous, logic-driven User Flow Chart to ensure that multi-tier navigation pathways systematically resolve into clear, actionable physical help locations.",
        media: { src: wttinAsset("flowchart.jpg"), alt: "User flow logic chart" },
        mediaPosition: "end",
      },
      {
        type: "text",
        label: "The Solution",
        body: "The final design condenses the traditional directory into a clean, scannable layout centered on three immediate digital touchpoints.",
      },
      {
        type: "split",
        heading: "Touchpoint 1 — Structured Home View",
        body: "Groups the booklet\u2019s dense data into high-visibility category grids, while integrating live operational status flags (Open/Closed) so users never waste a trip to a facility.",
        media: {
          src: wttinAsset("touchpoint-1-home.jpg"),
          alt: "Structured home view showing resource categories",
        },
        mediaPosition: "end",
      },
      {
        type: "split",
        heading: "Touchpoint 2 — Map View",
        body: "Layers the physical directory addresses onto a live interactive map. Users can immediately see hot meal drop-offs or open shelter beds relative to their real-time location.",
        media: {
          src: wttinAsset("touchpoint-2-map.jpg"),
          alt: "Interactive map view of nearby resources",
        },
        mediaPosition: "bottom",
      },
      {
        type: "split",
        heading: "Touchpoint 3 — Conversational AI Chatbot",
        body: "Provides a natural-language chat overlay for users intimidated by complex menu structures. Simple typed queries bypass deep navigation hierarchies and link directly to relevant sub-categories.",
        media: {
          src: wttinAsset("touchpoint-3-chatbot.jpg"),
          alt: "Conversational chatbot interface",
        },
        mediaPosition: "end",
      },
      {
        type: "text",
        label: "Challenges",
      },
      {
        type: "callout",
        tone: "pink",
        body: "It wasn\u2019t all smooth sailing.",
      },
      {
        type: "split",
        heading: "Constraint — Offline Devices",
        body: "During usability testing, I realized a critical constraint overlooked during initial user discovery: a significant portion of our target population lacks consistent internet access.",
        note: {
          tone: "blue",
          body: "To address this, I designed an Offline Mode that preserves access to core safety-net directory information, while implementing a clean redirect screen for dynamic features that explicitly require internet connectivity.",
        },
        media: { src: wttinAsset("offline-mode.jpg"), alt: "Offline mode screen design" },
        mediaPosition: "end",
      },
      {
        type: "calloutList",
        label: "Next Steps",
        intro: "Here is what I should polish next.",
        tone: "yellow",
        items: [
          "Collaborate closer with the data management teams at Open Table Nashville and The Contributor to establish how community shelters can easily self-report live, real-time bed capacities directly to our Open/Closed status banners.",
          "Run structured usability testing sessions with our core 4 vendors directly on the street to verify how cleanly the app switches into Offline Mode under actual spotty network conditions.",
        ],
      },
      {
        type: "calloutList",
        label: "Key Takeaways",
        intro:
          "This project marked my first experience leading end-to-end UX design within a cross-functional squad. I learned so many things, but here are some of my key takeaways.",
        tone: "blue",
        items: [
          "Design for the extreme edge case. Designing for an unhoused vendor experiencing data scarcity or low-tier device constraints forced me to prioritize hyper-lightweight, high-contrast layouts over heavy cosmetic visual trends.",
          "Maintain cross-functional alignment. Building structured, component-ready design tokens in Figma kept our cross-functional squad of 8 developers fully aligned, minimizing engineering overhead on complex data screens.",
        ],
      },
      {
        type: "media",
        src: wttinAsset("team-photo.jpg"),
        alt: "Where to Turn in Nashville team photo",
        caption: "Where to Turn in Nashville Team 25-26",
      },
    ],
    sections: [
      {
        heading: "Overview",
        body: "A resource directory experience helping people in Middle Tennessee find where to turn—clear pathways through local services and community support.",
      },
      {
        heading: "Experience",
        body: "Users move through categories the way they’d skip tracks: intentional, rhythmic, and always aware of where they are in the set.",
      },
      {
        heading: "Outcome",
        body: "A calmer, more scannable directory that prioritizes action over overwhelm.",
      },
    ],
  }
];

export const menuItems = ["Projects", "About", "Contact"] as const;
export type MenuItem = (typeof menuItems)[number];
