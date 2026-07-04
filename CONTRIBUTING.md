# Contributing to threeD

Thank you for your interest in contributing to threeD. This project is an experimental no-code editor for creating animated 3D website experiences in the browser. It is still a prototype, so contributions are highly appreciated and can make a real difference.

## Ways to contribute

You can help by contributing:

- Bug reports and reproduction steps.
- UI and UX improvements.
- Editor interaction improvements.
- Three.js, animation, and export improvements.
- Accessibility and responsive design fixes.
- Documentation updates.
- Code cleanup and testing improvements.
- Ideas for features that would make 3D website creation easier.

## Before you start

Please check the existing issues and pull requests before starting larger work. If your change is significant, open an issue first so the approach can be discussed.

Good first contributions include:

- Fixing small UI issues.
- Improving README or setup documentation.
- Cleaning up confusing labels.
- Reporting browser-specific bugs.
- Improving empty states and error handling.

## Local setup

Clone the repository and install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

The lint script currently uses:

```bash
npm run lint
```

If linting fails because of framework or tooling changes, mention that in your pull request and include the build result instead.

## Development guidelines

- Keep changes focused and easy to review.
- Follow the style and structure already used in the project.
- Avoid unrelated refactors in feature or bug-fix pull requests.
- Prefer clear, readable code over clever abstractions.
- Test your change manually in the browser when it affects the UI.
- Run `npm run build` before opening a pull request when possible.
- Update documentation when behavior, setup, or usage changes.

## Pull request checklist

Before submitting a pull request, please make sure:

- The change has a clear purpose.
- The app builds successfully, or any build issue is explained.
- UI changes have been manually checked.
- New behavior is documented when needed.
- The pull request description explains what changed and why.
- Screenshots or videos are included for visual changes when useful.

## Reporting bugs

When reporting a bug, include:

- What happened.
- What you expected to happen.
- Steps to reproduce the issue.
- Browser and operating system.
- Screenshots, screen recordings, or console errors if available.

## Suggesting features

Feature suggestions are welcome. Please explain:

- The problem the feature solves.
- Who it helps.
- How it might work in the editor.
- Any examples from other creative tools or 3D website workflows.

## Project status

threeD is not finished yet. It is still being designed, tested, and improved. Some parts of the editor may change significantly as the project develops. Contributions, feedback, and careful experimentation are all welcome.
