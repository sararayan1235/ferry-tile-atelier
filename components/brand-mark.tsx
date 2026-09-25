import Image from "next/image";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-lockup${compact ? " compact" : ""}`}>
      <span className="brand-logo" aria-hidden="true">
        <Image
          src="/assets/logo-work.png"
          alt="S.R. Klus- en Onderhoudswerk logo — tile craftwork"
          fill
          sizes="48px"
          priority
        />
      </span>
      <span className="brand-wording">
        <strong>S.R. Klus- &amp; onderhoudswerk</strong>
        {!compact && <small>Fine tile atelier · 06 871 53 33</small>}
      </span>
    </span>
  );
}
