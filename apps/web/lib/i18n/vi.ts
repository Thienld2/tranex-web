import {
  BimIcon,
  DesignIcon,
  EstimateIcon,
  ExcavatorIcon,
  HandBuildingIcon,
  MaterialsIcon,
  PrecastIcon,
} from "@/components/icons"

import { img } from "./images"
import type { Content, NavLink } from "./types"

const services = [
  {
    title: "Tư vấn thiết kế",
    description:
      "Thiết kế nhà phố, biệt thự, khách sạn, chung cư, nhà máy, viện dưỡng lão, nhà trẻ, phòng khám, bệnh viện.",
    image: img.serviceDesign,
    icon: DesignIcon,
  },
  {
    title: "Dịch vụ BIM",
    description:
      "Dựng mô hình BIM, outsource bản vẽ thiết kế, bản vẽ thi công, dựng mô hình từ tengun data.",
    image: img.serviceBim,
    icon: BimIcon,
  },
  {
    title: "Bê tông đúc sẵn",
    description: "Cấu kiện bê tông đúc sẵn cho cầu đường, dân dụng.",
    image: img.servicePrecast,
    icon: PrecastIcon,
  },
  {
    title: "Vật liệu xây dựng",
    description: "Vật liệu chất lượng, đáp ứng mọi công trình.",
    image: img.serviceMaterials,
    icon: MaterialsIcon,
  },
  {
    title: "Máy thi công",
    description: "Cung cấp và cho thuê máy thi công hiện đại, hiệu quả.",
    image: img.serviceMachines,
    icon: ExcavatorIcon,
  },
]

const buildingTypes = [
  { title: "Nhà phố", image: img.typeTownhouse },
  { title: "Biệt thự", image: img.typeVilla },
  { title: "Khách sạn – Resort", image: img.typeHotel },
  { title: "Chung cư", image: img.typeApartment },
  { title: "Nhà máy – Kho xưởng", image: img.typeFactory },
  { title: "Viện dưỡng lão", image: img.typeElderly },
  { title: "Nhà trẻ – Trường học", image: img.typeSchool },
  { title: "Phòng khám – Bệnh viện", image: img.typeHospital },
]

const companyLinks: NavLink[] = [
  { label: "Thông điệp lãnh đạo", href: "#cong-ty" },
  { label: "Tổng quan công ty", href: "#cong-ty" },
  { label: "Triết lý kinh doanh", href: "#cong-ty" },
  { label: "Văn phòng & chi nhánh", href: "#cong-ty" },
  { label: "Năng lực thiết bị", href: "#cong-ty" },
  { label: "Chứng chỉ – Giấy phép", href: "#cong-ty" },
  { label: "Đối tác chiến lược", href: "#cong-ty" },
  { label: "Phát triển bền vững", href: "#cong-ty" },
]

