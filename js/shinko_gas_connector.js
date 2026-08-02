/**
 * SHINKO RETAIL ANALYTICS V3 — GOOGLE APPS SCRIPT API CONNECTOR MODULE
 * Quản lý đóng gói JSON & Giao tiếp API với Google Apps Script Backend.
 */

// Hàm gửi dữ liệu lên Google Apps Script có tích hợp Fallback Offline Storage
async function sendToGoogleAppsScript(data, showSuccessModal = true) {
    const scriptUrl = typeof CONFIG !== 'undefined' && CONFIG.GOOGLE_SCRIPT_URL 
      ? CONFIG.GOOGLE_SCRIPT_URL 
      : (typeof GOOGLE_SCRIPT_URL !== 'undefined' ? GOOGLE_SCRIPT_URL : 'https://script.google.com/macros/s/AKfycbwCkyNmVCv9iAEo9auJtXYVLHFf4EtpdJKypEg5bZm5LXDCWDxu-RhBWzAX1VBvHGck/exec');

    if (showSuccessModal) {
        const loading = document.getElementById('loadingOverlay');
        if (loading) loading.classList.remove('hidden');
    }

    // Nếu thiết bị đang thực sự offline, chuyển ngay vào kho Offline Storage
    if (!navigator.onLine) {
        if (showSuccessModal) {
            const loading = document.getElementById('loadingOverlay');
            if (loading) loading.classList.add('hidden');
        }
        ShinkoOfflineSync.saveSurvey(data, data.visitPurpose || 'Offline');
        showShinkoModal({
            title: '📲 ĐÃ LƯU TRỮ PHIẾU OFFLINE',
            message: 'Thiết bị hiện đang mất kết nối Internet.\n\nPhiếu khảo sát đã được lưu an toàn trên máy và sẽ tự động gửi lên Google Sheet ngay khi có mạng trở lại!',
            icon: '📶',
            onConfirm: function() {
                if (typeof resetForm === 'function') resetForm();
            }
        });
        return false;
    }

    try {
        await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (showSuccessModal) {
            const loading = document.getElementById('loadingOverlay');
            if (loading) loading.classList.add('hidden');
            const successModal = document.getElementById('successModal');
            if (successModal) successModal.classList.remove('hidden');
        }
        return true;
    } catch (err) {
        console.error('Lỗi khi kết nối tới Google Apps Script:', err);
        
        // Lưu tạm vào kho offline khi fetch gặp sự cố
        ShinkoOfflineSync.saveSurvey(data, data.visitPurpose || 'Treo mạng');

        if (showSuccessModal) {
            const loading = document.getElementById('loadingOverlay');
            if (loading) loading.classList.add('hidden');
            showShinkoModal({
                title: '⚡ ĐÃ LƯU TẠM THÀNH CÔNG',
                message: 'Kết nối Google Sheet bị ngắt đột ngột.\n\nPhiếu khảo sát đã được lưu tạm an toàn vào bộ nhớ máy và sẽ tự động gửi lại trong giây lát.',
                icon: '💾',
                onConfirm: function() {
                    if (typeof resetForm === 'function') resetForm();
                }
            });
        }
        return false;
    }
}

// Xử lý nộp đơn nhanh cho lượt Hậu mãi / Dịch vụ (Đổi ngang 0đ, Nhận hàng, Khác)
function submitServiceSurvey(purposeVal) {
    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    data.visitPurpose = purposeVal;
    data.interestedProducts = 'N/A (Dịch vụ)';
    data.triedProduct = 'Không thử';
    data.hasPurchased = 'Không';
    data.nonPurchaseReason = 'Dịch vụ / Hậu mãi (' + purposeVal + ')';
    data.timestamp = new Date().toLocaleString('vi-VN');

    sendToGoogleAppsScript(data, true);
}

// Xử lý nộp phiếu cho lượt Đổi nâng cấp (Có thu thêm tiền chênh lệch)
function submitExchangeUpgradeSurvey(amount, invoiceCode, products) {
    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    data.visitPurpose = 'Đổi hàng/Bảo hành (Đổi nâng cấp)';
    const prodStr = Array.isArray(products) ? products.join(', ') : (products || 'Sản phẩm nâng cấp');
    data.interestedProducts = prodStr;
    data.purchasedProducts = prodStr;
    data.triedProduct = 'N/A (Đổi hàng)';
    data.hasPurchased = 'Có (Đổi nâng cấp)';
    data.usagePurpose = '';
    data.purchaseType = '';
    data.purchaseQuantity = products.length ? products.length.toString() : '1';
    data.invoiceCode = invoiceCode || '';
    data.invoiceAmount = amount.toString();
    data.nonPurchaseReason = '';
    data.timestamp = new Date().toLocaleString('vi-VN');

    sendToGoogleAppsScript(data, true);
}
