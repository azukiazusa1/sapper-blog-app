// Marp の表示結果を検査する。ブラウザのページ内で実行し、問題のあるスライドを返す。
(() => {
  const ACCENT = /94,\s*234,\s*212|45,\s*212,\s*191/;
  const isAccent = (color) => ACCENT.test(color || "");

  const countAccents = (section) => {
    let count = 0;
    for (const el of section.querySelectorAll("*")) {
      const style = getComputedStyle(el);
      const hasText = [...el.childNodes].some(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
      );
      if (hasText && isAccent(style.color)) count += 1;
      if (isAccent(style.backgroundColor)) count += 1;
      if (
        isAccent(style.borderTopColor) &&
        parseFloat(style.borderTopWidth) > 0
      ) {
        count += 1;
      }
    }
    return count;
  };

  const sections = [...document.querySelectorAll("section")].filter(
    (section) =>
      section.parentElement.tagName.toLowerCase() === "foreignobject",
  );

  const issues = sections.flatMap((section, index) => {
    const bottom =
      section.clientHeight -
      parseFloat(getComputedStyle(section).paddingBottom);
    const contentBottom = Math.max(
      ...[...section.children].map((el) => el.offsetTop + el.offsetHeight),
    );
    const wideCode = [...section.querySelectorAll("pre")].filter(
      (pre) => pre.scrollWidth > pre.clientWidth + 1,
    ).length;
    const accents = countAccents(section);
    const problems = [];
    if (contentBottom > bottom + 1)
      problems.push(`overflow ${Math.round(contentBottom - bottom)}px`);
    if (wideCode > 0) problems.push("wide code");
    if (accents > 1) problems.push(`accent ${accents}`);
    if (problems.length === 0) return [];
    const title = section.querySelector("h1, h2")?.textContent ?? "";
    return [{ slide: index + 1, title, problems }];
  });

  return JSON.stringify({ slides: sections.length, issues }, null, 2);
})();
