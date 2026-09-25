export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-lockup${compact ? " compact" : ""}`}>
      <span className="brand-monogram" aria-hidden="true">SR</span>
      <span className="brand-wording">
        <strong>S.R. Klus- &amp; onderhoudswerk</strong>
        {!compact && <small>Fine tile atelier · 06 871 53 33</small>}
      </span>
    </span>
  );
}
