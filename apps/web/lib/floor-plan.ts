/**
 * Procedural site-plan generator for the project film's "concept" scene.
 *
 * Each project gets its own deterministic plan (seeded by its id) whose
 * layout depends on the house type, number of floors and features:
 * townhouse row, U/L-shaped villa with courtyard pool, seaside resort villa,
 * L-shaped garden house among trees, or a single-storey bungalow.
 * All coordinates are on a 1600 × 900 canvas.
 */

export const PLAN_W = 1600
export const PLAN_H = 900

export type Rect = { x: number; y: number; w: number; h: number }
export type RoomRole =
  | "living"
  | "kitchen"
  | "bed"
  | "bath"
  | "garage"
  | "stair"
  | "terrace"
export type Room = Rect & { role: RoomRole }
export type Tree = { x: number; y: number; r: number; palm: boolean }
export type EdgeLabel = {
  x: number
  y: number
  rotate: number
  key: "street" | "sidewalk" | "sea" | "garden"
}

export type Plan = {
  site: Rect
  street: Rect
  sidewalk: Rect
  sea: Rect | null
  neighbours: Rect[]
  lawn: Rect[]
  paving: Rect[]
  pools: Rect[]
  wings: Rect[]
  rooms: Room[]
  trees: Tree[]
  labels: EdgeLabel[]
}

