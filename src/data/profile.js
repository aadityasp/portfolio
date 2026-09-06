// Real career data, extracted from the current portfolio.

export const experience = [
  {
    year: '2023',
    range: 'Jun 2023 — Now',
    company: 'CStoreIQ',
    location: 'Huntsville, AL',
    role: 'Senior Product Manager',
    logo: '/images/cstoreiq_logo.svg',
    chapter: 'Product',
    current: true,
    points: [
      'Lead product for POS and Back-Office in convenience retail',
      'Shipped 15+ features from discovery to launch',
      'Build production features myself, AI-first',
    ],
    tags: ['Product', 'B2B SaaS', 'Retail Tech', 'AI-first'],
  },
  {
    year: '2022',
    range: 'Jun 2022 — Dec 2022',
    company: 'Viziverse',
    location: 'Boston, MA',
    role: 'CV / ML Engineer Intern',
    logo: '/images/viziverse_icon.jpeg',
    chapter: 'Engineering',
    points: [
      'Built a real-time interaction system for immersive AR/VR',
      'Patent-pending metaverse method using pose estimation',
    ],
    tags: ['Computer Vision', 'AR / VR', 'Pose Estimation'],
  },
  {
    year: '2018',
    range: 'Jul 2018 — Dec 2020',
    company: 'Wipro Technologies',
    location: 'Bengaluru, India',
    role: 'Software Engineer',
    logo: '/images/wipro_icon.jpeg',
    chapter: 'Engineering',
    points: [
      'Built an autonomous-vehicle simulation platform on CARLA + Unreal Engine 4',
      'Authored 50+ driving scenarios; demos secured added funding',
    ],
    tags: ['CARLA', 'Unreal Engine', 'Autonomous Vehicles'],
  },
]

export const education = [
  {
    degree: 'MS, Artificial Intelligence',
    school: 'Khoury College, Northeastern University',
    detail: 'Boston · GPA 3.83 / 4.0',
    logo: '/images/khoury_College_icon.jpeg',
  },
  {
    degree: 'BTech, Electronics & Communication',
    school: 'Manipal Institute of Technology',
    detail: 'Manipal, India',
    logo: '',
  },
]

export const certs = [
  'Certified Scrum Product Owner (CSPO)',
  'Google Generative AI Leader',
  'AI-First Product Leader',
  'AWS Machine Learning',
  'Transformers for Computer Vision',
  'Deep Learning Specialization',
]

// Extra certifications revealed by the "+ N more" toggle in the Certifications block.
// The toggle count updates automatically, and the button only appears when this
// list is non-empty (so it never claims certs that aren't here).
// Note: the 4 Andrew Ng / Coursera deep-learning courses (Neural Networks & Deep
// Learning, Improving Deep NN, Structuring ML Projects, CNNs) are represented by the
// "Deep Learning Specialization" pill above, so they aren't repeated here.
export const moreCerts = [
  'Learning REST APIs',
  'Visual Perception - First Principles of CV',
  'Camera & Imaging - First Principles of CV',
  'AI Foundations: Machine Learning',
  'The Complete Python Bootcamp',
  'Learn Ethical Hacking from Scratch',
  'IP Addressing & Subnetting',
]
