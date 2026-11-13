import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export type TabType = 'home' | 'map' | 'favorites' | 'profile';

const TAB_ORDER: TabType[] = ['home', 'map', 'favorites', 'profile'];

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onPressAdd: () => void;
  isAdmin: boolean;
}

interface GlassConfig {
  glassThickness: number;
  bezelWidth: number;
  ior: number;
  scaleRatio: number;
  blur: number;
  specularOpacity: number;
  specularSat: number;
  tintColor: string;
  tintOpacity: number;
  innerShadow: string;
  innerShadowBlur: number;
  innerShadowSpread: number;
  balancedSpecular: boolean;
}

const DEFAULT_CONFIG: GlassConfig = {
  glassThickness: 70,
  bezelWidth: 36,
  ior: 1.4,
  scaleRatio: 1.0,
  blur: 1.2,
  specularOpacity: 0.65,
  specularSat: 0,
  tintColor: '255,255,255',
  tintOpacity: 0.14,
  innerShadow: 'rgba(255,255,255,0)',
  innerShadowBlur: 0,
  innerShadowSpread: 0,
  balancedSpecular: false,
};

const DEFAULT_SWITCHER_CONFIG: GlassConfig = {
  glassThickness: 32,
  bezelWidth: 32,
  ior: 1.4,
  scaleRatio: 1.0,
  blur: 0.4,
  specularOpacity: 0.55,
  specularSat: 0,
  tintColor: '255,255,255',
  tintOpacity: 0.18,
  innerShadow: 'rgba(255,255,255,0)',
  innerShadowBlur: 0,
  innerShadowSpread: 0,
  balancedSpecular: true,
};

const LIQUID_GLASS_CSS = `
.ios26-nav,
.ios26-nav *,
.ios26-nav *::before,
.ios26-nav *::after {
  box-sizing: border-box;
}

.ios26-nav {
  position: fixed;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  width: min(340px, calc(100vw - 48px));
  height: 52px;
  border-radius: 999px;
  background: transparent;
  overflow: visible;
  z-index: 120;
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  user-select: none;
  -webkit-user-select: none;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.12);
}

.ios26-nav.engaged {
  transform: translateX(-50%) scale(1.03);
}

.ios26-nav-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 52px;
  display: grid;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  border-radius: 999px;
  background: transparent;
  --gx: 50%;
  --gy: 50%;
  --ga: 0;
}

.nav-glow {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  clip-path: inset(0 round 999px);
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(
    220px 140px at var(--gx) var(--gy),
    rgba(205, 228, 255, var(--ga)) 0%,
    rgba(205, 228, 255, 0) 74%
  );
  transition: background 0.18s ease;
}

.tab-indicator {
  position: absolute;
  left: 8px;
  top: 6px;
  height: 40px;
  width: 90px;
  border-radius: 999px;
  z-index: 1;
  pointer-events: none;
  transform-origin: center center;
  will-change: left, width, transform;
  background: transparent;
  transition:
    left 0.24s cubic-bezier(0.2, 0.9, 0.22, 1),
    width 0.24s cubic-bezier(0.2, 0.9, 0.22, 1),
    transform 0.25s ease;
}

.tab-indicator.interacting {
  z-index: 999;
  transform: scale(1.28);
}

.ios26-nav-inner.dragging .tab-indicator {
  transition: transform 0.2s ease;
}

.ios-item {
  position: relative;
  z-index: 2;
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
  height: 40px;
  border-radius: 999px;
  color: #3d434e;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: color 0.2s ease;
}

.ios-item .ios-icon {
  width: 22px;
  height: 22px;
  display: block;
  margin: auto;
  fill: currentColor;
  opacity: 0.95;
}

.ios-item:hover {
  color: #3b82f6;
}

.ios-item.active {
  color: #3b82f6;
}

.ios-item.active.fav-active {
  color: #EF4444;
}
`;

function surfaceFn(x: number): number {
  return Math.pow(1 - Math.pow(1 - x, 4), 0.25);
}

