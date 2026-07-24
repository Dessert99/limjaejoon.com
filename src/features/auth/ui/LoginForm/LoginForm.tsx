'use client';

/** admin 로그인 폼 — 이메일/비밀번호로 세션을 발급받는다 */
import type { FormEvent } from 'react';
import { useSignIn } from '../../model/useSignIn';
import * as s from './LoginForm.css';

/** 이메일/비밀번호 입력과 제출 UI */
export function LoginForm() {
  const { email, setEmail, password, setPassword, error, pending, submit } =
    useSignIn();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  };

  return (
    <form
      className={s.root}
      onSubmit={onSubmit}>
      <label className={s.field}>
        <span>이메일</span>
        <input
          type='email'
          value={email}
          onChange={(event) => {
            setEmail(event.currentTarget.value);
          }}
        />
      </label>
      <label className={s.field}>
        <span>비밀번호</span>
        <input
          type='password'
          value={password}
          onChange={(event) => {
            setPassword(event.currentTarget.value);
          }}
        />
      </label>
      {error ? <p className={s.error}>{error}</p> : null}
      <button
        type='submit'
        disabled={pending}>
        로그인
      </button>
    </form>
  );
}
