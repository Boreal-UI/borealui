import CoreDataTable from "../../src/components/DataTable/core/DataTable";
import NextDataTable from "../../src/components/DataTable/next/DataTable";
import "../../src/styles/globals.scss";

for (const [name, DataTable] of [["core", CoreDataTable], ["next", NextDataTable]] as const) {
  describe(`${name} DataTable scroll and nested interactions`, () => {
    it("tabs into the scroller, shows focus, and stays focusable when it fits", () => {
      cy.viewport(1000, 600);
      cy.mount(<><button>Before table</button><div style={{ width: 300 }}>
        <DataTable caption="Publications" data={[{ name: "Aurora" }]} columns={[{ key: "name", label: "Name", minWidth: "1200px" }]} />
      </div></>);
      cy.contains("button", "Before table").focus();
      cy.press(Cypress.Keyboard.Keys.TAB);
      cy.get('[role="region"]').should("be.focused").and("have.attr", "aria-labelledby");
      cy.get('[role="region"]').should(($region) => {
        expect($region[0].matches(":focus-visible")).to.equal(true);
        expect(getComputedStyle($region[0]).outlineStyle).to.equal("solid");
        expect(getComputedStyle($region[0]).outlineWidth).to.equal("2px");
        expect($region[0].scrollWidth).to.be.greaterThan($region[0].clientWidth);
      });
      cy.mount(<div style={{ width: 900 }}><DataTable caption="Small table" data={[{ name: "Aurora" }]} columns={[{ key: "name", label: "Name" }]} /></div>);
      cy.get('[role="region"]').should("have.attr", "tabindex", "0").should(($region) => {
        expect($region[0].scrollWidth).to.equal($region[0].clientWidth);
      });
    });

    it("preserves link defaults, modified clicks and nested controls while allowing row activation", () => {
      const rowClick = cy.stub().as("rowClick");
      const edit = cy.stub().as("edit");
      cy.mount(<DataTable caption="Members" onRowClick={rowClick} data={[{ name: "Aurora" }]} columns={[{
        key: "name", label: "Member", render: () => <><span>Row content</span><a href="#member-details">Details</a><button onClick={edit}>Edit</button><input aria-label="Notes" /><select aria-label="Status"><option>Draft</option><option>Ready</option></select><textarea aria-label="Description" /><span role="button" tabIndex={0}>Custom control</span></>,
      }]} />);
      cy.contains("button", "Edit").click();
      cy.get("@edit").should("have.been.calledOnce");
      cy.get("input").type("Notes{enter}");
      cy.get("textarea").type("Details ");
      cy.get("select").select("Ready");
      cy.contains("Custom control").click().focus();
      cy.press(Cypress.Keyboard.Keys.SPACE);
      cy.contains("a", "Details").then(($link) => {
        $link[0].addEventListener("click", (event) => {
          expect(event.defaultPrevented).to.equal(false);
        });
      }).click({ ctrlKey: true }).click();
      cy.get("@rowClick").should("not.have.been.called");
      cy.contains("Row content").click();
      cy.get("tbody tr").focus();
      cy.press(Cypress.Keyboard.Keys.ENTER);
      cy.press(Cypress.Keyboard.Keys.SPACE);
      cy.get("@rowClick").should("have.been.calledThrice");
    });
  });
}
