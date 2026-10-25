interface Props {
  value: number;
  onChange?: (value: number) => void;
}

/** Shows 1-5 stars for `value`. Read-only unless `onChange` is given, in which case clicking a star sets that rating. */
export default function StarRating({ value, onChange }: Props) {
  return (
    <span className={onChange ? "stars interactive" : "stars"}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= value ? "star filled" : "star"}
          role={onChange ? "button" : undefined}
          aria-label={onChange ? `${n} star${n > 1 ? "s" : ""}` : undefined}
          onClick={onChange ? () => onChange(n) : undefined}
        >
          ★
        </span>
      ))}
    </span>
  );
}
