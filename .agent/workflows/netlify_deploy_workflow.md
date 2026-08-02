# WORKFLOW: NETLIFY DEPLOYMENT CHECKLIST

## 🚀 Các Bước Triển Khai Web App Khảo Sát Lên Netlify

- [x] **Bước 1**: Kiểm tra URL Google Apps Script trong `config.js` hoặc `js/shinko_gas_connector.js`.
- [x] **Bước 2**: Đảm bảo toàn bộ các file static đã sẵn sàng:
  - `index.html`
  - `styles.css`
  - `app.js`
  - `dashboard.html`
  - `dashboard.js` / `dashboard_v4.js`
  - Thư mục `js/` (`offline_sync.js`, `shinko_validator.js`, `shinko_gas_connector.js`, `shinko_ui_stepper.js`)
- [x] **Bước 3**: Kiểm tra liên kết tương đối giữa các file trong `index.html` và `dashboard.html`.
- [x] **Bước 4**: Nén toàn bộ mã nguồn hoặc kéo thả trực tiếp thư mục lên [Netlify Drop](https://app.netlify.com/drop).
- [x] **Bước 5**: Kiểm tra tính năng nộp phiếu trên trình duyệt di động & máy tính bàn.
