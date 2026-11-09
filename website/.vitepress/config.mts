import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { defineConfig } from 'vitepress';

// Pages live in ../docs, outside this package, so Vue can't be found by walking up
// from them. Resolve it from this package instead.
const require = createRequire(import.meta.url);
const vueDir = dirname(require.resolve('vue/package.json')).split('\\').join('/');

const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
const repo = 'https://github.com/SachinMeenaSipl/react-native-universal-sheet';
const npm = 'https://www.npmjs.com/package/react-native-universal-sheet';
const base = '/react-native-universal-sheet/';
const siteUrl = `https://sachinmeenasipl.github.io${base}`;

// --- SEO -------------------------------------------------------------------------------

const siteTitle = 'React Native Universal Sheet';
const siteDescription =
  'Native bottom sheets, modals, popovers, toasts and stacked sheets for React Native, Expo and the web. Snap points, keyboard handling, full design props and one API on iOS, Android and web.';
const keywords = [
  'react native bottom sheet',
  'react native modal',
  'react native popover',
  'react native toast',
  'react native action sheet',
  'stacked bottom sheets',
  'native bottom sheet',
  'UISheetPresentationController react native',
  'BottomSheetDialog react native',
  'expo bottom sheet',
  'react-native-web modal',
  'react native snap points',
  'react native sheet',
].join(', ');
const ogImage = `${siteUrl}og-image.png`;

