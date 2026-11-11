/**
 * Sample residential portfolio (placeholder content — replace with real
 * projects). Text is stored per locale; images, categories, regions and tags
 * are shared. Each name/description was written to match its photo.
 */
import type { Locale } from "@/lib/i18n/types"

type L = Record<Locale, string>

const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const categories = {
  townhouse: { vi: "Nhà phố", ja: "タウンハウス" },
  villa: { vi: "Biệt thự", ja: "邸宅・ヴィラ" },
  resortVilla: { vi: "Biệt thự nghỉ dưỡng", ja: "リゾートヴィラ" },
  garden: { vi: "Nhà vườn", ja: "庭付き住宅" },
  bungalow: { vi: "Nhà một tầng", ja: "平屋" },
} satisfies Record<string, L>

export const regions = {
  north: { vi: "Miền Bắc", ja: "北部" },
  central: { vi: "Miền Trung", ja: "中部" },
  south: { vi: "Miền Nam", ja: "南部" },
} satisfies Record<string, L>

export const tags = {
  pool: { vi: "Hồ bơi", ja: "プール" },
  garden: { vi: "Sân vườn", ja: "庭" },
  wood: { vi: "Ốp gỗ", ja: "木質外装" },
  louver: { vi: "Lam chắn nắng", ja: "ルーバー" },
  minimal: { vi: "Phong cách tối giản", ja: "ミニマル" },
  smart: { vi: "Nhà thông minh", ja: "スマートホーム" },
  solar: { vi: "Điện mặt trời áp mái", ja: "太陽光発電" },
  green: { vi: "Tiết kiệm năng lượng", ja: "省エネ" },
  seaside: { vi: "Ven biển", ja: "海辺" },
  bim: { vi: "BIM", ja: "BIM" },
  designBuild: { vi: "Thiết kế – thi công trọn gói", ja: "設計施工一括" },
} satisfies Record<string, L>

type CategoryId = keyof typeof categories
type RegionId = keyof typeof regions
type TagId = keyof typeof tags

type ProjectRaw = {
  id: string
  name: L
  category: CategoryId
  region: RegionId
  location: L
  structure: L
  tags: TagId[]
  image: string
  isNew?: boolean
  /** Shown in the "pickup" carousel. */
  pickup?: boolean
}

