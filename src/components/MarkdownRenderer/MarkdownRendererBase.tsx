import React, { useMemo } from "react";
import { ElementType, parseDocument } from "htmlparser2";
import { marked } from "marked";
import sanitize from "sanitize-html";
import { BaseMarkdownRendererProps } from "./MarkdownRenderer.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { mergeSafeRel } from "../../utils/navigationSecurity";
import {
  getDefaultRounding,
  getDefaultShadow,
} from "../../config/boreal-style-config";

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const safeUrlPattern = /^(?:(?:https?|mailto|tel):|\/(?!\/)|#|\?|\.{0,2}\/)/i;

const safeImageUrlPattern =
  /^(?:(?:https?):|\/(?!\/)|\.{0,2}\/|data:image\/(?:png|gif|jpeg|jpg|webp|avif);base64,)/i;

const sanitizeUrl = (url: string, allowImageData = false) => {
  const trimmed = url.trim();
  if (!trimmed) return "";

  const pattern = allowImageData ? safeImageUrlPattern : safeUrlPattern;
  return pattern.test(trimmed) ? trimmed : "";
};

const attributeNameMap: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  colspan: "colSpan",
  rowspan: "rowSpan",
  readonly: "readOnly",
  tabindex: "tabIndex",
};

const allowedHtmlTags = new Set([
  "a",
  "abbr",
  "b",
  "blockquote",
  "br",
  "caption",
  "cite",
  "code",
  "dd",
  "del",
  "details",
  "dfn",
  "div",
  "dl",
  "dt",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "ins",
  "kbd",
  "li",
  "mark",
  "ol",
  "p",
  "pre",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
  "var",
]);

const voidHtmlTags = new Set(["br", "hr", "img"]);

type MarkedRendererContext = {
  parser?: {
    parseInline?: (tokens: unknown[]) => string;
  };
};

type MarkedRendererToken = {
  href?: unknown;
  text?: unknown;
  title?: unknown;
  tokens?: unknown[];
};

const getTokenString = (value: unknown): string =>
  typeof value === "string" ? value : "";

const getInlineTokenText = (
  context: MarkedRendererContext,
  token: MarkedRendererToken,
): string => {
  if (token.tokens && typeof context.parser?.parseInline === "function") {
    return context.parser.parseInline(token.tokens);
  }

  return getTokenString(token.text);
};

