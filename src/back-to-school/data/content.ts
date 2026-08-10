/**
 * Page copy.
 *
 * Everything under `copy` is VERBATIM from the client's Back to School brief
 * ("LP | Back to school (Modelo 1)"). Nothing here is paraphrased, shortened
 * or invented — including the CTA labels, which differ per section because the
 * brief writes them that way.
 *
 * `coaches` and `reviews` are the academy's own published material, lifted
 * from rpbjjboerne.com (their bios and their Google reviews). No claim on this
 * page originates with us.
 */

export const ACADEMY = {
  name: 'RPBJJ Boerne',
  legalName: 'Rodrigo Pinheiro BJJ Boerne',
  street: '28255 Frontage Rd Suite 103',
  city: 'Boerne, TX 78006',
  phone: '+1 (210) 867-6156',
  phoneHref: 'tel:+12108676156',
  email: 'ribabjj@gmail.com',
  mapsUrl: 'https://maps.app.goo.gl/Z4EffdTNcPicS2sK8',
  mapEmbedQuery: '28255+Frontage+Rd+Suite+103,+Boerne,+TX+78006',
  instagram: 'https://www.instagram.com/rpbjj_boerne/',
  facebook: 'https://www.facebook.com/RPBJJBoerneTX/',
  mainSite: 'https://rpbjjboerne.com/',
} as const

/** CTA labels, exactly as the brief writes them for each section. */
export const CTA = {
  hero: 'Book a free trial class',
  standard: 'Book a free back to school trial class',
  schedule: 'Schedule free back to school class',
} as const

export const HERO = {
  headline: 'This school year, give your child confidence that goes beyond the classroom.',
  body:
    'Children grow the most when they develop both body and character. RPBJJ Boerne Back to School is the perfect opportunity for your child to develop lifelong values.',
} as const

export const WHY = {
  headline:
    'Jiu-Jitsu is the safe choice for parents who want to reinforce the values already being taught at home.',
  values: [
    'Discipline that carries into school',
    'Respect for instructors, teammates, and others',
    'Confidence built through real progress',
    'Resilience after setbacks and challenges',
    'Emotional self-control under pressure',
    'Healthy habits that last for life',
  ],
} as const

export const STUDENTS = {
  headline: 'What some of RPBJJ Boerne students are saying:',
} as const

export const HOW = {
  headline: 'How to get started?',
  steps: [
    { n: 'Step 1', text: 'Click the button and fill out the form.' },
    { n: 'Step 2', text: 'Choose your class type and pick a date & time on the calendar.' },
    { n: 'Step 3', text: "You'll get email and SMS confirmations with all the details." },
  ],
} as const

export const FIT = {
  headline: 'Is Brazilian Jiu-Jitsu the right fit for your child?',
  intro:
    "If you're looking for an activity that helps your child grow beyond the physical, the answer may be yes.",
  questions: [
    'Do you want your child to become more confident?',
    'Would you like them to develop more discipline and self-control?',
    'Are you looking for an activity that reinforces the values you teach at home?',
    'Do you want your child to learn how to handle challenges with resilience?',
    'Are you looking for a welcoming environment where they can make friends and have fun?',
  ],
  closing:
    'If you answered yes to any of these questions, Brazilian Jiu-Jitsu could be exactly what your family is looking for.',
} as const

export const INSIDE = {
  headline: 'Inside RPBJJ Boerne',
} as const

export const FAQ_ITEMS = [
  {
    q: 'What is RPBJJ Boerne Back to School?',
    a: 'Our Back to School program is the perfect opportunity for families to introduce their children to Brazilian Jiu-Jitsu with a free trial class and experience its benefits firsthand.',
  },
  {
    q: 'What is a trial class?',
    a: 'A trial class allows your child to experience a regular beginner-friendly class, meet the instructors, and see if Jiu-Jitsu is the right fit before enrolling.',
  },
  {
    q: 'Why should my child try a free class?',
    a: "It's a risk-free way to discover how Jiu-Jitsu can help your child build confidence while having fun.",
  },
  {
    q: 'Does my child need any prior experience?',
    a: 'Not at all. Our beginner-friendly classes are designed for children with no previous martial arts experience.',
  },
  {
    q: 'Is Jiu-Jitsu safe for kids?',
    a: "Yes. Children's classes are structured, supervised, and designed to teach techniques safely while respecting each child's age and development.",
  },
  {
    q: 'Will Jiu-Jitsu help my child with bullying?',
    a: 'Jiu-Jitsu helps children better prepare to deal with difficult situations while promoting respect and conflict avoidance.',
  },
  {
    q: 'How soon will I notice changes in my child?',
    a: 'Every child develops at their own pace, but many parents notice improvements after just a few weeks of consistent training.',
  },
] as const

export const FOOTER_COPY =
  'RPBJJ Boerne Back to School is the perfect opportunity to help your child start the new school year with more confidence. Click any button on this page to book a free trial class and experience the benefits of Brazilian Jiu-Jitsu firsthand.'

/** The academy's own bios, from rpbjjboerne.com. */
export const COACHES = {
  story:
    'Both share a story of resilience: they came from Brazil with a dream of conquering the World Championship, but it was not easy. They needed help from many people and Manuel even slept on the mats to save money. That journey made both of them world-class instructors who learned how to pursue any goal with discipline. Now, they want to pass that mindset on to their students, no matter the age or level.',
  people: [
    { name: 'Manuel Ribamar', titles: ['World Champion Masters', 'Black Belt'] },
    { name: 'Nathiely De Jesus', titles: ['World Champion', 'Black Belt'] },
  ],
} as const

/** Real Google reviews already published by the academy. */
export const REVIEWS = [
  {
    name: 'Chance LeStourgeon',
    when: '9 months ago',
    text: 'If you are looking for top-level, international-standard jiu-jitsu, RPBJJ Boerne is the right place. The instructors are incredible and very experienced. If you have children, this is the best academy to bring them to.',
  },
  {
    name: 'Tim Prestidge',
    when: '1 year ago',
    text: 'If you want to start your child of 4 to 5 years in a sport, Brazilian Jiu-Jitsu should be your first option. They even offer classes for parents to join together, it is a true family experience.',
  },
  {
    name: 'Selena Sanchez',
    when: '1 year ago',
    text: 'My husband, our 9-year-old son, and I joined in June and all I can say is we love everyone here! Nathy and Riba are incredible instructors and wonderful people in every way.',
  },
  {
    name: 'Sophia Almeida',
    when: '1 year ago',
    text: 'I moved from Florida specifically to train with Nathy and Riba. This academy is more than a community, it is a family. Teammates genuinely care about each other.',
  },
] as const

export const GALLERY = [
  { src: '/galeria/7.webp', alt: 'Open training on the mats at the RPBJJ Boerne academy' },
  { src: '/galeria/3.webp', alt: 'Two young students in white gis drilling a technique' },
  { src: '/galeria/2.webp', alt: 'Children in blue gis training a position on the mat' },
  { src: '/galeria/4.webp', alt: 'Coach Nathiely De Jesus working with a student on the mat' },
  { src: '/galeria/1.webp', alt: 'Students drilling a guard pass during a class' },
  { src: '/galeria/6.webp', alt: 'The kids class of RPBJJ Boerne together after training' },
] as const