const projects: ProjectRaw[] = [
  {
    id: "nha-vuon-op-go-thao-dien",
    name: { vi: "Nhà vườn ốp gỗ dưới tán cây cổ thụ", ja: "大樹の下に建つ木質外装の家" },
    category: "garden",
    region: "south",
    location: { vi: "TP. Thủ Đức, TP. Hồ Chí Minh", ja: "ホーチミン市 トゥードゥック市" },
    structure: { vi: "Bê tông cốt thép · 2 tầng", ja: "鉄筋コンクリート造 2階建" },
    tags: ["wood", "garden", "designBuild"],
    image: unsplash("photo-1600585154340-be6161a56a0c"),
    isNew: true,
    pickup: true,
  },
  {
    id: "biet-thu-ho-boi-phu-my-hung",
    name: { vi: "Biệt thự hồ bơi Phú Mỹ Hưng", ja: "フーミーフン プール付き邸宅" },
    category: "villa",
    region: "south",
    location: { vi: "Quận 7, TP. Hồ Chí Minh", ja: "ホーチミン市 7区" },
    structure: { vi: "Bê tông cốt thép · 2 tầng", ja: "鉄筋コンクリート造 2階建" },
    tags: ["pool", "smart", "bim"],
    image: unsplash("photo-1613490493576-7fde63acd811"),
    isNew: true,
    pickup: true,
  },
  {
    id: "biet-thu-nghi-duong-da-nang",
    name: { vi: "Biệt thự nghỉ dưỡng ven biển Đà Nẵng", ja: "ダナン 海辺のリゾートヴィラ" },
    category: "resortVilla",
    region: "central",
    location: { vi: "Ngũ Hành Sơn, Đà Nẵng", ja: "ダナン市 グーハンソン区" },
    structure: { vi: "Bê tông cốt thép · 2 tầng", ja: "鉄筋コンクリート造 2階建" },
    tags: ["seaside", "pool", "designBuild"],
    image: unsplash("photo-1613977257363-707ba9348227"),
    isNew: true,
    pickup: true,
  },
  {
    id: "biet-thu-ho-boi-tran-bo-nha-trang",
    name: { vi: "Biệt thự hồ bơi tràn bờ Nha Trang", ja: "ニャチャン インフィニティプールのヴィラ" },
    category: "resortVilla",
    region: "central",
    location: { vi: "Nha Trang, Khánh Hòa", ja: "カインホア省 ニャチャン市" },
    structure: { vi: "Bê tông cốt thép · 2 tầng", ja: "鉄筋コンクリート造 2階建" },
    tags: ["pool", "seaside", "bim"],
    image: unsplash("photo-1580587771525-78b9dba3b914"),
    pickup: true,
  },
  {
    id: "biet-thu-khoi-go-binh-thanh",
    name: { vi: "Biệt thự hiện đại khối gỗ Bình Thạnh", ja: "ビンタン 木のボリュームが映えるモダン邸宅" },
    category: "villa",
    region: "south",
    location: { vi: "Bình Thạnh, TP. Hồ Chí Minh", ja: "ホーチミン市 ビンタン区" },
    structure: { vi: "Bê tông cốt thép · 2 tầng", ja: "鉄筋コンクリート造 2階建" },
    tags: ["wood", "minimal", "smart"],
    image: unsplash("photo-1600047509807-ba8f99d2cdde"),
    pickup: true,
  },
  {
    id: "nha-pho-lam-go-thu-duc",
    name: { vi: "Nhà phố mặt tiền lam gỗ Thủ Đức", ja: "トゥードゥック 木製ルーバーのタウンハウス" },
    category: "townhouse",
    region: "south",
    location: { vi: "TP. Thủ Đức, TP. Hồ Chí Minh", ja: "ホーチミン市 トゥードゥック市" },
    structure: { vi: "Bê tông cốt thép · 3 tầng", ja: "鉄筋コンクリート造 3階建" },
    tags: ["louver", "wood", "green"],
    image: unsplash("photo-1600566753190-17f0baa2a6c3"),
    pickup: true,
  },
  {
    id: "nha-mot-tang-long-an",
    name: { vi: "Nhà một tầng mái bằng hiện đại Long An", ja: "ロンアン フラット屋根のモダン平屋" },
    category: "bungalow",
    region: "south",
    location: { vi: "Bến Lức, Long An", ja: "ロンアン省 ベンルック県" },
    structure: { vi: "Bê tông cốt thép · 1 tầng", ja: "鉄筋コンクリート造 平屋建" },
    tags: ["garden", "solar", "designBuild"],
    image: unsplash("photo-1628744448840-55bdb2497bd4"),
    pickup: true,
  },
  {
    id: "biet-thu-trang-vung-tau",
    name: { vi: "Biệt thự trắng hồ bơi Vũng Tàu", ja: "ブンタウ 白いプール付きヴィラ" },
    category: "resortVilla",
    region: "south",
    location: { vi: "Vũng Tàu, Bà Rịa – Vũng Tàu", ja: "バリア＝ブンタウ省 ブンタウ市" },
    structure: { vi: "Bê tông cốt thép · 2 tầng", ja: "鉄筋コンクリート造 2階建" },
    tags: ["pool", "seaside", "minimal"],
    image: unsplash("photo-1600596542815-ffad4c1539a9"),
  },
  {
    id: "nha-pho-lam-chan-nang-hai-chau",
    name: { vi: "Nhà phố lam chắn nắng Hải Châu", ja: "ハイチャウ 日除けルーバーのタウンハウス" },
    category: "townhouse",
    region: "central",
    location: { vi: "Hải Châu, Đà Nẵng", ja: "ダナン市 ハイチャウ区" },
    structure: { vi: "Bê tông cốt thép · 4 tầng", ja: "鉄筋コンクリート造 4階建" },
    tags: ["louver", "green", "bim"],
    image: unsplash("photo-1600573472592-401b489a3cdc"),
  },
  {
    id: "biet-thu-hop-trang-phu-quoc",
    name: { vi: "Biệt thự khối hộp trắng Phú Quốc", ja: "フーコック 白いキューブ型ヴィラ" },
    category: "resortVilla",
    region: "south",
    location: { vi: "Phú Quốc, Kiên Giang", ja: "キエンザン省 フーコック市" },
    structure: { vi: "Bê tông cốt thép · 1 tầng", ja: "鉄筋コンクリート造 平屋建" },
    tags: ["pool", "minimal", "seaside"],
    image: unsplash("photo-1512917774080-9991f1c4c750"),
  },
  {
    id: "nha-pho-toi-gian-tay-ho",
    name: { vi: "Nhà phố tối giản màu trắng Tây Hồ", ja: "タイホー 白のミニマルな住まい" },
    category: "townhouse",
    region: "north",
    location: { vi: "Tây Hồ, Hà Nội", ja: "ハノイ市 タイホー区" },
    structure: { vi: "Bê tông cốt thép · 3 tầng", ja: "鉄筋コンクリート造 3階建" },
    tags: ["minimal", "smart"],
    image: unsplash("photo-1523217582562-09d0def993a6"),
  },
  {
    id: "biet-thu-bac-thang-ha-long",
    name: { vi: "Biệt thự bậc thang hướng biển Hạ Long", ja: "ハロン 海を望む段丘状のヴィラ" },
    category: "resortVilla",
    region: "north",
    location: { vi: "Hạ Long, Quảng Ninh", ja: "クアンニン省 ハロン市" },
    structure: { vi: "Bê tông cốt thép · 4 tầng", ja: "鉄筋コンクリート造 4階建" },
    tags: ["seaside", "bim", "designBuild"],
    image: unsplash("photo-1512915922686-57c11dde9b6b"),
  },
  {
    id: "biet-thu-san-vuon-thu-dau-mot",
    name: { vi: "Biệt thự sân vườn hồ bơi Thủ Dầu Một", ja: "トゥーザウモット 庭とプールのある邸宅" },
    category: "villa",
    region: "south",
    location: { vi: "Thủ Dầu Một, Bình Dương", ja: "ビンズオン省 トゥーザウモット市" },
    structure: { vi: "Bê tông cốt thép · 2 tầng", ja: "鉄筋コンクリート造 2階建" },
    tags: ["garden", "pool"],
    image: unsplash("photo-1564013799919-ab600027ffc6"),
  },
  {
    id: "nha-mot-tang-ho-boi-cu-chi",
    name: { vi: "Nhà một tầng hồ bơi Củ Chi", ja: "クチ プールのある平屋" },
    category: "bungalow",
    region: "south",
    location: { vi: "Củ Chi, TP. Hồ Chí Minh", ja: "ホーチミン市 クチ県" },
    structure: { vi: "Bê tông cốt thép · 1 tầng", ja: "鉄筋コンクリート造 平屋建" },
    tags: ["pool", "garden", "solar"],
    image: unsplash("photo-1582268611958-ebfd161ef9cf"),
  },
  {
    id: "biet-thu-tren-doi-da-lat",
    name: { vi: "Biệt thự trên đồi Đà Lạt", ja: "ダラット 丘の上の邸宅" },
    category: "villa",
    region: "central",
    location: { vi: "Đà Lạt, Lâm Đồng", ja: "ラムドン省 ダラット市" },
    structure: { vi: "Bê tông cốt thép · 2 tầng", ja: "鉄筋コンクリート造 2階建" },
    tags: ["pool", "smart", "designBuild"],
    image: unsplash("photo-1599809275671-b5942cabc7a2"),
  },
  {
    id: "nha-pho-ba-tang-cau-giay",
    name: { vi: "Nhà phố ba tầng Cầu Giấy", ja: "カウザイ 3階建てのタウンハウス" },
    category: "townhouse",
    region: "north",
    location: { vi: "Cầu Giấy, Hà Nội", ja: "ハノイ市 カウザイ区" },
    structure: { vi: "Bê tông cốt thép · 3 tầng", ja: "鉄筋コンクリート造 3階建" },
    tags: ["smart", "bim"],
    image: unsplash("photo-1494526585095-c41746248156"),
  },
  {
    id: "nha-go-mai-doc-da-lat",
    name: { vi: "Nhà gỗ mái dốc giữa rừng thông Đà Lạt", ja: "ダラット 松林に佇む切妻屋根の木の家" },
    category: "garden",
    region: "central",
    location: { vi: "Đà Lạt, Lâm Đồng", ja: "ラムドン省 ダラット市" },
    structure: { vi: "Khung gỗ – BTCT · 2 tầng", ja: "木造・RC混構造 2階建" },
    tags: ["wood", "garden", "green"],
    image: unsplash("photo-1568605114967-8130f3a36994"),
  },
]