export const vi: Content = {
  locale: "vi",
  meta: {
    title: "TRANEX | Kết nối công nghệ – Kiến tạo tương lai",
    description:
      "TRANEX cung cấp giải pháp toàn diện trong lĩnh vực xây dựng: tư vấn thiết kế, BIM, bê tông đúc sẵn, vật liệu xây dựng và máy thi công.",
  },
  company: {
    legalName: "Công ty TNHH TRANEX",
    tagline: "Kết nối công nghệ, kiến tạo tương lai.",
    address: "Số 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh, Việt Nam",
    phone: "(+84) 28 1234 5678",
    phoneHref: "tel:+842812345678",
    hours: "Thứ 2 – Thứ 6, 8:00 – 17:30",
    email: "info@tranex.vn",
  },
  ui: {
    mainNav: "Điều hướng chính",
    siteMap: "Sơ đồ trang",
    quickLinks: "Liên kết nhanh",
    language: "Ngôn ngữ",
    openMenu: "Mở menu",
    closeMenu: "Đóng menu",
    closeNotice: "Đóng thông báo",
    backToTop: "Lên đầu trang",
    hotline: "Hotline",
    overviewSuffix: " – Tổng quan",
    viewAll: "Xem tất cả",
    viewDetails: "Xem chi tiết",
    free: "Miễn phí",
    requestProfile: "Nhận hồ sơ năng lực",
    requestProfileSubject: "Yêu cầu hồ sơ năng lực",
    contactConsult: "Liên hệ tư vấn",
    callNow: "Gọi ngay",
    contactPanelTitle: "Hãy bắt đầu bằng việc nhận hồ sơ năng lực hoặc tư vấn",
    close: "Đóng",
    policies: ["Chính sách website", "Bảo mật thông tin", "Sơ đồ trang"],
  },
  nav: [
    { label: "Trang chủ", href: "/vi" },
    {
      label: "Giới thiệu công ty",
      href: "#cong-ty",
      children: companyLinks,
      image: img.navCompany,
    },
    {
      label: "Lĩnh vực hoạt động",
      href: "#giai-phap",
      children: services.map((s) => ({ label: s.title, href: "#giai-phap" })),
      image: img.navSolutions,
    },
    {
      label: "Danh mục kiến trúc",
      href: "#cong-trinh",
      children: [
        { label: "Nhà phố", href: "#cong-trinh" },
        { label: "Biệt thự", href: "#cong-trinh" },
        { label: "Khách sạn", href: "#cong-trinh" },
        { label: "Chung cư", href: "#cong-trinh" },
        { label: "Nhà máy", href: "#cong-trinh" },
        { label: "Viện dưỡng lão", href: "#cong-trinh" },
        { label: "Nhà trẻ", href: "#cong-trinh" },
        { label: "Phòng khám tư nhân", href: "#cong-trinh" },
        { label: "Bệnh viện", href: "#cong-trinh" },
      ],
      image: img.navTypes,
    },
    { label: "Thông tin tuyển dụng", href: "#noi-bat" },
    { label: "Liên hệ", href: "/vi/lien-he" },
  ],
  sideTabs: ["Hồ sơ năng lực · Liên hệ", "Sự kiện", "Dự án"],
  hero: {
    ariaLabel: "TRANEX – Kết nối công nghệ, kiến tạo tương lai",
    eyebrow: "Nexus for a better future",
    titleLines: ["Kết nối công nghệ,", "kiến tạo tương lai."],
    description:
      "Tư vấn thiết kế, BIM, bê tông đúc sẵn, vật liệu và máy thi công – TRANEX đồng hành cùng bạn trên từng công trình bền vững.",
    images: [
      { src: img.heroCity, alt: "Toàn cảnh đô thị hiện đại nhìn từ trên cao" },
      { src: img.heroTowers, alt: "Các tòa nhà cao tầng vươn lên bầu trời" },
      { src: img.heroFacade, alt: "Kiến trúc hiện đại với mặt đứng nhiều tầng" },
    ],
    notice: {
      tag: "Sự kiện",
      title: "Triển lãm công trình TRANEX 2026",
      image: img.notice,
      href: "#tin-tuc",
    },
  },
  news: {
    title: "Tin tức",
    items: [
      {
        date: "2026.11.05",
        tag: "Thông cáo",
        title: "TRANEX chính thức ra mắt website công ty",
      },
      {
        date: "2026.10.28",
        tag: "Chủ đề",
        title: "Xu hướng ứng dụng BIM trong ngành xây dựng Việt Nam",
      },
      {
        date: "2026.10.15",
        tag: "Tuyển dụng",
        title: "Tuyển dụng kỹ sư BIM – Cơ hội phát triển cùng TRANEX",
      },
      {
        date: "2026.09.20",
        tag: "Thông cáo",
        title: "TRANEX mở rộng hợp tác với các đối tác Nhật Bản",
      },
    ],
  },
  events: {
    title: "Sự kiện",
    items: [
      {
        tags: ["Tham quan", "Công trình"],
        date: "26/11/2026 (Thứ 5) – 27/11/2026 (Thứ 6)",
        title: "[TP. Hồ Chí Minh] Tham quan công trình chung cư vừa hoàn thiện",
        image: img.eventApartment,
      },
      {
        tags: ["Triển lãm", "Sự kiện"],
        date: "24/11/2026 (Thứ 3) – 25/11/2026 (Thứ 4)",
        title: "[Hà Nội] Triển lãm công trình & giải pháp TRANEX 2026",
        image: img.eventExpo,
      },
    ],
  },
  consulting: {
    label: "Tư vấn thiết kế · Giải pháp xây dựng",
    titleLines: ["Giải pháp đúng,", "cho từng công trình."],
    description:
      "Từ ý tưởng, thiết kế, mô hình BIM đến vật liệu và máy thi công – chúng tôi cung cấp trọn gói giải pháp để công trình của bạn vận hành bền vững trong nhiều thập kỷ.",
    image: img.consulting,
    imageAlt: "Đội ngũ TRANEX trao đổi cùng khách hàng",
  },
  services: {
    eyebrow: "Lĩnh vực hoạt động",
    title: "Giải pháp toàn diện cho ngành xây dựng",
    viewAll: "Xem tất cả lĩnh vực",
    items: services,
  },
  buildingTypes: {
    title: "Loại hình công trình",
    sub: "Kinh nghiệm thiết kế đa dạng loại hình, từ nhà ở đến công trình công nghiệp và y tế.",
    viewAll: "Tất cả loại hình",
    items: buildingTypes,
  },
  support: [
    {
      title: "Dự toán & báo giá",
      description: "Lập dự toán minh bạch, tối ưu chi phí ngay từ giai đoạn đầu.",
      icon: EstimateIcon,
    },
    {
      title: "Bảo hành & hỗ trợ kỹ thuật",
      description: "Đồng hành sau bàn giao, hỗ trợ vận hành và bảo trì công trình.",
      icon: HandBuildingIcon,
    },
  ],
  about: {
    label: "Về công ty",
    titleLines: ["Mỗi công trình,", "một cam kết lâu dài."],
    paragraphs: [
      "Phía sau mỗi công trình là những con người sẽ sống, làm việc và gắn bó cùng nó trong nhiều năm.",
      "Vì vậy TRANEX chú trọng từ chi tiết nhỏ nhất – từ bản vẽ, mô hình BIM đến từng cấu kiện và vật liệu – để công trình bền vững theo thời gian.",
      "Chúng tôi không chỉ bàn giao một công trình, mà trao gửi một cam kết về chất lượng và sự an tâm.",
    ],
    cards: [
      { title: "Về TRANEX", image: img.aboutCompany },
      { title: "TRANEX qua những con số" },
      { title: "Chặng đường phát triển", image: img.aboutHistory },
    ],
    links: companyLinks,
  },
  pickup: {
    title: "Nội dung nổi bật",
    items: [
      {
        eyebrow: "TRANEX Group",
        title: "Video giới thiệu doanh nghiệp",
        image: img.pickupVideo,
        tone: "brand",
      },
      {
        eyebrow: "Recruit 2026",
        title: "Tuyển dụng – Cùng kiến tạo tương lai",
        image: img.pickupRecruit,
        tone: "dark",
      },
      {
        eyebrow: "Company Profile",
        title: "Hồ sơ năng lực TRANEX",
        image: img.pickupProfile,
        tone: "light",
      },
    ],
  },
  contactCta: {
    lines: [
      "Bạn đang có kế hoạch xây dựng?",
      "Hãy bắt đầu bằng một cuộc trao đổi cùng TRANEX.",
    ],
    note: "Giới thiệu công ty, giải pháp BIM, dự án tiêu biểu…",
    brochures: [
      { label: "Company Profile", title: "TRANEX 2026", image: img.brochureProfile },
      { label: "Project Collection", title: "Design & Build", image: img.brochureProjects },
    ],
  },
  projectsPage: {
    metaTitle: "Dự án | TRANEX",
    metaDescription:
      "Các công trình nhà ở tiêu biểu do TRANEX thiết kế và thi công: nhà phố, biệt thự, biệt thự nghỉ dưỡng, nhà vườn, nhà một tầng…",
    breadcrumbHome: "Trang chủ",
    title: "Dự án",
    pickupTitle: "Dự án nổi bật",
    searchTitle: "Tìm kiếm dự án",
    filters: {
      category: "Loại công trình",
      region: "Khu vực",
      tag: "Đặc điểm",
      keyword: "Từ khóa",
      keywordPlaceholder: "Tên dự án, địa điểm…",
    },
    search: "Tìm kiếm",
    reset: "Xóa điều kiện",
    listTitle: "Danh sách dự án",
    location: "Địa điểm",
    resultCount: "{n} dự án",
    empty: "Không tìm thấy dự án phù hợp. Hãy thử thay đổi điều kiện tìm kiếm.",
    prev: "Trang trước",
    next: "Trang sau",
    last: "Cuối",
  },
  projectDetail: {
    simTitle: "Mô phỏng quá trình thi công",
    scrollHint: "Cuộn xuống để xem hành trình",
    skip: "Bỏ qua",
    introTagline: "Hành trình từ bản vẽ đến tổ ấm",
    plan: {
      title: "Mặt bằng tổng thể",
      scale: "Tỉ lệ 1:200",
      street: "Đường chính",
      sidewalk: "Vỉa hè",
      sea: "Biển",
      garden: "Sân vườn",
      rooms: {
        living: "P. khách",
        kitchen: "Bếp",
        bed: "P. ngủ",
        bath: "WC",
        garage: "Gara",
        stair: "Cầu thang",
        terrace: "Hiên",
      },
    },
    scenes: [
      {
        label: "Ý tưởng & bản vẽ",
        before: "Từ",
        accent: "ý tưởng",
        after: "",
        description:
          "Phác thảo, bản vẽ kiến trúc và mô hình BIM 3D – mọi chi tiết được tính toán trước khi khởi công.",
      },
      {
        label: "Móng & kết cấu",
        before: "đến",
        accent: "thi công",
        after: "",
        description:
          "Thi công móng, cột, dầm, sàn với quy trình kiểm soát chất lượng chặt chẽ sau mỗi đợt đổ bê tông.",
      },
      {
        label: "Hoàn thiện",
        before: "đến",
        accent: "hoàn thiện",
        after: "",
        description:
          "Xây thô, lợp mái, sơn bả, ốp lát, lắp kính – từng lớp vật liệu dần hiện thành hình.",
      },
      {
        label: "Bàn giao",
        before: "đến",
        accent: "tổ ấm",
        after: "",
        description:
          "Ngôi nhà được nghiệm thu và bàn giao, sẵn sàng cho những khoảnh khắc đầu tiên của gia chủ.",
      },
      {
        label: "Không gian sống",
        before: "Chào mừng",
        accent: "về nhà",
        after: "",
        description:
          "Bước vào bên trong – nơi ánh sáng, vật liệu và công năng hòa quyện cho cuộc sống mỗi ngày.",
      },
    ],
    infoTitle: "Thông tin dự án",
    fields: {
      category: "Loại công trình",
      region: "Khu vực",
      location: "Địa điểm",
      structure: "Kết cấu · Quy mô",
      features: "Đặc điểm",
    },
    overview:
      "{name} được TRANEX thực hiện trọn gói: từ ý tưởng kiến trúc, mô hình BIM đến thi công và hoàn thiện. Mỗi công đoạn đều được kiểm soát chặt chẽ về chất lượng, tiến độ và chi phí, mang đến cho gia chủ một không gian sống bền vững và đúng như kỳ vọng.",
    relatedTitle: "Dự án khác",
    backToList: "Quay lại danh sách dự án",
    viewDetail: "Xem chi tiết",
  },
  contactPage: {
    metaTitle: "Liên hệ | TRANEX",
    metaDescription:
      "Liên hệ TRANEX để được tư vấn thiết kế, BIM, thi công, nhận hồ sơ năng lực hoặc đăng ký trở thành đối tác.",
    breadcrumbHome: "Trang chủ",
    title: "Liên hệ",
    items: [
      {
        key: "consult",
        title: "Tư vấn & liên hệ",
      },
      {
        key: "plan",
        title: "Yêu cầu phương án & báo giá",
      },
      {
        key: "profile",
        title: "Nhận hồ sơ năng lực",
      },
      {
        key: "partner",
        title: "Đăng ký trở thành đối tác",
      },
    ],
    owner: {
      titleLines: ["Quý khách đã sở hữu", "công trình do TRANEX thi công?"],
      text: "Các yêu cầu bảo hành, bảo trì và hỗ trợ kỹ thuật sau bàn giao, vui lòng liên hệ bộ phận Chăm sóc khách hàng để được hỗ trợ nhanh nhất.",
      linkLabel: "Bảo hành & hỗ trợ kỹ thuật",
      image: img.contactOwner,
    },
    form: {
      title: "Biểu mẫu liên hệ",
      intro: "Vui lòng điền thông tin bên dưới. TRANEX sẽ phản hồi trong vòng 1–2 ngày làm việc.",
      name: "Họ và tên",
      company: "Công ty / Tổ chức",
      email: "Email",
      phone: "Số điện thoại",
      address: "Địa điểm công trình",
      message: "Nội dung",
      messagePlaceholder: "Mô tả nhu cầu, quy mô, thời gian dự kiến…",
      agree: "Tôi đồng ý với chính sách bảo mật thông tin của TRANEX",
      submit: "Gửi liên hệ",
      note: "Khi bấm gửi, ứng dụng email của bạn sẽ mở với nội dung đã điền sẵn.",
      sent: "Đã mở ứng dụng email. Vui lòng bấm Gửi trong ứng dụng email để hoàn tất.",
      errRequired: "Vui lòng nhập mục này.",
      errEmail: "Email không hợp lệ.",
    },
  },
}
