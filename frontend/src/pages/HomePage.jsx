import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ChartColumn,
  CloudSun,
  Droplets,
  Earth,
  Layers,
  Leaf,
  Map,
  Satellite,
  Target,
  ThermometerSun,
  Users,
} from "lucide-react";
import "./HomePage.css";

const features = [
  {
    title: "NDVI",
    subtitle: "Chỉ số thực vật",
    description: "Khảo sát sự phân bố và biến động của thảm thực vật qua ảnh vệ tinh.",
    icon: Leaf,
    tone: "green",
    to: "/map",
  },
  {
    title: "LST",
    subtitle: "Nhiệt độ bề mặt",
    description: "Phân tích sự phân bố nhiệt độ bề mặt đất theo thời gian.",
    icon: ThermometerSun,
    tone: "coral",
    to: "/map",
  },
  {
    title: "TVDI",
    subtitle: "Chỉ số khô hạn",
    description: "Theo dõi điều kiện khô hạn tương đối bằng dữ liệu viễn thám.",
    icon: Droplets,
    tone: "blue",
    to: "/drought",
  },
  {
    title: "Khí hậu",
    subtitle: "Nhiệt độ & lượng mưa",
    description: "Khám phá dữ liệu khí tượng và xu hướng biến đổi theo thời gian.",
    icon: CloudSun,
    tone: "sky",
    to: "/climate",
  },
  {
    title: "Thống kê",
    subtitle: "Biểu đồ & dữ liệu",
    description: "Tổng hợp các kết quả phân tích và xuất dữ liệu phục vụ nghiên cứu.",
    icon: ChartColumn,
    tone: "mint",
    to: "/statistics",
  },
  {
    title: "Bài báo khoa học",
    subtitle: "Chia sẻ nghiên cứu",
    description: "Đọc và gửi bài báo khoa học để quản trị viên xét duyệt.",
    icon: BookOpen,
    tone: "purple",
    to: "/articles",
  },
];

const info = [
  {
    title: "Mục tiêu",
    description:
      "Hỗ trợ quan sát, phân tích và đánh giá biến động môi trường trên địa bàn nghiên cứu.",
    icon: Target,
    tone: "green",
  },
  {
    title: "Nguồn dữ liệu",
    description:
      "Kết hợp dữ liệu viễn thám Landsat, thông tin khí hậu ERA5-Land và Google Earth Engine.",
    icon: Layers,
    tone: "blue",
  },
  {
    title: "Đối tượng sử dụng",
    description:
      "Phục vụ học tập, nghiên cứu và tham khảo trong quản lý tài nguyên, môi trường.",
    icon: Users,
    tone: "purple",
  },
];

export default function HomePage() {
  return (
    <div className="webgis-home">
      <section className="webgis-home-hero" aria-labelledby="home-hero-title">
        <div className="webgis-home-hero-shade" />
        <div className="webgis-home-hero-inner">
          <div className="webgis-home-hero-copy">
            <div className="webgis-home-eyebrow">
              <Satellite size={16} aria-hidden="true" />
              HỆ THỐNG WEBGIS QUẢNG TRỊ
            </div>
            <h1 id="home-hero-title">
              Nền tảng phân tích môi trường và biến đổi khí hậu không gian
            </h1>
            <p>
              Tích hợp ảnh vệ tinh, dữ liệu khí tượng và Google Earth Engine để
              khám phá thảm thực vật, nhiệt độ bề mặt và tình trạng khô hạn tại
              Quảng Trị.
            </p>
            <div className="webgis-home-hero-actions">
              <Link className="webgis-home-button webgis-home-button-primary" to="/map">
                <Map size={18} aria-hidden="true" />
                Khám phá bản đồ
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <a className="webgis-home-button webgis-home-button-outline" href="#gioi-thieu">
                Tìm hiểu hệ thống
              </a>
            </div>
          </div>
          <div className="webgis-home-location-card">
            <div className="webgis-home-location-title">
              <Earth size={22} aria-hidden="true" />
              Khu vực nghiên cứu
            </div>
            <strong>Quảng Trị, Việt Nam</strong>
            <span>Phân tích dữ liệu môi trường bằng công nghệ GIS và viễn thám</span>
            <div className="webgis-home-location-divider" />
            <small>Nguồn dữ liệu: Landsat · ERA5-Land · GEE</small>
          </div>
        </div>
      </section>

      <div className="webgis-home-content">
        <section className="webgis-home-feature-strip" aria-label="Các chức năng chính">
          {features.map(({ title, subtitle, icon: Icon, tone, to }) => (
            <Link key={title} to={to} className="webgis-home-feature-shortcut">
              <span className={`webgis-home-icon webgis-home-icon-${tone}`}>
                <Icon size={23} aria-hidden="true" />
              </span>
              <span>
                <strong>{title}</strong>
                <small>{subtitle}</small>
              </span>
            </Link>
          ))}
        </section>

        <section className="webgis-home-intro" id="gioi-thieu">
          <div className="webgis-home-intro-copy">
            <span className="webgis-home-kicker">VỀ DỰ ÁN</span>
            <h2>Giới thiệu hệ thống</h2>
            <div className="webgis-home-heading-rule" />
            <p>
              WebGIS Quảng Trị là hệ thống ứng dụng công nghệ viễn thám,
              Google Earth Engine (GEE) và hệ thống thông tin địa lý (GIS)
              nhằm trực quan hóa, phân tích và tổng hợp thông tin môi trường,
              khí hậu phục vụ nghiên cứu tại tỉnh Quảng Trị.
            </p>
            <Link to="/dashboard" className="webgis-home-text-link">
              Xem tổng quan dữ liệu <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="webgis-home-info-grid">
            {info.map(({ title, description, icon: Icon, tone }) => (
              <article className={`webgis-home-info-card webgis-home-info-${tone}`} key={title}>
                <span className={`webgis-home-icon webgis-home-icon-${tone}`}>
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="webgis-home-explore" aria-labelledby="home-explore-title">
          <div className="webgis-home-section-heading">
            <div>
              <span className="webgis-home-kicker">KHÁM PHÁ</span>
              <h2 id="home-explore-title">Các công cụ phân tích</h2>
            </div>
            <Link to="/map" className="webgis-home-text-link">
              Mở bản đồ WebGIS <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="webgis-home-tools-grid">
            {features.map(({ title, description, icon: Icon, tone, to }) => (
              <Link to={to} className="webgis-home-tool-card" key={title}>
                <span className={`webgis-home-icon webgis-home-icon-${tone}`}>
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="webgis-home-tool-link">
                  Truy cập chức năng <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>
        <footer className="webgis-home-footer">
          <span>WebGIS Quảng Trị · Hệ thống phân tích môi trường và khí hậu</span>
          <Link to="/articles">Khám phá bài báo khoa học</Link>
        </footer>
      </div>
    </div>
  );
}
