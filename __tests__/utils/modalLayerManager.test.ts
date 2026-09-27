import {
  __resetModalLayerManagerForTests,
  getFocusableElements,
  registerModalLayer,
} from "@/utils/modalLayerManager";

const createLayer = (name: string) => {
  const root = document.createElement("div");
  root.dataset.layer = name;
  const scope = document.createElement("div");
  scope.tabIndex = -1;
  const first = document.createElement("button");
  first.textContent = `${name} first`;
  const last = document.createElement("button");
  last.textContent = `${name} last`;
  scope.append(first, last);
  root.appendChild(scope);
  document.body.appendChild(root);
  return { root, scope, first, last };
};

describe("modalLayerManager", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.body.className = "";
    __resetModalLayerManagerForTests();
  });

  afterEach(() => {
    __resetModalLayerManagerForTests();
    document.body.innerHTML = "";
    document.body.className = "";
  });

  it("registers the first layer and restores prior body and background state", () => {
    document.body.classList.add("consumer-class", "noScroll");
    const background = document.createElement("main");
    background.setAttribute("aria-hidden", "false");
    background.setAttribute("inert", "consumer");
    document.body.appendChild(background);
    const layer = createLayer("first");

    const unregister = registerModalLayer(Symbol("first"), {
      getLayerElement: () => layer.root,
      getFocusScope: () => layer.scope,
    });

    expect(document.body).toHaveClass("consumer-class", "noScroll");
    expect(background).toHaveAttribute("aria-hidden", "true");
    expect(background).toHaveAttribute("inert", "");

    unregister();

    expect(document.body).toHaveClass("consumer-class", "noScroll");
    expect(background).toHaveAttribute("aria-hidden", "false");
    expect(background).toHaveAttribute("inert", "consumer");
  });

  it("keeps isolation while removing the top or a lower layer", () => {
    const background = document.createElement("main");
    document.body.appendChild(background);
    const first = createLayer("first");
    const second = createLayer("second");

    const removeFirst = registerModalLayer(Symbol("first"), {
      getLayerElement: () => first.root,
      getFocusScope: () => first.scope,
    });
    const removeSecond = registerModalLayer(Symbol("second"), {
      getLayerElement: () => second.root,
      getFocusScope: () => second.scope,
    });

    expect(first.root).toHaveStyle({ "--boreal-modal-layer-index": "0" });
    expect(second.root).toHaveStyle({ "--boreal-modal-layer-index": "1" });
    expect(first.root).toHaveAttribute("inert");
    expect(second.root).not.toHaveAttribute("inert");

    removeFirst();
    removeFirst();
    expect(first.root.style.getPropertyValue("--boreal-modal-layer-index")).toBe(
      "",
    );
    expect(second.root).toHaveStyle({ "--boreal-modal-layer-index": "0" });
    expect(document.body).toHaveClass("noScroll");
    expect(background).toHaveAttribute("inert");
    expect(second.root).not.toHaveAttribute("inert");

    removeSecond();
    expect(second.root.style.getPropertyValue("--boreal-modal-layer-index")).toBe(
      "",
    );
    expect(document.body).not.toHaveClass("noScroll");
    expect(background).not.toHaveAttribute("inert");
  });

  it("returns ownership to the lower layer after removing the top layer", async () => {
    const opener = document.createElement("button");
    document.body.appendChild(opener);
    opener.focus();
    const first = createLayer("first");
    const second = createLayer("second");

    const removeFirst = registerModalLayer(Symbol("first"), {
      getLayerElement: () => first.root,
      getFocusScope: () => first.scope,
    });
    first.last.focus();
    const removeSecond = registerModalLayer(Symbol("second"), {
      getLayerElement: () => second.root,
      getFocusScope: () => second.scope,
      onEscape: jest.fn(),
    });

    second.last.focus();
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
    );
    expect(second.first).toHaveFocus();

    removeSecond();
    await Promise.resolve();
    expect(first.last).toHaveFocus();
    expect(first.root).not.toHaveAttribute("inert");
    expect(document.body).toHaveClass("noScroll");

    removeFirst();
    await Promise.resolve();
    expect(opener).toHaveFocus();
  });

  it("routes Escape only to the top eligible layer", () => {
    const first = createLayer("first");
    const second = createLayer("second");
    const closeFirst = jest.fn();
    const closeSecond = jest.fn();
    const removeFirst = registerModalLayer(Symbol("first"), {
      getLayerElement: () => first.root,
      getFocusScope: () => first.scope,
      onEscape: closeFirst,
    });
    const removeSecond = registerModalLayer(Symbol("second"), {
      getLayerElement: () => second.root,
      getFocusScope: () => second.scope,
      onEscape: closeSecond,
    });

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(closeSecond).toHaveBeenCalledTimes(1);
    expect(closeFirst).not.toHaveBeenCalled();

    removeSecond();
    removeFirst();
  });

  it("does not route Escape through an ineligible top layer", () => {
    const first = createLayer("first");
    const second = createLayer("second");
    const closeFirst = jest.fn();
    const removeFirst = registerModalLayer(Symbol("first"), {
      getLayerElement: () => first.root,
      getFocusScope: () => first.scope,
      onEscape: closeFirst,
    });
    const removeSecond = registerModalLayer(Symbol("second"), {
      getLayerElement: () => second.root,
      getFocusScope: () => second.scope,
    });

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(closeFirst).not.toHaveBeenCalled();

    removeSecond();
    removeFirst();
  });

  it("cancels transient focus restoration in a Strict Mode-like cycle", async () => {
    const opener = document.createElement("button");
    document.body.appendChild(opener);
    opener.focus();
    const layer = createLayer("strict");
    const id = Symbol("strict");
    const options = {
      getLayerElement: () => layer.root,
      getFocusScope: () => layer.scope,
    };

    const firstCleanup = registerModalLayer(id, options);
    layer.first.focus();
    firstCleanup();
    const secondCleanup = registerModalLayer(id, options);
    await Promise.resolve();

    expect(layer.first).toHaveFocus();
    expect(document.body).toHaveClass("noScroll");

    secondCleanup();
    await Promise.resolve();
    expect(opener).toHaveFocus();
  });

  it("resolves dynamically added and enabled focusable elements", () => {
    const layer = createLayer("dynamic");
    const dynamic = document.createElement("button");
    dynamic.disabled = true;
    layer.scope.appendChild(dynamic);
    expect(getFocusableElements(layer.scope)).not.toContain(dynamic);

    dynamic.disabled = false;
    expect(getFocusableElements(layer.scope)).toContain(dynamic);
  });
});
