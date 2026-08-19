import caseStudiesJson from './case-studies.json';
import zonesJson from './zones.json';

export { default as resume } from './resume.json';
export { default as stats } from './stats.json';

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
  image?: string;
};

export type Stat = {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  description: string;
};

export const zones = zonesJson as Zone[];
export const caseStudies = caseStudiesJson as CaseStudy[];
export const featuredCaseStudies = caseStudies.filter((cs) => cs.featured !== false);
