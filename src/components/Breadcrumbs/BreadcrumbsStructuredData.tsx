import type { Breadcrumb } from "./Breadcrumbs.types";
import { sanitizeNavigationHref } from "../../utils/navigationSecurity";

/** One complete hierarchy, independent of disclosure state and visual links. */
export default function BreadcrumbsStructuredData({
  items,
}: {
  items: Breadcrumb[];
}) {
  const hierarchy = items.map((item) => ({
    name: item.label.trim(),
    href: sanitizeNavigationHref(item.href),
  }));

  // Do not invent destinations or silently remove levels from the hierarchy.
  if (
    hierarchy.length < 2 ||
    hierarchy.some(
      (item, index) => !item.name || (index < hierarchy.length - 1 && !item.href),
    )
  ) {
    return null;
  }

  return (
    <div hidden itemScope itemType="https://schema.org/BreadcrumbList">
      {hierarchy.map((item, index) => (
        <span
          key={index}
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <meta itemProp="name" content={item.name} />
          {item.href ? <link itemProp="item" href={item.href} /> : null}
          <meta itemProp="position" content={String(index + 1)} />
        </span>
      ))}
    </div>
  );
}
