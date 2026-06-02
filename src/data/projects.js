// All data verified against source on disk (both Mac logins) + the user's
// Claude-history inventory. Stacks are real, not generic.

export const featured = [
  {
    id: 'pos',
    name: 'CStoreIQ POS System',
    tagline: 'Enterprise convenience-store point of sale',
    blurb:
      'Production Android POS — sales, payments, fuel, lottery, age-restriction, loyalty and offline sync on FastAPI microservices. Built by a 6-developer team; I’m the single largest contributor at ~36% of the Kotlin codebase, working AI-first (Claude-coauthored on ~80% of my commits).',
    stack: ['Kotlin', 'Jetpack Compose', 'FastAPI', 'SQL Server', 'Realm', 'RabbitMQ', 'Firebase', 'AWS'],
    status: 'In production',
    badge: 'Top contributor · AI-first',
    cover: { type: 'image', src: '/images/pos_app.png' },
    links: [],
  },
  {
    id: 'rewards',
    name: 'Rewards & Gamification Platform',
    tagline: 'A loyalty platform built on real games',
    blurb:
      'Full loyalty platform for convenience stores: spin-wheel, scratch-card, slot-machine and punch-card games, tiered points (Bronze → Platinum), and real-time POS point accrual at checkout. Flutter app + Angular admin + FastAPI services.',
    stack: ['Flutter', 'FastAPI', 'SQL Server', 'Angular', 'Firebase'],
    status: 'Active dev · 172 commits',
    badge: 'Full platform',
    cover: { type: 'image', src: '/images/rewards.png' },
    links: [],
  },
  {
    id: 'invoicepay',
    name: 'InvoicePay MVP',
    tagline: 'Paper invoice → electronic payment',
    blurb:
      'Snap or attach a paper invoice → AI-OCR parses it → generates an EDI 810 → triggers a check payment. Modular so the OCR, EDI and payment rails swap out cleanly. Built and tested end-to-end.',
    stack: ['Flutter', 'FastAPI', 'Mistral AI OCR', 'Tesseract', 'EDI 810'],
    status: 'Working MVP · 120 commits (97 AI)',
    badge: 'Demo-ready',
    cover: { type: 'svg', variant: 'invoice' },
    links: [],
  },
  {
    id: 'heal',
    name: 'HEAL.AI Clinical Scribe',
    tagline: 'Ambient AI medical scribe for Indian clinics',
    blurb:
      'Listens to the doctor–patient conversation, transcribes code-mixed speech (Hindi / Telugu / Tamil + English) and drafts FHIR-compliant clinical notes for the doctor to review and approve.',
    stack: ['Next.js', 'FastAPI', 'Sarvam AI', 'GPT-4o', 'WebSockets', 'FHIR R4'],
    status: 'Prototype + business plan',
    badge: 'Healthcare AI',
    cover: { type: 'image', src: '/images/heal_icon.png', contain: true },
    links: [{ label: 'GitHub', href: 'https://github.com/aadityasp/ai-medical-scribe' }],
  },
]

