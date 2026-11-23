/**
 * Events: site tours of finished / under-construction buildings, exhibitions
 * and seminars (placeholder content — replace with real events).
 * Text is stored per locale; dates, images, categories and areas are shared.
 */
import type { Locale } from "@/lib/i18n/types"
import { regions } from "@/lib/projects"

type L = Record<Locale, string>

const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const eventCategories = {
  completionTour: { vi: "Tham quan công trình hoàn thiện", ja: "竣工見学会" },
  structureTour: { vi: "Tham quan kết cấu", ja: "構造見学会" },
  expo: { vi: "Triển lãm công trình", ja: "建物博覧会" },
  seminar: { vi: "Hội thảo – Tư vấn", ja: "セミナー・相談会" },
} satisfies Record<string, L>

type CategoryId = keyof typeof eventCategories
type AreaId = keyof typeof regions

type EventRaw = {
  id: string
  title: L
  categories: CategoryId[]
  area: AreaId
  /** ISO dates (yyyy-mm-dd), one per event day. */
  dates: string[]
  time: string
  venue: L
  access: L
  lead: L
  image: string
  /** Last update of the listing (ISO). */
  updated: string
  free: boolean
  reservation: boolean
  /** Shown on the home page. */
  pickup?: boolean
  detail: {
    kind: "building" | "program"
    name?: L
    rows: [L, L][]
  }
}

