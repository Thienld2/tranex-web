/**
 * Parametric BIM-style house model, rendered by
 * components/projects/house-model-3d.tsx.
 *
 * A house is described by a {@link HouseSpec} (see lib/house-specs.ts — one
 * per project, matched to the project photo): a set of rectangular blocks
 * (storeys, cladding, facade pattern, roof), plus terraces, canopies, rails,
 * louvres, pool, trees… `buildHouse` turns it into a flat list of elements:
 * an RC frame (footings, columns, beams, slabs) on a structural grid,
 * architecture (walls with openings, windows, doors, roofs) and exposed MEP
 * water piping.
 *
 * Units: metres. Axes: X = width (grid 1, 2, 3…), Z = depth (grid A, B, C…,
 * the front of the house faces +Z), Y = up. Finished floor level ±0.000,
 * natural ground −0.450. The data is pure (no three.js).
 */
import type { Locale } from "@/lib/i18n/types"

export type Layer = "arch" | "struct" | "mep"
export type V3 = [number, number, number]
export type V2 = [number, number]
export type MatKey =
  | "concrete"
  | "roofSlab"
  | "roofWhite"
  | "roofDark"
  | "footing"
  | "lean"
  | "white"
  | "beige"
  | "stone"
  | "wood"
  | "darkWood"
  | "timber"
  | "dark"
  | "panel"
  | "sage"
  | "siding"
  | "frame"
  | "glass"
  | "doorWood"
  | "steelDoor"
  | "garage"
  | "floorTile"
  | "counter"
  | "paving"
  | "deck"
  | "water"
  | "roofTile"
  | "terracotta"
  | "metalRoof"
  | "soffitWood"
  | "soffitWhite"
  | "screen"
  | "railMetal"
  | "pipeCold"
  | "pipeHot"
  | "pipeDrain"
  | "pipeRain"
  | "pipePool"
  | "steel"
  | "inox"
  | "ceramic"
  | "pit"
  | "solar"
  | "trunk"
  | "leaves"

export type Info = {
  name: string
  size: string
  material: string
  spec?: string
  location?: string
}

type Base = { id: string; layer: Layer; info: Info }
export type Opening = { a: number; b: number; bottom: number; top: number }

export type El =
  | (Base & { kind: "box"; mat: MatKey; center: V3; size: V3; rotation?: V3 })
  | (Base & {
      kind: "wall"
      mat: MatKey
      axis: "x" | "z"
      /** Start of the wall centre line, at its bottom. */
      origin: V3
      length: number
      height: number
      thickness: number
      openings: Opening[]
      /** Extra height above `height` at points along the wall (gables, sloped tops). */
      top?: V2[]
    })
  | (Base & { kind: "cyl"; mat: MatKey; center: V3; radius: number; height: number })
  | (Base & { kind: "pipe"; mat: MatKey; points: V3[]; radius: number })
  | (Base & {
      kind: "window"
      axis: "x" | "z"
      center: V3
      width: number
      height: number
    })
  | (Base & {
      kind: "door"
      axis: "x" | "z"
      center: V3
      width: number
      height: number
      leaves: 1 | 2
      style: "glass" | "wood" | "steel" | "garage"
    })
  | (Base & {
      kind: "roof"
      mat: MatKey
      shape: "gable" | "hip" | "shed"
      /** Wall lines the roof sits on (eaves are `overhang` further out). */
      x: V2
      z: V2
      /** Eave level at the wall line. */
      y: number
      rise: number
      overhang: number
      ridge: "x" | "z"
      up: Side
    })
  | (Base & {
      kind: "tree"
      /** Base of the trunk. */
      center: V3
      height: number
      radius: number
      form: "round" | "pine"
    })

export type HouseModel = {
  els: El[]
  grid: { xs: number[]; zs: number[]; xNames: string[]; zNames: string[] }
  /** The house itself (blocks + canopies). */
  house: { min: V3; max: V3 }
  /** Everything incl. pool, terraces and trees' trunks. */
  site: { min: V3; max: V3 }
}

export const GROUND_LEVEL = -0.45

/* ------------------------------------------------------------------ */
/* Spec                                                                */
/* ------------------------------------------------------------------ */

export type Side = "front" | "back" | "left" | "right"
const SIDES: Side[] = ["front", "back", "left", "right"]
type PerSide<T> = Partial<Record<Side, T>>

export type Clad =
  | "white"
  | "beige"
  | "stone"
  | "wood"
  | "darkWood"
  | "timber"
  | "dark"
  | "panel"
  | "sage"
  | "siding"

/** Window pattern of one wall. */
export type Facade = "glass" | "ribbon" | "punched" | "tall" | "slits" | "small" | "blank"

export type RoofSpec =
  | {
      type: "flat"
      overhang?: number | PerSide<number>
      /** Default: parapet, or none when the slab overhangs. */
      edge?: "parapet" | "glassRail" | "none"
      mat?: "concrete" | "white" | "dark"
      soffit?: "wood" | "white"
    }
  | {
      type: "gable" | "hip"
      /** Ridge direction; default the longer side. */
      ridge?: "x" | "z"
      rise: number
      overhang?: number
      mat?: "tile" | "terracotta" | "metal"
    }
  | {
      type: "shed"
      /** The high side. */
      up: Side
      rise: number
      overhang?: number
      mat?: "tile" | "terracotta" | "metal"
    }

export type BlockSpec = {
  x: V2
  z: V2
  /** First storey (0 = ground). */
  from?: number
  floors: number
  clad: Clad
  /** One pattern for all sides, or per side (an array = per storey). */
  facade?: Facade | PerSide<Facade | Facade[]>
  roof?: RoofSpec
  /** Columns continue down to the ground where nothing is below. */
  pilotis?: boolean
}

export type HouseSpec = {
  /** Floor-to-floor height. */
  storey?: number
  blocks: BlockSpec[]
  doors?: {
    block: number
    side: Side
    /** Centre, along the wall (absolute x or z). */
    pos: number
    width: number
    kind: "wood" | "glass" | "garage" | "steel"
    storey?: number
  }[]
  canopies?: {
    x: V2
    z: V2
    /** Top of the slab. */
    top: number
    thick?: number
    mat?: "concrete" | "white" | "dark" | "panel"
    soffit?: "wood" | "white"
    posts?: V2[]
    postBase?: number
    postMat?: "concrete" | "white" | "dark"
    kind?: "canopy" | "balcony" | "pergola" | "veranda"
  }[]
  posts?: { at: V2; top: number; mat?: "concrete" | "white" | "dark" }[]
  rails?: { from: V2; to: V2; y: number; kind: "glass" | "metal" }[]
  fins?: {
    /** Direction the facade runs in. */
    axis: "x" | "z"
    line: number
    range: V2
    y: V2
    pitch: number
    /** Blade width along the facade. */
    size: number
    /** Blade depth, perpendicular to the facade. */
    depth: number
    mat: "timber" | "white" | "dark"
    kind: "louver" | "screen"
  }[]
  pool?: { x: V2; z: V2; depth?: number }
  jacuzzi?: { x: number; z: number; r: number }
  decks?: { x: V2; z: V2; mat: "wood" | "stone" }[]
  trees?: { x: number; z: number; h: number; r: number; form?: "round" | "pine" }[]
  chimney?: { x: number; z: number; w: number; top: number }
  solar?: { block: number }
  /** Straight-flight stair, stacked on every storey of the blocks it sits in. */
  stair?: { x: number; z: number; axis: "x" | "z"; width?: number }
  /** Wet core (WC stack + riser) on the back wall of `block`, at `x`. */
  core: { block: number; x: number }
  /** Kitchen counter on the same back wall, ground floor. */
  kitchen?: { x: V2 }
}

/* ------------------------------------------------------------------ */
/* UI text                                                             */
/* ------------------------------------------------------------------ */

export function modelText(locale: Locale, name: string) {
  const ja = locale === "ja"
  return {
    title: ja ? `3Dモデル：${name}` : `Mô hình 3D – ${name}`,
    panelTitle: ja ? "表示レイヤー" : "Lớp hiển thị",
    panelToggle: ja ? "コントロールパネル" : "Bảng điều khiển",
    showPanel: ja ? "コントロールパネルを表示" : "Hiện bảng điều khiển",
    hidePanel: ja ? "コントロールパネルを隠す" : "Ẩn bảng điều khiển",
    layers: {
      arch: ja ? "意匠（建築）" : "Kiến trúc",
      struct: ja ? "構造" : "Kết cấu",
      mep: ja ? "設備（MEP）" : "MEP – Kỹ thuật",
    } satisfies Record<Layer, string>,
    xray: ja ? "壁・屋根を透過表示" : "Nhìn xuyên tường & mái",
    reset: ja ? "視点をリセット" : "Đặt lại góc nhìn",
    hint: ja
      ? "ドラッグで回転・ホイールでズーム・右ドラッグで移動・部材をクリックで詳細"
      : "Kéo chuột để xoay · Cuộn để phóng to · Chuột phải để di chuyển · Nhấp vào cấu kiện để xem chi tiết",
    empty: ja ? "部材をクリックすると詳細が表示されます" : "Nhấp vào một cấu kiện để xem thông tin",
    loading: ja ? "3Dモデルを読み込み中…" : "Đang tải mô hình 3D…",
    error: ja
      ? "お使いのブラウザでは3D表示（WebGL）がサポートされていません。"
      : "Trình duyệt của bạn không hỗ trợ hiển thị 3D (WebGL).",
    close: ja ? "閉じる" : "Đóng",
    fields: {
      layer: ja ? "レイヤー" : "Lớp",
      size: ja ? "寸法" : "Kích thước",
      material: ja ? "材料" : "Vật liệu",
      spec: ja ? "仕様" : "Thông số",
      location: ja ? "位置" : "Vị trí",
    },
    canvasLabel: ja
      ? `${name}のインタラクティブ3Dモデル`
      : `Mô hình 3D tương tác của công trình ${name}`,
  }
}

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */

const EPS = 1e-6
const COL = 0.22
const BEAM_W = 0.22
const BEAM_D = 0.35
const SLAB = 0.12
const EXT_WALL = 0.2
const MAX_BAY = 4.5

type Rect = { x0: number; x1: number; z0: number; z1: number }

