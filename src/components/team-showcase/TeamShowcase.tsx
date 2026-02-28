import { useState } from 'react';
import { cn } from '../../lib/utils';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Nathanaël',
    role: 'CO-FOUNDER — DIRECTEUR DE LA PHOTOGRAPHIE',
    image: 'https://i.pravatar.cc/300?img=3',
  },
  {
    id: '2',
    name: 'Maxime',
    role: 'CO-FOUNDER — DIRECTEUR MARKETING',
    image: 'https://i.pravatar.cc/300?img=12',
  },
  {
    id: '3',
    name: 'Elena',
    role: 'DIRECTRICE DE PRODUCTION',
    image: 'https://i.pravatar.cc/300?img=5',
  },
  {
    id: '4',
    name: 'Arthur',
    role: 'CHEF-OPÉRATEUR / COLORISTE DRONE',
    image: 'https://i.pravatar.cc/300?img=15',
  },
  {
    id: '5',
    name: 'Alexandre',
    role: 'CADREUR',
    image: 'https://i.pravatar.cc/300?img=11',
  },
  {
    id: '6',
    name: 'Marie Lou',
    role: 'MAKE-UP ARTISTE',
    image: 'https://i.pravatar.cc/300?img=9',
  },
];

interface TeamShowcaseProps {
  members?: TeamMember[];
}

export default function TeamShowcase({ members = DEFAULT_MEMBERS }: TeamShowcaseProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const col1 = members.filter((_, i) => i % 3 === 0);
  const col2 = members.filter((_, i) => i % 3 === 1);
  const col3 = members.filter((_, i) => i % 3 === 2);

  return (
    <div className="flex flex-col md:flex-row items-start gap-8 md:gap-10 lg:gap-14 select-none w-full max-w-5xl mx-auto py-8 px-4 md:px-6 font-sans">
      {/* ── Left: staggered photo grid ── */}
      <div className="flex gap-2 md:gap-3 flex-shrink-0 overflow-x-auto pb-1 md:pb-0">
        {/* Column 1 — anchored to top */}
        <div className="flex flex-col gap-2 md:gap-3">
          {col1.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] md:w-[155px] md:h-[155px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* Column 2 — offset down, slightly larger */}
        <div className="flex flex-col gap-2 md:gap-3 mt-[48px] sm:mt-[56px] md:mt-[68px]">
          {col2.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="w-[122px] h-[122px] sm:w-[145px] sm:h-[145px] md:w-[172px] md:h-[172px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* Column 3 — small offset */}
        <div className="flex flex-col gap-2 md:gap-3 mt-[22px] sm:mt-[26px] md:mt-[32px]">
          {col3.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="w-[115px] h-[115px] sm:w-[136px] sm:h-[136px] md:w-[162px] md:h-[162px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>
      </div>

      {/* ── Right: member name list ── */}
      <div className="flex flex-col sm:grid sm:grid-cols-2 md:flex md:flex-col gap-4 md:gap-5 pt-0 md:pt-2 flex-1 w-full">
        {members.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            hoveredId={hoveredId}
            onHover={setHoveredId}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Photo card — others stay b&w, no dimming
───────────────────────────────────────── */

function PhotoCard({
  member,
  className,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  className: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;

  return (
    <div
      className={cn('overflow-hidden rounded-xl cursor-pointer flex-shrink-0', className)}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover transition-[filter] duration-500"
        style={{
          filter: isActive ? 'grayscale(0) brightness(1)' : 'grayscale(1) brightness(0.72)',
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Member name row
───────────────────────────────────────── */

function MemberRow({
  member,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;

  return (
    <div
      className={cn(
        'cursor-pointer transition-opacity duration-300',
        isDimmed ? 'opacity-25' : 'opacity-100',
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            'w-4 h-3 rounded-[4px] flex-shrink-0 transition-colors duration-300',
            isActive ? 'bg-foreground' : 'bg-foreground/25',
          )}
        />
        <span
          className={cn(
            'text-base md:text-[18px] font-semibold leading-none tracking-tight transition-colors duration-300',
            isActive ? 'text-foreground' : 'text-foreground/80',
          )}
        >
          {member.name}
        </span>
      </div>
      <p className="mt-1.5 pl-[22px] text-[9px] md:text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {member.role}
      </p>
    </div>
  );
}
