// shots/01_sabana.js — the ancestral savanna: title, scarcity, the fruit tree, the news, the search, "te mantenía vivo".
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, wordTime, seg, circle, glow, alpha, shade } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { sabana, sabanaGround, acacia, bush, campfire } from '../sets/sabana.js';
import { scarcity, spark } from '../sets/cerebro.js';
import { ANCESTRO, VECINO, TRIBE } from '../cast.js';

const FRUIT = () => ({ color: S().ui.gold, glow: 1 });
const rimOf = (M, dir = [0.6, -0.8]) => ({ color: M.rim, dir, w: 4.5 });

// s01 — "Parte 1. El cerebro que heredaste."  title card over the savanna
registerShot('s01', { draw(g, t, info) {
  const cam = { z: 1.08 - 0.08 * ease.inOut(t / info.dur), y: -10 * t };
  const { GY, M } = sabana(g, t, cam, { mood: 'dusk', sunX: 0, treeX: E.W / 2 - V(820, 380) });
  layer(g, cam, 1, (g) => { for (const [x, s, sd] of [[-640, 0.8, 1], [-560, 0.7, 2], [620, 0.75, 3]]) drawFigure(g, { x: E.W / 2 + x, y: GY, s, facing: x < 0 ? 1 : -1, outfit: TRIBE, pose: breathe(POSES.stand, t, 1, sd), rim: rimOf(M, [x < 0 ? 1 : -1, -0.5]) }); });
  FX.dust(g, t, { count: 40, color: '#ffe2a0', a: 0.35 });
  UI.titleCard(g, t, { lines: ['PARTE 1', 'EL CEREBRO QUE HEREDASTE'], dur: info.dur, y: E.H * V(0.36, 0.34) });
} });

// s04 — 3D: the tribe around the campfire at dusk
registerShot('s04', { kind: '3d',
  init(T) {
    const M = mood('dusk');
    const st = T.stage({ mood: 'dusk', fov: V(36, 52), fog: [16, 60], keyPos: [10, 4, -12], keyIntensity: 2.2, ambient: 1.0 });
    st.add(T.ground(120, 120, M.floor));
    for (const [x, z, s] of [[-9, -10, 1.6], [12, -14, 1.9], [-20, -22, 2.2], [24, -30, 2.4], [5, -26, 1.5], [-14, 6, 1.2]]) { const tr = T.tree3D(x, z, s, shade(M.dark, -0.2)); tr.scale.y = 0.75; st.add(tr); }
    for (const [x, z, w, h] of [[-30, -40, 40, 6], [10, -46, 50, 8], [40, -38, 30, 5]]) st.add(T.sphere(1, M.dark, x, -h * 0.4, z)).scale.set(w * 0.5, h, 6);
    // fire: logs + glowing core
    for (const a of [0, 1.1, 2.2]) { const l = T.cyl(0.07, 0.07, 0.9, '#1a0f0c', 0, 0.08, 0); l.rotation.z = Math.PI / 2; l.rotation.y = a; st.add(l); }
    const flame = T.cone(0.28, 0.8, T.basic('#ffb04a'), 0, 0.45, 0, 7); st.add(flame);
    const core = T.sphere(0.18, T.basic('#fff0b0'), 0, 0.25, 0); st.add(core);
    const fireLight = new T.THREE.PointLight('#ff9a3a', 30, 12, 1.6); fireLight.position.set(0, 0.8, 0); st.add(fireLight);
    const figs = [];
    [[1.6, 0, POSES.sit], [-1.5, 0.4, POSES.sit], [0.3, -1.6, POSES.sitBack], [-0.6, 1.5, POSES.sit], [1.2, 1.2, POSES.stand]].forEach(([x, z, p], i) => {
      const f = T.figure3D(i === 0 ? ANCESTRO : TRIBE, { rim: M.rim, pose: p }); f.position.set(x, 0, z); f.rotation.y = Math.atan2(x, z) + Math.PI / 2 + Math.PI; st.add(f); figs.push(f);
    });
    return { stage: st, flame, fireLight };
  },
  draw(s, t, info, T) {
    s.flame.scale.y = 1 + Math.sin(t * 9) * 0.15; s.fireLight.intensity = 28 + Math.sin(t * 13) * 5;
    T.orbit(s.stage.camera, t, { target: [0, 0.7, 0], radius: V(6.5, 8.5), height: [2.8, 1.8], from: -0.5, to: 0.5, dur: info.dur });
  },
  overlay(g, t, info) { FX.dust(g, t, { count: 30, color: '#ffc06a', a: 0.3 }); }
});

