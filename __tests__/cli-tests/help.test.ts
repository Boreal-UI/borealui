import {
  fail,
  printHelp,
  printVersion,
} from "../../packages/cli/src/utils/help.js";
import { VERSION } from "../../packages/cli/src/utils/constants.js";

describe("CLI help utils", () => {
  let logSpy: jest.SpyInstance<void, Parameters<typeof console.log>>;
  let errorSpy: jest.SpyInstance<void, Parameters<typeof console.error>>;
  let exitSpy: jest.SpyInstance<
    never,
    [code?: string | number | null | undefined]
  >;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    exitSpy = jest.spyOn(process, "exit").mockImplementation((() => {
      throw new Error("process.exit");
    }) as never);
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it("prints CLI help text", () => {
    printHelp();

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Boreal UI CLI"),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("boreal-ui init [project-directory] [options]"),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("--recommended-globals"),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("--no-recommended-globals"),
    );
  });

  it("prints the CLI version", () => {
    printVersion();

    expect(logSpy).toHaveBeenCalledWith(VERSION);
  });

  it("prints an error and exits with code 1", () => {
    expect(() => fail("Something went wrong.")).toThrow("process.exit");

    expect(errorSpy).toHaveBeenCalledWith("\nSomething went wrong.");
    expect(errorSpy).toHaveBeenCalledWith("Run boreal-ui --help for usage.");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
