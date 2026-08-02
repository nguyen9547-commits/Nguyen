/**
 * SHINKO RETAIL ANALYTICS V3 — OFFLINE STORAGE & AUTO-SYNC QUEUE MODULE
 * Đảm bảo 100% dữ liệu khảo sát không bị mất khi thiết bị rớt mạng hoặc kết nối GAS bị lỗi.
 */

const SHINKO_STORAGE_KEY = 'SHINKO_OFFLINE_SURVEY_QUEUE';

const ShinkoOfflineSync = {
    // Lấy danh sách phiếu khảo sát đang chờ trong hàng đợi offline
    getQueue: function() {
        try {
            const data = localStorage.getItem(SHINKO_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Lỗi khi đọc hàng đợi offline:', e);
            return [];
        }
    },

    // Lưu phiếu khảo sát vào hàng đợi offline
    saveSurvey: function(surveyData, surveyType = 'Thường') {
        try {
            const queue = this.getQueue();
            const item = {
                id: 'SURVEY_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                type: surveyType,
                data: surveyData,
                savedAt: new Date().toLocaleString('vi-VN')
            };
            queue.push(item);
            localStorage.setItem(SHINKO_STORAGE_KEY, JSON.stringify(queue));
            console.warn(`[OFFLINE STORAGE] Đã lưu phiếu (${surveyType}) vào máy:`, item);
            this.updateBadgeUI();
            return item;
        } catch (e) {
            console.error('Lỗi khi lưu phiếu offline:', e);
            return null;
        }
    },

    // Xóa phiếu đã gửi thành công khỏi hàng đợi
    removeSurvey: function(id) {
        try {
            let queue = this.getQueue();
            queue = queue.filter(item => item.id !== id);
            localStorage.setItem(SHINKO_STORAGE_KEY, JSON.stringify(queue));
            this.updateBadgeUI();
        } catch (e) {
            console.error('Lỗi khi xóa phiếu offline:', e);
        }
    },

    // Cập nhật số lượng phiếu offline chờ gửi trên giao diện
    updateBadgeUI: function() {
        const queue = this.getQueue();
        let badge = document.getElementById('offlineSyncBadge');
        
        if (queue.length > 0) {
            if (!badge) {
                badge = document.createElement('div');
                badge.id = 'offlineSyncBadge';
                badge.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #987147;
                    color: #FFFFFF;
                    padding: 10px 16px;
                    border-radius: 30px;
                    font-size: 13px;
                    font-weight: 600;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    z-index: 9999;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                `;
                document.body.appendChild(badge);
                badge.onclick = () => {
                    if (navigator.onLine) {
                        this.processQueue();
                    } else {
                        if (typeof showShinkoModal === 'function') {
                            showShinkoModal({
                                title: 'HÀNG ĐỢI OFFLINE',
                                message: `Đang có ${queue.length} phiếu khảo sát lưu trên máy.\n\nHệ thống sẽ tự động đồng bộ gửi lên Google Sheet ngay khi thiết bị có kết nối Internet.`,
                                icon: '📲'
                            });
                        }
                    }
                };
            }
            badge.innerHTML = `<span>⚡ Đang chờ gửi: <strong>${queue.length} phiếu</strong></span>`;
            badge.style.display = 'flex';
        } else if (badge) {
            badge.style.display = 'none';
        }
    },

    // Thực hiện tự động gửi toàn bộ phiếu trong hàng đợi khi khôi phục mạng
    processQueue: async function() {
        if (!navigator.onLine) return;
        const queue = this.getQueue();
        if (queue.length === 0) return;

        console.log(`[AUTO-SYNC] Đang xử lý đồng bộ ${queue.length} phiếu khảo sát offline...`);

        for (const item of queue) {
            try {
                if (typeof sendToGoogleAppsScript === 'function') {
                    const success = await sendToGoogleAppsScript(item.data, false);
                    if (success) {
                        console.log(`[AUTO-SYNC] Đã gửi thành công phiếu ${item.id}`);
                        this.removeSurvey(item.id);
                    }
                }
            } catch (err) {
                console.error(`[AUTO-SYNC] Lỗi đồng bộ phiếu ${item.id}:`, err);
            }
        }
    }
};

// Đăng ký sự kiện lắng nghe khi khôi phục kết nối mạng Internet
window.addEventListener('online', () => {
    console.log('[NETWORK] Thiết bị đã kết nối lại Internet. Đang tự động gửi hàng đợi...');
    ShinkoOfflineSync.processQueue();
});

// Tự động kiểm tra hàng đợi khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    ShinkoOfflineSync.updateBadgeUI();
    if (navigator.onLine) {
        ShinkoOfflineSync.processQueue();
    }
});
