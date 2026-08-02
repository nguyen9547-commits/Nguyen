# WORKFLOW: GOOGLE APPS SCRIPT SYNC & BACKUP V3

## 🔄 Quy Trình Tự Động Đồng Bộ & Bảo Trì 6 Tab

```mermaid
flowchart TD
    Submit[Web App Submit] -->|POST JSON| doPost[GAS doPost]
    doPost -->|Append Row| Tab01[01_Form_Response]
    doPost -->|Trigger Immediate Sync| syncRow[syncDataProcessingRow]
    syncRow -->|Transform 72 Columns| Tab02[02_Data_Processing]
    Tab02 -->|KPI Formula Calculation| Tab03[03_KPI_Engine]
    Tab03 -->|Display Executive Dashboard| Tab04[04_Dashboard]
    Trigger5Min[Trigger 5-Min] -->|Batch Sync Check| syncAll[syncDataProcessingAll]
    Cron23[Trigger 23:00] -->|Export CSV to Drive| Backup[backupDailyToDrive]
```

## 📋 Các Hàm Thao Tác Chính Trong `google_apps_script.gs` & `kpi_engine.gs`
1. `setupV3Architecture()`: Khởi tạo 6 Tab tiêu chuẩn Tiếng Việt trên Google Sheets.
2. `syncKPIEngine(ss)`: Đồng bộ 10+ Bảng phân tích chỉ số kinh doanh chuyên sâu lên Tab 03 & Tab 04.
3. `backupDailyToDrive()`: Tự động sao lưu dữ liệu ra file CSV trong Google Drive lúc 23:00 hàng ngày.
