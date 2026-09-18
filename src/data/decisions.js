// Product decisions, one per project, written up as problem / decision /
// tradeoff / result. They never render on the main page: a card whose id has
// a decision here shows a "Read the decision" button that opens the layer
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
]

/** Decisions attached to one project card (empty array when it has none). */
export function decisionsFor(projectId) {
  return studies.filter((s) => s.project === projectId)
}
