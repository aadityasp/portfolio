// Verified against source on disk + the user's Claude-history inventory.
// Copy is intentionally short: one punchy line per project.
//
// cover.type: 'svg' | 'icon' | 'shot' | 'photo' | 'video' | 'slideshow'
// cover.fallback: svg variant to show if the asset fails to load.
//
// Every card must give the visitor something to do or an honest reason it can't:
// either `links` (something to open) or `note` (why there is no public build).
// A status with neither is a dead end and gets cut.

export const featured = [
  {
    id: 'pos',
    name: 'CStoreIQ POS System',
    tagline: 'Enterprise point of sale',
    blurb: 'Production Android POS built by a 3-developer team. I built ~70% of it using AI, end to end: checkout, tenders, lottery, and the back-office sync that keeps every store’s pricebook current.',
    stack: ['Kotlin', 'Jetpack Compose', 'FastAPI', 'SQL Server', 'AWS'],
    status: 'In production',
    badge: 'Top contributor',
    // Real register screens (Sunmi build), cycled as a short walkthrough.
    cover: { type: 'slideshow', srcs: ['/images/pos_slide_1.jpg', '/images/pos_slide_2.jpg', '/images/pos_slide_3.jpg', '/images/pos_slide_4.jpg'], fallback: 'pos' },
    note: 'Runs on registers inside CStoreIQ retailer stores, so there is no public install. The screens above are the real register.',
    links: [{ label: 'CStoreIQ POS', href: 'https://www.cstoreiq.com/pos/index.html' }],
  },
  {
    id: 'rewards',
    name: 'Rewards & Gamification',
    tagline: 'Loyalty built on real games',
    blurb: 'Spin-wheel, scratch-card and slot games with tiered points and live POS accrual at checkout. Shopper app, retailer admin, and the accrual service that credits points the moment a receipt closes.',
    stack: ['Flutter', 'FastAPI', 'Angular', 'SQL Server'],
    status: 'Active dev',
    badge: 'Full platform',
    cover: { type: 'shot', src: '/images/rewards.png', frame: 'phone', fallback: 'loyalty' },
    note: 'Store-branded builds ship per retailer, so there is no single public app to download yet.',
    links: [],
  },
  {
    id: 'invoicepay',
    name: 'InvoicePay',
    tagline: 'Paper invoice to payment',
    blurb: 'Snap a paper invoice, AI reads every line, it issues an EDI 810 and triggers the check payment. Per-field confidence decides what posts unattended and what a human reviews.',
    stack: ['Flutter', 'FastAPI', 'Mistral AI OCR', 'EDI 810'],
    status: 'In production',
    badge: 'Live with vendors',
    cover: { type: 'svg', variant: 'invoice' },
    note: 'The payment rail is private to CStoreIQ vendors. The scanning half is public as ScanIQ.',
    links: [{ label: 'Try the scanner (ScanIQ beta)', href: 'https://play.google.com/apps/testing/com.cstoreiq.scaniq' }],
  },
  {
    id: 'heal',
    name: 'AI Clinical Scribe',
    tagline: 'Ambient medical scribe',
    blurb: 'Turns code-mixed doctor visits into FHIR clinical notes the doctor reviews and signs.',
    stack: ['Next.js', 'FastAPI', 'Sarvam AI', 'GPT-4o'],
    status: 'In beta with doctors',
    badge: 'Healthcare AI',
    cover: { type: 'video', src: '/images/heal_demo.mp4', poster: '/images/heal_demo_poster.jpg', fallback: 'scribe' },
    // GitHub link removed 2026-09-14: repo is private, the link 404'd for every visitor.
    links: [{ label: 'View live', href: 'https://ai-medical-scribe-three.vercel.app' }],
  },
]

