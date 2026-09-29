const ID_REFERENCE_ATTRIBUTES = [
  "aria-activedescendant",
  "aria-controls",
  "aria-describedby",
  "aria-details",
  "aria-errormessage",
  "aria-labelledby",
  "aria-owns",
  "for",
  "headers",
] as const;

export const getElementsWithIds = (container: ParentNode) =>
  Array.from(container.querySelectorAll<HTMLElement>("[id]"));

export const expectUniqueDomIds = (container: ParentNode) => {
  const ids = getElementsWithIds(container).map((element) => element.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

  expect(duplicates).toEqual([]);
};

export const expectResolvedIdReferences = (container: ParentNode) => {
  const elementsWithIds = getElementsWithIds(container);
  const referencedElements = Array.from(
    container.querySelectorAll<HTMLElement>("*"),
  );
  const unresolvedReferences: string[] = [];

  referencedElements.forEach((element) => {
    ID_REFERENCE_ATTRIBUTES.forEach((attribute) => {
      const value = element.getAttribute(attribute);

      value
        ?.split(/\s+/u)
        .filter(Boolean)
        .forEach((referencedId) => {
          const referencesCollapsedPopup =
            attribute === "aria-controls" &&
            element.getAttribute("aria-expanded") === "false";

          if (
            !referencesCollapsedPopup &&
            !elementsWithIds.some(({ id }) => id === referencedId)
          ) {
            unresolvedReferences.push(`${attribute}=${referencedId}`);
          }
        });
    });
  });

  expect(unresolvedReferences).toEqual([]);
};
