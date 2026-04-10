# Jextures Design System Note

## 1. Brand Essence
Jextures is a cinematic, UI/UX-led digital agency aesthetic. The overall feel is premium, futuristic, slightly cosmic, and highly crafted. The work should never feel generic, cheerful, or template-driven. It should feel like a boutique design studio that blends strategy, motion, and atmosphere.

Core mood:
- dark, immersive, high-contrast
- polished and intentional
- sleek but not sterile
- expressive without being chaotic
- emotionally cinematic, not corporate-flat

The brand voice in visuals is:
- original thinking over templates
- motion with meaning
- strategy-first creativity
- premium digital craftsmanship

## 2. Color System
### Primary background colors
Use very dark navy-black surfaces as the foundation:
- `#02040b` - primary site background
- `#01040A` - deeper hero / cinematic black-blue
- `#050C19` - dark hero layer
- `#03050c` - footer / deep section background

### Primary text colors
- `#ffffff` - main text on dark surfaces
- `rgba(255,255,255,0.5)` to `rgba(255,255,255,0.72)` - secondary copy on dark surfaces
- `#252525` - main text on white surfaces
- `rgba(37,37,37,0.72)` - secondary copy on white surfaces
- `#494949` - dark neutral for white-background navigation / UI

### Accent gradient
This gradient is the core visual signature and should be reused often:
- orange `#ff6a00`
- blush `#d39d97`
- electric blue `#5c81ff`

Common gradient direction:
- `linear-gradient(90deg, #ff6a00 0%, #d39d97 50%, #5c81ff 100%)`

Supporting accent:
- purple hover / secondary accent: `#9260da`
- steel-blue border tone: `#697DA3`

### How color is used
- dark backgrounds dominate most pages
- white sections appear intentionally to create rhythm and relief
- gradients are used mainly for text, highlights, borders, and signature moments
- avoid flooding the whole UI with gradients; keep them as emphasis
- supporting text often uses opacity rather than pure gray tokens

## 3. Typography
### Font stack
- Primary: `Exo`
- Secondary: `Montserrat`
- Tertiary / occasional: `Urbanist`
- Inter exists in tokens but is not the core brand face

### Type character
- headlines are large, airy, and elegant
- font weight is mostly light to medium, not overly bold
- sentence case is preferred for CTAs and body content
- uppercase is used for small UI labels / eyebrows only
- gradient text is reserved for hero words, highlighted headings, and special emphasis

### Typical scale
- hero headlines can reach `86px` and beyond on desktop
- section titles around `46px`
- supporting body around `15px` to `18px`
- labels around `13px` with increased letter spacing

### Style rules
- keep generous line-height
- do not overuse bold weights
- headline rhythm matters more than dense copy blocks
- use gradient text sparingly and strategically

## 4. Layout System
### Container
- main content sits in a centered wrapper around `1180px`
- horizontal padding is roughly `20px` to `24px`

### Section rhythm
- sections are tall and spacious
- many sections aim for near full-screen presence
- vertical spacing is generous, especially on desktop
- layout alternates between immersive dark sections and selective white sections

### Composition patterns
Common layout patterns:
- full-screen hero with video or atmospheric backdrop
- centered hero copy over layered media
- split content sections with strong left/right hierarchy
- stacked editorial sections with large headings and restrained paragraph widths
- horizontal rails / carousels for proof or portfolio
- footer and contact sections treated as immersive scenes, not generic footers

## 5. Visual Language
### Core traits
- cinematic backgrounds
- glassmorphism panels
- soft blur overlays
- luminous gradients
- subtle glows
- rounded pills and rounded cards
- large soft radial light sources
- layered depth rather than flat blocks

### Shapes and borders
- pill borders often use `border-radius: 100px`
- cards commonly use `20px` to `24px` radius
- borders are thin and low-contrast
- glow and blur are preferred over heavy outlines
- lines may use gradients for emphasis

### Glass / frosted treatment
Common pattern:
- translucent white fills such as `rgba(255,255,255,0.03)` or `0.04`
- backdrop blur around `4px` to `6px`
- subtle border like `rgba(255,255,255,0.08)` to `0.2`
- restrained shadow, never harsh material design shadows