// s05 — "La comida era escasa."  wide: ancestor at a bare bush
registerShot('s05', { draw(g, t, info) {
  const cam = { z: 1.02 + 0.05 * ease.inOut(t / info.dur), x: 30 - 50 * ease.inOut(t / info.dur) };
  const { GY, M } = sabana(g, t, cam, { mood: 'dusk', bigTree: false });
  layer(g, cam, 1, (g) => {
    bush(g, E.W / 2 + V(140, 120), GY, 1.6, shade(M.dark, -0.35));
    drawFigure(g, { x: E.W / 2 - V(60, 60), y: GY, s: V(1.25, 1.35), facing: 1, outfit: ANCESTRO, pose: breathe(posesAt(t, [[0, POSES.reach], [1.1, POSES.shrug]]), t), expr: t > 1.1 ? 'sad' : 'thinking', rim: rimOf(M, [1, -0.6]) });
  });
  FX.dust(g, t, { count: 30, color: '#ffe2a0', a: 0.3 });
  scarcity(g, t, 'COMIDA', 0.12, { dur: info.dur, start: 0.5 });
} });

// s06 — "La información era escasa."  two-shot by the fire, empty horizon
registerShot('s06', { draw(g, t, info) {
  const cam = { z: 1.06 + 0.04 * ease.inOut(t / info.dur), x: -40 + 40 * ease.inOut(t / info.dur) };
  const { GY, M } = sabana(g, t, cam, { mood: 'night', bigTree: false, fire: [E.W / 2, 0], fireS: 1.2 });
  layer(g, cam, 0.12, (g) => FX.stars(g, t, { count: 90, area: [0, 0, E.W, E.H * 0.45] }));
  layer(g, cam, 1, (g) => {
    const rimL = { color: '#ffb060', dir: [1, -0.2], w: 4.5 }, rimR = { color: '#ffb060', dir: [-1, -0.2], w: 4.5 };
    drawFigure(g, { x: E.W / 2 - V(300, 230), y: GY, s: V(1.3, 1.35), facing: 1, outfit: ANCESTRO, pose: breathe(POSES.sit, t), expr: 'neutral', look: [0.6, -0.2], rim: rimL, blink: (t % 3.1) > 3.0 });
    drawFigure(g, { x: E.W / 2 + V(300, 230), y: GY, s: V(1.3, 1.35), facing: -1, outfit: TRIBE, pose: breathe(POSES.sitBack, t, 1, 2), expr: 'sleepy', rim: rimR });
  });
  scarcity(g, t, 'INFORMACIÓN', 0.08, { dur: info.dur, start: 0.4 });
} });

// s07 — "Las novedades eran escasas."  giant face, bored, the same horizon every day
registerShot('s07', { draw(g, t, info) {
  blurLayer(g, 14, (g) => sabana(g, t, { z: 1.4, x: -200, y: -120 }, { mood: 'dusk', bigTree: false })); veil(g, '#08120c', 0.35);
  const M = mood('dusk'), r = V(300, 330) * (1 + 0.04 * t);
  bigFace(g, E.W / 2 + V(140, 0), E.H * V(0.62, 0.55), r, { outfit: ANCESTRO, expr: t < 0.5 ? 'neutral' : 'sleepy', look: [-0.4, 0], rimColor: M.rim, rimSide: 1, blink: t > 0.9 && t < 1.05 });
  FX.dust(g, t, { count: 20, color: '#ffe2a0', a: 0.25 });
  scarcity(g, t, 'NOVEDADES', 0.05, { dur: info.dur, start: 0.4, tag: 'ESCASAS' });
} });

