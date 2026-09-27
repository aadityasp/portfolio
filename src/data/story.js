// The career film: how an engineer became an AI product builder. Music only,
// no narration, so every word it shows is also here as the transcript. It
// renders under the Timeline card ("Read the film instead") and inside the
// player ("The film, in words"), and each beat's `t` seeks the film.
//
// Synced to the final v5 render (64.0 s): chapter and beat seconds are the
// measured times, and the words are the on-screen text, word for word. The
// film sets eyebrows in capitals; the Transcript does that with CSS, so they
// are stored in normal case here. The shape stays [{ t, eyebrow, headline, body }].

export const story = {
  id: 'story',
  name: 'The path',
  src: '/images/story_film_v5.mp4',
  poster: '/images/story_poster_v5.webp',
  seconds: 64,
  audio: 'music',
  chapters: [['Engineer', 10.367], ['AI', 18.033], ['Startup', 38.967], ['What I built', 45.767], ['Now', 52.067]],
  transcript: [
    {
      t: 0.4,
      eyebrow: '',
      headline: 'How an engineer became an AI product builder.',
      body: 'Handwritten: my notebook, so far',
    },
    {
      t: 5.2,
      eyebrow: 'Manipal, India',
      headline: 'It started with circuits.',
      body: 'BTech in Electronics & Communication at Manipal Institute of Technology. Signals, chips, and how things work underneath.',
    },
    {
      t: 10.35,
      eyebrow: 'Wipro · Bengaluru · 2018 to 2020',
      headline: 'I built worlds for self-driving cars.',
      body: 'An autonomous-vehicle simulator on CARLA and Unreal Engine 4. I wrote 50+ driving scenarios, and the demos won the team more funding. Quote card: “...has answers to everything.” Chandeep Vasudevan, Wipro teammate. Simulator window: CARLA + Unreal Engine 4 · Scenarios 01 to 50+ · Vehicle · Pedestrian.',
    },
    {
      t: 18,
      eyebrow: 'Boston · Northeastern University',
      headline: 'Then I went deep on AI.',
      body: 'MS in Artificial Intelligence at Khoury College. And I taught it too, as a teaching assistant. Sticky notes: TA · Computer Vision, TA · Mixed Reality. Handwritten beside the eye: eye.',
    },
    {
      t: 26.1,
      eyebrow: 'MIT Reality Hack · 2022',
      headline: 'A game you play with your feelings.',
      body: 'Sensorium, a multiplayer AR game about feelings. You pick one with your hand and throw it to a friend. Built with my team at MIT Reality Hack. Polaroid: MIT Reality Hack. Stamp: Semi-finalist, MIT Reality Hack 2022.',
    },
    {
      t: 30.9,
      eyebrow: 'Viziverse · Boston · ML Engineer Intern',
      headline: 'A game you play with your whole body.',
      body: 'A Unity game that segments you out of your background and drops you into the game, where you move 3D objects with your body. On phones, tablets and computers. Scan tag: segmenting. Handwritten: you, cut out in real time · patent pending.',
    },
    {
      t: 38.95,
      eyebrow: 'CStoreiQ · 2023',
      headline: 'Then I joined a startup as its first hire.',
      body: 'I learned the business in the aisles. Store visits, long hours with store owners, and a notebook full of their problems. Sticky notes: invoices typed by hand · prices out of sync · no way to reward regulars.',
    },
    {
      t: 45.75,
      eyebrow: 'CStoreiQ · Product',
      headline: 'Then I built what they needed.',
      body: 'Invoices typed by hand → AI reads the invoice (live in pilot stores). Prices out of sync → A POS that syncs every price (in production). No way to reward regulars → Loyalty games, points at checkout (active dev). Product manager, then senior product manager. Building much of it myself, with AI.',
    },
    {
      t: 52.05,
      eyebrow: 'Now',
      headline: 'Now, I’m an AI product builder.',
      body: 'I design the product, write the code with AI, and put it in front of users, fast. Handwritten: 17+ products shipped · retail · health · fintech.',
    },
    {
      t: 56.98,
      eyebrow: 'Aditya Appana',
      headline: 'Still curious. Still building.',
      body: 'The curve: engineering · product · senior product · AI product builder. portfolio.adityasriprasad.com · aadityasp@gmail.com · linkedin.com/in/aadityasp',
    },
  ],
  // The corner list of titles that the film writes and crosses off as it goes.
  titles: 'Titles, so far: ECE student and Software Engineer are crossed off as he moves on; MS in AI + TA and ML Engineer Intern are crossed off together when he joins CStoreiQ; Product Manager is crossed off at the promotion; Senior Product Manager stays, with “AI product builder” handwritten under it and circled.',
}
