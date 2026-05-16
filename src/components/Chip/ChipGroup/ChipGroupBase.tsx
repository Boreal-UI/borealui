import {
  Children,
  Fragment,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ChipGroupProps,
  ChipGroupRef,
  ClosableChildProps,
  InjectedDefaults,
} from "./ChipGroup.types";
import type { ChipProps } from "../Chip.types";
import { v4 as uuidv4 } from "uuid";
import { combineClassNames } from "@/utils/classNames";
import { getDefaultSize } from "@/config/boreal-style-config";

export type ChipGroupBaseProps = ChipGroupProps & {
  ChipComponent: React.ElementType;
  classMap: Record<string, string>;
};

const ChipGroupBase = forwardRef<ChipGroupRef, ChipGroupBaseProps>(
  (
    {
      chips,
      children,
      onRemove,
      position = "topCenter",
      size = getDefaultSize(),
      className,
      ChipComponent,
      classMap,
      "data-testid": dataTestId,
      testId = dataTestId ?? "chip-group",
    },
    ref,
  ) => {
    const isChildrenMode = children != null;

    const [visibleChips, setVisibleChips] = useState<ChipProps[]>([]);
    const childCloseFnsRef = useRef<Array<(() => void) | null>>([]);

    useEffect(() => {
      if (isChildrenMode) return;
      const safeChips = (chips ?? []).map((chip) => ({
        ...chip,
        id: chip.id || uuidv4(),
      }));
      setVisibleChips(safeChips);
    }, [chips, isChildrenMode]);

    const handleClose = useCallback(
      (id: string) => {
        setVisibleChips((prev) => prev.filter((c) => c.id !== id));
        onRemove?.(id);
      },
      [onRemove],
    );

    useImperativeHandle(ref, () => ({
      closeAllChips: () => {
        if (!isChildrenMode) {
          visibleChips.forEach((chip) => chip.id && handleClose(chip.id));
          return;
        }

        childCloseFnsRef.current.forEach((fn) => fn?.());
      },
    }));

    const containerClassName = combineClassNames(
      classMap.container,
      classMap[position],
      className,
    );
    const renderedChildren = useMemo(() => {
      if (!isChildrenMode) return null;

      const closers: Array<(() => void) | null> = [];

      const mapped = Children.map(children, (child) => {
        if (!isValidElement(child)) {
          closers.push(null);
          return child;
        }

        if (child.type === Fragment) {
          closers.push(null);
          return child;
        }

        const childProps = child.props as ClosableChildProps;
        const injectedProps: InjectedDefaults = {
          ...(childProps.size == null ? { size } : null),
          ...(childProps.position == null ? { position } : null),
        };
        const onClose = childProps.onClose || childProps.onRemove;
        closers.push(typeof onClose === "function" ? onClose : null);

        return cloneElement(child, injectedProps);
      });

      childCloseFnsRef.current = closers;
      return mapped;
    }, [children, isChildrenMode, position, size]);

    return (
      <div
        className={containerClassName}
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        data-testid={testId}
      >
        <ul className={classMap.list}>
          {!isChildrenMode &&
            visibleChips.map((chip, index) => {
              const chipPosition = chip.position || position;
              const chipPositionClass = classMap[chipPosition];

              return (
                <li key={chip.id}>
                  <ChipComponent
                    id={chip.id}
                    message={chip.message}
                    icon={chip.icon}
                    theme={chip.theme}
                    state={chip.state}
                    size={chip.size || size}
                    rounding={chip.rounding}
                    shadow={chip.shadow}
                    visible={true}
                    onClose={() => handleClose(chip.id!)}
                    autoClose={chip.autoClose}
                    duration={chip.duration}
                    position={chipPosition}
                    usePortal={false}
                    stackIndex={index}
                    className={combineClassNames(
                      classMap.chip,
                      chip.className,
                      chipPositionClass,
                    )}
                    data-testid={chip["data-testid"]}
                  />
                </li>
              );
            })}

          {isChildrenMode &&
            Children.map(renderedChildren, (child, index) => (
              <li key={(isValidElement(child) ? child.key : null) ?? index}>
                {child}
              </li>
            ))}
        </ul>
      </div>
    );
  },
);

ChipGroupBase.displayName = "ChipGroupBase";
export default ChipGroupBase;
