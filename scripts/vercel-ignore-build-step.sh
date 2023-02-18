#!/bin/bash

# gh-pages ブランチの場合プレビューを無効化
if [ "$VERCEL_GIT_COMMIT_REF" = "gh-pages" ]; then
  echo "Build step disabled for gh-pages branch"
  exit 0
fi

# production のときは常にビルド
if [ "$VERCEL_ENV" = "production" ]; then
  echo "Build step enabled for production"
  exit 1
fi

eval "git diff --quiet HEAD^ HEAD ./"