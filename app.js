/**
 * SHINKO RETAIL ANALYTICS V3 — MAIN ENTRY POINT (app.js)
 * Tệp khởi chạy chính kết nối các mô-đun: Offline Sync, Validator, GAS Connector và UI Stepper.
 */

// Cấu hình URL Web App Google Apps Script Endpoint
const GOOGLE_SCRIPT_URL = typeof CONFIG !== 'undefined' && CONFIG.GOOGLE_SCRIPT_URL 
  ? CONFIG.GOOGLE_SCRIPT_URL 
  : 'https://script.google.com/macros/s/AKfycbwCkyNmVCv9iAEo9auJtXYVLHFf4EtpdJKypEg5bZm5LXDCWDxu-RhBWzAX1VBvHGck/exec';

// Lắng nghe sự kiện Submit Form khảo sát chính
document.addEventListener('DOMContentLoaded', () => {
    // Tự động kiểm tra tham số URL showroom & Khởi tạo bộ kiểm soát đối soát instant
    if (typeof checkUrlParams === 'function') checkUrlParams();
    if (typeof ShinkoValidator !== 'undefined') ShinkoValidator.initInstantValidation();

    const surveyForm = document.getElementById('surveyForm');
    if (!surveyForm) return;

    surveyForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 1. Thực hiện kiểm tra lỗi logic giỏ hàng & đối soát trước khi gửi
        if (typeof ShinkoValidator !== 'undefined' && !ShinkoValidator.validateSurveyData()) {
            return;
        }

        const formData = new FormData(this);
        const data = {};

        // 2. Thu thập dữ liệu từ Form
        formData.forEach((value, key) => {
            if (data[key]) {
                if (!Array.isArray(data[key])) {
                    data[key] = [data[key]];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        });

        // 3. Chuẩn hóa chuỗi mảng checkbox thành chuỗi phân cách bởi dấu phẩy
        if (Array.isArray(data.interestedProducts)) {
            data.interestedProducts = data.interestedProducts.join(', ');
        }
        if (Array.isArray(data.purchasedProducts)) {
            data.purchasedProducts = data.purchasedProducts.join(', ');
        }

        // 4. Xử lý làm sạch trường dữ liệu thừa nếu chọn Không mua
        if (data.hasPurchased === 'Không') {
            data.usagePurpose = '';
            data.purchaseType = '';
            data.purchaseQuantity = '';
            data.purchasedProducts = '';
            data.invoiceCode = '';
            data.invoiceAmount = '';
        } else {
            data.nonPurchaseReason = '';
        }

        // 5. Thêm Dấu thời gian tạo (Timestamp)
        data.timestamp = new Date().toLocaleString('vi-VN');

        console.log('[SHINKO V3] Dữ liệu khảo sát chuẩn bị gửi:', data);

        // 6. Gửi dữ liệu thông qua GAS API Connector (Có tích hợp lưu Offline Fallback)
        if (typeof sendToGoogleAppsScript === 'function') {
            sendToGoogleAppsScript(data, true);
        } else {
            console.error('Lỗi: Chưa nạp mô-đun shinko_gas_connector.js');
        }
    });
});
