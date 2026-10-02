# journ

Portable, token-driven UI package. React 19 and Tailwind v4. Self-contained: no workspace or catalog dependencies, so it can be copied into other monorepos by source.

## Design style

Mobile-first, dark, playful. Flat saturated color blocks on a near-black canvas, big rounded shapes, condensed uppercase display type, and monospace micro-labels.

### Color

All color comes from tokens in `src/styles/tokens.css`. Never use raw colors or Tailwind palette colors in components.

| Token           | Role                                              |
| --------------- | ------------------------------------------------- |
| `journ-ink`     | Page canvas, text on colored surfaces, dark chips |
| `journ-surface` | Default card surface, drawers, toasts             |
| `journ-paper`   | Text on dark surfaces, light buttons, selects     |
| `journ-coral`   | Primary accent, key actions, warm blocks          |
| `journ-yellow`  | Highlights, alerts, tags on dark                  |
| `journ-indigo`  | Secondary block color                             |
| `journ-mint`    | Calm block color, positive emphasis               |
| `journ-sky`     | Active state (nav item), user message bubbles     |

Rules:

- Color is applied as whole surfaces ("tones"), not as borders or gradients. Cards have no border and no shadow.
- Text on a colored tone is `journ-ink`. Text on `dark` is `journ-paper`.
- Secondary text is the same color at reduced opacity (`opacity-70`), never a separate gray.
- Translucent paper (`journ-paper/10`) is the "dim" layer on dark surfaces: composer, message bubbles, ghost buttons.

### Shape

- Cards and drawers use `--radius-journ` (1.75rem). Inner tiles (`Card.Icon`) use `rounded-2xl`.
- Anything pressable or label-like is a full pill (`rounded-full`): buttons, chips, selects, nav, composer.
- Stacked cards may overlap with negative margin to create layered "folders". Integration cards may tilt a few degrees. Use sparingly.

### Typography

- Display: `font-journ-display` (Barlow Condensed, weight 500 or 600), uppercase, tight leading (`leading-[0.95]` to `leading-none`). Used for titles, stat labels and values.
- Body: the host app font, small (`text-sm/5`, `text-sm/6`).
- Micro labels (chips, counters, tags): `font-mono text-xs`.
- Inputs are 16px on mobile and 14px from `sm` up, to prevent iOS focus zoom.

### Layout

- Every screen is a `Page.Root` with its own `tone`. Each page picks a different background, as in the references. `ink` is the default dark canvas; the colored tones switch text to `journ-ink`.
- Controls that must adapt to the page (`IconButton` and `Button` with `ghost` or `outline`, `Composer`) inherit the page text color and use `currentColor` for their tint, so they stay legible on any page tone. Cards keep their own tone and do not depend on the page.
- `Page.Content` is the column (safe-area padding included). `Page.Footer` pins its content, usually the `NavBar`, to the bottom.
- Single column, content width capped at `max-w-sm`, `px-4` gutters.
- Page structure: `Page.Root` > `Page.Content` > `PageHeader` (back button, title, actions), optional filter row of `PillSelect`, a stack of cards, `NavBar` inside `Page.Footer`.
- Spacing between blocks is `gap-4`. Inside cards, `gap-3`.
- Icons come from `lucide-react`, sized by the parent (`size-5`, `size-4` in small buttons).

### Interaction

Every pressable thing shares `src/lib/interactive.ts`, ported from Catalyst:

- Keyboard-only focus ring (`focus-visible`), never on tap.
- Hover and press overlay using `currentColor` (`/10` hover, `/15` press), layered between background and content.
- Disabled and `aria-disabled` dim to 50% and ignore pointer events.
- `TouchTarget` expands the hit area to at least 44x44px on touch devices only.

Use `Button`, `IconButton` or `NavBar.Item` for anything pressable. Do not hand-roll pressable elements.

### Shared building blocks

Before writing a class string or an animation, look in `src/lib` first:

- `tones.ts`: `fills`, `solidTones`, `inkTone`, `surfaceTones`. Every tone map is built from these.
- `text-styles.ts`: `displayTitle`, `displayHeading`, `displayLabel`, `mutedText`, `controlSize`, `fieldText`, `fieldRing` and the `selectedWhen*` pill classes.
- `overlay.ts`: floating surface/item/card styles, the modal overlay and the centered panel (Dialog, AlertDialog).
- `modal-parts.tsx`: `Body` and `Actions`, shared by Dialog, AlertDialog and Drawer.
- `menu-parts.tsx`: `createMenuParts(primitive, slot)` builds the styled `Content`, `Item`, `Label` and `Separator` for a Radix menu. Used by DropdownMenu, ContextMenu and Select.
- `required-context.ts`: `createRequiredContext(owner)` for parts that must live inside a root. Do not hand-write the `use` and throw pair.
- `picker.tsx`: `createPicker(name, slot)` gives a drawer picker its state, `Trigger`, `Value` and context. Used by Combobox, DatePicker and DateRangePicker.
- `month.ts`: `startOfMonth`, `addMonths`, `formatMonthYear`.
- `icon-tile.ts`: the rounded icon square used by Card.Icon, EmptyState.Icon and FileDropzone.Icon.
- `interactive.ts`: `interactive` and `pressReset` for anything pressable.
- `use-enter.ts`: `useEnter`, `usePopEnter`, `useModalEnter`, `useExpand` and `prefersReducedMotion`.
- `touch-target.tsx`: the 44px touch area, never re-implement it with classes.

