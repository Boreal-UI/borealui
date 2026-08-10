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

    expect(mockedSpawnSync).toHaveBeenCalledWith(
      expect.not.stringMatching(/^npm(?:\.cmd|\.exe)?$/i),
      expect.any(Array),
      {
        cwd: "/tmp/demo",
        stdio: "inherit",
        shell: false,
      },
    );

    expect(logSpy).toHaveBeenCalledWith("Installed dependencies.");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("warns when the command does not complete successfully", () => {
    mockedSpawnSync.mockReturnValue({
      status: 1,
    } as ReturnType<typeof spawnSync>);

    runCommand("npm", ["install"], "/tmp/demo", "Installed dependencies.");

    expect(logSpy).not.toHaveBeenCalledWith("Installed dependencies.");
    expect(warnSpy).toHaveBeenCalledWith(
      "Skipped: npm install did not complete successfully.",
    );
  });

  it("handles commands without args in warning output", () => {
    mockedSpawnSync.mockReturnValue({
      status: 1,
    } as ReturnType<typeof spawnSync>);

    runCommand("npm", [], "/tmp/demo", "Installed dependencies.");

    expect(warnSpy).toHaveBeenCalledWith(
      "Skipped: npm did not complete successfully.",
    );
  });

  it("warns when a trusted executable cannot be resolved", () => {
    runCommand(
      "boreal-command-that-does-not-exist",
      ["install"],
      "/tmp/demo",
      "Installed dependencies.",
    );

    expect(mockedSpawnSync).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      "Skipped: could not resolve a trusted boreal-command-that-does-not-exist executable.",
    );
  });
});