export const apps = [
  {
    id: 'trading',
    name: 'Multi-Strategy Trading Engine',
    blurb:
      'Automated crypto & prediction-market system: Freqtrade backtesting with Monte Carlo stress tests, Kalshi arbitrage scanners and Kelly-criterion sizing. Runs in paper-trade mode with Telegram alerts.',
    stack: ['Python', 'Freqtrade', 'vectorbt', 'CCXT', 'Kalshi API'],
    status: 'Paper-trading',
    cover: { type: 'svg', variant: 'trading' },
    links: [],
  },
  {
    id: 'satcom',
    name: 'Satcom Workforce Tracker',
    blurb:
      'Workforce-visibility platform: GPS-geofenced attendance, per-project timesheets, leave workflows and real-time chat across role-based dashboards (Employee / Manager / HR / Admin).',
    stack: ['Next.js', 'Expo', 'PostgreSQL', 'Socket.IO', 'Leaflet'],
    status: 'Web + mobile',
    cover: { type: 'image', src: '/images/satcom_app.png' },
    links: [],
  },
  {
    id: 'label',
    name: 'Rack Label Printer',
    blurb:
      'Flutter app that prints product rack labels with barcodes to Brother QL-810W printers over WiFi or Bluetooth, pulling live product data from the back office via a JWT-secured Fastify API.',
    stack: ['Flutter', 'Fastify', 'TypeScript', 'MySQL', 'Brother SDK'],
    status: 'Android build ready',
    cover: { type: 'image', src: '/images/labelprinter_icon.png', contain: true },
    links: [],
  },
  {
    id: 'wedding',
    name: 'Wedding Invitation Site',
    blurb:
      'Multi-event Telugu wedding site: 3D / parallax hero, per-ceremony pages, a guest RSVP backed by Google Sheets, and automated reminder emails via Vercel cron.',
    stack: ['Next.js', 'React Three Fiber', 'Framer Motion', 'Nodemailer', 'Vercel'],
    status: 'Live',
    cover: { type: 'image', src: '/images/wedding.jpg' },
    links: [{ label: 'View site', href: 'https://wedding-five-self-14.vercel.app' }],
  },
  {
    id: 'roasttoast',
    name: 'RoastToast iOS',
    blurb:
      'Entertainment iOS app using Google Gemini multimodal AI — snap a photo or chat, get a contextual roast with adjustable intensity. Built in a day.',
    stack: ['SwiftUI', 'Gemini API', 'Multimodal'],
    status: 'TestFlight beta',
    cover: { type: 'image', src: '/images/roasttoast_logo.png', contain: true },
    links: [{ label: 'TestFlight', href: 'https://testflight.apple.com/join/AcacQbAe' }],
  },
  {
    id: 'promo',
    name: 'Promo Companion App',
    blurb:
      'Flutter loyalty & promotions app with Firebase push, a Google Maps store locator, barcode coupons and biometric login, paired with a Python AWS CDK backend.',
    stack: ['Flutter', 'Python', 'AWS CDK', 'Firebase', 'Google Maps'],
    status: 'Active dev',
    cover: { type: 'image', src: '/images/promo_icon.png', contain: true },
    links: [],
  },
  {
    id: 'storybook',
    name: 'AI Storybook',
    blurb:
      'Turns text prompts and photos into illustrated children’s books with themes, age levels and PDF export. Python backend + native iOS app + a React/shadcn prototype.',
    stack: ['Python', 'FastAPI', 'Swift / iOS', 'React', 'Vite'],
    status: 'Prototype',
    cover: { type: 'svg', variant: 'storybook' },
    links: [],
  },
  {
    id: 'cstoreiq-site',
    name: 'CStoreIQ Website',
    blurb:
      'Marketing site for a full suite of retail-tech products — hero, animated POS-terminal scenes, and a fresh color system. Built fast with AI tooling.',
    stack: ['React', 'TypeScript', 'CSS'],
    status: 'Shipped',
    cover: { type: 'image', src: '/images/csiq_website.png' },
    links: [{ label: 'View site', href: 'https://website-ten-ivory-86.vercel.app/' }],
  },
  {
    id: 'mission-control',
    name: 'Mission Control',
    blurb:
      'Personal work-intelligence dashboard: scrapes my inbox, clusters threads into topics, and builds an Obsidian knowledge graph plus an HTML dashboard.',
    stack: ['Python', 'HTML / JS', 'LLM clustering'],
    status: 'Prototype',
    cover: { type: 'svg', variant: 'graph' },
    links: [],
  },
  {
    id: 'multilingual',
    name: 'Multilingual Store Command UI',
    blurb:
      'Conversational interface that turns natural-language commands — in any language — into convenience-store operations.',
    stack: ['LLM', 'NLP', 'Retail tech'],
    status: 'Prototype',
    cover: { type: 'image', src: '/images/portfolioImage1.jpg' },
    links: [{ label: 'Prototype', href: 'https://designs.magicpath.ai/v1/sweet-shadow-2730' }],
  },
]

export const research = [
  {
    id: 'sensorium',
    name: 'Sensorium — MIT Reality Hack',
    blurb:
      'AR multiplayer game driven by the Arctop brain–computer interface on a Magic Leap headset. Semi-finalist at MIT Reality Hack 2022.',
    stack: ['Unity', 'AR', 'Magic Leap', 'BCI'],
    cover: { type: 'image', src: '/images/xr_MIT.jpeg' },
    links: [{ label: 'Devpost', href: 'https://devpost.com/software/sensorium?ref_content=user-portfolio&ref_feature=in_progress' }],
  },
  {
    id: 'colorization',
    name: 'Image Colorization (CNNs)',
    blurb:
      'Convolutional autoencoder that colorizes grayscale images, with a ~20% accuracy improvement over the baseline.',
    stack: ['Python', 'TensorFlow', 'CNNs'],
    cover: { type: 'image', src: '/images/imagecolorization.png' },
    links: [{ label: 'GitHub', href: 'https://github.com/aadityasp/Image_colorization' }],
  },
  {
    id: 'virtual-mouse',
    name: 'Virtual Mouse (MediaPipe)',
    blurb:
      'Hand-tracking virtual mouse using computer vision and deep-learning frameworks for touchless control.',
    stack: ['Python', 'MediaPipe', 'OpenCV'],
    cover: { type: 'video', src: '/images/19 - virtual_hand.mp4' },
    links: [{ label: 'GitHub', href: 'https://github.com/aadityasp/Virtual_Mouse' }],
  },
]

export const enterprise = [
  {
    name: 'Loyalty Server — Python → Go migration',
    desc: 'TCP socket server for POS loyalty (Commander & Passport protocols). Led an AI-driven rewrite with parity verification and security hardening across 74 commits.',
    stack: 'Go · Python · XML protocols',
  },
  {
    name: 'Fiscal Back-Office',
    desc: 'Multi-service retail back-office. Shipped Entity-Framework query-batching performance work across the .NET services.',
    stack: 'Angular · C#/.NET · Python · SQL Server',
  },
  {
    name: '.NET Microservices (20+)',
    desc: 'Auth, Invoice, Lottery, Fuel, Item, Report, Scan and Sync services powering the retail platform.',
    stack: 'C# · .NET 6 · Docker',
  },
  {
    name: 'CStoreIQ Mobile',
    desc: 'Cross-platform mobile POS for retail staff with offline data, Bluetooth peripherals and barcode capture.',
    stack: 'React Native · Firebase · Realm · BLE',
  },
  {
    name: 'Back-Office Web App',
    desc: 'Angular back-office for retail management and reporting with rich data grids and dashboards.',
    stack: 'Angular · TypeScript · RxJS',
  },
]

export const stats = [
  { value: '17+', label: 'Products shipped' },
  { value: '2–3 days', label: 'Typical build time' },
  { value: '6+', label: 'Domains: retail, health, fintech, AI' },
  { value: 'AI-first', label: 'How I build, end to end' },
]
