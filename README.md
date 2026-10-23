# Playwright revision notes

## 1. A test

```js
const { test, expect } = require('@playwright/test');

test('name', async ({ page }) => {});
```

- The function is `async` because browser calls return promises.
- `test.only` runs that test alone. `test.skip` records it and does not run it.
- `expect` on a locator or page retries. `expect` on a plain string or boolean runs once.

## 2. Browser, context, page

```text
Browser → Context → Page
```

- `{ page }` builds all three and discards the context when the test ends.
- `{ browser }` is for a test that opens its own context and pages.
- Contexts do not share cookies. Pages in one context do. A second page is a second tab for the same user.

## 3. Navigation

```js
await page.goto('https://example.com');
await page.goBack();
await page.goForward();
await page.reload();
```

- `goto` waits for the load event.
- The history call is `reload()`. There is no `page.refresh()`.
- `title()` reads the document title. `screenshot({ path })` writes the current view.

## 4. Auto-waiting

Before `click`, `fill`, `check`, `press`, and `selectOption`, Playwright retries:

```text
attached → visible → stable → enabled → receives events → action
```

- The locator is queried again on each try.
- The action ends when the checks pass, or when the timeout hits.
- Playwright has no Selenium-style implicit wait. Auto-wait is that mechanism.
- `waitForTimeout(ms)` always burns the full delay. It does not look at the page.

## 5. CSS and XPath locators

A locator is a query, re-run at action time.

| Query | Selector |
|---|---|
| Class, id, tag | `.class`, `#id`, `button` |
| Descendant, child | `.parent .child`, `.parent > a` |
| Attribute | `a[href]`, `input[type="checkbox"]`, `[href*="file.pdf"]` |
| nth-child | `li:nth-child(2)` |
| XPath | `//button[@type="submit"]` |

- `parent.locator('.child')` searches inside that parent.
- `.first()` and `.nth(i)` pick one match. `.nth` is 0-based.
- `page.locator()` takes a string. Do not pass a locator into it.
- A locator variable is not a property of `page`.
- A child chained from the wrong parent matches nothing. `waitFor()` then sits until timeout.
- `textContent()` waits and returns the first match. `allTextContents()` returns every match now, or `[]` if none exist. `inputValue()` reads an input. An input has no useful text content.
- `count()` returns a Promise. `await` it. A locator has no `.length`, so a loop written with `.length` never starts.

## 6. getBy locators

These find an element by its accessible name or visible text.

| Call | Matches |
|---|---|
| `getByRole('button', { name: 'Submit' })` | ARIA role plus accessible name. A submit input is a button. A radio is a radio. A link is a link. |
| `getByLabel('Password')` | A control tied to its label with `for`/`id`, a wrapping label, or `aria-label`. A label sitting beside an input with no `for` does not count. |
| `getByPlaceholder('Password')` | The `placeholder` attribute. |
| `getByText('saved')` | Visible text. A string is a substring. A regex can ignore case: `/saved/i`. |
| `getByAltText('logo')` | `alt` on an image. |
| `getByTitle('Close')` | The `title` attribute. |
| `getByTestId('submit')` | `data-testid`. |

- `name` on `getByRole` is the accessible name, not the HTML `name` attribute. `name: /Download/` is a partial match. `name*:` is not valid JavaScript.
- Chain from a parent: `heading.getByRole('textbox')` searches only under that heading.
- Two controls can share one `name` attribute. Scope the locator, or the action hits strict-mode and refuses to choose.

## 7. Filtering a list

```js
const field = title => page.locator('.field').filter({ hasText: title });
const input = field('CVV Code').locator('input');

await list.filter({ hasText: /^\s*India$/ }).click();
```

- `filter({ hasText })` keeps the matches whose text contains that string. A regex with `^` and `$` keeps an exact option when several options share a word.
- `pressSequentially('Ind')` types one character at a time, so a suggestion list can react. `fill()` sets the whole value at once and can skip that.
- A custom country field is a text box plus a click on the suggestion. `selectOption` is only for a `<select>`.
- When comparing a confirmation string with a table cell, check that the longer string contains the shorter one. `trim()` removes only the outer spaces, not characters such as `|` in the middle.

## 8. Actions

```js
await locator.fill('text');
await locator.click();
await locator.press('Enter');
await locator.check();
await locator.uncheck();
await locator.selectOption({ label: 'Visible label' });
```

