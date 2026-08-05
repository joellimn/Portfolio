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
    }
  | {
      type: "insightGrid";
      label: string;
      heading: string;
      subheading: string;
      body: string;
      items: { heading: string; quote: string }[];
      media: { src: string; alt: string };
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
  /** Square "album art" style image shown beside the title on the case
   * study's Now Playing hero. */
  heroArt?: { src: string; alt: string };
  meta?: CaseStudyMetaItem[];
  /** Rich, block-based case study content. Falls back to `sections` when
   * omitted so simpler projects can stay lightweight. */
  blocks?: CaseStudyBlock[];
  sections: { heading: string; body: string }[];
};

const wttinAsset = (file: string) => `/assets/case-studies/wttin/${file}`;

/** Order matches Figma "Case study Covers" */
export const projects: Project[] = [
  {
    id: "wttin",
    title: "Where to Turn in Nashville",
    subtitle:
      "Designed a mobile app for Middle Tennessee’s biggest resource directory.",
    coverSrc: "/assets/covers/wttin.png",
    heroArt: {
      src: wttinAsset("hero-art.jpg"),
      alt: "Where to Turn in Nashville logo mark",
    },
    meta: [
      { label: "Role", lines: ["Lead UX Designer"] },
      { label: "Timeline", lines: ["September 2025 –", "April 2026"] },
      {
        label: "Team",
        lines: [
          "1 Product Manager",
          "1 Engineering Manager",
          "1 Product Designer",
          "8 Developers",
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
  },
  {
    id: "wearitt",
    title: "Wearitt",
    subtitle: "Listening product concept",
    coverSrc: "/assets/covers/wearitt.png",
    sections: [
      {
        heading: "Overview",
        body: "A concept exploring how recommendation surfaces can feel more tactile—closer to flipping through a physical collection than scrolling a feed.",
      },
      {
        heading: "Insight",
        body: "People remember albums as objects. Cover art, sequence, and pacing still shape how we attach meaning to music.",
      },
      {
        heading: "Design",
        body: "Cover-led navigation, short dwell states, and playful motion that rewards curiosity without demanding endless scroll.",
      },
    ],
  },
  {
    id: "soar",
    title: "SOAR",
    subtitle: "U.S. Army recruitment experience",
    coverSrc: "/assets/covers/soar.png",
    sections: [
      {
        heading: "Overview",
        body: "A digital experience exploring how young adults discover service pathways. The work focused on clarity, trust, and reducing friction in early exploration.",
      },
      {
        heading: "Problem",
        body: "Prospects were bouncing between fragmented touchpoints. Information felt dense, institutional, and hard to act on—especially on mobile.",
      },
      {
        heading: "Approach",
        body: "We reframed the journey around progressive disclosure: start with identity and motivation, then surface tailored pathways with clear next steps.",
      },
      {
        heading: "Outcome",
        body: "A calmer, more scannable product story that keeps the user oriented while still feeling bold and mission-driven.",
      },
    ],
  },
  {
    id: "umg",
    title: "Universal Music Group",
    subtitle: "Product design · Prev @UMG",
    coverSrc: "/assets/covers/umg.png",
    sections: [
      {
        heading: "Overview",
        body: "Product design work spanning artist tools, fan-facing surfaces, and internal workflows across the music catalog ecosystem.",
      },
      {
        heading: "Focus",
        body: "Translate complex rights, release, and audience data into interfaces that feel as polished as the music itself.",
      },
      {
        heading: "Craft",
        body: "Systems thinking, interaction polish, and visual restraint—so creators and operators can move faster without losing clarity.",
      },
      {
        heading: "Impact",
        body: "Shipped experiences that balance brand presence with operational depth for one of the world’s largest music companies.",
      },
    ],
  },
];

export const menuItems = ["Projects", "About", "Contact"] as const;
export type MenuItem = (typeof menuItems)[number];
