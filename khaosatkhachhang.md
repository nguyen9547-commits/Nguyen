# DỰ ÁN SHINKO SHOWROOM SURVEY (EST. 2015) — TÀI LIỆU QUY TRÌNH MASTER & CẨM NANG TOÀN DIỆN VÂN HÀNH (MASTER SYSTEM SPECIFICATION & ARCHITECTURE HANDBOOK V3)

> **DÀNH CHO TẤT CẢ AI ASSISTANT / DEVELOPER**: 
> Tài liệu này chứa 100% tri thức, kiến trúc, công thức tính toán, quy trình từ Form Khảo Sát -> Google Sheet -> Web Dashboard và bộ quy tắc vận hành của Dự án **SHINKO Showroom Retail Analytics (EST. 2015)**.
> Bất kỳ AI Assistant nào đọc file này đều có thể khởi tạo, vận hành, kiểm thử và phát triển dự án đạt chuẩn chính xác **100% ngay lập tức**.

---

## 📋 MỤC LỤC MASTER

1. **Tổng Quan Dự Án & Thương Hiệu SHINKO Rebranding 2025**
2. **Bộ 4 Vai Trò Chuyên Gia Hợp Nhất (Quad-Role Persona)**
3. **Quy Trình Tạo Dữ Liệu Từ Form Khảo Sát (`index.html` / `app.js`)**
4. **Kiến Trúc 6 Lớp V3 & Luồng Dữ Liệu Trên Google Sheet**
5. **Bộ Công Thức 11+ KPI Retail Engine & Ma Trận BCG 4 Nhóm**
6. **Quy Trình 18 Phép Toán Đối Soát Tự Động (Robot Auditor Protocol)**
7. **Quy Chuẩn Xuất Mã Google Apps Script & API Endpoints**
8. **Web Executive Dashboard (`dashboard.html` & `dashboard_v4.js`)**
9. **Bộ 22 Quy Tắc Kỹ Thuật Vàng & Anti-Regression Mandates**
10. **Quy Trình Lập Kế Hoạch & Duyệt Trước Khi Thực Thi (Mandatory Approval Protocol)**

---

## 1. TỔNG QUAN DỰ ÁN & THƯƠNG HIỆU SHINKO REBRANDING 2025

### 1.1. Mục Tiêu Dự Án
Dự án Web App **Báo Cáo Khảo Sát & Phân Tích Hiệu Quả Kinh Doanh Hệ Thống Showroom Bán Lẻ Thương Hiệu SHINKO (EST. 2015)** được xây dựng nhằm:
- Cho phép nhân viên Showroom thao tác nộp phiếu khảo sát khách hàng ghé cửa hàng mượt mà dưới 30 giây trên thiết bị di động.
- Tự động hóa 100% luồng dữ liệu từ Web Form nộp sang Kho dữ liệu Google Sheet.
- Tính toán tự động bộ 11+ KPI Retail chuyên sâu (Traffic, Purchases, Lost Sales, CVR%, AOV, RPV, UPT, Trial%, MoM Growth%, BCG Matrix 4 Nhóm).
- Trực quan hóa dữ liệu thời gian thực trên Executive Web Dashboard với giao diện đẳng cấp, sang trọng.

### 1.2. Bộ Nhận Diện Thương Hiệu SHINKO 2025 (Brand Aesthetics)
Tất cả các thành phần Giao diện Web Form, Web Dashboard và Google Sheet BẮT BUỘC tuân thủ bảng màu Muted Luxury:
- **Charred Earth (Đen đất)**: `#0B0A08` — Dùng cho Header, Sidebar, Tiêu đề Mục lớn, Tiêu đề Cột Bảng.
- **Toasted Umber (Nâu xám đồng)**: `#987147` — Dùng cho Accent, Nút bấm Primary, Viền Highlight, Tiêu đề Bảng thành phần.
- **Ivory Dust (Trắng ngà)**: `#F6EADE` — Dùng cho Nền tổng quan, Dòng Tổng cộng Summary Row.
- **Dark Mode Background**: `#1A1815` — Nền tối cho Web Dashboard.
- **Font Chữ Chuẩn**: `Cormorant Garamond` (Tiêu đề sang trọng) & `Plus Jakarta Sans` / `Inter` (Nội dung dữ liệu mượt mà).

---

## 2. BỘ 4 VAI TRÒ CHUYÊN GIA HỢP NHẤT (QUAD-ROLE PERSONA)

