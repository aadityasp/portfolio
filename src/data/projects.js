// Verified against source on disk + the user's Claude-history inventory.
// Copy is intentionally short: one punchy line per project.
//
// cover.type: 'svg' | 'icon' | 'shot' | 'photo' | 'video'

export const featured = [
  {
    id: 'pos',
    name: 'CStoreIQ POS System',
    tagline: 'Enterprise point of sale',
    blurb: 'Production Android POS built by a 6-dev team. I own ~36% of the Kotlin codebase, AI-first.',
    stack: ['Kotlin', 'Jetpack Compose', 'FastAPI', 'SQL Server', 'AWS'],
    status: 'In production',
    badge: 'Top contributor',
    cover: { type: 'shot', src: '/images/pos_app.png', frame: 'web' },
    links: [],
  },
  {
    id: 'rewards',
    name: 'Rewards & Gamification',
    tagline: 'Loyalty built on real games',
    blurb: 'Spin-wheel, scratch-card and slot games with tiered points and live POS accrual at checkout.',
    stack: ['Flutter', 'FastAPI', 'Angular', 'SQL Server'],
    status: 'Active dev',
    badge: 'Full platform',
    cover: { type: 'shot', src: '/images/rewards.png', frame: 'phone' },
    links: [],
  },
  {
    id: 'invoicepay',
    name: 'InvoicePay',
    tagline: 'Paper invoice to payment',
    blurb: 'Snap a paper invoice, AI reads it, it issues an EDI 810 and triggers the check payment.',
    stack: ['Flutter', 'FastAPI', 'Mistral AI OCR', 'EDI 810'],
    status: 'Working MVP',
    badge: 'Demo-ready',
    cover: { type: 'svg', variant: 'invoice' },
    links: [],
  },
  {
    id: 'heal',
    name: 'HEAL.AI Clinical Scribe',
    tagline: 'Ambient medical scribe',
    blurb: 'Turns code-mixed doctor visits into FHIR clinical notes the doctor reviews and signs.',
    stack: ['Next.js', 'FastAPI', 'Sarvam AI', 'GPT-4o'],
    status: 'Prototype',
    badge: 'Healthcare AI',
    cover: { type: 'svg', variant: 'scribe' },
    links: [{ label: 'GitHub', href: 'https://github.com/aadityasp/ai-medical-scribe' }],
  },
]