### Scrollbars

- Native scroll containers inside journ use the `scrollbar-journ` utility (defined in `tokens.css`): thin, transparent track, thumb in the current text color at 30%.
- For a fully custom, overlay scrollbar use `ScrollArea` (Radix). It shows on hover by default and has a 44px touch hit area.

### Motion and touch

Rules from the design style guide, applied across the package:

- Interactions stay at or under 200ms. Frequent surfaces (menus, popovers, tooltips) are quiet: small scale, short fade.
- Dialogs scale in from 0.85, pressed controls scale to 0.96. Never animate from 0.
- Animate `transform` and `opacity` only. Skip animation when `prefers-reduced-motion` is set.
- Pressable controls share `interactive`/`pressReset` from `src/lib/interactive.ts`: no text selection, no iOS tap flash, press scale, keyboard-only focus ring.
- Numbers that change or line up (stats, table cells, badges, pagination, calendar days) use `tabular-nums`.
- Inputs are 16px on mobile. Hover styles come from Tailwind, which already gates them behind `(hover: hover)`.
- Focus rings use `outline` with an offset. Modern browsers round it to the element radius, so we do not use `box-shadow` rings.

## Composition rules

Follow the composable pattern (`folio kb get react-composition-patterns`).

- Compound components: `Card.Root`, `Card.Header`, `Card.Title`. Consumers pick the parts they need.
- Pass `children`, not `renderX` props. No boolean props like `showFooter`.
- Variants are string unions (`tone`, `from`), never combinations of booleans.
- Each part sets a `data-slot` attribute and merges `className` through `cn`, so consumers can override.
- React 19 style: `ref` is a regular prop, no `forwardRef`.
- Share state through a provider only when parts truly share state. Stateless parts need no context.
- Shared context is `{ state, actions, meta }`. `X.Provider` takes all three, so the state can come from anywhere (local, global store, server). `X.Root` is the default provider that owns local state with `value`, `defaultValue` and `onValueChange`. Neither renders DOM; `X.Frame` does.
- Export a `useX` hook next to the namespace, so custom UI inside the provider can read state and call actions without being nested in the frame.

## Code conventions

- Radix UI primitives (`@radix-ui/react-*`) are the base for interactive components (checkbox, radio group, switch, tabs, dialog, select, dropdown menu, tooltip, popover, accordion, progress). Style them with journ tokens and expose them as compound components. Drawer (vaul) and Toast (sonner) are the exceptions.
- Components are arrow functions.
- Export only at the end of the file, in one `export { ... }` block, so unused code is easy to spot.
- Styles go through `tv` from `./lib/tv` and `cn` from `./lib/cn`.
- A compound object (`const Card = { Root, ... }`) is the public API of a component file.
- Client-only parts (vaul, sonner, cmdk) live in `*-parts.tsx` with `'use client'`. The sibling file without the directive builds the `Drawer.X` or `Toast.X` object, because a namespace object exported from a client file cannot be read from a server component.
- Tests only for components with real logic or state (switchers, accordions, slides, `Stack`). Stateless presentational components are not tested. Run with `pnpm --filter journ test:run`; `animejs` is mocked.
- Animations use `animejs` (v4, `animate`). Skip them when `prefers-reduced-motion: reduce` is set.

## Theming

Import the tokens, then override any variable in your own `@theme` block after it:

```css
@import 'tailwindcss';
@import 'journ/tokens.css';
@source '../node_modules/journ/src/**/*.{ts,tsx}';

@theme {
	--color-journ-coral: oklch(65% 0.2 20);
	--radius-journ: 1rem;
}
```

Alternatively `@import 'journ/styles.css'` builds Tailwind and the tokens in one step (needs `postcss.config.mjs` with `@tailwindcss/postcss`).

The display font is `--font-journ-display`. Load Barlow Condensed (or your own face) and set that variable. In Next.js, `next/font` with `variable: '--font-journ-display'` does it.

## Components

Import from `journ` or per file (`journ/card`).

