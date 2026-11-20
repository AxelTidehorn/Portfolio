import hero from '../assets/placeholders/hero.jpg';

// Site-wide settings and homepage copy. Edit here, not in components.
export const site = {
  name: 'Axel Tidehorn',
  url: 'https://axeltidehorn.se',
  lang: 'en',
  description:
    'Photography, product design, mechanical engineering, software and experiments by Axel Tidehorn.',
  disciplines: ['Photography', 'Product design', 'Engineering', 'Software'],
  nav: [
    { href: '/photography/', label: 'Photography', code: '01' },
    { href: '/projects/', label: 'Projects', code: '02' },
    { href: '/about/', label: 'About', code: '03' },
  ],
  hero: {
    image: hero,
    alt: 'Placeholder for the homepage hero photograph',
    placeholder: true,
  },
  // PLACEHOLDER copy — replace with your own words.
  intro:
    'Photography first, alongside product design, mechanical engineering, software and experiments in progress.',
  // Leave empty until verified contact details exist; the About page shows a placeholder instead.
  contact: [] as { label: string; href: string }[],
};