export type Option = { id: string; label: string }

export type Project = {
  id: string
  name: string
  categoryId: string
  category: string
  regionId: string
  location: string
  structure: string
  tagIds: string[]
  tags: string[]
  image: string
  /** Number of storeys (parsed from the structure line). */
  floors: number
  /** Higher-resolution source for the detail page. */
  imageLarge: string
  region: string
  isNew: boolean
  pickup: boolean
}

const options = (map: Record<string, L>, locale: Locale): Option[] =>
  Object.entries(map).map(([id, label]) => ({ id, label: label[locale] }))

const localize = (p: ProjectRaw, locale: Locale): Project => ({
  id: p.id,
  name: p.name[locale],
  categoryId: p.category,
  category: categories[p.category][locale],
  regionId: p.region,
  region: regions[p.region][locale],
  location: p.location[locale],
  structure: p.structure[locale],
  tagIds: p.tags,
  tags: p.tags.map((t) => tags[t][locale]),
  image: p.image,
  imageLarge: p.image.replace("w=900", "w=1800"),
  floors: Number(/(\d+) tầng/.exec(p.structure.vi)?.[1] ?? 1),
  isNew: !!p.isNew,
  pickup: !!p.pickup,
})

export function getProjects(locale: Locale): Project[] {
  return projects.map((p) => localize(p, locale))
}

