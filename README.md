# 🌍 WEBGIS QUẢNG TRỊ
## Hệ thống WebGIS giám sát môi trường và biến đổi khí hậu tại khu vực Quảng Trị

**Đồ án chuyên ngành – Hệ thống thông tin địa lý (GIS), Viễn thám và Công nghệ thông tin**

---

## 1. Giới thiệu đề tài

WebGIS Quảng Trị là hệ thống thông tin địa lý trên nền tảng Web, được xây dựng nhằm hỗ trợ quản lý, trực quan hóa và phân tích dữ liệu môi trường, khí hậu tại khu vực nghiên cứu Quảng Trị.

Hệ thống tích hợp công nghệ GIS, viễn thám, Google Earth Engine (GEE) và các công nghệ phát triển ứng dụng Web hiện đại nhằm cung cấp công cụ theo dõi sự biến động thảm thực vật, nhiệt độ bề mặt đất, mức độ khô hạn và các yếu tố khí hậu.

Thông qua giao diện trực quan, người dùng có thể khai thác dữ liệu không gian, xem bản đồ chuyên đề, thực hiện phân tích theo khoảng thời gian và theo dõi kết quả dưới dạng bản đồ, biểu đồ và bảng thống kê.

### 1.1. Mục tiêu

- Xây dựng hệ thống WebGIS hỗ trợ giám sát môi trường và biến đổi khí hậu tại Quảng Trị.
- Tích hợp dữ liệu viễn thám và khí hậu thông qua Google Earth Engine.
- Phân tích các chỉ số NDVI, LST và TVDI.
- Trực quan hóa dữ liệu trên bản đồ WebGIS.
- Thống kê và biểu diễn kết quả theo khoảng thời gian.
- Xây dựng hệ thống quản lý người dùng và phân quyền USER/ADMIN.
- Hỗ trợ đăng tải, quản lý và phê duyệt bài báo khoa học.
- Cung cấp nền tảng hỗ trợ nghiên cứu và khai thác thông tin môi trường.

### 1.2. Phạm vi nghiên cứu

- **Không gian:** Khu vực nghiên cứu Quảng Trị, Việt Nam.
- **Thời gian:** Theo khoảng thời gian được người dùng lựa chọn và phạm vi dữ liệu khả dụng.
- **Dữ liệu:** Ảnh vệ tinh Landsat, Sentinel-2 và dữ liệu khí hậu ERA5-Land.
- **Nền tảng xử lý:** Google Earth Engine.

---

## 2. Công nghệ sử dụng

| Thành phần | Công nghệ | Vai trò |
|---|---|---|
| Frontend | ReactJS, Vite | Xây dựng giao diện người dùng |
| Ngôn ngữ Frontend | JavaScript, JSX | Xử lý tương tác |
| Backend | Python, Flask | Xây dựng REST API |
| Cơ sở dữ liệu | PostgreSQL | Quản lý dữ liệu hệ thống |
| GIS và viễn thám | Google Earth Engine | Xử lý dữ liệu không gian và ảnh vệ tinh |
| Bản đồ Web | Các thư viện bản đồ tích hợp trong Frontend | Hiển thị bản đồ chuyên đề |
| Xác thực | JWT | Quản lý phiên đăng nhập |
| Google Login | Google Identity Services | Đăng nhập bằng tài khoản Google |
| Quản lý mã nguồn | Git, GitHub | Lưu trữ và quản lý phiên bản |
| Công cụ phát triển | Visual Studio Code | Phát triển hệ thống |

---

## 3. Các chức năng chính

### 3.1. Chức năng dành cho người dùng (USER)

**Trang chủ**

- Giới thiệu hệ thống WebGIS Quảng Trị.
- Giới thiệu mục tiêu và phạm vi nghiên cứu.
- Cung cấp thông tin về các chức năng phân tích môi trường.

**Đăng ký và đăng nhập**

- Đăng ký tài khoản bằng Email và mật khẩu.
- Đăng nhập bằng Email và mật khẩu.
- Hỗ trợ đăng nhập bằng tài khoản Google.
- Quản lý phiên đăng nhập thông qua JWT.

**Bản đồ WebGIS**

- Hiển thị bản đồ khu vực nghiên cứu.
- Trực quan hóa các lớp dữ liệu địa lý.
- Tương tác với bản đồ.
- Hiển thị các lớp thông tin môi trường.

**Phân tích NDVI**