/** First prose paragraph of a page, as plain text, for its meta description. */
function firstParagraph(markdown: string): string {
  const body = markdown.replace(/^---[\s\S]*?---\s*/, '');
  const paragraph: string[] = [];
  for (const line of body.split(/\r?\n/)) {
    const t = line.trim();
    if (paragraph.length && !t) break;
    if (!t || /^(#|<|\||```|:::|-|\*|>|!\[|\d+\.)/.test(t)) continue;
    paragraph.push(t);
  }
  const text = paragraph
    .join(' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= 160) return text;
  return `${text.slice(0, 157).replace(/\s+\S*$/, '')}…`;
}

const sidebar = [
  {
    text: 'Getting started',
    items: [
      { text: 'Introduction', link: '/guide/introduction' },
      { text: 'Quick start', link: '/guide/quick-start' },
      { text: 'Core concepts', link: '/guide/core-concepts' },
      { text: 'How it works', link: '/guide/how-it-works' },
    ],
  },
  {
    text: 'Installation',
    items: [
      { text: 'Overview & requirements', link: '/installation/' },
      { text: 'React Native CLI', link: '/installation/react-native' },
      { text: 'Expo', link: '/installation/expo' },
      { text: 'Web', link: '/installation/web' },
      { text: 'Verify the install', link: '/installation/verify' },
    ],
  },
  {
    text: 'Components & APIs',
    items: [
      { text: 'NativeSheetProvider', link: '/components/native-sheet-provider' },
      { text: 'NativeSheet', link: '/components/native-sheet' },
      { text: 'NativeModal', link: '/components/native-modal' },
      { text: 'useNativeSheet', link: '/components/use-native-sheet' },
      { text: 'useSheetState', link: '/components/use-sheet-state' },
      { text: 'presentAlert', link: '/components/present-alert' },
      { text: 'presentToast', link: '/components/present-toast' },
      { text: 'SheetManager', link: '/components/sheet-manager' },
      { text: 'SheetRegistry', link: '/components/sheet-registry' },
    ],
  },
  {
    text: 'Features',
    items: [
      { text: 'Sheet types (variants)', link: '/features/variants' },
      { text: 'Snap points & sizing', link: '/features/snap-points' },
      { text: 'Stacking & replace', link: '/features/stacking' },
      { text: 'Appearance & styles', link: '/features/appearance' },
      { text: 'Behaviour props', link: '/features/behavior' },
      { text: 'Events', link: '/features/events' },
      { text: 'Animation', link: '/features/animation' },
      { text: 'Keyboard & scrolling', link: '/features/keyboard-and-scroll' },
      { text: 'Back button & Escape', link: '/features/back-button' },
      { text: 'Accessibility', link: '/features/accessibility' },
    ],
  },
  {
    text: 'Recipes',
    items: [
      { text: 'Overview', link: '/recipes/' },
      { text: 'Filter sheet', link: '/recipes/filter-sheet' },
      { text: 'Form with keyboard', link: '/recipes/form-with-keyboard' },
      { text: 'Confirm dialog', link: '/recipes/confirm-dialog' },
      { text: 'Toasts & notifications', link: '/recipes/toast-notifications' },
      { text: 'Multi-step checkout', link: '/recipes/checkout-flow' },
      { text: 'Named sheets', link: '/recipes/named-sheets' },
      { text: 'React Navigation', link: '/recipes/react-navigation' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'API', link: '/reference/api' },
      { text: 'Version compatibility', link: '/reference/compatibility' },
      { text: 'Platform support', link: '/reference/platform-support' },
      { text: 'Error reasons', link: '/reference/errors' },
      { text: 'Troubleshooting', link: '/reference/troubleshooting' },
      { text: 'FAQ', link: '/reference/faq' },
      { text: 'Status & roadmap', link: '/reference/roadmap' },
      { text: 'Changelog', link: '/reference/changelog' },
    ],
  },
];

export default defineConfig({
  lang: 'en-US',
  title: 'Universal Sheet',
  titleTemplate: `:title · ${siteTitle}`,
  description: siteDescription,
  base,
  srcDir: '../docs',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: siteUrl },
  // Per-page SEO: description (frontmatter, else the first paragraph), canonical URL,
  // and Open Graph / Twitter tags that match the page.
  transformPageData(pageData, { siteConfig }) {
    const fm = pageData.frontmatter;
    if (!fm.description && pageData.filePath) {
      try {
        const text = firstParagraph(readFileSync(join(siteConfig.srcDir, pageData.filePath), 'utf8'));
        if (text) {
          fm.description = text;
          pageData.description = text;
        }
      } catch {
        // Keep the site description.
      }
    }
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '');
    const url = `${siteUrl}${path}`;
    const title = fm.title ?? (pageData.title ? `${pageData.title} · ${siteTitle}` : siteTitle);
    const description = fm.description ?? siteDescription;
    fm.head ??= [];
    fm.head.push(
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }]
    );
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['meta', { name: 'keywords', content: keywords }],
    ['meta', { name: 'author', content: 'Sachin Meena' }],
    ['meta', { name: 'theme-color', content: '#4f46e5' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: siteTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'React Native Universal Sheet: bottom sheet, modal and toast on phone screens' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: ogImage }],
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: 'react-native-universal-sheet',
        alternateName: siteTitle,
        description: siteDescription,
        url: siteUrl,
        codeRepository: repo,
        version: pkg.version,
        programmingLanguage: ['TypeScript', 'Kotlin', 'Swift'],
        runtimePlatform: ['React Native', 'Expo', 'Android', 'iOS', 'Web'],
        license: 'https://opensource.org/licenses/MIT',
        author: { '@type': 'Person', name: 'Sachin Meena' },
        image: ogImage,
      }),
    ],
  ],
  vite: {
    resolve: {
      alias: [{ find: /^vue($|\/)/, replacement: `${vueDir}$1` }],
    },
  },
  markdown: {
    // Docs show JSX like `style={{ flex: 1 }}` in inline code; keep Vue from parsing it.
    config(md) {
      const render = md.renderer.rules.code_inline!;
      md.renderer.rules.code_inline = (...args) => render(...args).replace('<code', '<code v-pre');
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Install', link: '/installation/' },
      { text: 'Components', link: '/components/native-sheet-provider' },
      { text: 'Recipes', link: '/recipes/' },
      { text: 'Compatibility', link: '/reference/compatibility' },
      {
        text: `v${pkg.version}`,
        items: [
          { text: 'Changelog', link: '/reference/changelog' },
          { text: 'Status & roadmap', link: '/reference/roadmap' },
          { text: 'npm', link: npm },
        ],
      },
    ],
    sidebar: {
      '/guide/': sidebar,
      '/installation/': sidebar,
      '/components/': sidebar,
      '/features/': sidebar,
      '/recipes/': sidebar,
      '/reference/': sidebar,
    },
    outline: { level: [2, 3] },
    socialLinks: [
      { icon: 'github', link: repo },
      { icon: 'npm', link: npm },
    ],
    search: { provider: 'local' },
    editLink: {
      pattern: `${repo}/edit/main/docs/:path`,
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Sachin Meena',
    },
  },
});
