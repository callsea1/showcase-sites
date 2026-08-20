import caseStudiesJson from './case-studies.json';
import zonesJson from './zones.json';

export { default as resume } from './resume.json';
export { default as stats } from './stats.json';
export { default as appLauncher } from './app-launcher.json';
export { default as janicaResume } from './janica-resume.json';

export type JanicaContact = {
  phone: string;
  email: string;
};

export type JanicaExperience = {
  id: string;
  role: string;
  org: string;
  location: string;
  period: string;
  highlights: string[];
};

export type JanicaLocation = {
  city: string;
  lat: number;
  lng: number;
  label: string;
};

export type JanicaResume = {
  name: string;
  title: string;
  location: string;
  status: string;
  summary: string;
  contact: JanicaContact;
  experience: JanicaExperience[];
  skills: {
    ai: string[];
    operations: string[];
    admin: string[];
  };
  education: {
    degree: string;
    school: string;
    year: number;
  };
  languages: { name: string; level: string }[];
  locations: JanicaLocation[];
};

export type ZoneScenery = {
  city: string;
  region: string;
  workplace: string;
  skyline: 'chicago' | 'nyc' | 'bend' | 'sf' | 'global';
  colors: [string, string, string];
  image?: string;
};

export type Zone = {
  id: string;
  name: string;
  position: number[];
  title: string;
  body: string;
  tags: string[];
  frameworkIds?: string[];
  scenery?: ZoneScenery;
};

export type CaseStudy = {
  id: string;
  title: string;
  role: string;
  period: string;
  summary: string;
  metrics: string[];
  tech: string[];
  featured?: boolean;
  effort?: boolean;
  image?: string;
};

export type Stat = {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  description: string;
};

export type LeadershipEntry = {
  id: string;
  title: string;
  org: string;
  detail: string;
};

export type TimelineEntry = {
  year: string;
  role: string;
  org: string;
  highlight: string;
};

export type AppLauncherItem = {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
};

export const zones = zonesJson as Zone[];
export const caseStudies = caseStudiesJson as CaseStudy[];
export const featuredCaseStudies = caseStudies.filter((cs) => cs.featured !== false);
export const effortsCaseStudies = caseStudies.filter((cs) => cs.effort === true);
