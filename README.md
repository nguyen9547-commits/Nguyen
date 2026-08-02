# BẢNG KHẢO SÁT KHÁCH HÀNG SHOWROOM - SHINKO (EST. 2015) - ARCHITECTURE V3

Dự án này là giải pháp Web App khảo sát khách hàng chuẩn bộ nhận diện thương hiệu **SHINKO Rebranding 2025** và kết nối tự động với Google Sheets theo chuẩn **Kiến trúc 6 Lớp (SHINKO Retail Analytics V3 Architecture)**.

---

## 🚀 Triển Khai Trực Tuyến (Live Deployment)

Dự án được định tuyến mượt mà trên **Vercel**:
- 📱 **Form Khảo Sát Khách Hàng (SPA)**: `/` (`index.html`)
- 📊 **Executive Business Dashboard**: `/dashboard` (`dashboard.html`)
- 📘 **Slide Đào Tạo Nhân Viên**: `/slide` (`slide_dao_tao_khao_sat_shinko.html`)

---

## 📂 Cấu Trúc Dự Án (Project Sitemap)

- [`index.html`](file:///e:/Google%20Antigravity/Khao%20sat%20khach%20hang%202.8/index.html) - Giao diện Web App khảo sát 5 bước chuẩn SHINKO branding.
- [`styles.css`](file:///e:/Google%20Antigravity/Khao%20sat%20khach%20hang%202.8/styles.css) - File thiết kế UI/UX theo 5 màu thương hiệu SHINKO (Charred Earth `#0B0A08`, Toasted Umber `#987147`, Ivory Dust `#F6EADE`).
- [`app.js`](file:///e:/Google%20Antigravity/Khao%20sat%20khach%20hang%202.8/app.js) - Main Entry Point kết nối các mô-đun Frontend JavaScript.
- [`config.js`](file:///e:/Google%20Antigravity/Khao%20sat%20khach%20hang%202.8/config.js) - Cấu hình URL Web App Google Apps Script Endpoint.
- [`vercel.json`](file:///e:/Google%20Antigravity/Khao%20sat%20khach%20hang%202.8/vercel.json) - File cấu hình routing tĩnh cho Vercel CDN.
- [`js/`](file:///e:/Google%20Antigravity/Khao%20sat%20khach%20hang%202.8/js) - Thư mục các mô-đun Frontend JavaScript đơn trách nhiệm:
  - [`offline_sync.js`](file:///e:/Google%20Antigravity/Khao%20sat%20khach%20hang%202.8/js/offline_sync.js) - Quản lý lưu trữ tạm `localStorage` & Tự động đồng bộ khi có mạng.
  - [`shinko_validator.js`](file:///e:/Google%20Antigravity/Khao%20sat%20khach%20hang%202.8/js/shinko_validator.js) - Kiểm soát đối soát giỏ hàng, sản phẩm quan tâm vs mua, doanh thu.
  - [`shinko_gas_connector.js`](file:///e:/Google%20Antigravity/Khao%20sat%20khach%20hang%202.8/js/shinko_gas_connector.js) - Giao tiếp API Webhook với Google Apps Script.
  - [`shinko_ui_stepper.js`](file:///e:/Google%20Antigravity/Khao%20sat%20khach%20hang%202.8/js/shinko_ui_stepper.js) - Điều khiển chuyển phần stepper & Popup Modal SHINKO Brand.
- [`dashboard.html`](file:///e:/Google%20Antigravity/Khao%20sat%20khach%20hang%202.8/dashboard.html) & [`dashboard_v4.js`](file:///e:/Google%20Antigravity/Khao%20sat%20khach%20hang%202.8/dashboard_v4.js) - Báo cáo Executive Business Dashboard cho Ban Giám Đốc.
- [`google_apps_script.gs`](file:///e:/Google%20Antigravity/Khao%20sat%20khach%20hang%202.8/google_apps_script.gs) - Mã Google Apps Script tự động duy trì 6 Module Kiến trúc V3 (`01_Form_Response` -> `06_Data_Dictionary`).
- [`kpi_engine.gs`](file:///e:/Google%20Antigravity/Khao%20sat%20khach%20hang%202.8/kpi_engine.gs) - Mã tính toán 11+ chỉ số Retail KPI & 18 phép Robot Audit.
- [`gemini.md`](file:///e:/Google%20Antigravity/Khao%20sat%20khach%20hang%202.8/gemini.md) - File bộ nhớ trung tâm dài hạn cho AI Agent.
- [`AGENTS.md`](file:///e:/Google%20Antigravity/Khao%20sat%20khach%20hang%202.8/AGENTS.md) - Quy định dự án, tiêu chuẩn thương hiệu & Ngữ cảnh hoạt động cho AI Assistants.
- [`cam_nang_khao_sat_khach_hang_shinko_v3.md`](file:///e:/Google%20Antigravity/Khao%20sat%20khach%20hang%202.8/cam_nang_khao_sat_khach_hang_shinko_v3.md) - Cẩm nang xử lý tình huống thực tế cho Nhân viên.

---

## 🛠️ Hướng Dẫn Đẩy Code Up GitHub & Vercel

```bash
# 1. Khởi tạo Git & Commit
git init
git add .
git commit -m "feat: release SHINKO Retail Analytics V3"

# 2. Đẩy lên GitHub Repository (Sau khi tạo repo trên GitHub)
git remote add origin https://github.com/<USERNAME>/shinko-showroom-survey-v3.git
git branch -M main
git push -u origin main

# 3. Deploy Vercel qua Vercel CLI (hoặc import trên vercel.com)
npx vercel
```
