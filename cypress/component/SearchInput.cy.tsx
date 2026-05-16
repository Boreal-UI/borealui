/// <reference types="cypress" />

import { SearchInput as CoreSearchInput } from "../../src/index.core";
import { SearchInput as NextSearchInput } from "../../src/index.next";

const implementations = [
  { name: "core", SearchInput: CoreSearchInput },
  { name: "next", SearchInput: NextSearchInput },
];

implementations.forEach(({ name, SearchInput }) => {
  describe(`${name} SearchInput`, () => {
    beforeEach(() => {
      cy.viewport(800, 520);
    });

    it("changes value, clears, and submits with Enter", () => {
      const onChange = cy.stub().as("searchChange");
      const onClear = cy.stub().as("searchClear");
      const onSearch = cy.stub().as("searchSubmit");

      cy.mount(
        <div style={{ padding: 24 }}>
          <SearchInput
            label="Search docs"
            defaultValue="card"
            onChange={onChange}
            onClear={onClear}
            onSearch={onSearch}
            data-testid="docs-search"
          />
        </div>,
      );

      cy.get('[data-testid="docs-search-input"]').should("have.value", "card");
      cy.get('[data-testid="docs-search-input"]').clear().type("button");
      cy.get("@searchChange").should("have.been.calledWith", "button");

      cy.get('[data-testid="docs-search-input"]').type("{enter}");
      cy.get("@searchSubmit").should("have.been.calledWith", "button");

      cy.get('[data-testid="docs-search-clear"]').click();
      cy.get('[data-testid="docs-search-input"]').should("have.value", "");
      cy.get("@searchClear").should("have.been.called");
    });

    it("supports the optional search button and loading state", () => {
      const onSearch = cy.stub().as("buttonSearch");

      cy.mount(
        <div style={{ padding: 24 }}>
          <SearchInput
            aria-label="Search products"
            defaultValue="toolbar"
            showSearchButton
            loading
            onSearch={onSearch}
            data-testid="product-search"
          />
        </div>,
      );

      cy.get('[data-testid="product-search-wrapper"]').should(
        "have.attr",
        "aria-busy",
        "true",
      );
      cy.get('[data-testid="product-search-loader"]').should("exist");
      cy.get('[data-testid="product-search-submit"]').click();
      cy.get("@buttonSearch").should("have.been.calledWith", "toolbar");
    });
  });
});
