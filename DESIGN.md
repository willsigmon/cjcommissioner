# Proof in the Work — Design Contract

## One-sentence aesthetic

A bold North Carolina civic broadsheet: warm paper, oversized proof points,
blue-and-brick editorial rules, and real documentary photography.

## Principles

1. Evidence before affiliation.
2. Editorial hierarchy instead of card soup.
3. One clear action per section.
4. Strong enough to feel like a campaign, restrained enough to feel trustworthy.
5. Fast, accessible, and useful on a 320px-wide phone.

## Type

- Display: **Archivo Black**, short statements only
- Body and UI: **IBM Plex Sans**
- Editorial: **Newsreader**, reserved for first-person narrative, human emphasis,
  and the second half of the homepage campaign statement
- Display headlines use tight leading and balanced wrapping.
- Body copy stays between 17px and 20px with generous line height.
- Uppercase labels use tracking rather than tiny type.

## Palette

| Token | Hex | Use |
| --- | --- | --- |
| Warm white | `#FFFDF7` | Page background |
| Ink | `#0E1B2A` | Primary text and dark sections |
| Civic blue | `#145DA0` | Links, actions, section fields |
| Brick | `#B3322A` | Primary CTA and urgent accents |
| Proof gold | `#F0B429` | Evidence highlights |
| Rule gray | `#D9DEE4` | Borders and editorial rules |

The site is light-only. No gradient text, glass surfaces, glowing orbs, rainbow
icon tiles, or automatic dark mode.

## Layout

- 8px spacing system
- Content width: 1180px
- Reading width: 720px
- Utility radii: 0px or 4px
- Photography radius: 12px
- Strong 1px and 3px editorial rules
- Almost no shadows
- Full-bleed dark sections are reserved for proof and conversion moments

## Components

- Header: compact wordmark, anchored navigation, visible Donate utility action
- Hero: status eyebrow, editorial headline, direct copy, two CTAs, real photo
- Proof strip: four oversized metrics; no individual cards
- Results: Done / Underway / Next rows with outcome-led copy
- Priorities: four numbered editorial columns
- District: character-led narrative paired with the existing map
- Volunteer: straightforward form with honest submission states
- Donation: reporting fields first, then Stripe Payment Element and Express
  Checkout when configured
- Footer: public address, contact, committee disclaimer, privacy

## Motion

- The homepage opens with one signature editorial sequence: the ballot mark
  draws, the two headline voices unmask, and the real portrait reveals upward.
- Hover motion is limited to directional arrows, proof numerals, editorial
  label rules, and a restrained 2.5% documentary-photo scale.
- The My Story quotation uses a single scroll-linked gold rule draw when the
  browser supports view timelines; the quotation itself never fades or moves.
- State transitions remain 150–220ms; photography can ease over 650ms.
- No repeated fade-up, parallax, looping, bouncing, or ornamental animation.
- Under `prefers-reduced-motion: reduce`, transitions and smooth scrolling stop

## Photography

- Launch assets: owner-supplied formal, community, youth, veteran, and campaign
  photographs received July 28, 2026
- Use the formal stair portrait as the homepage hero and documentary photography
  as an evidence ledger across the homepage and My Story
- Use campaign sign and shirt artwork only as clearly labeled concepts; never
  present unannounced merchandise as available for sale
- Produce optimized WebP derivatives with EXIF and location metadata removed
- Do not generate, replace, reshape, or cosmetically alter the person
- Avoid invented event names, partner endorsements, or identities in captions
- Archival screenshots may be cropped by the layout but must not be retouched

## Accessibility

- WCAG AA contrast
- Visible 3px focus treatment
- 44px minimum interactive targets
- Semantic landmarks and disclosure state
- Errors connected to fields; live regions for async status
- Keyboard-complete navigation and forms

## QA viewports

`320`, `390`, `768`, `1024`, and `1440` pixels wide. Check headline wrapping,
horizontal overflow, navigation, form labels/errors, focus visibility, and
controls obscured by fixed elements.