export const apps = [
  {
    id: 'distress',
    name: 'Distress Intelligence',
    blurb: 'Motivated-seller leads for any U.S. county, live from public records. A scraper harness pulls tax, probate and foreclosure filings, a scoring brain ranks them and explains why, and the operator board updates as the scrape runs.',
    stack: ['Next.js', 'Supabase', 'Drizzle + Postgres', 'MapLibre'],
    status: 'Live',
    cover: { type: 'shot', src: '/images/distress_board.jpg', frame: 'web', fallback: 'graph' },
    links: [
      { label: 'Try it live', href: 'https://distress-intelligence.vercel.app/login' },
      { label: 'View site', href: 'https://distress-intelligence.vercel.app' },
    ],
  },
  {
    id: 'scaniq',
    name: 'ScanIQ',
    blurb: 'Scan a vendor invoice with your phone and every line item is read automatically and sent straight to the back office. No typing. Open beta on both stores.',
    stack: ['Flutter', 'FastAPI', 'OCR', 'iOS + Android'],
    status: 'Open beta',
    cover: { type: 'video', src: '/images/scaniq_demo.mp4', poster: '/images/scaniq_demo_poster.jpg', fallback: 'invoice' },
    links: [
      { label: 'Google Play beta', href: 'https://play.google.com/apps/testing/com.cstoreiq.scaniq' },
      { label: 'TestFlight beta', href: 'https://testflight.apple.com/join/caa1kBh6' },
    ],
  },
  {
    id: 'lifeos',
    name: 'LifeOS',
    blurb: 'A persistent AI agent team that runs my admin. Department heads I task from Telegram, a numbered decision queue I answer with a yes or no, verification before anything reaches me, and hard red lines it can never cross: no sends, no spend, no new accounts. All state lives in files, never in a context window.',
    stack: ['Claude Code', 'Telegram', 'Markdown state'],
    status: 'Private build',
    cover: { type: 'svg', variant: 'lifeos' },
    note: 'Private repo, since it runs my own admin.',
    links: [],
  },
  {
    id: 'blackjack',
    name: 'Blackjack Trainer: 21 Coach',
    blurb: 'Free iOS trainer that drills mathematically-correct basic strategy, hand by hand, with instant feedback. No ads, no accounts, fully offline.',
    stack: ['SwiftUI', 'iOS'],
    status: 'On the App Store',
    cover: { type: 'svg', variant: 'blackjack' },
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/us/app/id6789853035' },
      { label: 'GitHub', href: 'https://github.com/aadityasp/blackjack-trainer' },
    ],
  },
  {
    id: 'visual-workflows',
    name: 'Visual Workflows',
    blurb: 'Real-time dashboard for Claude Code multi-agent runs: animated agent panels, inline terminals and full-run replay. Local-first, 340+ tests.',
    stack: ['React', 'TypeScript', 'Node.js', 'WebSockets'],
    status: 'Open source',
    cover: { type: 'video', src: '/images/visualworkflows_demo.mp4', poster: '/images/visualworkflows_demo_poster.jpg', frame: 'web', fallback: 'agents' },
    links: [{ label: 'GitHub', href: 'https://github.com/aadityasp/visual-workflows' }],
  },
  {
    id: 'grader',
    name: 'Restaurant Growth Grader',
    blurb: 'A real-time rebuild of Owner.com’s Grader. Fetches a restaurant’s live website and validates 20+ signals into a growth score. Not a mockup, it runs the checks live.',
    stack: ['JavaScript', 'Live fetch', 'DOM analysis'],
    status: 'Live',
    cover: { type: 'shot', src: '/images/grader_app.png', frame: 'web', fallback: 'graph' },
    links: [{ label: 'Try it live', href: 'https://aadityasp.github.io/restaurant-growth-grader/' }],
  },
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
    blurb: 'Two signal engines, both human-in-the-loop. A Polymarket tracker watches recently profitable wallets and flags when several pile into the same outcome, then writes a trade ticket I execute by hand. An order-flow backtester turns a Robbins Cup trader’s published rules into code and tests them on real tick data.',
    stack: ['Python', 'Polymarket API', 'Tick-data backtests'],
    status: 'Signals only, no auto-execution',
    cover: { type: 'svg', variant: 'trading' },
    note: 'Private repo. It never places an order, so there is nothing to log into.',
    links: [],
  },
  {
    id: 'satcom',
    name: 'Satcom Workforce Tracker',
    blurb: 'Geofenced attendance, timesheets, leave and team chat across SuperAdmin, HR, manager and employee dashboards. Web app plus an Expo mobile app on one API, Docker-packaged for the client to self-host.',
    stack: ['Next.js', 'Expo', 'PostgreSQL', 'Docker'],
    status: 'Built for a client',
    cover: { type: 'shot', src: '/images/satcom_app.png', frame: 'web', fallback: 'graph' },
    links: [{ label: 'GitHub', href: 'https://github.com/aadityasp/satcom-workforce' }],
  },
  {
    id: 'label',
    name: 'Shelf Label Printer',
    blurb: 'Phone app that prints barcode shelf labels for gas-station product racks to Brother QL-810W printers over WiFi or Bluetooth. Pulls live product data through a Fastify API that issues short-lived tokens, so phones never touch the store database.',
    stack: ['Flutter', 'Fastify', 'Brother SDK'],
    status: 'Build ready',
    cover: { type: 'svg', variant: 'label' },
    note: 'Internal CStoreIQ tool, ships to store staff rather than the app stores.',
    links: [],
  },
  {
    id: 'roasttoast',
    name: 'RoastToast iOS',
    blurb: 'Gemini-powered app that roasts your photos. Built in a day.',
    stack: ['SwiftUI', 'Gemini API'],
    status: 'On the App Store',
    cover: { type: 'icon', src: '/images/roasttoast_logo.png', fallback: 'storybook' },
    links: [{ label: 'App Store', href: 'https://apps.apple.com/us/app/roasttoast-ai-roast-machine/id6757412164' }],
  },
  {
    id: 'promo',
    name: 'Promo App',
    blurb: 'Shopper-facing loyalty and promos app: push offers, store finder, coupons and biometric login, on a serverless AWS backend deployed with CDK.',
    stack: ['Flutter', 'AWS CDK', 'Lambda', 'Firebase'],
    status: 'Active dev',
    cover: { type: 'svg', variant: 'loyalty' },
    note: 'White-labeled per retailer, so no single public listing yet.',
    links: [],
  },
  {
    id: 'cstoreiq-site',
    name: 'CStoreIQ Website',
    blurb: 'Marketing site for a retail-tech suite. Animated, shipped fast.',
    stack: ['React', 'TypeScript'],
    status: 'Shipped',
    cover: { type: 'shot', src: '/images/csiq_website.png', frame: 'web', fallback: 'pos' },
    links: [{ label: 'View site', href: 'https://cstoreiq1.vercel.app/' }],
  },
  {
    id: 'mission-control',
    name: 'Mission Control',
    blurb: 'Pulls my whole work inbox and Jira board, clusters threads into topics with an LLM, and writes Obsidian maps of content that link every email to the tickets it touches. One dashboard instead of two inboxes.',
    stack: ['Python', 'LLM clustering', 'Obsidian'],
    status: 'Personal tool',
    cover: { type: 'svg', variant: 'graph' },
    note: 'Runs on my private mail and tickets, so there is no public build.',
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

export const stats = [
  { value: '3 domains', label: 'Retail, health & fintech' },
  { value: '17+', label: 'Products shipped, idea to live' },
  { value: '2 to 5 days', label: 'From idea to working build' },
  { value: 'MS in AI', label: 'Northeastern University' },
]
