<script setup lang="ts">
/**
 * A schematic phone screen showing where a sheet variant appears.
 * Usage in markdown: <SheetPreview variant="bottomSheet" />
 * It is an illustration of placement, not a screenshot of a device.
 */
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{ variant?: string; caption?: string; snap?: number }>(),
  { variant: 'bottomSheet', snap: 0.5 }
);

type Shape = {
  x: number; y: number; w: number; h: number; r: number;
  backdrop: boolean; handle?: boolean; anchor?: boolean; spotlight?: boolean; label: string;
};

// Screen is 180 x 360 inside the phone frame.
const W = 180;
const H = 360;

const shape = computed<Shape>(() => {
  const s = props.snap;
  switch (props.variant) {
    case 'center':
      return { x: 20, y: 120, w: 140, h: 120, r: 14, backdrop: true, label: 'Center modal' };
    case 'alert':
      return { x: 30, y: 135, w: 120, h: 90, r: 14, backdrop: true, label: 'Alert' };
    case 'fullScreen':
      return { x: 0, y: 0, w: W, h: H, r: 0, backdrop: false, label: 'Full screen' };
    case 'popup':
    case 'floating':
      return { x: 16, y: 200, w: 148, h: 110, r: 16, backdrop: false, label: props.variant === 'popup' ? 'Popup' : 'Floating' };
    case 'side':
      return { x: 60, y: 0, w: 120, h: H, r: 0, backdrop: true, label: 'Side drawer' };
    case 'top':
      return { x: 0, y: 0, w: W, h: 130, r: 14, backdrop: true, label: 'Top sheet' };
    case 'toast':
      return { x: 24, y: 300, w: 132, h: 32, r: 10, backdrop: false, label: 'Toast' };
    case 'snackbar':
      return { x: 12, y: 304, w: 156, h: 36, r: 6, backdrop: false, label: 'Snackbar' };
    case 'inAppNotification':
      return { x: 12, y: 18, w: 156, h: 50, r: 12, backdrop: false, label: 'In-app notification' };
    case 'tooltip':
      return { x: 40, y: 150, w: 100, h: 34, r: 8, backdrop: false, anchor: true, label: 'Tooltip' };
    case 'popover':
    case 'dropdown':
    case 'contextMenu':
      return { x: 40, y: 150, w: 110, h: 90, r: 10, backdrop: false, anchor: true, label: props.variant };
    case 'coachmark':
    case 'spotlight':
      return { x: 30, y: 150, w: 120, h: 50, r: 10, backdrop: true, anchor: true, spotlight: true, label: props.variant };
    case 'loadingOverlay':
      return { x: 60, y: 150, w: 60, h: 60, r: 14, backdrop: true, label: 'Loading overlay' };
    case 'fullScreenViewer':
      return { x: 0, y: 40, w: W, h: 280, r: 0, backdrop: true, label: 'Full-screen viewer' };
    default: {
      // bottomSheet, action, share, picker, filter
      const h = Math.round(H * Math.min(Math.max(s, 0.15), 1));
      return { x: 0, y: H - h, w: W, h, r: 16, backdrop: true, handle: true, label: props.variant };
    }
  }
});

const lines = computed(() => {
  const s = shape.value;
  const count = Math.max(1, Math.min(5, Math.floor((s.h - 24) / 18)));
  return Array.from({ length: count }, (_, i) => ({
    x: s.x + 14,
    y: s.y + (s.handle ? 22 : 14) + i * 16,
    w: Math.max(20, (s.w - 28) * (i === 0 ? 0.6 : 0.9 - i * 0.08)),
  }));
});
</script>

<template>
  <figure class="sheet-preview">
    <svg viewBox="0 0 200 400" role="img" :aria-label="`${shape.label} placement on a phone screen`">
      <rect x="2" y="2" width="196" height="396" rx="28" class="frame" />
      <g transform="translate(10 20)">
        <rect x="0" y="0" :width="W" :height="H" rx="18" class="screen" />
        <!-- app content behind the sheet -->
        <rect x="14" y="20" width="90" height="10" rx="5" class="app" />
        <rect x="14" y="44" width="152" height="60" rx="10" class="app" />
        <rect x="14" y="116" width="152" height="12" rx="6" class="app" />
        <rect x="14" y="136" width="120" height="12" rx="6" class="app" />
        <rect x="14" y="160" width="152" height="60" rx="10" class="app" />
        <rect x="14" y="232" width="100" height="12" rx="6" class="app" />
        <rect v-if="shape.anchor" x="20" y="116" width="44" height="22" rx="11" class="anchor" />

        <rect v-if="shape.backdrop" x="0" y="0" :width="W" :height="H" rx="18" class="backdrop" />
        <rect v-if="shape.spotlight" x="16" y="112" width="52" height="30" rx="15" class="spot" />
        <path v-if="shape.anchor" :d="`M ${42} ${shape.y - 8} l -7 8 h 14 z`" class="surface" />

        <rect :x="shape.x" :y="shape.y" :width="shape.w" :height="shape.h" :rx="shape.r" class="surface" />
        <rect v-if="shape.handle" :x="W / 2 - 16" :y="shape.y + 7" width="32" height="4" rx="2" class="handle" />
        <rect v-for="(l, i) in lines" :key="i" :x="l.x" :y="l.y" :width="l.w" height="7" rx="3.5" class="line" />
      </g>
    </svg>
    <figcaption>{{ caption ?? shape.label }}</figcaption>
  </figure>
</template>

<style scoped>
.sheet-preview {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin: 8px 12px 16px 0;
  width: 150px;
  vertical-align: top;
}
.sheet-preview svg { width: 100%; height: auto; }
.sheet-preview figcaption { font-size: 13px; color: var(--vp-c-text-2); text-align: center; }
.frame { fill: var(--vp-c-bg-soft); stroke: var(--vp-c-divider); stroke-width: 2; }
.screen { fill: var(--vp-c-bg); }
.app { fill: var(--vp-c-default-soft); }
.anchor { fill: var(--vp-c-brand-1); }
.backdrop { fill: #000; opacity: 0.35; }
.spot { fill: none; stroke: #fff; stroke-width: 2; stroke-dasharray: 4 3; }
.surface { fill: var(--usheet-surface); stroke: var(--vp-c-brand-2); stroke-width: 1.5; }
.handle { fill: var(--vp-c-text-3); }
.line { fill: var(--vp-c-brand-soft); }
</style>
