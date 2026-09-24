import {
  FocusEvent,
  KeyboardEvent,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

type LogicalTreeNode = {
  node: TreeViewNode;
  level: number;
  parentId: string | null;
};

const flattenTreeNodes = (
  nodes: TreeViewNode[],
  level = 1,
  parentId: string | null = null,
): LogicalTreeNode[] =>
  nodes.flatMap((node) => [
    { node, level, parentId },
    ...(node.children?.length
      ? flattenTreeNodes(node.children, level + 1, node.id)
      : []),
  ]);

const flattenVisibleNodes = (
  nodes: TreeViewNode[],
  expanded: Set<string>,
  level = 1,
  parentId: string | null = null,
): LogicalTreeNode[] =>
  nodes.flatMap((node) => [
    { node, level, parentId },
    ...(node.children?.length && expanded.has(node.id)
      ? flattenVisibleNodes(node.children, expanded, level + 1, node.id)
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
      onBlurCapture: onRootBlurCapture,
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
    const allNodesById = useMemo(
      () =>
        new Map(
          flattenTreeNodes(items).map((entry) => [entry.node.id, entry]),
        ),
      [items],
    );
    const focusableVisibleNodes = useMemo(
      () =>
        disabled
          ? []
          : visibleNodes.filter(({ node }) => !node.disabled),
      [disabled, visibleNodes],
    );
    const focusableVisibleIds = useMemo(
      () => new Set(focusableVisibleNodes.map(({ node }) => node.id)),
      [focusableVisibleNodes],
    );

    const resolveActiveId = (currentId: string | null): string | null => {
      if (currentId !== null && focusableVisibleIds.has(currentId)) {
        return currentId;
      }

      let ancestorId = currentId !== null
        ? (allNodesById.get(currentId)?.parentId ?? null)
        : null;
      while (ancestorId !== null) {
        if (focusableVisibleIds.has(ancestorId)) return ancestorId;
        ancestorId = allNodesById.get(ancestorId)?.parentId ?? null;
      }

      if (selected !== undefined && focusableVisibleIds.has(selected)) {
        return selected;
      }
      return focusableVisibleNodes[0]?.node.id ?? null;
    };

    const [activeId, setActiveId] = useState<string | null>(() => {
      const initialExpanded = new Set(expandedIds ?? defaultExpandedIds);
      const initialVisible = flattenVisibleNodes(items, initialExpanded).filter(
        ({ node }) => !disabled && !node.disabled,
      );
      const initialSelected = selectedId ?? defaultSelectedId;
      return initialVisible.some(({ node }) => node.id === initialSelected)
        ? (initialSelected ?? null)
        : (initialVisible[0]?.node.id ?? null);
    });
    const resolvedActiveId = resolveActiveId(activeId);
    const nodeRefs = useRef(new Map<string, HTMLButtonElement>());
    const focusedNodeIdRef = useRef<string | null>(null);
    const treeHadFocusRef = useRef(false);

    useEffect(() => {
      setActiveId((currentId) =>
        currentId === resolvedActiveId ? currentId : resolvedActiveId,
      );

      const focusedId = focusedNodeIdRef.current;
      if (
        treeHadFocusRef.current &&
        focusedId !== null &&
        !focusableVisibleIds.has(focusedId) &&
        resolvedActiveId
      ) {
        nodeRefs.current.get(resolvedActiveId)?.focus();
      }
    }, [focusableVisibleIds, resolvedActiveId]);

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

    const focusNode = (id: string | null) => {
      if (id === null || !focusableVisibleIds.has(id)) return;
      setActiveId(id);
      nodeRefs.current.get(id)?.focus();
    };

    const findFocusableParentId = (nodeId: string): string | null => {
      let parentId = allNodesById.get(nodeId)?.parentId ?? null;
      while (parentId !== null) {
        if (focusableVisibleIds.has(parentId)) return parentId;
        parentId = allNodesById.get(parentId)?.parentId ?? null;
      }
      return null;
    };

    const handleKeyDown = (
      event: KeyboardEvent<HTMLButtonElement>,
      node: TreeViewNode,
    ) => {
      const currentIndex = focusableVisibleNodes.findIndex(
        ({ node: visibleNode }) => visibleNode.id === node.id,
      );

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const offset = event.key === "ArrowDown" ? 1 : -1;
        focusNode(focusableVisibleNodes[currentIndex + offset]?.node.id ?? null);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        if (!node.children?.length) return;
        if (!expandedSet.has(node.id)) {
          toggleNode(node, true);
          return;
        }

        const firstFocusableChild = node.children.find(
          (child) => !disabled && !child.disabled,
        );
        focusNode(firstFocusableChild?.id ?? null);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (node.children?.length && expandedSet.has(node.id)) {
          toggleNode(node, false);
          return;
        }
        focusNode(findFocusableParentId(node.id));
      } else if (event.key === "Home") {
        event.preventDefault();
        focusNode(focusableVisibleNodes[0]?.node.id ?? null);
      } else if (event.key === "End") {
        event.preventDefault();
        focusNode(
          focusableVisibleNodes[focusableVisibleNodes.length - 1]?.node.id ??
            null,
        );
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

          return (
            <li
              key={node.id}
              role="none"
              className={classMap.item}
              data-testid={`${testId}-item`}
            >
              <button
                ref={(element) => {
                  if (element) nodeRefs.current.set(node.id, element);
                  else nodeRefs.current.delete(node.id);
                }}
                type="button"
                role="treeitem"
                tabIndex={node.id === resolvedActiveId ? 0 : -1}
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
                onFocus={() => {
                  treeHadFocusRef.current = true;
                  focusedNodeIdRef.current = node.id;
                  if (!node.disabled && !disabled) setActiveId(node.id);
                }}
                onKeyDown={(event) => handleKeyDown(event, node)}
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
        onBlurCapture={(event: FocusEvent<HTMLDivElement>) => {
          onRootBlurCapture?.(event);
          const nextTarget = event.relatedTarget;
          if (
            nextTarget instanceof Node &&
            nextTarget !== document.body &&
            !event.currentTarget.contains(nextTarget)
          ) {
            treeHadFocusRef.current = false;
            focusedNodeIdRef.current = null;
          }
        }}
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
