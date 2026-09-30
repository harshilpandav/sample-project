# Daymark Playwright + TestDino demo

A small responsive task-list app with Playwright browser tests and TestDino live reporting.

## Install and run

```sh
npm ci
npx playwright install chromium
npm run dev
```

Open the Vite URL printed in the terminal. Run the browser suite with:

```sh
npx playwright test
```

The suite contains 24 cases: 10 product checks expected to pass, 7 intentionally failing examples, and 7 intentionally flaky examples. The flaky examples fail once and pass on Playwright's configured retry. This is a reporting demo, so the full suite exits nonzero by design; remove or correct the `DEMO FAIL` and `DEMO FLAKY` examples before treating this as a production CI gate.

## TestDino live reporting

The reporter reads `process.env.TESTDINO_TOKEN` from the environment. No token is stored in this project. To stream a local test run, set your own token in the shell and run Playwright:

```sh
export TESTDINO_TOKEN=YOUR_API_TOKEN
npx playwright test
```

Results stream during the run; there is no post-run upload command.

For GitHub Actions, add a repository Actions secret named exactly `TESTDINO_TOKEN` under **Settings → Secrets and variables → Actions**. The workflow at `.github/workflows/playwright.yml` maps that secret into the test step. The secret value is not part of the repository.
