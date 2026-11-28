import type { Content } from "./types";

/* The content the site ships with. Once you save from /admin this is
   replaced by the document in Blob storage; it stays here as the seed
   and as the fallback if storage is ever unreachable. */
export const SEED: Content = {
  "version": 1,
  "updatedAt": "",
  "site": {
    "name": "Israel Oni",
    "role": "AI-powered websites · products · systems",
    "location": "Remote · worldwide",
    "timezone": "Africa/Lagos",
    "title": "Israel Oni — AI-powered digital solutions for businesses and individuals",
    "description": "Israel Oni builds AI-powered digital solutions for businesses and individuals: websites, product and UI/UX design, and the internal systems behind them. Working with clients anywhere.",
    "standby": "Three ways to work with me. Pick one and the work below follows.",
    "hint": "filter the work",
    "headline": "Building AI-powered digital solutions for businesses and individuals.",
    "intro": "I put AI to work on the hours that were never the craft, so your website, product or internal system arrives in weeks, not months — and still holds up once real people start using it.",
    "cv": {
      "label": "",
      "url": ""
    }
  },
  "channels": [
    {
      "id": 1,
      "name": "Web & build",
      "word": "Web",
      "sub": "& build",
      "line": "AI-powered websites, live in weeks.",
      "tags": [
        "WordPress",
        "AI-assisted",
        "WooCommerce",
        "Next.js"
      ],
      "wave": "step",
      "colour": "#35D6C4",
      "panel": "#101A1B",
      "panel2": "#162426",
      "panel3": "#1D2E30",
      "ink": "#04201D",
      "brief": {
        "head": "AI-built websites, so you stop waiting on a build.",
        "body": "Most businesses don't need a bespoke codebase. They need the site live, working and editable by their own team — this quarter, not next. I build on WordPress or Next.js and put AI to work on the code, the content and the repetitive hours, which is how a real site lands in weeks instead of months. Where it helps, the site gets AI of its own: an assistant that answers customers, or search that understands what people mean.",
        "list": [
          "Marketing sites and landing pages",
          "WooCommerce storefronts",
          "Next.js when a CMS would fight you",
          "AI chat assistants and smart search",
          "AI-drafted content, edited by a human",
          "Hosting, domains and handover"
        ],
        "spec": [
          {
            "label": "Starts with",
            "value": "What the site has to do, and who it has to convince"
          },
          {
            "label": "You get",
            "value": "The live site, the accounts, and a walkthrough"
          },
          {
            "label": "Good fit",
            "value": "Businesses and individuals who need it live, not perfect"
          },
          {
            "label": "Also",
            "value": "Taking over a half-finished build"
          }
        ]
      }
    },
    {
      "id": 2,
      "name": "Product & UI/UX",
      "word": "Product",
      "sub": "& UI/UX",
      "line": "Products designed with AI, before anyone builds them.",
      "tags": [
        "Figma",
        "User flows",
        "Design systems",
        "AI prototyping"
      ],
      "wave": "grid",
      "colour": "#A98BFF",
      "panel": "#15121D",
      "panel2": "#1E1A2B",
      "panel3": "#272138",
      "ink": "#150A2A",
      "brief": {
        "head": "Design it with AI before you build it.",
        "body": "The expensive mistakes in software are made before a line of code exists — in the flow nobody mapped, the state nobody drew. I work those out in Figma first, using AI to sort the research, explore layouts and turn sketches into clickable prototypes in days, so you can test the idea while changing your mind still costs an afternoon. If your product has AI features, I design how they behave too: what they say, what they do when they're unsure, and how people correct them.",
        "list": [
          "User flows and journeys",
          "Wireframes through to high fidelity",
          "AI-assisted research and rapid prototypes",
          "Designing AI features people trust",
          "Design systems and developer handoff",
          "A design review of what you already have"
        ],
        "spec": [
          {
            "label": "Starts with",
            "value": "The job your user is trying to finish"
          },
          {
            "label": "You get",
            "value": "The Figma file, a prototype, and handoff notes"
          },
          {
            "label": "Good fit",
            "value": "Teams about to build something they haven't drawn"
          },
          {
            "label": "Also",
            "value": "A second opinion on a product that isn't landing"
          }
        ]
      }
    },
    {
      "id": 3,
      "name": "Video & motion",
      "word": "Video",
      "sub": "& motion",
      "line": "Footage in. AI does the grunt work. A story comes out.",
      "tags": [
        "Editing",
        "Short-form",
        "Motion graphics",
        "AI-assisted edit"
      ],
      "wave": "vu",
      "colour": "#FF5A36",
      "panel": "#1A1210",
      "panel2": "#241816",
      "panel3": "#2E1F1B",
      "ink": "#240A03",
      "brief": {
        "head": "AI does the grunt work. The cut is still where the story happens.",
        "body": "Editing, pacing, sound and motion. AI now handles the hours nobody misses — transcripts, captions, first assemblies, noise clean-up, finding the best moments in a long recording — so the time goes into the decisions that keep people watching. Short-form built for the scroll, long-form series that hold their shape week after week, and titles and motion that match the rest of your identity. Send me the raw files and what the video is for.",
        "list": [
          "Video editing, long and short",
          "Reels and short-form for social",
          "AI captions, transcripts and clip-finding",
          "Motion graphics and animated titles",
          "Event, outreach and highlight films",
          "Podcast cuts and clip packages"
        ],
        "spec": [
          {
            "label": "Starts with",
            "value": "Your raw footage, and what the video is for"
          },
          {
            "label": "You get",
            "value": "The master, platform exports, and project files"
          },
          {
            "label": "Good fit",
            "value": "Brands, foundations, shows and anyone posting weekly"
          },
          {
            "label": "Also",
            "value": "Recutting something you already have"
          }
        ]
      },
      "hidden": true
    },
    {
      "id": 4,
      "name": "Solutions",
      "word": "Solutions",
      "sub": "& systems",
      "line": "Broken processes, rebuilt with AI and automation.",
      "tags": [
        "Internal tools",
        "Integrations",
        "AI automation",
        "APIs"
      ],
      "wave": "ramp",
      "colour": "#F5B93F",
      "panel": "#191509",
      "panel2": "#231D10",
      "panel3": "#2D2616",
      "ink": "#241802",
      "brief": {
        "head": "Your process, automated — with AI where it earns its place.",
        "body": "Records kept in three places that disagree. A report someone rebuilds by hand every Monday. Documents someone retypes into a spreadsheet. I map what's actually happening, scope the fix in writing, then build the tool, integration or automation that removes the problem — with AI reading documents, drafting replies and summarising the noise where it genuinely helps, and solid engineering everywhere else.",
        "list": [
          "Discovery and honest scoping",
          "AI automations and assistants for your team",
          "Internal tools and dashboards",
          "AI document reading and data extraction",
          "REST APIs and integrations",
          "Management systems"
        ],
        "spec": [
          {
            "label": "Starts with",
            "value": "A walk through the process that isn't working"
          },
          {
            "label": "You get",
            "value": "The working tool, documentation, and training"
          },
          {
            "label": "Good fit",
            "value": "Teams whose process has outgrown its spreadsheets"
          },
          {
            "label": "Also",
            "value": "A second opinion before you commit budget"
          }
        ]
      }
    }
  ],
  "rack": {
    "eyebrow": "Toolkit",
    "title": "The AI and tools behind the work",
    "note": "AI handles the repetitive hours. These handle the rest.",
    "tools": [
      {
        "icon": "figma",
        "name": "Figma",
        "ch": [
          2,
          1
        ]
      },
      {
        "icon": "canva",
        "name": "Canva",
        "ch": [
          2,
          3
        ]
      },
      {
        "icon": "davinciresolve",
        "name": "DaVinci Resolve",
        "ch": [
          3
        ]
      },
      {
        "icon": "capcut",
        "name": "CapCut",
        "ch": [
          3
        ]
      },
      {
        "icon": "wordpress",
        "name": "WordPress",
        "ch": [
          1
        ]
      },
      {
        "icon": "openai",
        "name": "ChatGPT",
        "ch": [
          1,
          2,
          3,
          4
        ]
      },
      {
        "icon": "claude",
        "name": "Claude",
        "ch": [
          1,
          2,
          3,
          4
        ]
      },
      {
        "icon": "git",
        "name": "Git",
        "ch": [
          1,
          4
        ]
      },
      {
        "icon": "github",
        "name": "GitHub",
        "ch": [
          1,
          4
        ]
      },
      {
        "icon": "miro",
        "name": "Miro",
        "ch": [
          2,
          4
        ]
      },
      {
        "icon": "jira",
        "name": "Jira",
        "ch": [
          4
        ]
      },
      {
        "icon": "clickup",
        "name": "ClickUp",
        "ch": [
          4
        ]
      }
    ]
  },
  "work": {
    "eyebrow": "Selected work",
    "title": "Solutions already at work",
    "note": "Sites, products and systems, built with AI and shipped for real clients.",
    "projects": [
      {
        "id": "elevatedhere",
        "ch": [
          2,
          1
        ],
        "kind": "Platform · Product design + website",
        "client": "ElevatedHere",
        "title": "ElevatedHere",
        "status": "In progress",
        "line": "Wellbeing support for anyone, paid for by whoever is paying.",
        "story": "ElevatedHere is an AI-powered, multi-language, multi-currency social impact and wellness platform for Africa. It brings certified professionals across seven dimensions of wellbeing into one place, from mental health and legal support to career, money and physical health, for individuals, employers, governments and NGOs. I'm designing the product and building the marketing site with AI. It's still in progress.",
        "media": {
          "type": "still",
          "stills": [
            "eh-home",
            "eh-partners",
            "eh-providers",
            "eh-pricing"
          ]
        },
        "shots": [
          "eh-home",
          "eh-partners",
          "eh-providers",
          "eh-pricing"
        ],
        "meta": [
          {
            "label": "Status",
            "value": "In progress"
          },
          {
            "label": "Role",
            "value": "Product design · website built with AI"
          },
          {
            "label": "Scope",
            "value": "153 product screens, mapped by role"
          },
          {
            "label": "Stack",
            "value": "HTML · CSS · JavaScript, no build step"
          }
        ],
        "link": "https://clepbo.github.io/ElevatedHere/index.html",
        "linkText": "See the site so far",
        "note": "Pricing figures and testimonials on the site are still placeholders while the product is being designed.",
        "brand": {
          "mark": "elevatedhere.png",
          "colors": [
            "#098E2D",
            "#04250F",
            "#17181C"
          ],
          "type": "Inter"
        },
        "case": {
          "problem": "Expert help has always been rationed by cost, distance and stigma. Putting professionals in one place is the easy part. The hard part is money and privacy: one session might be paid for by the person, their employer, a programme or an insurer, and whoever pays must never see what was said.",
          "process": [
            {
              "title": "Map every screen by role",
              "body": "Before high fidelity, every screen in the partner-organisation workspace was listed by role, with its empty, no-results and failed states. That came to 153 screens."
            },
            {
              "title": "Design the money first",
              "body": "Wallets, budget pools, seats, approvals and invoices were worked out on screen, including how they reconcile, because the earlier design implied two different totals."
            },
            {
              "title": "Build the marketing site with AI",
              "body": "Six pages in plain HTML, CSS and JavaScript with no build step. Animations are tied to scroll position, so scrolling back up reverses them, and the layout was checked from a 400px phone to a 2,500px screen."
            }
          ],
          "decisions": [
            {
              "title": "Private data is absent, not locked",
              "body": "Data that is always private is simply not on the screen. A greyed-out, locked row tells people the data exists and invites pressure to unlock it."
            },
            {
              "title": "Changing currency never converts money silently",
              "body": "A second balance opens and both stay spendable. Converting is a separate, explicit action with the rate and time stamped on the transaction."
            },
            {
              "title": "Small groups stay anonymous",
              "body": "Reports hide any group smaller than five people, and exports apply that rule before the file is made, not after."
            },
            {
              "title": "Losses show in red",
              "body": "Retention down two points is shown as a drop. A dashboard where every arrow is green doesn't get believed."
            }
          ],
          "outcome": "In progress. The marketing site is up on GitHub Pages and the product design is ongoing."
        }
      },
      {
        "id": "eventplanna",
        "ch": [
          1,
          2
        ],
        "kind": "Website · Product design",
        "client": "EventPlanna",
        "title": "EventPlanna",
        "line": "An events marketplace. I designed the product and built the site with AI.",
        "story": "EventPlanna is a Nigerian marketplace and workspace for events: clients find planners, planners find vendors, and budgets, bookings, tasks and payments live in one place both sides can see. I designed the product's UI/UX in Figma, dashboard included, then built the marketing site entirely with AI.",
        "media": {
          "type": "still",
          "stills": [
            "ep-home",
            "ep-work",
            "ep-market"
          ]
        },
        "shots": [
          "ep-home",
          "ep-work",
          "ep-market"
        ],
        "meta": [
          {
            "label": "Role",
            "value": "Product UI/UX · website built with AI"
          },
          {
            "label": "Stack",
            "value": "HTML · CSS · JavaScript, no build step"
          },
          {
            "label": "Images",
            "value": "55 MB of photos → about 1 MB of WebP"
          },
          {
            "label": "Status",
            "value": "Live"
          }
        ],
        "link": "https://eventplanna.com/",
        "linkText": "Visit eventplanna.com",
        "note": "The product's Figma file is in this repository: Projects/EventPlanna.fig.",
        "brand": {
          "mark": "eventplanna.svg",
          "colors": [
            "#7858F8",
            "#5848E8",
            "#182838"
          ],
          "type": "Inter"
        },
        "case": {
          "problem": "The site had to speak to three readers who want opposite things from the same product: someone planning their own event, a professional planner, and a vendor. And it couldn't promise anything the product doesn't actually do.",
          "process": [
            {
              "title": "Design the product first",
              "body": "I designed EventPlanna's UI/UX in Figma: the dashboard, bookings, budgets, tasks and the shared workspace clients and planners both see."
            },
            {
              "title": "Decide who the home page is for",
              "body": "The home page is written for the client, who arrives cold. Planners and vendors arrive knowing what they came for, so they get a door each, one click away, and a page of their own."
            },
            {
              "title": "Build the whole site with AI",
              "body": "Plain HTML, CSS and JavaScript, with no framework and no build step. Every brand colour lives in one token block, and a small scroll engine runs the motion and switches off for anyone who prefers reduced motion."
            },
            {
              "title": "Script the photography",
              "body": "One script either generates each photo from its prompt with Gemini's image models or imports a supplied one, then crops it to the slot's measured size and writes WebP. 55 MB of photos became about 1 MB."
            },
            {
              "title": "Check every claim",
              "body": "Credit costs, pack prices, booking states and the verification checks come from the product itself. Anything illustrative, like the booking funnel and the testimonials, says so on the page."
            }
          ],
          "decisions": [
            {
              "title": "Product mock-ups in markup, not screenshots",
              "body": "The budget card, the pipeline and the brief are built in HTML. They stay sharp at any width and restyle with the brand tokens, where a screenshot of a dashboard goes stale and blurs."
            },
            {
              "title": "Every figure has to add up",
              "body": "The first pass of vendor counts per category summed to 2,702 against a 2,400+ headline on the same page. They were redone to sum to 2,460. Numbers that disagree cost more trust than they win."
            },
            {
              "title": "Cut a detail that wasn't true",
              "body": "An early draft said vendors are paid fortnightly. That isn't a real policy, so it went. The page now says funds are released once delivery is confirmed, which is what escrow actually implies."
            }
          ],
          "outcome": "Live at eventplanna.com. One person took EventPlanna from product design in Figma to a shipped marketing site, with AI doing the build."
        }
      },
      {
        "id": "esg-horizon",
        "ch": [
          2,
          1
        ],
        "kind": "Product design · Website",
        "client": "ESG Horizon",
        "title": "ESG Horizon",
        "line": "IFRS-ready ESG reporting for Africa. I designed the product and lead its site with AI.",
        "story": "ESG Horizon is an ESG reporting platform for Nigeria and Africa: it collects sustainability data, calculates greenhouse gas emissions across Scope 1, 2 and 3, and prepares IFRS S1 and S2 aligned, audit-ready reports. I designed the product end to end in Figma — flows, states, components and the dead ends you only find by drawing them. On the marketing site at esghorizon.africa, I lead the AI-assisted work: the demo landing page, the SEO pages, analytics, the Teasoo Apps page and the blog.",
        "media": {
          "type": "still",
          "stills": [
            "esgw-home",
            "esg-assessment",
            "esg-emissions",
            "esgw-problem",
            "esgw-seo",
            "esgw-blog"
          ]
        },
        "meta": [
          {
            "label": "Role",
            "value": "Product design · AI-assisted website work"
          },
          {
            "label": "Product",
            "value": "Figma, canvas of 62,181 × 70,853 px"
          },
          {
            "label": "Website",
            "value": "Next.js, Tailwind CSS, TypeScript"
          },
          {
            "label": "Live",
            "value": "esghorizon.africa"
          }
        ],
        "link": "https://esghorizon.africa/",
        "linkText": "Visit esghorizon.africa",
        "shots": [
          "esgw-home",
          "esg-assessment",
          "esg-emissions",
          "esg-horizon-canvas",
          "esgw-problem",
          "esgw-features",
          "esgw-seo",
          "esgw-demo",
          "esgw-apps",
          "esgw-blog"
        ],
        "brand": {
          "mark": "esghorizon",
          "dark": true,
          "colors": [
            "#109b95",
            "#f9b233",
            "#3d9f56",
            "#b9cdc7"
          ],
          "type": "Poppins"
        },
        "case": {
          "problem": "ESG reporting spans five domains that share nothing. Emissions are measured in tonnes of CO₂e, community risk in incident counts, safety in injuries per 200,000 hours, business model exposure in naira at risk, governance in audit compliance. An executive needs to compare all five in one glance. A specialist needs to go all the way down into any one of them. Most ESG tools serve one of those two people and lose the other.",
          "process": [
            {
              "title": "Fix the five pillars",
              "body": "Environmental, Social Capital, Human Capital, Business Model, Leadership & Governance — the reporting frame the industry already uses, so the product doesn't invent a vocabulary its users have to learn."
            },
            {
              "title": "Find the one number per pillar",
              "body": "For each domain, worked out the single figure an executive would actually act on, and demoted everything else to the drill-down."
            },
            {
              "title": "Design the card that holds all three parts",
              "body": "A metric, a direction, and a sentence in plain English. That component repeats five times and became the spine of the whole product."
            },
            {
              "title": "Build the drill-down behind each card",
              "body": "Each pillar opens into its own dashboard — for emissions, that's Scope 1, 2 and 3 broken out by year against the 2030 target."
            },
            {
              "title": "Systemise across the canvas",
              "body": "Components, states and variants pushed out until the file covers the full flow rather than a handful of hero screens."
            },
            {
              "title": "Take the product to market, with AI",
              "body": "On the marketing site, I used AI to ship the campaign landing page, the SEO pages, analytics, the Teasoo Apps page and the blog — each change reviewed and merged as its own pull request."
            }
          ],
          "decisions": [
            {
              "title": "One headline metric per pillar, never two",
              "body": "Comparability beats completeness on a summary screen. The moment a card carries two numbers, the five pillars stop being scannable as a set."
            },
            {
              "title": "A delta chip beside every metric",
              "body": "Direction reads faster than magnitude. “↓ 10%” tells an executive whether to worry before they have parsed “0.45 per 200k hrs”."
            },
            {
              "title": "A plain sentence under every number",
              "body": "“Safety performance improved by 10% YoY. Zero fatalities recorded.” A number with no read is a number nobody acts on — and ESG numbers are unreadable without domain knowledge."
            },
            {
              "title": "Colour-coded rule per pillar, carried down",
              "body": "Each pillar owns a colour on its card's top edge, and that colour follows you into the drill-down, so you always know which domain you are standing in."
            },
            {
              "title": "Teal for progress, amber for attention",
              "body": "The brand teal is reserved for targets and achievement states, amber for things that need a look. Neither is ever used as decoration, so colour keeps meaning something."
            },
            {
              "title": "Risk stated as words, not just scores",
              "body": "“High Risk in 2 Regions” instead of a 7.8. A score hides its own reasoning; the phrase carries it."
            }
          ],
          "outcome": "A component set and a full flow across a canvas roughly 62,000 by 71,000 pixels — the summary an executive reads in ten seconds sitting on top of the depth a specialist needs. The product now has a live marketing site at esghorizon.africa, with pages built to be found and a page built to book demos.",
          "features": [
            {
              "title": "A demo landing page for campaigns",
              "body": "The contact page became a landing page built to book demos: what a visitor gets (an IFRS S1 and S2 gap assessment), what happens after they submit, and a short form. The site's navigation and footer stay on it, so it never feels like a dead end.",
              "shot": "esgw-demo"
            },
            {
              "title": "Six SEO landing pages",
              "body": "A first SEO pass rewrote the main pages and added six landing pages for what people actually search: ESG reporting in Nigeria, ESG reporting software, ESG data management, GHG accounting software, IFRS S1 compliance and IFRS S2 reporting.",
              "shot": "esgw-seo"
            },
            {
              "title": "A simpler hero",
              "body": "The home page hero was cut down to a headline, a line of copy and one action: Book a Demo.",
              "shot": "esgw-home"
            },
            {
              "title": "The ESG Horizon blog",
              "body": "A blog at esghorizon.africa/blog for practical writing on ESG reporting, IFRS S1 and S2, carbon accounting and regulation in Nigeria and across Africa, with search. It's linked from the navigation and footer, and the first articles are on their way.",
              "shot": "esgw-blog"
            },
            {
              "title": "Teasoo Apps",
              "body": "A page for the software Teasoo Consulting builds and runs, with a picture of every product and ESG Horizon featured at the top.",
              "shot": "esgw-apps"
            },
            {
              "title": "Analytics on every page",
              "body": "Google Tag Manager and GA4 tags on every page, so campaign traffic and demo requests can be measured."
            }
          ]
        },
        "note": "The product's Figma file is in this repository: Projects/ESG Horizon.fig. The website was first built by the Teasoo team; the work listed under What it does is mine."
      },
      {
        "id": "shop-timart",
        "ch": [
          1,
          2
        ],
        "kind": "E-commerce · Web",
        "client": "Shop Timart",
        "title": "Shop Timart",
        "line": "A fashion store where you see it on your size first.",
        "story": "Shop Timart is a Benin City fashion brand that sells modest corporate wear and styles clients for work, seminars and big days. Until now it sold through TikTok, Instagram and WhatsApp messages. I designed and built its online store: a catalogue every piece can be previewed on across six body types and every colour, a checkout that takes Naira payments, a QR discount for the walk-in store, sales she can run on one piece or the whole shop, and an admin the owner runs herself, from new stock to the words on the homepage.",
        "media": {
          "type": "brand"
        },
        "shots": [
          "stm-home",
          "stm-lookbook",
          "stm-product",
          "stm-fit",
          "stm-shop",
          "stm-checkout",
          "stm-onsale",
          "stm-sales",
          "stm-cms",
          "stm-care",
          "stm-details",
          "stm-coupons",
          "stm-orders"
        ],
        "brand": {
          "mark": "shoptimart.svg",
          "colors": [
            "#6b4a35",
            "#a67b5b",
            "#e6d8c3",
            "#2e1f17"
          ],
          "type": "Alyamama · IBM Plex Sans Arabic"
        },
        "meta": [
          {
            "label": "Role",
            "value": "Product, design + build"
          },
          {
            "label": "Frontend",
            "value": "Next.js 16 · React 19 · Tailwind CSS 4"
          },
          {
            "label": "Data",
            "value": "Neon Postgres · Vercel Blob"
          },
          {
            "label": "Payments",
            "value": "Paystack (NGN)"
          }
        ],
        "link": "https://shop-timart.com",
        "linkText": "Visit Shop Timart",
        "note": "The screens show demo data: made-up customers and orders, not the store's records. The founder's portrait, lookbook photos and packaging mockups were supplied by the client.",
        "case": {
          "problem": "The owner sells and styles from a walk-in store in Benin City, and everything else happened in DMs: a TikTok video, a price in the caption, a WhatsApp message to order. Customers outside the city had to guess how a blazer cut for a size 8 model would sit on a size 16. Every new piece meant another round of photos and another thread of questions about fit, colour and price.",
          "features": [
            {
              "title": "See it on your size",
              "body": "Every piece can be previewed on six women's and four men's body profiles, from petite to plus, in every colour it comes in. Shoppers pick the body closest to theirs, compare all sizes side by side, choose a skin tone, and get a suggested size before they add to bag.",
              "shot": "stmf-fit"
            },
            {
              "title": "One photo in, every size out",
              "body": "The owner adds a product with one photo, a garment type, sizes and colours. A live preview shows it across every body profile before she publishes. A pipeline for AI try-on photos is built in, ready to switch on when there's budget for it.",
              "shot": "stmf-upload"
            },
            {
              "title": "A QR code that gives 5% off",
              "body": "A branded QR card for the store links to the shop with a discount code. Scanning it saves the code in the browser and applies it at checkout. The owner can create her own codes too: percentage or naira, a minimum order, a usage limit, an expiry date and once per customer. The PNG and SVG she downloads for print are drawn on the server from the same artwork as the card in the admin, monogram in the middle and the code underneath.",
              "shot": "stmf-qr"
            },
            {
              "title": "The discount is checked twice",
              "body": "The checkout shows the discount as soon as the code is applied. When the order is placed, the server prices the bag again from the catalogue and re-checks the code against the customer's phone number, so a code shared around can't be used twice by the same person.",
              "shot": "stmf-discount"
            },
            {
              "title": "Pay in Naira, or confirm on WhatsApp",
              "body": "With Paystack connected, customers pay by card, bank transfer or USSD, and an order is only marked paid when Paystack confirms the exact amount. Without it, checkout records the order and hands off to WhatsApp, the way the store already worked. Either way the customer gets a receipt that prints onto the screen.",
              "shot": "stmf-receipt"
            },
            {
              "title": "Sales on a piece, a category or the whole store",
              "body": "The owner starts a sale on selected products, a category such as Corporate, a collection such as New arrivals, or everything. It can be a percentage or a naira amount, run between two dates or until she pauses it. A single product can also go on sale from its own edit page. Shoppers see the old price crossed out, a discount badge and an On sale filter in the shop.",
              "shot": "stmf-sale"
            },
            {
              "title": "Edit the site with a live preview",
              "body": "Site content works like a small CMS. The owner picks a section, edits its words and images, and the real page reloads beside the form, scrolled to that section, on desktop or a phone frame. Changes save as a draft only she can see until she presses Publish. Discard throws the draft away, and any field can go back to its original wording.",
              "shot": "stmf-cms"
            },
            {
              "title": "How to care for it",
              "body": "Every product carries its care instructions and links to the matching section of a care guide for suits, satin, knits, everyday fabrics and bags. The owner can write care lines per piece or let the guide choose by garment type.",
              "shot": "stmf-care-panel"
            },
            {
              "title": "A wardrobe that moves",
              "body": "The footer is a rail of hanging garments that glides past, with bags, dress forms and a mirror moving more slowly in front. It pauses on hover. Elsewhere, headlines reveal word by word and outfits sway like they're on a hanger.",
              "shot": "stmf-wardrobe"
            },
            {
              "title": "The brand's own photography",
              "body": "When the brand's lookbook photos and packaging mockups arrived, they went in as content the owner controls. The hero shows a lookbook poster with the store's three promises floating beside it, a lookbook section pairs editorial photos with a shop link, and the About page shows the monogram on tags, ribbon, gift cards and bags. The hero takes a framed photo or a transparent cut-out, so the founder's portrait can come back with one setting.",
              "shot": "stmf-hero"
            }
          ],
          "process": [
            {
              "title": "Start from how she already sells",
              "body": "Her TikTok captions, store address, prices and sizes became the first catalogue, and WhatsApp stayed a first-class way to order, not a fallback hidden in the footer."
            },
            {
              "title": "Draw the clothes instead of waiting for photos",
              "body": "There was no budget for a photoshoot across sizes. A parametric figure redraws each garment template on any body profile and in any colour, so every product has a fit preview the moment it's saved."
            },
            {
              "title": "Build the money path on the server",
              "body": "Prices, discounts and delivery fees are worked out on the server from the catalogue, never taken from the browser. Paystack is verified on return and again by a signed webhook."
            },
            {
              "title": "Hand the keys to the owner",
              "body": "Products, orders, styling requests, sales, discount codes, the QR card and the site's own copy all live in one password-protected admin, so day-to-day changes don't need a developer. Every form has a way back, unsaved changes ask before they're lost, deletes ask twice, and the sidebar folds down to icons to give the preview more room."
            },
            {
              "title": "Apply the brand once it arrived",
              "body": "When the brand guidelines landed, the monogram and pattern were lifted from the PDF as vectors, and the palette and typefaces went in as design tokens, so the whole site changed in one pass."
            }
          ],
          "decisions": [
            {
              "title": "Illustrated previews before AI photos",
              "body": "AI try-on services cost money per image and some aren't licensed for commercial use. Illustrations cost nothing, show proportion and colour honestly, and are labelled as illustrations. Photos can replace them product by product later."
            },
            {
              "title": "The QR code carries a code, not a secret link",
              "body": "The discount lives in an ordinary code the server checks, so the owner can pause it or change the offer without reprinting a single card."
            },
            {
              "title": "Once per customer, by phone number",
              "body": "Customers don't make accounts. Their phone number is what the store already uses to reach them on WhatsApp, so it's the natural way to stop the same person reusing a code."
            },
            {
              "title": "Edit fields, not a page builder",
              "body": "The owner changes words and pictures in named fields for each section. She can't break the layout, and anything she hasn't touched keeps its original wording. The preview is the real page rendered with her draft, not a mock-up, so what she sees is what goes live."
            },
            {
              "title": "The biggest discount wins",
              "body": "When a product is in more than one sale, the shopper gets the largest saving, not a sum of all of them. Sale prices are worked out on the server for every page and again when the order is placed, so the price in the bag is the price charged."
            }
          ],
          "outcome": "A complete online store for Shop Timart: a catalogue with a fit preview on every product, Naira checkout with Paystack or WhatsApp, a 5% QR discount for the walk-in store, sales by product, category, collection or store, a care guide, and an admin where the owner runs products, orders, discounts and the site's copy herself, with a live preview before anything goes public."
        }
      },
      {
        "id": "tms",
        "ch": [
          4,
          2
        ],
        "kind": "Management system · Android + web",
        "client": "Teasoo Consulting",
        "title": "Tree Management System",
        "line": "Every tree planted, found again.",
        "story": "A reforestation programme plants thousands of trees across sites where phones have no signal. TMS gives every tree an ID, a place and a history. Field officers record each tree on an Android app that works fully offline. Managers, executives and the programme's sponsor follow the same data on the web as soon as a phone finds a connection. I designed and built the whole system, from the database to the app in an officer's hand, and kept shipping it while it was in use in the field.",
        "media": {
          "type": "still",
          "stills": [
            "tms-dashboard"
          ]
        },
        "meta": [
          {
            "label": "Role",
            "value": "Product, design + build"
          },
          {
            "label": "Field app",
            "value": "Android · Kotlin · Jetpack Compose · Room"
          },
          {
            "label": "Portal",
            "value": "React · Vite"
          },
          {
            "label": "Backend",
            "value": "NestJS · PostgreSQL + PostGIS"
          },
          {
            "label": "Status",
            "value": "In the field · Android 1.0.21"
          }
        ],
        "link": "https://tms.teasooconsulting.com/",
        "linkText": "Visit TMS",
        "shots": [
          "tms-landing",
          "tms-dashboard",
          "tms-trees",
          "tms-tree",
          "tms-areas",
          "tms-activity",
          "tms-field-activity",
          "tms-features"
        ],
        "brand": {
          "mark": "tms.svg",
          "colors": [
            "#1d6b45",
            "#e3f0e8",
            "#f5f5f2",
            "#0b0b0b"
          ],
          "type": "Inter"
        },
        "note": "The screens show demo data, not the programme's records. Sapling photo: T. R. Shankar Raman, CC BY-SA 4.0, with a measuring stick added for the demo.",
        "case": {
          "problem": "Planting a tree is the easy part. Proving a year later that it was planted, where it stands and whether it is still alive is the hard part. Officers work in the bush with no signal. A tag number written down wrong means a tree nobody can find again. A visit nobody recorded may as well not have happened. The sponsor paying for the trees wants evidence, not a spreadsheet someone rebuilds every Monday.",
          "features": [
            {
              "title": "Works with no signal",
              "body": "Officers register trees, record visits and take photos with no connection at all, and can sign in offline after the first time. Everything waits safely on the phone and syncs by itself when a signal comes back. The dashboard lists every phone and what it is still holding, such as 18 records and 7 photos waiting since 7:04 AM, so a manager knows the work exists before it arrives.",
              "shot": "tmsf-sync"
            },
            {
              "title": "Register a tree in a few taps",
              "body": "Each tree gets an ID from the project's format: a project code, a planting year and a serial, or the nursery's own tag format. The app suggests the next number, species are picked from picture cards, and a clear \"Tree registered\" confirmation ends each one. Several officers can share one tablet, each signed in to their own account.",
              "shot": "tmsf-trees"
            },
            {
              "title": "A full history for every tree",
              "body": "Every follow-up visit adds to the tree's record: alive or dead, a photo, its height. A growth chart builds up visit by visit. Each tree is due a maintenance visit every 90 days, and trees that are overdue are flagged on the dashboard.",
              "shot": "tmsf-tree"
            },
            {
              "title": "Height from a photo",
              "body": "Officers photograph each tree beside a measuring stick: 3 ft in 2025, 1 m in 2026. An administrator marks the stick and the tree, or lets AI mark them, and TMS works out the height from the stick's length. Here it is 148 cm. Estimates are labelled as estimates and never overwrite a height measured in the field.",
              "shot": "tmsf-height"
            },
            {
              "title": "Species check from photos",
              "body": "Every day a sample of new tree photos goes to Pl@ntNet, a plant identification service. When its answer doesn't match the species the officer recorded, the tree is queued for review with the photo and the scores side by side. An administrator keeps the record or corrects it in one click.",
              "shot": "tmsf-species"
            },
            {
              "title": "Areas from a KML file",
              "body": "Sector and sub-sector outlines drawn in Google Earth are uploaded as a KML file. TMS shows exactly what it will create or update, with the size of each area in hectares, before anything is saved. Uploading the same file again updates the same areas instead of duplicating them.",
              "shot": "tmsf-kml"
            },
            {
              "title": "A field map that works offline",
              "body": "Each planting year has its own sectors and sub-sectors on the map. On the phone, the offline field map shows the officer's position and the team's rally points, with the distance and direction to each. Officers can also mark their own starting point.",
              "shot": "tmsf-areas"
            },
            {
              "title": "Duplicates are caught, not lost",
              "body": "If two phones register the same tree ID, the second record isn't thrown away or silently merged. An administrator sees both side by side, with who recorded each and when, and decides: keep the original, accept the newer one, re-number a mistyped tag, or correct the existing tree.",
              "shot": "tmsf-conflict"
            },
            {
              "title": "Reports for every audience",
              "body": "Managers see status, species, vendors and planting over time, plus field activity by officer and by day, all filtered by project, year, area or date. Executives get an overview of the work done. Every number opens the trees behind it, and every view exports to Excel.",
              "shot": "tmsf-activity"
            },
            {
              "title": "A live link for the sponsor",
              "body": "A sponsor or client gets a private, read-only link to their project's charts, map and trees, with no account or password. Links can expire or be revoked at any time.",
              "shot": "tmsf-share"
            },
            {
              "title": "Every change on the record",
              "body": "Corrections sit beside the original instead of replacing it. The audit log records who did what and when, from sign-ins to KML imports, and can be searched and exported.",
              "shot": "tmsf-audit"
            }
          ],
          "process": [
            {
              "title": "Model the tree's life, not the form",
              "body": "Every tree is an event history: registration, follow-up visits, corrections, death. Each one is recorded against the tree's ID, so the record tells its own story from planting day on."
            },
            {
              "title": "Build the field app to work with no signal",
              "body": "The Android app writes everything to the phone first, including sign-in after the first time. Records queue up and sync in the background when a connection appears. Several officers can share one tablet, each signed in to their own account."
            },
            {
              "title": "Give every area a shape",
              "body": "Each project is split into planting years, sectors and sub-sectors. Boundaries come from GPS corners or an imported KML file, and the field map shows officers where they are and where the team meets."
            },
            {
              "title": "One set of data, a view for each audience",
              "body": "Administrators get the full dashboard: status, overdue maintenance, conflicts, an audit log and Excel export. Executives get an overview of work done. Clients get a private, read-only link with no account to create."
            },
            {
              "title": "Use AI on the slow checks",
              "body": "Species check compares tree photos against the recorded species. Height from photo measures the tree against the reference stick used that year: 3 ft in 2025, 1 m in 2026. Both are suggestions an administrator confirms."
            },
            {
              "title": "Ship while it's in use",
              "body": "Released to field officers early, then improved release by release from what they ran into on real sites."
            }
          ],
          "decisions": [
            {
              "title": "Offline first, not offline tolerated",
              "body": "Working without signal is the normal case in the field, not an error. Every operation has its own ID, so a batch sent twice over a bad connection never creates a duplicate tree."
            },
            {
              "title": "Tree IDs come from a scheme, not free text",
              "body": "Each ID is a project code, a planting year and a serial number, or the vendor's own tag format. The app suggests the next number. A typed ID with a typo is a tree you can never find again."
            },
            {
              "title": "Corrections sit beside the original",
              "body": "A fix never overwrites what was recorded. The original stays, the correction sits next to it, and the audit log shows who changed what and when."
            },
            {
              "title": "Disagreements go to a person",
              "body": "When two phones record different things about the same tree, TMS doesn't silently keep the last one to sync. It raises a conflict, and an administrator decides which record is right."
            },
            {
              "title": "AI suggests, people decide",
              "body": "Estimates are labelled as estimates and kept apart from heights measured in the field. Nothing an AI suggests changes a record until someone confirms it."
            },
            {
              "title": "One clock for everyone",
              "body": "Every date and report uses West Africa Time, and weeks run Monday to Sunday. A tree planted just after midnight counts on the day the officer planted it, not the day before on the server's clock."
            }
          ],
          "outcome": "A working system in the field at tms.teasooconsulting.com: an Android app officers use with or without signal, and a web portal where managers, executives and the sponsor follow the same data as it syncs. Every tree has an ID, a place on the map and a history of visits, and every number on a dashboard opens up to the trees behind it."
        }
      },
      {
        "id": "teasoo-expense",
        "ch": [
          4,
          2
        ],
        "kind": "Internal tool · Web app",
        "client": "Teasoo Consulting",
        "title": "Funds & Expenses",
        "line": "Every naira sent to staff, accounted for.",
        "story": "Teasoo sends money to staff for trips, events and running costs, and needs to know where every naira went. Funds & Expenses gives each allocation a running balance. Staff log what they spend with a photo of the receipt, finance reviews it, and the allocation is reconciled to zero. Requisitions, which used to go through Zoho Expense, run through the same system, from the request to the COO's approval to the Managing Partner's payment. I designed and built it, and kept adding to it as the team used it.",
        "media": {
          "type": "still",
          "stills": [
            "tex-dashboard"
          ]
        },
        "meta": [
          {
            "label": "Role",
            "value": "Product, design + build"
          },
          {
            "label": "App",
            "value": "Next.js · React · TypeScript"
          },
          {
            "label": "Data",
            "value": "PostgreSQL · Drizzle"
          },
          {
            "label": "Services",
            "value": "Supabase Storage · Resend · Google sign-in"
          },
          {
            "label": "Receipt scanning",
            "value": "Tesseract.js, in the browser"
          }
        ],
        "link": "",
        "linkText": "",
        "shots": [
          "tex-dashboard",
          "tex-allocation",
          "tex-review",
          "tex-requisitions",
          "tex-requisition"
        ],
        "brand": {
          "mark": "teasoo",
          "colors": [
            "#225756",
            "#eef7f6",
            "#e11b3f",
            "#0c2222"
          ],
          "type": "Inter"
        },
        "note": "The screens show demo data with made-up people, amounts and vendors, not Teasoo's records.",
        "case": {
          "problem": "Money went out to staff by bank transfer, and the proof of how it was spent came back in pieces: receipts in WhatsApp threads and balances worked out by hand. Finance could not see at a glance who still held unspent money or which expenses had no receipt. Requisitions lived in a separate tool, Zoho Expense, so a request, its approval and the payment that followed were never in one place.",
          "features": [
            {
              "title": "A live balance for every allocation",
              "body": "Finance records the money sent to a staff member as an allocation, with its purpose, project and transfer receipt. From then on the balance works itself out from the records: received, spent, waiting for review and remaining. Top-ups, returns and corrections are separate entries, so the figure can always be traced back.",
              "shot": "texf-balance"
            },
            {
              "title": "Log an expense from the receipt",
              "body": "On a phone, staff photograph the receipt. The app reads the total, the date, the vendor and the receipt number in the browser, then fills the form for them to check. The photo stays attached as evidence, and large phone photos are shrunk before upload so they stay under the size limit.",
              "shot": "texf-scan"
            },
            {
              "title": "Several expenses in one go",
              "body": "After a trip, staff can log all their spending on one page, each row with its own fund, category and receipt. They see a running total and what each fund will have left. Every row is checked before anything is saved, and a row that needs a second look stays on the page while the rest go through.",
              "shot": "texf-batch"
            },
            {
              "title": "Review with a reason",
              "body": "Finance approves, rejects, asks a question or asks for evidence, and any decision can carry a note. Internal notes stay with finance. When staff upload the receipt that was asked for, the expense goes back into the review queue by itself. Nobody can approve their own expense.",
              "shot": "texf-review"
            },
            {
              "title": "Reconciled to zero",
              "body": "When every expense is approved and the unspent money has come back, the allocation closes with a breakdown that has to come to ₦0, and its approved expenses are locked. Money staff spend from their own pocket is kept apart and settled on purpose, by a refund or from an allocation they hold.",
              "shot": "texf-reconcile"
            },
            {
              "title": "Requisitions with the approval chain",
              "body": "A requisition lists each item with its quantity, price, discount and the vendor's bank details, with quotes attached. It goes to the COO, who approves it, declines it with a reason or asks for more information. The requester answers, updates it and sends it back, and the whole history sits beside it.",
              "shot": "texf-approve"
            },
            {
              "title": "Payment, and where the money went",
              "body": "Approved requisitions go to the Managing Partner, who records the payment with its reference and proof. When the money goes to a staff member instead of a vendor, it starts a new allocation or is added to one they already hold, and they account for it with receipts like any other funds.",
              "shot": "texf-pay"
            },
            {
              "title": "A purchase request in the familiar layout",
              "body": "Each requisition downloads as a branded PDF named after its reference, in the layout the team already knew from Zoho: logo and contact details, items with bank details, the payment and the approval history. Numbering carries on from the last Zoho reference in the same TC-PR format.",
              "shot": "texf-pdf"
            },
            {
              "title": "One login, every company",
              "body": "Each company or subsidiary has its own people, funds, categories, approvers and reports. A person can belong to several, with a different role in each, and switches between them from the menu beside the logo. A link to a record in another company switches over by itself.",
              "shot": "texf-orgs"
            },
            {
              "title": "Access by invitation",
              "body": "Nobody signs up on their own. An administrator or accountant invites people into one or more companies. Staff with a company email sign in with Google, and anyone else gets a password they can keep or change.",
              "shot": "texf-invite"
            }
          ],
          "process": [
            {
              "title": "Start from the money, not the form",
              "body": "Each allocation is a ledger: what was sent, what was spent and what came back. Balances are worked out from those entries on the server, never typed in, and amounts are stored in kobo so they never round."
            },
            {
              "title": "Design the phone flow for the person spending",
              "body": "Staff log expenses where they spend, so adding one is a short, step-by-step flow with the camera first. Finance works at a desk, with queues, filters and exports to Excel, CSV and PDF."
            },
            {
              "title": "Write the rules down",
              "body": "Receipts, duplicates, over-budget spending and future dates each have a rule an administrator can switch on or off, and every change lands in the audit log."
            },
            {
              "title": "Shape it with the people using it",
              "body": "Released early, then changed from what the team asked for in use: receipts made optional for funded spending, personal spend kept apart from company money, requisitions brought in from Zoho, and several companies under one login."
            }
          ],
          "decisions": [
            {
              "title": "Personal spend kept apart",
              "body": "Money staff pay from their own pocket is never taken off an allocation's balance. Finance settles it on purpose, by refund or from an allocation, so a balance only ever shows company money."
            },
            {
              "title": "Approvers chosen per company, not fixed roles",
              "body": "The COO and the Managing Partner are picked in Settings for each company, with backups. Fixed roles would break the first time someone is on leave, or a subsidiary has a different chain."
            },
            {
              "title": "Nobody approves their own",
              "body": "Expenses, claims and requisitions all skip the person who raised them. The COO's own requisitions go to the Managing Partner instead."
            },
            {
              "title": "Receipts read on the phone",
              "body": "Scanning runs in the browser with an open-source OCR library, so there is no cost per scan and the receipt isn't sent anywhere to be read."
            },
            {
              "title": "Saved one row at a time",
              "body": "When several expenses are logged together, each is sent on its own. A page full of receipt photos never hits the upload limit, and one row with a problem doesn't hold up the rest."
            },
            {
              "title": "Invitations over an open domain",
              "body": "A company email alone doesn't say which company, role or department someone belongs to. Invitations settle that before the first sign-in."
            }
          ],
          "outcome": "A live internal system for allocations, expenses and requisitions, built to replace receipts in chat threads and requisitions in Zoho Expense. Every allocation has a balance that traces back to its records, every requisition carries its whole approval history, and each company sees only its own money."
        }
      },
      {
        "id": "teasoo",
        "ch": [
          1
        ],
        "kind": "Website · WordPress",
        "client": "Teasoo Consulting",
        "title": "Teasoo Consulting",
        "line": "Six service lines, one clear route in.",
        "story": "Teasoo helps organisations navigate complexity and mitigate risk. There is no product to photograph and six distinct service lines competing for the same attention, so the whole job was making an abstract advisory practice feel solid and easy to enter.",
        "media": {
          "type": "brand"
        },
        "meta": [
          {
            "label": "Platform",
            "value": "WordPress · Elementor"
          },
          {
            "label": "Type",
            "value": "Montserrat"
          },
          {
            "label": "Role",
            "value": "Design + build"
          }
        ],
        "link": "https://teasooconsulting.com/",
        "linkText": "Visit the site",
        "shots": [
          "teasoo-site-1",
          "teasoo-site-2"
        ],
        "brand": {
          "mark": "teasoo",
          "colors": [
            "#e11b3f",
            "#41454f",
            "#eff1f6"
          ],
          "type": "Montserrat"
        },
        "case": {
          "problem": "An advisory firm sells judgement, not objects. Teasoo runs six service lines — from organisational development to digital transformation — and a visitor arriving cold cannot tell which one is theirs. The old route to a conversation was buried.",
          "process": [
            {
              "title": "Audit what they actually sell",
              "body": "Listed every service and the kind of client each one answers to, then grouped the six into one comparable set instead of six paragraphs."
            },
            {
              "title": "Lead with credibility, not copy",
              "body": "An advisory buyer is asking “can I trust these people” before “what do they do”. The hero answers the first question so the grid can answer the second."
            },
            {
              "title": "Make the grid scannable",
              "body": "Each service reduced to an icon, a name, one sentence and a single link — so the page is scanned in seconds, not read in minutes."
            },
            {
              "title": "Hand over the keys",
              "body": "Built on WordPress with Elementor so their team edits copy and adds services without a developer in the loop."
            }
          ],
          "decisions": [
            {
              "title": "Services as a six-card grid",
              "body": "Six equal cards let a visitor self-select in one sweep. Six stacked sections would have made service one look like the main offer."
            },
            {
              "title": "Red reserved for action",
              "body": "The brand red only ever appears on things you can click. Everywhere else is charcoal on white, so the eye follows the red."
            },
            {
              "title": "Montserrat throughout",
              "body": "One geometric sans across headings and body keeps the register corporate and calm — an advisory site that looks excitable is working against itself."
            },
            {
              "title": "Contact repeated, never hunted",
              "body": "A contact button in the top bar and again at the end of the grid, because the moment someone decides is not predictable."
            }
          ],
          "outcome": "A site their team runs themselves, where the six service lines read as one practice rather than six departments."
        }
      },
      {
        "id": "ehf",
        "ch": [
          1
        ],
        "kind": "Website · WordPress",
        "client": "Esangbedo Humanitarian Foundation",
        "title": "EHF Africa",
        "line": "One site, three audiences that want different things.",
        "story": "EHF works with vulnerable groups across Nigeria — anti-trafficking, education and outreach — alongside partners including NAPTIP. A foundation site carries a heavier job than a business one, because three very different people arrive expecting three different answers.",
        "media": {
          "type": "brand"
        },
        "meta": [
          {
            "label": "Platform",
            "value": "WordPress"
          },
          {
            "label": "Type",
            "value": "Roboto"
          },
          {
            "label": "Role",
            "value": "Design + build"
          }
        ],
        "link": "https://ehfoundation.africa/",
        "linkText": "Visit the site",
        "shots": [
          "ehf-site-1",
          "ehf-site-2"
        ],
        "brand": {
          "mark": "ehf",
          "colors": [
            "#093f87",
            "#63e1e1",
            "#2d3f63"
          ],
          "type": "Roboto"
        },
        "case": {
          "problem": "A donor wants evidence the money moves. A partner organisation wants to know who else is at the table. A beneficiary wants to know whether they qualify and what to do next. One homepage, three incompatible reading orders.",
          "process": [
            {
              "title": "Separate the three journeys",
              "body": "Wrote out what each audience needed to see first, then decided which one owns the top of the page and where the other two get picked up."
            },
            {
              "title": "Put the evidence early",
              "body": "A results block — students reached, beneficiaries, schools covered, participants — sits directly under the hero, because that is the donor's first question and it costs the other two nothing."
            },
            {
              "title": "Use the partners as proof",
              "body": "NAPTIP and the other partner marks do work no paragraph can: they establish standing before anyone reads a word of copy."
            },
            {
              "title": "Keep programmes as the deep layer",
              "body": "Each programme gets its own page, so the homepage stays a directory rather than trying to be the whole foundation."
            }
          ],
          "decisions": [
            {
              "title": "Numbers before narrative",
              "body": "Counters immediately under the hero. A foundation that leads with its mission statement reads like intent; one that leads with numbers reads like a track record."
            },
            {
              "title": "Institutional blue, not charity warm",
              "body": "EHF works with government agencies. The navy and cyan pitch it as an organisation you can sign an MOU with, not a fundraiser."
            },
            {
              "title": "Photography of the actual work",
              "body": "Real programme photography throughout — stock imagery on a humanitarian site actively costs trust."
            },
            {
              "title": "Publishing left with them",
              "body": "Their team adds new programmes and results themselves, because a foundation's proof goes stale fastest."
            }
          ],
          "outcome": "A site where a donor, a partner and a beneficiary each find their answer without wading through the other two."
        }
      },
      {
        "id": "moatview",
        "ch": [
          1
        ],
        "kind": "Website · WordPress",
        "client": "Moatview Apartments",
        "title": "Moatview Apartments",
        "line": "A booking decision made in under a minute.",
        "story": "Serviced apartments in GRA, Benin City. Somebody deciding where to sleep tonight is not going to dig — so the site is built around how fast it can answer where it is, what it's like, and how to book.",
        "media": {
          "type": "brand"
        },
        "meta": [
          {
            "label": "Platform",
            "value": "WordPress"
          },
          {
            "label": "Type",
            "value": "Poppins"
          },
          {
            "label": "Role",
            "value": "Design + build"
          }
        ],
        "link": "https://moatviewapartments.com/",
        "linkText": "Visit the site",
        "shots": [
          "moatview-site-1"
        ],
        "brand": {
          "mark": "moatview",
          "colors": [
            "#e18709",
            "#cf993f",
            "#1b1b1b"
          ],
          "type": "Poppins"
        },
        "case": {
          "problem": "Short-stay accommodation is chosen fast and on atmosphere. The three questions — where is it, what does it look like, how do I book — were all more than one click away, and a phone number that takes a click is a phone number nobody dials.",
          "process": [
            {
              "title": "Cut the decision to three answers",
              "body": "Location, feel and booking. Everything else on the page had to justify itself against those three."
            },
            {
              "title": "Put the address in the first sentence",
              "body": "Not in a footer, not on a contact page — in the opening line, linked to the map."
            },
            {
              "title": "Let the rooms carry the atmosphere",
              "body": "Interior photography sized large and masked into an organic shape rather than a rectangle, so the page feels like a stay rather than a listing."
            },
            {
              "title": "Make contact unavoidable",
              "body": "Email and both phone numbers sit inline directly under the booking button, because the fastest booking is often a call."
            }
          ],
          "decisions": [
            {
              "title": "Book Now above the fold, once",
              "body": "One primary action, high, in solid black against the amber brand — no competing secondary button to dilute it."
            },
            {
              "title": "Organic image mask over a rectangle",
              "body": "A soft asymmetric mask reads as hospitality; a hard rectangle reads as an estate agent's listing."
            },
            {
              "title": "Amenities as icons, not prose",
              "body": "Air conditioning, room service, security, terrace — a row of icons is checked in a glance, where a paragraph is skipped."
            },
            {
              "title": "Poppins for warmth",
              "body": "Rounder than the geometric sans I'd use for a consultancy — the register is a comfortable stay, not a transaction."
            }
          ],
          "outcome": "A single scroll that answers the three questions a guest actually has, with the booking route never more than one action away."
        }
      },
      {
        "id": "shinaluwoye",
        "ch": [
          1
        ],
        "kind": "Website · WordPress",
        "client": "Shina Luwoye Foundation",
        "title": "Shina Luwoye Foundation",
        "line": "Two audiences, two doors, side by side.",
        "story": "A foundation breaking financial barriers to education, running since 2024. Students need to apply; donors need a reason to give. The site refuses to make either one the secondary audience.",
        "media": {
          "type": "brand"
        },
        "meta": [
          {
            "label": "Platform",
            "value": "WordPress"
          },
          {
            "label": "Type",
            "value": "Poppins / Open Sans"
          },
          {
            "label": "Role",
            "value": "Design + build"
          }
        ],
        "link": "https://shinaluwoyefoundation.com/",
        "linkText": "Visit the site",
        "shots": [
          "shinaluwoye-site-1",
          "shinaluwoye-site-2"
        ],
        "brand": {
          "mark": "shinaluwoye",
          "colors": [
            "#ff3f3f",
            "#0987bd",
            "#51bdbd"
          ],
          "type": "Poppins / Open Sans"
        },
        "case": {
          "problem": "Scholarship foundations usually pick a side. Lead with the students and donors get no case; lead with the donors and the students who need the money bounce off a brochure written for someone else.",
          "process": [
            {
              "title": "Name both jobs out loud",
              "body": "Apply for a scholarship, and support the work. Two verbs, and the page had to serve both without a menu dive."
            },
            {
              "title": "Put both doors in the hero",
              "body": "Two buttons side by side under the headline — apply first, learn more second — so nobody has to work out which half of the site is theirs."
            },
            {
              "title": "Tell the founder's story properly",
              "body": "A dedicated section with the founder's own account of why the foundation exists: a father denied education by financial hardship. That is the donor's case, and it cannot be made by statistics."
            },
            {
              "title": "Keep the application short",
              "body": "Every extra field on a scholarship form is a student who doesn't finish it."
            }
          ],
          "decisions": [
            {
              "title": "Apply first, donate second",
              "body": "Reading order is a statement of priority. Putting the student first is also the strongest thing a donor can be shown."
            },
            {
              "title": "The founder in his own words",
              "body": "A pull quote and a portrait rather than a third-person mission statement — the personal account is what actually moves a donor."
            },
            {
              "title": "Warm red against institutional blue",
              "body": "Blue carries the credibility a scholarship body needs; the red is used only where the page asks for an action."
            },
            {
              "title": "“Since 2024” stated plainly",
              "body": "A young foundation is better served by being straightforward about its age than by implying a longer history."
            }
          ],
          "outcome": "A homepage where a student and a donor each hit their own action inside the first screen."
        }
      },
      {
        "id": "thinkingroom",
        "ch": [
          1,
          2
        ],
        "kind": "Website · Next.js",
        "client": "The Thinking Room",
        "title": "The Thinking Room",
        "line": "The argument is the hero.",
        "story": "Not everything belongs on WordPress. A Next.js build on Vercel for a live conversation series about why unlimited access to information has left people less decisive, not more. It sells a seat, not a product — so the provocation had to do the selling.",
        "media": {
          "type": "brand"
        },
        "meta": [
          {
            "label": "Platform",
            "value": "Next.js on Vercel"
          },
          {
            "label": "Type",
            "value": "Anton / Inter"
          },
          {
            "label": "Role",
            "value": "Design + build"
          }
        ],
        "link": "https://the-thinking-room-pi.vercel.app/",
        "linkText": "Visit the site",
        "shots": [
          "thinkingroom-site-1",
          "thinkingroom-site-2"
        ],
        "brand": {
          "mark": "thinkingroom",
          "dark": true,
          "colors": [
            "#e12d2d",
            "#0a0a0a",
            "#d1ff00"
          ],
          "type": "Anton / Inter"
        },
        "case": {
          "problem": "There is no product shot for an idea. The site had to make a stranger want a seat at a conversation happening on a specific Thursday evening — which means the thinking itself has to be visible above the fold, not buried in an about page.",
          "process": [
            {
              "title": "Find the sentence that stops someone",
              "body": "“Too much to choose. Too little to show.” The whole proposition compressed into six words, set at display size as the first thing on the page."
            },
            {
              "title": "Put the logistics where the decision is made",
              "body": "Date, time and platform run as a data strip directly under the CTA, because the second thought after “I want in” is “can I actually make it”."
            },
            {
              "title": "Escalate down the page",
              "body": "Hero provocation, then what the room is, then the real problem — each section pushing the argument one step further rather than restating it."
            },
            {
              "title": "Build it static and fast",
              "body": "A campaign site with no CMS need. Next.js on Vercel: instant loads, no plugin surface, nothing to maintain between editions."
            }
          ],
          "decisions": [
            {
              "title": "Anton at display size",
              "body": "A condensed heavy face lets a full sentence run enormous without wrapping into mush. The type does the shouting so the copy doesn't have to."
            },
            {
              "title": "Near-black with one red",
              "body": "A single high-chroma red on near-black keeps every call to action unmistakable and makes the whole site feel like one voice."
            },
            {
              "title": "Edition number, visible",
              "body": "Framing it as “edition 001” sets the expectation that this recurs, which is what turns an event into a brand."
            },
            {
              "title": "A portrait, not a stock crowd",
              "body": "The host is the reason to attend. One considered portrait beats any illustration of “conversation”."
            }
          ],
          "outcome": "A one-page campaign site where the argument, the host and the seat are all settled before the first scroll."
        }
      },
      {
        "id": "mediagiants",
        "ch": [
          1
        ],
        "kind": "Website · WooCommerce",
        "client": "MediaGiants Enterprise",
        "title": "MediaGiants",
        "line": "A site that explains the work and takes the order.",
        "story": "A creative agency doing social media management, photography, videography and graphic design. Most agency sites stop at explaining. This one had to close as well, so the storefront is built into the services rather than bolted on.",
        "media": {
          "type": "brand"
        },
        "meta": [
          {
            "label": "Platform",
            "value": "WordPress + WooCommerce"
          },
          {
            "label": "Type",
            "value": "Roboto"
          },
          {
            "label": "Role",
            "value": "Design + build"
          }
        ],
        "link": "https://mediagiantsenterprise.com/",
        "linkText": "Visit the site",
        "shots": [
          "mediagiants-site-1",
          "mediagiants-site-2"
        ],
        "brand": {
          "mark": "mediagiants",
          "colors": [
            "#f3872d",
            "#991b09",
            "#cf8709"
          ],
          "type": "Roboto"
        },
        "case": {
          "problem": "Two jobs fighting each other. A brochure site explains but never closes; a bare storefront sells packages to people who don't yet know why they need them. Both failure modes lose the same client.",
          "process": [
            {
              "title": "Put the four disciplines in the hero",
              "body": "Social media management, photography, videography, graphic design — named in the opening line so nobody has to guess the remit."
            },
            {
              "title": "End every service in a quote",
              "body": "Each service card carries its own Request a Quote. The explanation and the order live in the same component instead of different pages."
            },
            {
              "title": "Two speeds of intent",
              "body": "Book a Service for people who already know, Explore Services for people who don't — side by side in the hero, no wrong answer."
            },
            {
              "title": "Wire it to WooCommerce",
              "body": "Packages and prices become products, so the team changes them without waiting on a developer."
            }
          ],
          "decisions": [
            {
              "title": "Quote button on every card",
              "body": "The moment of interest is the moment to ask. Sending people to a central contact page loses the ones who were ready."
            },
            {
              "title": "Dark studio photography as the ground",
              "body": "A creative agency is judged on its own visuals before its copy. The studio imagery is the portfolio argument."
            },
            {
              "title": "Orange for every action",
              "body": "One accent, used only on buttons and quote links, so the path through a long page stays obvious."
            },
            {
              "title": "WooCommerce over a contact form",
              "body": "A form ends in an email thread. A storefront ends in a transaction, and the agency can restructure its own packages."
            }
          ],
          "outcome": "One site that carries the pitch and the checkout, with pricing the team controls."
        }
      },
      {
        "id": "thomas",
        "ch": [
          1,
          2
        ],
        "kind": "Website · Static",
        "client": "Thomas Emmanuel Ayodele",
        "title": "Thomas Emmanuel Ayodele",
        "line": "Designing for a designer.",
        "story": "A portfolio for a brand designer and illustrator — which is the hardest brief of the set, because the site needs a point of view of its own and still has to get out of the way of the work.",
        "media": {
          "type": "brand"
        },
        "meta": [
          {
            "label": "Platform",
            "value": "Static · GitHub Pages"
          },
          {
            "label": "Type",
            "value": "Playfair Display / Syne"
          },
          {
            "label": "Role",
            "value": "Design + build"
          }
        ],
        "link": "https://clepbo.github.io/Thomas-Emmanuel-Ayodele-/index.html",
        "linkText": "Visit the site",
        "shots": [
          "thomas-site-1"
        ],
        "brand": {
          "mark": "thomas",
          "dark": true,
          "colors": [
            "#f4f1ea",
            "#d8d3c8",
            "#0f0f0f"
          ],
          "type": "Playfair Display / Syne"
        },
        "case": {
          "problem": "A designer's portfolio has two failure modes. Too plain and it says the designer has no voice; too loud and it competes with the work it is meant to present. Thomas needed the site to read as designed without becoming the subject.",
          "process": [
            {
              "title": "Set the voice in the type, not the layout",
              "body": "A high-contrast serif against a geometric grotesk carries the personality, which leaves the layout free to be quiet."
            },
            {
              "title": "Index the work, don't tile it",
              "body": "Selected work as a numbered list with small thumbnails, so each project is read as an entry rather than swallowed into a grid of equal squares."
            },
            {
              "title": "Give the statement one screen",
              "body": "“Shaping brands that last” gets the full opening and nothing else, so the work below starts on a clean beat."
            },
            {
              "title": "Strip the stack to nothing",
              "body": "Hand-written HTML and CSS on GitHub Pages. No CMS, no build, no dependency that can rot between commissions."
            }
          ],
          "decisions": [
            {
              "title": "Playfair Display with Syne",
              "body": "The serif brings editorial weight, the grotesk keeps it contemporary. That pairing is the site's entire personality budget."
            },
            {
              "title": "Cream on near-black",
              "body": "Warm off-white rather than pure white: it flatters illustration work and stops the page feeling like a spec sheet."
            },
            {
              "title": "A numbered index over a grid",
              "body": "A grid ranks nothing. A numbered list is a designer's edit — it says these are in this order for a reason."
            },
            {
              "title": "Static hosting on purpose",
              "body": "Free, instant, and nothing to update. A portfolio should not have a maintenance window."
            }
          ],
          "outcome": "A site with a clear voice in its typography and near-nothing else, running free on static hosting."
        }
      },
      {
        "id": "shedulr",
        "ch": [
          2
        ],
        "kind": "Product design · Figma",
        "client": "Shedulr",
        "title": "Shedulr",
        "line": "Scheduling, designed properly.",
        "story": "The largest of the three files at 156 MB. Add the story here — what it schedules, who for, and the decision the design had to make easy.",
        "media": {
          "type": "brand"
        },
        "meta": [
          {
            "label": "Tool",
            "value": "Figma"
          },
          {
            "label": "File",
            "value": "Shedulr.fig · 156 MB"
          },
          {
            "label": "Stored",
            "value": "Git LFS"
          }
        ],
        "link": "https://github.com/clepbo/clepbo/blob/main/Projects/Shedulr.fig",
        "linkText": "Open the file",
        "brand": {
          "mark": "shedulr.svg",
          "colors": [
            "#086868",
            "#78A8A8",
            "#B8C8C8"
          ],
          "type": "Set in the file"
        },
        "slot": true,
        "case": {
          "problem": "Describe the scheduling problem it solves and who was losing time to it.",
          "process": [
            {
              "title": "Add your first step",
              "body": "What you mapped before drawing."
            },
            {
              "title": "Add your second step",
              "body": "How the flow took shape."
            },
            {
              "title": "Add your third step",
              "body": "Handoff and systemisation."
            }
          ],
          "decisions": [
            {
              "title": "Add a decision",
              "body": "And why it beat the alternative."
            },
            {
              "title": "Add another",
              "body": "Two or three is plenty."
            }
          ],
          "outcome": "What shipped, and what it changed."
        },
        "hidden": true
      },
      {
        "id": "moatview-film",
        "ch": [
          3,
          1
        ],
        "kind": "Video · Property film",
        "client": "Moatview Apartments",
        "title": "Moatview walkthrough",
        "line": "The property film for a site I also built.",
        "story": "A walkthrough that has to sell a room to somebody who cannot stand in it. Shot in the apartments, cut around a spoken guide, with a lower third carrying the address and booking details so a viewer who arrives mid-scroll still knows where this is and how to book.",
        "media": {
          "type": "still",
          "stills": [
            "moatview-tour"
          ],
          "video": true
        },
        "meta": [
          {
            "label": "Work",
            "value": "Edit · motion graphics"
          },
          {
            "label": "Client",
            "value": "Moatview Apartments"
          },
          {
            "label": "Pair",
            "value": "Site under Web"
          }
        ],
        "video": "https://drive.google.com/file/d/1ZFh3R-CE6Bm0_Y3eK94KffU4hNxsRATo/view",
        "link": "https://drive.google.com/file/d/1ZFh3R-CE6Bm0_Y3eK94KffU4hNxsRATo/view",
        "linkText": "Watch the film",
        "hidden": true
      },
      {
        "id": "teaching-series",
        "ch": [
          3
        ],
        "kind": "Video · Long-form series",
        "client": "Pastor Austin Adetunji",
        "title": "Teaching series",
        "line": "An ongoing series, episode after episode.",
        "story": "The unglamorous discipline of series work: same look, same pacing, same treatment, week after week, so an audience recognises it before the title card lands. Stage recordings and studio pieces cut down to something that holds attention past the first minute.",
        "media": {
          "type": "still",
          "stills": [
            "crisis-of-faith",
            "person-of-value",
            "welfare-package",
            "mentorship-class"
          ],
          "video": true
        },
        "meta": [
          {
            "label": "Work",
            "value": "Edit · colour · sound"
          },
          {
            "label": "Format",
            "value": "Long-form"
          },
          {
            "label": "Cadence",
            "value": "Ongoing series"
          }
        ],
        "video": "https://drive.google.com/file/d/1IAqlAvQ9gi1avgfKmwww5wmFFWmAQ3iX/view",
        "link": "https://drive.google.com/file/d/1IAqlAvQ9gi1avgfKmwww5wmFFWmAQ3iX/view",
        "linkText": "Watch an episode",
        "hidden": true
      },
      {
        "id": "short-form",
        "ch": [
          3
        ],
        "kind": "Video · Short-form",
        "client": "Various",
        "title": "Short-form and kinetic titles",
        "line": "Cut for the scroll, with type that moves.",
        "story": "Long recordings mined for the ninety seconds actually worth posting, then rebuilt for a feed: tighter pacing, captions, and animated titles that land the point before a thumb moves. The titles are set, animated and timed to the edit rather than dropped on top of it.",
        "media": {
          "type": "still",
          "stills": [
            "validation",
            "difficult-situation",
            "perception"
          ],
          "video": true
        },
        "meta": [
          {
            "label": "Work",
            "value": "Edit · motion graphics"
          },
          {
            "label": "Format",
            "value": "Vertical + 16:9"
          },
          {
            "label": "Use",
            "value": "Social"
          }
        ],
        "video": "https://drive.google.com/file/d/18lJ05HmQfQp1RYCHNm6uvFS4cN0ksa17/view",
        "link": "https://drive.google.com/file/d/18lJ05HmQfQp1RYCHNm6uvFS4cN0ksa17/view",
        "linkText": "Watch a cut",
        "hidden": true
      },
      {
        "id": "ehf-films",
        "ch": [
          3,
          1
        ],
        "kind": "Video · Documentary",
        "client": "Esangbedo Humanitarian Foundation",
        "title": "School outreach films",
        "line": "Field work, in the schools themselves.",
        "story": "Outreach across schools including Our Lady of Lourdes Girls Grammar School, Uromi, and Niger College. Documentary footage cut into pieces a foundation can actually use — proof for partners, and something a school community recognises itself in.",
        "media": {
          "type": "still",
          "stills": [
            "ehf-lourdes",
            "ehf-niger-college"
          ],
          "video": true
        },
        "meta": [
          {
            "label": "Work",
            "value": "Edit · motion graphics"
          },
          {
            "label": "Client",
            "value": "EHF Africa"
          },
          {
            "label": "Pair",
            "value": "Site under Web"
          }
        ],
        "link": "https://ehfoundation.africa/",
        "linkText": "See the foundation",
        "hidden": true
      },
      {
        "id": "teelens",
        "ch": [
          3,
          4
        ],
        "kind": "Video · AI in the edit",
        "client": "TeeLens Visuals",
        "title": "Nine editing tasks AI can do for you",
        "line": "A piece about AI, made with the workflow it argues for.",
        "story": "The boring parts of an edit — transcription, rough selects, captions, cleanup — are the parts a machine is now genuinely good at. This is a piece about that, cut using exactly that workflow, which is the same reason my web work leans on AI: it removes the hours that were never the craft.",
        "media": {
          "type": "still",
          "stills": [
            "teelens-ai-editing"
          ],
          "video": true
        },
        "meta": [
          {
            "label": "Work",
            "value": "Edit · motion graphics"
          },
          {
            "label": "Subject",
            "value": "AI-assisted editing"
          },
          {
            "label": "Format",
            "value": "Long-form"
          }
        ],
        "video": "https://drive.google.com/file/d/1cb8jHbKKrRV_N_obnsdEHvTuSOQ65xBO/view",
        "link": "https://drive.google.com/file/d/1cb8jHbKKrRV_N_obnsdEHvTuSOQ65xBO/view",
        "linkText": "Watch it",
        "hidden": true
      },
      {
        "id": "podcast",
        "ch": [
          3
        ],
        "kind": "Video · Podcast",
        "client": "Falmaran",
        "title": "Falmaran Hoodies podcast",
        "line": "Multi-camera conversation, cut for clips.",
        "story": "A podcast cut twice: once as the full conversation, once as vertical clips built to travel on their own. The second cut is where most of the audience actually meets the show.",
        "media": {
          "type": "still",
          "stills": [
            "falmaran-podcast"
          ],
          "video": true
        },
        "meta": [
          {
            "label": "Work",
            "value": "Edit · clips"
          },
          {
            "label": "Format",
            "value": "Long-form + vertical"
          },
          {
            "label": "Use",
            "value": "Podcast + social"
          }
        ],
        "video": "https://drive.google.com/file/d/1yD3SaeZSZVOcnl8bTGqAcHI53v0PAR9B/view",
        "link": "https://drive.google.com/file/d/1yD3SaeZSZVOcnl8bTGqAcHI53v0PAR9B/view",
        "linkText": "Watch it",
        "hidden": true
      }
    ]
  },
  "path": {
    "eyebrow": "Process",
    "title": "How a project runs",
    "note": "The same four stages, whatever we're building.",
    "steps": [
      {
        "name": "Discover",
        "body": "We talk. I ask what the thing has to do, who it's for, and what finished looks like to you — before anyone mentions a price."
      },
      {
        "name": "Scope",
        "body": "Scope, timeline and cost, in writing. If something you want is a bad idea, you hear it here rather than after you've paid for it."
      },
      {
        "name": "Build with AI",
        "body": "AI speeds up the build; you see it while it's coming together, not at the end. Changes are cheap in the middle and expensive on the last day."
      },
      {
        "name": "Launch",
        "body": "It ships. You get the files, the accounts, and a walkthrough — so nothing you own depends on me picking up the phone."
      }
    ]
  },
  "about": {
    "eyebrow": "About",
    "title": "Israel Oni",
    "lead": "I build AI-powered digital solutions for businesses and individuals, wherever they are. Most people come to me for one thing — a site, a product design, a system that needed fixing — and only find out later that I can do the rest too.",
    "body": [
      "The through-line is the same every time: understand the problem properly, then build one thing that works — rather than hand over something that only looks finished.",
      "I came up through backend engineering, and that hasn't gone anywhere: Java, Spring Boot and the databases underneath still decide whether a system behaves once real people arrive. What changed is the front of the job. Most of what I ship now is a site, a product or a system, put together fast because AI finally allows it."
    ],
    "facts": [
      {
        "label": "Works with",
        "value": "Clients anywhere, remotely"
      },
      {
        "label": "Builds on",
        "value": "WordPress · Next.js · Spring Boot"
      },
      {
        "label": "Designs in",
        "value": "Figma · Canva"
      },
      {
        "label": "Open to",
        "value": "Freelance, contract, collaboration"
      }
    ]
  },
  "contact": {
    "eyebrow": "Contact",
    "title": "Let's build your AI-powered solution.",
    "body": "Tell me what you're trying to get done and when you need it. If AI isn't the right answer, or I'm not the right person, I'll say so and point you somewhere better.",
    "email": "io.israeloni@gmail.com",
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/clepbo"
      },
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/israel-oni-2496a1210/"
      },
      {
        "label": "X",
        "href": "https://www.x.com/clepbo"
      },
      {
        "label": "Instagram",
        "href": "https://www.instagram.com/israeli4god/"
      },
      {
        "label": "Stack Overflow",
        "href": "https://stackoverflow.com/users/11863642/clepbo"
      }
    ],
    "form": {
      "enabled": true,
      "heading": "Or just tell me here",
      "note": "Straight to my inbox. You'll get a confirmation immediately, and a real reply within a day.",
      "button": "Send it",
      "success": "Got it. Check your inbox for a confirmation — I'll reply properly within a day.",
      "deliverTo": "",
      "from": "Israel Oni <onboarding@resend.dev>",
      "replySubject": "I've got your message",
      "replyBody": "Thanks for getting in touch — your message has landed and I've read it.\n\nI reply to everything myself, usually within a day. If it's urgent, reply to this email and it comes straight back to me.\n\nIsrael"
    }
  },
  "footer": {
    "left": "Israel Oni — working with clients worldwide",
    "right": "Built with AI, finished by hand."
  },
  "testimonials": {
    "eyebrow": "What clients say",
    "title": "In their words",
    "note": "Add a testimonial in the admin — three sentences from a client does more than any feature.",
    "items": []
  }
} as Content;