- `fill` clears the control, then types.
- `check` forces a checkbox or radio on. `click` toggles.
- `selectOption` accepts a label, value, or the option's own text. The option must exist. A second dropdown of days cannot be given a year.

## 9. Assertions

Web assertions retry. Plain assertions do not.

```js
await expect(page).toHaveTitle(/partial/i);
await expect(page).toHaveURL(/\/path/);
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();
await expect(locator).toBeChecked();
await expect(locator).toHaveText('Exact text');
await expect(locator).toContainText(/part/i);
await expect(locator).toHaveValue('typed value');
await expect(locator).toHaveAttribute('href', /.*\.pdf/);
await expect(locator).toHaveCount(3);
await expect(locator).not.toBeVisible();
```

- `toHaveText` is the whole string. `toContainText` is a substring. Both are case-sensitive unless the argument is a regex with `i`.
- `toBeVisible()` and `toBeHidden()` belong to `expect`. They are not methods of the locator.
- `await expect(locator).toHaveValue('text')` runs the assertion. `expect(locator.toHaveText('text'))` does not.

## 10. Downloads and new pages

Start waiting before the click. `Promise.all` runs the wait and the click together.

```js
const [download] = await Promise.all([
  page.waitForEvent('download'),
  locator.click(),
]);
expect(download.suggestedFilename()).toBe('file.pdf');
```

```js
const [popup] = await Promise.all([
  context.waitForEvent('page'),
  locator.click(),
]);
```

- A `target="_blank"` link opens another page in the same context. `page.waitForEvent('popup')` is the same idea.
- A PDF link may download in headless Chromium instead of opening a tab. The new page then stays `about:blank`. Assert the download, or assert the `href`, instead of the blank page URL.
- Register a dialog handler before the click that opens it. `page.once` handles the next dialog. `page.on` handles every later one.

| Dialog | What closes it |
|---|---|
| `alert` | `accept()` |
| `confirm` | `accept()` is OK, `dismiss()` is Cancel |
| `prompt` | `accept('typed text')` submits, `dismiss()` cancels |

## 11. Timeouts

Three separate clocks. The test clock is the ceiling. An action or assertion timeout cannot keep the test alive after that ceiling.

| Clock | Default | Set it for the suite | Set it for one call |
|---|---|---|---|
| Test | 30s | `timeout` in the config | `test.setTimeout(ms)` inside that test |
| Assertion | 5s | `expect: { timeout }` in the config | `expect(locator).toBeVisible({ timeout })` |
| Action | none of its own | `use.actionTimeout` in the config | `locator.click({ timeout })` |

- With no action timeout, the action may use whatever is left of the test clock.
- `page.setDefaultTimeout(ms)` changes actions and navigation for that page. It does not change `expect`.
- `test.slow()` triples the test timeout.
- `expect.configure({ timeout })` builds an expect with its own assertion timeout.

## 12. Waiting for an element

```js
await locator.waitFor();                         // visible
await locator.waitFor({ state: 'hidden' });
await locator.waitFor({ state: 'attached' });    // in the DOM
await locator.waitFor({ state: 'detached' });    // gone from the DOM
```

| Call | Use it when |
|---|---|
| an action or `expect(locator)` | Almost always. Both already wait. |
| `locator.waitFor()` | You need the element visible before a read. |
| `page.waitForLoadState('load')` | You need the load event after a navigation you did not start with `goto`. |
| `page.waitForLoadState('networkidle')` | The page really goes quiet. A busy site never does, and the test hits the timeout. |
| `page.waitForTimeout(ms)` | You are watching the browser. Not a sync strategy. |

`page.waitForNetworkIdle()` is not a method. The load-state name is the string `'networkidle'`.

## 13. Debugging

```text
npx playwright test --headed
npx playwright test --ui
npx playwright test --debug
npx playwright codegen
npx playwright show-report
npx playwright show-trace <trace.zip>
```

- `--headed` shows the browser. `--ui` is the runner for writing a test. `--debug` pauses on each step. `page.pause()` pauses one line when the inspector is attached.
- `codegen` records actions as test code.
- In config, `screenshot: 'on'` keeps a shot of every test. `'only-on-failure'` keeps a shot of failures. `trace: 'retain-on-failure'` keeps the action, DOM, and network timeline after a failure. `video: 'retain-on-failure'` keeps the recording.
- The HTML report's call log names the locator that never matched and the check it was waiting on.
