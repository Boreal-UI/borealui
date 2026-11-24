import { useState } from "react";
import { createRoot } from "react-dom/client";
import CorePager from "../../src/components/Pager/core/Pager";
import NextPager from "../../src/components/Pager/next/Pager";
import CoreButton from "../../src/components/Button/core/Button";
import NextButton from "../../src/components/Button/next/Button";
import "../../src/styles/globals.scss";

const sizes = ["xs", "small", "medium", "large", "xl"] as const;
const next = new URLSearchParams(location.search).get("entry") === "next";
const Pager = next ? NextPager : CorePager;
const Button = next ? NextButton : CoreButton;

function Example({ size }: { size: typeof sizes[number] }) {
  const [page, setPage] = useState(10);
  return <section>
    <Pager size={size} totalItems={120} itemsPerPage={10} currentPage={page}
      onPageChange={setPage} testId={`pager-${size}`} />
    <Pager size={size} totalItems={9990} itemsPerPage={10} currentPage={123}
      serverControlled onPageChange={() => {}} testId={`server-${size}`} />
    <Pager size={size} totalItems={120} itemsPerPage={10} currentPage={10}
      state="disabled" onPageChange={() => {}} testId={`disabled-${size}`} />
    <Button size={size} testId={`ordinary-${size}`}>Ordinary button</Button>
  </section>;
}

createRoot(document.getElementById("root")!).render(
  <main>{sizes.map(size => <Example key={size} size={size} />)}</main>,
);
