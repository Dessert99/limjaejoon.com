
const HOME_LABEL = 'home';

export function routeLabel(href: string): string {
  return href.split(/[?#]/)[0].split('/')[1] || HOME_LABEL;
}