// s08 — "Encontrar un árbol con fruta madura era un evento."  discovery
registerShot('s08', { draw(g, t, info) {
  const g0 = info.shot.start, tF = (wordTime('fruta', g0) ?? g0 + 1.5) - g0, tE = (wordTime('evento', g0) ?? g0 + 2.7) - g0;
  const cam = { z: 1.0 + 0.1 * ease.inOut(t / info.dur), x: -60 * ease.inOut(t / info.dur) };
  const fa = ease.out(prog(t, tF - 0.3, tF + 0.4));
  const { GY, M } = sabana(g, t, cam, { mood: 'golden', treeX: E.W / 2 - V(260, 120), fruit: { color: S().ui.gold, a: fa, glow: 1 + 0.3 * Math.sin(t * 4) } });
  layer(g, cam, 1, (g) => {
    const walkIn = ease.out(prog(t, 0, 1.0)), x = lerp(E.W / 2 + V(520, 300), E.W / 2 + V(240, 160), walkIn);
    const pose = t < 1.0 ? walkPose(t * Math.PI * 2 * 0.9) : posesAt(t, [[1.0, POSES.stand], [tE - 0.2, POSES.cheer]]);
    drawFigure(g, { x, y: GY, s: V(1.3, 1.35), facing: -1, outfit: ANCESTRO, pose: breathe(pose, t), expr: t < tF ? 'neutral' : t < tE ? 'surprised' : 'joy', look: [-0.5, -0.7], rim: rimOf(M, [-0.4, -1]) });
  });
  if (t > tE - 0.2) for (let i = 0; i < 6; i++) FX.sparkle(g, E.W / 2 + V(-460, -260) + i * 90, E.H * V(0.42, 0.42) - (i % 2) * 50, 14 + 8 * Math.sin(t * 6 + i), '#fff3c0', 0.8 * clamp((t - tE + 0.2) * 3));
  FX.dust(g, t, { count: 40, color: '#ffe8a8', a: 0.35 });
} });

// s09 — "Escuchar una noticia del grupo vecino, también."  the messenger arrives
registerShot('s09', { draw(g, t, info) {
  const cam = { z: 1.04, x: lerp(40, -40, ease.inOut(t / info.dur)) };
  const { GY, M } = sabana(g, t, cam, { mood: 'dusk', bigTree: false, sunX: V(-300, 0) });
  layer(g, cam, 1, (g) => {
    const run = prog(t, 0, 1.2), x = lerp(E.W + 120, E.W / 2 + V(260, 170), ease.out(run));
    const vp = run < 1 ? walkPose(t * Math.PI * 2 * 1.6, { run: true }) : posesAt(t, [[1.2, POSES.explain], [2.0, POSES.point]]);
    drawFigure(g, { x, y: GY, s: V(1.25, 1.3), facing: -1, outfit: VECINO, pose: breathe(vp, t), expr: run < 1 ? 'determined' : 'happy', rim: rimOf(M, [-1, -0.4]) });
    for (const [dx, o, p, d] of [[-V(280, 220), ANCESTRO, POSES.stand, 0], [-V(450, 360), TRIBE, POSES.relaxed, 2]]) {
      const turned = t > 0.6; drawFigure(g, { x: E.W / 2 + dx, y: GY, s: V(1.25, 1.3), facing: turned ? 1 : -1, outfit: o, pose: breathe(turned ? (o === ANCESTRO ? POSES.handsOnHead : POSES.stand) : p, t, 1, d), expr: turned ? 'surprised' : 'neutral', rim: rimOf(M, [-1, -0.4]) });
    }
    if (t > 1.3) FX.rings(g, E.W / 2 + V(250, 160), GY - 230, t - 1.3, { count: 3, r0: 30, r1: 150, color: '#fff1e6', a: 0.5 });
  });
  FX.dust(g, t, { count: 30, color: '#ffe2a0', a: 0.3 });
} });

