---
id: ag0ptP_CfHeRmUcVHCx5c
title: "Locking GitHub Actions Dependencies with a Lockfile"
slug: "github-actions-workflow-lockfiles"
about: "Tags and branches in GitHub Actions can change the code that runs without any workflow change. Workflow dependency lockfiles pin dependencies to commit SHAs while keeping readable tags. This article shows how to use them."
createdAt: "2026-10-15T09:49+09:00"
updatedAt: "2026-10-15T09:49+09:00"
tags: ["GitHub Actions"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4p5ZkulBOaXyc0mr2G0eMO/446fd78f08aeecbe64c977040a37a012/kalbi-nigiri-sushi_21408-768x591.png"
  title: "カルビの握り寿司のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "When using Workflow dependency lockfiles, where is the commit of the Action to run managed?"
      answers:
        - text: "Only by the tag in the workflow"
          correct: false
          explanation: "The tag alone is not enough; the commit to run is recorded in the lockfile."
        - text: "By the commit field in actions.lock"
          correct: true
          explanation: "The workflow keeps its tag notation, and the commit to run is recorded in the lockfile's commit field."
        - text: "Only by the Dependabot configuration"
          correct: false
          explanation: "Dependabot helps with updates, but the lockfile manages the commit that runs."
        - text: "It is chosen from the latest release at runtime"
          correct: false
          explanation: "It does not automatically follow the latest release; the pinned commit is what runs."
    - question: "Which command checks for missing reference updates without a network connection?"
      answers:
        - text: "gh actions-lock --verify"
          correct: false
          explanation: "--verify accesses GitHub to verify the pinned references."
        - text: "gh actions-lock --relock"
          correct: false
          explanation: "--relock re-resolves existing references."
        - text: "gh actions-lock --verify-local"
          correct: true
          explanation: "--verify-local checks offline that each reference has a matching lockfile entry."
        - text: "gh actions-lock --no-narrow"
          correct: false
          explanation: "--no-narrow is an option that disables narrowing of partial version refs."
    - question: "What does gh actions-lock --relock do?"
      answers:
        - text: "Re-resolves existing references and updates their commits"
          correct: true
          explanation: "It re-resolves existing references to reflect branches or partial tags that have moved."
        - text: "Changes every reference to the latest major version"
          correct: false
          explanation: "--relock does not pick new version tags."
        - text: "Only checks whether entries exist, without using the network"
          correct: false
          explanation: "Use --verify-local for an offline coverage check."
        - text: "Only reports inconsistencies without changing the workflow"
          correct: false
          explanation: "Use --verify for a read-only check."
published: true
---

When you use an Action in GitHub Actions, you can specify its version with a tag, as in `uses: actions/checkout@v6`. However, the commit that a tag or branch points to can change later, so the code that runs may differ from the code you had in mind when you chose the version. This opens the door to malicious code being executed. In fact, in March 2025, the tags of `tj-actions/changed-files` were rewritten to point to a malicious commit, and many workflows referencing those tags leaked CI secrets into their logs.

One countermeasure is to write the full commit SHA in `uses`. Because a SHA alone doesn't tell you the version, it has been common practice to add the version as a comment, as in `uses: actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803 # v6.1.0`. However, there is no guarantee that the comment matches the actual SHA, and pinning a SHA doesn't necessarily pin the other Actions that the Action calls internally.

With [Workflow dependency lockfiles](https://docs.github.com/en/actions/concepts/security/workflow-dependency-lockfiles), you can keep tag notation in your workflows while managing the commits to run in a separate file. This article shows how to lock GitHub Actions dependencies with a lockfile.

!> As of October 15, 2026, this feature is in public preview.

## How the lockfile works

The lockfile lives at `.github/workflows/actions.lock`. It registers the dependencies used by each workflow and records the commit SHA that each reference resolved to. For registered workflows, GitHub Actions runs the recorded commit.

Unlike a plain tag reference, the workflow does not automatically follow new code when a tag moves. If a tag has merely moved, the recorded commit still runs as is. However, if the recorded commit or the referenced repository can no longer be trusted, verification fails and the workflow cannot run. Specifically, this happens when:

- The recorded commit is no longer reachable from any branch of the referenced repository, for example because history was rewritten by a force push
- The referenced repository has been deleted or is no longer accessible
- A repository with the same name has been replaced by a different repository whose ID differs from the recorded one

Note that when the ID stays the same, as with a repository rename or transfer, the redirect is followed and the recorded commit runs.

The lockfile also covers "transitive dependencies," such as an Action that calls another Action. On the other hand, when you call a reusable workflow, the dependencies inside it must be managed by the lockfile of the repository where it is defined.

## Generating a lockfile with `gh actions-lock`

The lockfile is generated with [`gh-actions-lock`](https://github.com/github/gh-actions-lock), a GitHub CLI extension. Install the extension with the following commands.

```bash
gh extension install github/gh-actions-lock --pin v0.2.0
gh actions-lock --version
```

As a minimal example, prepare the following workflow.

```yaml:.github/workflows/ci.yml
name: Lockfile example
on: workflow_dispatch
permissions:
  contents: read
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: echo 'Lockfile example'
```

Run the following command at the root of the repository.

```bash
gh actions-lock
```

This command scans the workflows under `.github/workflows/` and generates the lockfile. If you want to adopt it gradually, starting with specific workflows, you can pass a path, as in `gh actions-lock .github/workflows/ci.yml`.

Running the command produces output like this:

```text
Pinned 1 action across 1 workflow
  actions/checkout@v6.1.0 (d23441a)
    └─ .github/workflows/ci.yml
```

The generated lockfile looks like this:

```yaml:.github/workflows/actions.lock
# This file is machine-generated by `gh actions-lock`.
# Do not edit by hand; run `gh actions-lock` to update.
# Docs: https://gh.io/actions-lockfile
version: 'v0.0.3'
workflows:
    '.github/workflows/ci.yml':
        - 'actions/checkout@v6.1.0'
dependencies:
    'actions/checkout@v6.1.0':
        ref: 'v6.1.0'
        commit: 'sha1-d23441a48e516b6c34aea4fa41551a30e30af803'
        owner_id: 44036562
        repo_id: 197814629
```

`workflows` records the registered workflows and their dependencies, and `dependencies` records information about each referenced target. `commit` is the commit that runs. `owner_id` and `repo_id` are IDs used to confirm that a repository with the same name hasn't been replaced by a different one.

The workflow's `uses` also changed as follows:

```diff:.github/workflows/ci.yml
-      - uses: actions/checkout@v6
+      - uses: actions/checkout@v6.1.0
```

When pinning a partial version ref for the first time, the extension narrows it to a specific version tag. To disable this, pass `--no-narrow`.

### Actions in the same repository are rewritten to `$/`

`uses` is also rewritten when it references an Action in the same repository, as in `uses: ./.github/actions/hello`. Let's run `gh actions-lock` on a workflow that calls a local composite action like this:

```yaml:.github/workflows/ci.yml
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: ./.github/actions/hello
```

Running it prints `Migrated 1 local action to $/…`, and the workflow changes as follows:

```diff:.github/workflows/ci.yml
-      - uses: actions/checkout@v6
-      - uses: ./.github/actions/hello
+      - uses: actions/checkout@v6.1.0
+      - uses: $/.github/actions/hello
```

The rewrite is needed because `./` and `$/` point to different things.

`./` refers to files in the workspace at runtime. The contents of the workspace depend on the ref fetched by the preceding `actions/checkout` and on whatever earlier steps did, so the lockfile cannot pin which code runs. That's why workflows containing `./` cannot be registered in the lockfile.

`$/`, on the other hand, is a notation that resolves the Action from the running commit of the repository where it is defined. Because the target is always the same commit as the workflow itself, it is considered pinned without needing a lockfile entry. You cannot append a ref such as `@v1` after `$/`. Like `./`, the path is specified from the repository root.

## Detecting mismatches between the lockfile and workflows

If you change a dependency but forget to update the lockfile, you can catch it with the verification command.

```bash
gh actions-lock --verify
```

`--verify` does not modify any files; it accesses GitHub to verify the pinned references. Running `gh actions-lock --verify --json` on the freshly generated sample produced the following JSON:

```json
{
  "cli_version": "v0.2.0",
  "findings": [],
  "lockfile_version": "v0.0.3",
  "valid": true,
  "workflows": [
    {
      "path": ".github/workflows/ci.yml",
      "valid": true,
      "findings": [],
      "dependencies": [
        {
          "nwo": "actions/checkout",
          "ref": "v6.1.0",
          "sha": "d23441a48e516b6c34aea4fa41551a30e30af803",
          "hash_algo": "sha1",
          "direct": true
        }
      ]
    }
  ]
}
```

If `valid` is `true` and `findings` is an empty array, everything is fine. `direct` in `dependencies` indicates whether the dependency is referenced directly from the workflow. Transitive dependencies called internally by an Action, if any, appear as entries with `direct` set to `false`.

To check only whether each workflow reference has a matching entry, without using the network, use the following command.

```bash
gh actions-lock --verify-local
```

If you change only the workflow to `actions/checkout@v6.0.0`, the mismatch is detected as follows:

```text
✗ Ref changed actions/checkout@v6.0.0
  workflow uses ref "v6.0.0" but lockfile pins "v6.1.0"
✗ Unused lockfile entry actions/checkout@v6.1.0
  lockfile pins actions/checkout@v6.1.0 but no uses: in this workflow references it
```

`--verify-local` is handy for catching missed updates locally, but it does not check whether the recorded commits or repositories are trustworthy. Use `--verify` for verification in CI.

## Updating dependencies

When you add or remove an Action, or change the version you reference, run `gh actions-lock` again. On a rerun, references that are already pinned are generally kept as they are.

:::info
When Dependabot opens a PR to bump an Action version in a registered workflow, the corresponding lockfile entry is regenerated in the same PR.
:::

To reflect changes in references, such as moved tags, use `--relock` to re-resolve and update the lockfile entries.

```bash
gh actions-lock --relock
```

For example, if you pinned `actions/checkout@v6` as is by passing `--no-narrow`, and the commit that `v6` points to moves from A to B, `--relock` updates the lockfile entry to B. On the other hand, a full version tag such as `actions/checkout@v6.1.0` almost never moves once published, so running `--relock` usually leaves it on the same commit. This is why the extension narrows partial version refs to full version tags by default: it keeps pinned commits valid for longer.

Note that `--relock` leaves entries whose recorded commit is no longer reachable as errors. Because such entries may indicate tampering, first check the upstream repository's history, and if everything looks fine, accept the new commit with `gh actions-lock --relock --accept-moved`.

## Summary

- Workflow dependency lockfiles let you pin the commits that Actions run to SHAs while keeping tag notation
- `gh actions-lock` not only generates the lockfile but may also rewrite references in your workflows
- `--verify` accesses GitHub to verify, while `--verify-local` checks offline that references and entries match
- A normal rerun keeps already-pinned references, while `--relock` re-resolves existing references
- Dependencies inside a reusable workflow are managed by the lockfile of the repository where it is defined

## References

- [GitHub Actions workflow lockfiles in public preview](https://github.blog/changelog/2026-10-14-github-actions-workflow-lockfiles-in-public-preview/)
- [Workflow dependency lockfiles](https://docs.github.com/en/actions/concepts/security/workflow-dependency-lockfiles)
- [Locking action dependencies in a repository's workflows](https://docs.github.com/en/actions/how-tos/secure-your-work/lock-workflow-dependencies)
- [Enforcing lockfiles for action dependencies](https://docs.github.com/en/actions/how-tos/administer/enforce-workflow-lockfiles)
- [github/gh-actions-lock](https://github.com/github/gh-actions-lock)
