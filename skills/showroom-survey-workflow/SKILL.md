---
name: showroom-survey-workflow
description: "Standard workflow for creating, maintaining, and deploying SHINKO brand multi-layer (V3 Architecture) Google Sheets integrated survey web applications."
---

# SHINKO SHOWROOM SURVEY WORKFLOW SKILL (ARCHITECTURE V3)

Skill này cung cấp quy trình chuẩn hóa dành cho AI Agent để quản lý, chỉnh sửa, nâng cấp và triển khai hệ thống Web App Khảo Sát Khách Hàng thương hiệu **SHINKO (EST. 2015)** kết nối Google Sheets theo **Kiến trúc 6 Lớp (SHINKO Retail Analytics V3)**.

## 1. Kiến Trúc 6 Lớp (V3 Architecture Flowchart)

```mermaid
flowchart TD
    App[Web App UI - SHINKO 2025] -->|Submit JSON| GAS[Google Apps Script Endpoint]
    GAS -->|Append Raw Data| M01[01_Form_Response]
    M01 -->|Sync & Unnest| M02[02_Data_Processing]
    M02 -->|Data Warehouse| M03[03_KPI_Engine]
    M03 -->|Calculate REV, CVR, UPT| M04[04_Dashboard]
    M05[05_Lookup] -->|Standard Dictionaries| M02
    M06[06_Data_Dictionary] -->|KPI Definitions| M03
    M04 --> Exec[Ban Giám Đốc / Executive Board]
```

## 2. Quy Tắc Các Module

- **`01_Form_Response`**: Không sửa dữ liệu gốc.
- **`02_Data_Processing`**: Phân rã ngày/giờ/thứ, tách sản phẩm, tạo các cột cờ trợ lý.
- **`03_KPI_Engine`**: Nơi duy nhất tính toán công thức KPI (TRAFFIC, CVR, UPT...).
- **`04_Dashboard`**: Chỉ hiển thị báo cáo.

## 3. Tiêu Chuẩn Thiết Kế SHINKO 2025

- **Primary**: `#987147` (Toasted Umber)
- **Dark Accent**: `#0B0A08` (Charred Earth)
- **Light Accent**: `#F6EADE` (Ivory Dust)
- **Background**: `#F5F3EF`
- **Fonts**: `Cormorant Garamond` & `Plus Jakarta Sans`

## 4. Checklist Triển Khai (Deployment Checklist)

- [ ] Mở Google Apps Script trong Google Sheet.
- [ ] Dán mã nguồn từ `google_apps_script.gs`.
- [ ] Bấm nút ▶️ **Chạy (Run)** hàm `setupV3Architecture` để tự động tạo 6 Module V3.
- [ ] Triển khai Web App (`Execute as: Me`, `Access: Anyone`).
- [ ] Copy URL Web App và dán vào `app.js`.
- [ ] Kéo thả file `KhaoSatKhachHang.zip` lên Netlify Drop.
