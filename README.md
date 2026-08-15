# Manoj Kumar Portfolio

A responsive portfolio built around the idea `input → interpretation → action`.
The primary Three.js scene is a procedural 21-landmark hand rig derived from
the Hand Gesture Control Suite rather than a decorative stock model.

Live site: `https://maddy-mk.github.io/manoj-kumar-portfolio/`

## Run locally

```powershell
pnpm install
pnpm dev
```

## Verify

```powershell
pnpm typecheck
pnpm build
```

## Contact form

The contact form submits directly from the portfolio through FormSubmit and
delivers messages to `manoj.kumar.sl.dev@gmail.com`. FormSubmit sends a one-time
activation email before it delivers the first submission; approve that email
once after the site is deployed.

The project uses React, TypeScript, Three.js through React Three Fiber,
Framer Motion, and Lucide icons. Reduced-motion preferences freeze the rig and
remove nonessential motion while preserving all content.
