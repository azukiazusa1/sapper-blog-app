---
id: LpFl_88dN6xV2XXV_8yUo
title: "Trying Dynamic Workflow in Claude Code"
slug: "claude-code-dynamic-workflow"
about: "Claude Code v2.1.154 added Dynamic Workflow, a feature for large tasks that can take hours or days. This article walks through trying it in Claude Code."
createdAt: "2026-05-29T19:20+09:00"
updatedAt: "2026-05-29T19:20+09:00"
tags: ["claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3aJ5BsDvvLfsHdlA1cntHE/d2411e9e2aea84823f6ae6f51900f485/ikura-tsutsumi_sushi_21470-768x542.png"
  title: "いくらつつみのお寿司のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Which method does the article mention for having Claude create and run a workflow?"
      answers:
        - text: "Include the word \"workflow\" in the prompt"
          correct: true
          explanation: "The article introduces the method of including the word \"workflow\" in the prompt."
        - text: "Run the `/workflow create` command"
          correct: false
          explanation: "The article does not introduce such a command."
        - text: "Manually place a JavaScript file in `.claude/workflows`"
          correct: false
          explanation: "The article explains how to have Claude create a workflow, not how to manually place one in `.claude/workflows`."
        - text: "No special action is needed to run a workflow"
          correct: false
          explanation: "A regular session does not run as a Dynamic Workflow unless it is triggered."
published: true
---
Claude Code v2.1.154 added a feature called Dynamic Workflow. Dynamic Workflow is designed for large-scale tasks that can take anywhere from hours to days. Recently, the [project to port Bun from Zig to Rust](https://github.com/oven-sh/bun/pull/30412) attracted a lot of attention, and it appears that Dynamic Workflow was used in that project as well.

https://x.com/jarredsumner/status/2060050578026189172

Dynamic Workflow is a JavaScript script for orchestrating multiple subagents. When a workflow starts, the plan is converted into code. Claude generates a workflow script based on the task, and at runtime the script and runtime manage the order in which subagents run and the intermediate results they produce. By codifying the plan, Dynamic Workflow can do more than simply increase the number of agents; it can apply repeatable patterns. Independent agents can also review each other's findings adversarially before they are reported, or draft plans from multiple angles and compare them, which can produce more reliable results than a single pass.

Dynamic Workflow can consume significantly more resources than a regular session, so it should be used with care. For that reason, Claude Code asks for confirmation before running a Dynamic Workflow, and administrators can disable it through managed settings.

This article walks through trying Dynamic Workflow in Claude Code.

## Trying the Built-In Dynamic Workflow

Claude Code provides `/deep-research` as a built-in Dynamic Workflow, so I will try that first. The `/deep-research` command is a Dynamic Workflow for conducting in-depth research on a topic provided by the user, and it lets you observe agents processing a series of phases in the background.

Before running a workflow, make sure the `Dynamic workflows` option is set to `true`. You can check this with the `/config` command.

![](https://images.ctfassets.net/in6v9lxmm5c8/7ci3t1P4EsOjZoMWvduZpk/b829af245f42325b4e05af8164ec42ac/image.png)

Pass the topic you want to investigate as the argument to the `/deep-research` command. For example, I asked it to research the recently discussed "Hermes Agent."

```txt
/deep-research Hermes Agent について何ができるか、Open Claw との違いはなにか、ユースケースはなにか、などを調査して
```

![](https://images.ctfassets.net/in6v9lxmm5c8/QDBGpovZyrjIkGRJjFBqT/a74837c750daec1bef4cf59c673c907e/image.png)

When you run the `/deep-research` command, Claude Code asks for permission to run the workflow. This prompt explains the outline of the `/deep-research` command and the steps used for the research. It also warns that token usage will be high because many subagents run in parallel.

![](https://images.ctfassets.net/in6v9lxmm5c8/7LPeuOv819yMltDUBt5IJe/76390d0a680c99a774b15dd916c6fcb7/image.png)

### Checking the Code Used by `/deep-research`

Select "3. View raw script" to inspect the JavaScript code that will actually run as the Dynamic Workflow.

<details>
<summary>Code used by the `/deep-research` command</summary>

```js
export const meta = {
  name: "deep-research",
  description:
    "Deep research harness — fan-out web searches, fetch sources, adversarially verify claims, synthesize a cited report.",
  whenToUse:
    'When the user wants a deep, multi-source, fact-checked research report on any topic. BEFORE invoking, check if the question is specific enough to research directly — if underspecified (e.g., "what car to buy" without budget/use-case/region), ask 2-3 clarifying questions to narrow scope. Then pass the refined question as args, weaving the answers in.',
  phases: [
    {
      title: "Scope",
      detail: "Decompose question (from args) into 5 search angles",
    },
    { title: "Search", detail: "5 parallel WebSearch agents, one per angle" },
    {
      title: "Fetch",
      detail: "URL-dedup, fetch top 15 sources, extract falsifiable claims",
    },
    {
      title: "Verify",
      detail:
        "3-vote adversarial verification per claim (need 2/3 refutes to kill)",
    },
    {
      title: "Synthesize",
      detail: "Merge semantic dupes, rank by confidence, cite sources",
    },
  ],
};

// deep-research: Scope → pipeline(Search → URL-dedup → Fetch+Extract) → 3-vote Verify → Synthesize
// Ported from bughunter architecture. WebSearch/WebFetch instead of git/grep.
// Question is passed via Workflow({name: 'deep-research', args: '<question>'}).

const VOTES_PER_CLAIM = 3;
const REFUTATIONS_REQUIRED = 2;
const MAX_FETCH = 15;
const MAX_VERIFY_CLAIMS = 25;

// ─── Schemas ───
const SCOPE_SCHEMA = {
  type: "object",
  required: ["question", "angles", "summary"],
  properties: {
    question: { type: "string" },
    summary: { type: "string" },
    angles: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: {
        type: "object",
        required: ["label", "query"],
        properties: {
          label: { type: "string" },
          query: { type: "string" },
          rationale: { type: "string" },
        },
      },
    },
  },
};
const SEARCH_SCHEMA = {
  type: "object",
  required: ["results"],
  properties: {
    results: {
      type: "array",
      maxItems: 6,
      items: {
        type: "object",
        required: ["url", "title", "relevance"],
        properties: {
          url: { type: "string" },
          title: { type: "string" },
          snippet: { type: "string" },
          relevance: { enum: ["high", "medium", "low"] },
        },
      },
    },
  },
};
const EXTRACT_SCHEMA = {
  type: "object",
  required: ["claims", "sourceQuality"],
  properties: {
    sourceQuality: {
      enum: ["primary", "secondary", "blog", "forum", "unreliable"],
    },
    publishDate: { type: "string" },
    claims: {
      type: "array",
      maxItems: 5,
      items: {
        type: "object",
        required: ["claim", "quote", "importance"],
        properties: {
          claim: { type: "string" },
          quote: { type: "string" },
          importance: { enum: ["central", "supporting", "tangential"] },
        },
      },
    },
  },
};
const VERDICT_SCHEMA = {
  type: "object",
  required: ["refuted", "evidence", "confidence"],
  properties: {
    refuted: { type: "boolean" },
    evidence: { type: "string" },
    confidence: { enum: ["high", "medium", "low"] },
    counterSource: { type: "string" },
  },
};
const REPORT_SCHEMA = {
  type: "object",
  required: ["summary", "findings", "caveats"],
  properties: {
    summary: { type: "string" },
    findings: {
      type: "array",
      items: {
        type: "object",
        required: ["claim", "confidence", "sources", "evidence"],
        properties: {
          claim: { type: "string" },
          confidence: { enum: ["high", "medium", "low"] },
          sources: { type: "array", items: { type: "string" } },
          evidence: { type: "string" },
          vote: { type: "string" },
        },
      },
    },
    caveats: { type: "string" },
    openQuestions: { type: "array", items: { type: "string" } },
  },
};

// ─── Phase 0: Scope — decompose question into search angles ───
phase("Scope");
const QUESTION = (typeof args === "string" && args.trim()) || "";
if (!QUESTION) {
  return {
    error:
      "No research question provided. Pass it as args: Workflow({name: 'deep-research', args: '<question>'}).",
  };
}
const scope = await agent(
  "Decompose this research question into complementary search angles.\n\n" +
    "## Question\n" +
    QUESTION +
    "\n\n" +
    "## Task\n" +
    "Generate 5 distinct web search queries that together cover the question from different angles. Pick angles that suit the question's domain. Examples:\n" +
    "- broad/primary  · academic/technical  · recent news  · contrarian/skeptical  · practitioner/implementation\n" +
    "- For medical: anatomy · common causes · serious differentials · authoritative refs · red flags\n" +
    "- For tech: state-of-art · benchmarks · limitations · industry adoption · cost/tradeoffs\n\n" +
    "Make queries specific enough to surface high-signal results. Avoid redundancy.\n" +
    "Return: the question (verbatim or lightly normalized), a 1-2 sentence decomposition strategy, and the angles.\n\nStructured output only.",
  { label: "scope", schema: SCOPE_SCHEMA },
);
if (!scope) {
  return {
    error:
      "Scope agent returned no result — cannot decompose the research question.",
  };
}
log("Q: " + QUESTION.slice(0, 80) + (QUESTION.length > 80 ? "…" : ""));
log(
  "Decomposed into " +
    scope.angles.length +
    " angles: " +
    scope.angles.map((a) => a.label).join(", "),
);

// ─── Dedup state — accumulates across searchers as they complete ───
const normURL = (u) => {
  try {
    const p = new URL(u);
    return (
      p.hostname.replace(/^www\./, "") + p.pathname.replace(/\/$/, "")
    ).toLowerCase();
  } catch {
    return u.toLowerCase();
  }
};
const seen = new Map();
const dupes = [];
const budgetDropped = [];
const relRank = { high: 0, medium: 1, low: 2 };
let fetchSlots = MAX_FETCH;

// ─── Prompts ───
const SEARCH_PROMPT = (angle) =>
  "## Web Searcher: " +
  angle.label +
  "\n\n" +
  'Research question: "' +
  QUESTION +
  '"\n\n' +
  "Your angle: **" +
  angle.label +
  "** — " +
  (angle.rationale || "") +
  "\n" +
  "Search query: `" +
  angle.query +
  "`\n\n" +
  "## Task\nUse WebSearch with the query above (or a refined version). Return the top 4-6 most relevant results.\n" +
  "Rank by relevance to the ORIGINAL question, not just the search query. Skip obvious SEO spam/content farms.\n" +
  "Include a short snippet capturing why each result is relevant.\n\nStructured output only.";

const FETCH_PROMPT = (source, angle) =>
  "## Source Extractor\n\n" +
  'Research question: "' +
  QUESTION +
  '"\n\n' +
  "Fetch and extract key claims from this source:\n" +
  "**URL:** " +
  source.url +
  "\n**Title:** " +
  source.title +
  "\n**Found via:** " +
  angle +
  " search\n\n" +
  "## Task\n1. Use WebFetch to retrieve the page content.\n" +
  "2. Assess source quality: primary research/institution? secondary reporting? blog/opinion? forum? unreliable?\n" +
  "3. Extract 2-5 FALSIFIABLE claims that bear on the research question. Each claim must:\n" +
  "   - be a concrete, checkable statement (not vague generalities)\n" +
  "   - include a direct quote from the source as support\n" +
  "   - be rated central/supporting/tangential to the research question\n" +
  "4. Note publish date if available.\n\n" +
  'If the fetch fails or the page is irrelevant/paywalled, return claims: [] and sourceQuality: "unreliable".\n\nStructured output only.';

const VERIFY_PROMPT = (claim, v) =>
  "## Adversarial Claim Verifier (voter " +
  (v + 1) +
  "/" +
  VOTES_PER_CLAIM +
  ")\n\n" +
  "Be SKEPTICAL. Try to REFUTE this claim. ≥" +
  REFUTATIONS_REQUIRED +
  "/" +
  VOTES_PER_CLAIM +
  " refutations kill it.\n\n" +
  "## Research question\n" +
  QUESTION +
  "\n\n" +
  '## Claim under review\n"' +
  claim.claim +
  '"\n\n' +
  "**Source:** " +
  claim.sourceUrl +
  " (" +
  claim.sourceQuality +
  ")\n" +
  '**Supporting quote:** "' +
  claim.quote +
  '"\n\n' +
  "## Checklist\n" +
  "1. Is the claim actually supported by the quote, or is it an overreach/misread?\n" +
  "2. WebSearch for contradicting evidence — does any credible source dispute or heavily qualify this?\n" +
  "3. Is the source quality sufficient for the claim's strength? (extraordinary claims need primary sources)\n" +
  "4. Is the claim outdated? (check dates — old claims about fast-moving fields are suspect)\n" +
  "5. Is this a marketing claim / press release / cherry-picked benchmark / forum speculation?\n\n" +
  "**refuted=true** if: unsupported by quote / contradicted / low-quality source for strong claim / outdated / marketing fluff.\n" +
  "**refuted=false** ONLY if: claim is well-supported, current, and source quality matches claim strength.\n" +
  "Default to refuted=true if uncertain.\n\nStructured output only. Evidence MUST be specific.";

// ─── Pipeline: search → dedup → fetch+extract (no barrier) ───
const searchResults = await pipeline(
  scope.angles,

  (angle) =>
    agent(SEARCH_PROMPT(angle), {
      label: "search:" + angle.label,
      phase: "Search",
      schema: SEARCH_SCHEMA,
    }).then((r) => {
      if (!r) return null;
      log(angle.label + ": " + r.results.length + " results");
      return { angle: angle.label, results: r.results };
    }),

  (searchResult) => {
    const sorted = [...searchResult.results].sort(
      (a, b) => relRank[a.relevance] - relRank[b.relevance],
    );
    const novel = sorted.filter((r) => {
      const key = normURL(r.url);
      if (seen.has(key)) {
        dupes.push({ ...r, angle: searchResult.angle, dupOf: seen.get(key) });
        return false;
      }
      if (fetchSlots <= 0 && relRank[r.relevance] >= 1) {
        budgetDropped.push({ ...r, angle: searchResult.angle });
        return false;
      }
      seen.set(key, { angle: searchResult.angle, title: r.title });
      fetchSlots--;
      return true;
    });
    if (novel.length < searchResult.results.length) {
      log(
        searchResult.angle +
          ": " +
          novel.length +
          " novel (" +
          (searchResult.results.length - novel.length) +
          " filtered)",
      );
    }
    return parallel(
      novel.map((source) => () => {
        let host = "unknown";
        try {
          host = new URL(source.url).hostname.replace(/^www\./, "");
        } catch {}
        return agent(FETCH_PROMPT(source, searchResult.angle), {
          label: "fetch:" + host,
          phase: "Fetch",
          schema: EXTRACT_SCHEMA,
        })
          .then((ext) => {
            // User-skip → null; drop it (filtered by searchResults.flat().filter(Boolean))
            // rather than throwing into .catch() and mislabeling it "unreliable".
            if (!ext) return null;
            return {
              url: source.url,
              title: source.title,
              angle: searchResult.angle,
              sourceQuality: ext.sourceQuality,
              publishDate: ext.publishDate,
              claims: ext.claims.map((c) => ({
                ...c,
                sourceUrl: source.url,
                sourceQuality: ext.sourceQuality,
              })),
            };
          })
          .catch((e) => {
            log("fetch failed: " + source.url + " — " + (e.message || e));
            return {
              url: source.url,
              title: source.title,
              angle: searchResult.angle,
              sourceQuality: "unreliable",
              claims: [],
            };
          });
      }),
    );
  },
);

const allSources = searchResults.flat().filter(Boolean);
const allClaims = allSources.flatMap((s) => s.claims);
const impRank = { central: 0, supporting: 1, tangential: 2 };
const qualRank = { primary: 0, secondary: 1, blog: 2, forum: 3, unreliable: 4 };

const rankedClaims = [...allClaims]
  .sort(
    (a, b) =>
      impRank[a.importance] - impRank[b.importance] ||
      qualRank[a.sourceQuality] - qualRank[b.sourceQuality],
  )
  .slice(0, MAX_VERIFY_CLAIMS);

log(
  "Fetched " +
    allSources.length +
    " sources → " +
    allClaims.length +
    " claims → verifying top " +
    rankedClaims.length,
);

if (rankedClaims.length === 0) {
  return {
    question: QUESTION,
    summary:
      "No claims extracted. " +
      allSources.length +
      " sources fetched, all empty/failed. " +
      dupes.length +
      " URL dupes, " +
      budgetDropped.length +
      " budget-dropped.",
    findings: [],
    refuted: [],
    sources: allSources.map((s) => ({ url: s.url, quality: s.sourceQuality })),
    stats: {
      angles: scope.angles.length,
      sources: allSources.length,
      claims: 0,
      dupes: dupes.length,
    },
  };
}

// ─── Verify: 3-vote adversarial ───
// Barrier here is intentional — claim pool must be fully assembled before ranking/verification.
phase("Verify");
const voted = (
  await parallel(
    rankedClaims.map(
      (claim) => () =>
        parallel(
          Array.from(
            { length: VOTES_PER_CLAIM },
            (_, v) => () =>
              agent(VERIFY_PROMPT(claim, v), {
                label: "v" + v + ":" + claim.claim.slice(0, 40),
                phase: "Verify",
                schema: VERDICT_SCHEMA,
              }),
          ),
        ).then((verdicts) => {
          // A vote can be null (user-skip or agent error) — treat as abstain.
          const valid = verdicts.filter(Boolean);
          const refuted = valid.filter((v) => v.refuted).length;
          // Survive only if the claim was actually adjudicated: a quorum of
          // valid votes AND fewer than REFUTATIONS_REQUIRED refuting. Too many
          // abstentions = unverified, which must NOT pass into the report
          // (otherwise all-abstain → refuted=0 → false survive).
          const abstained = VOTES_PER_CLAIM - valid.length;
          const survives =
            valid.length >= REFUTATIONS_REQUIRED &&
            refuted < REFUTATIONS_REQUIRED;
          log(
            '"' +
              claim.claim.slice(0, 50) +
              '…": ' +
              (valid.length - refuted) +
              "-" +
              refuted +
              (abstained > 0 ? " (" + abstained + " abstain)" : "") +
              " " +
              (survives ? "✓" : "✗"),
          );
          return { ...claim, verdicts: valid, refutedVotes: refuted, survives };
        }),
    ),
  )
).filter(Boolean);

const confirmed = voted.filter((c) => c.survives);
const killed = voted.filter((c) => !c.survives);
log(
  "Verify done: " +
    voted.length +
    " claims → " +
    confirmed.length +
    " confirmed, " +
    killed.length +
    " killed",
);

if (confirmed.length === 0) {
  return {
    question: QUESTION,
    summary:
      "All " +
      voted.length +
      " claims refuted by adversarial verification. Research inconclusive — sources may be low-quality or claims overstated.",
    findings: [],
    refuted: killed.map((c) => ({
      claim: c.claim,
      vote: c.verdicts.length - c.refutedVotes + "-" + c.refutedVotes,
      source: c.sourceUrl,
    })),
    sources: allSources.map((s) => ({
      url: s.url,
      quality: s.sourceQuality,
      claimCount: s.claims.length,
    })),
    stats: {
      angles: scope.angles.length,
      sources: allSources.length,
      claims: allClaims.length,
      verified: voted.length,
      confirmed: 0,
      killed: killed.length,
    },
  };
}

// ─── Synthesize ───
phase("Synthesize");
const confRank = { high: 0, medium: 1, low: 2 };
const block = confirmed
  .map((c, i) => {
    const best = c.verdicts
      .filter((v) => !v.refuted)
      .sort((a, b) => confRank[a.confidence] - confRank[b.confidence])[0];
    return (
      "### [" +
      i +
      "] " +
      c.claim +
      "\n" +
      "Vote: " +
      (c.verdicts.length - c.refutedVotes) +
      "-" +
      c.refutedVotes +
      " · Source: " +
      c.sourceUrl +
      " (" +
      c.sourceQuality +
      ")\n" +
      'Quote: "' +
      c.quote +
      '"\nVerifier evidence (' +
      best.confidence +
      "): " +
      best.evidence +
      "\n"
    );
  })
  .join("\n");

const killedBlock =
  killed.length > 0
    ? "\n## Refuted claims (for transparency)\n" +
      killed
        .map(
          (c) =>
            '- "' +
            c.claim +
            '" (' +
            c.sourceUrl +
            ", vote " +
            (c.verdicts.length - c.refutedVotes) +
            "-" +
            c.refutedVotes +
            ")",
        )
        .join("\n")
    : "";

const report = await agent(
  "## Synthesis: research report\n\n" +
    "**Question:** " +
    QUESTION +
    "\n\n" +
    confirmed.length +
    " claims survived " +
    VOTES_PER_CLAIM +
    "-vote adversarial verification. Merge semantic duplicates and synthesize.\n\n" +
    "## Confirmed claims\n" +
    block +
    "\n" +
    killedBlock +
    "\n\n" +
    "## Instructions\n" +
    "1. Identify claims that say the same thing — merge them, combine their sources.\n" +
    "2. Group related claims into coherent findings. Each finding should directly address the research question.\n" +
    "3. Assign confidence per finding: high (multiple primary sources, unanimous votes), medium (secondary sources or split votes), low (single source or blog-quality).\n" +
    "4. Write a 3-5 sentence executive summary answering the research question.\n" +
    "5. Note caveats: what's uncertain, what sources were weak, what time-sensitivity applies.\n" +
    "6. List 2-4 open questions that emerged but weren't answered.\n\nStructured output only.",
  { label: "synthesize", schema: REPORT_SCHEMA },
);

if (!report) {
  // Synthesis skipped/errored — salvage the verified claims raw rather
  // than throwing on report.findings and discarding the whole run.
  return {
    question: QUESTION,
    summary:
      "Synthesis step was skipped or failed — returning " +
      confirmed.length +
      " verified claims unmerged.",
    findings: [],
    confirmed: confirmed.map((c) => ({
      claim: c.claim,
      source: c.sourceUrl,
      quote: c.quote,
      vote: c.verdicts.length - c.refutedVotes + "-" + c.refutedVotes,
    })),
    refuted: killed.map((c) => ({
      claim: c.claim,
      vote: c.verdicts.length - c.refutedVotes + "-" + c.refutedVotes,
      source: c.sourceUrl,
    })),
    sources: allSources.map((s) => ({
      url: s.url,
      quality: s.sourceQuality,
      claimCount: s.claims.length,
    })),
    stats: {
      angles: scope.angles.length,
      sources: allSources.length,
      claims: allClaims.length,
      verified: voted.length,
      confirmed: confirmed.length,
      killed: killed.length,
      afterSynthesis: 0,
    },
  };
}

return {
  question: QUESTION,
  ...report,
  refuted: killed.map((c) => ({
    claim: c.claim,
    vote: c.verdicts.length - c.refutedVotes + "-" + c.refutedVotes,
    source: c.sourceUrl,
  })),
  sources: allSources.map((s) => ({
    url: s.url,
    quality: s.sourceQuality,
    angle: s.angle,
    claimCount: s.claims.length,
  })),
  stats: {
    angles: scope.angles.length,
    sourcesFetched: allSources.length,
    claimsExtracted: allClaims.length,
    claimsVerified: voted.length,
    confirmed: confirmed.length,
    killed: killed.length,
    afterSynthesis: report.findings.length,
    urlDupes: dupes.length,
    budgetDropped: budgetDropped.length,
    agentCalls:
      1 +
      scope.angles.length +
      allSources.length +
      voted.length * VOTES_PER_CLAIM +
      1,
  },
};
```

</details>

Let's briefly look at the code. The overall flow is divided into the following five phases:

- Scope: Break the user's question into five different angles
- Search: Run five search agents in parallel, one for each angle
- Fetch: Deduplicate URLs, fetch the top 15 sources, and extract falsifiable claims
- Verify: Run three-vote adversarial verification for each claim and reject claims with two or more refutations
- Synthesize: Merge verified claims, evaluate confidence, and generate the final report

In the Scope phase, the command argument is received through `args` and passed to `agent`, instructing it to break the question into multiple angles. It is interesting that each phase is separated with `phase("phase name")`.

```js
phase("Scope");
const QUESTION = (typeof args === "string" && args.trim()) || "";

const scope = await agent(
  "Decompose this research question.." + "## Question\n" + QUESTION,
  { schema: SCOPE_SCHEMA },
);
```

`SCOPE_SCHEMA` is a JSON Schema that defines the expected output structure for this phase. This requires the agent to return structured data, making it easier for later phases to use that data.

```js
const SCOPE_SCHEMA = {
  type: "object",
  required: ["question", "angles", "summary"],
  properties: {
    question: { type: "string" },
    summary: { type: "string" },
    angles: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: {
        type: "object",
        required: ["label", "query"],
        properties: {
          label: { type: "string" },
          query: { type: "string" },
          rationale: { type: "string" },
        },
      },
    },
  },
};
```

In the Search and Fetch phases, `pipeline` is used to run multiple agents in sequence. `pipeline` is a utility function for passing the output of one agent as the input to the next. Here, search agents are run in parallel for each angle in `scope.angles`.

```js
const searchResults = await pipeline(
  scope.angles,
  (angle) => agent(SEARCH_PROMPT(angle), { schema: SEARCH_SCHEMA }),
  ...,

  (searchResult) => {
    // Deduplicate URLs, manage fetch slots, and perform related processing
    return parallel(
      novel.map((source) => () =>
        agent(FETCH_PROMPT(source, searchResult.angle), { schema: EXTRACT_SCHEMA }),
      ),
    );
  },
);
```

In the Verify phase, multiple verification agents run in parallel for each claim, and each verification agent attempts to refute it. If at least two out of three agents refute the claim, the claim is rejected.

```js
const VOTES_PER_CLAIM = 3;
const REFUTATIONS_REQUIRED = 2;

await parallel(rankedClaims.map((claim) => () =>
  parallel(Array.from({ length: VOTES_PER_CLAIM }, (_, v) => () =>
    agent(VERIFY_PROMPT(claim, v), { schema: VERDICT_SCHEMA })
  )).then((verdicts) => {
    const survives = valid.length >= REFUTATIONS_REQUIRED && refuted < REFUTATIONS_REQUIRED;
    ...
  })
));
```

Finally, in the Synthesize phase, the claims that passed verification are merged to generate the final report.

```js
const report = await agent("## Synthesis: research report\n\n...", {
  schema: REPORT_SCHEMA,
});
```

### Running the Workflow and Checking Progress

Now that we have inspected the script, let's actually run the `/deep-research` command. Select "1. Yes, run it" to start the workflow. The workflow runs in the background, and a small progress indicator appears at the bottom of the terminal. Run the `/workflows` command to see more detailed progress. You can use the up and down arrow keys to switch between workflow steps.

![](https://images.ctfassets.net/in6v9lxmm5c8/6cW1KDnSpUpfl5mB85vkoT/ed6ba5ae4c9e32ef525a4634a06d3558/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-05-29_20.09.32.png)

You can also inspect the output from each agent. For example, the output from an agent in the Search phase shows which URLs it accessed and what results it found.

![](https://images.ctfassets.net/in6v9lxmm5c8/1kayNP9BHprVogmbEZ3NVq/ee15d8f749c9229bb22b92c5a4c7c599/image.png)

When the workflow completes, the final report is displayed. In my actual run, however, I hit the rate limit and could not confirm the report output.

## Having Claude Write a Workflow

After trying the built-in Dynamic Workflow, let's have Claude write a workflow. There are two ways to have Claude create a workflow:

1. Include the word "workflow" in the prompt when instructing the agent
2. Use `/effort ultracode` to enable xhigh-equivalent reasoning and automatic Dynamic Workflow decisions

Here, I will try the method of including the word "workflow" in the prompt. I will ask Claude to create a workflow for replacing ESLint + Prettier with Oxlint + Oxfmt in a project.

```txt
プロジェクトの ESLint + Prettier を Oxlint + Oxfmt に置き換える workflow を作成して
```

You can see that the word "workflow" is highlighted in rainbow colors. This is the keyword for creating a workflow. When the session will run as a Dynamic Workflow, Claude Code also shows the message "Dynamic workflow requested for this turn · meta+w to ignore."

![](https://images.ctfassets.net/in6v9lxmm5c8/2XO26crpoxK3vBNxIN1YOa/bf7dcdb6d24eae546db90a018082c325/image.png)

Claude understood the overall project structure and generated the workflow as JavaScript code. Select "View raw script" to inspect the generated code.

```js
export const meta = {
  name: "migrate-eslint-prettier-to-oxlint-oxfmt",
  description:
    "ESLint + Prettier を Oxlint + Oxfmt に置き換える monorepo 全体の移行",
  phases: [
    { title: "Research", detail: "Oxlint/Oxfmt の状態を調査" },
    { title: "Plan", detail: "移行計画を策定" },
    { title: "Migrate Root", detail: "ルートと共有パッケージを移行" },
    { title: "Migrate App", detail: "app ワークスペースを移行" },
    { title: "Migrate Packages", detail: "各 packages/* を移行" },
    { title: "Verify", detail: "移行後の動作を確認" },
  ],
};
```

If the generated workflow looks good, you can run it as is. While the workflow is running, run the `/workflows` command and press `s` to save the workflow for reuse. Workflows can be saved at the project level (`.claude/workflows`) or the user level (`~/.claude/workflows`), and can later be run as commands.

For example, if you save a workflow named `migrate-eslint-prettier-to-oxlint-oxfmt`, you can reuse it by running the following command:

```txt
/migrate-eslint-prettier-to-oxlint-oxfmt
```

## Summary

- Dynamic Workflow lets you break complex tasks into multiple steps and run them
- Workflows are defined in JavaScript, and each step runs by passing prompts to agents
- You can try built-in workflows or have Claude create workflows for you
- You can check workflow progress and each step's output with the `/workflows` command
- Workflows can be saved at the project or user level and reused later as commands

## References

- [Introducing dynamic workflows | Claude](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code)
- [Orchestrate subagents at scale with dynamic workflows - Claude Code Docs](https://code.claude.com/docs/en/workflows)
