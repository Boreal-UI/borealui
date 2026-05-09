import { parseArgs } from "../../packages/cli/src/utils/args";
import * as help from "../../packages/cli/src/utils/help";

describe("CLI parseArgs", () => {
  let exitSpy: jest.SpyInstance<
    never,
    [code?: string | number | null | undefined]
  >;
  let failSpy: jest.SpyInstance<void, [message?: string]>;
  let printHelpSpy: jest.SpyInstance<void, []>;
  let printVersionSpy: jest.SpyInstance<void, []>;

  beforeEach(() => {
    exitSpy = jest.spyOn(process, "exit").mockImplementation((() => {
      throw new Error("process.exit");
    }) as never);

    failSpy = jest.spyOn(help, "fail").mockImplementation((message: string) => {
      throw new Error(message);
    });

    printHelpSpy = jest.spyOn(help, "printHelp").mockImplementation(() => {});
    printVersionSpy = jest
      .spyOn(help, "printVersion")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    exitSpy.mockRestore();
    failSpy.mockRestore();
    printHelpSpy.mockRestore();
    printVersionSpy.mockRestore();
  });

  it("returns defaults for empty argv", async () => {
    await expect(parseArgs([])).resolves.toEqual({
      command: "init",
      cwd: undefined,
      framework: undefined,
      install: undefined,
      packageManager: undefined,
      recommendedGlobals: undefined,
      dryRun: false,
      yes: false,
    });
  });

  it.each(["create", "init", "setup"] as const)(
    "uses %s as the command when provided first",
    async (command) => {
      await expect(parseArgs([command])).resolves.toMatchObject({
        command,
      });
    },
  );

  it("parses cwd aliases", async () => {
    await expect(parseArgs(["--cwd", "demo-app"])).resolves.toMatchObject({
      cwd: "demo-app",
    });

    await expect(
      parseArgs(["--project", "project-app"]),
    ).resolves.toMatchObject({
      cwd: "project-app",
    });

    await expect(parseArgs(["--dir", "dir-app"])).resolves.toMatchObject({
      cwd: "dir-app",
    });
  });

  it("parses framework, package manager, install, dry run, yes, and recommended globals", async () => {
    await expect(
      parseArgs([
        "setup",
        "--framework",
        "next",
        "--install",
        "--package-manager",
        "pnpm",
        "--recommended-globals",
        "--dry-run",
        "--yes",
      ]),
    ).resolves.toEqual({
      command: "setup",
      cwd: undefined,
      framework: "next",
      install: true,
      packageManager: "pnpm",
      recommendedGlobals: true,
      dryRun: true,
      yes: true,
    });
  });

  it("parses no-install and no-recommended-globals", async () => {
    await expect(
      parseArgs(["--no-install", "--no-recommended-globals"]),
    ).resolves.toMatchObject({
      install: false,
      recommendedGlobals: false,
    });
  });

  it("uses positional argument as cwd", async () => {
    await expect(parseArgs(["my-app"])).resolves.toMatchObject({
      cwd: "my-app",
    });
  });

  it("fails on unexpected positional argument after cwd is already set", async () => {
    await expect(parseArgs(["my-app", "extra"])).rejects.toThrow(
      "Unexpected argument: extra",
    );

    expect(failSpy).toHaveBeenCalledWith("Unexpected argument: extra");
  });

  it("fails on unknown option", async () => {
    await expect(parseArgs(["--bad-option"])).rejects.toThrow(
      "Unknown option: --bad-option",
    );

    expect(failSpy).toHaveBeenCalledWith("Unknown option: --bad-option");
  });

  it("prints help and exits for --help", async () => {
    await expect(parseArgs(["--help"])).rejects.toThrow("process.exit");

    expect(printHelpSpy).toHaveBeenCalledTimes(1);
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("prints help and exits for -h", async () => {
    await expect(parseArgs(["-h"])).rejects.toThrow("process.exit");

    expect(printHelpSpy).toHaveBeenCalledTimes(1);
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("prints version and exits for --version", async () => {
    await expect(parseArgs(["--version"])).rejects.toThrow("process.exit");

    expect(printVersionSpy).toHaveBeenCalledTimes(1);
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("prints version and exits for -v", async () => {
    await expect(parseArgs(["-v"])).rejects.toThrow("process.exit");

    expect(printVersionSpy).toHaveBeenCalledTimes(1);
    expect(exitSpy).toHaveBeenCalledWith(0);
  });
});