function calcRefractionProfile(
  glassThickness: number,
  bezelWidth: number,
  ior: number,
  samples = 128
): Float64Array {
  const eta = 1 / ior;
  function refract(nx: number, ny: number): [number, number] | null {
    const dot = ny;
    const k = 1 - eta * eta * (1 - dot * dot);
    if (k < 0) return null;
    const sq = Math.sqrt(k);
    return [-(eta * dot + sq) * nx, eta - (eta * dot + sq) * ny];
  }
  const p = new Float64Array(samples);
  for (let i = 0; i < samples; i++) {
    const x = i / samples;
    const y = surfaceFn(x);
    const dx = x < 1 ? 0.0001 : -0.0001;
    const y2 = surfaceFn(x + dx);
    const deriv = (y2 - y) / dx;
    const mag = Math.sqrt(deriv * deriv + 1);
    const ref = refract(-deriv / mag, -1 / mag);
    p[i] = ref ? ref[0] * ((y * bezelWidth + glassThickness) / ref[1]) : 0;
  }
  return p;
}

function generateDisplacementMap(
  w: number,
  h: number,
  radius: number,
  bezelWidth: number,
  profile: Float64Array,
  maxDisp: number
): string {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) return '';
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = 128;
    d[i + 1] = 128;
    d[i + 2] = 0;
    d[i + 3] = 255;
  }
  const r = radius;
  const rSq = r * r;
  const r1Sq = (r + 1) ** 2;
  const rBSq = Math.max(r - bezelWidth, 0) ** 2;
  const wB = w - r * 2;
  const hB = h - r * 2;
  const S = profile.length;
  for (let y1 = 0; y1 < h; y1++) {
    for (let x1 = 0; x1 < w; x1++) {
      const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
      const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;
      const dSq = x * x + y * y;
      if (dSq > r1Sq || dSq < rBSq) continue;
      const dist = Math.sqrt(dSq);
      const fromSide = r - dist;
      const op =
        dSq < rSq
          ? 1
          : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
      if (op <= 0 || dist === 0) continue;
      const cos = x / dist;
      const sin = y / dist;
      const bi = Math.min(((fromSide / bezelWidth) * S) | 0, S - 1);
      const disp = profile[bi] || 0;
      const dX = (-cos * disp) / maxDisp;
      const dY = (-sin * disp) / maxDisp;
      const idx = (y1 * w + x1) * 4;
      d[idx] = (128 + dX * 127 * op + 0.5) | 0;
      d[idx + 1] = (128 + dY * 127 * op + 0.5) | 0;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function generateSpecularMap(
  w: number,
  h: number,
  radius: number,
  bezelWidth: number,
  balanced: boolean
): string {
  const angle = Math.PI / 3;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) return '';
  const img = ctx.createImageData(w, h);
  const d = img.data;
  d.fill(0);
  const r = radius;
  const rSq = r * r;
  const r1Sq = (r + 1) ** 2;
  const rBSq = Math.max(r - bezelWidth, 0) ** 2;
  const wB = w - r * 2;
  const hB = h - r * 2;
  const sv = [Math.cos(angle), Math.sin(angle)];
  for (let y1 = 0; y1 < h; y1++) {
    for (let x1 = 0; x1 < w; x1++) {
      const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
      const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;
      const dSq = x * x + y * y;
      if (dSq > r1Sq || dSq < rBSq) continue;
      const dist = Math.sqrt(dSq);
      const fromSide = r - dist;
      const op =
        dSq < rSq
          ? 1
          : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
      if (op <= 0 || dist === 0) continue;
      const cos = x / dist;
      const sin = -y / dist;
      const dot = balanced ? 1 : Math.abs(cos * sv[0] + sin * sv[1]);
      const edge = Math.sqrt(Math.max(0, 1 - (1 - fromSide) ** 2));
      const coeff = dot * edge;
      const col = (255 * coeff) | 0;
      const alpha = (col * coeff * op) | 0;
      const idx = (y1 * w + x1) * 4;
      d[idx] = col;
      d[idx + 1] = col;
      d[idx + 2] = col;
      d[idx + 3] = alpha;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function svgEl(tag: string, attrs: Record<string, string | number>): SVGElement {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, String(v));
  }
  return el;
}

function ensureDefs(): SVGDefsElement {
  const existing = document.getElementById('demo-lg-defs');
  if (existing && existing instanceof SVGDefsElement) {
    return existing;
  }
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.cssText =
    'position:fixed;top:0;left:0;width:0;height:0;pointer-events:none;z-index:-1;';
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.id = 'demo-lg-defs';
  svg.appendChild(defs);
  document.documentElement.appendChild(svg);
  return defs;
}

function buildFilter(
  id: string,
  w: number,
  h: number,
  radius: number,
  cfg: GlassConfig
): SVGElement {
  const bezel = Math.min(cfg.bezelWidth, radius - 1, Math.min(w, h) / 2 - 1);
  const profile = calcRefractionProfile(cfg.glassThickness, bezel, cfg.ior, 128);
  const maxDisp = Math.max(...Array.from(profile).map(Math.abs)) || 1;
  const dispUrl = generateDisplacementMap(w, h, radius, bezel, profile, maxDisp);
  const specUrl = generateSpecularMap(
    w,
    h,
    radius,
    bezel * 2.2,
    Boolean(cfg.balancedSpecular)
  );
  const scale = maxDisp * cfg.scaleRatio;

  const filter = svgEl('filter', {
    id,
    x: '0',
    y: '0',
    width: String(w),
    height: String(h),
    filterUnits: 'userSpaceOnUse',
    primitiveUnits: 'userSpaceOnUse',
    'color-interpolation-filters': 'sRGB',
  });
  const blur = svgEl('feGaussianBlur', {
    in: 'SourceGraphic',
    stdDeviation: cfg.blur,
    result: 'blurred',
  });
  const dispImg = svgEl('feImage', {
    href: dispUrl,
    x: 0,
    y: 0,
    width: w,
    height: h,
    result: 'disp_map',
  });
  const dispMap = svgEl('feDisplacementMap', {
    in: 'blurred',
    in2: 'disp_map',
    scale,
    xChannelSelector: 'R',
    yChannelSelector: 'G',
    result: 'displaced',
  });
  const sat = svgEl('feColorMatrix', {
    in: 'displaced',
    type: 'saturate',
    values: cfg.specularSat,
    result: 'displaced_sat',
  });
  const spec = svgEl('feImage', {
    href: specUrl,
    x: 0,
    y: 0,
    width: w,
    height: h,
    result: 'spec_layer',
  });
  const comp = svgEl('feComposite', {
    in: 'displaced_sat',
    in2: 'spec_layer',
    operator: 'in',
    result: 'spec_masked',
  });
  const tr = svgEl('feComponentTransfer', {
    in: 'spec_layer',
    result: 'spec_faded',
  });
  tr.appendChild(svgEl('feFuncA', { type: 'linear', slope: cfg.specularOpacity }));
  const b1 = svgEl('feBlend', {
    in: 'spec_masked',
    in2: 'displaced',
    mode: 'normal',
    result: 'with_sat',
  });
  const b2 = svgEl('feBlend', {
    in: 'spec_faded',
    in2: 'with_sat',
    mode: 'normal',
  });
  filter.append(blur, dispImg, dispMap, sat, spec, comp, tr, b1, b2);
  return filter;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onPressAdd,
  isAdmin,
}) => {
  const navWrapRef = useRef<HTMLElement | null>(null);
  const callbacksRef = useRef({ onSelectTab, onPressAdd });
  callbacksRef.current = { onSelectTab, onPressAdd };
  const snapFnRef = useRef<((tab: TabType) => void) | null>(null);

  useEffect(() => {
    if (snapFnRef.current) {
      snapFnRef.current(currentTab);
    }
  }, [currentTab]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    let styleTag = document.getElementById(
      'ios26-liquid-glass-style'
    ) as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'ios26-liquid-glass-style';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = LIQUID_GLASS_CSS;

    const navWrap = navWrapRef.current;
    if (!navWrap) return;

    const nav = navWrap.querySelector('.ios26-nav-inner') as HTMLElement | null;
    const indicator = navWrap.querySelector('.tab-indicator') as HTMLElement | null;
    const items = Array.from(navWrap.querySelectorAll('.ios-item')) as HTMLElement[];

    if (!nav || !indicator || items.length === 0) return;

    const targets = new Map<
      HTMLElement,
      { rebuild: () => void; destroy: () => void }
    >();

    function applyGlass(el: HTMLElement, cfgGetter: () => GlassConfig) {
      if (targets.has(el)) return;

      const refr = document.createElement('div');
      refr.className = 'lg-layer';
      refr.style.cssText =
        'position:absolute;inset:0;z-index:0;pointer-events:none;';
      const tint = document.createElement('div');
      tint.className = 'lg-layer';
      tint.style.cssText =
        'position:absolute;inset:0;z-index:0;pointer-events:none;';
      el.insertBefore(tint, el.firstChild);
      el.insertBefore(refr, el.firstChild);

      let filterNode: SVGElement | null = null;
      let timer: any = null;

      function rebuild() {
        const defs = ensureDefs();
        const w = Math.round(el.offsetWidth);
        const h = Math.round(el.offsetHeight);
        if (w < 4 || h < 4) return;
        const dataR = parseFloat(el.getAttribute('data-radius') || '0');
        const cssR = parseFloat(getComputedStyle(el).borderTopLeftRadius || '0');
        const r = Math.max(2, Math.min(dataR || cssR || 24, w / 2, h / 2));
        if (filterNode) filterNode.remove();
        const cfg = cfgGetter();
        const id = 'demo-lg-' + Math.random().toString(36).slice(2, 10);
        filterNode = buildFilter(id, w, h, r, cfg);
        defs.appendChild(filterNode);
        refr.style.borderRadius = r + 'px';
        refr.style.backdropFilter = `url(#${id})`;
        (refr.style as any).webkitBackdropFilter = `url(#${id})`;
        tint.style.borderRadius = r + 'px';
        tint.style.backgroundColor = `rgba(${cfg.tintColor},${cfg.tintOpacity})`;
      }

      function schedule() {
        clearTimeout(timer);
        timer = setTimeout(rebuild, 16);
      }

      const ro = new ResizeObserver(schedule);
      ro.observe(el);
      targets.set(el, {
        rebuild,
        destroy() {
          clearTimeout(timer);
          ro.disconnect();
          if (filterNode) filterNode.remove();
          refr.remove();
          tint.remove();
        },
      });
      rebuild();
    }

    applyGlass(navWrap, () => DEFAULT_CONFIG);
    applyGlass(indicator, () => DEFAULT_SWITCHER_CONFIG);

    const DRAG_THRESHOLD = 6;
    const OVERSHOOT = 16;

    let active = Math.max(0, TAB_ORDER.indexOf(currentTab));
    let targetIndex = active;
    let pointerId: number | null = null;
    let pressX = 0;
    let pressY = 0;
    let dragMode = false;
    let pressWidth = 0;
    let finishTimer: any = null;
    let glassRebuildQueued = false;

    function clamp(n: number, min: number, max: number) {
      return Math.min(max, Math.max(min, n));
    }

    function navRect() {
      return nav!.getBoundingClientRect();
    }

    function toLocalX(clientX: number) {
      const nr = navRect();
      const sx = nr.width > 0 ? nav!.clientWidth / nr.width : 1;
      return (clientX - nr.left) * sx;
    }

    function itemMetrics(i: number) {
      const safeIdx = clamp(i, 0, items.length - 1);
      const nr = navRect();
      const ir = items[safeIdx].getBoundingClientRect();
      const sx = nr.width > 0 ? nav!.clientWidth / nr.width : 1;
      const left = (ir.left - nr.left) * sx;
      const width = ir.width * sx;
      return { left, width, center: left + width / 2 };
    }

    function nearestIndex(localX: number) {
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i < items.length; i++) {
        const d = Math.abs(localX - itemMetrics(i).center);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return best;
    }

    function setIndicator(left: number, width: number, animate: boolean) {
      if (!animate) {
        const old = indicator!.style.transition;
        indicator!.style.transition = 'none';
        indicator!.style.left = `${left}px`;
        indicator!.style.width = `${width}px`;
        void indicator!.offsetWidth;
        indicator!.style.transition = old;
        return;
      }
      indicator!.style.left = `${left}px`;
      indicator!.style.width = `${width}px`;
    }

    function snapToIndex(i: number, animate: boolean) {
      const m = itemMetrics(i);
      setIndicator(m.left, m.width, animate);
    }

    snapFnRef.current = (tab: TabType) => {
      active = Math.max(0, TAB_ORDER.indexOf(tab));
      snapToIndex(active, true);
    };

    function setGlow(clientX: number, clientY: number, alpha: number) {
      const nr = navRect();
      const lx = toLocalX(clientX);
      nav!.style.setProperty('--gx', `${lx}px`);
      nav!.style.setProperty('--gy', `${clientY - nr.top}px`);
      nav!.style.setProperty('--ga', String(alpha));
    }

    function forceGlassRebuild() {
      const inst = targets.get(indicator!);
      if (inst) inst.rebuild();
    }

    function queueGlassRebuild() {
      if (glassRebuildQueued) return;
      glassRebuildQueued = true;
      requestAnimationFrame(() => {
        glassRebuildQueued = false;
        forceGlassRebuild();
      });
    }

    function beginInteraction(clientX: number, clientY: number) {
      clearTimeout(finishTimer);
      indicator!.classList.add('interacting');
      navWrap!.classList.add('engaged');
      setGlow(clientX, clientY, 0.24);
      queueGlassRebuild();
    }

    function endInteraction() {
      clearTimeout(finishTimer);
      finishTimer = setTimeout(() => {
        indicator!.classList.remove('interacting');
        nav!.classList.remove('dragging');
        navWrap!.classList.remove('engaged');
        nav!.style.setProperty('--ga', '0');
        queueGlassRebuild();
      }, 280);
    }

    function dragMove(clientX: number) {
      const localX = toLocalX(clientX);
      const w = pressWidth || itemMetrics(active).width;
      let left = localX - w / 2;
      left = clamp(left, -OVERSHOOT, nav!.clientWidth - w + OVERSHOOT);
      indicator!.style.left = `${left}px`;
      indicator!.style.width = `${w}px`;
      targetIndex = nearestIndex(localX);
      queueGlassRebuild();
    }

    function triggerIndexAction(idx: number) {
      const action = items[idx]?.getAttribute('data-action');
      const tabIdx = TAB_ORDER.indexOf(action as TabType);
      if (tabIdx >= 0) {
        active = tabIdx;
        callbacksRef.current.onSelectTab(TAB_ORDER[tabIdx]);
      } else if (action === 'add') {
        callbacksRef.current.onPressAdd();
      }
      snapToIndex(active, true);
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerId !== pointerId) return;
      const dx = Math.abs(e.clientX - pressX);
      const dy = Math.abs(e.clientY - pressY);
      if (!dragMode && (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD)) {
        dragMode = true;
        nav!.classList.add('dragging');
      }
      if (dragMode) {
        setGlow(e.clientX, e.clientY, 0.18);
        dragMove(e.clientX);
      } else {
        setGlow(e.clientX, e.clientY, 0.22);
      }
    }

    function clearPointerHandlers() {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
    }

    function onPointerUp(e: PointerEvent) {
      if (e.pointerId !== pointerId) return;
      clearPointerHandlers();
      nav!.classList.remove('dragging');
      triggerIndexAction(targetIndex);
      queueGlassRebuild();
      endInteraction();
      pointerId = null;
      dragMode = false;
    }

    function onPointerCancel(e: PointerEvent) {
      if (e.pointerId !== pointerId) return;
      clearPointerHandlers();
      nav!.classList.remove('dragging');
      snapToIndex(active, true);
      endInteraction();
      pointerId = null;
      dragMode = false;
    }

    const cleanups: Array<() => void> = [];

    items.forEach((btn, idx) => {
      btn.style.touchAction = 'none';
      const handler = (e: PointerEvent) => {
        if (!e.isPrimary || e.button !== 0) return;
        e.preventDefault();
        if (pointerId !== null) return;
        pointerId = e.pointerId;
        dragMode = false;
        targetIndex = idx;
        pressX = e.clientX;
        pressY = e.clientY;
        pressWidth = itemMetrics(idx).width;
        snapToIndex(idx, true);
        beginInteraction(e.clientX, e.clientY);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerCancel);
      };
      btn.addEventListener('pointerdown', handler);
      cleanups.push(() => btn.removeEventListener('pointerdown', handler));
    });

    const onResize = () => {
      snapToIndex(active, false);
      targets.forEach((inst) => inst.rebuild());
    };
    window.addEventListener('resize', onResize);
    requestAnimationFrame(() => {
      snapToIndex(active, false);
      targets.forEach((inst) => inst.rebuild());
    });

    return () => {
      clearTimeout(finishTimer);
      clearPointerHandlers();
      cleanups.forEach((fn) => fn());
      window.removeEventListener('resize', onResize);
      targets.forEach((inst) => inst.destroy());
      targets.clear();
    };
  }, [isAdmin]);

  if (Platform.OS === 'web') {
    const colCount = isAdmin ? 5 : 4;
    return (
      <header ref={navWrapRef as any} className="ios26-nav" data-radius="999">
        <div
          className="ios26-nav-inner"
          style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}
        >
          <div className="nav-glow" />
          <div className="tab-indicator" data-radius="999" />

          <button
            type="button"
            data-action="home"
            aria-label="Imóveis"
            className={`ios-item ${currentTab === 'home' ? 'active' : ''}`}
          >
            <svg className="ios-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3.5 4 9v10.2c0 .7.6 1.3 1.3 1.3h5.4v-6.4h2.6v6.4h5.4c.7 0 1.3-.6 1.3-1.3V9l-8-5.5Z" />
            </svg>
          </button>

          <button
            type="button"
            data-action="map"
            aria-label="Mapa"
            className={`ios-item ${currentTab === 'map' ? 'active' : ''}`}
          >
            <svg className="ios-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
            </svg>
          </button>

          <button
            type="button"
            data-action="favorites"
            aria-label="Favoritos"
            className={`ios-item ${
              currentTab === 'favorites' ? 'active fav-active' : ''
            }`}
          >
            <svg className="ios-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          <button
            type="button"
            data-action="profile"
            aria-label="Perfil"
            className={`ios-item ${currentTab === 'profile' ? 'active' : ''}`}
          >
            <svg className="ios-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2.5c-3.33 0-10 1.67-10 5V22h20v-2.5c0-3.33-6.67-5-10-5z" />
            </svg>
          </button>

          {isAdmin && (
            <button
              type="button"
              data-action="add"
              aria-label="Novo imóvel"
              className="ios-item"
            >
              <svg className="ios-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
            </button>
          )}
        </div>
      </header>
    );
  }

  return (
    <View style={styles.floatingWrapper} pointerEvents="box-none">
      <View style={styles.mainGlassCapsule}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            currentTab === 'home' && styles.tabItemActiveBubble,
          ]}
          onPress={() => onSelectTab('home')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={currentTab === 'home' ? 'home' : 'home-outline'}
            size={22}
            color={currentTab === 'home' ? '#3b82f6' : '#3d434e'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            currentTab === 'map' && styles.tabItemActiveBubble,
          ]}
          onPress={() => onSelectTab('map')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={currentTab === 'map' ? 'map' : 'map-outline'}
            size={22}
            color={currentTab === 'map' ? '#3b82f6' : '#3d434e'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            currentTab === 'favorites' && styles.tabItemActiveBubble,
          ]}
          onPress={() => onSelectTab('favorites')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={currentTab === 'favorites' ? 'heart' : 'heart-outline'}
            size={22}
            color={
              currentTab === 'favorites' ? theme.colors.favorite : '#3d434e'
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            currentTab === 'profile' && styles.tabItemActiveBubble,
          ]}
          onPress={() => onSelectTab('profile')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={currentTab === 'profile' ? 'person' : 'person-outline'}
            size={22}
            color={currentTab === 'profile' ? '#3b82f6' : '#3d434e'}
          />
        </TouchableOpacity>

        {isAdmin && (
          <TouchableOpacity
            style={styles.tabItem}
            onPress={onPressAdd}
            activeOpacity={0.8}
          >
            <Ionicons
              name="add-circle-outline"
              size={22}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 14,
    zIndex: 100,
    alignItems: 'center',
  },
  mainGlassCapsule: {
    width: '100%',
    maxWidth: 340,
    height: 52,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(220, 226, 234, 0.72)',
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  tabItemActiveBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
});
