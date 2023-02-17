#!/bin/bash

# gh-pages ブランチの場合プレビューを無効化
if [ "$VERCEL_GITHUB_COMMIT_REF" = "gh-pages" ]; then
  echo "Build step disabled for gh-pages branch"
  exit 0
fi

GLOB=${@}
PREV_MERGE_COMMIT=`git rev-list --grep "Merge pull request" -n 1 HEAD`

eval "git diff --quiet $PREV_MERGE_COMMIT HEAD -- $GLOB"