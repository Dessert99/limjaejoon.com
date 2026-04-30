'use client';
// 폼 한 항목(label + input + error/helper)을 묶는 재사용 가능한 원자 컴포넌트
// react-hook-form `register()` 결과를 그대로 spread할 수 있도록 input 표준 props를 통과시킨다
import { type InputHTMLAttributes, type Ref } from 'react';

import * as s from './FormField.css';

// FormField props — 표준 input 속성 + 우리 커스텀 속성
type FormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  /** input과 label을 연결하는 고유 id */
  id: string;
  /** 화면에 표시할 레이블 텍스트 */
  label: string;
  /** 있을 때만 에러 메시지 렌더, aria-invalid도 true로 전환 */
  error?: string;
  /** input 아래에 표시할 보조 설명 텍스트 (에러 없을 때만) */
  helper?: string;
  /** react-hook-form `register()`가 전달하는 ref — React 19 ref-as-prop */
  ref?: Ref<HTMLInputElement>;
};

export function FormField({
  id,
  label,
  error,
  helper,
  type = 'text',
  required,
  ref,
  ...inputAttrs
}: FormFieldProps) {
  // aria-describedby에 연결할 id들 — 에러 우선, 없으면 helper
  const errorId = error ? `${id}-error` : undefined;
  const helperId = !error && helper ? `${id}-helper` : undefined;
  const describedBy = errorId ?? helperId;

  return (
    <div className={s.fieldWrapper}>
      {/* label — htmlFor로 input과 연결, required 시각 표시(*)는 aria-hidden로 중복 announce 방지 */}
      <label
        htmlFor={id}
        className={s.label}>
        {label}
        {required && (
          <span
            className={s.requiredMark}
            aria-hidden='true'>
            {' '}
            *
          </span>
        )}
      </label>

      {/* input — register()가 spread한 name/onChange/onBlur 등이 inputAttrs로 들어온다 */}
      <input
        id={id}
        type={type}
        ref={ref}
        required={required}
        aria-required={required ? true : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={s.input}
        {...inputAttrs}
      />

      {/* 헬퍼 텍스트 — 에러가 없을 때만 표시 (에러가 우선) */}
      {!error && helper && (
        <p
          id={helperId}
          className={s.helperMessage}>
          {helper}
        </p>
      )}

      {/* 에러 메시지 — role="alert"로 스크린리더가 즉시 읽는다 */}
      {error && (
        <p
          id={errorId}
          role='alert'
          className={s.errorMessage}>
          {error}
        </p>
      )}
    </div>
  );
}
