/** Label-wrapped field: the label text and input are implicitly associated. */
export default function Field({ label, error, hint, children, className }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-2 block text-sm text-mist">{label}</span>
      {children}
      {hint && !error && <span className="mt-1.5 block text-sm text-steel">{hint}</span>}
      {error && (
        <span role="alert" className="mt-1.5 block text-sm text-danger">
          {error}
        </span>
      )}
    </label>
  );
}
