# Playwright revision notes

## 1. A test

```js
const { test, expect } = require('@playwright/test');

test('name', async ({ page }) => {
  // actions and assertions
});
```

- `test(name, fn)` registers one test. The function is `async` because every browser call returns a promise.
- `async () => {}` and `async function () {}` are the same here.
- `test.only` runs that test and ignores the rest. `test.skip` records the test and does not run it.
- `expect` is the assertion. Assertions that talk to the page retry until they pass or the timeout ends.

## 2. Browser, context, page

```text
Browser    one browser process
  Context  one isolated session: cookies, storage, permissions
    Page   one tab in that session
```

- Ask for `{ page }` and Playwright builds all three, then throws the context away when the test ends.
- Ask for `{ browser }` when the test must open its own contexts.

```js
const context = await browser.newContext();
const page = await context.newPage();
await context.close();
```

- Contexts in the same browser do not share cookies. That is test isolation.
- Pages in the same context do share cookies. A second page is a second tab for the same user.

## 3. Opening a page

```js
await page.goto('https://example.com');
await page.screenshot({ path: 'page.png' });
const title = await page.title();
```

- `goto` waits for the load event, then continues.
- `title()` reads the document title. `screenshot` writes the current view to a file.

## 4. Auto-waiting

Before `click`, `fill`, `check`, `press`, and `selectOption`, Playwright retries these checks:

```text
attached → visible → stable → enabled → receives events → then the action runs
```

- The locator is queried again on each try, so a re-rendered node is still found.
- The action ends as soon as the checks pass. The default limit is 30 seconds.
- `expect(locator)` retries the same way. `expect(value)` on a plain JavaScript value does not.

`page.waitForTimeout(ms)` always burns the full delay. It never looks at the page. Use an action or an assertion instead.

## 5. Locators

A locator is a query that runs again at action time. It is not a handle you fetched once.

```js
const item = page.locator('.class');
await item.click();
```

| Query | Selector |
|---|---|
| Class | `.class` |
| Id | `#id` |
| Tag | `button` |
| Descendant | `.parent .child` |
| Direct child | `.parent > a` |
| Attribute present | `a[href]` |
| Attribute equals | `input[type="checkbox"]` |
| nth child | `li:nth-child(2)` |
| XPath | `//button[@type="submit"]` |

- `parent.locator('.child')` searches only inside that parent.
- `.first()` and `.nth(0)` pick one match from a list.
- Store the locator in your own variable. `page.someName` is not that variable.
- `page.locator()` takes a string. A locator created from another locator is already a locator. Do not wrap it in `page.locator()` again.

Reading text:

- `textContent()` returns the text of the first match and waits for it.
- `allTextContents()` returns every match as an array. If nothing matches, it returns `[]` without waiting.

`locator.waitFor()` waits until the first match is visible. A selector that matches nothing waits until the test timeout.

Check parent and child against the real DOM. A child selector chained from the wrong parent matches nothing, and `waitFor()` then sits until timeout.

## 6. Actions

```js
await locator.fill('text');          // clear the input, then type
await locator.click();
await locator.press('Enter');        // key on the focused element
await locator.check();               // checkbox or radio on
await locator.uncheck();
await select.locator.selectOption({ label: 'Visible label' });
```

- `selectOption` works on a real `<select>`. Pass a label, value, or index.
- A custom dropdown is not a `<select>`. Click the control, then click the option.
- `check()` sets a checkbox or radio to on. `click()` toggles. Prefer `check()` when the end state must be on.

## 7. Assertions

Assertions on a page or locator retry. Assertions on a string or boolean run once.

### Page

```js
await expect(page).toHaveTitle('Exact Title');
await expect(page).toHaveTitle(/partial/i);
await expect(page).toHaveURL('https://example.com/path');
await expect(page).toHaveURL(/\/path/);
```

### Visibility and state

```js
await expect(locator).toBeAttached();   // in the DOM
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();
await expect(locator).toBeEditable();
await expect(locator).toBeFocused();
await expect(locator).toBeChecked();    // checkbox or radio
await expect(locator).toBeEmpty();
```

### Text, value, attributes

```js
await expect(locator).toHaveText('Exact text');
await expect(locator).toContainText('part');       // case-sensitive
await expect(locator).toContainText(/part/i);
await expect(locator).toHaveValue('typed value');  // input, textarea, select
await expect(locator).toHaveAttribute('href', '/path');
await expect(locator).toHaveClass(/active/);
await expect(locator).toHaveId('id');
await expect(locator).toHaveCount(3);
```

- `toHaveText` is the whole string. `toContainText` is a substring.
- String match is case-sensitive. A regex with the `i` flag is not.

### Negation, soft, and plain values

```js
await expect(locator).not.toBeVisible();
await expect.soft(locator).toHaveText('text');  // failure is recorded, test continues
expect(value).toBe('text');                     // one check, no retry
expect(list).toContain('item');
expect(flag).toBeTruthy();
```

## 8. Dialogs and popups

### alert, confirm, prompt

These are browser dialogs, not DOM elements. Register the handler before the action that opens the dialog. A handler added after the click never sees it.

```js
page.once('dialog', async dialog => {
  dialog.type();      // 'alert' | 'confirm' | 'prompt'
  dialog.message();
  await dialog.accept();
});
await locator.click();
```

| Dialog | Accept | Dismiss |
|---|---|---|
| `alert` | closes it | not used |
| `confirm` | OK | Cancel |
| `prompt` | `accept('typed text')` submits | Cancel |

- `page.once` handles the next dialog only. `page.on` handles every later dialog on that page.

### New tab

A link with `target="_blank"` or a call to `window.open` opens another page in the same context. Wait for the event before the click.

```js
const popupPromise = page.waitForEvent('popup');
await locator.click();
const popup = await popupPromise;
await expect(popup).toHaveTitle(/title/);
await popup.close();
```

The popup shares cookies with the page that opened it. Close it when the test is done with it. Closing the context closes both.

## 9. Waiting on purpose

| Call | Use it when |
|---|---|
| action or `expect(locator)` | Almost always. Both already wait. |
| `locator.waitFor()` | You must know the element is visible before you read it. |
| `page.waitForLoadState('load')` | You need the load event after a navigation you did not start with `goto`. |
| `page.waitForLoadState('networkidle')` | The page truly goes quiet. A site that keeps requesting never settles, and the test hits the timeout. |
| `page.waitForTimeout(ms)` | You are watching the browser while learning. Not a sync strategy. |

`page.waitForNetworkIdle()` does not exist. The load-state name is the string `'networkidle'`.
