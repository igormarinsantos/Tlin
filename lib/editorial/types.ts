export type ArticleId = `article:${string}`;
export type AuthorId = `author:${string}`;
export type ClusterId = `cluster:${string}`;
export type SourceId = `source:${string}`;
export type CtaId = `cta:${string}`;

export type EditorialStatus = "draft" | "review" | "published" | "archived";
export type SearchIntent = "informational" | "commercial-investigation" | "conversion-support";

export type EditorialApproval = {
  status: "approved";
  approvedBy: AuthorId;
  approvedAt: string;
};

export type EditorialImage = {
  src: string;
  alt: string;
  decorative: boolean;
  caption?: string;
  width?: number;
  height?: number;
  approval?: EditorialApproval;
};

export type ContentBlock =
  | { type: "heading"; level: 2 | 3; id: string; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered?: boolean; items: readonly string[] }
  | { type: "quote"; text: string; attribution?: string }
  | ({ type: "image" } & EditorialImage);

export type EditorialSource = {
  id: SourceId;
  title: string;
  url: string;
  accessedAt: string;
  publisher?: string;
};

export type EditorialInternalLink = {
  href: `/${string}`;
  label: string;
  purpose?: string;
};

export type EditorialCta = {
  id: CtaId;
  label: string;
  href: `/${string}` | `https://${string}`;
};

export type EditorialReview = {
  originalContribution: string;
  factual?: EditorialApproval;
  commercial?: EditorialApproval;
};

export type EditorialAuthor = {
  id: AuthorId;
  name: string;
  role: string;
  profileUrl: `/${string}` | `https://${string}`;
  approved: true;
  bio?: string;
  credentials?: readonly string[];
  image?: {
    src: `/${string}`;
    alt: string;
    approved: true;
  };
};

export type EditorialCluster = {
  id: ClusterId;
  label: string;
  description: string;
  hubPath: `/blog/temas/${string}`;
  intentOwner: `/${string}`;
  allowedIntents: readonly SearchIntent[];
};

type EditorialArticleBase = {
  id: ArticleId;
  slug: string;
  title: string;
  status: EditorialStatus;
  summary?: string;
  authorId?: AuthorId;
  publishedAt?: string;
  modifiedAt?: string;
  readingTimeMinutes?: number;
  intent?: SearchIntent;
  clusterId?: ClusterId;
  blocks: readonly ContentBlock[];
  sources?: readonly EditorialSource[];
  internalLinks?: readonly EditorialInternalLink[];
  cta?: EditorialCta;
  heroImage?: EditorialImage;
  review?: EditorialReview;
  featured?: boolean;
};

export type EditorialPublishedArticle = EditorialArticleBase & {
  status: "published";
  summary: string;
  authorId: AuthorId;
  publishedAt: string;
  modifiedAt: string;
  readingTimeMinutes: number;
  intent: SearchIntent;
  clusterId: ClusterId;
  sources: readonly EditorialSource[];
  internalLinks: readonly EditorialInternalLink[];
  cta: EditorialCta;
  review: EditorialReview & {
    factual: EditorialApproval;
    commercial: EditorialApproval;
  };
};

export type EditorialArticle =
  | EditorialPublishedArticle
  | (EditorialArticleBase & { status: "draft" | "review" | "archived" });
