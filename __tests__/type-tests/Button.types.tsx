import { createRef, type ComponentRef } from "react";
import CoreButton from "@/components/Button/core/Button";
import NextButton from "@/components/Button/next/Button";

const nativeButtonRef = createRef<HTMLButtonElement>();
const anchorRef = createRef<HTMLAnchorElement>();

// Both guaranteed native render paths accept their corresponding refs.
<CoreButton ref={nativeButtonRef}>Save</CoreButton>;
<CoreButton ref={anchorRef} href="/docs">
  Docs
</CoreButton>;
<NextButton ref={nativeButtonRef}>Save</NextButton>;
<NextButton ref={anchorRef} href="/docs">
  Docs
</NextButton>;

type CoreButtonElement = ComponentRef<typeof CoreButton>;
type NextButtonElement = ComponentRef<typeof NextButton>;

const coreAnchor: CoreButtonElement = document.createElement("a");
const coreButton: CoreButtonElement = document.createElement("button");
const nextAnchor: NextButtonElement = document.createElement("a");
const nextButton: NextButtonElement = document.createElement("button");

// The public instance type must not falsely guarantee a button-only target.
// @ts-expect-error Button may render an anchor when href is supplied.
const buttonOnly: HTMLButtonElement = coreAnchor;

void coreButton;
void nextAnchor;
void nextButton;
void buttonOnly;
