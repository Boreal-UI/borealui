import { KeyboardEvent, forwardRef, useMemo, useState } from "react";
import { TreeViewBaseProps, TreeViewNode } from "./TreeView.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { ChevronDownIcon } from "../../Icons";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const flattenVisibleNodes = (
  nodes: TreeViewNode[],
  expanded: Set<string>,
  level = 1,
): Array<{ node: TreeViewNode; level: number }> =>
  nodes.flatMap((node) => [
    { node, level },
    ...(node.children?.length && expanded.has(node.id)
      ? flattenVisibleNodes(node.children, expanded, level + 1)
      : []),
  ]);

const TreeViewBase = forwardRef<HTMLDivElement, TreeViewBaseProps>(
  (
    {
      items = [],
      children,
      selectedId,
      defaultSelectedId,
      expandedIds,
      defaultExpandedIds = [],
      onSelectionChange,
      onExpandedChange,
      label = "Tree",
      disabled = false,
      loading = false,
      theme = getDefaultTheme(),
      state,
      variant = getDefaultVariant(),
      rounding = getDefaultRounding(),
      shadow,
      classMap,
      className,
      contentClassName,
      srOnlyText,
      srOnlyClassName,
      "data-testid": dataTestId,
      testId = dataTestId ?? "tree-view",
      ...rest
    },
    ref,
  ) => {
    const [internalSelectedId, setInternalSelectedId] =
      useState(defaultSelectedId);
    const [internalExpandedIds, setInternalExpandedIds] =
      useState(defaultExpandedIds);
    const selected = selectedId ?? internalSelectedId;
    const expandedSet = useMemo(
      () => new Set(expandedIds ?? internalExpandedIds),
      [expandedIds, internalExpandedIds],
    );
    const visibleNodes = useMemo(
      () => flattenVisibleNodes(items, expandedSet),
      [items, expandedSet],
    );

    const commitExpanded = (next: Set<string>) => {
      const ids = Array.from(next);
      if (expandedIds === undefined) setInternalExpandedIds(ids);
      onExpandedChange?.(ids);
    };

    const toggleNode = (node: TreeViewNode, force?: boolean) => {
      if (!node.children?.length || node.disabled || disabled) return;
      const next = new Set(expandedSet);
      const shouldExpand = force ?? !next.has(node.id);
      if (shouldExpand) next.add(node.id);
      else next.delete(node.id);
      commitExpanded(next);
    };

    const selectNode = (node: TreeViewNode) => {
      if (node.disabled || disabled) return;
      if (selectedId === undefined) setInternalSelectedId(node.id);
      onSelectionChange?.(node.id, node);
    };

    const handleKeyDown = (
      event: KeyboardEvent<HTMLButtonElement>,
      node: TreeViewNode,
      index: number,
    ) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const offset = event.key === "ArrowDown" ? 1 : -1;
        const next = visibleNodes[index + offset];
        if (next) {
          document
            .querySelector<HTMLElement>(`[data-tree-node-id="${next.node.id}"]`)
            ?.focus();
        }
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        toggleNode(node, true);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        toggleNode(node, false);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectNode(node);
      }
    };

    const rootClass = combineClassNames(
      classMap.root,
      classMap[theme],
      state && classMap[state],
      (variant === "outline" || variant === "glassOutline") && classMap.outline,
      (variant === "glass" || variant === "glassOutline") && classMap.glass,
      disabled && classMap.disabled,
      loading && classMap.loading,
      getShadowClassName(classMap, theme, shadow),
      rounding && classMap[`round${capitalize(rounding)}`],
      className,
    );

    const renderNodes = (nodes: TreeViewNode[], level = 1) => (
      <ul
        role={level === 1 ? "tree" : "group"}
        aria-label={level === 1 ? label : undefined}
        className={level === 1 ? classMap.list : classMap.group}
        data-testid={level === 1 ? `${testId}-list` : undefined}
      >
        {nodes.map((node) => {
          const hasChildren = Boolean(node.children?.length);
          const isExpanded = expandedSet.has(node.id);
          const isSelected = selected === node.id;
          const visibleIndex = visibleNodes.findIndex(
            ({ node: item }) => item.id === node.id,
          );

          return (
            <li
              key={node.id}
              role="none"
              className={classMap.item}
              data-testid={`${testId}-item`}
            >
              <button
                type="button"
                role="treeitem"
                aria-level={level}
                aria-expanded={hasChildren ? isExpanded : undefined}
                aria-selected={isSelected}
                disabled={disabled || node.disabled}
                className={combineClassNames(
                  classMap.node,
                  isSelected && classMap.selected,
                  node.disabled && classMap.nodeDisabled,
                )}
                style={{ "--tree-view-level": level } as React.CSSProperties}
                onClick={() => {
                  selectNode(node);
                  if (hasChildren) toggleNode(node);
                }}
                onKeyDown={(event) => handleKeyDown(event, node, visibleIndex)}
                data-tree-node-id={node.id}
                data-testid={`${testId}-node-${node.id}`}
              >
                <span className={classMap.disclosure} aria-hidden="true">
                  {hasChildren ? <ChevronDownIcon /> : null}
                </span>
                {node.icon ? (
                  <span className={classMap.icon}>{node.icon}</span>
                ) : null}
                <span className={classMap.label}>{node.label}</span>
              </button>
              {hasChildren && isExpanded
                ? renderNodes(node.children ?? [], level + 1)
                : null}
            </li>
          );
        })}
      </ul>
    );

    return (
      <div
        ref={ref}
        className={rootClass}
        aria-busy={loading || undefined}
        aria-disabled={disabled || undefined}
        data-testid={testId}
        {...rest}
      >
        {loading ? (
          <span
            className={classMap.loader}
            aria-hidden="true"
            data-testid={`${testId}-loader`}
          />
        ) : null}
        {items.length ? (
          renderNodes(items)
        ) : children ? (
          <div
            className={combineClassNames(classMap.content, contentClassName)}
            data-testid={`${testId}-content`}
          >
            {children}
          </div>
        ) : null}
        {srOnlyText ? (
          <span
            className={combineClassNames(
              "sr_only",
              srOnlyClassName,
            )}
            data-testid={`${testId}-sr-only-text`}
          >
            {srOnlyText}
          </span>
        ) : null}
      </div>
    );
  },
);

TreeViewBase.displayName = "TreeViewBase";
export default TreeViewBase;
