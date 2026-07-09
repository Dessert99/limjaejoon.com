/** 블로그 목록 검색 조건을 URL query 로 제출하는 서버 친화 form */
import type { PostSearchParams } from '@/entities/post';
import type { PostFilterOption } from '../../model/searchParams';
import * as s from './PostFilterForm.css';

/** PostFilterForm props — options 는 화면 조립 계층이 현재 목록에서 만든다 */
export type PostFilterFormProps = {
  filters?: PostSearchParams;
  categoryOptions?: PostFilterOption[];
  seriesOptions?: PostFilterOption[];
};

const ensureSelectedOption = (
  options: PostFilterOption[],
  value: string | undefined
): PostFilterOption[] => {
  if (!value || options.some((option) => option.value === value)) {
    return options;
  }

  return [{ label: value, value }, ...options];
};

/** URL 을 공유 가능한 검색 상태로 유지하는 post filter form */
export function PostFilterForm({
  filters = {},
  categoryOptions = [],
  seriesOptions = [],
}: PostFilterFormProps) {
  const categories = ensureSelectedOption(categoryOptions, filters.category);
  const series = ensureSelectedOption(seriesOptions, filters.series);

  return (
    <form
      action='/blog'
      aria-label='블로그 글 필터'
      className={s.root}
      method='get'>
      <label className={s.field}>
        <span className={s.label}>검색어</span>
        <input
          className={s.control}
          defaultValue={filters.q ?? ''}
          name='q'
          type='search'
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>카테고리</span>
        <select
          className={s.control}
          defaultValue={filters.category ?? ''}
          name='category'>
          <option value=''>전체</option>
          {categories.map((option) => {
            return (
              <option
                key={option.value}
                value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>
      </label>

      <label className={s.field}>
        <span className={s.label}>시리즈</span>
        <select
          className={s.control}
          defaultValue={filters.series ?? ''}
          name='series'>
          <option value=''>전체</option>
          {series.map((option) => {
            return (
              <option
                key={option.value}
                value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>
      </label>

      <label className={s.field}>
        <span className={s.label}>태그</span>
        <input
          className={s.control}
          defaultValue={filters.tag ?? ''}
          name='tag'
          type='search'
        />
      </label>

      <button
        className={s.submit}
        type='submit'>
        검색
      </button>
    </form>
  );
}
