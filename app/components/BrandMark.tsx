export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-mark${compact ? " compact" : ""}`} aria-label="Rafael Menezes Odontologia">
      <span className="brand-monogram" aria-hidden="true">RM</span>
      <span className="brand-wordmark">
        <strong>Rafael Menezes</strong>
        <small>Odontologia</small>
      </span>
    </span>
  );
}
