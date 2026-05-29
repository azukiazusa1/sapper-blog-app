---
id: LpFl_88dN6xV2XXV_8yUo
title: "Claude Code の Dynamic Workflow を試してみた"
slug: "claude-code-dynamic-workflow"
about: "Claude Code v2.1.154 で Dynamic Workflow と呼ばれる機能が追加されました。Dynamic Workflow は数時間から数日かかるような大規模な作業を実行するために設計されています。ワークフローは JavaScript で定義され、複数のサブエージェントをオーケストレーションすることができます。この記事では Claude Code の Dynamic Workflow を試してみた様子を紹介します。"
createdAt: "2026-05-29T19:20+09:00"
updatedAt: "2026-05-29T19:20+09:00"
tags: ["claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3aJ5BsDvvLfsHdlA1cntHE/d2411e9e2aea84823f6ae6f51900f485/ikura-tsutsumi_sushi_21470-768x542.png"
  title: "いくらつつみのお寿司のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Claude にワークフローを作成し、実行してもらう方法として、記事で挙げられているものはどれですか?"
      answers:
        - text: "プロンプトに「workflow」という単語を含める"
          correct: true
          explanation: "記事では、プロンプトに「workflow」という単語を含める方法が紹介されています。"
        - text: "`/workflow create` コマンドを実行する"
          correct: false
          explanation: "記事ではそのようなコマンドは紹介されていません。"
        - text: "JavaScript ファイルを手動で `.claude/workflows` に配置する"
          correct: false
          explanation: "記事では `.claude/workflows` に配置する方法ではなく、Claude にワークフローを作成してもらう方法を説明しています。"
        - text: "ワークフローを実行する特別な操作は不要"
          correct: false
          explanation: "通常のセッションでは Dynamic Workflow として実行されません。"

published: true
---

Claude Code v2.1.154 で Dynamic Workflow と呼ばれる機能が追加されました。Dynamic Workflow は数時間から数日かかるような大規模な作業を実行するために設計されています。最近では [Bun を Zig から Rust に移植するプロジェクト](https://github.com/oven-sh/bun/pull/30412) が話題を呼びましたが、このプロジェクトにおいても Dynamic Workflow が利用されていたようです。

https://x.com/jarredsumner/status/2060050578026189172

Dynamic Workflow は複数のサブエージェントをオーケストレーションするための JavaScript スクリプトのことです。ワークフローが開始されると計画をコードに変換します。Claude はタスクに応じてワークフローのスクリプトを生成し、実行時にはそのスクリプトとランタイムがサブエージェントの実行順序や中間結果を管理します。計画をコード化することにより、単にエージェントの数を増やすだけでなく、再現可能なパターンを適用できるようになります。また独立したエージェントが互いの調査結果を報告前に競合的にレビューしたり、複数の角度から計画を立案して比較検討したりすることで、単一の処理よりも信頼性の高い結果を得ることができます。

Dynamic Workflow は通常のセッションと比較して大幅に多くのリソースを消費するため、利用する際には注意が必要です。そのため Dynamic Workflow が実行される前に事前に確認を求められたり、管理者設定により無効にできるようになっています。

この記事では Claude Code の Dynamic Workflow を試してみた様子を紹介します。

## 組み込みの Dynamic Workflow を試してみる

組み込みの Dynamic Workflow として `/deep-research` コマンドが提供されているので、まずはこれを試してみます。`/deep-research` コマンドは、ユーザーが提供したトピックに関する深い調査を行うための Dynamic Workflow で、エージェントがバックグラウンドで一連のフェーズを処理する様子を確認できます。

ワークフローを実行する場合 `Dynamic workflows` オプションが `true` になっていることを確認してください。`/config` コマンドで確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7ci3t1P4EsOjZoMWvduZpk/b829af245f42325b4e05af8164ec42ac/image.png)

`/deep-research` コマンドの引数には調査したいトピックを入力します。例えば最近話題の「Hermes Agent」について調査してもらいます。

```txt
/deep-research Hermes Agent について何ができるか、Open Claw との違いはなにか、ユースケースはなにか、などを調査して
```

![](https://images.ctfassets.net/in6v9lxmm5c8/QDBGpovZyrjIkGRJjFBqT/a74837c750daec1bef4cf59c673c907e/image.png)

`/deep-research` コマンドを実行すると、ワークフローを実行する許可が求められます。ここでは `/deep-research` コマンドの概要と、どのようなステップで調査が行われるのかが説明されます。そのうえで「多数のサブエージェントを並列実行するためトークン消費が多い」という注意事項も説明されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7LPeuOv819yMltDUBt5IJe/76390d0a680c99a774b15dd916c6fcb7/image.png)

### `/deep-research` コマンドのコードを確認する

「3. View raw script」を選択すると、実際に実行される Dynamic Workflow の JavaScript コードを確認できます。

<details>
<summary>`/deep-research` コマンドで使用されるコード</summary>

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

簡単にコードを見てみましょう。全体の流れは以下の 5 つのフェーズに分かれています。

- Scope: ユーザーの質問を 5 つの異なる角度に分解する
- Search: 各角度に 1 つずつ、計 5 つの検索エージェントを並列実行
- Fetch: 重複 URL を除いたうえで上位 15 ソースを取得し、検証可能な主張を抽出
- Verify: 各主張に対して 3 票制の敵対的検証を実施し、2 票以上の反証があれば主張を却下
- Synthesize: 検証済みの主張を統合し、信頼度を評価して最終的なレポートを生成

Scope フェーズでは `args` でコマンド引数を受けとり、`agent` に渡して質問を複数の角度に分解するよう指示しています。それぞれのフェーズは `phase("フェーズ名")` で区切られているのが面白いですね。

```js
phase("Scope");
const QUESTION = (typeof args === "string" && args.trim()) || "";

const scope = await agent(
  "Decompose this research question.." + "## Question\n" + QUESTION,
  { schema: SCOPE_SCHEMA },
);
```

`SCOPE_SCHEMA` はこのフェーズの出力がどのような構造になるべきかを定義した JSON Schema です。これによりエージェントは構造化されたデータを返すことが求められ、後続のフェーズでそのデータを利用しやすくなります。

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

Search, Fetch フェーズでは `pipeline` を使って複数のエージェントを順次実行しています。`pipeline` は前のエージェントの出力を次のエージェントの入力として渡すためのユーティリティ関数です。ここでは `scope.angles` の各角度に対して検索エージェントを並列に実行しています。

```js
const searchResults = await pipeline(
  scope.angles,
  (angle) => agent(SEARCH_PROMPT(angle), { schema: SEARCH_SCHEMA }),
  ...,

  (searchResult) => {
    // 重複URLの除外やフェッチのスロット管理などの処理
    return parallel(
      novel.map((source) => () =>
        agent(FETCH_PROMPT(source, searchResult.angle), { schema: EXTRACT_SCHEMA }),
      ),
    );
  },
);
```

Verify フェーズでは、各主張に対して複数の検証エージェントを並列に実行し、検証エージェントがそれぞれ反論を試みます。2/3 以上の反論があればその主張は却下されます。

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

最後に Synthesize フェーズでは、検証を通過した主張を統合して最終的なレポートを生成します。

```js
const report = await agent("## Synthesis: research report\n\n...", {
  schema: REPORT_SCHEMA,
});
```

### ワークフローを実行し、進行状況を確認する

スクリプトの内容が確認できたので、次は実際に `/deep-research` コマンドを実行してみましょう。「1. Yes, run it」を選択してワークフローを開始します。ワークフローはバックグラウンドで実行され、進行状況はターミナルの一番下に小さく表示されています。`/workflows` コマンドを実行すると、ワークフローの詳細な進行状況を確認できます。上下の矢印キーでワークフローのステップを切り替えることができます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6cW1KDnSpUpfl5mB85vkoT/ed6ba5ae4c9e32ef525a4634a06d3558/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-05-29_20.09.32.png)

