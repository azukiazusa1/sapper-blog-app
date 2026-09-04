---
id: AVasiBknZlj_ckQazeOZ7
title: "Updating GitHub Actions Along with Your Packages Using pnpm update"
slug: "pnpm-update-include-github-actions"
about: "Pinning GitHub Actions to full commit SHAs improves security but makes updates tedious. `pnpm update --include-github-actions`, added in pnpm 11.16.0, updates packages and Actions with a single command. This article covers the basics."
createdAt: "2026-09-04T22:05+09:00"
updatedAt: "2026-09-04T22:05+09:00"
tags: ["pnpm", "GitHub Actions"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/13Ynb8hJLzFJTCbYUL3hpn/1e81365ce5acc437c2c33b443251002a/sanma_yakizakana_7383-768x547.png"
  title: "サンマの塩焼きのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Which of the following correctly describes how an Action is written after `pnpm update --include-github-actions` updates it?"
      answers:
        - text: "Only the release tag is replaced with a newer tag"
          correct: false
          explanation: "pnpm does not just write a release tag—it replaces the reference with a full commit SHA."
        - text: "It is pinned to a full commit SHA, with the release tag left behind as a comment"
          correct: true
          explanation: "The full commit SHA is set in `uses`, and the corresponding release tag remains as a trailing comment."
        - text: "It is pinned to a branch name, with the commit SHA left as a comment"
          correct: false
          explanation: "Branch names are never used as update targets. The commit SHA becomes the reference itself, and the release tag becomes the comment."
        - text: "The Action's version is recorded only in `pnpm-lock.yaml`"
          correct: false
          explanation: "Action references are written directly into the `uses` key of the workflow. They are not managed in `pnpm-lock.yaml` alone."
    - question: "Which command does this article use to update a v4 Action to the latest major version?"
      answers:
        - text: "`pnpm update --include-github-actions`"
          correct: false
          explanation: "This command alone selects the latest version within the current major version."
        - text: "`pnpm update --latest`"
          correct: false
          explanation: "By default, `--latest` alone does not include GitHub Actions."
        - text: "`pnpm update --latest --include-github-actions`"
          correct: true
          explanation: "`--include-github-actions` adds Actions to the update targets, and `--latest` allows updates across major versions."
        - text: "`pnpm outdated --include-github-actions`"
          correct: false
          explanation: "`pnpm outdated` displays update candidates, but it does not rewrite workflows."

published: true
---

In GitHub Actions workflows, you specify the version of an Action with the `uses` key, as shown below. For security reasons, pinning to a full commit SHA rather than a tag is recommended.

```yaml:.github/workflows/ci.yml
steps:
  - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4.4.0
  - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0
```

When a bug fix or security fix lands after an Action's release, you need to update the version written in your workflow as well. It would be convenient to manage dependencies in a single place, the way `package.json` and `pnpm-lock.yaml` do, but GitHub Actions versions are written directly into YAML files, which tends to make updating them tedious.

The [`--include-github-actions`](https://pnpm.io/cli/update#--include-github-actions) option, added in pnpm 11.16.0, lets you update your packages and your GitHub Actions dependencies with the same command. Updated Actions are pinned to a full commit SHA, with the corresponding release tag preserved as a comment.

This article walks through the basics of `pnpm update --include-github-actions`.

## Trying out `--include-github-actions`

Let's use the following workflow to see how it behaves. It specifies `actions/checkout@v4.0.0` and `actions/setup-node@v4.0.0`, both older than the latest versions available at the time of writing.

```yaml:.github/workflows/ci.yml
name: CI

on:
  push:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4.0.0
      - uses: actions/setup-node@v4.0.0
        with:
          node-version: 24
      - run: npm test
```

Running `pnpm update` without any options leaves the workflow untouched.

```bash
pnpm update
```

To include GitHub Actions in the update, pass `--include-github-actions`.

```bash
pnpm update --include-github-actions
```

Running the command changed the workflow as follows.

```diff:.github/workflows/ci.yml
     steps:
-      - uses: actions/checkout@v4.0.0
-      - uses: actions/setup-node@v4.0.0
+      - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4.4.0
+      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0
         with:
           node-version: 24
```

The tags in `uses` have been replaced with 40-character commit SHAs, and the release tags have been added as comments. pnpm runs `git ls-remote` against the referenced repository to retrieve the mapping between tags and commits, then picks a stable release as the update target.

!> Actions whose refs cannot be retrieved are skipped with a warning—this includes Actions in private repositories. Actions referenced by branch (`actions/checkout@main`), local Actions (`./.github/actions/foo`), and Docker images (`docker://alpine:3.18`) are also left alone. Only workflows under `.github/workflows` are scanned, so a `uses` key written in a composite Action's `action.yml` will not be updated.

### Use `--latest` to update major versions

Just as a regular `pnpm update` respects the version ranges in `package.json`, `--include-github-actions` on its own will not bump an Action across major versions. At the time of writing, the v7 line had already been released, yet v4.4.0—the latest release in the v4 line—was chosen.

To update to the latest stable version including major version bumps, combine it with `--latest`.

```bash
pnpm update --latest --include-github-actions
```

Running that command produced the following versions.

```diff:.github/workflows/ci.yml
     steps:
-      - uses: actions/checkout@v4.0.0
-      - uses: actions/setup-node@v4.0.0
+      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
+      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
         with:
           node-version: 24
```

Major version updates may include breaking changes, so make sure to verify that your workflow still works afterward.

## Checking update candidates without changing files

If you want to review the candidates before modifying any files, you can pass `--include-github-actions` to [`pnpm outdated`](https://pnpm.io/cli/outdated) as well.

```bash
pnpm outdated --include-github-actions
```

Running it against the workflow produced the following output.

```text
┌────────────────────────────────────┬──────────────────────┬────────┐
│ Package                            │ Current              │ Latest │
├────────────────────────────────────┼──────────────────────┼────────┤
│ actions/checkout (github action)   │ 4.0.0 (wanted 4.4.0) │ 7.0.1  │
├────────────────────────────────────┼──────────────────────┼────────┤
│ actions/setup-node (github action) │ 4.0.0 (wanted 4.4.0) │ 7.0.0  │
└────────────────────────────────────┴──────────────────────┴────────┘
```

The `Current` column shows the release currently in use, along with the release available within the current major version (`wanted`) in parentheses. `Latest` is the newest stable version regardless of major version. Reviewing this output helps you decide whether to run a regular update or use `--latest`.

## Enabling it permanently in a configuration file

If you would rather not pass the option every time and always want GitHub Actions checked, set [`update.githubActions`](https://pnpm.io/settings/dependency-resolution#updategithubactions) to `true` in `pnpm-workspace.yaml`.

```yaml:pnpm-workspace.yaml
update:
  githubActions: true
```

With this setting in place, plain `pnpm update` and `pnpm outdated` will include GitHub Actions as well.

If your Actions are hosted on a GitHub Enterprise Server, pnpm 11.17.0 and later let you specify the server URL via `update.githubActionsServer`.

```yaml:pnpm-workspace.yaml
update:
  githubActions: true
  githubActionsServer: "https://github.example.com"
```

If the `GITHUB_SERVER_URL` environment variable is set, its value is used as well. When neither is present, pnpm connects to `https://github.com`.

## Summary

- `pnpm update --include-github-actions` updates the GitHub Actions referenced by your workflows in addition to your packages
- Updated Actions are pinned to a commit SHA, with the corresponding release tag preserved as a comment
- `--include-github-actions` alone updates within the current major version; combining it with `--latest` updates to the latest major version
- `pnpm outdated --include-github-actions` lets you compare the current version, the version available within the current major version, and the latest version without changing any files
- Setting `update.githubActions: true` makes `pnpm update` and `pnpm outdated` always check GitHub Actions

## References

- [pnpm update](https://pnpm.io/cli/update)
- [pnpm outdated](https://pnpm.io/cli/outdated)
- [Updating GitHub Actions - pnpm](https://pnpm.io/cli/update#updating-github-actions)
- [pnpm 11.16](https://github.com/pnpm/pnpm/releases/tag/v11.16.0)
- [pnpm 11.17](https://github.com/pnpm/pnpm/releases/tag/v11.17.0)
- [GitHub Actions - Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)
