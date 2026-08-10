import {
  expandClassMap,
  resolvePropAlias,
  resolveThemeAlias,
} from "../../src/utils/propAliases";

describe("prop aliases", () => {
  it("expands short visual prop aliases to existing class names", () => {
    const classMap: Record<string, string> = {
      primary: "component_primary",
      small: "component_small",
      horizontal: "component_horizontal",
      shadowStrong: "component_shadow-Strong",
      roundLarge: "component_round-Large",
      labelTop: "component_label-top",
    };

    const expanded = expandClassMap(classMap);

    expect(expanded.p).toBe("component_primary");
    expect(expanded.sm).toBe("component_small");
    expect(expanded.h).toBe("component_horizontal");
    expect(expanded.shadowLg).toBe("component_shadow-Strong");
    expect(expanded.roundLg).toBe("component_round-Large");
    expect(expanded.labelT).toBe("component_label-top");
  });

  it("normalizes runtime aliases by context", () => {
    expect(resolveThemeAlias("t")).toBe("tertiary");
    expect(resolvePropAlias("t")).toBe("top");
    expect(resolvePropAlias("v")).toBe("vertical");
    expect(resolvePropAlias("sk")).toBe("sticky");
  });

  it("reuses expanded class maps for stable component memoization", () => {
    const classMap = { medium: "component_medium" };

    expect(expandClassMap(classMap)).toBe(expandClassMap(classMap));
  });

  it("does not copy prototype pollution keys while expanding class maps", () => {
    const classMap = Object.create(null) as Record<string, string>;
    classMap.primary = "component_primary";
    Object.defineProperty(classMap, "__proto__", {
      value: "polluted",
      enumerable: true,
    });
    classMap["constructor"] = "polluted";
    classMap.prototype = "polluted";

    const expanded = expandClassMap(classMap);

    expect(expanded.p).toBe("component_primary");
    expect(Object.prototype.hasOwnProperty.call(expanded, "__proto__")).toBe(
      false,
    );
    expect(Object.prototype.hasOwnProperty.call(expanded, "constructor")).toBe(
      false,
    );
    expect(Object.prototype.hasOwnProperty.call(expanded, "prototype")).toBe(
      false,
    );
    expect(Object.getPrototypeOf(expanded)).toBeNull();
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });
});
