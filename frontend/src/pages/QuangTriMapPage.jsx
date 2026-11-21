
import QuangTriMap from "../components/QuangTriMap";

export default function QuangTriMapPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>WebGIS tỉnh Quảng Trị trước sáp nhập 2025</h2>
      <p>
        Bản đồ ranh giới hành chính được cung cấp
        từ PostgreSQL/PostGIS và GeoServer WMS.
      </p>

      <QuangTriMap />
    </div>
  );
}