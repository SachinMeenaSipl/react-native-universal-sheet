import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import SheetPreview from './SheetPreview.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // <SheetPreview variant="bottomSheet" /> in any docs page.
    app.component('SheetPreview', SheetPreview);
  },
} satisfies Theme;
