import { cookies } from "next/headers";
import type { ReactNode } from "react";
import NextThemeProvider from "../../../src/context/NextThemeProvider";
import { getThemeAttributes, resolveThemeScheme, THEME_COOKIE_NAME } from "../../../src/context/themeRuntime";
import { themeConfig, workspaceTheme } from "../theme";
import "../../../src/styles/globals.scss";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const preference = (await cookies()).get(THEME_COOKIE_NAME)?.value;
  const scheme = resolveThemeScheme(preference, { ...themeConfig, fallbackSchemeName: workspaceTheme.name });
  return <html lang="en" {...getThemeAttributes(scheme)}><body>
    <NextThemeProvider {...themeConfig} initialSchemeName={scheme.name}>{children}</NextThemeProvider>
  </body></html>;
}
