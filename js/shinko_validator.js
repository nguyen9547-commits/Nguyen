/**
 * SHINKO RETAIL ANALYTICS V3 — VALIDATION & AUDIT ENGINE MODULE
 * Đảm bảo 100% dữ liệu khảo sát không bị lỗi logic trước khi gửi.
 */

const ShinkoValidator = {
    // Hàm chuẩn hóa chuỗi tiếng Việt tránh lỗi so sánh NFC/NFD
    normStr: function(str) {
        if (!str) return '';
        return str.toString().trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },

    // Kiểm tra toàn bộ tính hợp lệ của dữ liệu trước khi gửi Form
    validateSurveyData: function() {
        const hasPurEl = document.querySelector('input[name="hasPurchased"]:checked');
        const isPurchased = (hasPurEl && (this.normStr(hasPurEl.value) === 'co' || hasPurchasedValue === 'Có'));

        if (isPurchased) {
            const qtyEl = document.querySelector('input[name="purchaseQuantity"]:checked');
            const purProds = Array.from(document.querySelectorAll('input[name="purchasedProducts"]:checked'));

            if (purProds.length === 0) {
                showShinkoModal({
                    title: '⚠️ CHƯA CHỌN SẢN PHẨM MUA',
                    message: 'Khách hàng có mua hàng. Vui lòng tích chọn ít nhất 1 nhóm sản phẩm đã mua ở Câu 12!',
                    icon: '🛍️'
                });
                return false;
            }

            // KỊCH BẢN 1: RÀNG BUỘC KÍCH THƯỚC GIỎ HÀNG (CÂU 11 VS CÂU 12)
            if (qtyEl) {
                const qtyNum = parseInt(qtyEl.value, 10);
                if (purProds.length > qtyNum) {
                    showShinkoModal({
                        title: '⚠️ BÁO ĐỘNG PHÁT HIỆN LỖI GIỎ HÀNG',
                        message: `Số nhóm sản phẩm bạn chọn (${purProds.length} nhóm) vượt quá Số lượng ${qtyNum} sản phẩm đã mua ở Câu 11.\n\nVui lòng điều chỉnh lại số lượng hoặc bớt danh mục SP chọn mua!`,
                        icon: '🛒'
                    });
                    return false;
                }
            }

            // KỊCH BẢN 2: ĐỐI SOÁT CÂU 12 (SP MUA) VS CÂU 6 (SP QUAN TÂM)
            const intProdsChecked = Array.from(document.querySelectorAll('input[name="interestedProducts"]:checked')).map(cb => this.normStr(cb.value));
            const missingProds = [];
            purProds.forEach(cb => {
                if (!intProdsChecked.includes(this.normStr(cb.value))) {
                    missingProds.push(cb.value);
                }
            });

            if (missingProds.length > 0) {
                showShinkoModal({
                    title: '🚨 BÁO ĐỘNG PHÁT HIỆN LỖI ĐỐI SOÁT',
                    message: `Sản phẩm đã mua: "${missingProds.join(', ')}" CHƯA ĐƯỢC TÍCH ở Câu 6 (Sản phẩm quan tâm).\n\nQuy tắc: Mọi sản phẩm khách đã mua đều phải nằm trong danh sách sản phẩm quan tâm.\n\nHệ thống sẽ chuyển bạn quay lại Phần 3 để tích bổ sung!`,
                    icon: '🚨',
                    onConfirm: function() {
                        if (typeof showSection === 'function') showSection(3);
                    }
                });
                return false;
            }

            // KỊCH BẢN 3: ĐỊNH DẠNG SỐ TIỀN DOANH THU HOÁ ĐƠN
            const amtInput = document.querySelector('input[name="invoiceAmount"]');
            if (amtInput && amtInput.value) {
                const amtVal = Number(amtInput.value);
                if (isNaN(amtVal) || amtVal < 10000 || amtVal > 500000000) {
                    showShinkoModal({
                        title: '⚠️ LỖI ĐỊNH DẠNG DOANH THU',
                        message: `Số tiền hóa đơn "${amtInput.value}" không hợp lệ.\n\nVui lòng chỉ nhập số nguyên VNĐ hợp lệ (Từ 10.000đ đến 500.000.000đ, Ví dụ: 2500000).`,
                        icon: '💰',
                        onConfirm: function() {
                            amtInput.focus();
                        }
                    });
                    return false;
                }
            }
        }
        return true;
    },

    // Lắng nghe sự kiện để báo động ngay lập tức khi tích chọn Câu 12
    initInstantValidation: function() {
        const purCheckboxes = document.querySelectorAll('input[name="purchasedProducts"]');
        const self = this;

        purCheckboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                if (this.checked) {
                    const prodName = this.value;
                    const checkboxEl = this;

                    // 1. Kiểm tra giới hạn giỏ hàng (Câu 11 vs Câu 12)
                    const qtyEl = document.querySelector('input[name="purchaseQuantity"]:checked');
                    if (qtyEl) {
                        const qtyNum = parseInt(qtyEl.value, 10);
                        const purProdsChecked = document.querySelectorAll('input[name="purchasedProducts"]:checked');
                        if (purProdsChecked.length > qtyNum) {
                            checkboxEl.checked = false; // Nhả tích ngay lập tức
                            showShinkoModal({
                                title: '⚠️ BÁO ĐỘNG VƯỢT QUÁ GIỎ HÀNG',
                                message: `Số nhóm sản phẩm bạn vừa tích chọn (${purProdsChecked.length} nhóm) vượt quá Số lượng ${qtyNum} sản phẩm đã chọn mua ở Câu 11.\n\nVui lòng chỉ chọn tối đa ${qtyNum} nhóm sản phẩm!`,
                                icon: '🛒'
                            });
                            return;
                        }
                    }

                    // 2. Kiểm tra đối soát sản phẩm quan tâm (Câu 12 vs Câu 6)
                    const intProdsChecked = Array.from(document.querySelectorAll('input[name="interestedProducts"]:checked')).map(item => self.normStr(item.value));
                    if (!intProdsChecked.includes(self.normStr(prodName))) {
                        showShinkoModal({
                            title: '🚨 BÁO ĐỘNG PHÁT HIỆN LỖI ĐỐI SOÁT',
                            message: `Sản phẩm đã mua: "${prodName}" CHƯA ĐƯỢC TÍCH ở Câu 6 (Sản phẩm quan tâm).\n\nQuy tắc: Mọi sản phẩm khách đã mua đều phải nằm trong danh sách sản phẩm quan tâm.\n\nHệ thống sẽ chuyển bạn quay lại Phần 3 để tích bổ sung!`,
                            icon: '🚨',
                            onConfirm: function() {
                                checkboxEl.checked = false;
                                if (typeof showSection === 'function') showSection(3);
                            }
                        });
                    }
                }
            });
        });
    }
};
