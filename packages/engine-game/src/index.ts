export type GameCollectible = {
  id: string;
  type: 'scroll' | 'shuriken' | 'lantern' | 'eval' | 'observability';
  title: string;
  body: string;
  x: number;
  y: number;
};

export type GameLevel = {
  id: string;
  name: string;
  theme: string;
  collectibles: GameCollectible[];
  width: number;
  height: number;
  accent: string;
  platforms: { x: number; y: number; width: number; height: number }[];
  hazards: { x: number; y: number; width: number; height: number }[];
  enemies: { x: number; y: number; minX: number; maxX: number }[];
  checkpoint: { x: number; y: number };
  exit: { x: number; y: number };
};

export const LEVEL_1: GameLevel = {
  id: 'yc-alley',
  name: 'YC Alley',
  theme: 'Railbird — regulated exchange build',
  width: 40,
  height: 12,
  accent: '#ff4d00',
  platforms: [
    { x: 0, y: 10, width: 40, height: 2 },
    { x: 5, y: 8, width: 4, height: 1 },
    { x: 12, y: 7, width: 5, height: 1 },
    { x: 20, y: 9, width: 4, height: 1 },
    { x: 27, y: 7, width: 5, height: 1 },
    { x: 35, y: 8, width: 5, height: 1 }
  ],
  hazards: [{ x: 9, y: 10, width: 3, height: 2 }, { x: 24, y: 10, width: 3, height: 2 }],
  enemies: [{ x: 15, y: 6.2, minX: 12, maxX: 17 }, { x: 31, y: 6.2, minX: 27, maxX: 34 }],
  checkpoint: { x: 20, y: 8.3 },
  exit: { x: 38, y: 7 },
  collectibles: [
    {
      id: 'railbird-exit',
      type: 'scroll',
      title: 'Railbird YC Exit',
      body: 'Head of Engineering at YC fintech. CFTC demos, SOC2, Kafka/K8s stack — $60M+ acquisition by DraftKings.',
      x: 8,
      y: 6
    },
    {
      id: 'tooling',
      type: 'shuriken',
      title: 'Engineering Standards',
      body: 'Introduced eslint, styling standards, interview process, and hiring pipeline early in startup lifecycle.',
      x: 18,
      y: 4
    },
    {
      id: 'ai-scout',
      type: 'lantern',
      title: 'AI Scout',
      body: 'Frame the real problem before prompting. Constraints and success metrics first.',
      x: 28,
      y: 6
    }
  ]
};

export const LEVEL_2: GameLevel = {
  id: 'cloud-pagoda',
  name: 'Cloud Pagoda',
  theme: 'AWS / K8s migration wins',
  width: 40,
  height: 12,
  accent: '#6c63ff',
  platforms: [
    { x: 0, y: 10, width: 40, height: 2 },
    { x: 4, y: 8, width: 5, height: 1 },
    { x: 11, y: 6, width: 4, height: 1 },
    { x: 18, y: 8, width: 5, height: 1 },
    { x: 25, y: 5, width: 4, height: 1 },
    { x: 32, y: 7, width: 8, height: 1 }
  ],
  hazards: [{ x: 9, y: 10, width: 2, height: 2 }, { x: 23, y: 10, width: 2, height: 2 }],
  enemies: [{ x: 13, y: 5.2, minX: 11, maxX: 15 }, { x: 26, y: 4.2, minX: 25, maxX: 29 }],
  checkpoint: { x: 22, y: 7.3 },
  exit: { x: 37, y: 6 },
  collectibles: [
    {
      id: 'migration',
      type: 'scroll',
      title: '25+ Site Migration',
      body: 'Migrated PHP fullstack sites from legacy hosting to AWS with pipelines, backups, and fault tolerance.',
      x: 10,
      y: 5
    },
    {
      id: 'devops',
      type: 'shuriken',
      title: 'DevOps Overhaul',
      body: 'CodePipeline, CodeBuild, GitHub Actions — RDIFF and DRY paradigms across 100+ pipelines.',
      x: 22,
      y: 7
    }
  ]
};

