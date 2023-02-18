#!/bin/bash

# gh-pages ブランチの場合プレビューを無効化
if [ "$VERCEL_GITHUB_COMMIT_REF" = "gh-pages" ]; then
  echo "Build step disabled for gh-pages branch"
  exit 0
fi

# Webhook でのデプロイの場合常にデプロイする
if [ "$VERCEL_GIT_PREVIOUS_SHA" = "$VERCEL_GIT_COMMIT_SHA" ]; then
  echo "Build step enabled for Webhook deploy"
  exit 1
fi

eval "git diff --quiet HEAD^ HEAD ./"