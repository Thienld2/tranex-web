import { img } from "./images"
import type { Content, NavLink } from "./types"
import { vi } from "./vi"

// Icons and images are shared with the Vietnamese content; only text differs.
const serviceText = [
  {
    title: "設計コンサルティング",
    description:
      "戸建住宅、ヴィラ、ホテル、マンション、工場、高齢者施設、保育園、クリニック、病院などの設計。",
  },
  {
    title: "BIMサービス",
    description:
      "BIMモデル作成、設計図・施工図のアウトソーシング、点群データからのモデル化。",
  },
  {
    title: "プレキャストコンクリート",
    description: "道路・橋梁および建築向けのプレキャストコンクリート製品。",
  },
  {
    title: "建設資材",
    description: "あらゆる工事に応える、高品質な建設資材。",
  },
  {
    title: "建設機械",
    description: "最新の建設機械の販売・レンタルで、効率的な施工を支援。",
  },
]
const services = vi.services.items.map((s, i) => ({ ...s, ...serviceText[i]! }))

const typeTitles = [
  "戸建住宅",
  "ヴィラ・邸宅",
  "ホテル・リゾート",
  "マンション",
  "工場・物流施設",
  "高齢者施設",
  "保育園・学校",
  "クリニック・病院",
]
const buildingTypes = vi.buildingTypes.items.map((b, i) => ({
  ...b,
  title: typeTitles[i]!,
}))

const challengeLinks: NavLink[] = [
  { label: "プロジェクトストーリー", href: "#thu-thach" },
  { label: "施工実績", href: "/ja/du-an" },
  { label: "TRANEXのBIM技術", href: "#thu-thach" },
  { label: "TRANEXスピリッツ", href: "#thu-thach" },
  { label: "お客様の声", href: "#thu-thach" },
]

const companyLinks: NavLink[] = [
  { label: "トップメッセージ", href: "#cong-ty" },
  { label: "会社概要", href: "#cong-ty" },
  { label: "企業理念", href: "#cong-ty" },
  { label: "事業所一覧", href: "#cong-ty" },
  { label: "保有設備・機械", href: "#cong-ty" },
  { label: "認証・許認可", href: "#cong-ty" },
  { label: "戦略パートナー", href: "#cong-ty" },
  { label: "サステナビリティ", href: "#cong-ty" },
]

