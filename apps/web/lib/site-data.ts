import {
  Blocks,
  BrickWall,
  Cuboid,
  DraftingCompass,
  Forklift,
  type LucideIcon,
} from "lucide-react"

/** Build an Unsplash URL; next/image resizes it further per device. */
const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

export const navItems: NavItem[] = [
  { label: "Trang chủ", href: "/" },
  {
    label: "Giới thiệu",
    href: "#gioi-thieu",
    children: [
      { label: "Về TRANEX", href: "#gioi-thieu" },
      { label: "Tầm nhìn & sứ mệnh", href: "#gioi-thieu" },
      { label: "Đội ngũ chuyên gia", href: "#gioi-thieu" },
    ],
  },
  {
    label: "Lĩnh vực hoạt động",
    href: "#linh-vuc",
    children: [
      { label: "Tư vấn thiết kế", href: "#linh-vuc" },
      { label: "Dịch vụ BIM", href: "#linh-vuc" },
      { label: "Bê tông đúc sẵn", href: "#linh-vuc" },
      { label: "Vật liệu xây dựng", href: "#linh-vuc" },
      { label: "Máy thi công", href: "#linh-vuc" },
    ],
  },
  { label: "Dự án tiêu biểu", href: "#du-an" },
  { label: "Tin tức", href: "#tin-tuc" },
  { label: "Tuyển dụng", href: "#tin-tuc" },
  { label: "Liên hệ", href: "#lien-he" },
]

export type HeroSlide = {
  eyebrow: string
  titleTop: string
  titleBottom: string
  description: string
  cta: { label: string; href: string }
  image: string
  alt: string
}

export const heroSlides: HeroSlide[] = [
  {
    eyebrow: "Công ty TNHH TRANEX",
    titleTop: "Kết nối công nghệ",
    titleBottom: "Kiến tạo tương lai",
    description:
      "TRANEX mang đến các giải pháp toàn diện trong lĩnh vực xây dựng, từ tư vấn thiết kế, BIM, bê tông đúc sẵn, vật liệu xây dựng đến máy thi công. Chúng tôi đồng hành cùng khách hàng để kiến tạo những công trình bền vững, hiện đại và giá trị lâu dài.",
    cta: { label: "Khám phá các lĩnh vực hoạt động", href: "#linh-vuc" },
    image: unsplash("photo-1477959858617-67f85cf4f1df", 2400),
    alt: "Toàn cảnh đô thị hiện đại nhìn từ trên cao",
  },
  {
    eyebrow: "Giải pháp BIM & thiết kế",
    titleTop: "Thiết kế thông minh",
    titleBottom: "Vận hành hiệu quả",
    description:
      "Ứng dụng mô hình thông tin công trình (BIM) xuyên suốt vòng đời dự án giúp tối ưu chi phí, rút ngắn tiến độ và nâng cao chất lượng thi công.",
    cta: { label: "Tìm hiểu dịch vụ BIM", href: "#linh-vuc" },
    image: unsplash("photo-1565008447742-97f6f38c985c", 2400),
    alt: "Các tòa nhà cao tầng đang thi công với cần cẩu",
  },
  {
    eyebrow: "Chất lượng là nền tảng",
    titleTop: "Công trình vững bền",
    titleBottom: "Đồng hành lâu dài",
    description:
      "Đội ngũ kỹ sư giàu kinh nghiệm cùng hệ thống vật liệu, thiết bị hiện đại giúp mỗi công trình đạt chuẩn chất lượng, tiến độ và an toàn.",
    cta: { label: "Xem dự án tiêu biểu", href: "#du-an" },
    image: unsplash("photo-1541976590-713941681591", 2400),
    alt: "Mặt đứng tòa nhà hiện đại",
  },
]

export type Service = {
  title: string
  description: string
  image: string
  icon: LucideIcon
}

export const services: Service[] = [
  {
    title: "Tư vấn thiết kế",
    description:
      "Thiết kế nhà phố, biệt thự, khách sạn, chung cư, nhà máy, viện dưỡng lão, nhà trẻ, phòng khám tư nhân, bệnh viện.",
    image: unsplash("photo-1580587771525-78b9dba3b914", 900),
    icon: DraftingCompass,
  },
  {
    title: "Dịch vụ BIM",
    description:
      "Dựng mô hình BIM, outsource bản vẽ thiết kế, bản vẽ thi công, dựng mô hình từ tengun data.",
    image: unsplash("photo-1503387762-592deb58ef4e", 900),
    icon: Cuboid,
  },
  {
    title: "Bê tông đúc sẵn",
    description: "Cấu kiện bê tông đúc sẵn cho cầu đường, dân dụng.",
    image: unsplash("photo-1541888946425-d81bb19240f5", 900),
    icon: Blocks,
  },
  {
    title: "Vật liệu xây dựng",
    description: "Vật liệu chất lượng, đáp ứng mọi công trình.",
    image: unsplash("photo-1504307651254-35680f356dfd", 900),
    icon: BrickWall,
  },
  {
    title: "Máy thi công",
    description: "Cung cấp và cho thuê máy thi công hiện đại, hiệu quả.",
    image: unsplash("photo-1517089596392-fb9a9033e05b", 900),
    icon: Forklift,
  },
]

export const about = {
  title: ["Đồng hành cùng bạn", "kiến tạo những công trình bền vững"],
  description:
    "TRANEX là đơn vị hoạt động trong lĩnh vực xây dựng và giải pháp kỹ thuật, với đội ngũ chuyên gia giàu kinh nghiệm, luôn hướng đến chất lượng, tiến độ và sự hài lòng của khách hàng.",
  image: unsplash("photo-1486406146926-c627a92ad1ab", 700),
}

export type Project = {
  title: string
  tags: string[]
  image: string
}

export const projects: Project[] = [
  {
    title: "Dự án Nhà máy tại KCN",
    tags: ["Thiết kế", "BIM", "Thi công"],
    image: unsplash("photo-1513828583688-c52646db42da", 1000),
  },
  {
    title: "Khu biệt thự nghỉ dưỡng ven biển",
    tags: ["Thiết kế", "Thi công"],
    image: unsplash("photo-1600596542815-ffad4c1539a9", 1000),
  },
  {
    title: "Tổ hợp nhà cao tầng",
    tags: ["BIM", "Vật liệu", "Thi công"],
    image: unsplash("photo-1531834685032-c34bf0d84c77", 1000),
  },
  {
    title: "Văn phòng điều hành",
    tags: ["Thiết kế", "Nội thất"],
    image: unsplash("photo-1497366216548-37526070297c", 1000),
  },
]

export type NewsItem = {
  title: string
  date: string
  image: string
}

export const news: NewsItem[] = [
  {
    title: "Tranex chính thức ra mắt website công ty",
    date: "05/11/2026",
    image: unsplash("photo-1449157291145-7efd050a4d0e", 300),
  },
  {
    title: "Xu hướng BIM trong ngành xây dựng hiện nay",
    date: "28/10/2026",
    image: unsplash("photo-1581094794329-c8112a89af12", 300),
  },
  {
    title: "Tuyển dụng kỹ sư BIM – Cơ hội phát triển cùng Tranex",
    date: "15/10/2026",
    image: unsplash("photo-1621905251189-08b45d6a269e", 300),
  },
]

export const contact = {
  address: "Số 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh, Việt Nam",
  phone: "(+84) 28 1234 5678",
  phoneHref: "tel:+842812345678",
  email: "info@tranex.vn",
}