const events: EventRaw[] = [
  {
    id: "tham-quan-chung-cu-quan-7",
    title: {
      vi: "[TP. Hồ Chí Minh] 26–27/11 Tham quan chung cư vừa hoàn thiện",
      ja: "【ホーチミン市】11/26（木）・27（金）竣工マンション見学会を開催！",
    },
    categories: ["completionTour", "expo"],
    area: "south",
    dates: ["2026-11-26", "2026-11-27"],
    time: "08:30 – 16:30",
    venue: { vi: "15 Nguyễn Lương Bằng, Quận 7, TP. Hồ Chí Minh", ja: "ホーチミン市7区 グエンルオンバン通り15番地" },
    access: {
      vi: "Cách cầu Phú Mỹ khoảng 5 phút đi xe. Có chỗ để xe máy; không có chỗ đậu ô tô, vui lòng sử dụng taxi.",
      ja: "フーミー橋から車で約5分。バイク置場あり、駐車場はございませんのでタクシーをご利用ください。",
    },
    lead: {
      vi: "Chung cư 12 tầng do TRANEX thiết kế BIM và thi công trọn gói vừa hoàn thiện. Quý khách có thể tham quan căn hộ mẫu, khu tiện ích và hệ thống kỹ thuật trước khi bàn giao. Sự kiện tổ chức theo hình thức đặt lịch trước.",
      ja: "TRANEXがBIM設計・一括施工を手がけた12階建てマンションが竣工しました。お引き渡し前のモデルルーム、共用施設、設備をご見学いただけます。完全予約制での開催です。",
    },
    image: unsplash("photo-1545324418-cc1a3fa10c00", 1400),
    updated: "2026-10-30",
    free: true,
    reservation: true,
    pickup: true,
    detail: {
      kind: "building",
      name: { vi: "Chung cư TRANEX Riverside", ja: "TRANEX リバーサイド" },
      rows: [
        [{ vi: "Kết cấu", ja: "構造" }, { vi: "Bê tông cốt thép · 12 tầng nổi, 1 tầng hầm", ja: "鉄筋コンクリート造 地上12階・地下1階" }],
        [{ vi: "Số căn hộ", ja: "総戸数" }, { vi: "96 căn", ja: "96戸" }],
        [{ vi: "Loại căn hộ", ja: "間取り" }, { vi: "1 – 3 phòng ngủ (45 – 98 m²)", ja: "1LDK〜3LDK（45〜98㎡）" }],
        [{ vi: "Diện tích đất", ja: "敷地面積" }, { vi: "1.850 m²", ja: "1,850㎡" }],
        [{ vi: "Điểm nổi bật", ja: "特徴" }, { vi: "Thiết kế và quản lý thi công bằng BIM, mặt đứng lam nhôm chắn nắng, sân vườn trên mái", ja: "BIMによる設計・施工管理、アルミ日除けルーバーのファサード、屋上庭園" }],
      ],
    },
  },
  {
    id: "trien-lam-tranex-2026-ha-noi",
    title: {
      vi: "[Hà Nội] 24–25/11 Triển lãm công trình & giải pháp TRANEX 2026",
      ja: "【ハノイ】11/24（火）・25（水）TRANEX建築・ソリューション展示会2026",
    },
    categories: ["expo"],
    area: "north",
    dates: ["2026-11-24", "2026-11-25"],
    time: "09:00 – 17:00",
    venue: { vi: "Trung tâm Hội nghị Quốc gia, Phạm Hùng, Nam Từ Liêm, Hà Nội", ja: "ハノイ市ナムトゥーリエム区 国家会議センター" },
    access: {
      vi: "Có bãi đậu ô tô và xe máy miễn phí cho khách tham dự. Xe buýt tuyến 34, 39 dừng trước cổng.",
      ja: "来場者用の無料駐車場・駐輪場あり。34・39番バスが正面に停車します。",
    },
    lead: {
      vi: "Triển lãm giới thiệu các công trình tiêu biểu, mô hình BIM tương tác, cấu kiện bê tông đúc sẵn và vật liệu mới. Đội ngũ kỹ sư TRANEX tư vấn trực tiếp cho từng dự án của quý khách.",
      ja: "代表的な施工実績、インタラクティブなBIMモデル、プレキャスト部材、新しい建材をご紹介します。TRANEXのエンジニアが個別のご計画にその場でお答えします。",
    },
    image: unsplash("photo-1582268611958-ebfd161ef9cf", 1400),
    updated: "2026-10-20",
    free: true,
    reservation: false,
    pickup: true,
    detail: {
      kind: "program",
      rows: [
        [{ vi: "Khu A", ja: "Aゾーン" }, { vi: "Công trình tiêu biểu: nhà ở, khách sạn, nhà máy, bệnh viện", ja: "施工実績：住宅・ホテル・工場・病院" }],
        [{ vi: "Khu B", ja: "Bゾーン" }, { vi: "Trải nghiệm mô hình BIM & thực tế ảo công trình", ja: "BIMモデル・VR体験" }],
        [{ vi: "Khu C", ja: "Cゾーン" }, { vi: "Cấu kiện bê tông đúc sẵn, vật liệu và máy thi công", ja: "プレキャスト部材・建材・建設機械" }],
        [{ vi: "10:00 & 14:00", ja: "10:00・14:00" }, { vi: "Tọa đàm: Xu hướng xây dựng xanh và chuyển đổi số", ja: "トークセッション：グリーン建築とDXの最新動向" }],
      ],
    },
  },
  {
    id: "tham-quan-ket-cau-nha-xuong-binh-duong",
    title: {
      vi: "[Bình Dương] 03/12 Tham quan kết cấu nhà xưởng đang thi công",
      ja: "【ビンズオン省】12/3（木）建設中工場の構造見学会を開催！",
    },
    categories: ["structureTour"],
    area: "south",
    dates: ["2026-12-03"],
    time: "08:30 – 11:30",
    venue: { vi: "KCN VSIP II, TP. Tân Uyên, Bình Dương", ja: "ビンズオン省タンウエン市 VSIP II工業団地" },
    access: {
      vi: "Công trường đang thi công: quý khách vui lòng mang giày bệt; mũ và áo bảo hộ được phát tại cổng. Có chỗ đậu ô tô.",
      ja: "工事中の現場です。歩きやすい靴でお越しください。ヘルメット・ベストは受付でお渡しします。駐車場あり。",
    },
    lead: {
      vi: "Cơ hội xem tận mắt phần kết cấu thường bị che khuất sau khi hoàn thiện: móng cọc, khung thép tiền chế và cấu kiện bê tông đúc sẵn do TRANEX sản xuất. Kỹ sư hiện trường thuyết minh chi tiết quy trình kiểm soát chất lượng.",
      ja: "完成後は見えなくなる杭基礎、鉄骨フレーム、TRANEX製プレキャスト部材を間近でご覧いただけます。現場エンジニアが品質管理のプロセスを詳しくご説明します。",
    },
    image: unsplash("photo-1541888946425-d81bb19240f5", 1400),
    updated: "2026-11-10",
    free: true,
    reservation: true,
    detail: {
      kind: "building",
      name: { vi: "Nhà xưởng sản xuất linh kiện điện tử", ja: "電子部品製造工場" },
      rows: [
        [{ vi: "Kết cấu", ja: "構造" }, { vi: "Khung thép tiền chế, móng cọc BTCT ly tâm", ja: "鉄骨造（プレエンジニアリング）・PHC杭基礎" }],
        [{ vi: "Diện tích sàn", ja: "延床面積" }, { vi: "12.000 m²", ja: "12,000㎡" }],
        [{ vi: "Tiến độ", ja: "進捗" }, { vi: "Đang lắp dựng kết cấu mái", ja: "屋根鉄骨建方中" }],
        [{ vi: "Điểm tham quan", ja: "見どころ" }, { vi: "Liên kết bu lông cường độ cao, dầm bê tông đúc sẵn, sàn chịu tải nặng", ja: "高力ボルト接合、PC梁、重荷重床" }],
      ],
    },
  },
  {
    id: "hoi-thao-bim-da-nang",
    title: {
      vi: "[Đà Nẵng] 10/12 Hội thảo “Ứng dụng BIM cho chủ đầu tư”",
      ja: "【ダナン】12/10（木）セミナー「施主のためのBIM活用」を開催！",
    },
    categories: ["seminar"],
    area: "central",
    dates: ["2026-12-10"],
    time: "14:00 – 17:00",
    venue: { vi: "Khách sạn Novotel Đà Nẵng, 36 Bạch Đằng, Hải Châu, Đà Nẵng", ja: "ダナン市ハイチャウ区 バクダン通り36番地 ノボテル・ダナン" },
    access: {
      vi: "Khách sạn có bãi đậu xe (miễn phí 3 giờ cho người tham dự). Số chỗ có hạn: 60 người.",
      ja: "ホテル駐車場あり（参加者は3時間無料）。定員60名。",
    },
    lead: {
      vi: "Hội thảo dành cho chủ đầu tư và ban quản lý dự án: BIM giúp kiểm soát chi phí, tiến độ và chất lượng như thế nào. Sau hội thảo, quý khách có thể đặt lịch tư vấn riêng với kỹ sư TRANEX.",
      ja: "施主・プロジェクト管理者向けに、BIMによるコスト・工期・品質管理の効果をご紹介します。セミナー後はTRANEXエンジニアとの個別相談も承ります。",
    },
    image: unsplash("photo-1517048676732-d65bc937f952", 1400),
    updated: "2026-11-12",
    free: true,
    reservation: true,
    detail: {
      kind: "program",
      rows: [
        [{ vi: "14:00", ja: "14:00" }, { vi: "BIM là gì và vì sao chủ đầu tư nên quan tâm", ja: "BIMとは何か ― 施主が知っておきたいポイント" }],
        [{ vi: "14:45", ja: "14:45" }, { vi: "Case study: dự án khách sạn 15 tầng tiết kiệm 8% chi phí", ja: "事例紹介：15階建てホテルでコスト8%削減" }],
        [{ vi: "15:45", ja: "15:45" }, { vi: "Trình diễn mô hình BIM tương tác", ja: "BIMモデルのデモンストレーション" }],
        [{ vi: "16:15", ja: "16:15" }, { vi: "Hỏi đáp & tư vấn riêng", ja: "質疑応答・個別相談" }],
      ],
    },
  },
  {
    id: "tham-quan-biet-thu-thu-duc",
    title: {
      vi: "[TP. Thủ Đức] 12–13/12 Tham quan nhà vườn ốp gỗ vừa bàn giao",
      ja: "【トゥードゥック市】12/12（土）・13（日）木質外装の庭付き住宅 竣工見学会",
    },
    categories: ["completionTour"],
    area: "south",
    dates: ["2026-12-12", "2026-12-13"],
    time: "09:00 – 17:00",
    venue: { vi: "Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh", ja: "ホーチミン市トゥードゥック市 タオディエン地区" },
    access: {
      vi: "Địa chỉ chính xác được gửi qua email sau khi đặt lịch. Có chỗ đậu 2 ô tô.",
      ja: "詳しい所在地はご予約後にメールでお知らせします。駐車場2台分あり。",
    },
    lead: {
      vi: "Nhà vườn hai tầng ốp gỗ dưới tán cây cổ thụ được giữ lại, phòng khách vách kính mở ra sân vườn. Gia chủ đồng ý mở cửa cho tham quan trong hai ngày trước khi chuyển vào ở.",
      ja: "保存した大樹の下に建つ2階建ての木質外装住宅。ガラス張りのリビングが庭へとひらきます。お施主様のご厚意により、お引越し前の2日間限定で公開します。",
    },
    image: unsplash("photo-1600585154340-be6161a56a0c", 1400),
    updated: "2026-11-18",
    free: true,
    reservation: true,
    detail: {
      kind: "building",
      name: { vi: "Nhà vườn ốp gỗ dưới tán cây cổ thụ", ja: "大樹の下に建つ木質外装の家" },
      rows: [
        [{ vi: "Kết cấu", ja: "構造" }, { vi: "Bê tông cốt thép · 2 tầng", ja: "鉄筋コンクリート造 2階建" }],
        [{ vi: "Diện tích sàn", ja: "延床面積" }, { vi: "210 m²", ja: "210㎡" }],
        [{ vi: "Công năng", ja: "間取り" }, { vi: "4 phòng ngủ, phòng khách – bếp liên thông, sân vườn", ja: "4LDK＋庭" }],
        [{ vi: "Điểm nổi bật", ja: "特徴" }, { vi: "Giữ lại cây cổ thụ, ốp gỗ tự nhiên, vách kính Low-E", ja: "既存樹の保存、天然木外装、Low-E複層ガラス" }],
      ],
    },
  },
  {
    id: "tham-quan-khach-san-nha-trang",
    title: {
      vi: "[Khánh Hòa] 17/12 Tham quan khách sạn ven biển vừa hoàn thiện",
      ja: "【カインホア省】12/17（木）海辺のホテル 竣工見学会を開催！",
    },
    categories: ["completionTour", "expo"],
    area: "central",
    dates: ["2026-12-17"],
    time: "09:00 – 16:00",
    venue: { vi: "Đường Trần Phú, TP. Nha Trang, Khánh Hòa", ja: "カインホア省ニャチャン市 チャンフー通り" },
    access: {
      vi: "Cách sân bay Cam Ranh khoảng 40 phút đi xe. Có bãi đậu xe trong khuôn viên.",
      ja: "カムラン空港から車で約40分。敷地内駐車場あり。",
    },
    lead: {
      vi: "Khách sạn 15 tầng hướng biển, thi công bằng cấu kiện đúc sẵn giúp rút ngắn 3 tháng tiến độ. Tham quan phòng mẫu, sảnh, hồ bơi tràn bờ và khu kỹ thuật.",
      ja: "プレキャスト工法で工期を3か月短縮した、海に面した15階建てホテル。客室、ロビー、インフィニティプール、機械室をご見学いただけます。",
    },
    image: unsplash("photo-1551882547-ff40c63fe5fa", 1400),
    updated: "2026-11-20",
    free: true,
    reservation: true,
    detail: {
      kind: "building",
      name: { vi: "Khách sạn Ocean View Nha Trang", ja: "オーシャンビュー ニャチャン" },
      rows: [
        [{ vi: "Kết cấu", ja: "構造" }, { vi: "BTCT kết hợp cấu kiện đúc sẵn · 15 tầng", ja: "RC造・PC工法併用 地上15階" }],
        [{ vi: "Số phòng", ja: "客室数" }, { vi: "180 phòng", ja: "180室" }],
        [{ vi: "Diện tích sàn", ja: "延床面積" }, { vi: "14.500 m²", ja: "14,500㎡" }],
        [{ vi: "Điểm nổi bật", ja: "特徴" }, { vi: "Hồ bơi tràn bờ tầng mái, lam chắn nắng, hệ thống quản lý năng lượng", ja: "屋上インフィニティプール、日除けルーバー、エネルギー管理システム" }],
      ],
    },
  },
  {
    id: "trien-lam-nha-o-tp-hcm-2027",
    title: {
      vi: "[TP. Hồ Chí Minh] 09–10/01/2027 Triển lãm nhà ở & vật liệu xanh",
      ja: "【ホーチミン市】2027/1/9（土）・10（日）住宅・グリーン建材展",
    },
    categories: ["expo", "seminar"],
    area: "south",
    dates: ["2027-01-09", "2027-01-10"],
    time: "09:00 – 18:00",
    venue: { vi: "Trung tâm Hội chợ & Triển lãm SECC, Quận 7, TP. Hồ Chí Minh", ja: "ホーチミン市7区 SECC展示会場" },
    access: {
      vi: "Có bãi đậu xe trong khuôn viên SECC. Gian hàng TRANEX: Hall B, B-12.",
      ja: "SECC敷地内に駐車場あり。TRANEXブース：Bホール B-12。",
    },
    lead: {
      vi: "Gian hàng TRANEX giới thiệu mẫu nhà ở tiết kiệm năng lượng, vật liệu xanh và giải pháp điện mặt trời áp mái. Đặt lịch trước để nhận tư vấn thiết kế miễn phí tại gian hàng.",
      ja: "省エネ住宅のモデル、グリーン建材、屋根置き太陽光発電をご紹介します。事前予約で、ブースにて無料設計相談を承ります。",
    },
    image: unsplash("photo-1600596542815-ffad4c1539a9", 1400),
    updated: "2026-11-21",
    free: true,
    reservation: false,
    detail: {
      kind: "program",
      rows: [
        [{ vi: "Trưng bày", ja: "展示" }, { vi: "Mô hình nhà ở tiết kiệm năng lượng tỷ lệ 1:20", ja: "省エネ住宅模型（1/20）" }],
        [{ vi: "Vật liệu", ja: "建材" }, { vi: "Gạch không nung, kính Low-E, sơn cách nhiệt", ja: "無焼成ブロック、Low-Eガラス、遮熱塗料" }],
        [{ vi: "Tư vấn", ja: "相談会" }, { vi: "Tư vấn thiết kế & dự toán miễn phí (đặt lịch trước)", ja: "設計・お見積りの無料相談（要予約）" }],
      ],
    },
  },
  {
    id: "tham-quan-truong-mam-non-hai-phong",
    title: {
      vi: "[Hải Phòng] 12/11 Tham quan trường mầm non vừa hoàn thiện",
      ja: "【ハイフォン】11/12（木）保育園 竣工見学会を開催！",
    },
    categories: ["completionTour"],
    area: "north",
    dates: ["2026-11-12"],
    time: "08:30 – 15:30",
    venue: { vi: "Quận Lê Chân, TP. Hải Phòng", ja: "ハイフォン市レチャン区" },
    access: {
      vi: "Có chỗ đậu ô tô trong sân trường.",
      ja: "敷地内に駐車場あり。",
    },
    lead: {
      vi: "Trường mầm non 3 tầng với sân chơi trên mái, vật liệu an toàn cho trẻ và hệ thống thông gió tự nhiên.",
      ja: "屋上園庭、子どもにやさしい素材、自然換気を備えた3階建ての保育園です。",
    },
    image: unsplash("photo-1503676260728-1c00da094a0b", 1400),
    updated: "2026-10-15",
    free: true,
    reservation: true,
    detail: {
      kind: "building",
      name: { vi: "Trường mầm non Hoa Sen", ja: "ホアセン保育園" },
      rows: [
        [{ vi: "Kết cấu", ja: "構造" }, { vi: "Bê tông cốt thép · 3 tầng", ja: "鉄筋コンクリート造 3階建" }],
        [{ vi: "Quy mô", ja: "規模" }, { vi: "12 lớp học, 350 trẻ", ja: "12クラス・園児350名" }],
        [{ vi: "Điểm nổi bật", ja: "特徴" }, { vi: "Sân chơi trên mái, thông gió tự nhiên, sàn chống trượt", ja: "屋上園庭、自然換気、防滑床" }],
      ],
    },
  },
  {
    id: "tham-quan-ket-cau-benh-vien-hue",
    title: {
      vi: "[Huế] 05/11 Tham quan kết cấu bệnh viện đang thi công",
      ja: "【フエ】11/5（木）建設中病院の構造見学会を開催！",
    },
    categories: ["structureTour"],
    area: "central",
    dates: ["2026-11-05"],
    time: "08:30 – 11:30",
    venue: { vi: "Phường An Cựu, TP. Huế", ja: "フエ市アンクー地区" },
    access: {
      vi: "Công trường đang thi công: vui lòng mang giày bệt; đồ bảo hộ được phát tại cổng.",
      ja: "工事中の現場です。歩きやすい靴でお越しください。保護具は受付でお渡しします。",
    },
    lead: {
      vi: "Tham quan hệ kết cấu chống động đất, sàn không dầm và hệ thống kỹ thuật MEP đi trước trong công trình bệnh viện 9 tầng.",
      ja: "9階建て病院の耐震構造、フラットスラブ、先行施工のMEP設備をご見学いただけます。",
    },
    image: unsplash("photo-1538108149393-fbbd81895907", 1400),
    updated: "2026-10-10",
    free: true,
    reservation: true,
    detail: {
      kind: "building",
      name: { vi: "Bệnh viện đa khoa An Cựu", ja: "アンクー総合病院" },
      rows: [
        [{ vi: "Kết cấu", ja: "構造" }, { vi: "BTCT, sàn phẳng không dầm · 9 tầng", ja: "RC造フラットスラブ 地上9階" }],
        [{ vi: "Quy mô", ja: "規模" }, { vi: "250 giường bệnh", ja: "250床" }],
        [{ vi: "Tiến độ", ja: "進捗" }, { vi: "Hoàn thành kết cấu tầng 6", ja: "6階躯体完了" }],
      ],
    },
  },
  {
    id: "hoi-thao-be-tong-duc-san-ha-noi",
    title: {
      vi: "[Hà Nội] 22/10 Hội thảo “Bê tông đúc sẵn – rút ngắn tiến độ”",
      ja: "【ハノイ】10/22（木）セミナー「プレキャストで工期短縮」を開催！",
    },
    categories: ["seminar"],
    area: "north",
    dates: ["2026-10-22"],
    time: "14:00 – 16:30",
    venue: { vi: "Văn phòng TRANEX Hà Nội, Cầu Giấy, Hà Nội", ja: "ハノイ市カウザイ区 TRANEXハノイ事務所" },
    access: {
      vi: "Có chỗ để xe máy tại tầng hầm tòa nhà.",
      ja: "ビル地下にバイク置場あり。",
    },
    lead: {
      vi: "Giới thiệu quy trình sản xuất, vận chuyển và lắp dựng cấu kiện bê tông đúc sẵn, cùng các dự án đã rút ngắn 20–30% thời gian thi công.",
      ja: "プレキャスト部材の製造・運搬・建方の流れと、工期を20〜30%短縮した事例をご紹介します。",
    },
    image: unsplash("photo-1504307651254-35680f356dfd", 1400),
    updated: "2026-09-30",
    free: true,
    reservation: true,
    detail: {
      kind: "program",
      rows: [
        [{ vi: "14:00", ja: "14:00" }, { vi: "Tổng quan công nghệ bê tông đúc sẵn", ja: "プレキャスト技術の概要" }],
        [{ vi: "14:45", ja: "14:45" }, { vi: "Case study các dự án nhà xưởng và chung cư", ja: "工場・マンションの事例紹介" }],
        [{ vi: "15:45", ja: "15:45" }, { vi: "Hỏi đáp", ja: "質疑応答" }],
      ],
    },
  },
]

