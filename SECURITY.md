# Security Policy

## Supported versions

threeD is currently an experimental prototype and has not reached a stable production release. Security reports are still welcome, but there is no formal long-term support policy yet.

| Version | Supported |
| --- | --- |
| Current `main` branch | Yes |
| Older commits or forks | No |

## Reporting a vulnerability

If you discover a security issue, please do not open a public GitHub issue with exploit details.

Instead, report the vulnerability privately to the repository owner or maintainer. If a dedicated security contact is added later, use that contact. Until then, use the most private communication method available through the GitHub repository owner profile.

When reporting a vulnerability, include:

- A clear description of the issue.
- Steps to reproduce it.
- The affected files, features, or routes.
- Any proof-of-concept code, screenshots, or logs.
- The potential impact.
- Suggested fixes, if you have any.

## What to expect

After a report is received, the maintainer will try to:

- Acknowledge the report.
- Review and reproduce the issue.
- Determine severity and impact.
- Prepare a fix when appropriate.
- Credit the reporter if they want to be credited.

Because this is an early-stage open source project, response times may vary. Responsible reports are still appreciated and will be taken seriously.

## Security considerations

threeD is a browser-based editor prototype. Areas that may need extra security care include:

- Exported HTML, JavaScript, or React code.
- User-provided project data.
- Local storage handling.
- Asset loading and future file import features.
- Third-party dependencies.
- Generated code that may be copied into production projects.

## Dependency security

Please report dependency vulnerabilities if they affect the project. Pull requests that safely update vulnerable dependencies are welcome.

Before submitting dependency updates, please run:

```bash
npm install
npm run build
```

If the build cannot be completed, explain why in the pull request.

## Responsible disclosure

Please give the maintainer reasonable time to investigate and fix a vulnerability before publicly sharing details. Do not use a vulnerability to access data, disrupt services, or harm users.
