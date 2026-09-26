/** Logo lockup: the supplied 2×2 tile mark (cropped from /assets/logo-full.png) + "S.R." wordmark. */
export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-lockup">
      <span className="brand-mark" aria-hidden="true" />
      <span>
        <b>S.R.</b>
        {!compact && <small>Fine tile atelier</small>}
      </span>
    </span>
  );
}
