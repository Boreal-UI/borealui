const questionMock = jest.fn<Promise<string>, [string]>();
const closeMock = jest.fn<void, []>();

jest.mock("node:readline/promises", () => ({
  createInterface: jest.fn(() => ({
    question: questionMock,
    close: closeMock,
  })),
}));

import { createInterface } from "node:readline/promises";
import { promptForOptions } from "../../packages/cli/src/utils/prompts.js";
import * as help from "../../packages/cli/src/utils/help.js";

const mockedCreateInterface = jest.mocked(createInterface);

describe("promptForOptions", () => {
  let failSpy: jest.SpyInstance<void, [message?: string]>;

  beforeEach(() => {
    questionMock.mockReset();
    closeMock.mockReset();
    mockedCreateInterface.mockClear();

    failSpy = jest
      .spyOn(help, "fail")
      .mockImplementation((message?: string) => {
        throw new Error(message);
      });
  });

  afterEach(() => {
    failSpy.mockRestore();
  });

  it("sets default cwd when cwd is missing", async () => {
    const result = await promptForOptions({
      framework: "react",
      install: false,
      packageManager: "npm",
      dryRun: false,
      yes: true,
    });

    expect(result.cwd).toBe(".");
  });

  it("normalizes next.js framework alias", async () => {
    const result = await promptForOptions({
      cwd: ".",
      framework: "next.js",
      install: false,
      packageManager: "npm",
      dryRun: false,
      yes: true,
    });

    expect(result.framework).toBe("next");
  });

  it("normalizes react-core framework alias", async () => {
    const result = await promptForOptions({
      cwd: ".",
      framework: "react-core",
      install: false,
      packageManager: "npm",
      dryRun: false,
      yes: true,
    });

    expect(result.framework).toBe("react");
  });

  it("fails when framework is invalid", async () => {
    await expect(
      promptForOptions({
        cwd: ".",
        framework: "vue",
        install: false,
        packageManager: "npm",
        dryRun: false,
        yes: true,
      }),
    ).rejects.toThrow("Framework must be either react or next.");

    expect(failSpy).toHaveBeenCalledWith(
      "Framework must be either react or next.",
    );
  });

  it("normalizes package manager casing", async () => {
    const result = await promptForOptions({
      cwd: ".",
      framework: "react",
      install: false,
      packageManager: "PNPM",
      dryRun: false,
      yes: true,
    });

    expect(result.packageManager).toBe("pnpm");
  });

  it("fails when package manager is invalid", async () => {
    await expect(
      promptForOptions({
        cwd: ".",
        framework: "react",
        install: false,
        packageManager: "bun",
        dryRun: false,
        yes: true,
      }),
    ).rejects.toThrow("Package manager must be npm, pnpm, or yarn.");

    expect(failSpy).toHaveBeenCalledWith(
      "Package manager must be npm, pnpm, or yarn.",
    );
  });

  it("does not ask framework question when yes is true and framework is missing", async () => {
    const result = await promptForOptions({
      cwd: ".",
      framework: undefined,
      install: false,
      packageManager: "npm",
      dryRun: false,
      yes: true,
    });

    expect(result.framework).toBeUndefined();
    expect(questionMock).not.toHaveBeenCalledWith(
      expect.stringContaining("Framework?"),
    );
  });

  it("asks for framework when missing and yes is false", async () => {
    questionMock.mockResolvedValueOnce("next");

    const result = await promptForOptions({
      cwd: ".",
      framework: undefined,
      install: false,
      packageManager: "npm",
      dryRun: false,
      yes: false,
    });

    expect(result.framework).toBe("next");
    expect(questionMock).toHaveBeenCalledWith(
      "Framework? Leave blank to auto-detect, or choose react/next: ",
    );
  });

  it("leaves framework undefined when framework prompt answer is blank", async () => {
    questionMock.mockResolvedValueOnce("");

    const result = await promptForOptions({
      cwd: ".",
      framework: undefined,
      install: false,
      packageManager: "npm",
      dryRun: false,
      yes: false,
    });

    expect(result.framework).toBeUndefined();
  });

  it("sets install to false during dry run", async () => {
    const result = await promptForOptions({
      cwd: ".",
      framework: "react",
      install: undefined,
      packageManager: "npm",
      dryRun: true,
      yes: false,
    });

    expect(result.install).toBe(false);
    expect(questionMock).not.toHaveBeenCalledWith(
      expect.stringContaining("Run dependency install"),
    );
  });

  it("uses default install value when yes is true", async () => {
    const result = await promptForOptions({
      cwd: ".",
      framework: "react",
      install: undefined,
      packageManager: "npm",
      dryRun: false,
      yes: true,
    });

    expect(result.install).toBe(false);
  });

  it("prompts install and accepts yes answer", async () => {
    questionMock.mockResolvedValueOnce("y");

    const result = await promptForOptions({
      cwd: ".",
      framework: "react",
      install: undefined,
      packageManager: "npm",
      dryRun: false,
      yes: false,
    });

    expect(result.install).toBe(true);
    expect(questionMock).toHaveBeenCalledWith(
      "Run dependency install after applying changes? (y/N): ",
    );
  });

  it("prompts install and rejects no answer", async () => {
    questionMock.mockResolvedValueOnce("no");

    const result = await promptForOptions({
      cwd: ".",
      framework: "react",
      install: undefined,
      packageManager: "npm",
      dryRun: false,
      yes: false,
    });

    expect(result.install).toBe(false);
  });

  it("closes the readline interface after successful prompting", async () => {
    await promptForOptions({
      cwd: ".",
      framework: "react",
      install: false,
      packageManager: "npm",
      dryRun: false,
      yes: true,
    });

    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("closes the readline interface when prompting fails", async () => {
    await expect(
      promptForOptions({
        cwd: ".",
        framework: "angular",
        install: false,
        packageManager: "npm",
        dryRun: false,
        yes: true,
      }),
    ).rejects.toThrow("Framework must be either react or next.");

    expect(closeMock).toHaveBeenCalledTimes(1);
  });
});
