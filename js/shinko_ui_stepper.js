/**
 * SHINKO RETAIL ANALYTICS V3 — UI STEPPER & MODAL CONTROLLER MODULE
 * Quản lý chuyển bước form (1-5), thanh tiến trình visual và Hộp thoại Modal SHINKO Brand.
 */

let currentStep = 1;
let hasPurchasedValue = '';

// HỘP THOẠI POPUP CHUẨN MÀU SHINKO BRANDING
function showShinkoModal(options) {
    const modal = document.getElementById('shinkoAlertModal');
    const titleEl = document.getElementById('shinkoModalTitle');
    const msgEl = document.getElementById('shinkoModalMessage');
    const iconEl = document.getElementById('shinkoModalIcon');
    const confirmBtn = document.getElementById('shinkoModalConfirmBtn');
    const cancelBtn = document.getElementById('shinkoModalCancelBtn');

    if (!modal) return;

    titleEl.innerText = options.title || 'Thông Báo Hệ Thống';
    msgEl.innerText = options.message || '';
    iconEl.innerText = options.icon || '⚠️';
    confirmBtn.innerText = options.confirmText || 'Đồng ý ✓';

    if (options.showCancel) {
        cancelBtn.classList.remove('hidden');
        cancelBtn.innerText = options.cancelText || 'Hủy bỏ';
    } else {
        cancelBtn.classList.add('hidden');
    }

    modal.classList.remove('hidden');

    confirmBtn.onclick = function() {
        modal.classList.add('hidden');
        if (options.onConfirm) options.onConfirm();
    };

    cancelBtn.onclick = function() {
        modal.classList.add('hidden');
        if (options.onCancel) options.onCancel();
    };
}

// Xử lý khi chọn radio ở Câu 5 (Mục đích đến cửa hàng)
function handleVisitPurposeChange() {
    const purposeEl = document.querySelector('input[name="visitPurpose"]:checked');
    const exchangeSubBox = document.getElementById('exchangeSubOptions');
    const exchangeUpgradeBox = document.getElementById('exchangeUpgradeDetails');

    if (!purposeEl) return;

    const purposeVal = purposeEl.value;

    if (purposeVal === 'Đổi hàng/Bảo hành') {
        if (exchangeSubBox) exchangeSubBox.classList.remove('hidden');
    } else {
        if (exchangeSubBox) exchangeSubBox.classList.add('hidden');
        if (exchangeUpgradeBox) exchangeUpgradeBox.classList.add('hidden');
        document.querySelectorAll('input[name="exchangeType"]').forEach(r => r.checked = false);
    }
}

// Xử lý khi chọn Đổi ngang (0đ) vs Đổi nâng cấp (+Tiền)
function handleExchangeTypeChange(type) {
    const exchangeUpgradeBox = document.getElementById('exchangeUpgradeDetails');

    if (type === 'same') {
        if (exchangeUpgradeBox) exchangeUpgradeBox.classList.add('hidden');
        showShinkoModal({
            title: 'XÁC NHẬN LƯỢT ĐỔI NGANG / BẢO HÀNH (0Đ)',
            message: 'Bạn đã chọn Đổi ngang / Bảo hành / Đổi size (Không thu thêm tiền).\n\nHệ thống sẽ ghi nhận đây là lượt Hậu mãi (0đ) và hoàn tất nộp phiếu khảo sát ngay.',
            icon: '📋',
            showCancel: true,
            confirmText: 'Hoàn tất ngay ✓',
            cancelText: 'Chọn lại',
            onConfirm: function() {
                submitServiceSurvey('Đổi hàng/Bảo hành (Đổi ngang 0đ)');
            }
        });
    } else if (type === 'upgrade') {
        if (exchangeUpgradeBox) exchangeUpgradeBox.classList.remove('hidden');
    }
}

