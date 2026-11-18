import CoreSelect from "../../src/components/Select/core/Select";
import NextSelect from "../../src/components/Select/next/Select";
import { SelectNativeExamples } from "../../shared-story-assets/SelectNativeExamples";

for (const [name, Select] of [["core", CoreSelect], ["next", NextSelect]] as const) {
  describe(`${name} native Select forms`, () => {
    it("keeps controlled state, selection and repeated React action submissions synchronized", () => {
      cy.mount(<SelectNativeExamples Select={Select} />);
      cy.get('select[name="format"]').first().select("digital");
      cy.contains("button", "Publish").click();
      cy.get('output[aria-label="Submitted formats"]').should("have.text", "digital");
      cy.get('output[aria-label="Current format"]').should("have.text", "digital");
      cy.get('select[name="format"]').first().should("have.value", "digital");
      cy.contains("button", "Publish").click();
      cy.get('output[aria-label="Submitted formats"]').should("have.text", "digital,digital");
      cy.contains("button", "Reset controlled").click();
      cy.get('select[name="format"]').first().should("have.value", "digital");
      cy.contains("button", "Use print").click();
      cy.get('select[name="format"]').first().should("have.value", "print");
      cy.contains("button", "Publish").click();
      cy.get('output[aria-label="Submitted formats"]').should("have.text", "digital,digital,print");
      cy.get('select[name="format"]').first().select("digital");
      cy.contains("button", "Publish and reset format").click();
      cy.get('select[name="format"]').first().should("have.value", "print");
      cy.get('output[aria-label="Current format"]').should("have.text", "print");
      cy.contains("button", /^Publish$/).click();
      cy.get('output[aria-label="Submitted formats"]').should("have.text", "digital,digital,print,digital,print");
    });

    it("uses native empty values, required validity and uncontrolled reset", () => {
      cy.mount(<SelectNativeExamples Select={Select} />);
      cy.get<HTMLSelectElement>('select[name="status"]').select("published").select("").then(($select) => {
        expect(new FormData($select[0].form!).get("status")).to.equal("");
      });
      cy.get<HTMLSelectElement>('select[name="requiredFormat"]').then(($select) => {
        expect($select[0].checkValidity()).to.equal(false);
      });
      cy.get('select[name="format"]').last().select("digital");
      cy.contains("button", "Reset uncontrolled").click();
      cy.get('select[name="format"]').last().should("have.value", "print");
      cy.get('option[value="unavailable"]').should("be.disabled");
    });
  });
}