/* ------------------------------------------------------------------ */

export type EventItem = {
  id: string
  title: string
  categoryIds: string[]
  categories: string[]
  areaId: string
  area: string
  dates: string[]
  /** Human-readable event days. */
  dateText: string
  time: string
  venue: string
  /** Google Maps search link for the venue. */
  mapHref: string
  access: string
  lead: string
  image: string
  updated: string
  free: boolean
  reservation: boolean
  pickup: boolean
  detail: { kind: "building" | "program"; name?: string; rows: [string, string][] }
}

const WEEKDAY: Record<Locale, string[]> = {
  vi: ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
  ja: ["日", "月", "火", "水", "木", "金", "土"],
}

const parse = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number) as [number, number, number]
  return { y, m, d, wd: new Date(Date.UTC(y, m - 1, d)).getUTCDay() }
}
const pad = (n: number) => String(n).padStart(2, "0")

/** "26/11/2026 (Thứ 5) – 27/11/2026 (Thứ 6)" / "2026年11月26日（木）・27日（金）" */
export function formatDates(dates: string[], locale: Locale) {
  const ds = dates.map(parse)
  if (locale === "ja")
    return ds
      .map((p, i) => {
        const prev = ds[i - 1]
        const head =
          i === 0 || prev!.y !== p.y ? `${p.y}年${p.m}月` : prev!.m !== p.m ? `${p.m}月` : ""
        return `${head}${p.d}日（${WEEKDAY.ja[p.wd]}）`
      })
      .join("・")
  return ds.map((p) => `${pad(p.d)}/${pad(p.m)}/${p.y} (${WEEKDAY.vi[p.wd]})`).join(" – ")
}

