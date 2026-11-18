/**
 * Data model of a single-storey house ("nhà cấp 4") with a reinforced-
 * concrete frame and exposed MEP water piping, rendered by
 * components/projects/house-model-3d.tsx.
 *
 * Units: metres. Axes: X = width (grid 1–4), Z = depth (grid A–C, front at
 * C), Y = up. Finished floor level ±0.000, natural ground −0.450.
 * The data is pure (no three.js) so it can be reasoned about and tested.
 */
import type { Locale } from "@/lib/i18n/types"

export type Layer = "arch" | "struct" | "mep"
export type V3 = [number, number, number]
export type MatKey =
  | "concrete"
  | "roofSlab"
  | "footing"
  | "lean"
  | "wall"
  | "frame"
  | "glass"
  | "wood"
  | "steelDoor"
  | "tile"
  | "counter"
  | "stone"
  | "pipeCold"
  | "pipeHot"
  | "pipeDrain"
  | "pipeRain"
  | "steel"
  | "inox"
  | "ceramic"
  | "pit"

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
  | (Base & { kind: "box"; mat: MatKey; center: V3; size: V3 })
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
      style: "glass" | "wood" | "steel"
    })

/** Structural grid. */
export const GRID_X = [0, 3.6, 7.2, 10.8]
export const GRID_Z = [0, 3.6, 7.2]
export const GRID_X_NAMES = ["1", "2", "3", "4"]
export const GRID_Z_NAMES = ["A", "B", "C"]
export const GROUND_LEVEL = -0.45

/* ------------------------------------------------------------------ */
/* UI text                                                             */
/* ------------------------------------------------------------------ */