type Input = {
  id: string
  categoryId: string
  tagIds: string[]
  floors: number
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function seeded(id: string) {
  let h = 1779033703 ^ id.length
  for (let i = 0; i < id.length; i++) {
    h = Math.imul(h ^ id.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  // mulberry32
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const round = (r: Rect): Rect => ({
  x: Math.round(r.x),
  y: Math.round(r.y),
  w: Math.round(r.w),
  h: Math.round(r.h),
})

const inflate = (r: Rect, d: number): Rect => ({
  x: r.x - d,
  y: r.y - d,
  w: r.w + 2 * d,
  h: r.h + 2 * d,
})

const overlaps = (a: Rect, b: Rect) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y

/** Binary space partition of a wing into rooms. */
function partition(r: Rect, rand: () => number, min: number, depth: number): Rect[] {
  const vertical = r.w >= r.h // cut across the longer side
  const len = vertical ? r.w : r.h
  if (depth <= 0 || len < min * 2) return [r]
  const cut = Math.round(len * (0.36 + rand() * 0.28))
  const [a, b]: [Rect, Rect] = vertical
    ? [
        { x: r.x, y: r.y, w: cut, h: r.h },
        { x: r.x + cut, y: r.y, w: r.w - cut, h: r.h },
      ]
    : [
        { x: r.x, y: r.y, w: r.w, h: cut },
        { x: r.x, y: r.y + cut, w: r.w, h: r.h - cut },
      ]
  // Leave some larger rooms un-split for a more natural plan
  const stop = () => rand() < 0.25
  return [
    ...(stop() ? [a] : partition(a, rand, min, depth - 1)),
    ...(stop() ? [b] : partition(b, rand, min, depth - 1)),
  ]
}

function assignRoles(
  rects: Rect[],
  opts: { floors: number; garageNear?: number }
): Room[] {
  const rooms: Room[] = rects.map((r) => ({ ...r, role: "bed" as RoomRole }))
  const byArea = [...rooms].sort((a, b) => b.w * b.h - a.w * a.h)
  const n = byArea.length
  if (n === 0) return rooms
  byArea[0]!.role = "living"
  if (n >= 3) byArea[1]!.role = "kitchen"
  if (n >= 2) byArea[n - 1]!.role = "bath"
  if (n >= 7) byArea[n - 2]!.role = "bath"

  if (opts.floors > 1 && n >= 4) {
    // most square of the remaining mid/small rooms becomes the stair core
    const candidates = byArea.slice(2, n - 1).filter((r) => r.role === "bed")
    const stair = candidates.sort(
      (a, b) =>
        Math.abs(a.w - a.h) / Math.max(a.w, a.h) -
        Math.abs(b.w - b.h) / Math.max(b.w, b.h)
    )[candidates.length > 2 ? 1 : 0]
    if (stair) stair.role = "stair"
  }

  if (opts.garageNear !== undefined) {
    const free = rooms.filter((r) => r.role === "bed")
    const garage = free.sort(
      (a, b) =>
        Math.abs(a.y + a.h - opts.garageNear!) -
        Math.abs(b.y + b.h - opts.garageNear!)
    )[0]
    if (garage && free.length > 1) garage.role = "garage"
  }
  return rooms
}

function placeTrees(
  rand: () => number,
  count: number,
  palm: boolean,
  area: Rect,
  obstacles: Rect[]
): Tree[] {
  const trees: Tree[] = []
  for (let tries = 0; trees.length < count && tries < count * 60; tries++) {
    const r = (palm ? 16 : 19) + rand() * 9
    const t: Tree = {
      x: area.x + r + rand() * (area.w - 2 * r),
      y: area.y + r + rand() * (area.h - 2 * r),
      r,
      palm,
    }
    const box = { x: t.x - r, y: t.y - r, w: 2 * r, h: 2 * r }
    if (obstacles.some((o) => overlaps(inflate(o, 8), box))) continue
    if (trees.some((o) => Math.hypot(o.x - t.x, o.y - t.y) < o.r + r + 6)) continue
    trees.push({ ...t, x: Math.round(t.x), y: Math.round(t.y), r: Math.round(r) })
  }
  return trees
}

function mirrorPlan(p: Plan): Plan {
  const m = (r: Rect): Rect => ({ ...r, x: PLAN_W - r.x - r.w })
  return {
    ...p,
    site: m(p.site),
    neighbours: p.neighbours.map(m),
    lawn: p.lawn.map(m),
    paving: p.paving.map(m),
    pools: p.pools.map(m),
    wings: p.wings.map(m),
    rooms: p.rooms.map((r) => ({ ...m(r), role: r.role })),
    trees: p.trees.map((t) => ({ ...t, x: PLAN_W - t.x })),
    labels: p.labels.map((l) =>
      l.rotate !== 0 ? { ...l, x: PLAN_W - l.x, rotate: -l.rotate } : l
    ),
  }
}

/* ------------------------------------------------------------------ */
/* Templates                                                           */
/* ------------------------------------------------------------------ */

const STREET: Rect = { x: 0, y: 790, w: PLAN_W, h: 110 }
const SIDEWALK: Rect = { x: 0, y: 762, w: PLAN_W, h: 28 }
const streetLabels: EdgeLabel[] = [
  { x: 800, y: 852, rotate: 0, key: "street" },
  { x: 1320, y: 780, rotate: 0, key: "sidewalk" },
]

export function buildFloorPlan(input: Input): Plan {
  const rand = seeded(input.id)
  const j = (v: number, amt: number) => v + (rand() * 2 - 1) * amt
  const has = (tag: string) => input.tagIds.includes(tag)
  const floors = Math.max(1, input.floors)

  const base = {
    street: STREET,
    sidewalk: SIDEWALK,
    sea: null as Rect | null,
    neighbours: [] as Rect[],
    labels: [...streetLabels],
  }

  let plan: Plan

  switch (input.categoryId) {
    /* Row of narrow lots, ours highlighted in the middle */
    case "townhouse": {
      const plotW = Math.round(j(175, 15))
      const plotD = 610
      const count = 5
      const x0 = 800 - (count / 2) * plotW
      const y0 = 140
      const plots = Array.from({ length: count }, (_, i) => ({
        x: x0 + i * plotW,
        y: y0,
        w: plotW,
        h: plotD,
      }))
      const site = plots[2]!
      const front = Math.round(j(80, 15))
      const back = Math.round(j(70, 15))
      const wing = round({
        x: site.x + 10,
        y: site.y + back,
        w: site.w - 20,
        h: site.h - back - front,
      })
      const rooms = assignRoles(partition(wing, rand, 62, 4), {
        floors,
        garageNear: wing.y + wing.h,
      })
      plan = {
        ...base,
        site,
        neighbours: plots.filter((_, i) => i !== 2).map((p) => inflate(p, -8)),
        lawn: [{ x: site.x + 6, y: site.y + 6, w: site.w - 12, h: back - 12 }],
        paving: [{ x: site.x + 6, y: wing.y + wing.h + 6, w: site.w - 12, h: front - 12 }],
        pools: [],
        wings: [wing],
        rooms,
        trees: placeTrees(rand, 2, false, { x: site.x + 6, y: site.y + 6, w: site.w - 12, h: back - 12 }, []),
      }
      break
    }

    /* Seaside resort villa: sea at the top, pool deck, palms */
    case "resortVilla": {
      const sea = has("seaside") ? { x: 0, y: 0, w: PLAN_W, h: 150 } : null
      const site = { x: 250, y: sea ? 175 : 90, w: 1100, h: sea ? 565 : 650 }
      const bar = round({ x: j(380, 30), y: j(540, 15), w: j(840, 40), h: j(185, 15) })
      const wings = [bar]
      if (rand() < 0.55) {
        const left = rand() < 0.5
        wings.push(
          round({
            x: left ? bar.x : bar.x + bar.w - 180,
            y: bar.y - j(120, 15),
            w: 180,
            h: bar.y - (bar.y - 120),
          })
        )
        wings[1]!.h = bar.y - wings[1]!.y
      }
      const pool = round({ x: bar.x + j(120, 30), y: site.y + j(130, 20), w: bar.w - j(300, 40), h: j(115, 15) })
      const deck = inflate(pool, 38)
      const rects = wings.flatMap((w, i) => partition(w, rand, 72, i === 0 ? 4 : 2))
      plan = {
        ...base,
        sea,
        site,
        lawn: [inflate(site, -8)],
        paving: [deck, round({ x: bar.x + 40, y: bar.y + bar.h, w: 110, h: site.y + site.h - bar.y - bar.h })],
        pools: [pool],
        wings,
        rooms: assignRoles(rects, { floors, garageNear: bar.y + bar.h }),
        trees: [],
        labels: sea ? [...base.labels, { x: 800, y: 84, rotate: 0, key: "sea" }] : base.labels,
      }
      plan.trees = placeTrees(rand, 18, true, inflate(site, -10), [...wings, deck, plan.paving[1]!])
      break
    }

    /* L-shaped house in a large garden with many trees */
    case "garden": {
      const site = { x: 240, y: 70, w: 1120, h: 680 }
      const a = round({ x: j(540, 40), y: j(250, 25), w: j(430, 40), h: j(190, 20) })
      const bw = Math.round(j(175, 20))
      const b = round({ x: a.x + a.w - bw, y: a.y + a.h, w: bw, h: j(165, 20) })
      const terrace = round({ x: a.x - j(130, 15), y: a.y + j(35, 10), w: 130, h: j(125, 15) })
      const path = round({ x: b.x + 45, y: b.y + b.h, w: 62, h: site.y + site.h - b.y - b.h })
      const pond = has("pool") || rand() < 0.6
        ? [round({ x: a.x + j(-160, 20), y: b.y + j(80, 20), w: j(180, 20), h: j(95, 10) })]
        : []
      plan = {
        ...base,
        site,
        lawn: [inflate(site, -8)],
        paving: [terrace, path],
        pools: pond,
        wings: [a, b],
        rooms: assignRoles([...partition(a, rand, 72, 3), ...partition(b, rand, 68, 2)], {
          floors,
          garageNear: b.y + b.h,
        }),
        trees: [],
        labels: [...base.labels, { x: site.x + 28, y: site.y + site.h / 2, rotate: -90, key: "garden" }],
      }
      plan.trees = placeTrees(rand, 24, false, inflate(site, -12), [a, b, terrace, path, ...pond.map((p) => inflate(p, 6))])
      break
    }

    /* Single-storey bungalow with front porch (+ pool if tagged) */
    case "bungalow": {
      const site = { x: 320, y: 110, w: 960, h: 640 }
      const house = round({ x: j(430, 30), y: j(230, 25), w: j(660, 50), h: j(215, 20) })
      const porch = round({ x: house.x + 60, y: house.y + house.h, w: house.w - 120, h: 52 })
      const pools = has("pool")
        ? [round({ x: house.x + house.w - j(330, 30), y: porch.y + porch.h + j(60, 10), w: j(290, 25), h: j(105, 10) })]
        : []
      const drive = round({ x: house.x + 30, y: porch.y + porch.h, w: 96, h: site.y + site.h - porch.y - porch.h })
      plan = {
        ...base,
        site,
        lawn: [inflate(site, -8)],
        paving: [porch, drive, ...pools.map((p) => inflate(p, 26))],
        pools,
        wings: [house],
        rooms: assignRoles(partition(house, rand, 76, 4), { floors: 1 }),
        trees: [],
      }
      plan.trees = placeTrees(rand, 11, has("seaside"), inflate(site, -12), [house, porch, drive, ...pools.map((p) => inflate(p, 26))])
      break
    }

    /* Villa: U- or L-shaped with a courtyard pool and driveway */
    default: {
      const site = { x: 290, y: 80, w: 1020, h: 670 }
      const depth = Math.round(j(410, 35))
      const wingW = Math.round(j(255, 25))
      const coreD = Math.round(j(205, 25))
      const left = round({ x: site.x + 60, y: site.y + 55, w: wingW, h: depth })
      const uShape = rand() < 0.6
      const right = round({ x: site.x + site.w - 60 - wingW, y: site.y + 55, w: wingW, h: depth })
      const centre = round({
        x: left.x + left.w,
        y: left.y,
        w: (uShape ? right.x : site.x + site.w - 60) - (left.x + left.w),
        h: coreD,
      })
      const wings = uShape ? [left, centre, right] : [left, centre]
      const courtH = depth - coreD
      const pools = has("pool") || rand() < 0.4
        ? [round({ x: centre.x + 45, y: centre.y + coreD + 45, w: centre.w - 90, h: Math.max(80, Math.min(130, courtH - 60)) })]
        : []
      const drive = round({ x: left.x + 45, y: left.y + depth, w: 104, h: site.y + site.h - left.y - depth })
      const rects = wings.flatMap((w) => partition(w, rand, 72, 3))
      plan = {
        ...base,
        site,
        lawn: [inflate(site, -8)],
        paving: [drive, ...pools.map((p) => inflate(p, 24))],
        pools,
        wings,
        rooms: assignRoles(rects, { floors, garageNear: left.y + depth }),
        trees: [],
      }
      plan.trees = placeTrees(rand, 13, has("seaside"), inflate(site, -12), [...wings, drive, ...pools.map((p) => inflate(p, 24))])
    }
  }

  return input.categoryId !== "townhouse" && rand() < 0.5 ? mirrorPlan(plan) : plan
}
