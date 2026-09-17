---
id: T-100
title: HISN Website: Hero with interactive 3D shield and SVG fallback
owner: @frontend
status: TODO
created: 2026-09-16
---

## Summary

Create a performant, accessible website hero for HISN featuring an interactive 3D shield (Three.js) with an SVG fallback and reduced-motion support. Provide download/install CTA and integrity checks placeholders.

## Acceptance Criteria

- A responsive `website/` folder with `index.html`, `style.css`, and `app.js`.
- 3D shield rendered with Three.js from CDN and degrades to animated SVG if WebGL fails.
- Reduced-motion preference respected.
- CTA buttons for downloads (placeholder links) and manifest for PWA.
- Basic Lighthouse-friendly performance (no heavy external libraries beyond CDN).

## Implementation Steps

1. Add `website/` skeleton files.
2. Implement Three.js shield with rotation on pointer and touch.
3. Add SVG fallback and CSS animations for reduced-motion off.
4. Test offline and slow network via devtools.
5. Add license/asset notes.

## Tests

- Open `website/index.html` on desktop and mobile.
- Toggle `prefers-reduced-motion` and confirm no motion.
- Disable WebGL in browser and confirm SVG fallback.

## Risks

- Device GPU limits may cause slow rendering; mitigate by low-poly model and requestAnimationFrame optimizations.

## Next Steps

- Integrate with download server and release artifacts.
- Add analytics and conversion tracking.
