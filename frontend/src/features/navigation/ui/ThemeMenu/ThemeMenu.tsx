'use client';
// 계절 테마 선택 팝오버 — app bar 액션. 봄·여름·가을·겨울·밤 라디오 메뉴.
import { useEffect, useRef, useState } from 'react';
import { useSeason } from '@/features/navigation/lib/useSeason';
import { Icon } from '@/shared/ui/Icon/Icon';
import { stateLayer } from '@/shared/styles/recipes.css';
import { SEASON_ORDER, seasonMeta } from '@/shared/styles/themes/index.css';
import * as s from './ThemeMenu.css';

export function ThemeMenu() {
  const { season, setSeason } = useSeason();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
    };
  }, [open]);

  return (
    <div
      className={s.root}
      ref={ref}>
      <button
        type='button'
        className={`${s.triggerBtn} ${stateLayer}`}
        aria-label='테마 선택'
        aria-haspopup='true'
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => {
            return !v;
          });
        }}>
        <Icon name={season} />
      </button>

      {open && (
        <div
          className={s.popover}
          role='menu'>
          <p className={s.menuLabel}>테마</p>
          {SEASON_ORDER.map((key) => {
            const checked = key === season;
            return (
              <button
                key={key}
                type='button'
                role='menuitemradio'
                aria-checked={checked}
                className={`${s.item} ${stateLayer}`}
                onClick={() => {
                  setSeason(key);
                  setOpen(false);
                }}>
                <Icon
                  name={key}
                  size={20}
                />
                <span className={s.itemLabel}>{seasonMeta[key].ko}</span>
                {checked && (
                  <Icon
                    name='check'
                    size={18}
                    className={s.checkIcon}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