NDVI (Normalized Difference Vegetation Index) là chỉ số thực vật chuẩn hóa, hỗ trợ đánh giá mức độ xanh và tình trạng thảm thực vật.

Công thức:

NDVI = (NIR - RED) / (NIR + RED)

Trong đó:

- NIR: Giá trị phản xạ phổ cận hồng ngoại.
- RED: Giá trị phản xạ phổ đỏ.

**Phân tích LST**

LST (Land Surface Temperature) là nhiệt độ bề mặt đất, được sử dụng trong nghiên cứu nhiệt độ bề mặt và môi trường đô thị.

**Giám sát hạn hán bằng TVDI**

TVDI (Temperature Vegetation Dryness Index) là chỉ số khô hạn dựa trên mối quan hệ giữa NDVI và LST.

Chỉ số này hỗ trợ đánh giá mức độ khô hạn tương đối trong khu vực nghiên cứu.

**Phân tích khí hậu**

- Khai thác dữ liệu khí hậu.
- Phân tích nhiệt độ và lượng mưa.
- Lựa chọn khoảng thời gian nghiên cứu.
- Hiển thị kết quả bằng biểu đồ và bảng thống kê.

**Thống kê dữ liệu**

- Tổng hợp kết quả phân tích.
- Hiển thị biểu đồ thống kê.
- Hỗ trợ theo dõi biến động môi trường theo thời gian.

**Bài báo khoa học**

- Xem danh sách bài báo đã được phê duyệt.
- Xem nội dung và thông tin bài báo.
- Gửi bài báo khoa học lên hệ thống.
- Theo dõi các bài báo đã gửi.

### 3.2. Chức năng dành cho quản trị viên (ADMIN)

**Dashboard quản trị**

- Hiển thị thông tin tổng quan của hệ thống.
- Theo dõi dữ liệu quản trị và hoạt động sử dụng.

**Quản lý người dùng**

- Xem danh sách tài khoản.
- Quản lý trạng thái tài khoản.
- Quản lý vai trò USER/ADMIN.

**Quản lý lớp bản đồ**

- Xem danh sách lớp dữ liệu.
- Cập nhật cấu hình lớp bản đồ.
- Quản lý trạng thái hiển thị.

**Quản lý bài báo khoa học**

- Xem danh sách bài báo được gửi lên.
- Kiểm tra thông tin bài báo.
- Phê duyệt hoặc từ chối bài báo.
- Quản lý trạng thái bài báo.

**Theo dõi hoạt động phân tích và xuất dữ liệu**

- Thống kê các hoạt động phân tích được ghi nhận.
- Theo dõi lịch sử xuất dữ liệu CSV nếu chức năng ghi nhận được kích hoạt.
- Tổng hợp số liệu phục vụ quản trị.

---

## 4. Cấu trúc thư mục dự án

```text
WebGIS_QuangTri/
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── extensions.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── security/
│   └── commands/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── database/
│   ├── sql/
│   └── usage_events.sql
│
├── data/
│   └── boundaries/
│
├── postman/
│
├── .gitignore
├── README.md
└── project_structure.txt
```

Một số tệp dữ liệu GIS và cấu hình bí mật không được đưa lên GitHub để bảo đảm dung lượng và an toàn thông tin.

---

## 5. Yêu cầu môi trường

Để chạy hệ thống, máy tính cần cài đặt:

- Python 3 và pip.
- Node.js và npm.
- PostgreSQL.
- Git.
- Trình duyệt Web hiện đại.
- Tài khoản Google Cloud có quyền sử dụng Google Earth Engine.

Phiên bản thư viện Python được quản lý thông qua `backend/requirements.txt`.

Phiên bản thư viện Frontend được quản lý thông qua `frontend/package.json` và `frontend/package-lock.json`.

---

## 6. Hướng dẫn cài đặt và chạy chương trình

### Bước 1. Tải mã nguồn

Mở Terminal hoặc PowerShell:

```bash
git clone https://github.com/phuonghoang123456/WebGIS_QuangTri.git
cd WebGIS_QuangTri
```

### Bước 2. Cài đặt Backend

Tạo môi trường Python:

```powershell
python -m venv .venv
```

Kích hoạt môi trường trên Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Cài đặt thư viện:

```powershell
python -m pip install -r backend/requirements.txt
```

Nếu `google-auth` chưa có trong danh sách phụ thuộc, cài đặt bổ sung:

```powershell
python -m pip install google-auth requests
```

### Bước 3. Cấu hình PostgreSQL

Tạo cơ sở dữ liệu có tên:

```sql
CREATE DATABASE webgis_quangtri;
```

Cấu hình thông tin kết nối PostgreSQL trong tệp `.env` được Backend sử dụng.

Ví dụ:

```dotenv
DATABASE_URL=postgresql+psycopg://webgis_app:YOUR_PASSWORD@127.0.0.1:5432/webgis_quangtri
```

Thay `YOUR_PASSWORD` bằng mật khẩu của tài khoản PostgreSQL đã được tạo và cấp quyền.

**Lưu ý:** Tệp `.env` chỉ sử dụng trên máy cục bộ, không đưa lên GitHub.

Các bảng dữ liệu và quyền truy cập phải được khởi tạo theo cấu trúc cơ sở dữ liệu của dự án trước khi chạy đầy đủ chức năng.

### Bước 4. Cấu hình Google Earth Engine

Hệ thống sử dụng Google Earth Engine để truy xuất và xử lý dữ liệu viễn thám.

Các thông số cấu hình tham khảo:

```dotenv
GEE_PROJECT=YOUR_GOOGLE_CLOUD_PROJECT
GEE_BOUNDARY_ASSET=YOUR_BOUNDARY_ASSET
```

Trong đó:

- `GEE_PROJECT`: Google Cloud Project được sử dụng cho Earth Engine.
- `GEE_BOUNDARY_ASSET`: Đường dẫn tài sản ranh giới khu vực nghiên cứu trên Google Earth Engine.

Cần cấp quyền phù hợp cho tài khoản hoặc môi trường chạy Backend để truy cập dữ liệu Earth Engine.

### Bước 5. Cấu hình Google Login

Tạo OAuth Client ID loại **Web application** trong Google Cloud Console.

Trong **Authorized JavaScript origins**, thêm:

```text
http://localhost:5173
http://127.0.0.1:5173
```

Frontend sử dụng:

```dotenv
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

Backend sử dụng:

```dotenv
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

Hai giá trị Client ID phải giống nhau.

Không lưu Google Client Secret trong mã nguồn Frontend.

### Bước 6. Khởi chạy Backend

Từ thư mục gốc:

```powershell
python -m flask --app backend.app run --host 127.0.0.1 --port 5000
```

Địa chỉ API:

```text
http://127.0.0.1:5000
```

Có thể kiểm tra:

```text
http://127.0.0.1:5000/api/health
```

### Bước 7. Cài đặt và chạy Frontend

Mở Terminal mới:

```powershell
cd frontend
npm install
npm run dev
```

Truy cập ứng dụng tại:

```text
http://127.0.0.1:5173
```

Nếu cổng 5173 đã được sử dụng, hãy dừng tiến trình Vite cũ trước khi khởi động lại.

### Bước 8. Kiểm tra bản build

Trong thư mục `frontend`:

```powershell
npm run build
```

Nếu lệnh hoàn thành thành công, mã nguồn Frontend đã vượt qua bước build sản phẩm.

---

## 7. Cơ sở dữ liệu

Hệ thống sử dụng PostgreSQL để lưu trữ dữ liệu tài khoản, phân quyền, lớp bản đồ, bài báo khoa học và nhật ký hoạt động.

Các nhóm dữ liệu chính:

| Bảng | Chức năng |
|---|---|
| `users` | Quản lý tài khoản và vai trò |
| `webgis_layers` | Quản lý cấu hình lớp bản đồ |
| `scientific_articles` | Quản lý bài báo khoa học |
| `usage_events` | Ghi nhận hoạt động sử dụng |

Các tệp SQL hiện có nằm trong thư mục `database/`.

**Lưu ý:** Để triển khai trên máy mới, cần chuẩn bị đầy đủ tập lệnh khởi tạo cấu trúc bảng, khóa chính, khóa ngoại, chỉ mục và dữ liệu mẫu. Các tệp SQL bổ sung phải tương thích với phiên bản Backend được công bố.

---

## 8. Tài khoản và phân quyền

Hệ thống có hai nhóm quyền chính.

| Vai trò | Quyền truy cập |
|---|---|
| USER | Sử dụng bản đồ, phân tích môi trường, xem và gửi bài báo |
| ADMIN | Quản trị người dùng, lớp bản đồ, bài báo và hoạt động hệ thống |

Người dùng có thể đăng ký tài khoản thông thường hoặc đăng nhập bằng Google nếu cấu hình OAuth hợp lệ.

Tài khoản Google mới được cấp vai trò USER theo mặc định.

