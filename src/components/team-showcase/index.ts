export { default as TeamShowcase, type TeamMember } from './TeamShowcase';

import componentRaw from './TeamShowcase.tsx?raw';
import demoRaw from './demo.tsx?raw';

export const code: Record<string, string> = {
  'TeamShowcase.tsx': componentRaw,
  'demo.tsx': demoRaw,
};