export function getProjectIds(): string[] {
  return projects.map((p) => p.id)
}

export function getProject(locale: Locale, id: string): Project | undefined {
  const p = projects.find((x) => x.id === id)
  return p && localize(p, locale)
}

/**
 * Extra footage for the project film: a construction-site shot and an
 * interior shot (rotated across projects so neighbours differ).
 * Replace with each project's real site / interior photos when available.
 */
const SITE_SHOTS = [
  "photo-1541888946425-d81bb19240f5",
  "photo-1504307651254-35680f356dfd",
]
const INTERIOR_SHOTS = [
  "photo-1600607687939-ce8a6c25118c",
  "photo-1600566753086-00f18fb6b3ea",
  "photo-1593696140826-c58b021acf8b",
]

export function getFilmImages(id: string) {
  const i = Math.max(0, projects.findIndex((p) => p.id === id))
  return {
    site: unsplash(SITE_SHOTS[i % SITE_SHOTS.length]!, 1800),
    interior: unsplash(INTERIOR_SHOTS[i % INTERIOR_SHOTS.length]!, 1800),
  }
}

/** Up to `n` other projects, preferring the same category. */
export function getRelatedProjects(locale: Locale, id: string, n = 3): Project[] {
  const current = projects.find((x) => x.id === id)
  const others = projects.filter((x) => x.id !== id)
  const same = others.filter((x) => x.category === current?.category)
  const rest = others.filter((x) => x.category !== current?.category)
  return [...same, ...rest].slice(0, n).map((p) => localize(p, locale))
}

export function getProjectFilters(locale: Locale) {
  return {
    categories: options(categories, locale),
    regions: options(regions, locale),
    tags: options(tags, locale),
  }
}
