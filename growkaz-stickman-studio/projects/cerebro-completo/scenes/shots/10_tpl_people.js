// shots/10_tpl_people.js — template shots driven by shots.json params (tpl + options): rooms, faces, desk, phone and laptop inserts.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, seg, circle, ring, rr, poly, glow, alpha, shade, text, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { dormitorio, dormGround, cama, phoneGlow, PHONE_GLOW, escritorio } from '../sets/dormitorio.js';
import { laboratorio } from '../sets/laboratorio.js';
import { sabana } from '../sets/sabana.js';
import { WHO, wt, at, outA } from '../sets/util.js';

const pushCam = (t, info, p = {}) => ({ z: lerp(p.z0 ?? 1, p.z1 ?? 1.06, ease.inOut(t / info.dur)), x: lerp(p.x0 ?? 0, p.x1 ?? (p.x0 ?? 0), ease.inOut(t / info.dur)), y: p.y ?? 0 });
const rimFor = (M, mood, dir) => ({ color: mood === 'night' || !mood ? PHONE_GLOW : M.rim, dir, w: 4.5 });
// notification-style icons (heart, play, chat, ?, bell)
export function icon(g, kind, x, y, r, col) {
  circle(g, x, y, r, alpha(S().ui.bpBg, 0.9)); ring(g, x, y, r, Math.max(2, r * 0.12), col); g.fillStyle = col;
  if (kind === 0) { g.beginPath(); g.moveTo(x, y + r * 0.45); g.bezierCurveTo(x - r * 0.9, y - r * 0.1, x - r * 0.35, y - r * 0.75, x, y - r * 0.25); g.bezierCurveTo(x + r * 0.35, y - r * 0.75, x + r * 0.9, y - r * 0.1, x, y + r * 0.45); g.fill(); }
  else if (kind === 1) { g.beginPath(); g.moveTo(x - r * 0.25, y - r * 0.4); g.lineTo(x + r * 0.45, y); g.lineTo(x - r * 0.25, y + r * 0.4); g.closePath(); g.fill(); }
  else if (kind === 2) { rr(g, x - r * 0.5, y - r * 0.35, r, r * 0.6, r * 0.2); g.fill(); g.beginPath(); g.moveTo(x - r * 0.3, y + r * 0.2); g.lineTo(x - r * 0.4, y + r * 0.5); g.lineTo(x, y + r * 0.25); g.fill(); }
  else if (kind === 3) text(g, '?', x, y + 2, { size: r * 1.2, color: col, font: FONTS.ui, weight: 900 });
  else { g.beginPath(); g.arc(x, y - r * 0.05, r * 0.38, Math.PI, 0); g.lineTo(x + r * 0.45, y + r * 0.3); g.lineTo(x - r * 0.45, y + r * 0.3); g.closePath(); g.fill(); circle(g, x, y + r * 0.42, r * 0.1, col); }
}
export const ICOL = () => [S().ui.accent, S().ui.gold, PHONE_GLOW, S().ui.cream, S().ui.accent];
function noiseIcons(g, t, cx, cy, R, n = 16, a = 1) { const cols = ICOL(); for (let i = 0; i < n; i++) { const an = t * (0.6 + (i % 3) * 0.25) + i * 2.4, rr2 = R * (0.55 + 0.45 * ((i * 37) % 10) / 10); g.save(); g.globalAlpha *= a; icon(g, i % 5, cx + Math.cos(an) * rr2, cy + Math.sin(an) * rr2 * 0.6, 20 + (i % 4) * 6, cols[i % 5]); g.restore(); } }

