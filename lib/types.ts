/* The whole site is one document. This is its shape. */

export type Channel = {
  id: number;
  name: string;          // "Web & build"
  word: string;          // the big word on the strip
  sub: string;           // "& build"
  line: string;          // one line under the title
  tags: string[];
  wave: "step" | "grid" | "vu" | "ramp";
  colour: string;        // accent
  panel: string;         // the graphite, tinted
  panel2: string;
  panel3: string;
  ink: string;           // text colour on the accent
  brief: {
    head: string;
    body: string;
    list: string[];
    spec: { label: string; value: string }[];
  };
  hidden?: boolean;
};

export type Tool = { icon: string; name: string; ch: number[]; hidden?: boolean };

export type CaseStudy = {
  problem: string;
  process: { title: string; body: string }[];
  decisions: { title: string; body: string }[];
  outcome: string;
};

/* Context a project carries for the AI: a written brief plus documents —
   a PRD, a spec, a screenshot — that describe what the thing actually is. */
export type ContextDoc = {
  id: string;
  name: string;
  kind: "text" | "image";
  url: string;
  text?: string;      // extracted for documents; images go to Claude as vision
  bytes: number;
  pages?: number;
  truncated?: boolean;
  addedAt: string;
};

export type ProjectContext = { brief: string; docs: ContextDoc[] };

export type Media =
  | { type: "brand" }
  | { type: "still"; stills: string[]; video?: boolean }
  | { type: "canvas"; src: string }
  | { type: "plate"; glyph: string };

export type Project = {
  id: string;
  ch: number[];
  kind: string;
  client: string;
  title: string;
  line: string;
  story: string;
  media: Media;
  shots?: string[];
  brand?: { mark: string; colors: string[]; type?: string; dark?: boolean };
  case?: CaseStudy;
  meta: { label: string; value: string }[];
  link: string;
  linkText: string;
  note?: string;
  slot?: boolean;
  hidden?: boolean;
  context?: ProjectContext;
};

export type Content = {
  version: number;
  updatedAt: string;
  site: {
    name: string;
    role: string;          // rail subtitle
    location: string;      // "Benin City, NG"
    timezone: string;      // IANA zone for the desk clock
    title: string;         // <title>
    description: string;
    standby: string;       // the standby line in the brief
    hint: string;
    context?: ProjectContext;   // background every rewrite gets, site-wide
  };
  channels: Channel[];
  rack: { eyebrow: string; title: string; note: string; tools: Tool[] };
  work: { eyebrow: string; title: string; note: string; projects: Project[] };
  path: { eyebrow: string; title: string; note: string; steps: { name: string; body: string }[] };
  about: { eyebrow: string; title: string; lead: string; body: string[]; facts: { label: string; value: string }[] };
  contact: {
    eyebrow: string; title: string; body: string;
    email: string;
    links: { label: string; href: string }[];
  };
  footer: { left: string; right: string };
};
