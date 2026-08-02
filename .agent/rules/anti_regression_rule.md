# ANTI-REGRESSION & ZERO-REPETITIVE-ERROR RULE: SHINKO V3

## 📌 QUY TẮC CẤM TUYỆT ĐỐI ĐỂ PHÒNG TRÁNH LỖI LẶP LẠI (STRICT ANTI-REGRESSION MANDATES)

Mọi AI Assistant / Developer làm việc trên codebase này BẮT BUỘC tuân thủ 100% các điều cấm sau:

### 🛑 1. BẢO VỆ DÒNG TIÊU ĐỀ (ROW 1 HEADER PROTECTION)
- **ĐIỀU CẤM**: CẤM xóa, ghi đè hoặc bỏ qua Dòng 1 (Header Row) tại tab `01_Form_Response` và `02_Data_Processing`.
- **CÁCH XỬ LÝ CHUẨN**:
  * Mọi hàm dọn dẹp dữ liệu (`clearAllSurveyData`, `clearContent`) BẮT BUỘC chỉ xóa từ Dòng 2 trở xuống (`getRange(2, 1, Math.max(s.getLastRow() - 1, 1), ...)`).
  * Mọi hàm dọn dẹp BẮT BUỘC phải chứa đoạn mã kiểm tra & khôi phục lại Header Row 1 chuẩn (Font Bold, Nền `#0B0A08`, Chữ trắng `#FFFFFF`).

### 🛑 2. ĐẢM BẢO QUY TRÌNH CẬP NHẬT BẢN TRIỂN KHAI WEB APP (NEW DEPLOYMENT VERSION RULE)
- **ĐIỀU CẤM**: CẤM chỉ bảo người dùng Ctrl+S mà quên nhắc Tạo Bản triển khai mới.
- **CÁCH XỬ LÝ CHUẨN**: Mỗi khi có thay đổi trong `google_apps_script.gs`, BẮT BUỘC phải hướng dẫn người dùng bấm **Triển khai (Deploy)** $\rightarrow$ **Quản lý các bản triển khai (Manage deployments)** $\rightarrow$ Chọn **Phiên bản mới (New version)** để Google Sheet thực sự nhận code mới.

### 🛑 3. KIỂM THỬ ĐỘC LẬP TỰ ĐỘNG TRƯỚC KHÍ KHẢO SÁT/BÁO CÁO (AUTOMATED PRE-FLIGHT VERIFICATION)
- **ĐIỀU CẤM**: CẤM tuyên bố "Đã xong" hay "Đã chạy chuẩn" khi chưa tự động chạy lệnh kiểm thử độc lập (Curl Live API, Verify Header, Verify `auditStatus`).
- **CÁCH XỬ LÝ CHUẨN**: AI BẮT BUỘC phải gọi GET API kiểm tra `auditStatus` trả về `"🟢 100% FULL-TABLE AUDIT PASSED"` và `totalSurveys` khớp số lượng trước khi báo kết quả cho người dùng.

### 🛑 4. BẢO TỒN NGUYÊN VẸN LƯỢT KHÁCH & TÊN TAB (DATA & SHEET NAME INTEGRITY)
- **ĐIỀU CẤM**: CẤM tự ý đổi tên tab hoặc triệt tiêu Traffic của phiếu khảo sát hợp lệ.
- **CÁCH XỬ LÝ CHUẨN**: Luôn ưu tiên tên Tab Tiếng Anh chuẩn nguyên bản (`01_Form_Response`, `02_Data_Processing`, `03_KPI_Engine`, `04_Dashboard`, `05_Lookup`, `06_Data_Dictionary`).