const T = {};
// ---------- the bedroom / bed ----------
T.room = (g, t, info) => {
  const p = info, M0 = p.mood || 'night', cam = pushCam(t, info, p);
  const { GY, M } = dormitorio(g, t, cam, { mood: M0 === 'night' ? null : M0 });
  layer(g, cam, 1, (g) => {
    const bx = E.W / 2 - V(260, 60), top = cama(g, bx, GY, V(620, 560), M), x = bx + V(120, 80), s = V(1.35, 1.45);
    const prop = p.prop === undefined ? 'phone' : p.prop;
    let pose = prop === 'phone' ? { ...POSES.sit, eF: [20, -112], hF: [36, -136], eB: [12, -112], hB: [30, -132], head: [10, -174] } : prop === 'paper' ? { ...POSES.sit, eF: [22, -116], hF: [40, -140], eB: [14, -116], hB: [34, -138] } : POSES.sit;
    if (p.standUp && t > wt(p.standUp, info)) pose = posesAt(t, [[wt(p.standUp, info), POSES.sit], [wt(p.standUp, info) + 0.4, POSES.handsOnHead]]);
    const expr = at(t, info, p.ex, p.expr || 'neutral');
    drawFigure(g, { x, y: top + 72 * s, s, facing: 1, outfit: WHO[p.who || 'TU'], pose: breathe(pose, t, 0.6), expr, look: p.look || [0.6, 0.7], prop: (prop === 'phone' && p.phoneOff && t > wt(p.phoneOff, info)) ? null : prop, rim: rimFor(M, M0, [1, -0.2]), shadow: false, blink: (t % 3.6) > 3.5 });
    if (prop === 'phone' && !(p.phoneOff && t > wt(p.phoneOff, info))) phoneGlow(g, x + 40 * s, top + 72 * s - 140 * s, p.glow ?? 1);
    if (p.noise) noiseIcons(g, t, x + 20, top - 120, 420, 18, ease.out(prog(t, wt(p.noise, info), wt(p.noise, info) + 0.6)));
  });
  if (p.badge) UI.badge(g, { str: p.badge, a: ease.out(prog(t, wt(p.badgeAt ?? 0.3, info), wt(p.badgeAt ?? 0.3, info) + 0.4)) * outA(t, info) });
  FX.dust(g, t, { count: 30, color: M0 === 'night' ? '#cfe0ff' : '#ffe8c0', a: 0.25 });
};
// ---------- giant face ----------
T.face = (g, t, info) => {
  const p = info, bg = p.bg || 'room';
  blurLayer(g, 14, (g) => {
    const c = { z: 1.5, x: p.side === -1 ? -200 : 200, y: -140 };
    if (bg === 'room') dormitorio(g, t, c); else if (bg === 'dawn') dormitorio(g, t, c, { mood: 'golden' }); else if (bg === 'lab') laboratorio(g, t, c, { mood: 'interiorWarm' }); else if (bg === 'sabana') sabana(g, t, c, { mood: 'dusk', bigTree: false }); else UI.blueprint(g);
  });
  veil(g, '#050a10', 0.38);
  const M = mood(bg === 'dawn' ? 'golden' : bg === 'room' ? 'night' : 'interiorWarm'), side = p.side ?? 1;
  const r = V(290, 320) * (1 + 0.035 * t), cx = E.W / 2 - side * V(150, 0), cy = E.H * V(0.56, 0.52);
  const rc = bg === 'room' ? PHONE_GLOW : M.rim;
  if (bg === 'room' && p.phone !== false) glow(g, cx + side * r * 0.9, cy + r * 0.9, r * 1.4, PHONE_GLOW, 0.32 + 0.06 * Math.sin(t * 5));
  bigFace(g, cx, cy, r, { outfit: WHO[p.who || 'TU'], expr: at(t, info, p.ex, p.expr || 'neutral'), look: p.look || [side * 0.3, 0.1], rimColor: rc, rimSide: side, blink: (t % 3.3) > 3.18, tilt: p.tilt ? Math.sin(t * 0.8) * 0.04 : 0 });
  if (p.rings) FX.rings(g, cx, cy, t, { count: 3, r0: r * 1.1, r1: r * 1.7, color: p.ringColor || S().ui.gold, a: 0.3 });
  if (p.sparkle) FX.sparkle(g, cx + side * r * 1.1, cy - r * 0.9, 24 + 6 * Math.sin(t * 7), S().ui.gold, clamp(t - wt(p.sparkle, info)) );
  if (p.sweat) circle(g, cx - side * r * 0.8, cy - r * 0.5 + (t * 30) % 60, 14, '#bfe6ff');
  if (p.text) UI.bigLine(g, Math.max(0, t - wt(p.textAt ?? 0.4, info)), { str: p.text, dur: info.dur - wt(p.textAt ?? 0.4, info) + 0.4, y: E.H * V(0.2, 0.14), size: V(56, 54), color: p.textColor ? S().ui[p.textColor] : S().ui.gold });
  FX.dust(g, t, { count: 18, color: '#e8f0ff', a: 0.2 });
};
// ---------- desk / home office ----------
T.desk = (g, t, info) => {
  const p = info, M0 = p.mood || 'night', cam = pushCam(t, info, { z0: 1.12, z1: 1.18, x0: p.x0 ?? 60, ...p });
  const { GY, M } = dormitorio(g, t, cam, { mood: M0 === 'night' ? null : M0 });
  const who = p.who || 'TU', s = V(1.4, 1.5), dx = E.W / 2 + V(120, 60);
  layer(g, cam, 1, (g) => {
    const phLit = p.phoneLit ? clamp(t - wt(p.phoneLit, info) + 0.2) * (0.6 + 0.4 * Math.abs(Math.sin(t * 8))) : 0;
    const d = escritorio(g, dx, GY, M, { phone: p.phone, phoneLit: phLit, mug: true, lit: p.lit ?? 1 });
    FX.chair(g, dx - V(250, 220), GY, s * 0.9, shade(M.wall, -0.6));
    const typing = { ...POSES.sit, eF: [34, -118], hF: [70 + Math.sin(t * 18) * 3, -124], eB: [26, -118], hB: [62 + Math.cos(t * 16) * 3, -122] };
    let pose = at(t, info, p.poses, p.pose || 'typing'); pose = pose === 'typing' ? typing : pose === 'grabPhone' ? { ...POSES.sit, eF: [40, -112], hF: [70, -104] } : POSES[pose] ? { ...POSES[pose], ...(pose === 'facepalm' || pose === 'think' || pose === 'sad' ? { hip: [0, -72], kF: [44, -74], fF: [46, 0], kB: [40, -72], fB: [40, 0] } : {}) } : typing;
    drawFigure(g, { x: dx - V(240, 210), y: GY, s, facing: 1, outfit: WHO[who], pose: breathe(pose, t, 0.5), expr: at(t, info, p.ex, p.expr || 'neutral'), look: p.look || [1, 0.3], rim: rimFor(M, M0, [1, -0.3]), shadow: false, blink: (t % 3.4) > 3.3 });
    if (p.think) { const a = ease.out(prog(t, wt(p.think, info), wt(p.think, info) + 0.5)); const hx = dx - V(240, 210) + 20, hy = GY - 230 * s; for (let i = 0; i < 3; i++) circle(g, hx + 30 + i * 26, hy - 30 - i * 30, 8 + i * 4, alpha(S().ui.cream, 0.7 * a)); g.save(); g.globalAlpha *= a; rr(g, hx + 60, hy - 230, 300, 130, 60); g.fillStyle = alpha(S().ui.cream, 0.9); g.fill(); const cols = ICOL(); for (let i = 0; i < 4; i++) icon(g, (i + Math.floor(t * 2)) % 5, hx + 120 + i * 60, hy - 165, 22, cols[i]); g.restore(); }
    if (p.ghost) { const a = 0.35 * ease.out(prog(t, wt(p.ghost, info), wt(p.ghost, info) + 0.6)); drawFigure(g, { x: dx - V(480, 420), y: GY, s, facing: -1, outfit: { ...WHO[who], color: S().ui.gold }, pose: POSES.phone, expr: 'neutral', alpha: a, prop: 'phone' }); }
    if (p.door) { const dxx = dx - V(900, 700); g.fillStyle = shade(M.wall, -0.75); g.fillRect(dxx - 90, GY - 360, 180, 360); glow(g, dxx, GY - 120, 50, PHONE_GLOW, 0.4 + 0.2 * Math.sin(t * 3)); rr(g, dxx - 20, GY - 130, 40, 12, 3); g.fillStyle = '#0a0a10'; g.fill(); }
  });
  if (p.clock) UI.readout(g, { label: p.clockLabel || null, value: p.clock, x: V(120, 90), y: V(140, 200), a: ease.out(prog(t, 0.2, 0.6)) * outA(t, info) });
  if (p.badge) UI.badge(g, { str: p.badge, a: ease.out(prog(t, wt(p.badgeAt ?? 0.2, info), wt(p.badgeAt ?? 0.2, info) + 0.4)) * outA(t, info) });
  if (p.progress != null) { const k = ease.inOut(prog(t, 0.3, info.dur - 0.3)) * p.progress, x = V(120, 90), y = E.H - V(120, 300), w = V(600, 800); text(g, p.progressLabel || 'PROGRESO', x, y - 40, { size: 30, color: S().ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 }); rr(g, x, y - 12, w, 24, 12); g.fillStyle = alpha(S().ui.cream, 0.12); g.fill(); rr(g, x, y - 12, Math.max(24, w * k), 24, 12); g.fillStyle = S().ui.gold; g.fill(); }
  if (p.meter != null) { const k = lerp(p.meter[0], p.meter[1], ease.inOut(prog(t, 0.4, info.dur - 0.3))), x = V(120, 90), y = E.H - V(120, 300), w = V(600, 800); text(g, p.meterLabel || 'ANSIEDAD', x, y - 40, { size: 30, color: S().ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 }); rr(g, x, y - 12, w, 24, 12); g.fillStyle = alpha(S().ui.cream, 0.12); g.fill(); rr(g, x, y - 12, Math.max(24, w * k), 24, 12); g.fillStyle = S().ui.accent; g.fill(); }
  FX.dust(g, t, { count: 26, color: M0 === 'night' ? '#cfe0ff' : '#ffe8c0', a: 0.25 });
};
// ---------- scientist intro in the lab ----------
T.lab = (g, t, info) => {
  const p = info, cam = pushCam(t, info, { z0: 1.05, z1: 1.12, x0: -20, x1: 20 });
  const { GY, M } = laboratorio(g, t, cam, { mood: p.mood || 'interiorWarm' });
  layer(g, cam, 1, (g) => {
    if (p.monitor) FX.screen(g, { x: E.W / 2 + V(80, -40), y: GY - V(330, 360), w: 260, h: 170, glowC: '#7fd0d6', a: 0.3 }, (g, x, y, w, h) => { for (let i = 0; i < 26; i++) seg(g, [[x + 12 + i * 9, y + h - 20], [x + 12 + i * 9, y + h - 20 - (8 + Math.abs(Math.sin(i * 3.3 + Math.floor(t * 4))) * 26)]], 3, '#7fd0d6'); });
    drawFigure(g, { x: E.W / 2 - V(200, 160), y: GY, s: V(1.45, 1.5), facing: 1, outfit: WHO[p.who], pose: breathe(posesAt(t, p.posesK || [[0, POSES.stand], [0.9, POSES.explain]]), t), expr: p.expr || 'smile', rim: { color: M.rim, dir: [0.4, -1] }, blink: (t % 3.2) > 3.1 });
  });
  const a = ease.out(prog(t, wt(p.nameAt ?? 0.4, info), wt(p.nameAt ?? 0.4, info) + 0.4)) * outA(t, info); const ui = S().ui, x = V(160, 110), y = E.H * V(0.22, 0.16);
  if (a > 0) { g.save(); g.globalAlpha *= a; seg(g, [[x, y - 40], [x, y + 50]], 4, ui.gold); text(g, p.name, x + 24, y - 10, { size: V(46, 48), color: ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 2 }); text(g, p.role, x + 26, y + 34, { size: V(24, 28), color: ui.gold, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 }); g.restore(); }
  FX.dust(g, t, { count: 30 });
};
// ---------- hand + phone insert (grab / twitch / stop) ----------
T.grab = (g, t, info) => {
  const p = info, night = (p.mood || 'night') === 'night';
  blurLayer(g, 16, (g) => dormitorio(g, t, { z: 1.8, x: -250, y: -220 }, { mood: night ? null : p.mood })); veil(g, '#050a10', 0.4);
  const ink = S().ink, s = V(1.5, 1.4), px = E.W * 0.58, py = E.H * 0.7;
  rr(g, -100, py + 40, E.W + 200, 40, 8); g.fillStyle = shade(mood('night').wall, -0.6); g.fill();
  const lit = p.lit === false ? 0 : 1; g.save(); g.translate(px, py); g.rotate(-0.08); rr(g, -120, -16, 240, 56, 14); g.fillStyle = ink; g.fill(); g.fillStyle = alpha(PHONE_GLOW, 0.2 + 0.7 * lit); g.fillRect(-108, -10, 216, 44); g.restore();
  if (lit) glow(g, px, py, 260, PHONE_GLOW, 0.35);
  const mode = p.mode || 'grab', reachT = wt(p.reachAt ?? 0.2, info);
  let k = mode === 'grab' ? ease.inOut(prog(t, reachT, reachT + 0.9)) : mode === 'twitch' ? 0.55 + 0.08 * Math.sin(t * 9) * prog(t, 0.3, 1) : ease.inOut(prog(t, reachT, reachT + 0.9)) * (1 - ease.inOut(prog(t, wt(p.stopAt ?? 1.8, info), wt(p.stopAt ?? 1.8, info) + 0.7)) * 0.6);
  const hx = lerp(E.W * 0.05, px - 40, k), hy = lerp(E.H * 0.35, py - 40, k), rim = night ? PHONE_GLOW : mood('golden').rim;
  seg(g, [[hx - 6, hy + 6], [hx - 520, hy - 240]], 64 * s, rim); seg(g, [[hx, hy], [hx - 520, hy - 240]], 60 * s, ink); seg(g, [[hx - 260, hy - 120], [hx - 640, hy - 300]], 92 * s, WHO.TU.color);
  for (let i = 0; i < 4; i++) { const a = 0.3 + i * 0.28 - (mode === 'grab' ? k * 0.3 : 0); seg(g, [[hx, hy], [hx + Math.cos(a) * 80 * s, hy + Math.sin(a) * 80 * s]], 15 * s, ink); }
  if (mode === 'twitch') FX.rings(g, hx + 40, hy + 20, t, { count: 2, r0: 40, r1: 160, color: S().ui.accent, a: 0.4 });
  if (p.badge) UI.badge(g, { str: p.badge, a: ease.out(prog(t, 0.3, 0.7)) * outA(t, info) });
};
// ---------- phone screen insert ----------
T.screen = (g, t, info) => {
  const p = info, mode = p.mode || 'feed', ui = S().ui;
  blurLayer(g, 18, (g) => dormitorio(g, t, { z: 1.8, x: -200, y: -200 }, { mood: p.mood })); veil(g, '#050a10', 0.45);
  const pw = V(420, 520), phh = pw * 2.0, px = E.W / 2 - pw / 2 + (p.dx || 0), py = E.H / 2 - phh / 2 + 60 - 40 * ease.inOut(t / info.dur);
  glow(g, E.W / 2, E.H / 2, 700, PHONE_GLOW, 0.22);
  rr(g, px - 14, py - 14, pw + 28, phh + 28, 54); g.fillStyle = S().ink; g.fill();
  g.save(); rr(g, px, py, pw, phh, 42); g.clip(); g.fillStyle = '#0d1a24'; g.fillRect(px, py, pw, phh);
  const cx = px + pw / 2, top = py + 80;
  const feed = (speed, offset = 0) => { const scroll = (t * speed + offset) % 260; for (let i = -1; i < 9; i++) { const y = py + i * 260 - scroll + 60; rr(g, px + 24, y, pw - 48, 220, 20); g.fillStyle = alpha(ui.blueprint, 0.12); g.fill(); circle(g, px + 70, y + 46, 22, alpha(ui.cream, 0.3)); rr(g, px + 104, y + 34, pw * 0.45, 20, 10); g.fillStyle = alpha(ui.cream, 0.25); g.fill(); rr(g, px + 44, y + 90, pw - 88, 110, 14); g.fillStyle = alpha([ui.gold, ui.accent, PHONE_GLOW][(i + 30) % 3], 0.25); g.fill(); } };
  if (mode === 'feed') feed(p.speed || 520);
  else if (mode === 'unlock') { const u = ease.inOut(prog(t, wt(p.at ?? 0.3, info), wt(p.at ?? 0.3, info) + 0.5)); g.fillStyle = linGradV(g, py, phh); g.fillRect(px, py, pw, phh); text(g, '9:41', cx, py + phh * 0.25 - u * 400, { size: 90, color: ui.cream, font: FONTS.ui, weight: 800 }); if (u > 0.9) feed(400); text(g, p.q ? '?' : '', cx, py + phh * 0.55, { size: 160, color: ui.gold, font: FONTS.ui, weight: 900, alpha: (1 - u) * (0.6 + 0.4 * Math.sin(t * 4)) }); }
  else if (mode === 'cards') { const keys = p.cards || [[0.1, 0]]; let idx = 0; for (let i = 0; i < keys.length; i++) if (t >= wt(keys[i][0], info) - 0.1) idx = i; const sw = ease.out(prog(t, wt(keys[idx][0], info) - 0.1, wt(keys[idx][0], info) + 0.15)); for (let k = 0; k < 2; k++) { const j = idx - k; if (j < 0) continue; const off = k === 0 ? (1 - sw) * phh : -sw * phh; rr(g, px + 24, py + 60 + off, pw - 48, phh - 120, 26); g.fillStyle = alpha([ui.gold, ui.accent, PHONE_GLOW][j % 3], 0.3); g.fill(); icon(g, 1, cx, py + phh / 2 + off, 60, ui.cream); } text(g, `${idx + 1}`, px + pw - 40, py + 50, { size: 30, color: ui.cream, font: FONTS.ui, weight: 900 }); }
  else if (mode === 'notif') { feed(60); const a = ease.outBack(prog(t, wt(p.at ?? 0.3, info), wt(p.at ?? 0.3, info) + 0.4)); g.save(); g.translate(cx, top + 40 - (1 - a) * 160); rr(g, -pw / 2 + 20, -50, pw - 40, 100, 24); g.fillStyle = alpha(p.alert ? ui.accent : ui.cream, 0.95); g.fill(); icon(g, p.alert ? 4 : 2, -pw / 2 + 80, 0, 30, p.alert ? ui.cream : ui.accent); rr(g, -pw / 2 + 130, -18, pw * 0.5, 14, 7); g.fillStyle = alpha('#000', 0.35); g.fill(); rr(g, -pw / 2 + 130, 8, pw * 0.35, 12, 6); g.fill(); g.restore(); }
  else if (mode === 'empty') { g.fillStyle = alpha(ui.cream, 0.04); g.fillRect(px, py, pw, phh); text(g, '…', cx, py + phh / 2, { size: 120, color: alpha(ui.cream, 0.4), font: FONTS.ui, weight: 900 }); }
  else if (mode === 'pull') { const u = Math.min(1, (t % 1.6) / 0.8), d = ease.out(u) * 160; feed(0, -d); g.save(); g.translate(cx, top + d * 0.5); g.rotate(t * 8); for (let i = 0; i < 10; i++) { g.rotate(Math.PI / 5); circle(g, 0, -30, 6, alpha(ui.cream, 0.2 + i / 12)); } g.restore(); }
  else if (mode === 'autoplay') { rr(g, px + 24, py + 120, pw - 48, phh * 0.45, 20); g.fillStyle = alpha(ui.accent, 0.25); g.fill(); icon(g, 1, cx, py + 120 + phh * 0.22, 60, ui.cream); const n = Math.max(1, 3 - Math.floor(t)); text(g, `SIGUIENTE EN ${n}`, cx, py + phh * 0.7, { size: 34, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2 }); ring(g, cx, py + phh * 0.8, 50, 6, alpha(ui.cream, 0.2)); g.strokeStyle = ui.gold; g.lineWidth = 6; g.beginPath(); g.arc(cx, py + phh * 0.8, 50, -Math.PI / 2, -Math.PI / 2 + (t % 1) * Math.PI * 2); g.stroke(); }
  else if (mode === 'likes') { rr(g, px + 24, py + 120, pw - 48, phh * 0.5, 20); g.fillStyle = alpha(ui.gold, 0.2); g.fill(); const n = Math.floor(lerp(12, 348, ease.in(prog(t, 0.2, info.dur - 0.2)))); icon(g, 0, cx - 70, py + phh * 0.72, 44, ui.accent); text(g, `${n}`, cx + 40, py + phh * 0.72, { size: 64, color: ui.cream, font: FONTS.ui, weight: 900, align: 'left' }); if (Math.floor(t * 6) % 2) FX.sparkle(g, cx - 70, py + phh * 0.65, 18, ui.accent, 0.8); }
  else if (mode === 'slot') { const stop = [0.9, 1.4, 1.9].map((d) => wt(p.at ?? 0.2, info) + d); const syms = ['0', '1', '2', '3', '4']; for (let i = 0; i < 3; i++) { const x = px + pw * (0.2 + i * 0.3), y = py + phh * 0.45; rr(g, x - 50, y - 90, 100, 180, 16); g.fillStyle = alpha(ui.cream, 0.1); g.fill(); const k = t < stop[i] ? Math.floor(t * 14 + i * 3) % 5 : [0, 0, 2][i]; icon(g, k, x, y, 36, ICOL()[k]); } if (t > stop[2]) text(g, 'CASI…', cx, py + phh * 0.7, { size: 48, color: ui.gold, font: FONTS.ui, weight: 900, alpha: clamp((t - stop[2]) * 3) }); }
  else if (mode === 'apps') { const gone = (i) => p.remove?.includes(i) ? ease.in(prog(t, wt(p.at ?? 0.8, info) + i * 0.08, wt(p.at ?? 0.8, info) + 0.4 + i * 0.08)) : 0; for (let i = 0; i < 16; i++) { const x = px + 70 + (i % 4) * (pw - 140) / 3, y = py + 160 + Math.floor(i / 4) * 150, d = gone(i); if (d >= 1) continue; g.save(); g.globalAlpha *= 1 - d; g.translate(x, y + d * 80); g.scale(1 - d * 0.5, 1 - d * 0.5); rr(g, -40, -40, 80, 80, 20); g.fillStyle = alpha(ICOL()[i % 5], p.remove?.includes(i) ? 0.8 : 0.3); g.fill(); g.restore(); } }
  else if (mode === 'logout') { feed(0); g.fillStyle = alpha('#0d1a24', 0.85); g.fillRect(px, py, pw, phh); const a = ease.outBack(prog(t, wt(p.at ?? 0.3, info), wt(p.at ?? 0.3, info) + 0.4)), pr = t > wt(p.at ?? 0.3, info) + 1.0; rr(g, cx - 150, py + phh * 0.45, 300, 90, 45); g.fillStyle = pr ? ui.accent : alpha(ui.accent, 0.6 * a); g.fill(); text(g, 'CERRAR SESIÓN', cx, py + phh * 0.45 + 46, { size: 30, color: '#fff', font: FONTS.ui, weight: 900, alpha: a, spacing: 1 }); }
  else if (mode === 'toggles') { for (let i = 0; i < 7; i++) { const y = py + 140 + i * 120, off = t > wt(p.at ?? 0.3, info) + i * 0.35; rr(g, px + 40, y - 30, pw * 0.45, 22, 11); g.fillStyle = alpha(ui.cream, 0.25); g.fill(); const sx = px + pw - 130; rr(g, sx, y - 36, 90, 50, 25); g.fillStyle = off ? alpha(ui.cream, 0.15) : ui.good; g.fill(); circle(g, sx + (off ? 25 : 65), y - 11, 20, '#fff'); } }
  else if (mode === 'badges') { feed(30); const keys = p.keys || []; keys.forEach(([w, k], i) => { const a = ease.outBack(prog(t, wt(w, info), wt(w, info) + 0.3)); if (a <= 0) return; const x = px + 90 + (i % 3) * 120, y = py + 220 + Math.floor(i / 3) * 160 + i * 40; icon(g, k, x, y, 46 * a, ICOL()[k]); circle(g, x + 34, y - 34, 16 * a, ui.accent); }); }
  g.restore();
  if (p.label) UI.bigLine(g, Math.max(0, t - wt(p.labelAt ?? 0.3, info)), { str: p.label, dur: info.dur - wt(p.labelAt ?? 0.3, info) + 0.4, y: E.H * V(0.1, 0.08), size: V(52, 50) });
};
const linGradV = (g, y, h) => { const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#16324a'); gr.addColorStop(1, '#0b1622'); return gr; };
// ---------- laptop screen insert: tabs ----------
T.laptop = (g, t, info) => {
  const p = info, ui = S().ui;
  blurLayer(g, 18, (g) => dormitorio(g, t, { z: 1.8, x: 200, y: -200 }, { mood: p.mood })); veil(g, '#050a10', 0.45);
  const w = V(1240, 900), h = w * 0.6, x = E.W / 2 - w / 2, y = E.H / 2 - h / 2 + 20 - 20 * ease.inOut(t / info.dur);
  glow(g, E.W / 2, E.H / 2, 800, '#bfe6ff', 0.2); rr(g, x - 20, y - 20, w + 40, h + 40, 24); g.fillStyle = S().ink; g.fill();
  g.fillStyle = '#e9eef4'; g.fillRect(x, y, w, h);
  const keys = p.tabs || [[0, 'DOCUMENTO']]; let n = 0; keys.forEach(([wd], i) => { if (t >= wt(wd, info) - 0.1) n = i + 1; });
  const tw = Math.min(220, (w - 40) / Math.max(1, n)); for (let i = 0; i < n; i++) { const a = ease.out(prog(t, wt(keys[i][0], info) - 0.1, wt(keys[i][0], info) + 0.2)); rr(g, x + 20 + i * tw, y + 14, tw - 8, 40 * a, 10); g.fillStyle = i === n - 1 ? '#ffffff' : '#c9d3de'; g.fill(); text(g, keys[i][1], x + 20 + i * tw + (tw - 8) / 2, y + 36, { size: 18, color: '#334', font: FONTS.ui, weight: 900, alpha: a }); }
  g.fillStyle = '#ffffff'; g.fillRect(x, y + 56, w, h - 56);
  const cur = keys[Math.max(0, n - 1)][2] ?? 0, tint = [ui.blueprint, ui.accent, ui.gold, '#9fd8ff'][cur % 4];
  if (cur === 0) for (let i = 0; i < 10; i++) { rr(g, x + 80, y + 110 + i * 44, (w - 160) * (0.6 + 0.4 * Math.abs(Math.sin(i * 1.7))), 14, 7); g.fillStyle = '#b8c2cc'; g.fill(); }
  else { rr(g, x + 60, y + 100, w - 120, h - 160, 18); g.fillStyle = alpha(tint, 0.35); g.fill(); icon(g, [2, 2, 0, 1][cur % 4], E.W / 2, y + h / 2 + 20, 70, ui.cream); }
  if (p.badge) UI.badge(g, { str: p.badge, a: outA(t, info) });
};
// ---------- outdoor / other people ----------
T.walk = (g, t, info) => {
  const p = info, X = t * 150, cam = { z: 1.05, x: X };
  const { GY, M } = sabana(g, t, cam, { mood: p.mood || 'golden', bigTree: false });
  layer(g, cam, 0.7, (g) => { for (let i = -2; i < 12; i++) { const x = i * 420; FX.tree(g, x, GY, 1.3, shade(M.dark, -0.4)); FX.lampPost(g, x + 210, GY, 300, { light: M.practical, on: false }); } });
  layer(g, cam, 1, (g) => { g.fillStyle = shade(M.road, -0.3); g.fillRect(-E.W, GY, E.W * 4, 30); drawFigure(g, { x: E.W / 2 - 100 + X, y: GY, s: V(1.3, 1.4), facing: 1, outfit: WHO[p.who || 'TU'], pose: walkPose(t * Math.PI * 2 * 0.9), expr: p.expr || 'smile', look: [1, -0.4], rim: { color: M.rim, dir: [1, -0.6], w: 4.5 } }); });
  if (p.notes) for (let i = 0; i < 4; i++) { const ph = (t * 0.5 + i * 0.25) % 1; text(g, '♪', E.W / 2 + 40 + i * 30, E.H * 0.42 - ph * 160, { size: 40, color: S().ui.gold, alpha: 1 - ph }); }
  if (p.badge) UI.badge(g, { str: p.badge, a: ease.out(prog(t, 0.4, 0.8)) * outA(t, info) });
  FX.dust(g, t, { count: 30, color: '#ffe8a8', a: 0.35 });
};
T.queue = (g, t, info) => {
  const cam = pushCam(t, info, { z0: 1.02, z1: 1.08, x0: 40, x1: -20 });
  const { GY, M } = laboratorio(g, t, cam, { mood: 'interiorCool' });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 5; i++) { const x = E.W * 0.18 + i * V(300, 200), me = i === 2; drawFigure(g, { x, y: GY, s: V(1.25, 1.3), facing: 1, outfit: me ? WHO.TU : WHO.TRIBE, pose: breathe(me ? POSES.relaxed : POSES.phone, t, 1, i), prop: me ? null : 'phone', expr: me ? at(t, info, info.ex, 'neutral') : 'neutral', look: me ? [1, -0.2] : [0.5, 0.8], rim: { color: M.rim, dir: [0, -1] } }); if (!me) glow(g, x + 30, GY - 210, 60, PHONE_GLOW, 0.4); } });
  FX.dust(g, t, { count: 24, color: '#cfe8ff' });
};
T.table = (g, t, info) => {
  const p = info, M0 = p.mood || 'interiorWarm', cam = pushCam(t, info, { z0: 1.1, z1: 1.16 });
  const { GY, M } = laboratorio(g, t, cam, { mood: M0 });
  layer(g, cam, 1, (g) => {
    const tx = E.W / 2, top = GY - 150, s = V(1.45, 1.5), c = shade(M.wall, -0.7);
    rr(g, tx - 200, top - 12, 400, 16, 6); g.fillStyle = c; g.fill(); seg(g, [[tx, top], [tx, GY]], 10, c); seg(g, [[tx - 60, GY - 4], [tx + 60, GY - 4]], 8, c);
    if (p.mode === 'eat') { g.fillStyle = '#e8e2d8'; g.beginPath(); g.ellipse(tx - 40, top - 16, 70, 12, 0, 0, 7); g.fill(); circle(g, tx - 40, top - 26, 22, S().ui.gold); rr(g, tx + 80, top - 22, 50, 10, 3); g.fillStyle = '#0a0a10'; g.fill(); }
    else { rr(g, tx - 30, top - 22, 50, 10, 3); g.fillStyle = '#0a0a10'; g.fill(); glow(g, tx - 5, top - 22, 60, PHONE_GLOW, 0.5); }
    for (const [x, f] of [[tx - V(260, 230), 1], [tx + V(260, 230), -1]]) FX.chair(g, x - f * 20, GY, s * 0.9, shade(M.wall, -0.6));
    const meLook = p.mode === 'eat' ? [1, 0.3] : [0.3, 0.9];
    drawFigure(g, { x: tx - V(240, 210), y: GY, s, facing: 1, outfit: WHO.TU, pose: breathe(p.mode === 'eat' ? { ...POSES.sit, eF: [30, -116], hF: [56, -128] } : POSES.sit, t), expr: at(t, info, p.ex, p.mode === 'eat' ? 'smile' : 'sleepy'), look: meLook, rim: { color: M.rim, dir: [0, -1] }, shadow: false });
    if (p.mode !== 'eat' || p.friend) drawFigure(g, { x: tx + V(240, 210), y: GY, s, facing: -1, outfit: WHO.AMIGO, pose: breathe(posesAt(t, [[0, POSES.sit], [0.5, { ...POSES.sit, eF: [24, -132], hF: [44, -150] }]]), t, 1, 3), expr: 'happy', talk: (Math.sin(t * 9) > 0 ? 0.6 : 0.2), rim: { color: M.rim, dir: [0, -1] }, shadow: false });
  });
  FX.dust(g, t, { count: 30 });
};
T.kitchen = (g, t, info) => {
  const p = info, cam = pushCam(t, info, { z0: 1.05, z1: 1.1 });
  const { GY, M } = laboratorio(g, t, cam, { mood: 'interiorWarm' });
  const putT = wt(p.putAt ?? 1.2, info), cx = E.W / 2 + V(80, 0);
  layer(g, cam, 1, (g) => {
    const lit = t < putT + 0.6 ? 1 : 0.3; if (t > putT) { rr(g, cx + 40, GY - 182, 50, 10, 3); g.fillStyle = '#0a0a10'; g.fill(); glow(g, cx + 65, GY - 182, 60, PHONE_GLOW, 0.3 * lit); }
    const leave = ease.inOut(prog(t, putT + 0.6, info.dur)), x = lerp(cx - V(60, 40), cx - V(700, 400), leave);
    drawFigure(g, { x, y: GY, s: V(1.45, 1.5), facing: leave > 0.02 ? -1 : 1, outfit: WHO[p.who || 'LUCIA'], pose: leave > 0.02 ? walkPose(t * Math.PI * 2 * 0.9) : breathe(posesAt(t, [[0, POSES.phone], [putT - 0.3, POSES.reach]]), t), prop: t < putT ? 'phone' : null, expr: leave > 0.02 ? 'determined' : 'neutral', rim: { color: M.rim, dir: [0, -1] } });
  });
  if (p.badge) UI.badge(g, { str: p.badge, a: ease.out(prog(t, 0.3, 0.7)) * outA(t, info) });
  FX.dust(g, t, { count: 30 });
};
// ---------- dawn: TU at the window in the morning ----------
T.dawn = (g, t, info) => {
  const p = info, cam = pushCam(t, info, { z0: p.z0 ?? 1.0, z1: p.z1 ?? 1.08, x0: p.x0 ?? -40, x1: p.x1 ?? 20 });
  const { GY, M } = dormitorio(g, t, cam, { mood: 'golden' });
  layer(g, cam, 1, (g) => {
    if (p.bed) { const top = cama(g, E.W / 2 - V(360, 60), GY, V(620, 560), M); rr(g, E.W / 2 - V(720, 300), GY - 140, 90, 140, 6); g.fillStyle = shade(M.wall, -0.6); g.fill(); rr(g, E.W / 2 - V(700, 290), GY - 152, 50, 10, 3); g.fillStyle = '#0a0a10'; g.fill(); }
    const pose = at(t, info, p.poses, p.pose || 'stand'); const P = pose === 'cup' ? { ...POSES.stand, eF: [20, -146], hF: [30, -170] } : POSES[pose];
    drawFigure(g, { x: E.W / 2 + V(p.fx ?? 220, 60), y: GY, s: V(1.45, 1.5), facing: p.facing ?? 1, outfit: WHO[p.who || 'TU'], pose: breathe(P, t, 1.2), prop: pose === 'cup' ? 'cup' : null, expr: at(t, info, p.ex, p.expr || 'smile'), look: [1, -0.3], rim: { color: M.rim, dir: [1, -0.5], w: 5 } });
  });
  if (p.fog) { const k = ease.inOut(prog(t, 0.2, info.dur)); FX.fog(g, E.H * 0.2, E.H * 0.8, '#e8f0e0', 0.6 * (1 - k)); }
  if (p.badge) UI.badge(g, { str: p.badge, a: ease.out(prog(t, wt(p.badgeAt ?? 0.4, info), wt(p.badgeAt ?? 0.4, info) + 0.4)) * outA(t, info) });
  if (p.strike) p.strike.forEach(([w, str], i) => { const tt = wt(w, info), a = ease.out(prog(t, tt, tt + 0.3)); if (a <= 0) return; const x = V(260, 200), y = E.H * V(0.25, 0.2) + i * 80; text(g, str, x, y, { size: 40, color: S().ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 2, alpha: a * 0.9 }); const k = ease.out(prog(t, tt + 0.25, tt + 0.5)); seg(g, [[x - 10, y], [x - 10 + k * 360, y]], 5, S().ui.accent); });
  FX.dust(g, t, { count: 40, color: '#ffe8c0', a: 0.35 }); FX.lensStreak(g, E.W / 2, E.H * 0.3, E.W * 1.2, '#ffe0b0', 0.12);
};
// ---------- noise swirl around TU (closing) ----------
T.noise = (g, t, info) => {
  const cam = pushCam(t, info, { z0: 1.0, z1: 1.1 });
  const { GY, M } = dormitorio(g, t, cam);
  layer(g, cam, 1, (g) => { const x = E.W / 2; drawFigure(g, { x, y: GY, s: V(1.45, 1.5), facing: 1, outfit: WHO.TU, pose: breathe(POSES.handsOnHead, t), expr: 'worried', rim: { color: PHONE_GLOW, dir: [0, -1] } }); noiseIcons(g, t, x, GY - 220, 520, 24, 1); FX.rings(g, x, GY - 300, t, { count: 4, r0: 120, r1: 600, color: S().ui.accent, a: 0.25 }); });
  FX.dust(g, t, { count: 30, color: '#cfe0ff', a: 0.3 });
};

for (const s of E.shots) if (s.params?.tpl && T[s.params.tpl]) registerShot(s.id, { draw: T[s.params.tpl] });
