// Product decisions, one per project, written up as problem / decision /
// tradeoff / result. They never render on the main page: a card whose id has
// a decision here shows a "Case study" button that opens the layer
// (src/components/DecisionLayer.jsx) with ONLY that project's write-up.
//
// Honesty rule for this file: every number here is one that already appears on
// the resume and has been verified there. Nothing is rounded up, and design
// consequences are stated as design consequences, not as measured outcomes.

export const studies = [
  {
    id: 'invoicepay-policy',
    project: 'invoicepay',
    headline: 'Which fields may post without a human?',
    context:
      'Many supplier invoices at convenience stores still arrive on paper, and someone keys each line in by hand. InvoicePay reads the invoice with OCR and an LLM and posts it as structured, auditable records through the back office, EDI, and payment systems.',
    sections: [
      {
        label: 'The problem',
        body:
          'Extraction was never the hard part. The hard question was what the system is allowed to do with a value once it has one. A single global accuracy number is useless here, because a pipeline that is right 95 percent of the time and cannot tell you which 5 percent is worse than a slower manual process.',
      },
      {
        label: 'The decision',
        body:
          'I wrote an automation policy instead of a threshold. Every field carries its own confidence threshold. Some fields may post straight through with no one in the loop. Others never post unattended no matter how confident the model is, because a silent error there costs too much. Everything below threshold routes to a named human review path, where a person can see it and catch it.',
      },
      {
        label: 'The tradeoff',
        body:
          'It made the first version look less impressive. A demo that posts everything automatically beats one that stops and asks, and this design sends more lines to review than a single loose threshold would. I took that trade because operators stop trusting a system the first time it posts something wrong without telling them, and once trust is gone the accuracy no longer matters.',
      },
      {
        label: 'The result',
        body:
          'The pipeline is live in pilot stores, posting through back office, EDI, and payment systems. The estimate from the pilots is 30 to 40 hours saved per store each month. And because the policy is per field, the thresholds can be tuned one field at a time instead of arguing over a global number nobody can defend.',
      },
    ],
    numbers: [
      { value: '30 to 40 hrs', label: 'Saved per pilot store each month (pilot estimate)' },
      { value: 'Per field', label: 'Confidence thresholds, with a human review path below them' },
      { value: 'Live', label: 'In pilot stores, posting to back office, EDI and payment' },
    ],
    link: { label: 'Try the scanning half (ScanIQ beta)', href: 'https://play.google.com/apps/testing/com.cstoreiq.scaniq' },
  },
  {
    id: 'catalog-confidence',
    project: 'catalog',
    headline: 'Ship the clean file, or the honest one?',
    context:
      'I was asked to map a 522,000 item product catalog onto the NACS industry taxonomy and enrich brand, manufacturer, category, and unit of measure on every item using LLM classification. The request was the mapping. Deliver the mapped catalog, done.',
    sections: [
      {
        label: 'The problem',
        body:
          'Once that catalog became the reference other features built on, every consumer would treat every value as equally true. A guessed manufacturer and a confirmed one would be indistinguishable, and the error would surface months later inside somebody else’s feature, where nobody would trace it back.',
      },
      {
        label: 'The decision',
        body: 'I added per field confidence scoring on every enriched attribute. Nobody asked for it.',
      },
      {
        label: 'The tradeoff',
        body:
          'It made the work slower, and it made my own output look worse, because it exposed exactly which values were shaky instead of handing over a clean looking file.',
      },
      {
        label: 'The result',
        body:
          'Downstream teams could filter on it. Features that needed certainty took only high confidence values, and the rest got routed for review instead of quietly propagating. Data with no provenance is a liability disguised as an asset, and the person who creates a dataset is the only one positioned to mark it honestly.',
      },
    ],
    numbers: [
      { value: '522,000', label: 'Items mapped to the NACS taxonomy' },
      { value: '4', label: 'Attributes enriched per item (brand, manufacturer, category, unit of measure)' },
      { value: 'Per field', label: 'Confidence score on every enriched value' },
    ],
    link: null,
  },
  {
    id: 'writeoff-engine',
    project: 'writeoff',
    // Source: ~/Downloads/writeoff/README.md (request flow steps 2-5) and docs/api-changes.md
    // (facts never taken from the model's reading; eval harness results for tax engine 2026.09.3).
    headline: 'Should the model make the tax call?',
    context:
      'WriteOff tells a small-business owner whether an expense is potentially deductible, how much counts, why, and where it goes on Schedule C. They snap a receipt or type what they bought.',
    sections: [
      {
        label: 'The problem',
        body:
          'People who do not understand taxes will believe a confident answer. A model that sounds sure and gets a deduction wrong is worse than an app that stops and asks one more question.',
      },
      {
        label: 'The decision',
        body:
          'The model only reads the receipt. A deterministic tax engine makes every decision and does every calculation. The model may reword the explanation, but it cannot change the decision or the numbers. Facts that change the answer, like business use or who attended, are never taken from the model’s reading. The engine asks the owner instead, one question per screen.',
      },
      {
        label: 'The tradeoff',
        body:
          'It is more work and more questions. Every expense category needed its own decision tree, with rates versioned by tax year, where a chatbot would have answered instantly with no rules behind it at all.',
      },
      {
        label: 'The result',
        body:
          'Every answer cites the IRS authority behind it and is saved as an audit-ready record. The eval harness caught cases where the engine overstated a deduction, such as travel with a spouse who is not an employee showing the whole bill instead of your own share, and they were fixed before launch. The app is live on the App Store.',
      },
    ],
    numbers: [
      { value: '1,523', label: 'IRS-sourced cases the engine is checked against' },
      { value: '50+', label: 'Expense categories, each with its own decision tree' },
      { value: 'Zero', label: 'Decisions or amounts the model is allowed to change' },
    ],
    link: { label: 'Get WriteOff on the App Store', href: 'https://apps.apple.com/us/app/writeoff-can-i-deduct-it/id6815032980' },
  },
  {
    id: 'pos-offline-first',
    project: 'pos',
    // Decision confirmed by Aditya 2026-09-28 (offline first). Specifics from the public product
    // page cstoreiq.com/pos ("Never miss a sale", 7-day on-device store, 15-minute sync). Platform
    // numbers are resume cs6, stated at platform scope.
    headline: 'Should the register need the internet?',
    context:
      'CStoreiQ POS is a production Android point of sale for non-fuel convenience stores, covering checkout, tenders and lottery, built on CStoreiQ BackOffice so every store’s pricebook stays current. I led it as PM and built about 70 percent of it myself, AI-first.',
    sections: [
      {
        label: 'The problem',
        body:
          'A convenience store sells in seconds, one customer after another. If the register depends on the connection, a dropped line or a flaky router stops checkout at the counter, and that sale walks out the door.',
      },
      {
        label: 'The decision',
        body:
          'Offline first. The register completes every sale on the device whether or not it is online. Transactions queue locally, are held for up to 7 days, and sync to the back office every 15 minutes once the connection returns.',
      },
      {
        label: 'The tradeoff',
        body:
          'It is harder to build than a register that simply calls the cloud. The device has to carry everything it needs to sell on its own, and the back office has to accept sales that arrive late and in batches.',
      },
      {
        label: 'The result',
        body:
          'The POS runs in production on registers inside CStoreiQ retailer stores, and a dropped connection does not stop checkout. Across the platform I own, the team shipped 15+ features in 6 months, contributing to $700K in revenue, while production defects fell 40 percent and support escalations fell 30 percent.',
      },
    ],
    numbers: [
      { value: '7 days', label: 'Transactions held on the device during an outage' },
      { value: '15 min', label: 'Sync interval once the connection returns' },
      { value: '15+', label: 'Platform features shipped in 6 months' },
    ],
    link: { label: 'CStoreiQ POS', href: 'https://www.cstoreiq.com/pos/index.html' },
  },
  {
    id: 'rewards-three-calls',
    project: 'rewards',
    // All three decisions confirmed by Aditya 2026-09-28: games instead of plain points, live
    // accrual when the receipt closes, a store-branded app per retailer.
    headline: 'What brings a shopper back?',
    context:
      'Rewards is CStoreiQ’s loyalty platform, with a shopper app, a retailer admin, and an accrual service tied to the POS.',
    sections: [
      {
        label: 'The problem',
        body:
          'A points balance alone does not bring shoppers back. A reward that shows up hours later is easy to ignore, and a loyalty app that carries the platform’s name builds the platform’s relationship with the shopper, not the store’s.',
      },
      {
        label: 'The decision',
        body:
          'Three calls. Rewards run on games, spin-wheel, scratch-card and slots on tiered points, instead of a plain balance. Points credit the moment a receipt closes at the POS, so the reward lands while the shopper is still at the counter. And every retailer gets its own store-branded app, so the relationship stays with the store.',
      },
      {
        label: 'The tradeoff',
        body:
          'Each call adds work. Live accrual puts loyalty on the checkout path, so the accrual service has to be as dependable as the register. Games need their own rules and odds to manage. And a branded app per retailer means shipping many builds instead of one.',
      },
      {
        label: 'The result',
        body:
          'It is in active development, with store-branded builds that ship per retailer.',
      },
    ],
    numbers: [
      { value: '3', label: 'Game types (spin-wheel, scratch-card and slots)' },
      { value: 'Live', label: 'Points credited when the receipt closes' },
      { value: 'Per retailer', label: 'Store-branded builds' },
    ],
    link: null,
  },
]

/** Decisions attached to one project card (empty array when it has none). */
export function decisionsFor(projectId) {
  return studies.filter((s) => s.project === projectId)
}
