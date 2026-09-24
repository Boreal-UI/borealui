import { getValueRange } from "@/utils/chartUtils";

describe("getValueRange", () => {
  it.each([
    [[], true, { min: -1, max: 1 }],
    [[], false, { min: -1, max: 1 }],
    [[5], true, { min: 0, max: 5 }],
    [[5], false, { min: 4, max: 6 }],
    [[2, 2], false, { min: 1, max: 3 }],
    [[1, 4, 2], true, { min: 0, max: 4 }],
    [[-5, -2], true, { min: -5, max: 0 }],
    [[-3, 2.5, 0], false, { min: -3, max: 2.5 }],
    [[Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY], false, { min: -1, max: 1 }],
  ])(
    "preserves range semantics for %j with includeZero=%s",
    (values, includeZero, expected) => {
      expect(getValueRange(values as number[], includeZero as boolean)).toEqual(
        expected,
      );
    },
  );

  it.each([100_000, 200_000, 500_000])(
    "handles %i values without expanding them into function arguments",
    (size) => {
      const values = Array.from({ length: size }, (_, index) => index - 10);

      expect(getValueRange(values, false)).toEqual({
        min: -10,
        max: size - 11,
      });
    },
  );
});