// Chuyển sang Section tiếp theo với Validation lồng ghép
function nextSection(current) {
    const currentSectionEl = document.querySelector(`.form-section[data-section="${current}"]`);
    if (!currentSectionEl) return;

    const inputs = currentSectionEl.querySelectorAll('select, input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.checkValidity()) {
            isValid = false;
            input.reportValidity();
        }
    });

    // 1. KIỂM TRÁ LOGIC CÂU 5 (MỤC ĐÍCH ĐẾN CỬA HÀNG)
    if (current === 2) {
        const visitPurposeEl = currentSectionEl.querySelector('input[name="visitPurpose"]:checked');
        if (visitPurposeEl) {
            const purposeVal = visitPurposeEl.value;
            
            if (purposeVal === 'Nhận hàng' || purposeVal === 'Khác') {
                showShinkoModal({
                    title: 'XÁC NHẬN LƯỢT HẬU MÃI / DỊCH VỤ',
                    message: `Bạn đã chọn mục đích: "${purposeVal}".\n\nHệ thống sẽ ghi nhận đây là lượt Hậu mãi/Dịch vụ và hoàn tất nộp phiếu khảo sát ngay.`,
                    icon: '📋',
                    showCancel: true,
                    confirmText: 'Hoàn tất ngay ✓',
                    cancelText: 'Chọn lại',
                    onConfirm: function() {
                        submitServiceSurvey(purposeVal);
                    }
                });
                return;
            }

            if (purposeVal === 'Đổi hàng/Bảo hành') {
                const exchangeTypeEl = currentSectionEl.querySelector('input[name="exchangeType"]:checked');
                if (!exchangeTypeEl) {
                    showShinkoModal({
                        title: 'CHƯA CHỌN PHÂN LOẠI ĐỔI HÀNG',
                        message: 'Vui lòng chọn phân loại Đổi ngang (0đ) hoặc Đổi nâng cấp (Có thu thêm tiền)!',
                        icon: '❓'
                    });
                    return;
                }

                if (exchangeTypeEl.value === 'upgrade') {
                    const amtInput = currentSectionEl.querySelector('input[name="exchangeUpgradeAmount"]');
                    const amtVal = Number(amtInput.value);
                    if (isNaN(amtVal) || amtVal < 10000 || amtVal > 500000000) {
                        showShinkoModal({
                            title: '⚠️ LỖI ĐỊNH DẠNG SỐ TIỀN THU THÊM',
                            message: 'Vui lòng nhập Số tiền thu thêm chênh lệch hợp lệ (Ví dụ: 1000000 cho 1 triệu đồng).',
                            icon: '💰',
                            onConfirm: function() { amtInput.focus(); }
                        });
                        return;
                    }

                    const checkedProds = currentSectionEl.querySelectorAll('input[name="exchangeProducts"]:checked');
                    if (checkedProds.length === 0) {
                        showShinkoModal({
                            title: '⚠️ CHƯA CHỌN SẢN PHẨM LẤY THÊM',
                            message: 'Vui lòng chọn ít nhất 1 nhóm sản phẩm khách hàng lấy thêm khi đổi nâng cấp!',
                            icon: '🛒'
                        });
                        return;
                    }

                    submitExchangeUpgradeSurvey(amtVal, currentSectionEl.querySelector('input[name="exchangeInvoiceCode"]').value, Array.from(checkedProds).map(cb => cb.value));
                    return;
                }
            }
        }
    }

    // Trường hợp checkbox phần 3 (Câu 6)
    if (current === 3) {
        const checkboxes = currentSectionEl.querySelectorAll('input[name="interestedProducts"]:checked');
        if (checkboxes.length === 0) {
            showShinkoModal({
                title: 'CHƯA CHỌN SẢN PHẨM QUAN TÂM',
                message: 'Vui lòng chọn ít nhất 1 nhóm sản phẩm khách hàng quan tâm.',
                icon: '🛒'
            });
            return;
        }
    }

    if (!isValid) return;

    // Phân nhánh logic tại Phần 4 (Câu 8)
    let nextStep = current + 1;
    if (current === 4) {
        if (hasPurchasedValue === 'Có') {
            nextStep = 5;
        } else if (hasPurchasedValue === 'Không') {
            nextStep = 6;
        } else {
            showShinkoModal({
                title: 'CHƯA CHỌN KẾT QUẢ MUA HÀNG',
                message: 'Vui lòng chọn khách có mua hàng hay không!',
                icon: '❓'
            });
            return;
        }
    }

    showSection(nextStep);
}

// Quay lại Section trước
function prevSection(current) {
    let prevStep = current - 1;
    if (current === 5 || current === 6) {
        prevStep = 4;
    }
    showSection(prevStep);
}

// Xử lý sự kiện khi chọn CÓ / KHÔNG ở câu 8
function handlePurchaseChoice(value) {
    hasPurchasedValue = value;
    const step5Label = document.getElementById('step-5-label');
    if (step5Label) {
        step5Label.innerText = (value === 'Có') ? 'Mua hàng' : 'Chưa mua';
    }
}

// Hiển thị phần được chỉ định & cập nhật Stepper visual
function showSection(sectionNumber) {
    document.querySelectorAll('.form-section').forEach(sec => sec.classList.remove('active'));
    
    const targetSection = document.querySelector(`.form-section[data-section="${sectionNumber}"]`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    let activeStepperIndex = sectionNumber;
    if (sectionNumber === 6) activeStepperIndex = 5;

    document.querySelectorAll('.step-item').forEach((step, idx) => {
        const stepNum = idx + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum < activeStepperIndex) {
            step.classList.add('completed');
        } else if (stepNum === activeStepperIndex) {
            step.classList.add('active');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Reset Form làm lại khảo sát mới
function resetForm() {
    const form = document.getElementById('surveyForm');
    if (form) form.reset();
    hasPurchasedValue = '';
    const exchangeSubBox = document.getElementById('exchangeSubOptions');
    const exchangeUpgradeBox = document.getElementById('exchangeUpgradeDetails');
    if (exchangeSubBox) exchangeSubBox.classList.add('hidden');
    if (exchangeUpgradeBox) exchangeUpgradeBox.classList.add('hidden');
    const successModal = document.getElementById('successModal');
    if (successModal) successModal.classList.add('hidden');
    checkUrlParams();
    showSection(1);
}

// Kiểm tra tham số URL (VD: ?showroom=Xã Đàn)
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const showroomParam = urlParams.get('showroom');
    if (showroomParam) {
        const showroomSelect = document.querySelector('select[name="showroom"]');
        if (showroomSelect) {
            showroomSelect.value = showroomParam;
        }
    }
}
