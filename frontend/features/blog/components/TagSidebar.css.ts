import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const sidebar = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '0.375rem',
  alignItems: 'center',
  '@media': {
    [bp.md]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '0.25rem',
      position: 'sticky',
      top: '5rem',
    },
  },
});

export const label = style({
  display: 'none',
  fontSize: vars.fontSize.xs,
  fontWeight: 600,
  color: vars.color.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '0.5rem',
  '@media': {
    [bp.md]: {
      display: 'block',
    },
  },
});

export const list = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'contents', // 모바일: 버튼들을 sidebar flex에 직접 흘려보냄
  '@media': {
    [bp.md]: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      width: '100%',
    },
  },
});

export const tagButton = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  backgroundColor: 'transparent',
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.full,
  paddingInline: '0.75rem',
  paddingBlock: '0.3rem',
  cursor: 'pointer',
  transition:
    'color 150ms ease, border-color 150ms ease, background-color 150ms ease',
  whiteSpace: 'nowrap',
  textAlign: 'left',
  ':hover': {
    color: vars.color.textPrimary,
    borderColor: vars.color.lineStrong,
  },
  selectors: {
    '&[data-active="true"]': {
      color: vars.color.accentStrong,
      borderColor: vars.color.accentStrong,
      backgroundColor: vars.color.accentSoft,
    },
  },
  '@media': {
    [bp.md]: {
      width: '100%',
      borderRadius: vars.radius.md,
      border: 'none',
      paddingInline: '0.625rem',
      paddingBlock: '0.375rem',
    },
  },
});
