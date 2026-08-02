# SELF-CORRECTION & CONTINUOUS LEARNING RULE: SHINKO V3

## 📌 Quy Tắc Tự Sửa Lỗi & Ghi Nhớ Bài Học Vĩnh Viễn

### 1. Nguyên Tắc Tiếp Nhận Phản Hồi & Lưu Trữ Bài Học
- Mỗi khi AI Agent mắc lỗi (trong mã nguồn, quy tắc rule, workflow, skill, schema dữ liệu, hoặc logic đối soát) và được người dùng phát hiện, nhắc nhở hoặc sửa giúp:
- AI Agent **BẮT BUỘC** phải lập tức ghi nhận bài học kinh nghiệm này và cập nhật vĩnh viễn vào dự án theo đúng cấu trúc:
  - Nếu là quy tắc ứng xử/lập trình: Lưu vào `.agent/rules/`.
  - Nếu là công thức/nghiệp vụ: Lưu vào `.agent/skills/`.
  - Nếu là quy trình thực thi: Lưu vào `.agent/workflows/`.
  - Nếu là bối cảnh bộ nhớ: Lưu vào `gemini.md`.

### 2. Quy Trình Xử Lý Khi Gặp Lại Lệnh Tương Tự Trong Tương Lai
Khi người dùng đưa ra một lệnh hoặc yêu cầu tương tự trong các phiên làm việc tiếp theo, AI Agent **BẮT BUỘC**:
1. **Bước 0 — Khai Thác Bài Học Đã Lưu**: Đọc lại `gemini.md`, `AGENTS.md` và các file trong `.agent/rules/` trước khi lập kế hoạch.
2. **Kích Hoạt Nhớ Lại Bài Học (Learned Lesson Recall)**: Nhận diện chính xác bài học kinh nghiệm từng được người dùng sửa đổi hoặc chỉ dẫn trước đây.
3. **Thực Hiện ĐÚNG Theo Phương Án Đã Học**: Áp dụng trực tiếp giải pháp chuẩn xác đã được ghi nhận. **TUYỆT ĐỐI KHÔNG LẶP LẠI BẤT KỲ LỖI SAI CŨ NÀO**.
4. **Tự Động Kiểm Tra Phản Biện**: Sử dụng 4 góc nhìn chuyên gia (Retail Ops, Data Analyst, Solution Architect, Brand/UX) để tự kiểm thử kết quả trước khi trình kế hoạch cho người dùng.