function subtractRect(a: Rect, b: Rect): Rect[] {
  const ix0 = Math.max(a.x0, b.x0)
  const ix1 = Math.min(a.x1, b.x1)
  const iz0 = Math.max(a.z0, b.z0)
  const iz1 = Math.min(a.z1, b.z1)
  if (ix1 - ix0 <= EPS || iz1 - iz0 <= EPS) return [a]
  const out: Rect[] = []
  if (iz0 - a.z0 > EPS) out.push({ x0: a.x0, x1: a.x1, z0: a.z0, z1: iz0 })
  if (a.z1 - iz1 > EPS) out.push({ x0: a.x0, x1: a.x1, z0: iz1, z1: a.z1 })
  if (ix0 - a.x0 > EPS) out.push({ x0: a.x0, x1: ix0, z0: iz0, z1: iz1 })
  if (a.x1 - ix1 > EPS) out.push({ x0: ix1, x1: a.x1, z0: iz0, z1: iz1 })
  return out
}
const subtractAll = (rects: Rect[], cuts: Rect[]) =>
  cuts
    .reduce((acc, c) => acc.flatMap((r) => subtractRect(r, c)), rects)
    .filter((r) => r.x1 - r.x0 > 0.05 && r.z1 - r.z0 > 0.05)

function subtractIntervals(a: number, b: number, cuts: V2[]): V2[] {
  let segs: V2[] = [[a, b]]
  for (const [c0, c1] of cuts)
    segs = segs.flatMap(([s0, s1]): V2[] => {
      if (c1 <= s0 + EPS || c0 >= s1 - EPS) return [[s0, s1]]
      const out: V2[] = []
      if (c0 - s0 > EPS) out.push([s0, c0])
      if (s1 - c1 > EPS) out.push([c1, s1])
      return out
    })
  return segs.filter(([s0, s1]) => s1 - s0 > 0.05)
}

const round3 = (v: number) => Math.round(v * 1000) / 1000

/** Sorted unique grid lines, with long spans subdivided. */
function gridLines(values: number[]): number[] {
  const u = [...new Set(values.map(round3))].sort((a, b) => a - b)
  const out: number[] = []
  u.forEach((v, i) => {
    out.push(v)
    const next = u[i + 1]
    if (next === undefined) return
    const n = Math.ceil((next - v) / MAX_BAY - EPS)
    for (let k = 1; k < n; k++) out.push(round3(v + ((next - v) * k) / n))
  })
  return out
}

/* ------------------------------------------------------------------ */
/* Model                                                               */
/* ------------------------------------------------------------------ */

type DistOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never
type NewEl = DistOmit<El, "id">

type Block = Rect & {
  i: number
  from: number
  top: number
  clad: Clad
  facade: BlockSpec["facade"]
  roof: RoofSpec
  pilotis: boolean
}

