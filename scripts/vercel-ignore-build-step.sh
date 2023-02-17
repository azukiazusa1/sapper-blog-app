#!/bin/bash

# gh-pages ブランチの場合プレビューを無効化
if [ "$VERCEL_GITHUB_COMMIT_REF" = "gh-pages" ]; then
  echo "Build step disabled for gh-pages branch"
  exit 0
else
  echo "Build step enabled for other branches"
  exit 1
fi