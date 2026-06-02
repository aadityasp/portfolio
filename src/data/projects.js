// All data verified against source on disk (both Mac logins) + the user's
// Claude-history inventory. Stacks are real. Copy avoids em/en dashes.
//
// cover.type: 'svg' | 'icon' | 'shot' | 'photo' | 'video'
//   icon  -> centered squircle on a soft backdrop (no stretch)
//   shot  -> framed screenshot (frame: 'web' | 'phone'), shown whole, not zoomed
//   photo -> object-cover photograph
//   svg   -> full-bleed generated art (variant)

export const featured = [
  {
    id: 'pos',
    name: 'CStoreIQ POS System',
    tagline: 'Enterprise convenience-store point of sale',
    blurb:
      'Production Android POS for sales, payments, fuel, lottery, age checks, loyalty and offline sync, on FastAPI microservices. Built by a 6-developer team; I am the single largest contributor at ~36% of the Kotlin codebase, working AI-first (Claude-coauthored on ~80% of my commits).',
    stack: ['Kotlin', 'Jetpack Compose', 'FastAPI', 'SQL Server', 'Realm', 'RabbitMQ', 'AWS'],
    status: 'In production',
    badge: 'Top contributor, AI-first',
    cover: { type: 'shot', src: '/images/pos_app.png', frame: 'web' },
    links: [],
  },
  {
    id: 'rewards',
    name: 'Rewards & Gamification',
    tagline: 'A loyalty platform built on real games',
    blurb:
      'Loyalty platform for convenience stores with spin-wheel, scratch-card, slot-machine and punch-card games, tiered points from Bronze to Platinum, and real-time POS point accrual at checkout. Flutter app, Angular admin, FastAPI services.',
    stack: ['Flutter', 'FastAPI', 'SQL Server', 'Angular', 'Firebase'],
    status: 'Active dev',
    badge: 'Full platform',
    cover: { type: 'shot', src: '/images/rewards.png', frame: 'phone' },
    links: [],
  },
  {
    id: 'invoicepay',
    name: 'InvoicePay',
    tagline: 'Paper invoice to electronic payment',
    blurb:
      'Snap or attach a paper invoice, AI-OCR parses it, it generates an EDI 810 and triggers a check payment. Modular so the OCR, EDI and payment rails swap out cleanly. Built and tested end to end.',
    stack: ['Flutter', 'FastAPI', 'Mistral AI OCR', 'Tesseract', 'EDI 810'],
    status: 'Working MVP',
    badge: 'Demo-ready',
    cover: { type: 'svg', variant: 'invoice' },
    links: [],
  },
  {
    id: 'heal',
    name: 'HEAL.AI Clinical Scribe',
    tagline: 'Ambient AI medical scribe for Indian clinics',
    blurb:
      'Listens to the doctor and patient, transcribes code-mixed speech (Hindi, Telugu, Tamil and English) and drafts FHIR-compliant clinical notes for the doctor to review and approve.',
    stack: ['Next.js', 'FastAPI', 'Sarvam AI', 'GPT-4o', 'WebSockets', 'FHIR R4'],
    status: 'Prototype + plan',
    badge: 'Healthcare AI',
    cover: { type: 'icon', src: '/images/heal_icon.png' },
    links: [{ label: 'GitHub', href: 'https://github.com/aadityasp/ai-medical-scribe' }],
  },
]

