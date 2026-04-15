export type ContactKind = 'github' | 'linkedin' | 'email' | 'phone';

export interface ContactLink {
  kind: ContactKind;
  href: string;
  label: string;
}

export interface Profile {
  name: string;
  role: string;
  taglines: string[];
  contacts: ContactLink[];
}

export interface TimelineItem {
  title: string;
  subtitle?: string;
  period: string;
  description?: string;
  stack?: string[];
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  name: string;
  description: string;
  period: string;
  stack: string[];
  links: ProjectLink[];
}
