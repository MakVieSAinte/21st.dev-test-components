import type { ComponentType } from 'react';

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  alt: string;
}

export interface ComponentEntry {
  id: string;
  name: string;
  description: string;
  component: ComponentType;
  files: Record<string, string>;   // filename → raw code (tsx / css / ts)
  media?: MediaItem[];             // screenshots, demos, videos
}

import HoverBrandLogoDemoComponent from '../components/hover-brand-logo/demo';
import { code as hoverCode } from '../components/hover-brand-logo';

import CountryAccordionDemoComponent from '../components/country-accordion/demo';
import { code as countryCode } from '../components/country-accordion';

import TeamShowcaseDemoComponent from '../components/team-showcase/demo';
import { code as teamCode } from '../components/team-showcase';

// auto-import all files under `src/components/*/media/*` as URLs (Vite)
const mediaModules = import.meta.glob('../components/*/media/*', { eager: true, as: 'url' }) as Record<string, string>;

function mediaItemsFor(componentId: string) {
  const prefix = `../components/${componentId}/media/`;
  return Object.entries(mediaModules)
    .filter(([p]) => p.startsWith(prefix))
    .map(([p, url]) => {
      const filename = p.split('/').pop() || p;
      const ext = filename.split('.').pop()?.toLowerCase() ?? '';
      const type: MediaItem['type'] = ['mp4', 'webm', 'mov'].includes(ext) ? 'video' : 'image';
      const alt = filename.replace(/\.[^/.]+$/, '');
      return { type, url, alt } as MediaItem;
    });
}

export const componentsList: ComponentEntry[] = [
  {
    id: 'hover-brand-logo',
    name: 'Hover Brand Logo',
    description:
      'An interactive horizontal banner that animates the displayed framework name as you hover over its icon. Built with Framer Motion AnimatePresence for smooth slot-machine text transitions, grayscale icons that brighten on focus, and a subtle border reveal — inspired by the Supabase integration showcase.',
    component: HoverBrandLogoDemoComponent,
    files: hoverCode,
    media: mediaItemsFor('hover-brand-logo'),
  },
  {
    id: 'country-accordion',
    name: 'Country Accordion',
    description:
      'A collapsible international money transfer UI that groups countries by region. Each row expands to reveal additional destinations with a fluid height animation powered by Framer Motion. Features flag avatars via flagcdn, a monochromatic design that supports both light and dark mode, and a CTA button with a sliding arrow animation on hover.',
    component: CountryAccordionDemoComponent,
    files: countryCode,
    media: mediaItemsFor('country-accordion'),
  },
  {
    id: 'team-showcase',
    name: 'Team Showcase',
    description:
      'A magazine-style team section featuring a three-column staggered photo grid paired with an interactive member list. Photos default to grayscale; hovering a photo or a name entry simultaneously reveals the portrait in full color and highlights the corresponding name row. Includes social link icons (X, LinkedIn) that animate in on row hover.',
    component: TeamShowcaseDemoComponent,
    files: teamCode,
    media: mediaItemsFor('team-showcase'),
  },
];
