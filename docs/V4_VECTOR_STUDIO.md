# DSS v4.0 — VECTOR STUDIO

Objectiu: flux Chat → enllaç DSS → generació vectorial → edició d'objectes → exportació SVG/ZIP.

## Funcions
- Enllaç de disseny codificat a `#dss=` amb briefing JSON.
- Generació client-side del master vectorial sobre les 8 peces K-VSE.
- Artwork procedimental vectorial: fons, pinzellades, roda, dards, filigrana, carruatge/cavall, accents i mànigues.
- Editor d'objectes: X, Y, escala, rotació i visibilitat.
- Exportació `DSS_VECTOR_PRODUCTION_*.svg`.
- Exportació `DSS_VECTOR_PACKAGE_*.zip` amb `master.svg`, `production.svg`, `manifest.json` i README.
- QA amb gate de dades de fabricant.

## Limitacions conegudes
L'artwork generat és vectorial. Els logos originals Dart Zone/K-VSE segueixen sent els originals incrustats pel DSS actual; per una cadena 100% vectorial també als logos cal disposar dels originals SVG/EPS/AI o validar una vectorització específica. Les dades oficials de bleed, safe area, perfil de color i format final continuen sent necessàries abans d'afirmar que un fitxer està certificat per K-VSE.
