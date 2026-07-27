/// <reference types="cypress" />

import { useState } from "react";
import { Chip, NotificationCenter } from "../../src/index.core";

describe("timer isolation", () => {
  it("keeps auto-close deadlines independent across multiple chips", () => {
    cy.clock();
    const firstOnClose = cy.stub().as("firstChipClose");
    const secondOnClose = cy.stub().as("secondChipClose");

    cy.mount(
      <div>
        <Chip
          id="first-chip"
          message="First chip"
          visible
          duration={500}
          usePortal={false}
          onClose={firstOnClose}
          data-testid="first-chip"
        />
        <Chip
          id="second-chip"
          message="Second chip"
          visible
          duration={1000}
          usePortal={false}
          onClose={secondOnClose}
          data-testid="second-chip"
        />
      </div>,
    );

    cy.get('[data-testid="first-chip"]').should("be.visible");
    cy.get('[data-testid="second-chip"]').should("be.visible");

    cy.tick(799);
    cy.get("@firstChipClose").should("not.have.been.called");
    cy.get("@secondChipClose").should("not.have.been.called");

    cy.tick(1);
    cy.get("@firstChipClose").should("have.been.calledOnce");
    cy.get("@secondChipClose").should("not.have.been.called");

    cy.tick(500);
    cy.get("@firstChipClose").should("have.been.calledOnce");
    cy.get("@secondChipClose").should("have.been.calledOnce");
  });

  it("does not clear a sibling notification timer when an instance unmounts", () => {
    const firstOnRemove = cy.stub().as("firstNotificationRemove");
    const secondOnRemove = cy.stub().as("secondNotificationRemove");

    function MultipleCenters() {
      const [showFirst, setShowFirst] = useState(true);

      return (
        <div>
          <button type="button" onClick={() => setShowFirst(false)}>
            Unmount first center
          </button>
          <div>
            {showFirst ? (
              <NotificationCenter
                notifications={[
                  {
                    id: "shared-id",
                    message: "First center notification",
                    type: "info",
                    duration: 150,
                  },
                ]}
                onRemove={firstOnRemove}
                data-testid="first-center"
              />
            ) : null}
          </div>
          <div>
            <NotificationCenter
              notifications={[
                {
                  id: "shared-id",
                  message: "Second center notification",
                  type: "info",
                  duration: 600,
                },
              ]}
              onRemove={secondOnRemove}
              data-testid="second-center"
            />
          </div>
        </div>
      );
    }

    cy.mount(<MultipleCenters />);
    cy.contains("button", "Unmount first center").click();
    cy.get('[data-testid="first-center"]').should("not.exist");

    cy.wait(300);
    cy.get("@firstNotificationRemove").should("not.have.been.called");
    cy.get("@secondNotificationRemove").should("not.have.been.called");

    cy.wait(350);
    cy.get("@firstNotificationRemove").should("not.have.been.called");
    cy.get("@secondNotificationRemove")
      .should("have.been.calledOnce")
      .and("have.been.calledWith", "shared-id");
  });
});