Tài khoản ADMIN cần được tạo hoặc cấp quyền thông qua cơ chế quản trị được cho phép.

**Tài khoản kiểm thử:** Chưa công bố tài khoản mẫu trong repository. Khi chuẩn bị môi trường chấm đồ án, cần tạo tài khoản kiểm thử riêng và cung cấp thông tin truy cập cho giảng viên qua kênh phù hợp.

Không công khai mật khẩu quản trị đang sử dụng thực tế.

---

## 9. Các API chính

### 9.1. Xác thực

| Phương thức | API | Chức năng |
|---|---|---|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/google` | Đăng nhập Google |
| GET | `/api/auth/me` | Lấy thông tin tài khoản |
| POST | `/api/auth/logout` | Đăng xuất |

### 9.2. Bản đồ và viễn thám

| Phương thức | API | Chức năng |
|---|---|---|
| GET | `/api/boundary` | Ranh giới nghiên cứu |
| GET | `/api/ndvi/tiles` | Lớp bản đồ NDVI |
| GET | `/api/ndvi/statistics` | Thống kê NDVI |
| GET | `/api/lst/tiles` | Lớp bản đồ LST |
| GET | `/api/lst/statistics` | Thống kê LST |
| GET | `/api/tvdi/tiles` | Lớp bản đồ TVDI |
| GET | `/api/tvdi/statistics` | Thống kê TVDI |

### 9.3. Khí hậu và thống kê

| Phương thức | API | Chức năng |
|---|---|---|
| GET | `/api/climate/monthly` | Dữ liệu khí hậu theo tháng |
| GET | `/api/climate/summary` | Tổng hợp khí hậu |
| GET | `/api/statistics/dashboard` | Thống kê Dashboard |
| GET | `/api/statistics/index` | Thống kê chỉ số |

### 9.4. Bài báo khoa học

| Phương thức | API | Chức năng |
|---|---|---|
| GET | `/api/articles` | Danh sách bài báo |
| POST | `/api/articles` | Gửi bài báo |
| GET | `/api/articles/mine` | Bài báo của người dùng |
| GET | `/api/articles/admin` | Danh sách bài báo quản trị |
| PATCH | `/api/articles/{id}/review` | Phê duyệt hoặc từ chối |

### 9.5. Quản trị và nhật ký

| Phương thức | API | Chức năng |
|---|---|---|
| GET | `/api/admin/dashboard` | Dashboard ADMIN |
| GET | `/api/admin/users` | Danh sách người dùng |
| GET | `/api/admin/layers` | Danh sách lớp bản đồ |
| POST | `/api/usage/events` | Ghi nhận hoạt động |
| GET | `/api/admin/usage/events` | Lịch sử hoạt động |
| GET | `/api/admin/usage/summary` | Tổng hợp hoạt động |

Các API yêu cầu xác thực hoặc phân quyền phải được gọi bằng JWT hợp lệ.

---

## 10. Quy trình xử lý dữ liệu GIS

Quy trình xử lý dữ liệu tổng quát:

1. Xác định khu vực nghiên cứu Quảng Trị.
2. Thu thập dữ liệu ảnh vệ tinh và khí hậu.
3. Lọc dữ liệu theo phạm vi không gian và thời gian.
4. Tiền xử lý dữ liệu theo từng nguồn ảnh.
5. Tính toán chỉ số NDVI, LST hoặc TVDI.
6. Tổng hợp và thống kê kết quả.
7. Trực quan hóa dữ liệu trên WebGIS.
8. Phân tích và đánh giá kết quả nghiên cứu.

### 10.1. NDVI

NDVI được tính từ phổ cận hồng ngoại và phổ đỏ để đánh giá thảm thực vật.

### 10.2. LST

LST được xác định từ dữ liệu nhiệt phù hợp của ảnh vệ tinh, có xét đến đặc điểm sản phẩm dữ liệu được sử dụng.

### 10.3. TVDI

TVDI được xây dựng dựa trên mối quan hệ giữa NDVI và LST, sử dụng các đường biên khô và ướt để đánh giá độ khô hạn tương đối.

### 10.4. Dữ liệu khí hậu

Dữ liệu ERA5-Land được sử dụng để phân tích các yếu tố khí hậu như nhiệt độ và lượng mưa.

Các thuật toán, tham số và cách tiền xử lý cụ thể cần được đối chiếu với mã nguồn trong `backend/services/` và tài liệu nghiên cứu của đồ án.

---

## 11. Kiểm thử hệ thống

Các nhóm chức năng cần kiểm thử:

| STT | Chức năng | Kết quả mong đợi |
|---|---|---|
| 1 | Đăng ký tài khoản | Tạo tài khoản USER hợp lệ |
| 2 | Đăng nhập | Nhận JWT và truy cập đúng vai trò |
| 3 | Đăng nhập Google | Xác minh Google ID token hợp lệ |
| 4 | Bản đồ WebGIS | Hiển thị bản đồ và lớp dữ liệu |
| 5 | NDVI | Trả về lớp bản đồ và thống kê |
| 6 | LST | Trả về lớp bản đồ và thống kê |
| 7 | TVDI | Trả về lớp bản đồ và thống kê |
| 8 | Khí hậu | Hiển thị dữ liệu theo thời gian |
| 9 | Gửi bài báo | Lưu bài báo chờ xét duyệt |
| 10 | Duyệt bài báo | ADMIN cập nhật trạng thái |
| 11 | Quản lý người dùng | ADMIN quản lý tài khoản |
| 12 | Nhật ký hoạt động | Ghi nhận và thống kê sự kiện |

Bảng trên là danh sách ca kiểm thử đề xuất, không phải kết quả đã xác nhận. Kết quả thực tế cần được ghi lại sau khi chạy kiểm thử.

---

## 12. Kết quả thực nghiệm

Kết quả nghiên cứu dự kiến được trình bày thông qua:

- Bản đồ phân bố NDVI.
- Bản đồ nhiệt độ bề mặt LST.
- Bản đồ chỉ số khô hạn TVDI.
- Biểu đồ biến động khí hậu.
- Bảng thống kê các chỉ số theo thời gian.
- Ảnh minh họa giao diện WebGIS.
- Kết quả kiểm thử chức năng USER và ADMIN.

**Trạng thái:** Cần bổ sung kết quả thực nghiệm thực tế, thời gian phân tích, dữ liệu đầu vào, thông số xử lý và kết quả đánh giá trước khi hoàn thiện hồ sơ nộp đồ án.

Không sử dụng số liệu minh họa làm kết quả nghiên cứu thực tế.

---

## 13. Bảo mật hệ thống

Các biện pháp bảo mật chính:

- Xác thực người dùng bằng JWT.
- Phân quyền USER và ADMIN.
- Xác minh Google ID token ở Backend.
- Quản lý mật khẩu bằng hàm băm.
- Bảo vệ API theo quyền truy cập.
- Không công khai thông tin bí mật trong repository.

Các tệp `.env`, khóa dịch vụ và dữ liệu riêng tư phải được loại trừ khỏi Git.

---

## 14. Hạn chế và hướng phát triển

### Hạn chế

- Hệ thống phụ thuộc vào khả năng truy cập Google Earth Engine.
- Chất lượng kết quả phụ thuộc vào dữ liệu đầu vào và phương pháp xử lý.
- Một số chức năng yêu cầu cấu hình PostgreSQL, Google Cloud và quyền truy cập dữ liệu.
- Các kết quả viễn thám cần được kiểm chứng bằng dữ liệu tham chiếu phù hợp.

### Hướng phát triển

- Mở rộng nguồn dữ liệu viễn thám.
- Bổ sung phân tích chuỗi thời gian dài hạn.
- Tích hợp thêm các chỉ số môi trường.
- Nâng cao khả năng thống kê và xuất báo cáo.
- Cải thiện tốc độ xử lý và trực quan hóa bản đồ.
- Tăng cường kiểm thử, bảo mật và khả năng triển khai thực tế.

---

## 15. Mã nguồn

**GitHub Repository:**

https://github.com/phuonghoang123456/WebGIS_QuangTri

Mã nguồn được quản lý bằng Git và GitHub để phục vụ phát triển, kiểm thử, đánh giá và hướng dẫn đồ án.

Giảng viên hướng dẫn có thể truy cập repository nếu repository được đặt ở chế độ Public hoặc được cấp quyền phù hợp.

---

## 16. Tài liệu tham khảo

- [Google Earth Engine Documentation](https://developers.google.com/earth-engine)
- [Google Earth Engine Data Catalog](https://developers.google.com/earth-engine/datasets)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Google Identity Services](https://developers.google.com/identity/gsi/web)
- [Git Documentation](https://git-scm.com/doc)

---

**WebGIS Quảng Trị – Hệ thống hỗ trợ khai thác, trực quan hóa và phân tích dữ liệu môi trường, khí hậu bằng công nghệ GIS và viễn thám.**