それぞれのエージェントの出力も確認できます。例えば Search フェーズのエージェントの出力ではどの URL にアクセスして、どのような結果が得られたのかが確認できますね。

![](https://images.ctfassets.net/in6v9lxmm5c8/1kayNP9BHprVogmbEZ3NVq/ee15d8f749c9229bb22b92c5a4c7c599/image.png)

ワークフローが完了すると、最終的なレポートが表示されます。なお、実際に実行した場合はレートリミットに達してしまいレポートの出力までは確認できませんでした。

## ワークフローを Claude に書いてもらう

組み込みの Dynamic Workflow を試したあとは、実際に自分でワークフローを書いてみましょう。Claude にワークフローを作成してもらうためには以下の 2 つの方法があります。

1. プロンプトに「workflow」という単語を含めてエージェントに指示する
2. `/effort ultracode` で、xhigh 相当の推論と Dynamic Workflow の自動判断を有効にする

ここではプロンプトに「workflow」という単語を含めてワークフローを作成してもらう方法を試してみます。ここではプロジェクトの ESLint + Prettier を Oxlint + Oxfmt に置き換えるワークフローを作成してもらうよう指示してみます。

```txt
プロジェクトの ESLint + Prettier を Oxlint + Oxfmt に置き換える workflow を作成して
```

「workflow」という単語が虹色にハイライトされているのがわかりますね。これがワークフローを作成するためのキーワードになります。このセッションが Dynamic Workflow として実行される場合は「Dynamic workflow requested for this turn · meta+w to ignore」というメッセージも表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2XO26crpoxK3vBNxIN1YOa/bf7dcdb6d24eae546db90a018082c325/image.png)

Claude はプロジェクトの全体構造を把握したうえ、JavaScript コードとしてワークフローを生成してくれました。「View raw script」を選択すると、実際に生成されたコードを確認できます。

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

作成されたワークフローに問題がなければ、このままワークフローを実行してもらえます。ワークフローの実行中に `/workflows` コマンドを実行して `s` キーを押すと、ワークフローを保存して再利用できるようになります。ワークフローはプロジェクト単位（`.claude/workflows`）もしくはユーザー単位（`~/.claude/workflows`）で保存され、後からコマンドとして実行できるようになります。

例えば `migrate-eslint-prettier-to-oxlint-oxfmt` という名前でワークフローを保存した場合は、以下のようにコマンドを実行することでワークフローを再利用できます。

```txt
/migrate-eslint-prettier-to-oxlint-oxfmt
```

## まとめ

- Dynamic Workflow を使うと、複雑なタスクを複数のステップに分解して実行できる
- ワークフローは JavaScript で定義され、各ステップはエージェントにプロンプトを渡して実行される
- 組み込みのワークフローを試したり、Claude にワークフローを作成してもらうことができる
- ワークフローの進行状況や各ステップの出力は `/workflows` コマンドで確認できる
- ワークフローはプロジェクト単位もしくはユーザー単位で保存して再利用できる。保存したワークフローはコマンドとして実行できる

## 参考

- [Introducing dynamic workflows | Claude](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code)
- [Orchestrate subagents at scale with dynamic workflows - Claude Code Docs](https://code.claude.com/docs/en/workflows)
