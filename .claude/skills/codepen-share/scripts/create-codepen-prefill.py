#!/usr/bin/env python3
"""Create a user-submitted CodePen Prefill launcher from local panel files."""

from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path


ENDPOINT = "https://codepen.io/pen/define"

FORBIDDEN_PANEL_PATTERNS = {
    "html": re.compile(
        r"<!doctype|</?(?:html|head|body|script|style)(?:\s|>)",
        re.IGNORECASE,
    ),
    "css": re.compile(r"</?style(?:\s|>)", re.IGNORECASE),
    "js": re.compile(r"</?script(?:\s|>)", re.IGNORECASE),
}


def read_panel(panel: str, raw_path: str | None) -> str | None:
    if raw_path is None:
        return None

    path = Path(raw_path)
    if not path.exists():
        raise ValueError(f"{panel} panel file does not exist: {path}")
    if not path.is_file():
        raise ValueError(f"{panel} panel path is not a file: {path}")

    value = path.read_text(encoding="utf-8")
    if not value.strip():
        raise ValueError(f"{panel} panel file is empty: {path}")
    if "\x00" in value:
        raise ValueError(f"{panel} panel source contains a NUL byte: {path}")
    if FORBIDDEN_PANEL_PATTERNS[panel].search(value):
        raise ValueError(
            f"{panel} panel source contains wrapper tags; pass panel content only",
        )
    return value


def build_payload(args: argparse.Namespace) -> dict[str, object]:
    payload: dict[str, object] = {
        "title": args.title,
        "description": args.description,
        "layout": args.layout,
    }

    for panel in ("html", "css", "js"):
        value = read_panel(panel, getattr(args, panel))
        if value is not None:
            payload[panel] = value

    return payload


def render_launcher(payload: dict[str, object]) -> str:
    encoded_payload = html.escape(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":")),
        quote=True,
    )
    title = html.escape(str(payload["title"]))

    return f"""<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Open {title} in CodePen</title>
  </head>
  <body>
    <h1>{title}</h1>
    <p>送信すると、コードが CodePen へ転送され、入力済みの未保存 Pen が開きます。</p>
    <form action="{ENDPOINT}" method="post">
      <input type="hidden" name="data" value="{encoded_payload}">
      <button type="submit">CodePen で開く</button>
    </form>
  </body>
</html>
"""


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create an HTML form that posts sample code to CodePen Prefill.",
    )
    parser.add_argument("--title", required=True)
    parser.add_argument("--description", default="")
    parser.add_argument("--html", help="HTML panel source file")
    parser.add_argument("--css", help="CSS panel source file")
    parser.add_argument("--js", help="JavaScript panel source file")
    parser.add_argument("--layout", choices=("left", "top", "right"), default="left")
    parser.add_argument("--output", required=True)
    parser.add_argument(
        "--force",
        action="store_true",
        help="Replace an existing output file.",
    )
    args = parser.parse_args()

    if not any((args.html, args.css, args.js)):
        parser.error("at least one of --html, --css, or --js is required")

    return args


def main() -> None:
    args = parse_args()
    try:
        payload = build_payload(args)
    except (OSError, UnicodeError, ValueError) as error:
        raise SystemExit(f"error: {error}") from error

    output = Path(args.output)
    if output.exists() and not args.force:
        raise SystemExit(f"error: output already exists: {output} (use --force to replace it)")
    if output.exists() and not output.is_file():
        raise SystemExit(f"error: output path is not a file: {output}")

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(render_launcher(payload), encoding="utf-8")
    print(output.resolve())


if __name__ == "__main__":
    main()
