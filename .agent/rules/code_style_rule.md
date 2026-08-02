# CODE STYLE & ARCHITECTURE RULES: SHINKO V3

## 💻 Nguyên Tắc Lập Trình Frontend (JavaScript & CSS)

1. **Mô-đun hóa Đơn Trách Nhiệm (Single Responsibility Principle)**:
   - Mỗi file JS chỉ đảm nhận đúng 1 nhiệm vụ duy nhất (Validator, Offline Storage, GAS API Connector, UI Stepper).
   - Tách biệt logic xử lý dữ liệu và logic hiển thị giao diện.

2. **Chuẩn Hóa Ký Tự Tiếng Việt (String Normalization Rule)**:
   - Luôn sử dụng hàm `normStr(str)` để chuẩn hóa chuỗi khi so sánh: ép chữ thường, xóa khoảng trắng thừa, loại bỏ dấu tiếng Việt NFD/NFC để tránh lỗi mã hóa.

3. **Validation Ẩn / Hiện Động Trên Form**:
   - Khi ẩn các Section hoặc phần không thuộc luồng (ví dụ chọn Không mua), bắt buộc loại bỏ thuộc tính `required` và thêm `disabled = true` để không cản trở việc nộp form HTML5.

4. **Xử Lý Lỗi Tế Nhị & Không Làm Đứt Gãy UX (Graceful Degradation)**:
   - Mọi thao tác kết nối mạng (Fetch API) phải có cơ chế `try...catch` và fallback tự động lưu trữ `localStorage` offline.

5. **Không Sử Dụng Thư Viện Nặng Của Bên Thứ Ba**:
   - Ưu tiên Vanilla JS, HTML5 Semantic, CSS Custom Variables để đảm bảo Web App tải mượt dưới 1 giây trên mọi di động/tablet cửa hàng.
