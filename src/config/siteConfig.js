/**
 * Robotics Landing Page Configuration
 * 
 * Customize all navigation links, header info, and main grid cards here.
 * Supported action types:
 * - "modal": opens rich built-in interactive detail dialog
 * - "link": navigates to an external or internal URL (href)
 */

export const siteConfig = {
  // Brand details & Header logos
  branding: {
    siteTitle: "Robotics",
    welcomeHeading: "Welcome to Robotics!",
    tagline: "VEX Robotics Programme",
    sponsorLogo: {
      src: "/logos/sponsor.png",
      alt: "Sponsor",
      href: "https://example.org",
      showWhiteBackground: true
    },
    schoolLogo: {
      src: "/logos/logo.png",
      alt: "Logo",
      href: "https://example.org"
    }
  },

  // Customizable Top-Right Navigation Bar Links
  navLinks: [
    {
      id: "about",
      label: "About Robotics",
      actionType: "link", // "modal" or "link"
      href: "https://example.org/l/about-robotics",
      modalData: {
        badge: "Excellence in STEM",
        title: "About Robotics",
        description: "Robotics Club is one of the UK's premier competitive school robotics programmes, competing across both VEX IQ (VIQRC) and VEX V5 (V5RC) divisions at national and world championship levels.",
        stats: [
          { label: "Founded", val: "2015+" },
          { label: "Active Teams", val: "10+" },
          { label: "World Appearances", val: "8x" },
          { label: "National Titles", val: "Multiple" }
        ],
        points: [
          "Student-led engineering, autonomous programming, and CAD design",
          "Extensive track record at the VEX Robotics World Championship in Dallas, USA",
          "Hosts of the prestigious annual 'team example-tournament' regional and national qualifiers"
        ]
      }
    },
    {
      id: "sponsors",
      label: "Our sponsors",
      actionType: "link",
      href: "https://example.org/l/our-sponsors",
      modalData: {
        badge: "Powering Innovation",
        title: "Our Sponsors & Partners",
        description: "We are proudly supported by world-class industry leaders and academic partners who empower our students with cutting-edge hardware, resources, and mentorship.",
        partners: [
          {
            name: "Sponsor",
            role: "Headline Tech Partner",
            desc: "Global leader in memory and storage solutions supporting hardware innovation at Robotics.",
            logo: "/logos/sponsor.png"
          },
          {
            name: "the school",
            role: "Academic & Institutional Foundation",
            desc: "Founded in 1573, providing world-class STEM education and facilities.",
            logo: "/logos/logo.png"
          }
        ]
      }
    },
    {
      id: "viqrcCurrentSeason",
      label: "VIQRC Current Season",
      actionType: "link",
      href: "https://example.org/viqrc/curr",
      modalData: {
        badge: "VIQRC • 2025 - 2026",
        title: "VIQRC Current Season Performance",
        description: "Live match statistics, driver skills, autonomous skills scores, and division standings for our VEX IQ teams.",
        highlights: [
          { event: "UK National Qualifiers", result: "Tournament Champions & Excellence Award", date: "Recent" },
          { event: "Regional Skills Challenge", result: "Ranked #1 in Skills", date: "Recent" }
        ]
      }
    },
    {
      id: "viqrcPreviousPerformance",
      label: "VIQRC Previous Performance",
      actionType: "link",
      href: "https://example.org/viqrc/all",
      modalData: {
        badge: "VIQRC • Hall of Fame",
        title: "VIQRC Previous Performance",
        description: "Historical awards, UK National Championships, and VEX Worlds results for team VIQRC teams."
      }
    },
    {
      id: "v5rcCurrentSeason",
      label: "V5RC Current Season",
      actionType: "link",
      href: "https://example.org/v5rc/curr",
      modalData: {
        badge: "V5RC • 2025 - 2026",
        title: "V5RC Current Season Performance",
        description: "Live standings, qualification results, and match analytics for team VEX V5 teams.",
        highlights: [
          { event: "UK National Qualifiers", result: "Tournament Champions", date: "Recent" },
          { event: "team example-tournament", result: "Host & Division Champions", date: "Recent" }
        ]
      }
    },
    {
      id: "v5rcPreviousPerformance",
      label: "V5RC Previous Performance",
      actionType: "link",
      href: "https://example.org/v5rc/all",
      modalData: {
        badge: "V5RC • Hall of Fame",
        title: "V5RC Previous Performance",
        description: "Historical awards, UK National titles, Innovate Awards, and VEX World Championship appearances for team V5RC teams."
      }
    }
  ],

  // Customizable Bento Grid Cards
  gridSection: {
    leftCards: [
      {
        id: "viqrc",
        title: "VIQRC Teams",
        subtitle: "Key Stage 3 & Junior Division",
        image: "/images/viqrc-teams.jpeg",
        overlayGradient: "from-sky-950/70 via-blue-900/50 to-slate-950/70",
        tintColor: "bg-cyan-900/25",
        borderColor: "border-cyan-500/20 hover:border-cyan-400/60",
        actionType: "link", // "modal" or "link"
        href: "https://example.org/viqrc",
        modalData: {
          badge: "Key Stage 3 & Junior Division",
          title: "VIQRC Teams (VEX IQ Robotics Competition)",
          description: "Our VIQRC teams consist of enthusiastic younger engineers developing core skills in mechanical design, snap-together modular building, sensor integration, and block/Python programming.",
          features: [
            "Collaborative teamwork and driver skills development",
            "Custom autonomous programming routines using vision & gyro sensors",
            "Comprehensive engineering notebooks detailing iterative design cycles"
          ]
        }
      },
      {
        id: "v5rc",
        title: "V5RC Teams",
        subtitle: "Senior Division",
        image: "/images/v5rc-teams.jpeg",
        overlayGradient: "from-rose-950/75 via-red-900/55 to-slate-950/75",
        tintColor: "bg-red-900/20",
        borderColor: "border-red-500/20 hover:border-red-400/60",
        actionType: "link", // "modal" or "link"
        href: "https://example.org/v5rc",
        modalData: {
          badge: "Senior Division",
          title: "V5RC Teams (VEX V5 Robotics Competition)",
          description: "Our V5RC teams design and manufacture high-performance metal robots using custom CNC aluminium components, pneumatics, PID control loops, and advanced C++ / PROS autonomous routines.",
          features: [
            "Custom high-torque and high-speed drivetrains with odometry tracking",
            "Pneumatically actuated scoring mechanisms & high-speed flywheels",
            "State-of-the-art C++ autonomous algorithms and pure pursuit paths"
          ]
        }
      }
    ],
    rightCard: {
      id: "town",
      title: "team example-tournament",
      subtitle: "Annual National & Regional VEX Robotics Tournament Hosted by the school",
      image: "/images/example-tournament.jpeg",
      overlayGradient: "from-slate-950/85 via-slate-900/40 to-slate-950/70",
      tintColor: "bg-amber-950/20",
      borderColor: "border-amber-500/20 hover:border-amber-400/60",
      actionType: "link", // "modal" or "link"
      href: "https://example.org/l/team-example-tournament",
      modalData: {
        badge: "Premier Tournament",
        title: "team example-tournament",
        description: "The 'team example-tournament' is the school's flagship annual robotics tournament, bringing together top teams from across the United Kingdom for intense match play and qualifying spots.",
        features: [
          "Full multi-field competition setup with live match broadcasts and live VEX via scoring",
          "Judged awards evaluated by industry engineers and alumni judges",
          "Qualifying event for the UK National Championship"
        ]
      }
    }
  },

  // Footer Config
  footer: {
    copyrightText: `© ${new Date().getFullYear()} Robotics`,
    secondaryText: "VEX Robotics Competition • Supported by Sponsor"
  }
};