Trong mọi trao đổi và thực thi, AI Assistant BẮT BUỘC đóng đồng thời 4 vai trò:
1. 🏪 **Chuyên Gia Vận Hành Bán Lẻ (Head of Retail / Retail Ops)**: Tối ưu thao tác cửa hàng dưới 30s, giải quyết tình huống thực tế (Đổi hàng, Bảo hành, Khách đi đông).
2. 📊 **Chuyên Gia Phân Tích Dữ Liệu Bán Lẻ (Retail Data Analyst / BI Specialist)**: Quản lý bộ chỉ số Retail KPI, phân tích đa chiều, đưa ra Actionable Insights đột phá.
3. 💻 **Kỹ Sư Kiến Trúc Giải Pháp Phần Mềm (Solution Architect / Full-Stack Lead)**: Duy trì kiến trúc 6 Lớp V3, cơ chế Offline-First Auto-Sync, mã nguồn mô-đun hóa, bảo vệ tính ổn định dữ liệu.
4. 🎨 **Chuyên Gia Trải Nghiệm & Thương Hiệu (Brand & UX/UI Specialist)**: Tối ưu UI/UX cao cấp cho di động và Executive Dashboard.

---

## 3. QUY TRÌNH TẠO DỮ LIỆU TỪ FORM KHẢO SÁT (`index.html` / `app.js`)

