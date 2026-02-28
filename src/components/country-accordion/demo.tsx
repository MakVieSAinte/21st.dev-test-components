import { InternationalTransfer, type Region } from './CountryAccordion';

const regions: Region[] = [
  {
    id: 'eu',
    label: 'Europe',
    countries: [
      { code: 'de', name: 'Germany' },
      { code: 'fr', name: 'France' },
      { code: 'gb', name: 'United Kingdom' },
      { code: 'it', name: 'Italy' },
      { code: 'es', name: 'Spain' },
      { code: 'nl', name: 'Netherlands' },
      { code: 'be', name: 'Belgium' },
      { code: 'ch', name: 'Switzerland' },
    ],
  },
  {
    id: 'asia',
    label: 'Asia Pacific',
    countries: [
      { code: 'jp', name: 'Japan' },
      { code: 'cn', name: 'China' },
      { code: 'in', name: 'India' },
      { code: 'sg', name: 'Singapore' },
      { code: 'kr', name: 'South Korea' },
      { code: 'th', name: 'Thailand' },
      { code: 'my', name: 'Malaysia' },
      { code: 'ph', name: 'Philippines' },
    ],
  },
  {
    id: 'americas',
    label: 'Americas',
    countries: [
      { code: 'us', name: 'United States' },
      { code: 'ca', name: 'Canada' },
      { code: 'mx', name: 'Mexico' },
      { code: 'br', name: 'Brazil' },
      { code: 'ar', name: 'Argentina' },
      { code: 'cl', name: 'Chile' },
      { code: 'co', name: 'Colombia' },
      { code: 'pe', name: 'Peru' },
    ],
  },
];

export default function CountryAccordionDemo() {
  return (
    <div className="min-h-screen py-12 px-4">
      <InternationalTransfer
        subtitle="Global Coverage"
        title="International Money Transfer"
        description="Send money to friends and family in over 200 countries and territories. Competitive rates and fast transfers with real-time tracking."
        ctaText="Start Sending"
        regions={regions}
      />
    </div>
  );
}
