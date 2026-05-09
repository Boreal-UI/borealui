import { spawnSync } from "node:child_process";
import { runCommand } from "../../packages/cli/src/utils/filesystem.js";

jest.mock("node:child_process", () => ({
  spawnSync: jest.fn(),
}));

const mockedSpawnSync = jest.mocked(spawnSync);

describe("runCommand", () => {
  let logSpy: jest.SpyInstance<void, Parameters<typeof console.log>>;
  let warnSpy: jest.SpyInstance<void, Parameters<typeof console.warn>>;

  beforeEach(() => {
    mockedSpawnSync.mockReset();

    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it("runs the command with inherited stdio and logs success when status is 0", () => {
    mockedSpawnSync.mockReturnValue({
      status: 0,
    } as ReturnType<typeof spawnSync>);

    runCommand("npm", ["install"], "/tmp/demo", "Installed dependencies.");

    expect(mockedSpawnSync).toHaveBeenCalledWith("npm", ["install"], {
      cwd: "/tmp/demo",
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    expect(logSpy).toHaveBeenCalledWith("Installed dependencies.");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("warns when the command does not complete successfully", () => {
    mockedSpawnSync.mockReturnValue({
      status: 1,
    } as ReturnType<typeof spawnSync>);

    runCommand("pnpm", ["install"], "/tmp/demo", "Installed dependencies.");

    expect(logSpy).not.toHaveBeenCalledWith("Installed dependencies.");
    expect(warnSpy).toHaveBeenCalledWith(
      "Skipped: pnpm install did not complete successfully.",
    );
  });

  it("handles commands without args in warning output", () => {
    mockedSpawnSync.mockReturnValue({
      status: 1,
    } as ReturnType<typeof spawnSync>);

    runCommand("yarn", [], "/tmp/demo", "Installed dependencies.");

    expect(warnSpy).toHaveBeenCalledWith(
      "Skipped: yarn  did not complete successfully.",
    );
  });
});