### 3.1. Giao Diện Khảo Sát 5 Bước (Mobile Stepper Workflow)
Giao diện survey trên file [`index.html`](file:///home/asd/Google%20Antigravity/Khao%20sat%20khach%20hang/index.html) chia làm 5 bước logic:
- **Bước 1: Thông tin chung**: Chọn Showroom (*Trần Duy Hưng, Xã Đàn, Bắc Ninh, Thanh Hóa, Ninh Bình*) & Khung giờ ghé cửa hàng.
- **Bước 2: Thông tin Khách hàng**: Chọn Loại khách (*Khách mới / Khách cũ*) & Nguồn khách (*Đi ngang, Marketing FB/TikTok, Giới thiệu, Quay lại, Khác*).
- **Bước 3: Nhu cầu ghé**: Chọn Mục đích (*Mua cho bản thân, Mua quà tặng, Tham khảo mẫu, Đổi hàng/Bảo hành*), Chọn 1-13 Sản phẩm quan tâm, và Cờ thử hàng (*Có thử / Không thử*).
- **Bước 4: Kết quả khảo sát**: Chọn Khách có mua hàng hay không (*Có / Không*).
- **Bước 5: Chi tiết hóa đơn HOẶC Lý do chưa mua**:
  * **Nếu Chọn "Có" Mua**: Nhập Mục đích sử dụng (*Cá nhân, Quà tặng, Doanh nghiệp*), Hình thức mua (*Mua nguyên giá / Mua có ưu đãi*), Số lượng SP mua (1-20), Chọn các Danh mục SP mua, Mã hóa đơn (*HD...*), và Doanh thu VNĐ.
  * **Nếu Chọn "Không" Mua**: Chọn Lý do chưa mua (*Giá chưa phù hợp, Hết size/màu, Chưa thích mẫu, Chỉ tham khảo, Muốn suy nghĩ thêm, Đang xem thương hiệu khác, Đợi CT ưu đãi, Không vừa form*).

### 3.2. Quy Tắc Validation Ẩn/Hiện Động (Dynamic Form Validation Rule)
- Khi chọn **"Không"** tại Bước 4: Section 5 (Thông tin hóa đơn) bị ẨN và Section 6 (Lý do chưa mua) HIỆN LÊN.
- **QUY TẮC BẮT BUỘC**: Khi ẩn Section 5, BẮT BUỘC gán `disabled = true` và xóa thuộc tính `required` khỏi toàn bộ các ô input trong Section 5 để tránh bị trình duyệt mobile chặn lệnh Submit âm thầm.

### 3.3. Cấu Trúc Payload JSON Gửi Về API
Khi nhấn nút Submit, file `app.js` tổng hợp dữ liệu thành object JSON gửi qua HTTP POST tới Google Apps Script:
```json
{
  "timestamp": "14:30:00 15/04/2026",
  "showroom": "SHINKO - Trần Duy Hưng",
  "timeSlot": "13:00 - 15:00",
  "customerType": "Khách mới",
  "referralSource": "Marketing (Facebook, TikTok, Website...)",
  "visitPurpose": "Mua cho bản thân",
  "interestedProducts": "Giày, Polo, Blazer",
  "triedProduct": "Có thử",
  "hasPurchased": "Có",
  "usagePurpose": "Cá nhân sử dụng",
  "purchaseType": "Mua nguyên giá",
  "purchaseQuantity": "2",
  "purchasedProducts": "Giày, Polo",
  "invoiceCode": "HD184920",
  "invoiceAmount": "1850000",
  "nonPurchaseReason": ""
}
```

---

## 4. KIẾN TRÚC 6 LỚP V3 & LUỒNG DỮ LIỆU TRÊN GOOGLE SHEET

Dữ liệu luân chuyển 1 chiều qua 6 Tab Tiếng Anh chuẩn nguyên bản:

```
[Web App / Form Khảo Sát] 
       │ (POST JSON)
       ▼
[01_Form_Response] ──(Single Source of Truth - Chứa Phiếu Thô)
       │ (Auto-Unnest & Matrix Split)
       ▼
[02_Data_Processing] ──(Data Warehouse 72 Cột - Phân rã Boolean & Neutralization)
       │ (KPI Engine Formulas)
       ▼
[03_KPI_Engine] ──(Tập trung 100% công thức 12 Bảng KPI & 18 Robot Audit)
       │ (Render View)
       ▼
[04_Dashboard] ──(Executive Live Reports)
```

### 4.1. Chi Tiết Nhiệm Vụ 6 Tab Sheet V3
1. **`01_Form_Response` (Single Source of Truth)**:
   - Lưu trữ 100% bản ghi phiếu khảo sát thô gửi từ Form/App.
   - **CẤM** sửa/xóa dữ liệu thô, CẤM chèn/xóa cột, CẤM gán công thức.
   - **Bảo vệ Row 1 Header**: Dòng 1 chứa 17 Tiêu đề cột chuẩn. Dọn dẹp dữ liệu CHỈ được xóa từ Dòng 2 trở xuống (`getRange(2, 1, getLastRow()-1, ...)`).
   - **Col Q (Col 17 - Trạng thái Kiểm toán)**: Nếu gán `"HỦY"`, `"HUY"`, `"VOID"`, `"SAI"`, hệ thống tự động triệt tiêu 100% dòng đó khỏi Báo cáo.
2. **`02_Data_Processing` (Data Warehouse 72 Cột)**:
   - Tự động tách Ngày, Tháng, Năm, Thứ trong tuần, Khung giờ.
   - Tách 13 Cột Boolean Sản Phẩm Quan Tâm (`Giày`, `Polo`, `Tshirt`, `Sơ mi`, `Quần`, `Jacket`, `Blazer`, `Áo len`, `Áo da`, `Dây lưng`, `Ví/Bóp tay`, `Cặp/Túi`, `Phụ kiện khác`).
   - Tách 13 Cột Boolean Sản Phẩm Mua.
   - Tạo các Cột Cờ Boolean: `Traffic (1/0)`, `Purchases (1/0)`, `Lost Sales (1/0)`, `Khách Mới (1/0)`, `Khách Cũ (1/0)`, `Marketing (1/0)`, `Walk-in (1/0)`.
   - **Quy tắc Hậu mãi / Bảo hành 0đ (Traffic Neutralization Rule)**: Nếu phiếu là *Đổi ngang 0đ / Bảo hành*, gán `Traffic = 0`, `Purchases = 0`, `Revenue = 0đ` để bảo vệ CVR% chốt đơn của ca trực.
3. **`03_KPI_Engine` (Bảng Tính KPI)**:
   - Nơi **DUY NHẤT** tập trung toàn bộ công thức tính toán 12 Bảng KPI & 18 Robot Audit.
   - Xóa sạch định dạng cũ bằng `s03.clear()` trước khi render.
   - Thiết kế thị giác 5 Lớp màu SHINKO 2025.
   - **Căn lề bắt buộc**: Tiêu đề Mục lớn & Tiêu đề Bảng thành phần **CĂN TRÁI (`Left`)**; Tiêu đề Cột & Dòng Tổng cộng **CĂN GIỮA (`Center`)**.
   - Thêm 3 Cột Đánh Giá ở cuối mỗi bảng: `Trạng thái`, `Nhận định 15-25 từ`, `Hành động đề xuất`.
4. **`04_Dashboard` (Báo Cáo Tổng Quan)**:
   - Chỉ đọc kết quả từ `03_KPI_Engine` để hiển thị Executive Reports.
5. **`05_Lookup` (Danh Mục Chuẩn)**:
   - Lưu trữ danh mục Showroom, Sản phẩm, Size, Nguồn khách, Lost Sale.
6. **`06_Data_Dictionary` (Từ Điển Chỉ Số)**:
   - Lưu trữ định nghĩa, công thức và ký hiệu KPI.

---

## 5. BỘ CÔNG THỨC 11+ KPI RETAIL ENGINE & MA TRẬN BCG 4 NHÓM

### 5.1. Công Thức Tính Các Chỉ Số KPI Cốt Lõi
1. **Lượt Khách Kinh Doanh (Traffic - TRF)**:
   $$\text{TRF} = \text{COUNTIFS}(02\_Kho, \text{Col TRF} = 1, \text{Điều kiện Lọc})$$
2. **Số Khách Mua Hàng (Purchases - PUR)**:
   $$\text{PUR} = \text{COUNTIFS}(02\_Kho, \text{Col PUR} = 1, \text{Điều kiện Lọc})$$
3. **Số Khách Chưa Mua (Lost Sales - LOST)**:
   $$\text{LOST} = \text{COUNTIFS}(02\_Kho, \text{Col LOST} = 1, \text{Điều kiện Lọc})$$
4. **Tỷ Lệ Chốt Đơn (Conversion Rate - CVR%)**:
   $$\text{CVR\%} = \frac{\text{PUR}}{\text{TRF}} \times 100\%$$
5. **CVR Khách Mới vs Khách Cũ**:
   $$\text{CVR New\%} = \frac{\text{PUR New}}{\text{TRF New}} \times 100\%, \quad \text{CVR Old\%} = \frac{\text{PUR Old}}{\text{TRF Old}} \times 100\%$$
6. **Doanh Thu VNĐ (Revenue - REV)**:
   $$\text{REV} = \text{SUMIFS}(02\_Kho, \text{Col REV}, \text{Điều kiện Lọc})$$
7. **Giá Trị Hóa Đơn Trung Bình (Average Order Value - AOV)**:
   $$\text{AOV} = \frac{\text{REV}}{\text{PUR}}$$
8. **Doanh Thu Trên Mỗi Lượt Khách (Revenue Per Visitor - RPV)**:
   $$\text{RPV} = \frac{\text{REV}}{\text{TRF}}$$
9. **Kích Thước Giỏ Hàng Trung Bình (Units Per Transaction - UPT)**:
   $$\text{UPT} = \frac{\text{Tổng Số Lượng SP Mua}}{\text{PUR}}$$
10. **Tỷ Lệ Thử Hàng (Trial Rate - Trial%)**:
    $$\text{Trial\%} = \frac{\text{Số Khách Có Thử Hàng}}{\text{TRF}} \times 100\%$$
11. **Tỷ Lệ Tăng Trưởng Tháng (MoM Growth%)**:
    $$\text{MoM\%} = \frac{\text{REV Tháng Hiện Tại} - \text{REV Tháng Trước}}{\text{REV Tháng Trước}} \times 100\%$$

### 5.2. Ma Trận Phân Loại 4 Nhóm Sản Phẩm BCG Matrix
Dựa vào 2 trục: **Lượt Quan Tâm (Demand)** và **CVR% Sản Phẩm (Conversion)** so với mức Trung bình Hệ thống:
- 🔥 **Hotsell (Ngôi Sao)**: $\text{Lượt Quan Tâm} \ge \text{Trung Bình}$ AND $\text{CVR SP\%} \ge 50\%$. $\rightarrow$ *Khuyến nghị: Trưng bày Hotspot trung tâm, đảm bảo tồn kho đủ size.*
- 🌟 **Tiềm Năng (Dấu Hỏi)**: $\text{Lượt Quan Tâm} \ge \text{Trung Bình}$ AND $\text{CVR SP\%} < 50\%$. $\rightarrow$ *Khuyến nghị: Đào tạo lại kịch bản tư vấn, tối ưu giá hoặc phối đồ mẫu.*
- 📦 **Bán Kèm (Bò Sữa)**: $\text{Lượt Quan Tâm} < \text{Trung Bình}$ AND $\text{CVR SP\%} \ge 50\%$. $\rightarrow$ *Khuyến nghị: Đặt tại khu vực quầy thu ngân, kịch bản combo nâng AOV.*
- ⚠️ **Tồn Ứ (Chó Mực)**: $\text{Lượt Quan Tâm} < \text{Trung Bình}$ AND $\text{CVR SP\%} < 50\%$. $\rightarrow$ *Khuyến nghị: Đưa vào chương trình Xả hàng / Ưu đãi combo thanh lý.*

---

## 6. QUY TRÌNH 18 PHÉP TOÁN ĐỐI SOÁT TỰ ĐỘNG (ROBOT AUDITOR PROTOCOL)

Hệ thống chạy ngầm 18 phép toán kiểm toán để đảm bảo số liệu khớp 100% không lệch 1 đồng:
1. $\text{Total Surveys} = \text{Traffic TRF} + \text{Ca Đổi Hàng/Bảo Hành (Traffic = 0)}$.
2. $\text{Traffic TRF} = \text{Purchases PUR} + \text{Lost Sales}$.
3. $\text{Total Revenue} = \text{SUM}(\text{Showroom Revenues}) = \text{SUM}(\text{Product Revenues}) = \text{SUM}(\text{Source Revenues}) = \text{SUM}(\text{Daily Revenues})$.
4. $\text{Total Purchased Qty} = \text{PUR} \times \text{UPT}$.
5. Kiểm toán cờ Void: Bỏ qua 100% dòng có Cột Q = `"HỦY"`.
6. Trạng thái kiểm toán trả về API: `"🟢 100% FULL-TABLE AUDIT PASSED"`.

---

## 7. QUY CHUẨN XUẤT MÃ GOOGLE APPS SCRIPT & API ENDPOINTS

Mã Google Apps Script được chia làm 2 tệp chính (độ dài dòng < 80 ký tự):
1. **`google_apps_script.gs`**:
   - Khởi tạo kiến trúc V3 (`setupV3Architecture`).
   - Hàm `doGet(e)`: Nhận request JSON/JSONP trả về dữ liệu Dashboard ngầm (`action=getDashboardData` hoặc `action=clearData`).
   - Hàm `doPost(e)`: Nhận phiếu khảo sát từ Web Form, append dòng mới vào `01_Form_Response`, gọi `syncDataProcessingRow(ss)` và `syncKPIEngine(ss)`.
   - Hàm `getLiveDashboardUrl()`: Tự động hóa URL xuất Web App bằng `ScriptApp.getService().getUrl()`.
   - Hàm `clearAllSurveyData(ss)`: Xóa dữ liệu cũ từ Dòng 2 trở xuống và tái tạo Row 1 Header chuẩn.
2. **`kpi_engine.gs`**:
   - Chứa động cơ `syncKPIEngine(ss)` render 12 Bảng KPI & 18 Robot Audit.

---

## 8. WEB EXECUTIVE DASHBOARD (`dashboard.html` & `dashboard_v4.js`)

### 8.1. Cấu Trúc Giao Diện Web Dashboard
- File giao diện: [`dashboard.html`](file:///home/asd/Google%20Antigravity/Khao%20sat%20khach%20hang/dashboard.html).
- File logic & biểu đồ: [`dashboard_v4.js`](file:///home/asd/Google%20Antigravity/Khao%20sat%20khach%20hang/dashboard_v4.js).
- File cấu hình URL: [`config.js`](file:///home/asd/Google%20Antigravity/Khao%20sat%20khach%20hang/config.js).

### 8.2. Hệ Thống 22+ Biểu Đồ & Bảng Hiển Thị
1. **Tab 1: Tổng Quan**: 10 Thẻ KPI Cards + Biểu đồ Combo Area & Line Trend ngày.
2. **Tab 2: Showroom**: Biểu đồ Ranked Horizontal Bar Chart xếp hạng Showroom theo Doanh thu & CVR%.
3. **Tab 3: Sản Phẩm**: Biểu đồ Top sản phẩm bán chạy, Grouped Column Chart (Quan tâm vs Mua), và Bảng Ma trận 4 nhóm sản phẩm BCG Matrix (`bcgProductTableBody`).
4. **Tab 4: Khách Hàng**: Doughnut Chart tỷ trọng Nguồn khách & Dual Axis Bar Chart (Doanh thu vs CVR%).
5. **Tab 5: Lost Sale**: Pareto Bar Chart Top 10 lý do rớt đơn.
6. **Tab 6: Thời Gian**: Spline Area Chart khung giờ & Column Chart Thứ trong tuần.
7. **Tab 7: Hành Vi Mua**: Polar Area Chart mục đích ghé & Doughnut Chart tỷ trọng Nguyên giá vs Ưu đãi.

---

## 9. BỘ 22 QUY TẮC KỸ THUẬT VÀNG & ANTI-REGRESSION MANDATES

### 📌 4 ĐIỀU CẤM TUYỆT ĐỐI KHÔNG ĐƯỢC LẶP LẠI (ANTI-REGRESSION RULES):
1. 🛑 **BẢO VỆ DÒNG TIÊU ĐỀ (ROW 1 HEADER PROTECTION)**: CẤM xóa hoặc ghi đè Dòng 1 Header Row. Mọi thao tác dọn dẹp dữ liệu BẮT BUỘC xóa từ Dòng 2 trở xuống (`getRange(2, 1, Math.max(s.getLastRow() - 1, 1), ...)`), và LUÔN LUÔN tự động chạy hàm kiểm tra/khôi phục lại Header Row 1 chuẩn (Bold, Background `#0B0A08`, Text `#FFFFFF`).
2. 🛑 **CẬP NHẬT PHIÊN BẢN DEPLOYMENT (NEW DEPLOYMENT VERSION RULE)**: Mỗi khi sửa code trong `google_apps_script.gs`, BẮT BUỘC hướng dẫn người dùng chọn *Triển khai $\rightarrow$ Quản lý các bản triển khai $\rightarrow$ Phiên bản mới (New Version)* để Google Sheet thực sự nhận code mới.
3. 🛑 **KIỂM THỬ ĐỘC LẬP TỰ ĐỘNG (AUTOMATED PRE-FLIGHT VERIFICATION)**: CẤM báo "Đã xong" khi chưa tự động chạy lệnh kiểm thử độc lập (Curl Live API, Verify `auditStatus` = `"🟢 100% FULL-TABLE AUDIT PASSED"`).
4. 🛑 **BẢO TỒN DỮ LIỆU & TÊN TAB (DATA & TAB INTEGRITY)**: CẤM tự ý đổi tên Tab hoặc triệt tiêu Lượt khách (Traffic) của phiếu khảo sát hợp lệ.

### 📌 NGUYÊN TẮC CẮT NẠP BÀI HỌC VÀO BỘ NHỚ:
Mọi bài học kinh nghiệm, nguyên nhân gốc rễ và quy trình sửa lỗi BẮT BUỘC TỰ ĐỘNG CẬP NHẬT TRỰC TIẾP VÀO CẢ 2 FILE [`AGENTS.md`](file:///home/asd/Google%20Antigravity/Khao%20sat%20khach%20hang/AGENTS.md) VÀ [`gemini.md`](file:///home/asd/Google%20Antigravity/Khao%20sat%20khach%20hang/gemini.md) NGAY KHI PHÁT HIỆN HOẶC SỬA XONG.

---

## 10. QUY TRÌNH LẬP KẾ HOẠCH & DUYỆT TRƯỚC KHÍ THỰC THI (MANDATORY APPROVAL PROTOCOL)

Từ thời điểm này trở đi, trước khi thực hiện bất kỳ lệnh thay đổi mã nguồn, tạo script hoặc thao tác hệ thống nào:
1. **Bước 1**: AI Assistant BẮT BUỘC nghiên cứu kỹ mã nguồn & quy tắc ở Bước 0.
2. **Bước 2**: AI Assistant BẮT BUỘC lập Kế Hoạch Triển Khai Chi Tiết trong file `implementation_plan.md`.
3. **Bước 3**: AI Assistant gửi Kế hoạch cho Người dùng xem xét và **CHỜ TÍN HIỆU ĐỒNG Ý / DUYỆT (USER APPROVAL)**.
4. **Bước 4**: **CHỈ KHI NGUỜI DÙNG CHẤP THUẬN/DUYỆT**, AI Assistant mới được phép thực thi kế hoạch.
5. **Bước 5**: Kiểm thử độc lập tự động & xác minh kết quả.
6. **Bước 6**: Báo cáo kết quả và tự động cập nhật bộ nhớ dự án (`walkthrough.md`, `gemini.md`, `AGENTS.md`, và `khaosatkhachhang.md`).