export const LEVEL_3: GameLevel = {
  id: 'ai-dojo',
  name: 'AI Dojo',
  theme: 'Bedrock, agents, vector DBs',
  width: 40,
  height: 12,
  accent: '#00d9ff',
  platforms: [
    { x: 0, y: 10, width: 40, height: 2 },
    { x: 3, y: 8, width: 5, height: 1 },
    { x: 10, y: 6, width: 4, height: 1 },
    { x: 16, y: 8, width: 4, height: 1 },
    { x: 23, y: 6, width: 5, height: 1 },
    { x: 31, y: 8, width: 5, height: 1 },
    { x: 37, y: 6, width: 3, height: 1 }
  ],
  hazards: [{ x: 8, y: 10, width: 2, height: 2 }, { x: 20, y: 10, width: 3, height: 2 }],
  enemies: [{ x: 12, y: 5.2, minX: 10, maxX: 14 }, { x: 25, y: 5.2, minX: 23, maxX: 28 }, { x: 33, y: 7.2, minX: 31, maxX: 36 }],
  checkpoint: { x: 21, y: 7.3 },
  exit: { x: 38, y: 5 },
  collectibles: [
    {
      id: 'bedrock',
      type: 'scroll',
      title: 'Bedrock Architecture',
      body: 'Vector DB pipelines, generative AI chatbots, and MLOps patterns for financial and enterprise products.',
      x: 12,
      y: 5
    },
    {
      id: 'reviewer',
      type: 'eval',
      title: 'Reviewer Gate',
      body: 'Human-in-the-loop approval before production changes. No unbounded agent autonomy.',
      x: 24,
      y: 6
    },
    {
      id: 'observability',
      type: 'observability',
      title: 'Observability Lantern',
      body: 'Traces, token meters, latency dashboards, and failure alerts for every agent workflow.',
      x: 32,
      y: 4
    }
  ]
};

export const LEVEL_4: GameLevel = {
  id: 'boardroom',
  name: 'Boardroom',
  theme: 'Wex MFE platform + Railbird exit',
  width: 40,
  height: 12,
  accent: '#f4d35e',
  platforms: [
    { x: 0, y: 10, width: 40, height: 2 },
    { x: 5, y: 7, width: 5, height: 1 },
    { x: 14, y: 8, width: 5, height: 1 },
    { x: 22, y: 6, width: 5, height: 1 },
    { x: 30, y: 8, width: 4, height: 1 },
    { x: 36, y: 6, width: 4, height: 1 }
  ],
  hazards: [{ x: 10, y: 10, width: 4, height: 2 }, { x: 27, y: 10, width: 3, height: 2 }],
  enemies: [{ x: 16, y: 7.2, minX: 14, maxX: 19 }, { x: 24, y: 5.2, minX: 22, maxX: 27 }, { x: 32, y: 7.2, minX: 30, maxX: 34 }],
  checkpoint: { x: 25, y: 5.3 },
  exit: { x: 38, y: 5 },
  collectibles: [
    {
      id: 'wex-mfe',
      type: 'scroll',
      title: 'Wex MFE Platform',
      body: 'Company-wide microfrontend platform. Admin portals in under 10 minutes. 300+ Spark demo.',
      x: 14,
      y: 5
    },
    {
      id: 'railbird',
      type: 'lantern',
      title: 'Railbird YC Exit',
      body: 'Head of Engineering at YC fintech. CFTC demos, SOC2, $60M+ exit to DraftKings.',
      x: 28,
      y: 6
    }
  ]
};

export const ALL_LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4];

export type GameUnlock = {
  collectible: GameCollectible;
  levelId: string;
};

export {
  OFFICE_MAP,
  OFFICE_ZONES,
  OFFICE_CONFIG,
  createOfficeEnemies,
  isSolidTile,
  tileAt,
  type OfficeTile,
  type OfficeZoneTrigger,
  type OfficeEnemy
} from './office-adventure';
