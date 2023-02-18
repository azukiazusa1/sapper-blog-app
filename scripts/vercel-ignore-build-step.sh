#!/bin/bash
echo "VERCEL_GIT_PROVIDER: $VERCEL_GIT_PROVIDER"
echo "VERCEL_GIT_PULL_REQUEST_ID: $VERCEL_GIT_PULL_REQUEST_ID"
echo "VERCEL_GIT_COMMIT_AUTHOR_NAME: $VERCEL_GIT_COMMIT_AUTHOR_NAME"
echo "VERCEL_GIT_PREVIOUS_SHA: $VERCEL_GIT_PREVIOUS_SHA"
echo "VERCEL_GIT_COMMIT_SHA: $VERCEL_GIT_COMMIT_SHA"

# gh-pages ブランチの場合プレビューを無効化
if [ "$VERCEL_GITHUB_COMMIT_REF" = "gh-pages" ]; then
  echo "Build step disabled for gh-pages branch"
  exit 0
fi

# Webhook でのデプロイの場合常にデプロイする
if [ "$VERCEL_GIT_PULL_REQUEST_ID" = "" ]; then
  echo "Build step enabled for Webhook deploy"
  exit 1
fi

eval "git diff --quiet HEAD^ HEAD ./"