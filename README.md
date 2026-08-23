# Darts Sublimation Studio v2.6 — MOBILE ONE FILE

Objectiu del flux:
1. Obres l'app des del mòbil/PC.
2. Omples el briefing.
3. Copia `PROMPT per ChatGPT`.
4. ChatGPT retorna **UN ÚNIC `DSS_PACKAGE_*.svg`** amb les 8 peces exactes.
5. Carregues aquest SVG a `Artwork`.
6. L'app valida automàticament el paquet.
7. L'app afegeix els logos originals Dart Zone/K-VSE i els textos exactes (jugador/equip/local).
8. Exportes `DSS_PRODUCTION_*.svg`, preview PNG i informe fabricant.

## Per què DSS_PACKAGE
Evita el problema anterior d'intentar encaixar una làmina o un mockup com si fos un artwork global. El fitxer que retorna ChatGPT ja porta art específic per P1...P8 sobre el MASTER exacte.

## Mòbil
La interfície és mobile-first i inclou fitxers PWA (`manifest.webmanifest`, `sw.js`).
Per usar-la còmodament com una app al mòbil, s'ha de publicar en HTTPS (GitHub Pages/Vercel/etc.). El ZIP actual també funciona en PC com a HTML local.

## Important
L'app no inventa bleed, zona segura, PPI/DPI, perfil de color ni format de lliurament. Quan K-VSE ho confirmi, aquests valors es poden fixar i el QA podrà marcar el paquet com llest per producció.