export function modelText(locale: Locale) {
  const ja = locale === "ja"
  return {
    title: ja
      ? "3Dモデル：平屋住宅（RCラーメン構造・露出配管）"
      : "Mô hình 3D nhà cấp 4 – khung BTCT & MEP đi nổi",
    panelTitle: ja ? "表示レイヤー" : "Lớp hiển thị",
    panelToggle: ja ? "コントロールパネル" : "Bảng điều khiển",
    showPanel: ja ? "コントロールパネルを表示" : "Hiện bảng điều khiển",
    hidePanel: ja ? "コントロールパネルを隠す" : "Ẩn bảng điều khiển",
    layers: {
      arch: ja ? "意匠（建築）" : "Kiến trúc",
      struct: ja ? "構造" : "Kết cấu",
      mep: ja ? "設備（MEP）" : "MEP – Cấp thoát nước",
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
      ? "平屋住宅のインタラクティブ3Dモデル"
      : "Mô hình 3D tương tác của nhà cấp 4",
  }
}

/* ------------------------------------------------------------------ */
/* Model                                                               */
/* ------------------------------------------------------------------ */

export function buildHouse(locale: Locale): El[] {
  const ja = locale === "ja"
  const t = (vi: string, jp: string) => (ja ? jp : vi)
  const nf = (v: number, digits = 0) =>
    v.toLocaleString(ja ? "ja-JP" : "vi-VN", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
  const mm = (...v: number[]) => `${v.map((x) => nf(Math.round(x * 1000))).join(" × ")} mm`
  const m = (v: number) => `${nf(v, 2)} m`
  const axisLabel = (s: string) => `${t("Trục", "通り")} ${s}`

  const els: El[] = []
  const add = (e: El) => els.push(e)

  const CONCRETE = t("Bê tông B20 (M250), thép CB300-V", "コンクリート Fc21／鉄筋 SD295")

  /* ---------------- Structure ---------------- */

  GRID_Z.forEach((z, j) =>
    GRID_X.forEach((x, i) => {
      const at = axisLabel(`${GRID_Z_NAMES[j]}-${GRID_X_NAMES[i]}`)
      add({
        id: `lean-${i}-${j}`,
        kind: "box",
        layer: "struct",
        mat: "lean",
        center: [x, -1.65, z],
        size: [1.4, 0.1, 1.4],
        info: {
          name: t("Bê tông lót móng", "捨てコンクリート"),
          size: mm(1.4, 1.4, 0.1),
          material: t("Bê tông B7.5 (M100), đá 4×6", "コンクリート Fc12（捨てコン）"),
          location: at,
        },
      })
      add({
        id: `footing-${i}-${j}`,
        kind: "box",
        layer: "struct",
        mat: "footing",
        center: [x, -1.4, z],
        size: [1.2, 0.4, 1.2],
        info: {
          name: t("Móng đơn M1", "独立基礎 F1"),
          size: mm(1.2, 1.2, 0.4),
          material: CONCRETE,
          spec: t(
            "Lưới thép đáy Ø12a150 hai phương, đáy móng −1.600",
            "下端筋 D13@150 両方向／基礎底 −1,600"
          ),
          location: at,
        },
      })
      add({
        id: `pedestal-${i}-${j}`,
        kind: "box",
        layer: "struct",
        mat: "concrete",
        center: [x, -0.6, z],
        size: [0.22, 1.2, 0.22],
        info: {
          name: t("Cổ móng CM1", "基礎柱 FC1"),
          size: mm(0.22, 0.22, 1.2),
          material: CONCRETE,
          spec: t("Thép dọc 4Ø16, đai Ø6a150", "主筋 4-D16／帯筋 D6@150"),
          location: at,
        },
      })
      add({
        id: `column-${i}-${j}`,
        kind: "box",
        layer: "struct",
        mat: "concrete",
        center: [x, 3.595 / 2, z],
        size: [0.22, 3.595, 0.22],
        info: {
          name: t("Cột C1", "柱 C1"),
          size: mm(0.22, 0.22, 3.6),
          material: CONCRETE,
          spec: t(
            "Thép dọc 4Ø16, đai Ø6a150 (a100 tại hai đầu cột)",
            "主筋 4-D16／帯筋 D6@150（柱頭・柱脚 @100）"
          ),
          location: at,
        },
      })
    })
  )

  // Ground beams (giằng móng) and roof beams, between column faces.
  const beams = (
    kind: "ground" | "roof",
    w: number,
    h: number,
    yCenter: number
  ) => {
    const name =
      kind === "ground" ? t("Giằng móng GM1", "地中梁 FG1") : t("Dầm mái D1", "屋根梁 G1")
    const spec =
      kind === "ground"
        ? t("Thép dọc 4Ø14, đai Ø6a200", "主筋 4-D13／あばら筋 D6@200")
        : t("Thép dọc 2Ø18 (trên) + 2Ø16 (dưới), đai Ø6a150", "上端 2-D19・下端 2-D16／あばら筋 D6@150")
    GRID_Z.forEach((z, j) =>
      GRID_X.slice(0, -1).forEach((x, i) => {
        const len = GRID_X[i + 1]! - x - 0.22
        add({
          id: `${kind}-x-${i}-${j}`,
          kind: "box",
          layer: "struct",
          mat: "concrete",
          center: [x + (GRID_X[i + 1]! - x) / 2, yCenter, z],
          size: [len, h, w],
          info: {
            name,
            size: `${mm(w, h)} – L = ${m(len)}`,
            material: CONCRETE,
            spec,
            location: axisLabel(`${GRID_Z_NAMES[j]}, ${GRID_X_NAMES[i]}–${GRID_X_NAMES[i + 1]}`),
          },
        })
      })
    )
    GRID_X.forEach((x, i) =>
      GRID_Z.slice(0, -1).forEach((z, j) => {
        const len = GRID_Z[j + 1]! - z - 0.22
        add({
          id: `${kind}-z-${i}-${j}`,
          kind: "box",
          layer: "struct",
          mat: "concrete",
          center: [x, yCenter, z + (GRID_Z[j + 1]! - z) / 2],
          size: [w, h, len],
          info: {
            name,
            size: `${mm(w, h)} – L = ${m(len)}`,
            material: CONCRETE,
            spec,
            location: axisLabel(`${GRID_X_NAMES[i]}, ${GRID_Z_NAMES[j]}–${GRID_Z_NAMES[j + 1]}`),
          },
        })
      })
    )
  }
  beams("ground", 0.2, 0.3, -0.155)
  beams("roof", 0.22, 0.35, 3.595 - 0.175)

  add({
    id: "slab-ground",
    kind: "box",
    layer: "struct",
    mat: "concrete",
    center: [5.4, -0.05, 3.6],
    size: [10.8, 0.1, 7.2],
    info: {
      name: t("Sàn nền", "土間スラブ"),
      size: `${mm(10.8, 7.2)} – ${t("dày", "厚さ")} 100 mm`,
      material: t("Bê tông B15 (M200) trên nền cát đầm chặt K95", "コンクリート Fc18／砂地業 転圧"),
      spec: t("Lưới thép Ø6a200", "ワイヤーメッシュ φ6@200"),
    },
  })
  add({
    id: "slab-roof",
    kind: "box",
    layer: "struct",
    mat: "roofSlab",
    center: [5.4, 3.55, 3.6],
    size: [11.1, 0.1, 7.5],
    info: {
      name: t("Sàn mái S1", "屋根スラブ S1"),
      size: `${mm(11.1, 7.5)} – ${t("dày", "厚さ")} 100 mm`,
      material: CONCRETE,
      spec: t(
        "Thép Ø8a200 hai lớp; chống thấm gốc xi măng 2 lớp, dốc 2% về phễu thu",
        "上下 D10@200 ダブル配筋／防水 2層・勾配 2%"
      ),
      location: t("Cao độ đỉnh sàn +3.600", "スラブ天端 +3,600"),
    },
  })

  /* ---------------- Architecture ---------------- */

  const WALL_H = 3.245 // up to the underside of the roof beams
  const extInfo = (len: number) => ({
    name: t("Tường bao", "外壁"),
    size: `${t("Dày", "厚さ")} 200 mm – L = ${m(len)} – H = ${m(WALL_H)}`,
    material: t("Gạch ống 8×8×18, vữa xi măng M75", "空洞レンガ／セメントモルタル M75"),
    spec: t("Trát hai mặt dày 15 mm, sơn nước ngoại thất", "両面モルタル塗り t=15／外装塗装"),
  })
  const intInfo = (len: number, h: number) => ({
    name: t("Tường ngăn", "間仕切壁"),
    size: `${t("Dày", "厚さ")} 110 mm – L = ${m(len)} – H = ${m(h)}`,
    material: t("Gạch ống 8×8×18 (xây 100), vữa M75", "空洞レンガ（半枚積み）／モルタル M75"),
    spec: t("Trát hai mặt dày 15 mm, sơn nước nội thất", "両面モルタル塗り t=15／内装塗装"),
  })

  type WallDef = {
    id: string
    axis: "x" | "z"
    origin: V3
    length: number
    height: number
    thickness: number
    openings: Opening[]
    location: string
    exterior: boolean
  }
  const walls: WallDef[] = [
    {
      id: "wall-C",
      axis: "x",
      origin: [0, 0, 7.2],
      length: 10.8,
      height: WALL_H,
      thickness: 0.2,
      openings: [
        { a: 0.9, b: 2.7, bottom: 0.9, top: 2.4 },
        { a: 4.6, b: 6.2, bottom: 0, top: 2.4 },
        { a: 8.1, b: 9.9, bottom: 0.9, top: 2.4 },
      ],
      location: axisLabel("C"),
      exterior: true,
    },
    {
      id: "wall-A",
      axis: "x",
      origin: [0, 0, 0],
      length: 10.8,
      height: WALL_H,
      thickness: 0.2,
      openings: [
        { a: 0.9, b: 2.7, bottom: 1.1, top: 2.3 },
        { a: 4.1, b: 4.8, bottom: 1.7, top: 2.3 },
        { a: 8.1, b: 9.9, bottom: 0.9, top: 2.4 },
      ],
      location: axisLabel("A"),
      exterior: true,
    },
    {
      id: "wall-1",
      axis: "z",
      origin: [0, 0, 0],
      length: 7.2,
      height: WALL_H,
      thickness: 0.2,
      openings: [
        { a: 1.4, b: 2.3, bottom: 0, top: 2.2 },
        { a: 4.5, b: 6.3, bottom: 0.9, top: 2.4 },
      ],
      location: axisLabel("1"),
      exterior: true,
    },
    {
      id: "wall-4",
      axis: "z",
      origin: [10.8, 0, 0],
      length: 7.2,
      height: WALL_H,
      thickness: 0.2,
      openings: [
        { a: 0.9, b: 2.7, bottom: 0.9, top: 2.4 },
        { a: 4.5, b: 6.3, bottom: 0.9, top: 2.4 },
      ],
      location: axisLabel("4"),
      exterior: true,
    },
    {
      id: "wall-B",
      axis: "x",
      origin: [0, 0, 3.6],
      length: 10.8,
      height: WALL_H,
      thickness: 0.11,
      openings: [
        { a: 1.2, b: 2.6, bottom: 0, top: 2.4 },
        { a: 4.1, b: 4.8, bottom: 0, top: 2.1 },
        { a: 5.9, b: 6.6, bottom: 0, top: 2.1 },
        { a: 8.3, b: 9.1, bottom: 0, top: 2.1 },
      ],
      location: axisLabel("B"),
      exterior: false,
    },
    {
      id: "wall-3f",
      axis: "z",
      origin: [7.2, 0, 3.6],
      length: 3.6,
      height: WALL_H,
      thickness: 0.11,
      openings: [{ a: 0.4, b: 1.2, bottom: 0, top: 2.1 }],
      location: axisLabel("3, B–C"),
      exterior: false,
    },
    {
      id: "wall-3b",
      axis: "z",
      origin: [7.2, 0, 0],
      length: 3.6,
      height: WALL_H,
      thickness: 0.11,
      openings: [],
      location: axisLabel("3, A–B"),
      exterior: false,
    },
    {
      id: "wall-2b",
      axis: "z",
      origin: [3.6, 0, 0],
      length: 3.6,
      height: WALL_H,
      thickness: 0.11,
      openings: [],
      location: axisLabel("2, A–B"),
      exterior: false,
    },
    {
      id: "wall-wc",
      axis: "z",
      origin: [5.4, 0, 0.1],
      length: 3.445,
      height: 3.5,
      thickness: 0.11,
      openings: [],
      location: t("Giữa WC và kho", "浴室・収納の間"),
      exterior: false,
    },
  ]
  for (const w of walls) {
    const info = w.exterior ? extInfo(w.length) : intInfo(w.length, w.height)
    add({ ...w, kind: "wall", layer: "arch", mat: "wall", info: { ...info, location: w.location } })
  }

  // Parapet on the roof slab edge (slab: x −0.15…10.95, z −0.15…7.35).
  const parapet = (id: string, axis: "x" | "z", origin: V3, length: number) =>
    add({
      id,
      kind: "wall",
      layer: "arch",
      mat: "wall",
      axis,
      origin,
      length,
      height: 0.6,
      thickness: 0.11,
      openings: [],
      info: {
        name: t("Tường chắn mái", "パラペット"),
        size: `${t("Dày", "厚さ")} 110 mm – ${t("cao", "高さ")} 600 mm – L = ${m(length)}`,
        material: t("Gạch thẻ, vữa xi măng M75", "レンガ積み／モルタル M75"),
        spec: t("Láng vữa chống thấm đỉnh tường", "笠木モルタル防水"),
      },
    })
  parapet("parapet-A", "x", [-0.15, 3.6, -0.095], 11.1)
  parapet("parapet-C", "x", [-0.15, 3.6, 7.295], 11.1)
  parapet("parapet-1", "z", [-0.095, 3.6, -0.04], 7.28)
  parapet("parapet-4", "z", [10.895, 3.6, -0.04], 7.28)

  // Windows / doors placed in the openings above.
  const winInfo = (code: string, w: number, h: number, sill: number) => ({
    name: `${t("Cửa sổ", "窓")} ${code}`,
    size: `${mm(w, h)} (${t("rộng × cao", "幅 × 高さ")})`,
    material: t("Nhôm hệ Xingfa, kính an toàn 6,38 mm", "アルミサッシ／合わせガラス 6.8mm"),
    spec: t(`Cao bệ cửa ${nf(sill * 1000)} mm`, `窓台高さ ${nf(sill * 1000)} mm`),
  })
  const windows: [string, "x" | "z", number, number, number, number, number][] = [
    // code, axis, line, a, b, bottom, top
    ["W1", "x", 7.2, 0.9, 2.7, 0.9, 2.4],
    ["W2", "x", 7.2, 8.1, 9.9, 0.9, 2.4],
    ["W3", "x", 0, 0.9, 2.7, 1.1, 2.3],
    ["W4", "x", 0, 4.1, 4.8, 1.7, 2.3],
    ["W5", "x", 0, 8.1, 9.9, 0.9, 2.4],
    ["W6", "z", 0, 4.5, 6.3, 0.9, 2.4],
    ["W7", "z", 10.8, 0.9, 2.7, 0.9, 2.4],
    ["W8", "z", 10.8, 4.5, 6.3, 0.9, 2.4],
  ]
  for (const [code, axis, line, a, b, bottom, top] of windows) {
    const mid = (a + b) / 2
    add({
      id: `win-${code}`,
      kind: "window",
      layer: "arch",
      axis,
      center: axis === "x" ? [mid, (bottom + top) / 2, line] : [line, (bottom + top) / 2, mid],
      width: b - a,
      height: top - bottom,
      info: { ...winInfo(code, b - a, top - bottom, bottom), location: axisLabel(axis === "x" ? (line === 0 ? "A" : "C") : line === 0 ? "1" : "4") },
    })
  }

  add({
    id: "door-D1",
    kind: "door",
    layer: "arch",
    axis: "x",
    center: [5.4, 1.2, 7.2],
    width: 1.6,
    height: 2.4,
    leaves: 2,
    style: "glass",
    info: {
      name: t("Cửa đi chính D1", "玄関ドア D1"),
      size: `${mm(1.6, 2.4)} (${t("rộng × cao", "幅 × 高さ")})`,
      material: t("Nhôm Xingfa 2 cánh mở quay, kính cường lực 8 mm", "アルミ両開き／強化ガラス 8mm"),
      location: axisLabel("C"),
    },
  })
  add({
    id: "door-D2",
    kind: "door",
    layer: "arch",
    axis: "z",
    center: [0, 1.1, 1.85],
    width: 0.9,
    height: 2.2,
    leaves: 1,
    style: "steel",
    info: {
      name: t("Cửa đi phụ D2", "勝手口 D2"),
      size: `${mm(0.9, 2.2)} (${t("rộng × cao", "幅 × 高さ")})`,
      material: t("Cửa thép vân gỗ, khóa tay gạt", "スチールドア（木目調）"),
      location: axisLabel("1"),
    },
  })
  const roomDoor = (code: string, axis: "x" | "z", center: V3, width: number, location: string) =>
    add({
      id: `door-${code}`,
      kind: "door",
      layer: "arch",
      axis,
      center,
      width,
      height: 2.1,
      leaves: 1,
      style: "wood",
      info: {
        name: `${t("Cửa phòng", "室内ドア")} ${code}`,
        size: `${mm(width, 2.1)} (${t("rộng × cao", "幅 × 高さ")})`,
        material: t("Gỗ công nghiệp MDF chống ẩm, khung gỗ tự nhiên", "MDF耐湿板／木製枠"),
        location,
      },
    })
  roomDoor("D3", "x", [4.45, 1.05, 3.6], 0.7, t("WC", "浴室"))
  roomDoor("D4", "x", [6.25, 1.05, 3.6], 0.7, t("Kho", "収納"))
  roomDoor("D5", "x", [8.7, 1.05, 3.6], 0.8, t("Phòng ngủ 2", "寝室 2"))
  roomDoor("D6", "z", [7.2, 1.05, 4.4], 0.8, t("Phòng ngủ 1", "寝室 1"))

  add({
    id: "floor-finish",
    kind: "box",
    layer: "arch",
    mat: "tile",
    center: [5.4, 0.006, 3.6],
    size: [10.6, 0.012, 7.0],
    info: {
      name: t("Lát nền", "床仕上げ"),
      size: `${t("Diện tích", "面積")} ${nf(10.6 * 7.0, 1)} m²`,
      material: t("Gạch ceramic 600×600, vữa lót M75 dày 30", "磁器質タイル 600角／敷モルタル t=30"),
    },
  })
  add({
    id: "kitchen-counter",
    kind: "box",
    layer: "arch",
    mat: "counter",
    center: [1.8, 0.425, 0.4],
    size: [3.3, 0.85, 0.6],
    info: {
      name: t("Tủ bếp dưới", "キッチンカウンター"),
      size: mm(3.3, 0.6, 0.85),
      material: t("Khung inox, cánh acrylic, mặt đá granite", "ステンレス骨組／アクリル扉／御影石天板"),
      location: t("Bếp", "キッチン"),
    },
  })
  const stepInfo = {
    name: t("Bậc tam cấp", "玄関ステップ"),
    size: `${mm(2.2, 1.1)} – ${t("2 bậc, cao 225 mm/bậc", "2段・蹴上げ 225 mm")}`,
    material: t("Bê tông lót, ốp đá granite", "コンクリート下地／御影石張り"),
    location: axisLabel("C"),
  }
  add({ id: "step-1", kind: "box", layer: "arch", mat: "stone", center: [5.4, -0.1125, 7.75], size: [2.2, 0.225, 0.9], info: stepInfo })
  add({ id: "step-2", kind: "box", layer: "arch", mat: "stone", center: [5.4, -0.3375, 8.35], size: [2.2, 0.225, 0.3], info: stepInfo })

  /* ---------------- MEP ---------------- */

  const len = (pts: V3[]) =>
    pts.slice(1).reduce((s, p, i) => {
      const q = pts[i]!
      return s + Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])
    }, 0)
  const pipe = (
    id: string,
    mat: MatKey,
    dn: number,
    points: V3[],
    name: string,
    material: string,
    spec: string,
    location?: string
  ) =>
    add({
      id,
      kind: "pipe",
      layer: "mep",
      mat,
      points,
      // drawn a little thicker than real so thin pipes stay visible & clickable
      radius: Math.max((dn / 1000 / 2) * 1.5, 0.028),
      info: { name, size: `D${dn} – L = ${m(len(points))}`, material, spec, location },
    })

  const PPR = t("Ống PPR PN10", "PPR管 PN10")
  const PPR_HOT = t("Ống PPR PN20 (chịu nhiệt)", "PPR管 PN20（耐熱）")
  const UPVC = t("Ống uPVC hệ mét", "硬質塩ビ管（uPVC）")
  const EXPOSED = t("Đi nổi, kẹp ống inox a1000", "露出配管／ステンレスバンド @1000")

  // Roof tank and stand (tank centre x 4.5, z 1.5).
  add({
    id: "tank",
    kind: "cyl",
    layer: "mep",
    mat: "inox",
    center: [4.5, 4.9, 1.5],
    radius: 0.55,
    height: 1.4,
    info: {
      name: t("Bồn nước inox 1.500 L", "ステンレス給水タンク 1,500L"),
      size: `Ø${nf(1100)} × ${nf(1400)} mm`,
      material: t("Inox SUS304", "ステンレス SUS304"),
      spec: t("Đặt trên mái, cấp nước tự chảy", "屋上設置・重力給水"),
      location: t("Mái, trên khu WC", "屋上（浴室上部）"),
    },
  })
  const standInfo = {
    name: t("Chân đỡ bồn nước", "タンク架台"),
    size: mm(1.2, 1.2, 0.6),
    material: t("Thép hộp mạ kẽm 50×50×2", "溶融亜鉛めっき角鋼管 50×50×2"),
    location: t("Mái", "屋上"),
  }
  add({ id: "stand", kind: "box", layer: "mep", mat: "steel", center: [4.5, 4.17, 1.5], size: [1.2, 0.06, 1.2], info: standInfo })
  ;[
    [-0.55, -0.55],
    [0.55, -0.55],
    [-0.55, 0.55],
    [0.55, 0.55],
  ].forEach(([dx, dz], k) =>
    add({ id: `stand-${k}`, kind: "box", layer: "mep", mat: "steel", center: [4.5 + dx!, 3.87, 1.5 + dz!], size: [0.05, 0.54, 0.05], info: standInfo })
  )

  pipe(
    "supply-main",
    "pipeCold",
    32,
    [
      [4.5, 4.35, 0.95],
      [4.5, 4.35, 0.7],
      [4.5, 3.72, 0.7],
      [4.5, 3.72, 0.2],
      [4.5, 2.9, 0.2],
      [3.0, 2.9, 0.2],
    ],
    t("Ống cấp nước chính", "給水主管"),
    PPR,
    EXPOSED,
    t("Từ bồn mái xuống WC và bếp", "屋上タンク → 浴室・キッチン")
  )
  pipe("supply-kitchen", "pipeCold", 25, [[3.0, 2.9, 0.2], [3.0, 1.05, 0.2]], t("Nhánh cấp chậu rửa bếp", "給水枝管（流し台）"), PPR, EXPOSED, t("Bếp", "キッチン"))
  pipe("supply-wc", "pipeCold", 25, [[4.0, 2.9, 0.2], [4.0, 0.92, 0.2]], t("Nhánh cấp bồn cầu", "給水枝管（便器）"), PPR, EXPOSED, t("WC", "浴室"))
  pipe("supply-lav", "pipeCold", 25, [[4.5, 2.9, 0.2], [5.0, 2.9, 0.2], [5.0, 0.98, 0.2]], t("Nhánh cấp lavabo", "給水枝管（洗面器）"), PPR, EXPOSED, t("WC", "浴室"))
  pipe("supply-heater", "pipeCold", 25, [[4.6, 2.9, 0.2], [4.6, 2.9, 0.32], [4.6, 2.64, 0.32]], t("Nhánh cấp bình nóng lạnh", "給水枝管（温水器）"), PPR, EXPOSED, t("WC", "浴室"))
  pipe("hot-lav", "pipeHot", 20, [[4.6, 2.06, 0.32], [4.6, 1.95, 0.32], [4.85, 1.95, 0.32], [4.85, 0.95, 0.32]], t("Ống nước nóng lavabo", "給湯管（洗面器）"), PPR_HOT, EXPOSED, t("WC", "浴室"))

  pipe("drain-wc", "pipeDrain", 90, [[4.0, 0.12, 0.35], [4.0, 0.12, -0.25], [4.0, -0.6, -0.25], [4.0, -0.6, -0.95]], t("Ống thoát bồn cầu", "汚水管（便器）"), UPVC, t("Độ dốc i = 2%, có ống thông hơi", "勾配 1/50・通気管付き"), t("WC → hố ga", "便器 → 汚水桝"))
  pipe("drain-lav", "pipeDrain", 42, [[5.0, 0.72, 0.3], [5.0, 0.45, 0.3], [5.0, 0.45, -0.25], [5.0, -0.6, -0.25], [5.0, -0.6, -1.3], [4.35, -0.6, -1.3]], t("Ống thoát lavabo", "雑排水管（洗面器）"), UPVC, t("Có xi-phông chống mùi", "トラップ付き"), t("WC → hố ga", "洗面器 → 汚水桝"))
  pipe("drain-kitchen", "pipeDrain", 60, [[3.0, 0.78, 0.4], [3.0, 0.45, 0.4], [3.0, 0.45, -0.25], [3.0, -0.6, -0.25], [3.0, -0.6, -1.3], [3.65, -0.6, -1.3]], t("Ống thoát chậu rửa bếp", "厨房排水管"), UPVC, t("Có hộp tách mỡ dưới chậu", "グリーストラップ付き"), t("Bếp → hố ga", "キッチン → 汚水桝"))
  ;[0.5, 10.3].forEach((x, k) =>
    pipe(
      `rain-${k}`,
      "pipeRain",
      90,
      [
        [x, 3.66, 0.25],
        [x, 3.66, -0.25],
        [x, GROUND_LEVEL + 0.05, -0.25],
        [x, GROUND_LEVEL + 0.05, -0.6],
      ],
      t("Ống thoát nước mưa", "雨水竪樋"),
      UPVC,
      t("Phễu thu inox Ø90 trên mái", "屋上ルーフドレン φ90"),
      axisLabel(k === 0 ? "A-1" : "A-4")
    )
  )

  add({
    id: "manhole",
    kind: "box",
    layer: "mep",
    mat: "pit",
    center: [4.0, -0.75, -1.3],
    size: [0.7, 0.6, 0.7],
    info: {
      name: t("Hố ga", "汚水桝"),
      size: mm(0.7, 0.7, 0.6),
      material: t("Xây gạch thẻ, trát vữa, nắp bê tông cốt thép", "レンガ積み／RC蓋"),
      spec: t("Thu nước thải WC, lavabo, bếp", "便器・洗面器・厨房の排水を集水"),
    },
  })
  add({
    id: "heater",
    kind: "cyl",
    layer: "mep",
    mat: "ceramic",
    center: [4.6, 2.35, 0.32],
    radius: 0.2,
    height: 0.55,
    info: {
      name: t("Bình nóng lạnh 30 L", "電気温水器 30L"),
      size: `Ø${nf(400)} × ${nf(550)} mm`,
      material: t("Ruột tráng men, vỏ thép sơn tĩnh điện", "ホーロー内槽／粉体塗装鋼板"),
      spec: t("Công suất 2,5 kW, có chống giật ELCB", "2.5 kW・漏電遮断器付き"),
      location: t("WC", "浴室"),
    },
  })
  const fixture = (id: string, mat: MatKey, center: V3, size: V3, name: string, material: string, location: string) =>
    add({ id, kind: "box", layer: "mep", mat, center, size, info: { name, size: mm(size[0], size[2], size[1]), material, location } })
  const toilet = { name: t("Bồn cầu", "便器"), material: t("Sứ vệ sinh, xả nhấn 2 chế độ", "衛生陶器・2段階洗浄") }
  fixture("toilet", "ceramic", [4.0, 0.2, 0.45], [0.38, 0.4, 0.55], toilet.name, toilet.material, t("WC", "浴室"))
  fixture("toilet-tank", "ceramic", [4.0, 0.62, 0.2], [0.4, 0.45, 0.18], toilet.name, toilet.material, t("WC", "浴室"))
  fixture("lavabo", "ceramic", [5.0, 0.8, 0.32], [0.5, 0.15, 0.4], t("Lavabo", "洗面器"), t("Sứ vệ sinh, vòi nóng lạnh", "衛生陶器・混合水栓"), t("WC", "浴室"))
  fixture("sink", "inox", [3.0, 0.83, 0.4], [0.6, 0.06, 0.45], t("Chậu rửa bếp", "流し台"), t("Inox 304, 1 hố", "ステンレス SUS304・1槽"), t("Bếp", "キッチン"))

  return els
}

/**
 * Several meshes can form one component (stand legs + plate, both steps,
 * toilet bowl + cistern): they share name, location and size.
 */
export const componentKey = (e: El) =>
  `${e.layer}|${e.info.name}|${e.info.location ?? ""}|${e.info.size}`

export function countByLayer(els: El[]): Record<Layer, number> {
  const seen: Record<Layer, Set<string>> = { arch: new Set(), struct: new Set(), mep: new Set() }
  for (const e of els) seen[e.layer].add(componentKey(e))
  return { arch: seen.arch.size, struct: seen.struct.size, mep: seen.mep.size }
}