| Component                       | Parts                                                                                                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Accordion` (Radix, animejs)    | `Root` (`type`), `Item`, `Trigger`, `Content`                                                                                                                                         |
| `AlertDialog` (Radix)           | `Root`, `Trigger`, `Content` (`tone`), `Title`, `Description`, `Actions`, `Cancel`, `Action`                                                                                          |
| `Alert`                         | `Root` (`tone`), `Icon`, `Body`, `Title`, `Description`, `Actions`                                                                                                                    |
| `Avatar` (Radix)                | `Root`, `Image`, `Fallback`                                                                                                                                                           |
| `Badge`                         | single element, `tone`                                                                                                                                                                |
| `Breadcrumbs`                   | `Root`, `List`, `Item`, `Link`, `Page`, `Separator`                                                                                                                                   |
| `BulkBar`                       | `Root`, `Count`, `Actions`                                                                                                                                                            |
| `Button`                        | single element, `tone`, renders `<a>` with `href`                                                                                                                                     |
| `Calendar`                      | `Provider`, `Root`, `Frame`, `Header`, `Heading`, `Previous`, `Next`, `Weekdays`, `Days`, `Months`, `Years`, `useCalendar`                                                            |
| `Card`                          | `Root` (`tone`), `Icon`, `Header`, `Title`, `Description`, `Content`, `Footer`                                                                                                        |
| `Checkbox` (Radix)              | `Root` (supports `checked="indeterminate"`), `Indicator`                                                                                                                              |
| `Chip`                          | `Root` (`tone`), `Dot`                                                                                                                                                                |
| `Collapsible` (Radix, animejs)  | `Root`, `Trigger`, `Content`                                                                                                                                                          |
| `ContextMenu` (Radix)           | `Root`, `Trigger`, `Content`, `Group`, `Label`, `Item`, `Separator`                                                                                                                   |
| `Combobox` (cmdk)               | `Provider`, `Root`, `Trigger`, `Value`, `Content`, `Title`, `Description`, `Frame`, `Input`, `List`, `Empty`, `Group`, `Item`, `ItemIndicator`, `useCombobox`                         |
| `CommandPalette` (cmdk, Radix)  | `Root` (`onSelect`, `shortcut`), `Trigger`, `Content`, plus the Combobox list parts `Frame`, `Input`, `List`, `Empty`, `Group`, `Item`, `ItemIndicator`                               |
| `Composer`                      | `Root`, `Input`                                                                                                                                                                       |
| `DatePicker`                    | `Provider`, `Root`, `Trigger`, `Value`, `Content`, `Title`, `Description`, `Calendar` (wraps `Calendar.Root`), `useDatePicker`                                                        |
| `DescriptionList`               | `Root`, `Term`, `Details`                                                                                                                                                             |
| `DateRangePicker`               | `Root` (`value`, `locale`), `Trigger`, `Value`, `Content`, `Title`, `Description`, `Calendar`. Two clicks make a range                                                                |
| `DataTable` (TanStack Table v9) | `Root` (`data`, `columns`, `pageSize`, `onSelectionChange`), `Toolbar`, `ColumnPicker`, `Table`, `Pager`, `SelectionBar`. Helpers: `dataTableColumns`, `selectColumn`, `useDataTable` |
| `DateInput`                     | `Root` (`value`, `locale`), `Field`. Parses typed dates in the locale's order                                                                                                         |
| `Dialog` (Radix)                | `Root`, `Trigger`, `Close`, `Content` (`tone`), `Title`, `Description`, `Body`, `Actions`                                                                                             |
| `FileDropzone`                  | `Root` (`accept`, `maxSize`, `multiple`, `onFilesAccepted`, `onFilesRejected`), `Icon`, `Title`, `Description`                                                                        |
| `Divider` (Radix)               | single element, `orientation`                                                                                                                                                         |
| `Drawer` (vaul)                 | `Root`, `Trigger`, `Close`, `Content`, `Title`, `Description`, `Body`, `Actions`                                                                                                      |
| `DropdownMenu` (Radix)          | `Root`, `Trigger`, `Content`, `Group`, `Label`, `Item`, `Separator`                                                                                                                   |
| `EmptyState`                    | `Root`, `Icon`, `Title`, `Description`, `Actions`                                                                                                                                     |
| `Field` (Radix)                 | `Root` (`invalid`), `Label`, `Control`, `Description`, `Error`                                                                                                                        |
| `Heading`                       | single element, `level` (outline) and `size` (look)                                                                                                                                   |
| `Icon`                          | sizes any svg child, `size`                                                                                                                                                           |
| `HoverCard` (Radix)             | `Root`, `Trigger`, `Content`                                                                                                                                                          |
| `IconButton`                    | single element, `tone`, `size`                                                                                                                                                        |
| `Input`                         | single element, native `<input>`                                                                                                                                                      |
| `journ-coral`                   | Primary accent, key actions, warm blocks                                                                                                                                              |
| `journ-indigo`                  | Secondary block color                                                                                                                                                                 |
| `journ-ink`                     | Page canvas, text on colored surfaces, dark chips                                                                                                                                     |
| `journ-mint`                    | Calm block color, positive emphasis                                                                                                                                                   |
| `journ-paper`                   | Text on dark surfaces, light buttons, selects                                                                                                                                         |
| `journ-sky`                     | Active state (nav item), user message bubbles                                                                                                                                         |
| `journ-surface`                 | Default card surface, drawers, toasts                                                                                                                                                 |
| `journ-yellow`                  | Highlights, alerts, tags on dark                                                                                                                                                      |
| `Link`                          | single element, `asChild` styles a router link                                                                                                                                        |
| `Markdown` (react-markdown)     | single element, `components` overrides                                                                                                                                                |
| `MonthStepper`                  | `Root` (`value`, `locale`), `Previous`, `Label`, `Next`                                                                                                                               |
| `Message`                       | `Root` (`from`), `Bubble`, `Highlight`                                                                                                                                                |
| `NavBar`                        | `Root`, `Item` (`aria-current="page"` marks active)                                                                                                                                   |
| `OtpInput` (Radix)              | `Root`, `Slot` (one per character), `Hidden`                                                                                                                                          |
| `Page`                          | `Root` (`tone`), `Content`, `Footer`                                                                                                                                                  |
| `MonthPicker`                   | `Root` (`value`, `locale`), then the Calendar parts `Frame`, `Header`, `Heading`, `Previous`, `Next`, `Months`, `Years`                                                               |
| `PageHeader`                    | `Root`, `Title`, `Actions`                                                                                                                                                            |
| `Pagination`                    | `Root`, `Previous`, `List`, `Page`, `Gap`, `Next`                                                                                                                                     |
| `PillSelect`                    | single element, native `<select>`                                                                                                                                                     |
| `Popover` (Radix)               | `Root`, `Trigger`, `Content`, `Close`                                                                                                                                                 |
| `Progress` (Radix)              | `Root` (`value`, `max`), `Indicator` (`tone`)                                                                                                                                         |
| `Radio` (Radix)                 | `Group`, `Item`                                                                                                                                                                       |
| `ScrollArea` (Radix)            | `Root` (`type`), `Viewport`, `Scrollbar` (`orientation`), `Corner`                                                                                                                    |
| `Select` (Radix)                | `Root`, `Trigger`, `Value`, `Content`, `Group`, `Label`, `Item`, `Separator`                                                                                                          |
| `Sidebar`                       | `Layout`, `Root`, `Header`, `Body`, `Section`, `Heading`, `Item`, `Footer`, `Content` (desktop only)                                                                                  |
| `Skeleton`                      | single element                                                                                                                                                                        |
| `Spinner`                       | single element                                                                                                                                                                        |
| `Stepper`                       | `Root` (`value`), `Item` (`step`), `Indicator`, `Label`, `Description`                                                                                                                |
| `Slider` (Radix)                | `Root`, `Track`, `Range`, `Thumb` (one per value)                                                                                                                                     |
| `Stack` (animejs)               | `Root` (`defaultValue`), `Item` (`value`, `tone`), `Trigger`, `Content`                                                                                                               |
| `Stat`                          | `Root`, `Label`, `Value`, `Hint`                                                                                                                                                      |
| `Switch` (Radix)                | `Root`, `Thumb`                                                                                                                                                                       |
| `Table`                         | `Root`, `Caption`, `Head`, `Body`, `Row`, `Header`, `Cell`                                                                                                                            |
| `Tabs` (Radix)                  | `Root`, `List`, `Trigger`, `Content`                                                                                                                                                  |
| `Text`                          | single element, `size`, `tone`                                                                                                                                                        |
| `Textarea`                      | single element, native `<textarea>`                                                                                                                                                   |
| `ToggleGroup` (Radix)           | `Root` (`type`), `Item`                                                                                                                                                               |
| `Toast` (sonner)                | `Provider`, `show`, `Root`, `Title`, `Description`, `Action`                                                                                                                          |
| `Tooltip` (Radix)               | `Root` (includes its provider), `Trigger`, `Content`, `Provider`                                                                                                                      |

Card tones: `dark` (default), `coral`, `yellow`, `indigo`, `mint`, `sky`.

Page tones: `ink` (default), `indigo`, `mint`, `sky`, `yellow`, `coral`.

## Adding a component

1. Create `src/<name>.tsx` as a compound object of arrow functions with `data-slot` and `cn`.
2. Use only `journ-*` tokens. Add a token before adding a raw value.
3. Reuse `interactive` and `TouchTarget` for anything pressable.
4. Export at the end of the file, then add it to `src/index.ts`. Any `src/*.tsx` is also exposed as `journ/<name>`.
5. Add a mocked usage in `apps/site/src/app/[locale]/journ` and check it on a phone-width viewport.