// s10 — "Y para que no dejaras de buscar esas cosas,"  tracking the search
registerShot('s10', { draw(g, t, info) {
  const X = t * 130; const cam = { z: 1.05, x: X };
  const { GY, M } = sabana(g, t, cam, { mood: 'dusk', treeX: E.W / 2 + 900 });
  layer(g, cam, 1, (g) => {
    const x = E.W / 2 - V(80, 40) + X, scan = t > 1.8;
    drawFigure(g, { x, y: GY, s: V(1.2, 1.3), facing: 1, outfit: ANCESTRO, pose: scan ? breathe(POSES.think, t) : walkPose(t * Math.PI * 2 * 0.9), expr: 'thinking', look: scan ? [1, -0.3] : [1, 0], rim: rimOf(M, [1, -0.5]) });
  });
  blurLayer(g, 10, (g) => { for (const x of [-200, 500, 1300, 2100]) for (let i = 0; i < 9; i++) seg(g, [[x + i * 16, E.H + 40], [x + i * 22 - 30, E.H - 160 - (i % 3) * 40]], 8, '#05100a'); }, cam, 1.7);
  FX.dust(g, t, { count: 30, color: '#ffe2a0', a: 0.3 });
} });

// s19 — "Al deseo."  insert: hand reaching for the glowing fruit
registerShot('s19', { draw(g, t, info) {
  blurLayer(g, 16, (g) => sabana(g, t, { z: 1.8, x: -300, y: -260 }, { mood: 'golden', bigTree: false })); veil(g, '#08120c', 0.3);
  const ink = S().ink, rim = mood('golden').rim, s = V(1.4, 1.3), reach = ease.inOut(prog(t, 0, info.dur));
  const fx = E.W * V(0.62, 0.55), fy = E.H * V(0.3, 0.3);
  acacia(g, fx + 120, fy + 250, 1.2, ink, null);
  glow(g, fx, fy, 160, S().ui.gold, 0.6 + 0.2 * Math.sin(t * 5)); circle(g, fx, fy, 34, S().ui.gold); circle(g, fx - 10, fy - 10, 10, '#fffbe0');
  const hx = lerp(E.W * 0.2, fx - 110, reach), hy = lerp(E.H * 0.95, fy + 70, reach);
  seg(g, [[hx - 6, hy + 6], [hx - 400, hy + 420]], 64 * s, rim); seg(g, [[hx, hy], [hx - 400, hy + 420]], 60 * s, ink);
  for (let i = 0; i < 4; i++) { const a = -1.1 + i * 0.28; seg(g, [[hx, hy], [hx + Math.cos(a) * 80 * s, hy + Math.sin(a) * 80 * s]], 15 * s, ink); }
  FX.dust(g, t, { count: 24, color: '#ffe8a8', a: 0.35 });
} });

// s32 — "Y eso, en la sabana, te mantenía vivo."  the reward, golden hour
registerShot('s32', { draw(g, t, info) {
  const cam = { z: 1.1 - 0.08 * ease.inOut(t / info.dur), y: 10 * t };
  const { GY, M } = sabana(g, t, cam, { mood: 'golden', treeX: E.W / 2 - V(120, 60), fruit: { color: S().ui.gold, a: 1 } });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W / 2 + V(80, 60), y: GY, s: V(1.3, 1.35), facing: 1, outfit: ANCESTRO, pose: breathe(posesAt(t, [[0, POSES.sit], [1.6, { ...POSES.sit, eF: [24, -150], hF: [30, -176] }]]), t), expr: t > 1.6 ? 'happy' : 'smile', rim: rimOf(M, [1, -0.6]) });
    drawFigure(g, { x: E.W / 2 + V(330, 230), y: GY, s: V(0.95, 1.0), facing: -1, outfit: { ...TRIBE, kid: true }, pose: breathe(POSES.sit, t, 1, 4), expr: 'joy', rim: rimOf(M, [1, -0.6]) });
    if (t > 1.6) { circle(g, E.W / 2 + V(80, 60) + 30 * 1.3, GY - 176 * 1.3, 12, S().ui.gold); }
  });
  FX.dust(g, t, { count: 40, color: '#ffe8a8', a: 0.4 }); FX.lensStreak(g, E.W / 2, E.H * 0.35, E.W * 1.2, '#ffe0a0', 0.15);
} });