export const apps = [
  {
    id: 'trading',
    name: 'Multi-Strategy Trading Engine',
    blurb:
      'Automated crypto and prediction-market system with Freqtrade backtesting, Monte Carlo stress tests, Kalshi arbitrage scanners and Kelly-criterion sizing. Runs in paper-trade mode with Telegram alerts.',
    stack: ['Python', 'Freqtrade', 'vectorbt', 'Kalshi API'],
    status: 'Paper-trading',
    cover: { type: 'svg', variant: 'trading' },
    links: [],
  },
  {
    id: 'satcom',
    name: 'Satcom Workforce Tracker',
    blurb:
      'Workforce-visibility platform with GPS-geofenced attendance, per-project timesheets, leave workflows and real-time chat across role-based dashboards for employees, managers, HR and admins.',
    stack: ['Next.js', 'Expo', 'PostgreSQL', 'Socket.IO', 'Leaflet'],
    status: 'Web + mobile',
    cover: { type: 'shot', src: '/images/satcom_app.png', frame: 'web' },
    links: [],
  },
  {
    id: 'label',
    name: 'Rack Label Printer',
    blurb:
      'Flutter app that prints product rack labels with barcodes to Brother QL-810W printers over WiFi or Bluetooth, pulling live product data from the back office via a JWT-secured Fastify API.',
    stack: ['Flutter', 'Fastify', 'TypeScript', 'MySQL', 'Brother SDK'],
    status: 'Android build ready',
    cover: { type: 'icon', src: '/images/labelprinter_icon.png' },
    links: [],
  },
  {
    id: 'wedding',
    name: 'Wedding Invitation Site',
    blurb:
      'Multi-event Telugu wedding site with a 3D parallax hero, per-ceremony pages, a guest RSVP backed by Google Sheets, and automated reminder emails on a Vercel cron.',
    stack: ['Next.js', 'React Three Fiber', 'Framer Motion', 'Vercel'],
    status: 'Live',
    cover: { type: 'photo', src: '/images/wedding.jpg' },
    links: [{ label: 'View site', href: 'https://wedding-five-self-14.vercel.app' }],
  },
  {
    id: 'roasttoast',
    name: 'RoastToast iOS',
    blurb:
      'Entertainment iOS app using Google Gemini multimodal AI. Snap a photo or chat and get a contextual roast with adjustable intensity. Built in a day.',
    stack: ['SwiftUI', 'Gemini API', 'Multimodal'],
    status: 'TestFlight beta',
    cover: { type: 'icon', src: '/images/roasttoast_logo.png' },
    links: [{ label: 'TestFlight', href: 'https://testflight.apple.com/join/AcacQbAe' }],
  },
  {
    id: 'promo',
    name: 'Promo Companion App',
    blurb:
      'Flutter loyalty and promotions app with Firebase push, a Google Maps store locator, barcode coupons and biometric login, paired with a Python AWS CDK backend.',
    stack: ['Flutter', 'Python', 'AWS CDK', 'Firebase', 'Google Maps'],
    status: 'Active dev',
    cover: { type: 'icon', src: '/images/promo_icon.png' },
    links: [],
  },
  {
    id: 'storybook',
    name: 'AI Storybook',
    blurb:
      'Turns text prompts and photos into illustrated children’s books with themes, age levels and PDF export. Python backend, a native iOS app and a React prototype.',
    stack: ['Python', 'FastAPI', 'Swift / iOS', 'React'],
    status: 'Prototype',
    cover: { type: 'svg', variant: 'storybook' },
    links: [],
  },
  {
    id: 'cstoreiq-site',
    name: 'CStoreIQ Website',
    blurb:
      'Marketing site for a full suite of retail-tech products with a strong hero, animated POS-terminal scenes and a fresh color system. Built fast with AI tooling.',
    stack: ['React', 'TypeScript', 'CSS'],
    status: 'Shipped',
    cover: { type: 'shot', src: '/images/csiq_website.png', frame: 'web' },
    links: [{ label: 'View site', href: 'https://website-ten-ivory-86.vercel.app/' }],
  },
  {
    id: 'mission-control',
    name: 'Mission Control',
    blurb:
      'Personal work-intelligence dashboard that scrapes my inbox, clusters threads into topics, and builds an Obsidian knowledge graph plus an HTML dashboard.',
    stack: ['Python', 'HTML / JS', 'LLM clustering'],
    status: 'Prototype',
    cover: { type: 'svg', variant: 'graph' },
    links: [],
  },
  {
    id: 'multilingual',
    name: 'Multilingual Store Command UI',
    blurb:
      'Conversational interface that turns natural-language commands, in any language, into convenience-store operations.',
    stack: ['LLM', 'NLP', 'Retail tech'],
    status: 'Prototype',
    cover: { type: 'photo', src: '/images/portfolioImage1.jpg' },
    links: [{ label: 'Prototype', href: 'https://designs.magicpath.ai/v1/sweet-shadow-2730' }],
  },
]

export const research = [
  {
    id: 'sensorium',
    name: 'Sensorium, MIT Reality Hack',
    blurb:
      'AR multiplayer game driven by the Arctop brain-computer interface on a Magic Leap headset. Semi-finalist at MIT Reality Hack 2022.',
    stack: ['Unity', 'AR', 'Magic Leap', 'BCI'],
    cover: { type: 'photo', src: '/images/xr_MIT.jpeg' },
    links: [{ label: 'Devpost', href: 'https://devpost.com/software/sensorium?ref_content=user-portfolio&ref_feature=in_progress' }],
  },
  {
    id: 'colorization',
    name: 'Image Colorization (CNNs)',
    blurb:
      'Convolutional autoencoder that colorizes grayscale images, about 20% more accurate than the baseline.',
    stack: ['Python', 'TensorFlow', 'CNNs'],
    cover: { type: 'photo', src: '/images/imagecolorization.png' },
    links: [{ label: 'GitHub', href: 'https://github.com/aadityasp/Image_colorization' }],
  },
  {
    id: 'virtual-mouse',
    name: 'Virtual Mouse (MediaPipe)',
    blurb:
      'Hand-tracking virtual mouse using computer vision and deep learning for touchless control.',
    stack: ['Python', 'MediaPipe', 'OpenCV'],
    cover: { type: 'video', src: '/images/19 - virtual_hand.mp4' },
    links: [{ label: 'GitHub', href: 'https://github.com/aadityasp/Virtual_Mouse' }],
  },
]

export const enterprise = [
  {
    name: 'Loyalty Server, Python to Go',
    desc: 'TCP socket server for POS loyalty (Commander and Passport protocols). Led an AI-driven rewrite with parity verification and security hardening across 74 commits.',
    stack: 'Go, Python, XML protocols',
  },
  {
    name: 'Fiscal Back-Office',
    desc: 'Multi-service retail back-office. Shipped Entity Framework query-batching performance work across the .NET services.',
    stack: 'Angular, C#/.NET, Python, SQL Server',
  },
  {
    name: '.NET Microservices (20+)',
    desc: 'Auth, Invoice, Lottery, Fuel, Item, Report, Scan and Sync services powering the retail platform.',
    stack: 'C#, .NET 6, Docker',
  },
  {
    name: 'CStoreIQ Mobile',
    desc: 'Cross-platform mobile POS for retail staff with offline data, Bluetooth peripherals and barcode capture.',
    stack: 'React Native, Firebase, Realm, BLE',
  },
]

export const stats = [
  { value: '17+', label: 'Products shipped' },
  { value: '2 to 3 days', label: 'Typical build time' },
  { value: '6+', label: 'Domains across retail, health, fintech, AI' },
  { value: 'AI-first', label: 'How I build, end to end' },
]
