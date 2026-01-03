import { InternationalTransfer, type Region } from "../components/ui/component";

const REGIONS_DATA: Region[] = [
  {
    id: "europe",
    label: "Europe",
    colorClass: "text-sky-400",
    countries: [
      { code: "fr", name: "France" },
      { code: "es", name: "Spain" },
      { code: "gr", name: "Greece" },
      { code: "it", name: "Italy" },
      { code: "de", name: "Germany" },
      { code: "be", name: "Belgium" },
    ],
  },
  {
    id: "americas",
    label: "Americas",
    colorClass: "text-emerald-400",
    countries: [
      { code: "ca", name: "Canada" },
      { code: "br", name: "Brazil" },
      { code: "mx", name: "Mexico" },
      { code: "ec", name: "Ecuador" },
      { code: "us", name: "USA" },
      { code: "ar", name: "Argentina" },
    ],
  },
  {
    id: "asia",
    label: "Asia Pacific",
    colorClass: "text-orange-400",
    countries: [
      { code: "jp", name: "Japan" },
      { code: "cn", name: "China" },
      { code: "bn", name: "Brunei" },
      { code: "in", name: "India" },
      { code: "sg", name: "Singapore" },
      { code: "kr", name: "South Korea" },
    ],
  },
  {
    id: "africa",
    label: "Africa",
    colorClass: "text-neutral-800",
    countries: [
      { code: "cg", name: "Congo" },
      { code: "gh", name: "Ghana" },
      { code: "ne", name: "Niger" },
      { code: "eg", name: "Egypt" },
      { code: "ke", name: "Kenya" },
      { code: "ng", name: "Nigeria" },
      { code: "za", name: "South Africa" },
    ],
  },
];

export default function Demo() {
  return (
    <div className="min-h-screen bg-white py-20">
      <InternationalTransfer
        description="Sending money internationally is as easy as sending it across town. Whether you're helping family abroad, paying for a subscription, or supporting friends in different countries, our fast, secure international transfers make it effortless."
        ctaText="Send Money"
        regions={REGIONS_DATA}
      />
    </div>
  );
}