export function buildHouse(locale: Locale, spec: HouseSpec): HouseModel {
  const ja = locale === "ja"
  const t = (vi: string, jp: string) => (ja ? jp : vi)
  const nf = (v: number, digits = 0) =>
    v.toLocaleString(ja ? "ja-JP" : "vi-VN", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
  const mm = (...v: number[]) => `${v.map((x) => nf(Math.round(x * 1000))).join(" × ")} mm`
  const m = (v: number) => `${nf(v, 2)} m`
  const floorName = (k: number) => t(`Tầng ${k + 1}`, `${k + 1}階`)
  const H = spec.storey ?? 3.3

  const els: El[] = []
  let seq = 0
  const add = (e: NewEl) => {
    els.push({ ...e, id: `el-${seq++}` } as El)
  }

  const blocks: Block[] = spec.blocks.map((b, i) => ({
    i,
    x0: b.x[0],
    x1: b.x[1],
    z0: b.z[0],
    z1: b.z[1],
    from: b.from ?? 0,
    top: (b.from ?? 0) + b.floors,
    clad: b.clad,
    facade: b.facade,
    roof: b.roof ?? { type: "flat" },
    pilotis: !!b.pilotis,
  }))
  const occupies = (b: Block, k: number) => b.from <= k && k < b.top
  const contains = (b: Rect, x: number, z: number) =>
    x >= b.x0 - EPS && x <= b.x1 + EPS && z >= b.z0 - EPS && z <= b.z1 + EPS
  const maxTop = Math.max(...blocks.map((b) => b.top))

  /* ---------------- Grid ---------------- */

  const xs = gridLines(blocks.flatMap((b) => [b.x0, b.x1]))
  const zs = gridLines(blocks.flatMap((b) => [b.z0, b.z1]))
  const xNames = xs.map((_, i) => String(i + 1))
  const zNames = zs.map((_, j) => String.fromCharCode(65 + j))
  const nearest = (arr: number[], v: number) =>
    arr.reduce((best, x, i) => (Math.abs(x - v) < Math.abs(arr[best]! - v) ? i : best), 0)
  const xn = (x: number) => xNames[nearest(xs, x)]!
  const zn = (z: number) => zNames[nearest(zs, z)]!
  const within = (arr: number[], a: number, b: number) => arr.filter((v) => v >= a - EPS && v <= b + EPS)
  const axis = (s: string) => `${t("Trục", "通り")} ${s}`
  const at = (x: number, z: number) => axis(`${zn(z)}-${xn(x)}`)
  const lineLoc = (ax: "x" | "z", line: number, a: number, b: number) =>
    ax === "x" ? axis(`${zn(line)}, ${xn(a)}–${xn(b)}`) : axis(`${xn(line)}, ${zn(a)}–${zn(b)}`)

  const CONCRETE = t("Bê tông B25 (M350), thép CB400-V", "コンクリート Fc24／鉄筋 SD345")

  /* ---------------- Stair (needed for slab voids) ---------------- */

  const stair = spec.stair
  let stairVoid: Rect | null = null
  let stairTop = 0
  let stairRisers = 0
  if (stair) {
    stairRisers = Math.ceil(H / 0.18 - EPS)
    const len = stairRisers * 0.26
    const w = stair.width ?? 1.1
    stairVoid =
      stair.axis === "x"
        ? { x0: stair.x, x1: stair.x + len, z0: stair.z, z1: stair.z + w }
        : { x0: stair.x, x1: stair.x + w, z0: stair.z, z1: stair.z + len }
    stairTop = Math.max(
      0,
      ...blocks.filter((b) => contains(b, stair.x + 0.05, stair.z + 0.05)).map((b) => b.top)
    )
  }
  const voidAt = (level: number) => (stairVoid && level >= 1 && level < stairTop ? [stairVoid] : [])

  /* ---------------- Structure: columns + footings ---------------- */

  const colKeys = new Set<string>()
  const footKeys = new Set<string>()
  for (const b of blocks) {
    for (const x of within(xs, b.x0, b.x1))
      for (const z of within(zs, b.z0, b.z1))
        for (let k = 0; k < b.top; k++) {
          if (k < b.from && !b.pilotis && !blocks.some((c) => occupies(c, k) && contains(c, x, z)))
            continue
          const key = `${x}|${z}|${k}`
          if (colKeys.has(key)) continue
          colKeys.add(key)
          const h = H - SLAB
          add({
            kind: "box",
            layer: "struct",
            mat: "concrete",
            center: [x, k * H + h / 2, z],
            size: [COL, h, COL],
            info: {
              name: t("Cột C1", "柱 C1"),
              size: mm(COL, COL, h),
              material: CONCRETE,
              spec: t(
                "Thép dọc 8Ø18, đai Ø8a150 (a100 tại hai đầu cột)",
                "主筋 8-D19／帯筋 D10@150（柱頭・柱脚 @100）"
              ),
              location: `${at(x, z)} · ${floorName(k)}`,
            },
          })
          if (k === 0 && !footKeys.has(`${x}|${z}`)) {
            footKeys.add(`${x}|${z}`)
            const loc = at(x, z)
            add({
              kind: "box",
              layer: "struct",
              mat: "lean",
              center: [x, -1.65, z],
              size: [1.6, 0.1, 1.6],
              info: {
                name: t("Bê tông lót móng", "捨てコンクリート"),
                size: mm(1.6, 1.6, 0.1),
                material: t("Bê tông B7.5 (M100), đá 4×6", "コンクリート Fc12（捨てコン）"),
                location: loc,
              },
            })
            add({
              kind: "box",
              layer: "struct",
              mat: "footing",
              center: [x, -1.375, z],
              size: [1.4, 0.45, 1.4],
              info: {
                name: t("Móng đơn M1", "独立基礎 F1"),
                size: mm(1.4, 1.4, 0.45),
                material: CONCRETE,
                spec: t(
                  "Lưới thép đáy Ø14a150 hai phương, đáy móng −1.600",
                  "下端筋 D13@150 両方向／基礎底 −1,600"
                ),
                location: loc,
              },
            })
            add({
              kind: "box",
              layer: "struct",
              mat: "concrete",
              center: [x, -0.6, z],
              size: [COL + 0.03, 1.1, COL + 0.03],
              info: {
                name: t("Cổ móng CM1", "基礎柱 FC1"),
                size: mm(COL + 0.03, COL + 0.03, 1.1),
                material: CONCRETE,
                spec: t("Thép dọc 8Ø18, đai Ø8a150", "主筋 8-D19／帯筋 D10@150"),
                location: loc,
              },
            })
          }
        }
  }

  /* ---------------- Structure: beams ---------------- */

  const beamKeys = new Set<string>()
  const beam = (level: number, ax: "x" | "z", line: number, a: number, b: number) => {
    const key = `${level}|${ax}|${round3(line)}|${round3(a)}|${round3(b)}`
    if (beamKeys.has(key)) return
    beamKeys.add(key)
    const ground = level === 0
    const w = ground ? 0.22 : BEAM_W
    const h = ground ? 0.3 : BEAM_D
    const y = ground ? -0.155 : level * H - h / 2
    const len = b - a - COL
    const mid = (a + b) / 2
    add({
      kind: "box",
      layer: "struct",
      mat: "concrete",
      center: ax === "x" ? [mid, y, line] : [line, y, mid],
      size: ax === "x" ? [len, h, w] : [w, h, len],
      info: {
        name: ground ? t("Giằng móng GM1", "地中梁 FG1") : t(`Dầm sàn D${level}`, `大梁 G${level}`),
        size: `${mm(w, h)} – L = ${m(len)}`,
        material: CONCRETE,
        spec: ground
          ? t("Thép dọc 4Ø16, đai Ø6a200", "主筋 4-D16／あばら筋 D10@200")
          : t("Thép dọc 3Ø20 (trên) + 3Ø18 (dưới), đai Ø8a150", "上端 3-D22・下端 3-D19／あばら筋 D10@150"),
        location: `${lineLoc(ax, line, a, b)} · ${ground ? t("Cốt móng", "基礎") : t(`Cao độ +${nf(level * H, 3)}`, `+${nf(level * H, 3)}`)}`,
      },
    })
  }
  for (const b of blocks) {
    const bx = within(xs, b.x0, b.x1)
    const bz = within(zs, b.z0, b.z1)
    const levels: number[] = []
    if (b.from === 0) levels.push(0)
    else levels.push(b.from)
    for (let L = b.from + 1; L <= b.top; L++) levels.push(L)
    for (const L of levels) {
      for (const z of bz) bx.slice(0, -1).forEach((x, i) => beam(L, "x", z, x, bx[i + 1]!))
      for (const x of bx) bz.slice(0, -1).forEach((z, j) => beam(L, "z", x, z, bz[j + 1]!))
    }
  }

  /* ---------------- Structure: slabs ---------------- */

  const rectOf = (b: Block): Rect => ({ x0: b.x0, x1: b.x1, z0: b.z0, z1: b.z1 })
  const overhangOf = (b: Block): Record<Side, number> => {
    const r = b.roof
    if (r.type !== "flat") {
      const o = r.overhang ?? 0.6
      return { front: o, back: o, left: o, right: o }
    }
    const o = r.overhang ?? 0
    if (typeof o === "number") return { front: o, back: o, left: o, right: o }
    return { front: o.front ?? 0, back: o.back ?? 0, left: o.left ?? 0, right: o.right ?? 0 }
  }
  const expand = (r: Rect, o: Record<Side, number>): Rect => ({
    x0: r.x0 - o.left,
    x1: r.x1 + o.right,
    z0: r.z0 - o.back,
    z1: r.z1 + o.front,
  })
  const slabBox = (r: Rect, yTop: number, mat: MatKey, name: string, specTxt: string, loc: string) =>
    add({
      kind: "box",
      layer: "struct",
      mat,
      center: [(r.x0 + r.x1) / 2, yTop - SLAB / 2, (r.z0 + r.z1) / 2],
      size: [r.x1 - r.x0, SLAB, r.z1 - r.z0],
      info: {
        name,
        size: `${mm(r.x1 - r.x0, r.z1 - r.z0)} – ${t("dày", "厚さ")} ${nf(SLAB * 1000)} mm`,
        material: CONCRETE,
        spec: specTxt,
        location: loc,
      },
    })
  const SLAB_SPEC = t("Thép Ø10a200 hai lớp hai phương", "上下 D10@200 ダブル配筋")
  const ROOF_SPEC = t(
    "Thép Ø10a200 hai lớp; chống thấm màng khò nóng 2 lớp, dốc 2% về phễu thu",
    "上下 D10@200 ダブル配筋／改質アスファルト防水 2層・勾配 2%"
  )

  for (const b of blocks.filter((b) => b.from === 0))
    add({
      kind: "box",
      layer: "struct",
      mat: "concrete",
      center: [(b.x0 + b.x1) / 2, -0.05, (b.z0 + b.z1) / 2],
      size: [b.x1 - b.x0, 0.1, b.z1 - b.z0],
      info: {
        name: t("Sàn nền", "土間スラブ"),
        size: `${mm(b.x1 - b.x0, b.z1 - b.z0)} – ${t("dày", "厚さ")} 100 mm`,
        material: t("Bê tông B20 (M250) trên nền cát đầm chặt K95", "コンクリート Fc21／砂地業 転圧"),
        spec: t("Lưới thép Ø6a200", "ワイヤーメッシュ φ6@200"),
        location: lineLoc("x", b.z1, b.x0, b.x1),
      },
    })

  for (let L = 1; L <= maxTop; L++) {
    const ceiling = blocks.filter((b) => b.from < L && L <= b.top)
    const ceilingRects = ceiling.map(rectOf)
    const loc = t(`Cao độ đỉnh sàn +${nf(L * H, 3)}`, `スラブ天端 +${nf(L * H, 3)}`)
    for (const b of ceiling) {
      const isRoof = L === b.top
      const others = ceiling.filter((c) => c !== b).map(rectOf)
      if (!isRoof) {
        for (const r of subtractAll([rectOf(b)], voidAt(L)))
          slabBox(r, L * H, "concrete", t(`Sàn tầng ${L + 1}`, `${L + 1}階床スラブ`), SLAB_SPEC, loc)
        continue
      }
      const flat = b.roof.type === "flat"
      const o = overhangOf(b)
      const full = flat ? expand(rectOf(b), o) : rectOf(b)
      const mat: MatKey =
        b.roof.type === "flat" && b.roof.mat === "white"
          ? "roofWhite"
          : b.roof.type === "flat" && b.roof.mat === "dark"
            ? "roofDark"
            : "roofSlab"
      for (const r of subtractAll([full], others))
        slabBox(
          r,
          L * H,
          mat,
          flat ? t("Sàn mái", "屋根スラブ") : t("Sàn áp mái", "小屋裏床スラブ"),
          flat ? ROOF_SPEC : SLAB_SPEC,
          loc
        )
      if (b.roof.type === "flat" && b.roof.soffit) {
        const soffit = subtractAll([full], [rectOf(b), ...others])
        for (const r of soffit)
          add({
            kind: "box",
            layer: "arch",
            mat: b.roof.soffit === "wood" ? "soffitWood" : "soffitWhite",
            center: [(r.x0 + r.x1) / 2, L * H - SLAB - 0.015, (r.z0 + r.z1) / 2],
            size: [r.x1 - r.x0, 0.03, r.z1 - r.z0],
            info: {
              name: t("Trần mái đua", "軒天"),
              size: mm(r.x1 - r.x0, r.z1 - r.z0),
              material:
                b.roof.soffit === "wood"
                  ? t("Ốp gỗ tự nhiên thanh nan, dầu lau chống UV", "天然木ルーバー張り／UVオイル仕上げ")
                  : t("Trần thạch cao chịu nước, sơn trắng", "耐水石膏ボード／白色塗装"),
              location: loc,
            },
          })
      }
    }
    for (const b of blocks.filter((b) => b.from === L))
      for (const r of subtractAll([rectOf(b)], [...ceilingRects, ...voidAt(L)]))
        slabBox(r, L * H, "concrete", t(`Sàn tầng ${L + 1}`, `${L + 1}階床スラブ`), SLAB_SPEC, loc)
  }

  /* ---------------- Stair ---------------- */

  if (stair && stairVoid) {
    const riser = H / stairRisers
    const w = stair.width ?? 1.1
    for (let k = 0; k <= stairTop - 2; k++) {
      const info: Info = {
        name: t("Cầu thang bộ", "階段"),
        size: t(
          `Rộng ${nf(w * 1000)} mm – ${stairRisers} bậc, cao ${nf(riser * 1000)} mm, rộng 260 mm`,
          `幅 ${nf(w * 1000)} mm – ${stairRisers}段・蹴上げ ${nf(riser * 1000)} mm・踏面 260 mm`
        ),
        material: t("Bản thang BTCT, mặt bậc ốp gỗ sồi", "RC階段／オーク材段板"),
        location: `${floorName(k)} → ${floorName(k + 1)}`,
      }
      for (let i = 0; i < stairRisers; i++) {
        const s = i * 0.26 + 0.13
        const y = k * H + (i + 1) * riser - 0.09
        add({
          kind: "box",
          layer: "struct",
          mat: "concrete",
          center:
            stair.axis === "x"
              ? [stair.x + s, y, stair.z + w / 2]
              : [stair.x + w / 2, y, stair.z + s],
          size: stair.axis === "x" ? [0.28, 0.18, w] : [w, 0.18, 0.28],
          info,
        })
      }
    }
  }

  /* ---------------- Architecture: walls, windows, doors ---------------- */

  const CLAD: Record<Clad, { mat: MatKey; text: string }> = {
    white: { mat: "white", text: t("Tường gạch trát vữa, sơn nước ngoại thất màu trắng", "レンガ壁・モルタル塗り／白色外装塗装") },
    beige: { mat: "beige", text: t("Tường gạch, ốp đá travertine màu kem", "レンガ壁／トラバーチン張り") },
    stone: { mat: "stone", text: t("Tường gạch, ốp đá tự nhiên chẻ mặt", "レンガ壁／割肌天然石張り") },
    wood: { mat: "wood", text: t("Tường gạch, ốp gỗ tự nhiên thanh ngang", "レンガ壁／天然木 横張り") },
    darkWood: { mat: "darkWood", text: t("Tường gạch, ốp gỗ thanh dọc màu nâu sẫm", "レンガ壁／木製縦張り（ダークブラウン）") },
    timber: { mat: "timber", text: t("Khung thép, ốp gỗ thông xử lý nhiệt thanh dọc", "鉄骨下地／熱処理パイン材 縦張り") },
    dark: { mat: "dark", text: t("Tường gạch, ốp tấm nhôm composite màu đen", "レンガ壁／アルミ複合板（黒）") },
    panel: { mat: "panel", text: t("Tường gạch, ốp tấm xi măng sợi màu xám", "レンガ壁／繊維セメント板（グレー）") },
    sage: { mat: "sage", text: t("Tường gạch trát vữa, sơn màu xanh xám", "レンガ壁・モルタル塗り／グレーグリーン塗装") },
    siding: { mat: "siding", text: t("Tường gạch, ốp ván xi măng giả gỗ sơn trắng", "レンガ壁／窯業系サイディング（白）") },
  }

  type SideGeo = { ax: "x" | "z"; line: number; a: number; b: number; out: 1 | -1 }
  const sideGeo = (b: Rect, s: Side): SideGeo => {
    switch (s) {
      case "front":
        return { ax: "x", line: b.z1, a: b.x0, b: b.x1, out: 1 }
      case "back":
        return { ax: "x", line: b.z0, a: b.x0, b: b.x1, out: -1 }
      case "right":
        return { ax: "z", line: b.x1, a: b.z0, b: b.z1, out: 1 }
      case "left":
        return { ax: "z", line: b.x0, a: b.z0, b: b.z1, out: -1 }
    }
  }
  /** Intervals of the line covered by blocks just beside it (on `dir`) at storey k. */
  const coverBeside = (g: SideGeo, dir: 1 | -1, k: number): V2[] => {
    const p = g.line + dir * 0.01
    return blocks
      .filter((c) => occupies(c, k))
      .flatMap((c): V2[] => {
        const [lo, hi, a0, a1] = g.ax === "x" ? [c.z0, c.z1, c.x0, c.x1] : [c.x0, c.x1, c.z0, c.z1]
        return p > lo && p < hi ? [[a0, a1]] : []
      })
  }
  const exposed = (b: Block, s: Side, k: number, insideToo: boolean) => {
    const g = sideGeo(b, s)
    return subtractIntervals(g.a, g.b, [
      ...coverBeside(g, g.out, k),
      ...(insideToo ? coverBeside(g, (-g.out) as 1 | -1, k) : []),
    ])
  }
  const facadeOf = (b: Block, s: Side, k: number): Facade => {
    const f = b.facade
    if (!f) return "punched"
    if (typeof f === "string") return f
    const v = f[s] ?? "punched"
    if (typeof v === "string") return v
    return v[k - b.from] ?? v[v.length - 1] ?? "punched"
  }
  const roofExtra = (b: Block, x: number, z: number) => {
    const r = b.roof
    if (r.type === "flat") return 0
    if (r.type !== "shed") {
      if (r.type === "hip") return 0
      const ridge = r.ridge ?? (b.x1 - b.x0 >= b.z1 - b.z0 ? "x" : "z")
      return ridge === "x"
        ? r.rise * Math.max(0, 1 - Math.abs(z - (b.z0 + b.z1) / 2) / ((b.z1 - b.z0) / 2))
        : r.rise * Math.max(0, 1 - Math.abs(x - (b.x0 + b.x1) / 2) / ((b.x1 - b.x0) / 2))
    }
    const f =
      r.up === "front"
        ? (z - b.z0) / (b.z1 - b.z0)
        : r.up === "back"
          ? (b.z1 - z) / (b.z1 - b.z0)
          : r.up === "right"
            ? (x - b.x0) / (b.x1 - b.x0)
            : (b.x1 - x) / (b.x1 - b.x0)
    return r.rise * Math.min(1, Math.max(0, f))
  }

  const openingsFor = (f: Facade, L: number, h: number): Opening[] => {
    if (L < 1.2 || f === "blank") return []
    const clampTop = (v: number) => Math.min(v, h - 0.2)
    const spread = (n: number, w: number, bottom: number, top: number): Opening[] =>
      Array.from({ length: n }, (_, i) => {
        const c = (L / n) * (i + 0.5)
        return { a: c - w / 2, b: c + w / 2, bottom, top: clampTop(top) }
      })
    switch (f) {
      case "glass":
        return [{ a: 0.2, b: L - 0.2, bottom: 0.02, top: h - 0.3 }]
      case "ribbon":
        return [{ a: 0.45, b: L - 0.45, bottom: 0.9, top: h - 0.45 }]
      case "punched": {
        const n = Math.max(1, Math.round(L / 3.6))
        const w = Math.min(1.8, L / n - 1.0)
        return w < 0.6 ? [] : spread(n, w, 0.9, 2.4)
      }
      case "tall": {
        const n = Math.max(1, Math.round(L / 2.4))
        const w = Math.min(1.0, L / n - 0.8)
        return w < 0.5 ? [] : spread(n, w, 0.15, h - 0.35)
      }
      case "slits": {
        const pitch = 0.8
        const n = Math.max(1, Math.floor((L - 0.4) / pitch))
        const start = (L - (n - 1) * pitch) / 2
        return Array.from({ length: n }, (_, i) => ({
          a: start + i * pitch - 0.16,
          b: start + i * pitch + 0.16,
          bottom: 0.25,
          top: h - 0.3,
        }))
      }
      case "small": {
        const n = Math.max(1, Math.round(L / 3))
        return spread(n, 0.6, 1.5, 2.1)
      }
    }
  }

  const WIN_TEXT: Record<Exclude<Facade, "blank">, { vi: string; ja: string; mat: string }> = {
    glass: {
      vi: "Vách kính – cửa trượt",
      ja: "ガラスカーテンウォール・引戸",
      mat: t("Khung nhôm hệ sơn tĩnh điện đen, kính hộp Low-E 6+12A+6", "黒色アルミ框／Low-E複層ガラス 6+12A+6"),
    },
    ribbon: {
      vi: "Cửa sổ băng ngang",
      ja: "連窓",
      mat: t("Nhôm hệ Xingfa, kính hộp cách nhiệt", "アルミサッシ／複層ガラス"),
    },
    punched: {
      vi: "Cửa sổ",
      ja: "窓",
      mat: t("Nhôm hệ Xingfa, kính an toàn 6,38 mm", "アルミサッシ／合わせガラス 6.8mm"),
    },
    tall: {
      vi: "Cửa sổ đứng",
      ja: "縦長窓",
      mat: t("Nhôm hệ Xingfa, kính an toàn 8,38 mm", "アルミサッシ／合わせガラス 8.8mm"),
    },
    slits: {
      vi: "Khe cửa sổ hẹp",
      ja: "スリット窓",
      mat: t("Khung nhôm âm tường, kính cố định 8 mm", "アルミ框（埋込）／FIXガラス 8mm"),
    },
    small: {
      vi: "Cửa sổ vuông",
      ja: "小窓",
      mat: t("Nhôm hệ, kính mờ 6,38 mm", "アルミサッシ／型板ガラス 6.8mm"),
    },
  }
  const DOOR_TEXT = {
    wood: [t("Cửa đi chính", "玄関ドア"), t("Gỗ tự nhiên sồi, khóa vân tay", "オーク無垢材／指紋認証錠")],
    glass: [t("Cửa đi kính", "ガラスドア"), t("Nhôm hệ 2 cánh, kính cường lực 10 mm", "アルミ両開き／強化ガラス 10mm")],
    steel: [t("Cửa đi phụ", "勝手口"), t("Cửa thép vân gỗ, khóa tay gạt", "スチールドア（木目調）")],
    garage: [t("Cửa gara", "ガレージシャッター"), t("Cửa cuốn trượt trần, nhôm cách nhiệt, mô-tơ điện", "オーバースライダー／断熱アルミ・電動")],
  } as const

  let winNo = 0
  let doorNo = 0
  for (const b of blocks) {
    const clad = CLAD[b.clad]
    for (let k = b.from; k < b.top; k++) {
      const topStorey = k === b.top - 1
      const pitched = topStorey && b.roof.type !== "flat"
      const h = pitched ? H : H - SLAB
      for (const s of SIDES) {
        const g = sideGeo(b, s)
        const fac = facadeOf(b, s, k)
        for (const [sa, sb] of exposed(b, s, k, false)) {
          const L = sb - sa
          let openings = openingsFor(fac, L, H - SLAB)
          const doors = (spec.doors ?? []).filter(
            (d) => d.block === b.i && d.side === s && (d.storey ?? b.from) === k && d.pos > sa && d.pos < sb
          )
          const doorOps: (Opening & { d: (typeof doors)[number] })[] = []
          for (const d of doors) {
            const da = d.pos - sa - d.width / 2
            const db = d.pos - sa + d.width / 2
            openings = openings.flatMap((o) => {
              if (o.b <= da - 0.2 || o.a >= db + 0.2) return [o]
              return [
                { ...o, b: da - 0.2 },
                { ...o, a: db + 0.2 },
              ].filter((p) => p.b - p.a >= 0.5)
            })
            doorOps.push({ a: da, b: db, bottom: 0.02, top: d.kind === "garage" ? 2.5 : 2.4, d })
          }
          // sloped / gabled top
          let top: V2[] | undefined
          if (pitched) {
            const ts = [0, L]
            const r = b.roof
            if (r.type === "gable") {
              const ridge = r.ridge ?? (b.x1 - b.x0 >= b.z1 - b.z0 ? "x" : "z")
              const mid = ridge === "x" ? (b.z0 + b.z1) / 2 : (b.x0 + b.x1) / 2
              if (g.ax !== ridge && mid > sa && mid < sb) ts.push(mid - sa)
            }
            const pts = ts
              .sort((p, q) => p - q)
              .map((tt): V2 => {
                const pos = sa + tt
                const [x, z] = g.ax === "x" ? [pos, g.line] : [g.line, pos]
                return [tt, roofExtra(b, x, z)]
              })
            if (pts.some(([, e]) => e > 0.01)) top = pts
          }
          const loc = `${lineLoc(g.ax, g.line, sa, sb)} · ${floorName(k)}`
          add({
            kind: "wall",
            layer: "arch",
            mat: clad.mat,
            axis: g.ax,
            origin: g.ax === "x" ? [sa, k * H, g.line] : [g.line, k * H, sa],
            length: L,
            height: h,
            thickness: EXT_WALL,
            openings: [...openings, ...doorOps.map(({ a, b, bottom, top }) => ({ a, b, bottom, top }))],
            top,
            info: {
              name: top ? t("Tường bao – đầu hồi", "外壁（妻壁）") : t("Tường bao", "外壁"),
              size: `${t("Dày", "厚さ")} 200 mm – L = ${m(L)} – H = ${m(h)}`,
              material: clad.text,
              spec: t("Xây gạch không nung, chống thấm mặt ngoài", "ALCブロック積み／外面防水"),
              location: loc,
            },
          })
          const place = (o: Opening): V3 => {
            const c = sa + (o.a + o.b) / 2
            const y = k * H + (o.bottom + o.top) / 2
            return g.ax === "x" ? [c, y, g.line] : [g.line, y, c]
          }
          if (fac !== "blank")
            for (const o of openings) {
              const txt = WIN_TEXT[fac]
              const code = `${fac === "glass" ? "K" : "W"}${++winNo}`
              add({
                kind: "window",
                layer: "arch",
                axis: g.ax,
                center: place(o),
                width: o.b - o.a,
                height: o.top - o.bottom,
                info: {
                  name: `${t(txt.vi, txt.ja)} ${code}`,
                  size: `${mm(o.b - o.a, o.top - o.bottom)} (${t("rộng × cao", "幅 × 高さ")})`,
                  material: txt.mat,
                  spec:
                    o.bottom > 0.1
                      ? t(`Cao bệ cửa ${nf(o.bottom * 1000)} mm`, `窓台高さ ${nf(o.bottom * 1000)} mm`)
                      : undefined,
                  location: loc,
                },
              })
            }
          for (const o of doorOps) {
            const [name, material] = DOOR_TEXT[o.d.kind]
            add({
              kind: "door",
              layer: "arch",
              axis: g.ax,
              center: place(o),
              width: o.b - o.a,
              height: o.top - o.bottom,
              leaves: o.d.kind === "glass" || (o.d.kind === "wood" && o.b - o.a > 1.3) ? 2 : 1,
              style: o.d.kind,
              info: {
                name: `${name} D${++doorNo}`,
                size: `${mm(o.b - o.a, o.top - o.bottom)} (${t("rộng × cao", "幅 × 高さ")})`,
                material,
                location: loc,
              },
            })
          }
        }
      }
    }
  }

  /* ---------------- Rails ---------------- */

  let railNo = 0
  const rail = (from: V2, to: V2, y: number, kind: "glass" | "metal") => {
    const ax: "x" | "z" = Math.abs(to[0] - from[0]) >= Math.abs(to[1] - from[1]) ? "x" : "z"
    const a = ax === "x" ? Math.min(from[0], to[0]) : Math.min(from[1], to[1])
    const b = ax === "x" ? Math.max(from[0], to[0]) : Math.max(from[1], to[1])
    const line = ax === "x" ? from[1] : from[0]
    const L = b - a
    if (L < 0.2) return
    const info: Info = {
      name: `${kind === "glass" ? t("Lan can kính", "ガラス手すり") : t("Lan can", "手すり")} LC${++railNo}`,
      size: `L = ${m(L)} – ${t("cao", "高さ")} 1.100 mm`,
      material:
        kind === "glass"
          ? t("Kính cường lực dán 2 lớp 12,38 mm, tay vịn inox 304", "強化合わせガラス 12.8mm／ステンレス笠木")
          : t("Thép hộp mạ kẽm sơn tĩnh điện, nan đứng a120", "溶融亜鉛めっき鋼／縦格子 @120"),
      location: lineLoc(ax, line, a, b),
    }
    const p = (s: number, yy: number): V3 => (ax === "x" ? [s, yy, line] : [line, yy, s])
    const sz = (len: number, hh: number, d: number): V3 => (ax === "x" ? [len, hh, d] : [d, hh, len])
    const mid = (a + b) / 2
    add({ kind: "box", layer: "arch", mat: "railMetal", center: p(mid, y + 1.08), size: sz(L, 0.05, 0.06), info })
    if (kind === "glass") {
      add({ kind: "box", layer: "arch", mat: "glass", center: p(mid, y + 0.55), size: sz(L - 0.04, 1.0, 0.024), info })
    } else {
      add({ kind: "box", layer: "arch", mat: "railMetal", center: p(mid, y + 0.12), size: sz(L, 0.04, 0.04), info })
      const n = Math.max(1, Math.round(L / 0.12))
      for (let i = 0; i <= n; i++)
        add({
          kind: "box",
          layer: "arch",
          mat: "railMetal",
          center: p(a + (L * i) / n, y + 0.6),
          size: sz(i % 10 === 0 || i === n ? 0.05 : 0.02, 0.96, i % 10 === 0 || i === n ? 0.05 : 0.02),
          info,
        })
    }
  }

  /* ---------------- Roofs: parapets, rails, pitched roofs ---------------- */

  const ROOF_MAT: Record<"tile" | "terracotta" | "metal", { mat: MatKey; text: string }> = {
    tile: { mat: "roofTile", text: t("Ngói phẳng màu xám đen trên xà gồ thép mạ", "平板瓦（黒）／亜鉛めっき鋼母屋") },
    terracotta: { mat: "terracotta", text: t("Ngói đất nung màu đỏ cam trên xà gồ thép mạ", "素焼き瓦（オレンジ）／亜鉛めっき鋼母屋") },
    metal: { mat: "metalRoof", text: t("Tôn cách nhiệt 3 lớp sóng vuông, xà gồ thép mạ", "断熱折板屋根／亜鉛めっき鋼母屋") },
  }
  for (const b of blocks) {
    const roofY = b.top * H
    const r = b.roof
    if (r.type === "flat") {
      const o = overhangOf(b)
      const hasOverhang = SIDES.some((s) => o[s] > 0)
      const edge = r.edge ?? (hasOverhang ? "none" : "parapet")
      if (edge === "none") continue
      for (const s of SIDES) {
        if (edge === "parapet" && o[s] > 0) continue
        const g = sideGeo(b, s)
        for (const [sa, sb] of exposed(b, s, b.top, true)) {
          if (edge === "glassRail") {
            const inset = g.out * 0.05
            rail(
              g.ax === "x" ? [sa, g.line - inset] : [g.line - inset, sa],
              g.ax === "x" ? [sb, g.line - inset] : [g.line - inset, sb],
              roofY,
              "glass"
            )
            continue
          }
          add({
            kind: "wall",
            layer: "arch",
            mat: CLAD[b.clad].mat,
            axis: g.ax,
            origin: g.ax === "x" ? [sa, roofY, g.line] : [g.line, roofY, sa],
            length: sb - sa,
            height: 0.6,
            thickness: 0.15,
            openings: [],
            info: {
              name: t("Tường chắn mái", "パラペット"),
              size: `${t("Dày", "厚さ")} 150 mm – ${t("cao", "高さ")} 600 mm – L = ${m(sb - sa)}`,
              material: CLAD[b.clad].text,
              spec: t("Láng vữa chống thấm, ốp mũ tường", "笠木／モルタル防水"),
              location: lineLoc(g.ax, g.line, sa, sb),
            },
          })
        }
      }
      continue
    }
    const rm = ROOF_MAT[r.mat ?? "tile"]
    const ridge: "x" | "z" =
      r.type === "shed"
        ? r.up === "front" || r.up === "back"
          ? "x"
          : "z"
        : (r.ridge ?? (b.x1 - b.x0 >= b.z1 - b.z0 ? "x" : "z"))
    const o = r.overhang ?? 0.6
    add({
      kind: "roof",
      layer: "arch",
      mat: rm.mat,
      shape: r.type,
      x: [b.x0, b.x1],
      z: [b.z0, b.z1],
      y: roofY + 0.06,
      rise: r.rise,
      overhang: o,
      ridge,
      up: r.type === "shed" ? r.up : "front",
      info: {
        name:
          r.type === "gable"
            ? t("Mái dốc hai mái", "切妻屋根")
            : r.type === "hip"
              ? t("Mái dốc bốn mái", "寄棟屋根")
              : t("Mái dốc một phía", "片流れ屋根"),
        size: t(
          `${mm(b.x1 - b.x0 + 2 * o, b.z1 - b.z0 + 2 * o)} – cao ${nf(r.rise * 1000)} mm`,
          `${mm(b.x1 - b.x0 + 2 * o, b.z1 - b.z0 + 2 * o)} – 高さ ${nf(r.rise * 1000)} mm`
        ),
        material: rm.text,
        spec: t(`Đua mái ${nf(o * 1000)} mm, máng xối inox`, `軒の出 ${nf(o * 1000)} mm／ステンレス軒樋`),
      },
    })
  }

  /* ---------------- Floor finishes ---------------- */

  for (const b of blocks)
    for (let k = b.from; k < b.top; k++) {
      const inner = { x0: b.x0 + 0.1, x1: b.x1 - 0.1, z0: b.z0 + 0.1, z1: b.z1 - 0.1 }
      for (const r of subtractAll([inner], voidAt(k)))
        add({
          kind: "box",
          layer: "arch",
          mat: "floorTile",
          center: [(r.x0 + r.x1) / 2, k * H + 0.006, (r.z0 + r.z1) / 2],
          size: [r.x1 - r.x0, 0.012, r.z1 - r.z0],
          info: {
            name: t(`Lát sàn ${floorName(k).toLowerCase()}`, `${floorName(k)}床仕上げ`),
            size: `${t("Diện tích", "面積")} ${nf((r.x1 - r.x0) * (r.z1 - r.z0), 1)} m²`,
            material: t("Gạch porcelain 800×800, vữa lót M75 dày 30", "磁器質タイル 800角／敷モルタル t=30"),
            location: floorName(k),
          },
        })
    }

  /* ---------------- Canopies, posts, rails, fins ---------------- */

  const SLAB_MAT = { concrete: "concrete", white: "roofWhite", dark: "roofDark", panel: "panel" } as const
  const POST_MAT = { concrete: "concrete", white: "white", dark: "steel" } as const
  const post = (x: number, z: number, y0: number, y1: number, mat: MatKey, loc: string) =>
    add({
      kind: "box",
      layer: "struct",
      mat,
      center: [x, (y0 + y1) / 2, z],
      size: mat === "steel" ? [0.15, y1 - y0, 0.15] : [0.25, y1 - y0, 0.25],
      info: {
        name: mat === "steel" ? t("Cột thép", "鉄骨柱") : t("Cột trang trí BTCT", "RC独立柱"),
        size: `${mat === "steel" ? mm(0.15, 0.15) : mm(0.25, 0.25)} – H = ${m(y1 - y0)}`,
        material:
          mat === "steel"
            ? t("Thép hộp 150×150×6, sơn tĩnh điện đen", "角形鋼管 150×150×6／黒色焼付塗装")
            : CONCRETE,
        location: loc,
      },
    })
  for (const c of spec.canopies ?? []) {
    const th = c.thick ?? 0.15
    const r: Rect = { x0: c.x[0], x1: c.x[1], z0: c.z[0], z1: c.z[1] }
    const name = {
      canopy: t("Mái sảnh", "庇"),
      balcony: t("Ban công", "バルコニー"),
      pergola: t("Khung pergola", "パーゴラ"),
      veranda: t("Hiên – hành lang", "ベランダ"),
    }[c.kind ?? "canopy"]
    const loc = at((r.x0 + r.x1) / 2, (r.z0 + r.z1) / 2)
    add({
      kind: "box",
      layer: "struct",
      mat: SLAB_MAT[c.mat ?? "concrete"],
      center: [(r.x0 + r.x1) / 2, c.top - th / 2, (r.z0 + r.z1) / 2],
      size: [r.x1 - r.x0, th, r.z1 - r.z0],
      info: {
        name,
        size: `${mm(r.x1 - r.x0, r.z1 - r.z0)} – ${t("dày", "厚さ")} ${nf(th * 1000)} mm`,
        material: CONCRETE,
        spec: t(`Cao độ đỉnh +${nf(c.top, 3)}`, `天端 +${nf(c.top, 3)}`),
        location: loc,
      },
    })
    if (c.soffit)
      add({
        kind: "box",
        layer: "arch",
        mat: c.soffit === "wood" ? "soffitWood" : "soffitWhite",
        center: [(r.x0 + r.x1) / 2, c.top - th - 0.015, (r.z0 + r.z1) / 2],
        size: [r.x1 - r.x0, 0.03, r.z1 - r.z0],
        info: {
          name: `${t("Trần", "天井")} – ${name}`,
          size: mm(r.x1 - r.x0, r.z1 - r.z0),
          material:
            c.soffit === "wood"
              ? t("Ốp gỗ tự nhiên thanh nan", "天然木ルーバー張り")
              : t("Trần thạch cao chịu nước, sơn trắng", "耐水石膏ボード／白色塗装"),
          location: loc,
        },
      })
    for (const [x, z] of c.posts ?? [])
      post(x, z, c.postBase ?? 0, c.top - th, POST_MAT[c.postMat ?? "concrete"], at(x, z))
  }
  for (const p of spec.posts ?? []) post(p.at[0], p.at[1], 0, p.top, POST_MAT[p.mat ?? "concrete"], at(...p.at))
  for (const r of spec.rails ?? []) rail(r.from, r.to, r.y, r.kind)

  const FIN_MAT = { timber: "timber", white: "screen", dark: "dark" } as const
  for (const f of spec.fins ?? []) {
    const info: Info =
      f.kind === "screen"
        ? {
            name: t("Tấm lam chắn nắng đục lỗ", "パンチングメタル日除けスクリーン"),
            size: `${t("Tấm", "パネル")} ${mm(f.size, f.y[1] - f.y[0])} – ${t("bước", "ピッチ")} ${nf(f.pitch * 1000)} mm`,
            material: t("Nhôm tấm 3 mm đục lỗ tròn, sơn tĩnh điện trắng", "アルミパンチングパネル t=3／白色焼付塗装"),
            spec: t("Treo trên khung thép, cách mặt kính 450 mm", "鉄骨下地吊り／ガラス面から 450 mm"),
            location: lineLoc(f.axis, f.line, f.range[0], f.range[1]),
          }
        : {
            name: t("Lam chắn nắng đứng", "縦ルーバー"),
            size: `${mm(f.size, f.depth)} – ${t("bước", "ピッチ")} ${nf(f.pitch * 1000)} mm`,
            material:
              f.mat === "timber"
                ? t("Gỗ composite vân gỗ, khung nhôm", "木調アルミ複合ルーバー")
                : t("Nhôm định hình sơn tĩnh điện", "アルミ押出形材／焼付塗装"),
            location: lineLoc(f.axis, f.line, f.range[0], f.range[1]),
          }
    for (let s = f.range[0] + f.size / 2; s <= f.range[1] - f.size / 2 + EPS; s += f.pitch) {
      const y = (f.y[0] + f.y[1]) / 2
      const hh = f.y[1] - f.y[0]
      add({
        kind: "box",
        layer: "arch",
        mat: FIN_MAT[f.mat],
        center: f.axis === "x" ? [s, y, f.line] : [f.line, y, s],
        size: f.axis === "x" ? [f.size, hh, f.depth] : [f.depth, hh, f.size],
        info,
      })
    }
  }

  /* ---------------- Site: pool, decks, trees, chimney ---------------- */

  const poolRect: Rect | null = spec.pool
    ? { x0: spec.pool.x[0], x1: spec.pool.x[1], z0: spec.pool.z[0], z1: spec.pool.z[1] }
    : null
  if (spec.pool && poolRect) {
    const d = spec.pool.depth ?? 1.4
    const W = poolRect.x1 - poolRect.x0
    const D = poolRect.z1 - poolRect.z0
    const cx = (poolRect.x0 + poolRect.x1) / 2
    const cz = (poolRect.z0 + poolRect.z1) / 2
    const shell: Info = {
      name: t("Kết cấu bể bơi", "プール躯体"),
      size: `${mm(W, D)} – ${t("sâu", "深さ")} ${nf(d * 1000)} mm`,
      material: t("BTCT B30 chống thấm W8, thành dày 200", "防水コンクリート Fc30 W8／壁厚 200"),
      spec: t("Chống thấm gốc xi măng 2 thành phần, ốp mosaic thủy tinh", "ポリマーセメント防水／ガラスモザイクタイル"),
    }
    const yb = -d - 0.15
    add({ kind: "box", layer: "struct", mat: "concrete", center: [cx, yb - 0.1, cz], size: [W, 0.2, D], info: shell })
    const wallH = d + 0.1
    const wy = yb + wallH / 2
    add({ kind: "box", layer: "struct", mat: "concrete", center: [cx, wy, poolRect.z0 + 0.1], size: [W, wallH, 0.2], info: shell })
    add({ kind: "box", layer: "struct", mat: "concrete", center: [cx, wy, poolRect.z1 - 0.1], size: [W, wallH, 0.2], info: shell })
    add({ kind: "box", layer: "struct", mat: "concrete", center: [poolRect.x0 + 0.1, wy, cz], size: [0.2, wallH, D - 0.4], info: shell })
    add({ kind: "box", layer: "struct", mat: "concrete", center: [poolRect.x1 - 0.1, wy, cz], size: [0.2, wallH, D - 0.4], info: shell })
    add({
      kind: "box",
      layer: "arch",
      mat: "water",
      center: [cx, (yb - 0.1) / 2, cz],
      size: [W - 0.4, -yb - 0.1, D - 0.4],
      info: {
        name: t("Lòng hồ bơi", "プール水槽"),
        size: `${t("Mặt nước", "水面")} ${nf((W - 0.4) * (D - 0.4), 1)} m² – ${t("thể tích", "容量")} ≈ ${nf((W - 0.4) * (D - 0.4) * d, 0)} m³`,
        material: t("Ốp gạch mosaic thủy tinh xanh ngọc", "ガラスモザイクタイル（ターコイズ）"),
      },
    })
    const coping: Info = {
      name: t("Viền hồ bơi", "プールサイド笠石"),
      size: `${t("Rộng", "幅")} 300 mm`,
      material: t("Đá granite trắng mài mờ, chống trượt", "白御影石 本磨き・ノンスリップ"),
    }
    for (const [ccx, ccz, sx, sz] of [
      [cx, poolRect.z0 - 0.15, W + 0.6, 0.3],
      [cx, poolRect.z1 + 0.15, W + 0.6, 0.3],
      [poolRect.x0 - 0.15, cz, 0.3, D],
      [poolRect.x1 + 0.15, cz, 0.3, D],
    ] as const)
      add({ kind: "box", layer: "arch", mat: "paving", center: [ccx, 0.005, ccz], size: [sx, 0.07, sz], info: coping })
    // filtration
    const fx = poolRect.x1 + 1.2
    const fz = poolRect.z0 + 0.6
    add({
      kind: "box",
      layer: "mep",
      mat: "steel",
      center: [fx, 0.3, fz],
      size: [0.9, 0.6, 0.7],
      info: {
        name: t("Cụm bơm – lọc hồ bơi", "プールろ過ポンプユニット"),
        size: mm(0.9, 0.7, 0.6),
        material: t("Bơm 1,5 HP, bình lọc cát composite Ø600", "ポンプ 1.1kW／砂ろ過器 φ600"),
        spec: t("Tuần hoàn 6 giờ/lần, châm clo tự động", "循環 6時間／自動塩素注入"),
      },
    })
    const pp = (name: string, points: V3[]) =>
      add({
        kind: "pipe",
        layer: "mep",
        mat: "pipePool",
        points,
        radius: 0.035,
        info: {
          name,
          size: "D60",
          material: t("Ống uPVC PN10", "硬質塩ビ管 PN10"),
          spec: t("Chôn ngầm dưới sân", "土中埋設"),
        },
      })
    pp(t("Ống hút hồ bơi (skimmer)", "プール吸込管（スキマー）"), [
      [poolRect.x1 - 0.25, -0.35, fz],
      [fx - 0.3, -0.35, fz],
      [fx - 0.3, 0.15, fz],
    ])
    pp(t("Ống cấp hồi hồ bơi", "プール返送管"), [
      [fx + 0.3, 0.15, fz],
      [fx + 0.3, -0.55, fz],
      [fx + 0.3, -0.55, fz + 1.6],
      [poolRect.x1 - 0.25, -0.55, fz + 1.6],
    ])
  }
  if (spec.jacuzzi) {
    const j = spec.jacuzzi
    add({
      kind: "cyl",
      layer: "arch",
      mat: "paving",
      center: [j.x, 0.2, j.z],
      radius: j.r,
      height: 0.5,
      info: {
        name: t("Bồn sục jacuzzi", "ジャグジー"),
        size: `Ø${nf(j.r * 2000)} mm`,
        material: t("BTCT ốp đá tự nhiên, vòi sục khí", "RC造・天然石張り／ジェットノズル"),
      },
    })
    add({
      kind: "cyl",
      layer: "arch",
      mat: "water",
      center: [j.x, 0.26, j.z],
      radius: j.r - 0.25,
      height: 0.42,
      info: {
        name: t("Bồn sục jacuzzi", "ジャグジー"),
        size: `Ø${nf(j.r * 2000)} mm`,
        material: t("BTCT ốp đá tự nhiên, vòi sục khí", "RC造・天然石張り／ジェットノズル"),
      },
    })
  }
  const groundRects = blocks.filter((b) => b.from === 0).map(rectOf)
  for (const d of spec.decks ?? []) {
    const rects = subtractAll(
      [{ x0: d.x[0], x1: d.x[1], z0: d.z[0], z1: d.z[1] }],
      [...groundRects, ...(poolRect ? [{ x0: poolRect.x0 - 0.3, x1: poolRect.x1 + 0.3, z0: poolRect.z0 - 0.3, z1: poolRect.z1 + 0.3 }] : [])]
    )
    const info: Info =
      d.mat === "wood"
        ? {
            name: t("Sàn gỗ ngoài trời", "ウッドデッキ"),
            size: `${t("Diện tích", "面積")} ${nf((d.x[1] - d.x[0]) * (d.z[1] - d.z[0]), 1)} m²`,
            material: t("Gỗ composite thanh 140×25, khung nhôm", "樹脂木デッキ材 140×25／アルミ根太"),
          }
        : {
            name: t("Sân lát đá", "石張りテラス"),
            size: `${t("Diện tích", "面積")} ${nf((d.x[1] - d.x[0]) * (d.z[1] - d.z[0]), 1)} m²`,
            material: t("Đá granite 600×600 dày 30, nền bê tông", "御影石 600角 t=30／土間コンクリート"),
          }
    for (const r of rects)
      add({
        kind: "box",
        layer: "arch",
        mat: d.mat === "wood" ? "deck" : "paving",
        center: [(r.x0 + r.x1) / 2, (GROUND_LEVEL - 0.03) / 2, (r.z0 + r.z1) / 2],
        size: [r.x1 - r.x0, -GROUND_LEVEL - 0.03, r.z1 - r.z0],
        info,
      })
  }
  for (const tr of spec.trees ?? [])
    add({
      kind: "tree",
      layer: "arch",
      center: [tr.x, GROUND_LEVEL, tr.z],
      height: tr.h,
      radius: tr.r,
      form: tr.form ?? "round",
      info: {
        name: tr.form === "pine" ? t("Cây thông", "松") : t("Cây cổ thụ hiện hữu", "既存の大樹"),
        size: t(`Cao ≈ ${nf(tr.h, 0)} m – tán Ø ≈ ${nf(tr.r * 2, 0)} m`, `高さ 約${nf(tr.h, 0)} m／樹冠 約φ${nf(tr.r * 2, 0)} m`),
        material: t("Giữ lại, móng công trình né rễ cây", "保存樹木／基礎は根を避けて配置"),
      },
    })
  if (spec.chimney) {
    const c = spec.chimney
    add({
      kind: "box",
      layer: "arch",
      mat: "stone",
      center: [c.x, c.top / 2, c.z],
      size: [c.w, c.top, c.w],
      info: {
        name: t("Ống khói lò sưởi", "暖炉の煙突"),
        size: `${mm(c.w, c.w)} – ${t("đỉnh", "頂部")} +${nf(c.top, 3)}`,
        material: t("Xây gạch chịu lửa, ốp đá tự nhiên", "耐火レンガ積み／天然石張り"),
      },
    })
  }
  if (spec.solar) {
    const b = blocks[spec.solar.block]!
    const y = b.top * H
    const info: Info = {
      name: t("Hệ pin năng lượng mặt trời áp mái", "屋上太陽光発電パネル"),
      size: t("Tấm 1.134 × 1.722 mm – 450 Wp/tấm", "パネル 1,134 × 1,722 mm – 450 W"),
      material: t("Pin mono PERC, khung nhôm, inverter hòa lưới", "単結晶PERC／アルミフレーム／系統連系インバーター"),
      spec: t("Nghiêng 10° về hướng Nam", "南向き 傾斜 10°"),
    }
    const cols = Math.min(6, Math.floor((b.x1 - b.x0 - 1.2) / 1.2))
    const rows = Math.min(3, Math.floor((b.z1 - b.z0 - 1.6) / 2.1))
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++)
        add({
          kind: "box",
          layer: "mep",
          mat: "solar",
          center: [b.x0 + 0.6 + 0.6 + i * 1.2, y + 0.35, b.z1 - 0.8 - 0.9 - j * 2.1],
          size: [1.13, 0.04, 1.72],
          rotation: [-0.17, 0, 0],
          info,
        })
  }

  /* ---------------- MEP: water supply + drainage ---------------- */

  const len = (pts: V3[]) =>
    pts.slice(1).reduce((s, p, i) => {
      const q = pts[i]!
      return s + Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])
    }, 0)
  const pipe = (mat: MatKey, dn: number, points: V3[], name: string, material: string, specTxt: string, location?: string) =>
    add({
      kind: "pipe",
      layer: "mep",
      mat,
      points,
      // drawn a little thicker than real so thin pipes stay visible & clickable
      radius: Math.max((dn / 1000 / 2) * 1.5, 0.028),
      info: { name, size: `D${dn} – L = ${m(len(points))}`, material, spec: specTxt, location },
    })
  const PPR = t("Ống PPR PN10", "PPR管 PN10")
  const PPR_HOT = t("Ống PPR PN20 (chịu nhiệt)", "PPR管 PN20（耐熱）")
  const UPVC = t("Ống uPVC hệ mét", "硬質塩ビ管（uPVC）")
  const EXPOSED = t("Đi nổi, kẹp ống inox a1000", "露出配管／ステンレスバンド @1000")

  const coreBlock = blocks[spec.core.block]!
  const cx = spec.core.x
  const cz = coreBlock.z0 + 0.2
  const coreStoreys = Array.from({ length: maxTop }, (_, k) => k).filter((k) =>
    blocks.some((b) => occupies(b, k) && contains(b, cx, cz))
  )
  const kMin = Math.min(...coreStoreys)
  const kMax = Math.max(...coreStoreys)
  const topBlock = blocks.find((b) => b.top === kMax + 1 && contains(b, cx, cz))
  if (!topBlock) throw new Error(`house spec: wet core x=${cx} is not inside block ${spec.core.block}`)
  const flatTop = topBlock.roof.type === "flat"
  const roofY = (kMax + 1) * H
  const wcLoc = (k: number) => `${t("WC", "浴室")} · ${floorName(k)}`

  const tankInfo: Info = {
    name: t("Bồn nước inox 1.500 L", "ステンレス給水タンク 1,500L"),
    size: `Ø${nf(1100)} × ${nf(1400)} mm`,
    material: t("Inox SUS304", "ステンレス SUS304"),
    spec: flatTop
      ? t("Đặt trên mái, cấp nước tự chảy", "屋上設置・重力給水")
      : t("Đặt ở sân sau, cấp nước qua bơm tăng áp", "裏庭設置・加圧ポンプ給水"),
    location: flatTop ? t("Mái", "屋上") : t("Sân sau", "裏庭"),
  }
  const standInfo: Info = {
    name: t("Chân đỡ bồn nước", "タンク架台"),
    size: mm(1.2, 1.2, 0.6),
    material: t("Thép hộp mạ kẽm 50×50×2", "溶融亜鉛めっき角鋼管 50×50×2"),
    location: tankInfo.location,
  }
  const tank = (x: number, base: number, z: number) => {
    add({ kind: "cyl", layer: "mep", mat: "inox", center: [x, base + 1.3, z], radius: 0.55, height: 1.4, info: tankInfo })
    add({ kind: "box", layer: "mep", mat: "steel", center: [x, base + 0.57, z], size: [1.2, 0.06, 1.2], info: standInfo })
    for (const [dx, dz] of [
      [-0.55, -0.55],
      [0.55, -0.55],
      [-0.55, 0.55],
      [0.55, 0.55],
    ] as const)
      add({ kind: "box", layer: "mep", mat: "steel", center: [x + dx, base + 0.27, z + dz], size: [0.05, 0.54, 0.05], info: standInfo })
  }
  const mainName = t("Ống cấp nước chính", "給水主管")
  if (flatTop) {
    tank(cx, roofY, cz + 1.3)
    pipe(
      "pipeCold",
      32,
      [
        [cx, roofY + 0.75, cz + 0.75],
        [cx, roofY + 0.75, cz + 0.5],
        [cx, roofY + 0.12, cz + 0.5],
        [cx, roofY + 0.12, cz],
        [cx, kMin * H + 2.9, cz],
      ],
      mainName,
      PPR,
      EXPOSED,
      t("Từ bồn mái xuống các tầng", "屋上タンク → 各階")
    )
  } else {
    const tx = cx + 1.6
    const tz = coreBlock.z0 - 2.3
    tank(tx, GROUND_LEVEL, tz)
    add({
      kind: "box",
      layer: "mep",
      mat: "steel",
      center: [cx + 0.7, GROUND_LEVEL + 0.22, tz],
      size: [0.45, 0.44, 0.35],
      info: {
        name: t("Bơm tăng áp", "加圧給水ポンプ"),
        size: mm(0.45, 0.35, 0.44),
        material: t("Bơm biến tần 0,75 kW, bình tích áp 24 L", "インバーターポンプ 0.75kW／圧力タンク 24L"),
        location: t("Sân sau", "裏庭"),
      },
    })
    pipe("pipeCold", 32, [[tx - 0.55, GROUND_LEVEL + 0.35, tz], [cx + 0.92, GROUND_LEVEL + 0.35, tz]], t("Ống hút bơm", "ポンプ吸込管"), PPR, EXPOSED, t("Sân sau", "裏庭"))
    pipe(
      "pipeCold",
      32,
      [
        [cx + 0.7, GROUND_LEVEL + 0.44, tz],
        [cx + 0.7, GROUND_LEVEL + 0.44, coreBlock.z0 - 0.4],
        [cx + 0.7, kMax * H + 3.0, coreBlock.z0 - 0.4],
        [cx + 0.7, kMax * H + 3.0, cz],
        [cx, kMax * H + 3.0, cz],
        [cx, kMin * H + 2.9, cz],
      ],
      mainName,
      PPR,
      EXPOSED,
      t("Từ bơm tăng áp lên các tầng", "加圧ポンプ → 各階")
    )
  }

  const stackX = cx - 0.5
  const stackZ = coreBlock.z0 - 0.25
  const pitZ = coreBlock.z0 - 1.5
  for (const k of coreStoreys) {
    const y0 = k * H
    const loc = wcLoc(k)
    pipe("pipeCold", 25, [[cx - 0.5, y0 + 2.9, cz], [cx + 0.5, y0 + 2.9, cz]], t("Ống nhánh cấp nước WC", "給水枝管（浴室）"), PPR, EXPOSED, loc)
    pipe("pipeCold", 20, [[cx - 0.5, y0 + 2.9, cz], [cx - 0.5, y0 + 0.92, cz]], t("Nhánh cấp bồn cầu", "給水枝管（便器）"), PPR, EXPOSED, loc)
    pipe("pipeCold", 20, [[cx + 0.5, y0 + 2.9, cz], [cx + 0.5, y0 + 0.98, cz]], t("Nhánh cấp lavabo", "給水枝管（洗面器）"), PPR, EXPOSED, loc)
    pipe("pipeCold", 20, [[cx + 0.1, y0 + 2.9, cz], [cx + 0.1, y0 + 2.9, cz + 0.12], [cx + 0.1, y0 + 2.64, cz + 0.12]], t("Nhánh cấp bình nóng lạnh", "給水枝管（温水器）"), PPR, EXPOSED, loc)
    pipe("pipeHot", 20, [[cx + 0.1, y0 + 2.06, cz + 0.12], [cx + 0.1, y0 + 1.95, cz + 0.12], [cx + 0.35, y0 + 1.95, cz + 0.12], [cx + 0.35, y0 + 0.95, cz + 0.12]], t("Ống nước nóng lavabo", "給湯管（洗面器）"), PPR_HOT, EXPOSED, loc)
    pipe("pipeDrain", 90, [[cx - 0.5, y0 + 0.12, cz + 0.2], [cx - 0.5, y0 + 0.12, stackZ]], t("Ống thoát bồn cầu", "汚水管（便器）"), UPVC, t("Độ dốc i = 2%", "勾配 1/50"), loc)
    pipe("pipeDrain", 42, [[cx + 0.5, y0 + 0.72, cz + 0.1], [cx + 0.5, y0 + 0.4, cz + 0.1], [cx + 0.5, y0 + 0.4, stackZ], [stackX + 0.06, y0 + 0.4, stackZ]], t("Ống thoát lavabo", "雑排水管（洗面器）"), UPVC, t("Có xi-phông chống mùi", "トラップ付き"), loc)
    add({
      kind: "cyl",
      layer: "mep",
      mat: "ceramic",
      center: [cx + 0.1, y0 + 2.35, cz + 0.12],
      radius: 0.2,
      height: 0.55,
      info: {
        name: t("Bình nóng lạnh 30 L", "電気温水器 30L"),
        size: `Ø${nf(400)} × ${nf(550)} mm`,
        material: t("Ruột tráng men, vỏ thép sơn tĩnh điện", "ホーロー内槽／粉体塗装鋼板"),
        spec: t("Công suất 2,5 kW, có chống giật ELCB", "2.5 kW・漏電遮断器付き"),
        location: loc,
      },
    })
    const toilet = { name: t("Bồn cầu", "便器"), material: t("Sứ vệ sinh, xả nhấn 2 chế độ", "衛生陶器・2段階洗浄") }
    add({ kind: "box", layer: "mep", mat: "ceramic", center: [cx - 0.5, y0 + 0.2, cz + 0.45], size: [0.38, 0.4, 0.55], info: { ...toilet, size: mm(0.38, 0.55, 0.4), location: loc } })
    add({ kind: "box", layer: "mep", mat: "ceramic", center: [cx - 0.5, y0 + 0.62, cz + 0.2], size: [0.4, 0.45, 0.18], info: { ...toilet, size: mm(0.38, 0.55, 0.4), location: loc } })
    add({ kind: "box", layer: "mep", mat: "ceramic", center: [cx + 0.5, y0 + 0.8, cz + 0.32], size: [0.5, 0.15, 0.4], info: { name: t("Lavabo", "洗面器"), size: mm(0.5, 0.4, 0.15), material: t("Sứ vệ sinh, vòi nóng lạnh", "衛生陶器・混合水栓"), location: loc } })
  }
  pipe(
    "pipeDrain",
    110,
    [
      [stackX, flatTop ? roofY + 0.6 : roofY - 0.3, stackZ],
      [stackX, -0.6, stackZ],
      [stackX, -0.6, pitZ + 0.35],
    ],
    t("Ống đứng thoát nước thải + thông hơi", "排水竪管・通気管"),
    UPVC,
    t("Thông hơi vượt mái 600 mm", "通気口 屋上 +600 mm"),
    t("Mặt sau nhà", "建物背面")
  )
  add({
    kind: "box",
    layer: "mep",
    mat: "pit",
    center: [stackX, -0.75, pitZ],
    size: [0.7, 0.6, 0.7],
    info: {
      name: t("Hố ga", "汚水桝"),
      size: mm(0.7, 0.7, 0.6),
      material: t("Xây gạch thẻ, trát vữa, nắp bê tông cốt thép", "レンガ積み／RC蓋"),
      spec: t("Thu nước thải WC, lavabo, bếp → bể tự hoại", "便器・洗面器・厨房の排水 → 浄化槽"),
    },
  })
  if (spec.kitchen && coreBlock.from === 0) {
    const [ka, kb] = spec.kitchen.x
    const kz = coreBlock.z0 + 0.4
    const sx = (ka + kb) / 2
    add({
      kind: "box",
      layer: "arch",
      mat: "counter",
      center: [sx, 0.425, kz],
      size: [kb - ka, 0.85, 0.6],
      info: {
        name: t("Tủ bếp dưới", "キッチンカウンター"),
        size: mm(kb - ka, 0.6, 0.85),
        material: t("Khung inox, cánh acrylic, mặt đá thạch anh", "ステンレス骨組／アクリル扉／クォーツ天板"),
        location: t("Bếp", "キッチン"),
      },
    })
    add({
      kind: "box",
      layer: "mep",
      mat: "inox",
      center: [sx, 0.83, kz],
      size: [0.7, 0.06, 0.45],
      info: { name: t("Chậu rửa bếp", "流し台"), size: mm(0.7, 0.45, 0.2), material: t("Inox 304, 2 hố", "ステンレス SUS304・2槽"), location: t("Bếp", "キッチン") },
    })
    pipe("pipeCold", 25, [[cx, 2.9, cz], [sx, 2.9, cz], [sx, 1.05, cz]], t("Nhánh cấp chậu rửa bếp", "給水枝管（流し台）"), PPR, EXPOSED, t("Bếp", "キッチン"))
    pipe(
      "pipeDrain",
      60,
      [
        [sx, 0.78, kz],
        [sx, 0.45, kz],
        [sx, 0.45, stackZ],
        [sx, -0.6, stackZ],
        [sx, -0.6, pitZ],
        [stackX + (sx > stackX ? 0.35 : -0.35), -0.6, pitZ],
      ],
      t("Ống thoát chậu rửa bếp", "厨房排水管"),
      UPVC,
      t("Có hộp tách mỡ dưới chậu", "グリーストラップ付き"),
      t("Bếp → hố ga", "キッチン → 汚水桝")
    )
  }

  // Rainwater downpipes at the back corners of each roof.
  const rainKeys: V2[] = []
  for (const b of blocks) {
    const y = b.top * H
    for (const px of [b.x0 + 0.35, b.x1 - 0.35]) {
      const pz = b.z0 - 0.25
      if (blocks.some((c) => occupies(c, b.top - 1) && contains(c, px, pz - 0.05) && c !== b)) continue
      if (Math.abs(px - stackX) < 0.5) continue
      if (rainKeys.some(([x, z]) => Math.abs(x - px) < 0.6 && Math.abs(z - pz) < 0.6)) continue
      rainKeys.push([px, pz])
      const below = blocks.filter((c) => c.top < b.top && contains(c, px, pz))
      const endY = below.length ? Math.max(...below.map((c) => c.top)) * H + 0.06 : GROUND_LEVEL + 0.05
      const pts: V3[] = [
        [px, y + 0.06, b.z0 + 0.25],
        [px, y + 0.06, pz],
        [px, endY, pz],
      ]
      if (!below.length) pts.push([px, endY, pz - 0.35])
      pipe(
        "pipeRain",
        90,
        pts,
        t("Ống thoát nước mưa", "雨水竪樋"),
        UPVC,
        b.roof.type === "flat" ? t("Phễu thu inox Ø90 trên mái", "ルーフドレン φ90") : t("Nối máng xối mái", "軒樋に接続"),
        at(px, b.z0)
      )
    }
  }

  /* ---------------- Bounds ---------------- */

  const houseRects: Rect[] = [
    ...blocks.map(rectOf),
    ...(spec.canopies ?? []).map((c) => ({ x0: c.x[0], x1: c.x[1], z0: c.z[0], z1: c.z[1] })),
  ]
  const siteRects: Rect[] = [
    ...houseRects,
    ...(poolRect ? [poolRect] : []),
    ...(spec.decks ?? []).map((d) => ({ x0: d.x[0], x1: d.x[1], z0: d.z[0], z1: d.z[1] })),
  ]
  const bbox = (rs: Rect[]) => ({
    x0: Math.min(...rs.map((r) => r.x0)),
    x1: Math.max(...rs.map((r) => r.x1)),
    z0: Math.min(...rs.map((r) => r.z0)),
    z1: Math.max(...rs.map((r) => r.z1)),
  })
  const hb = bbox(houseRects)
  const sb = bbox(siteRects)
  const maxY =
    Math.max(
      ...blocks.map((b) => b.top * H + (b.roof.type === "flat" ? 0.6 : b.roof.rise)),
      flatTop ? roofY + 2 : 0
    ) + 0.1

  return {
    els,
    grid: { xs, zs, xNames, zNames },
    house: { min: [hb.x0, GROUND_LEVEL, hb.z0], max: [hb.x1, maxY, hb.z1] },
    site: { min: [sb.x0, GROUND_LEVEL, sb.z0], max: [sb.x1, maxY, sb.z1] },
  }
}

/**
 * Several meshes can form one component (stand legs + plate, stair steps,
 * toilet bowl + cistern): they share name, location and size.
 */
export const componentKey = (e: El) =>
  `${e.layer}|${e.info.name}|${e.info.location ?? ""}|${e.info.size}`

export function countByLayer(els: El[]): Record<Layer, number> {
  const seen: Record<Layer, Set<string>> = { arch: new Set(), struct: new Set(), mep: new Set() }
  for (const e of els) seen[e.layer].add(componentKey(e))
  return { arch: seen.arch.size, struct: seen.struct.size, mep: seen.mep.size }
}
