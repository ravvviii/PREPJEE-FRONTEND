This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## Fonts

PREPJEE uses two global font families loaded from `src/app/globals.css`.

- Satoshi from Fontshare is the default UI font through Tailwind's `font-sans` token.
- DM Mono from Google Fonts is available through Tailwind's `font-mono` token.
- Metadata, labels, numbers, and timers should use the custom `font-meta` utility, which applies DM Mono, uppercase text, medium weight, and `0.1em` tracking.
- Font helpers are exported from `src/config/fonts.js` for easy imports across the app.

The global imports must stay at the top of `src/app/globals.css`, before Tailwind and other CSS imports, because PostCSS requires `@import` rules to precede normal CSS rules.

```css
@import url("https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap");
@import "tailwindcss";
```

### Usage

Satoshi is the default font, so most UI text does not need an explicit font class.

```jsx
<h1 className="text-3xl font-bold">Choose your subject</h1>
<p className="text-sm text-muted-foreground">Practice questions and track progress.</p>
```

Use `font-meta` for labels, metadata, numbers, and timers.

```jsx
<p className="font-meta text-xs text-muted-foreground">TIME LEFT</p>
<p className="font-meta text-sm text-primary">02:45</p>
```

You can also import the reusable helpers.

```jsx
import { FONT_CLASS, FONT_TRACKING, metaFont } from '@/config/fonts';

export function QuestionTimer() {
  return (
    <div>
      <p className={metaFont('text-xs text-muted-foreground')}>TIME LEFT</p>
      <p className={`${FONT_CLASS.mono} ${FONT_TRACKING.wide} uppercase text-lg font-medium`}>
        02:45
      </p>
    </div>
  );
}
```

## Colors

PREPJEE's shared color helpers live in `src/config/theme.js`.

- `COLORS` stores custom light and dark values such as `HomeBG`, `Primary`, `AppBackground`, `NavBG`, and `NavBottomLine`.
- `THEME_COLOR_TOKENS` maps semantic color names to global CSS variables from `src/app/globals.css`.
- `THEME_COLORS.css` exposes CSS variable values like `var(--background)` for inline styles or chart libraries.
- `THEME_COLORS.className` exposes Tailwind classes like `bg-background`, `text-primary`, and `border-border`.
- Helper functions `color`, `bgColor`, `textColor`, `cssColor`, and `themeClass` make colors easy to import anywhere.

Prefer Tailwind semantic classes for normal UI.

```jsx
<section className="bg-background text-foreground">
  <h1 className="text-primary">PREPJEE</h1>
</section>
```

Import helpers when a component needs inline styles, external library colors, or theme-aware config objects.

```jsx
import { bgColor, cssColor, textColor, themeClass } from '@/config/theme';

export function BrandPanel() {
  return (
    <div className={themeClass('card')} style={bgColor('HomeBG')}>
      <p style={textColor('Primary')}>Practice smarter.</p>
      <span style={{ borderColor: cssColor('border') }}>Daily goal</span>
    </div>
  );
}
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