## 6. Motion Principles
Motion is a major part of the identity.

### Motion style
- smooth, elegant, and slightly theatrical
- reveals often combine fade + upward translation
- hover states should feel polished, not bouncy
- motion should create atmosphere and pacing, not noise

### Typical motion patterns
- hero build-in sequences
- scroll-driven transitions
- layered video backgrounds
- soft parallax / mask reveals
- hover lift with glow or gradient edge
- accordions and popups animated with easing, opacity, and translate

### Motion rule
Use motion to reveal hierarchy or emotion. Avoid generic microinteractions that feel product-dashboard-like.

## 7. Component System
### Navigation
- fixed top nav
- logo on left, pill-like menu shell on right
- border is subtle and rounded
- on white sections, nav switches to dark text and darker border
- mobile simplifies the nav aggressively

### Buttons / CTAs
- pill or rounded-rectangle silhouette
- often glassy or gradient-driven
- text can use gradient treatment when button surface is light
- hover states often invert foreground/background logic
- arrows are simple line icons, thin stroke, elegant

### Cards
- cards are soft, rounded, premium
- often translucent on dark surfaces
- often white on light surfaces with subtle gray borders
- hover uses lift, glow, or gradient top edge
- cards should feel curated, not like dashboard widgets

### Forms
- dark glass card container
- thin translucent borders
- white input text
- restrained labels
- CTA is high-emphasis and polished
- avoid heavy field chrome or harsh shadows

### Footer / contact area
- immersive, full-scene treatment
- not a plain thin footer bar
- social links and legal links are understated but polished

## 8. White Section Rules
When the design moves onto a white section:
- use plain white background, not off-white beige
- switch text to `#252525` and `rgba(37,37,37,0.72)`
- keep cards subtle and premium
- nav must switch into a dark readable state
- gradient accents stay, but only as highlights

The white sections are there to create contrast and pacing, not to make the site feel generic or minimalist.

## 9. Imagery and Media Direction
Use:
- cinematic video backdrops
- abstract light / glow / tunnel / spatial visuals
- polished UI mockups
- premium portfolio previews
- subtle glass, chrome, or atmospheric imagery

Avoid:
- stock-office smiling people
- flat SaaS illustrations
- bright cheerful iconography
- generic corporate photography

## 10. Copy + UI Tone
The interface tone is:
- confident
- direct
- design-led
- premium but not cold
- expressive without slang overload

Copy should feel crafted, short, and intentional.

## 11. Do / Don't Summary
### Do
- use dark cinematic backgrounds
- use Exo as the dominant typeface
- use the orange-blush-blue gradient as the main signature accent
- use glass panels, blur, and layered depth
- create contrast with selective white sections
- keep CTAs premium and clean
- let motion feel editorial and intentional

### Don't
- do not use generic SaaS UI patterns
- do not make everything flat white and minimal
- do not overuse bright colors beyond the signature gradient
- do not use heavy bold type everywhere
- do not use default system fonts
- do not make hover states gimmicky or noisy
- do not turn the layout into a dashboard or startup template

## 12. Prompt-Ready Version
Use this when prompting another project:

"Design this in a Jextures-inspired design system: a premium, cinematic, UI/UX-led agency aesthetic with deep navy-black backgrounds, selective white sections for rhythm, Exo as the main typeface, Montserrat for supporting text, and a signature accent gradient of orange (#ff6a00), blush (#d39d97), and electric blue (#5c81ff). The interface should feel handcrafted, immersive, sleek, and slightly futuristic - never generic or template-like. Use large airy headlines, restrained body copy, glassmorphism panels, soft blur, thin translucent borders, rounded pill navigation, gradient text only for highlighted words, elegant line-arrow icons, and meaningful motion such as fade-up reveals, cinematic transitions, and polished hover states. Keep the composition spacious and editorial, with layered depth, soft glows, and premium contrast. Avoid flat SaaS layouts, stock-corporate visuals, and overly cheerful colors."