export const apps = [
  {
    id: 'luxe',
    name: 'Luxe Invites',
    blurb: 'I built my own wedding invite, then turned it into a product so anyone can make one.',
    stack: ['Next.js', 'React Three Fiber', 'Vercel'],
    status: 'Live',
    cover: { type: 'svg', variant: 'invite' },
    links: [{ label: 'Try it', href: 'https://luxe-invites.vercel.app' }],
  },
  {
    id: 'trading',
    name: 'Trading Engine',
    blurb: 'Crypto and Kalshi bot: backtests, arbitrage, Kelly sizing, Telegram alerts.',
    stack: ['Python', 'Freqtrade', 'Kalshi API'],
    status: 'Paper-trading',
    cover: { type: 'svg', variant: 'trading' },
    links: [],
  },
  {
    id: 'satcom',
    name: 'Satcom Workforce Tracker',
    blurb: 'Geofenced attendance, timesheets and chat across role-based dashboards.',
    stack: ['Next.js', 'Expo', 'PostgreSQL'],
    status: 'Web + mobile',
    cover: { type: 'shot', src: '/images/satcom_app.png', frame: 'web' },
    links: [],
  },
  {
    id: 'label',
    name: 'Rack Label Printer',
    blurb: 'Prints barcode rack labels to Brother printers over WiFi or Bluetooth.',
    stack: ['Flutter', 'Fastify', 'Brother SDK'],
    status: 'Build ready',
    cover: { type: 'icon', src: '/images/labelprinter_icon.png' },
    links: [],
  },
  {
    id: 'roasttoast',
    name: 'RoastToast iOS',
    blurb: 'Gemini-powered app that roasts your photos. Built in a day.',
    stack: ['SwiftUI', 'Gemini API'],
    status: 'TestFlight',
    cover: { type: 'icon', src: '/images/roasttoast_logo.png' },
    links: [{ label: 'TestFlight', href: 'https://testflight.apple.com/join/AcacQbAe' }],
  },
  {
    id: 'promo',
    name: 'Promo App',
    blurb: 'Loyalty and promos app with push, maps, coupons and biometric login.',
    stack: ['Flutter', 'AWS CDK', 'Firebase'],
    status: 'Active dev',
    cover: { type: 'icon', src: '/images/promo_icon.png' },
    links: [],
  },
  {
    id: 'storybook',
    name: 'AI Storybook',
    blurb: 'Turns prompts and photos into illustrated kids’ books with PDF export.',
    stack: ['Python', 'Swift / iOS', 'React'],
    status: 'Prototype',
    cover: { type: 'svg', variant: 'storybook' },
    links: [],
  },
  {
    id: 'cstoreiq-site',
    name: 'CStoreIQ Website',
    blurb: 'Marketing site for a retail-tech suite. Animated, shipped fast.',
    stack: ['React', 'TypeScript'],
    status: 'Shipped',
    cover: { type: 'shot', src: '/images/csiq_website.png', frame: 'web' },
    links: [{ label: 'View site', href: 'https://website-ten-ivory-86.vercel.app/' }],
  },
  {
    id: 'mission-control',
    name: 'Mission Control',
    blurb: 'Scrapes my inbox and builds an Obsidian topic graph and dashboard.',
    stack: ['Python', 'LLM clustering'],
    status: 'Prototype',
    cover: { type: 'svg', variant: 'graph' },
    links: [],
  },
]

export const research = [
  {
    id: 'sensorium',
    name: 'Sensorium',
    blurb: 'AR brain-controlled multiplayer game. MIT Reality Hack 2022 semi-finalist.',
    stack: ['Unity', 'AR', 'BCI'],
    cover: { type: 'photo', src: '/images/xr_MIT.jpeg' },
    links: [{ label: 'Devpost', href: 'https://devpost.com/software/sensorium?ref_content=user-portfolio&ref_feature=in_progress' }],
  },
  {
    id: 'colorization',
    name: 'Image Colorization',
    blurb: 'CNN autoencoder that colorizes grayscale photos, ~20% over baseline.',
    stack: ['Python', 'TensorFlow', 'CNNs'],
    cover: { type: 'photo', src: '/images/imagecolorization.png' },
    links: [{ label: 'GitHub', href: 'https://github.com/aadityasp/Image_colorization' }],
  },
  {
    id: 'virtual-mouse',
    name: 'Virtual Mouse',
    blurb: 'Touchless hand-tracking mouse with computer vision.',
    stack: ['Python', 'MediaPipe', 'OpenCV'],
    cover: { type: 'video', src: '/images/19 - virtual_hand.mp4' },
    links: [{ label: 'GitHub', href: 'https://github.com/aadityasp/Virtual_Mouse' }],
  },
]

export const enterprise = [
  {
    name: 'Loyalty Server',
    desc: 'Led an AI-driven Python to Go rewrite with parity verification, 74 commits.',
    stack: 'Go, Python',
  },
  {
    name: 'Fiscal Back-Office',
    desc: 'Entity Framework query-batching performance work across .NET services.',
    stack: 'Angular, C#/.NET',
  },
  {
    name: '.NET Microservices (20+)',
    desc: 'Auth, Invoice, Lottery, Fuel, Report and Sync services for the platform.',
    stack: 'C#, .NET 6',
  },
  {
    name: 'CStoreIQ Mobile',
    desc: 'Mobile POS with offline data, Bluetooth peripherals and barcode capture.',
    stack: 'React Native, Realm',
  },
]

export const stats = [
  { value: '17+', label: 'Products shipped' },
  { value: '2 to 5 days', label: 'Typical build' },
  { value: '6+', label: 'Domains' },
  { value: 'AI-first', label: 'Always' },
]
