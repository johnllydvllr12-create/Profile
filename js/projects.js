/*
 * Portfolio Projects Data - John Lloyd F. Villar
 * Computer Engineering Undergraduate, ICCT Colleges
 */
window.PORTFOLIO_PROJECTS = [
  {
    id: "syncedn",
    code: "PRJ-01",
    title: "Project SyncedN",
    subtitle: "Role-Based Android Operations Application",
    tag: "Mobile & Systems Development",
    description: "An Android application designed to handle operational workflows across administrative and member tiers. Includes local session persistence, identity checks, structured data collections, and synchronized operational state.",
    technologies: ["Kotlin", "Android SDK", "Local Database", "Role Management", "Material Design"],
    role: "Lead Developer (Mobile & Data Architecture)",
    status: "Active Development",
    repositoryUrl: "https://github.com/johnllydvllr12-create",
    demoUrl: "",
    details: [
      "Engineered multi-role authentication workflows separating administrator management from standard member operations.",
      "Structured local database schema for rapid session caching, state verification, and offline resilience.",
      "Implemented strict credential input validation and standardized error logging routines."
    ],
    architecture: "MVVM Architecture &bull; Android Jetpack &bull; Local SQLite Persistence &bull; Background State Sync"
  },
  {
    id: "building-network",
    code: "PRJ-02",
    title: "Three-Tier Facility Data Communications Design",
    subtitle: "Commercial Network & Structured Cabling Blueprint",
    tag: "Telecommunications & Networking",
    description: "Designed a comprehensive building network infrastructure plan for a three-story commercial facility housing 20+ distributed workstation units (COEPRO14 Group 9N). Defined main distribution frames (MDF), intermediate distribution frames (IDF), Cat6 cabling channels, VLAN segmentation, and redundant default gateways.",
    technologies: ["Network Architecture", "Structured Cabling", "Cisco Packet Tracer", "AutoCAD", "Subnetting"],
    role: "Network Architect & Team Contributor",
    status: "Completed (May 2026)",
    repositoryUrl: "",
    demoUrl: "",
    details: [
      "Drafted comprehensive horizontal and vertical Cat6 cabling pathways adhering to telecommunication drafting standards in AutoCAD.",
      "Simulated end-to-end packet routing, DHCP pool allocations, and VLAN broadcast boundaries inside Cisco Packet Tracer.",
      "Calculated maximum cable attenuation, patch panel terminations, and equipment rack layouts across all 3 building floors."
    ],
    architecture: "Three-Tier Hierarchical Model (Core, Distribution, Access) &bull; 802.1Q VLANs &bull; Cat6 UTP Topology"
  },
  {
    id: "syncshot",
    code: "PRJ-03",
    title: "SyncShot: Wireless Camera Actuation System",
    subtitle: "ESP32 Embedded Shutter Controller",
    tag: "Hardware & Embedded Systems",
    description: "A hardware-software prototype built with ESP32 microcontrollers to coordinate synchronized, low-latency shutter triggering across multiple camera perspectives. Utilizes custom Wi-Fi telemetry and hardware GPIO switching for simultaneous multi-angle captures.",
    technologies: ["ESP32", "Embedded C++", "Wi-Fi Telemetry", "Hardware Prototyping", "GPIO Circuitry"],
    role: "Hardware & Firmware Integration",
    status: "Functional Prototype",
    repositoryUrl: "",
    demoUrl: "",
    details: [
      "Programmed C++ firmware with non-blocking hardware timers to achieve sub-millisecond shutter sync accuracy.",
      "Built custom transistor optocoupler switching circuit connected to ESP32 GPIOs to safely isolate camera trigger ports.",
      "Implemented lightweight Wi-Fi broadcast protocol for master-slave node heartbeat and trigger packet distribution."
    ],
    architecture: "ESP32 Dual-Core SOC &bull; FreeRTOS Tasks &bull; Optoisolated GPIO Switching &bull; UDP Broadcast Telemetry"
  },
  {
    id: "lloydcodex",
    code: "PRJ-04",
    title: "Lloydcodex Responsive Web System",
    subtitle: "Custom Lightweight Web Interface",
    tag: "Web Interface & Layout",
    description: "A clean, responsive web layout constructed from scratch to explore modern CSS techniques, flexible grid systems, accessible typography, and cross-device responsiveness without relying on heavy frontend libraries.",
    technologies: ["HTML5", "CSS3", "Responsive Grid", "CSS Custom Properties", "GitHub Pages"],
    role: "Frontend Designer & Developer",
    status: "Published",
    repositoryUrl: "https://github.com/johnllydvllr12-create/Lloydcodex",
    demoUrl: "https://johnllydvllr12-create.github.io/Lloydcodex/",
    details: [
      "Constructed entirely with semantic HTML5 elements and modular CSS variables for lightweight delivery.",
      "Achieved responsive reflow across mobile, tablet, and desktop viewports with zero layout shift.",
      "Published and hosted on GitHub Pages with automated continuous deployment."
    ],
    architecture: "Zero-Dependency Vanilla Architecture &bull; CSS Custom Properties System &bull; WCAG Accessible DOM"
  }
];
