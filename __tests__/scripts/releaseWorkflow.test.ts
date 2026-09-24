import { readFileSync } from "fs";
import path from "path";

describe("release workflow source binding", () => {
  const workflow = readFileSync(
    path.join(process.cwd(), ".github", "workflows", "release.yml"),
    "utf8",
  );

  it("verifies and peels the signed release tag before checkout", () => {
    const verificationIndex = workflow.indexOf(
      "- name: Verify the release uses a signed annotated tag",
    );
    const checkoutIndex = workflow.indexOf("- uses: actions/checkout@");

    expect(verificationIndex).toBeGreaterThanOrEqual(0);
    expect(checkoutIndex).toBeGreaterThan(verificationIndex);
    expect(workflow).toContain("'.verification.verified'");
    expect(workflow).toContain("'.object.type'");
    expect(workflow).toContain("'.object.sha'");
    expect(workflow).toContain('echo "commit_sha=${verified_commit}" >> "$GITHUB_OUTPUT"');
  });

  it("checks out the immutable verified commit instead of the tag name", () => {
    expect(workflow).toContain(
      "ref: ${{ steps.verify-release-tag.outputs.commit_sha }}",
    );
    expect(workflow).not.toContain(
      "ref: ${{ github.event.release.tag_name }}",
    );
  });

  it("fails closed if HEAD changes before packaging or publication", () => {
    const assertions = workflow.match(
      /git rev-parse HEAD\) != \"\$VERIFIED_RELEASE_COMMIT\"/g,
    );

    expect(assertions).toHaveLength(3);
    expect(workflow.indexOf("Source changed from the verified release commit before packaging.")).toBeLessThan(
      workflow.indexOf("npm pack ./packages/types"),
    );
    expect(workflow.indexOf("Source changed from the verified release commit before publication.")).toBeLessThan(
      workflow.indexOf("npm publish ./packages/types"),
    );
  });
});
