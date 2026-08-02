# MASTER CONTRACT & FULL ARCHITECTURE SPECIFICATION: SHINKO RETAIL ANALYTICS V3

Tài liệu này lưu trữ vĩnh viễn Bộ Mệnh Lệnh Master 7 Phần cho AI Assistant phụ trách phát triển, bảo trì và mở rộng dự án Web App Khảo Sát Khách Hàng đa đại lý thương hiệu SHINKO (EST. 2015).

---

## PHẦN 1: KIẾN TRÚC 6 LỚP V3 & LUỒNG DỮ LIỆU BẮT BUỘC (ARCHITECTURE V3)

Dữ liệu xử lý trong hệ thống BẮT BUỘC tuân thủ luồng 1 chiều qua 6 Module:

  [Web App / Form Khảo sát] 
            │
            ▼ (POST JSON)
  [01_Form_Response] (Dữ liệu thô gốc - Single Source of Truth)
            │
            ▼ (Đồng bộ & Phân rã dữ liệu)
  [02_Data_Processing] (Data Warehouse chuẩn hóa - 72 cột)
            │
            ▼ (Tính toán công thức KPI)
  [03_KPI_Engine] (Tập trung toàn bộ chỉ số kinh doanh)
            │
            ▼ (Đọc kết quả hiển thị)
  [04_Dashboard] ◄─── Đọc danh mục từ ─── [05_Lookup]
  (Ban Giám Đốc / Executive)              [06_Data_Dictionary] (Định nghĩa KPI)

---

## PHẦN 2: BỘ NGUYÊN TẮC KỸ THUẬT VÀNG (MANDATORY TECHNICAL RULES)

1. **Chuẩn hóa ký tự (String Normalization Rule)**: Dùng `normStr(str)` ép chữ thường, xóa khoảng trắng thừa, thay dấu `-`, bỏ dấu tiếng Việt khi lọc URL showroom.
2. **Cấm đổ lỗi cho dữ liệu gốc**: Kiểm tra kỹ lệnh so sánh trong code trước khi kết luận.
3. **Validation ẩn/hiện động trên Form**: Tại Q8, khi chọn "Không" ẩn Section 5, bắt buộc gán `disabled = true` và gỡ thuộc tính `required`.
4. **Cấu hình Endpoint tập trung**: Khai báo URL Web App duy nhất tại `config.js`.
5. **Cơ chế đồng bộ tự động GAS**: `doPost` gọi `syncDataProcessingRow` và cài Trigger chạy tự động 5 phút/lần.
6. **An toàn dữ liệu & sao lưu**: `syncDataProcessingRow` chỉ `clearContent()`, có hàm `backupDailyToDrive()` xuất sao lưu tự động lúc 23:00 hàng ngày.
7. **Quy chuẩn 5 lớp màu sắc & căn lề Tiêu đề căn trái**: Cấp 1 Đen `#0B0A08` căn trái, Cấp 2 Nâu `#987147` căn trái, Cấp 3 Đen `#0B0A08` căn giữa, Cấp 4 Trắng, Cấp 5 Trắng ngà `#F6EADE` căn giữa.
8. **Quy trình 18 phép Robot Audit**: Đảm bảo 100% khớp số liệu mới xuất huy hiệu xanh.
9. **Mô hình 1-to-1 Enum Mapping**: Tách chuẩn 1-to-1 với form (Basket size 7 dòng).
10. **Quy chuẩn xuất mã 2 tệp < 80 ký tự**: Chia thành `Mã.gs` (<220 dòng) và `KPIEngine.gs` (<220 dòng).

---

## PHẦN 3: BỘ NHẬN DIỆN THƯƠNG HIỆU (SHINKO BRANDING 2025)

- **Charred Earth (`#0B0A08`)**: Đen trầm.
- **Toasted Umber (`#987147`)**: Nâu thương hiệu.
- **Ivory Dust (`#F6EADE`)**: Trắng ngà.
- **Pure White (`#FFFFFF`)**: Trắng thuần.
- **Background Page (`#F5F3EF`)**: Tông nền ứng dụng.
- **Typography**: Header `Cormorant Garamond` (Serif), Body `Plus Jakarta Sans` (Sans-serif).

---

## PHẦN 4: MA TRẬN DỮ LIỆU CHUẨN (DATA SCHEMA MATRIX)

Định nghĩa chính xác 17 trường dữ liệu từ Web UI -> JSON Request -> Sheet 01 -> Sheet 02 (72 Cột).

---

## PHẦN 5: BỘ CÔNG THỨC CHỈ SỐ KPI CHUẨN (KPI ENGINE FORMULAS)

Định nghĩa công thức tính toán 11 chỉ số kinh doanh cốt lõi (Traffic, Purchases, Lost Sales, CVR%, CVR New%, CVR Old%, Revenue, AOV, RPV, UPT, Trial Rate%).

---

## PHẦN 6: QUY CHUẨN XUẤT MÃ GOOGLE APPS SCRIPT (GAS EXPORT RULE)

Mặc định chia mã thành 2 tệp: `Mã.gs` (Khởi tạo, API, Syncer - <220 dòng) và `KPIEngine.gs` (KPI Engine, 12 Bảng Căn Trái, 18 Robot Audit - <220 dòng).

---

## PHẦN 7: CÔNG CỤ BỔ TRỢ & KỊCH BẢN KIỂM THỬ (TESTING & DEV TOOLS)

Đầy đủ Script sinh dữ liệu thử nghiệm `generateMockData(count)` và Checklist 7 bước triển khai Netlify & Google Apps Script.
