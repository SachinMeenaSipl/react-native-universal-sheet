---
description: Run react-native-universal-sheet on the web with react-native-web - Expo web, Vite and webpack setup. Every placement renders as an accessible DOM dialog with Escape to close.
---

# Web

On the web every sheet is rendered as a fixed-position DOM dialog in `document.body`, using the same props as native. Every placement is drawn: bottom, top, center, side, floating, full screen and anchored.

## Requirements

```sh
npm install react-native-universal-sheet react-dom react-native-web
```

| Package | Minimum |
| --- | --- |
| `react-dom` | 18.2 |
| `react-native-web` | 0.19 |

## Expo web

Nothing extra. Metro resolves `.web.tsx` files and compiles the package's TypeScript:

```sh
npx expo start --web
```

## Vite

The package ships TypeScript source. Alias `react-native` to `react-native-web` and put the `.web` extensions first:

```ts
// vite.config.ts
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {'react-native': 'react-native-web'},
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js', '.jsx', '.json'],
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.js'],
      loader: {'.js': 'jsx'},
    },
  },
});
```

## webpack

```js
// webpack.config.js (excerpt)
module.exports = {
  resolve: {
    alias: {'react-native$': 'react-native-web'},
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: /node_modules\/react-native-universal-sheet/,
        use: 'babel-loader', // with @babel/preset-typescript and @babel/preset-react
      },
    ],
  },
};
```

::: warning Not yet verified
The Vite and webpack configs above follow the standard `react-native-web` setup but have not been tested against this package. Expo web is the most direct path. A compiled build of the package, which removes the need for TypeScript loaders, is on the [roadmap](/reference/roadmap).
:::

## Behaviour on the web

| Feature | Web |
| --- | --- |
| All placements (bottom, top, center, side, floating, full screen, anchored) | ✅ |
| Backdrop colour and opacity | ✅ |
| Backdrop click to dismiss (modal behaviour) | ✅ |
| Escape key closes the topmost sheet | ✅ |
| Snap heights, `snapTo`, `expand`, `collapse` | ✅ |
| Open/close transitions (`animation.durationMs`) | ✅ |
| Drag to resize or dismiss | ⛔ not yet |
| `role="dialog"` with `aria-modal` and label | ✅ |
