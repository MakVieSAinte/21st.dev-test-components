import type { ComponentType } from 'react';

export interface ComponentEntry {
  id: string;
  name: string;
  description: string;
  component: ComponentType;
  files: Record<string, string>;
}

import HoverBrandLogoDemoComponent from '../components/hover-brand-logo/demo';
import { code as hoverCode } from '../components/hover-brand-logo';

import CountryAccordionDemoComponent from '../components/country-accordion/demo';
import { code as countryCode } from '../components/country-accordion';

import TeamShowcaseDemoComponent from '../components/team-showcase/demo';
import { code as teamCode } from '../components/team-showcase';

export const componentsList: ComponentEntry[] = [
  {
    id: 'hover-brand-logo',
    name: 'Hover Brand Logo',
    description: 'Supabase-inspired hover brand animation',
    component: HoverBrandLogoDemoComponent,
    files: hoverCode,
  },
  {
    id: 'country-accordion',
    name: 'Country Accordion',
    description: 'International transfer with expandable regions',
    component: CountryAccordionDemoComponent,
    files: countryCode,
  },
  {
    id: 'team-showcase',
    name: 'Team Showcase',
    description: 'Staggered photo grid with interactive name list',
    component: TeamShowcaseDemoComponent,
    files: teamCode,
  },
];
