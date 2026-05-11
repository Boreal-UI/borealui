import { mount } from "cypress/react";
import "cypress-axe";

Cypress.Commands.add("mount", mount);

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}
