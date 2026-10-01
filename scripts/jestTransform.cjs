const ts = require("typescript");

// Compile ESM dependencies for Jest's CommonJS runtime, including Node 20 CI.
module.exports = {
  process(sourceText, sourcePath) {
    const result = ts.transpileModule(sourceText, {
      fileName: sourcePath,
      compilerOptions: {
        allowJs: true,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
        inlineSourceMap: true,
        inlineSources: true,
      },
    });
    return { code: result.outputText };
  },
};
