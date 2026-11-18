/** Keep an active-descendant option visible without scrolling the surrounding page. */
export function scrollActiveOptionIntoView(option: HTMLElement | null) {
  const list = option?.closest<HTMLElement>('[role="listbox"]');
  if (!option || !list) return;
  const optionRect = option.getBoundingClientRect();
  const listRect = list.getBoundingClientRect();
  const top = listRect.top + list.clientTop;
  const bottom = top + list.clientHeight;
  if (optionRect.top < top) list.scrollTop += optionRect.top - top;
  else if (optionRect.bottom > bottom) list.scrollTop += optionRect.bottom - bottom;
}
