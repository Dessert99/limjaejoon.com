import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

globalStyle('body', {
  minHeight: '100vh',
  backgroundColor: vars.color.bgPage,
  color: vars.color.textPrimary,
});

export const contentWrapper = style({
  paddingTop: '5rem',
});