/** "2026.10.30" */
export const formatDot = (iso: string) => iso.replaceAll("-", ".")

const localize = (e: EventRaw, locale: Locale): EventItem => ({
  id: e.id,
  title: e.title[locale],
  categoryIds: e.categories,
  categories: e.categories.map((c) => eventCategories[c][locale]),
  areaId: e.area,
  area: regions[e.area][locale],
  dates: e.dates,
  dateText: formatDates(e.dates, locale),
  time: e.time,
  venue: e.venue[locale],
  mapHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.venue.vi)}`,
  access: e.access[locale],
  lead: e.lead[locale],
  image: e.image,
  updated: e.updated,
  free: e.free,
  reservation: e.reservation,
  pickup: !!e.pickup,
  detail: {
    kind: e.detail.kind,
    name: e.detail.name?.[locale],
    rows: e.detail.rows.map(([k, v]) => [k[locale], v[locale]]),
  },
})

/** All events, latest event date first. */
export function getEvents(locale: Locale): EventItem[] {
  return [...events]
    .sort((a, b) => b.dates[0]!.localeCompare(a.dates[0]!))
    .map((e) => localize(e, locale))
}

export const getEventIds = () => events.map((e) => e.id)

export function getEvent(locale: Locale, id: string): EventItem | undefined {
  const e = events.find((x) => x.id === id)
  return e && localize(e, locale)
}

/** Latest listing update, for the "updated" line on the list page. */
export const lastUpdated = () => formatDot(events.map((e) => e.updated).sort().at(-1)!)

/** Up to `n` other events, preferring ones with a shared category. */
export function getOtherEvents(locale: Locale, id: string, n = 3): EventItem[] {
  const current = events.find((e) => e.id === id)
  const others = getEvents(locale).filter((e) => e.id !== id)
  const shared = others.filter((e) => e.categoryIds.some((c) => current?.categories.includes(c as CategoryId)))
  const rest = others.filter((e) => !shared.includes(e))
  return [...shared, ...rest].slice(0, n)
}
