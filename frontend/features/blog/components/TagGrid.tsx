import * as s from './TagGrid.css';

interface TagGridProps {
  tags: string[];
  activeTag: string | null;
  onTagSelect: (tag: string) => void;
}

export function TagGrid({ tags, activeTag, onTagSelect }: TagGridProps) {
  return (
    <ul className={s.grid}>
      {tags.map((tag) => (
        <li key={tag}>
          <button
            className={s.card}
            data-active={activeTag === tag}
            onClick={() => onTagSelect(tag)}>
            {tag}
          </button>
        </li>
      ))}
    </ul>
  );
}
