import evidence from '../evidence.json';

export type FrameworkStep = {
  id: string;
  label: string;
  detail: string;
};

export type Framework = {
  id: string;
  title: string;
  subtitle: string;
  tier: 'framework';
  steps: FrameworkStep[];
  mermaid: string;
};

const disclaimer =
  'Representative framework — based on production patterns; names, topology, and internals altered for confidentiality.';

export const frameworkDisclaimer = disclaimer;

export const frameworks: Framework[] = [
  {
    id: 'mfe-platform',
    title: 'Microfrontend Platform',
    subtitle: disclaimer,
    tier: 'framework',
    steps: [
      { id: 'shell', label: 'Shell App', detail: 'Host routing, auth, design tokens, shared nav' },
      { id: 'remote', label: 'MFE Remotes', detail: 'Module Federation bundles per product area' },
      { id: 'ds', label: 'Design System', detail: 'Atomic UI components consumed by all remotes' },
      { id: 'deploy', label: 'Deploy', detail: 'Helm/Argo → K8s; independent remote releases' }
    ],
    mermaid: `flowchart LR
  User --> Shell[Shell App]
  Shell --> RemoteA[MFE Remote A]
  Shell --> RemoteB[MFE Remote B]
  Shell --> DS[Design System]
  RemoteA --> API[Platform APIs]
  RemoteB --> API
  Shell --> K8s[Kubernetes / Argo]`
  },
  {
    id: 'ai-agent-ops',
    title: 'AI Agent Ops',
    subtitle: disclaimer,
    tier: 'framework',
    steps: [
      { id: 'intake', label: 'Intake', detail: 'Ticket or alert normalized with context' },
      { id: 'plan', label: 'Planner', detail: 'Agent selects tools and retrieval sources' },
      { id: 'act', label: 'Act', detail: 'Tool calls with rate limits and audit log' },
      { id: 'review', label: 'Human Review', detail: 'Engineer approves before production change' }
    ],
    mermaid: `flowchart TD
  Ticket --> Planner
  Planner --> Tools[MCP / APIs]
  Planner --> RAG[Knowledge Base]
  Tools --> Draft[Proposed Fix]
  Draft --> Review{Human Review}
  Review -->|Approved| Deploy
  Review -->|Rejected| Planner`
  },
  {
    id: 'bedrock-rag',
    title: 'Bedrock RAG Pipeline',
    subtitle: disclaimer,
    tier: 'framework',
    steps: [
      { id: 'ingest', label: 'Ingest', detail: 'Documents chunked and embedded' },
      { id: 'store', label: 'Vector Store', detail: 'Similarity search with metadata filters' },
      { id: 'retrieve', label: 'Retrieve', detail: 'Top-k context injected into prompt' },
      { id: 'eval', label: 'Eval Gate', detail: 'Quality threshold before response ships' }
    ],
    mermaid: `flowchart LR
  Docs --> Embed[Embeddings]
  Embed --> VectorDB[(Vector DB)]
  Query --> Retrieve
  VectorDB --> Retrieve
  Retrieve --> Bedrock[Amazon Bedrock]
  Bedrock --> Eval[Eval Gate]
  Eval --> Response`
  },
  {
    id: 'cftc-exchange',
    title: 'Regulated Exchange (Generic)',
    subtitle: disclaimer,
    tier: 'framework',
    steps: [
      { id: 'gateway', label: 'API Gateway', detail: 'Auth, rate limits, WAF' },
      { id: 'matching', label: 'Matching Engine', detail: 'Order book and event markets' },
      { id: 'audit', label: 'Audit Log', detail: 'Immutable compliance trail' },
      { id: 'etl', label: 'ETL', detail: 'Reporting and regulatory exports' }
    ],
    mermaid: `flowchart TD
  Client --> Gateway
  Gateway --> Matching[Matching Engine]
  Matching --> Audit[Audit Log]
  Matching --> ETL[ETL / Reporting]
  Audit --> Compliance[Compliance Boundary]`
  },
  {
    id: 'scale-path',
    title: 'Hypergrowth Scale Path',
    subtitle: disclaimer,
    tier: 'framework',
    steps: [
      { id: 'cdn', label: 'CDN / Edge', detail: 'DDoS protection, caching, rate limiting' },
      { id: 'app', label: 'App Tier', detail: 'Horizontal scale, stateless services' },
      { id: 'cache', label: 'Cache Layer', detail: 'Redis / ElasticSearch for hot paths' },
      { id: 'db', label: 'Data Tier', detail: 'Read replicas, index optimization' }
    ],
    mermaid: `flowchart LR
  Users --> CDN
  CDN --> App[App Tier]
  App --> Cache[Cache]
  App --> DB[(Primary DB)]
  DB --> Replicas[Read Replicas]`
  },
  {
    id: 'deploy-pipeline',
    title: 'CI/CD to Kubernetes',
    subtitle: disclaimer,
    tier: 'framework',
    steps: [
      { id: 'build', label: 'Build', detail: 'GitHub Actions compile and test' },
      { id: 'scan', label: 'Scan', detail: 'Security and quality gates' },
      { id: 'deploy', label: 'Deploy', detail: 'Helm chart to Argo sync' },
      { id: 'rollback', label: 'Rollback', detail: 'Automated smoke test failure → revert' }
    ],
    mermaid: `flowchart LR
  Push --> GHA[GitHub Actions]
  GHA --> Scan[Scan / Test]
  Scan --> Helm[Helm Chart]
  Helm --> Argo[Argo CD]
  Argo --> K8s[Kubernetes]
  K8s --> Smoke[Smoke Tests]`
  },
  {
    id: 'cost-aware-ai',
    title: 'Cost-Aware AI Routing',
    subtitle: disclaimer,
    tier: 'framework',
    steps: [
      { id: 'classify', label: 'Classify', detail: 'Fast model triages request complexity' },
      { id: 'route', label: 'Route', detail: 'Simple → efficient model; complex → premium' },
      { id: 'cache', label: 'Cache', detail: 'System prompt and context reuse' },
      { id: 'meter', label: 'Meter', detail: 'Token and cost tracking per workflow' }
    ],
    mermaid: `flowchart TD
  Request --> Classifier[Fast Classifier]
  Classifier -->|Simple| Fast[Efficient Model]
  Classifier -->|Complex| Premium[Premium Model]
  Fast --> Cache[Prompt Cache]
  Premium --> Cache
  Cache --> Meter[Cost Meter]`
  }
];

export function getFramework(id: string): Framework | undefined {
  return frameworks.find((f) => f.id === id);
}

export { evidence };