export const ja: Content = {
  locale: "ja",
  meta: {
    title: "TRANEX | テクノロジーでつなぎ、未来を創る",
    description:
      "TRANEXは、設計コンサルティング、BIM、プレキャストコンクリート、建設資材、建設機械まで、建設分野のトータルソリューションを提供します。",
  },
  company: {
    legalName: "TRANEX Co., Ltd.",
    tagline: "テクノロジーでつなぎ、未来を創る。",
    address: "ベトナム ホーチミン市 XYZ区 ABC通り123番地",
    phone: "(+84) 28 1234 5678",
    phoneHref: "tel:+842812345678",
    hours: "月～金 8:00～17:30（ベトナム時間）",
    email: "info@tranex.vn",
  },
  ui: {
    mainNav: "メインナビゲーション",
    siteMap: "サイトマップ",
    quickLinks: "クイックリンク",
    language: "言語",
    openMenu: "メニューを開く",
    closeMenu: "メニューを閉じる",
    closeNotice: "お知らせを閉じる",
    backToTop: "ページの先頭へ",
    hotline: "お電話",
    overviewSuffix: "トップ",
    viewAll: "一覧へ",
    viewDetails: "詳しくはこちら",
    free: "無料",
    requestProfile: "会社案内資料のご請求",
    requestProfileSubject: "会社案内資料のご請求",
    contactConsult: "お問い合わせ・ご相談",
    callNow: "電話する",
    policies: ["サイトポリシー", "個人情報保護方針", "サイトマップ"],
  },
  nav: [
    { label: "ホーム", href: "/ja" },
    {
      label: "会社紹介",
      href: "#cong-ty",
      children: companyLinks,
      image: img.navCompany,
    },
    {
      label: "事業領域",
      href: "#giai-phap",
      children: [
        ...services.map((s) => ({ label: s.title, href: "#giai-phap" })),
        { label: "建築カテゴリー", href: "#cong-trinh" },
      ],
      image: img.navSolutions,
    },
    { label: "施工実績", href: "/ja/du-an" },
    { label: "ニュース", href: "#tin-tuc" },
    { label: "採用情報", href: "#noi-bat" },
    { label: "お問い合わせ", href: "#lien-he" },
  ],
  sideTabs: ["資料請求・お問い合わせ", "イベント", "施工実績"],
  hero: {
    ariaLabel: "TRANEX – テクノロジーでつなぎ、未来を創る",
    eyebrow: "Nexus for a better future",
    titleLines: ["テクノロジーでつなぎ、", "未来を創る。"],
    description:
      "設計コンサルティング、BIM、プレキャストコンクリート、建設資材、建設機械――TRANEXは、持続可能な建物づくりのすべての工程に寄り添います。",
    images: [
      { src: img.heroCity, alt: "上空から見た近代的な都市の全景" },
      { src: img.heroTowers, alt: "空へ伸びる高層ビル群" },
      { src: img.heroFacade, alt: "多層のファサードを持つ現代建築" },
    ],
    notice: {
      tag: "イベント",
      title: "TRANEX建築展示会2026",
      image: img.notice,
      href: "#tin-tuc",
    },
  },
  news: {
    title: "ニュース",
    items: [
      {
        date: "2026.11.05",
        tag: "ニュースリリース",
        title: "TRANEXのコーポレートサイトを公開しました",
      },
      {
        date: "2026.10.28",
        tag: "トピックス",
        title: "ベトナム建設業界におけるBIM活用の最新動向",
      },
      {
        date: "2026.10.15",
        tag: "採用",
        title: "BIMエンジニア募集 ― TRANEXで共に成長しませんか",
      },
      {
        date: "2026.09.20",
        tag: "ニュースリリース",
        title: "日本企業とのパートナーシップを拡大しました",
      },
    ],
  },
  events: {
    title: "イベント情報",
    items: [
      {
        tags: ["見学会", "竣工物件"],
        date: "2026年11月26日(木)・27日(金)",
        title: "【ホーチミン市】竣工マンション見学会を開催",
        image: img.eventApartment,
      },
      {
        tags: ["展示会", "イベント"],
        date: "2026年11月24日(火)・25日(水)",
        title: "【ハノイ】TRANEX建築・ソリューション展示会2026",
        image: img.eventExpo,
      },
    ],
  },
  consulting: {
    label: "設計コンサルティング・建設ソリューション",
    titleLines: ["建物ごとに、", "最適なソリューションを。"],
    description:
      "構想・設計からBIM、建設資材、建設機械まで。何十年先も価値を生み続ける建物のために、ワンストップでソリューションをご提供します。",
    image: img.consulting,
    imageAlt: "お客様と打ち合わせをするTRANEXのスタッフ",
  },
  services: {
    eyebrow: "事業領域",
    title: "建設のすべてを、ワンストップで。",
    viewAll: "すべての事業を見る",
    items: services,
  },
  buildingTypes: {
    title: "建築カテゴリー",
    sub: "住宅から産業施設、医療施設まで、幅広い用途の設計実績があります。",
    viewAll: "建築カテゴリー一覧",
    items: buildingTypes,
  },
  support: [
    {
      title: "積算・お見積り",
      description: "初期段階から透明性の高い積算で、コストを最適化します。",
      icon: vi.support[0]!.icon,
    },
    {
      title: "保証・技術サポート",
      description: "お引き渡し後も、運用・メンテナンスをサポートします。",
      icon: vi.support[1]!.icon,
    },
  ],
  crane: {
    image: img.crane,
    alt: "青空の下、建設現場に立つタワークレーン",
  },
  challenge: {
    titleLines: ["日々の挑戦が、", "次の建物をつくる。"],
    links: challengeLinks,
    stories: [
      {
        tag: "プロジェクトストーリー",
        title: "施工のデジタル化 ― TRANEXのBIM活用への挑戦",
        image: img.storyBim,
        size: "lg",
      },
      {
        tag: "施工実績",
        title: "工業団地内の工場・物流施設",
        image: img.storyFactory,
        size: "md",
      },
      {
        tag: "TRANEXスピリッツ",
        title: "お客様の立場で考える ― TRANEXの仕事の流儀",
        image: img.storySpirit,
        size: "md",
      },
      {
        tag: "施工実績",
        title: "ガラスファサードが映える複合オフィス",
        image: img.storyOffice,
        size: "wide",
      },
      {
        tag: "お客様の声",
        title: "海辺のリゾート ― 工期厳守、期待以上の仕上がり",
        image: img.storyResort,
        size: "md",
      },
      {
        tag: "技術",
        title: "改修工事のための点群データモデリング",
        image: img.storyPointCloud,
        size: "md",
      },
      {
        tag: "施工実績",
        title: "緑に包まれる庭付きヴィラ",
        image: img.storyVilla,
        size: "wide",
      },
    ],
  },
  about: {
    label: "会社案内",
    titleLines: ["ひとつの建物に、", "長く続く約束を。"],
    paragraphs: [
      "建物の向こうには、そこで暮らし、働き、長い時間を過ごす人々がいます。",
      "だからこそTRANEXは、図面やBIMモデルから部材・資材の一つひとつに至るまで細部にこだわり、時を経ても価値の続く建物を目指します。",
      "私たちがお引き渡しするのは、建物だけではありません。品質と安心という約束です。",
    ],
    cards: [
      { title: "TRANEXについて", image: img.aboutCompany },
      { title: "数字で見るTRANEX" },
      { title: "TRANEXの歩み", image: img.aboutHistory },
    ],
    links: companyLinks,
  },
  pickup: {
    title: "ピックアップ",
    items: [
      {
        eyebrow: "TRANEX Group",
        title: "企業紹介動画",
        image: img.pickupVideo,
        tone: "brand",
      },
      {
        eyebrow: "Recruit 2026",
        title: "採用情報 ― 共に未来を創る仲間へ",
        image: img.pickupRecruit,
        tone: "dark",
      },
      {
        eyebrow: "Company Profile",
        title: "TRANEX 会社案内資料",
        image: img.pickupProfile,
        tone: "light",
      },
    ],
  },
  contactCta: {
    lines: ["建設のご計画はありますか？", "まずはTRANEXにお気軽にご相談ください。"],
    note: "会社概要、BIMソリューション、施工実績などをご紹介しています。",
    brochures: vi.contactCta.brochures,
  },
  projectsPage: {
    metaTitle: "施工実績 | TRANEX",
    metaDescription:
      "TRANEXが設計・施工を手がけたタウンハウス、邸宅、リゾートヴィラ、庭付き住宅、平屋などの住宅実績をご紹介します。",
    breadcrumbHome: "ホーム",
    title: "施工実績",
    pickupTitle: "ピックアップ",
    searchTitle: "施工実績を探す",
    filters: {
      category: "施設用途",
      region: "地域",
      tag: "タグ",
      keyword: "フリーワード",
      keywordPlaceholder: "物件名・所在地など",
    },
    search: "検索する",
    reset: "条件をリセット",
    listTitle: "施工実績一覧",
    location: "所在地",
    resultCount: "{n}件",
    empty: "条件に該当する施工実績がありません。条件を変更して再度お試しください。",
    prev: "前へ",
    next: "次へ",
    last: "最後",
  },
  projectDetail: {
    simTitle: "施工プロセスのシミュレーション",
    scrollHint: "スクロールしてご覧ください",
    skip: "スキップ",
    introTagline: "図面から、住まいへ。",
    plan: {
      title: "配置図",
      scale: "S = 1:200",
      street: "前面道路",
      sidewalk: "歩道",
      sea: "海",
      garden: "庭",
      rooms: {
        living: "LDK",
        kitchen: "キッチン",
        bed: "寝室",
        bath: "浴室",
        garage: "ガレージ",
        stair: "階段",
        terrace: "テラス",
      },
    },
    scenes: [
      {
        label: "構想・設計",
        before: "",
        accent: "構想",
        after: "から",
        description:
          "スケッチ、設計図面、BIM 3Dモデル。着工前に、すべてのディテールを検討します。",
      },
      {
        label: "基礎・躯体",
        before: "",
        accent: "施工",
        after: "へ",
        description:
          "基礎・柱・梁・床を施工。打設ごとにコンクリートの品質を厳しく管理します。",
      },
      {
        label: "仕上げ",
        before: "",
        accent: "仕上げ",
        after: "へ",
        description:
          "外壁・屋根・塗装・タイル・サッシ。素材が重なり、住まいがかたちになっていきます。",
      },
      {
        label: "お引き渡し",
        before: "",
        accent: "住まい",
        after: "へ",
        description:
          "竣工検査を経てお引き渡し。施主様の新しい暮らしが、ここから始まります。",
      },
      {
        label: "住空間",
        before: "ようこそ、",
        accent: "わが家",
        after: "へ",
        description:
          "光と素材、そして使いやすさが調和する、毎日を過ごす空間へ。",
      },
    ],
    infoTitle: "物件概要",
    fields: {
      category: "施設用途",
      region: "地域",
      location: "所在地",
      structure: "構造・規模",
      features: "特徴",
    },
    overview:
      "{name}は、TRANEXが建築コンセプト、BIMモデルから施工・仕上げまで一貫して手がけたプロジェクトです。品質・工期・コストを各工程で厳しく管理し、施主様の想いをかたちにした、長く快適に暮らせる住まいを実現しました。",
    relatedTitle: "その他の施工実績",
    backToList: "施工実績一覧へ戻る",
    viewDetail: "詳しく見る",
  },
}
