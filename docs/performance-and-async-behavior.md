# Performance and Async Behavior

Boreal UI components keep timer, polling, and transient UI state local to each mounted component instance. Rendering two instances of the same component does not share or overwrite their timers.

## Timed Feedback

### Chip

`Chip` starts its auto-close countdown when `visible` is `true` and `autoClose` is enabled. `duration` controls the countdown and defaults to 3000 milliseconds. After a close begins, the component keeps its exit state for 300 milliseconds before calling `onClose`.

Repeated close requests during that exit window are coalesced into one callback. Pending auto-close and exit timers are cleared when the Chip becomes hidden or unmounts.

```tsx
<>
  <Chip
    id="saved-chip"
    message="Saved"
    visible={showSaved}
    duration={1500}
    onClose={() => setShowSaved(false)}
  />
  <Chip
    id="synced-chip"
    message="Synced"
    visible={showSynced}
    duration={3000}
    onClose={() => setShowSynced(false)}
  />
</>
```

Each Chip owns its own timer. Give rendered elements unique `id` values so HTML and ARIA references also remain unique.

### ToastProvider

Toast timers are owned by the nearest `ToastProvider`. Adding a toast with an existing `id` replaces the previous toast and restarts its expiry timer from the replacement's `duration`.

Use stable IDs when an event should update an existing toast, such as changing an upload from pending to complete. Omit the ID when every event should create a separate toast.

```tsx
const { addToast } = useToast();

addToast({
  id: "profile-save",
  message: "Saving profile...",
  duration: 0,
});

addToast({
  id: "profile-save",
  message: "Profile saved",
  duration: 2500,
});
```

`duration: 0` keeps a toast visible until it is removed or replaced.

### Modal

`Modal` coalesces repeated overlay, Escape, and close-button requests while its 200-millisecond exit transition runs. `onClose` is called once after the transition. The pending callback and animation-frame work are canceled if the Modal unmounts.

## Polling

### NotificationCenter

When `fetchNotifications` is provided, `NotificationCenter` loads immediately. If `pollInterval` is greater than zero, it schedules the next load only after the current request settles. Slow requests therefore do not overlap or accumulate.

Notification expiry timers are scoped to each NotificationCenter instance. A notification ID must be unique within one center, but a separate center can use the same ID without affecting the first center's timer.

```tsx
<NotificationCenter
  notifications={notifications}
  onRemove={removeNotification}
  fetchNotifications={loadNotifications}
  pollInterval={10_000}
/>
```

Changing `onRemove` does not restart existing expiry deadlines; an expiring notification calls the latest callback. Set `pollInterval={0}` to perform the initial load without scheduling later polls.

### Select

`Select` follows the same completion-based polling model when `asyncOptions` is supplied. It loads immediately, waits for that request to settle, and then waits `pollInterval` milliseconds before starting another request. Polling stops on unmount.

```tsx
<Select
  aria-label="Project"
  value={projectId}
  onChange={setProjectId}
  options={[]}
  asyncOptions={loadProjects}
  pollInterval={30_000}
/>
```

Equivalent option results do not replace internal state, which avoids unnecessary render work. Equality is based on each option's `value`, `label`, and `disabled` fields.

## File Upload Completion

After an upload settles, `FileUpload` briefly keeps its completion progress visible before restoring the upload controls. The delayed reset, progress interval, and post-request state updates are canceled when the component unmounts.

Consumers do not need to clean up Boreal's internal upload timers. Cancellation of the actual network request remains the responsibility of the `onSubmit` implementation when that behavior is required.

## DataTable Rendering

For client-side pagination, index-based fallback selection keys are calculated across the complete dataset rather than restarting on each page. For sorting, server pagination, virtualization, or mutable datasets, provide a stable `rowKey` so selection and expansion continue to identify the intended record.

```tsx
<DataTable
  columns={columns}
  data={rows}
  rowKey={(row) => row.id}
  pagination
  selectableRows
/>
```

Keep large `columns`, `data`, and controlled key arrays referentially stable with module-level constants or `useMemo` when their values have not changed. Standalone component imports also provide the clearest bundle boundary:

```tsx
import DataTable from "@boreal-ui/next/DataTable";
```

## ThemeProvider Rendering

`ThemeProvider` compares custom schemes by serialized value, so a parent that recreates an equivalent array does not rebuild the available scheme list. Keeping a large custom scheme collection stable with a module-level constant or `useMemo` still avoids repeated serialization work.

Set `enableThemeScript={false}` when the app already applies server-generated theme attributes. With the option disabled, ThemeProvider does not generate or render the pre-hydration script. The Next provider defaults this option to `false`; the core provider defaults it to `true`.

See [Styling and Theming](./styling-and-theming.md) for SSR setup and theme persistence options.

## Next.js Scroll Restoration

Boreal globals keep the root element's `scroll-behavior` set to `auto`. This allows Next.js to manage scroll position during route transitions and avoids requiring `data-scroll-behavior` on `<html>` merely because Boreal's global stylesheet is imported.

Applications can still opt into smooth root scrolling. When doing so in Next.js, add `data-scroll-behavior="smooth"` to the root `<html>` element so the framework can temporarily disable smooth scrolling during navigation.