const safeSanitize = (html: string): string =>
  sanitize(html, {
    allowedTags: [...allowedHtmlTags],
    allowedAttributes: {
      "*": ["id", "class", "title", "lang", "dir", "aria-*", "data-*"],
      a: ["href", "target", "rel"],
      blockquote: ["cite"],
      del: ["cite", "datetime"],
      details: ["open"],
      img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
      ins: ["cite", "datetime"],
      li: ["value"],
      ol: ["start", "type", "reversed"],
      td: ["colspan", "rowspan", "headers"],
      th: ["colspan", "rowspan", "headers", "scope"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
    allowProtocolRelative: false,
    disallowedTagsMode: "completelyDiscard",
    enforceHtmlBoundary: true,
    parseStyleAttributes: false,
  });

type ParsedHtmlNode = ReturnType<typeof parseDocument>["children"][number];

type ParsedHtmlElement = {
  name: string;
  attribs: Record<string, string>;
};

const getSafeElementProps = (element: ParsedHtmlElement) => {
  const props: Record<string, string | number | boolean> = {};

  Object.entries(element.attribs).forEach(([attributeName, value]) => {
    const name = attributeName.toLowerCase();

    if (name.startsWith("on") || name === "style" || name === "srcdoc") return;

    if (name === "href" || name === "formaction") {
      const url = sanitizeUrl(value);
      if (url) props[name] = url;
      return;
    }

    if (name === "src") {
      const url = sanitizeUrl(value, true);
      if (url) props.src = url;
      return;
    }

    if (name === "target") {
      props.target = value;
      return;
    }

    props[attributeNameMap[name] ?? name] = value;
  });

  if (element.name.toLowerCase() === "a") {
    const target = typeof props.target === "string" ? props.target : undefined;
    const rel = typeof props.rel === "string" ? props.rel : undefined;
    const safeRel = mergeSafeRel(target, rel);

    if (safeRel) props.rel = safeRel;
    else delete props.rel;
  }

  return props;
};

const htmlToReactNodes = (
  html: string,
  keyPrefix: string,
): React.ReactNode[] => {
  const doc = parseDocument(html, { decodeEntities: true });

  const convertNode = (node: ParsedHtmlNode, key: string): React.ReactNode => {
    if (node.type === ElementType.Text) return node.data;
    if (node.type !== ElementType.Tag) return null;

    const tagName = node.name.toLowerCase();
    const children: React.ReactNode[] = [];
    let pendingTableRows: ParsedHtmlNode[] = [];

    const flushTableRows = () => {
      if (pendingTableRows.length === 0) return;

      const rowKey = `${key}-tbody-${children.length}`;
      children.push(
        React.createElement(
          "tbody",
          { key: rowKey },
          pendingTableRows.map((child, index) =>
            convertNode(child, `${rowKey}-${index}`),
          ),
        ),
      );
      pendingTableRows = [];
    };

    node.children.forEach((child, index) => {
      const isDirectTableRow =
        tagName === "table" &&
        child.type === ElementType.Tag &&
        child.name.toLowerCase() === "tr";
      const isWhitespaceBetweenRows =
        pendingTableRows.length > 0 &&
        child.type === ElementType.Text &&
        child.data.trim() === "";

      if (isDirectTableRow || isWhitespaceBetweenRows) {
        pendingTableRows.push(child);
        return;
      }

      flushTableRows();
      children.push(convertNode(child, `${key}-${index}`));
    });
    flushTableRows();

    if (!allowedHtmlTags.has(tagName)) return children;

    if (voidHtmlTags.has(tagName)) {
      return React.createElement(tagName, {
        key,
        ...getSafeElementProps(node),
      });
    }

    return React.createElement(
      tagName,
      { key, ...getSafeElementProps(node) },
      children,
    );
  };

  return doc.children.map((node, index) =>
    convertNode(node, `${keyPrefix}-${index}`),
  );
};

const BaseMarkdownRenderer: React.FC<BaseMarkdownRendererProps> = ({
  content,
  className,
  language = "en",
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  role = "region",
  tabIndex,
  allowHtml = false,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "data-testid": dataTestId,
  testId = dataTestId ?? "markdown-renderer",
  classMap,
  sanitizeHtml,
}) => {
  const renderer = useMemo(() => {
    const r = new marked.Renderer();

    if (!allowHtml) {
      r.html = (function (
        this: MarkedRendererContext,
        htmlOrToken: string | MarkedRendererToken,
      ) {
        const html =
          typeof htmlOrToken === "string"
            ? htmlOrToken
            : getTokenString(htmlOrToken.text);
        return escapeHtml(html);
      });
    }

    r.link = (function (
      this: MarkedRendererContext,
      hrefOrToken: string | MarkedRendererToken,
      legacyTitle?: string | null,
      legacyText?: string,
    ) {
      const isToken = typeof hrefOrToken !== "string";
      const href = isToken ? getTokenString(hrefOrToken.href) : hrefOrToken;
      const title = isToken
        ? getTokenString(hrefOrToken.title)
        : getTokenString(legacyTitle);
      const text = isToken
        ? getInlineTokenText(this, hrefOrToken)
        : getTokenString(legacyText);
      const url = href || "#";
      const isExternal = /^https?:\/\//i.test(url);
      const titleAttribute = title
        ? ` title="${escapeHtml(title)}"`
        : "";
      const target = isExternal ? ` target="_blank"` : "";
      const rel = isExternal ? ` rel="noopener noreferrer"` : "";
      return `<a href="${escapeHtml(url)}"${titleAttribute}${target}${rel}>${text}</a>`;
    });

    r.image = (function (
      this: MarkedRendererContext,
      hrefOrToken: string | MarkedRendererToken,
      legacyTitle?: string | null,
      legacyText?: string,
    ) {
      const isToken = typeof hrefOrToken !== "string";
      const href = isToken ? getTokenString(hrefOrToken.href) : hrefOrToken;
      const title = isToken
        ? getTokenString(hrefOrToken.title)
        : getTokenString(legacyTitle);
      const text = isToken
        ? getTokenString(hrefOrToken.text)
        : getTokenString(legacyText);
      const titleAttribute = title
        ? ` title="${escapeHtml(title)}"`
        : "";
      const alt = escapeHtml(text);
      return `<img src="${escapeHtml(href)}"${titleAttribute} alt="${alt}" loading="lazy" decoding="async" />`;
    });

    return r;
  }, [allowHtml]);

  const renderedContent = useMemo(() => {
    const trimmed = (content ?? "").trim();
    if (!trimmed) return null;

    const raw = marked.parse(trimmed, {
      async: false,
      renderer,
    });

    const preprocessed = sanitizeHtml ? sanitizeHtml(raw) : raw;
    const sanitized = allowHtml ? safeSanitize(preprocessed) : preprocessed;
    return htmlToReactNodes(sanitized, "markdown");
  }, [allowHtml, content, renderer, sanitizeHtml]);

  const wrapperClass = useMemo(
    () =>
      combineClassNames(
        classMap.wrapper,
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
        className,
      ),
    [classMap, rounding, shadow, className],
  );

  const accessibilityProps = {
    role,
    lang: language,
    tabIndex,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
  };

  if (!renderedContent) {
    return (
      <div
        className={classMap.empty}
        data-testid={testId}
        {...accessibilityProps}
      >
        <p>No content available.</p>
      </div>
    );
  }

  return (
    <div className={wrapperClass} data-testid={testId} {...accessibilityProps}>
      {renderedContent}
    </div>
  );
};

BaseMarkdownRenderer.displayName = "BaseMarkdownRenderer";
export default BaseMarkdownRenderer;
