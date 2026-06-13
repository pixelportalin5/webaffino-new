import PageRuntime from "@/components/PageRuntime";

export default function LegacyHtmlPage({ page }) {
  return (
    <>
      <LegacyStyles styles={page.styles} pageKey={page.key} />
      <div
        data-legacy-page={page.key}
        className="legacy-page-root"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: page.html }}
      />
      <PageRuntime
        bodyClassName={page.bodyClassName}
        htmlStyle={page.htmlStyle}
        scripts={page.scripts}
      />
    </>
  );
}

export function LegacyFragment({ page }) {
  return (
    <>
      <LegacyStyles styles={page.styles} pageKey={page.key} />
      <div
        data-legacy-fragment={page.key}
        style={{ display: "contents" }}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: page.html }}
      />
    </>
  );
}

function LegacyStyles({ styles, pageKey }) {
  return styles.map((style, index) => (
    <style
      key={`${pageKey}-style-${index}`}
      dangerouslySetInnerHTML={{ __html: style }}
    />
  ));
}
