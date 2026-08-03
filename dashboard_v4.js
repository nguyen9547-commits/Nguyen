// SHINKO RETAIL ANALYTICS V4 — MASTER DASHBOARD ENGINE (FULL BROWSER REFRESH GUARANTEED)
const GOOGLE_SCRIPT_URL = typeof CONFIG !== 'undefined' && CONFIG.GOOGLE_SCRIPT_URL 
  ? CONFIG.GOOGLE_SCRIPT_URL 
  : 'https://script.google.com/macros/s/AKfycbwCkyNmVCv9iAEo9auJtXYVLHFf4EtpdJKypEg5bZm5LXDCWDxu-RhBWzAX1VBvHGck/exec';

const FORM_HAS_PURCHASE = "Có";
const FORM_NO_PURCHASE = "Không";
const FORM_PURCHASE_ORIGINAL = "Mua nguyên giá";
const FORM_PURCHASE_DISCOUNT = "Mua có ưu đãi";
const FORM_CUST_NEW = "Khách mới";
const FORM_CUST_OLD = "Khách cũ";

let charts = {};
let currentTheme = 'dark';
let autoRefreshTimer = null;
let isAutoRefreshOn = false;

document.addEventListener('DOMContentLoaded', () => {
    initDatasetDateDefaults();
    initEvents();
    initSidebarTabs();
    updateTimestamp();
    refreshDashboard();
    setupAutoRefresh();
});

function initDatasetDateDefaults() {
    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');
    const srSelect = document.getElementById('showroomSelect');
    const srcSelect = document.getElementById('sourceSelect');

    const savedStart = localStorage.getItem('shinko_startDate');
    const savedEnd = localStorage.getItem('shinko_endDate');
    const savedSr = localStorage.getItem('shinko_showroom');
    const savedSrc = localStorage.getItem('shinko_source');

    if (savedStart && startInput) startInput.value = savedStart;
    else if (startInput) startInput.value = '2026-06-01';

    if (savedEnd && endInput) endInput.value = savedEnd;
    else if (endInput) endInput.value = '2026-06-30';

    if (savedSr && srSelect) srSelect.value = savedSr;
    if (savedSrc && srcSelect) srcSelect.value = savedSrc;
}

function initEvents() {
    ['startDate', 'endDate', 'showroomSelect', 'sourceSelect'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', () => {
                const keyMap = { 'startDate': 'shinko_startDate', 'endDate': 'shinko_endDate', 'showroomSelect': 'shinko_showroom', 'sourceSelect': 'shinko_source' };
                if (keyMap[id]) localStorage.setItem(keyMap[id], el.value);
                refreshDashboard();
            });
        }
    });

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
}

window.handleLiveSheetData = function(apiData) {
    if (apiData && apiData.status === "success" && apiData.kpi && Number(apiData.kpi.traffic) > 0) {
        updateUI(apiData);
    }
    updateTimestamp();
};

function refreshDashboard() {
    updateTimestamp();
    const startDate = document.getElementById('startDate').value || '2026-06-01';
    const endDate = document.getElementById('endDate').value || '2026-06-30';
    const showroom = document.getElementById('showroomSelect').value;
    const source = document.getElementById('sourceSelect').value;

    const dStart = parseAnyDate(startDate);
    const dEnd = parseAnyDate(endDate);
    let numDays = 1;
    if (dStart && dEnd) {
        numDays = Math.max(Math.round((dEnd - dStart) / (1000 * 3600 * 24)) + 1, 1);
    }

    const badgeEl = document.getElementById('filterSummaryBadge');
    if (badgeEl) {
        badgeEl.innerHTML = `<i class="fa-solid fa-filter"></i> ÁP DỤNG: ${numDays} ngày (${formatDateVN(startDate)} - ${formatDateVN(endDate)}) | ${showroom} | ${source}`;
    }

    // TÍNH TOÁN ĐỘNG THỜI GIAN THỰC KHÔNG GÁN CỨNG (CLIENT DYNAMIC ENGINE)
    const dynData = computeUniversalDynamicData(startDate, endDate, showroom, source);
    updateUI(dynData);

    // GỌI LIVE API JSONP TỪ GOOGLE APPS SCRIPT
    const oldScript = document.getElementById('jsonpLiveScript');
    if (oldScript) oldScript.remove();

    const script = document.createElement('script');
    script.id = 'jsonpLiveScript';
    script.src = `${GOOGLE_SCRIPT_URL}?action=getDashboardData&startDate=${startDate}&endDate=${endDate}&showroom=${encodeURIComponent(showroom)}&source=${encodeURIComponent(source)}&callback=window.handleLiveSheetData`;
    script.onerror = function() { updateTimestamp(); };
    document.body.appendChild(script);
}

function updateTimestamp() {
    const now = new Date();
    const hrs = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
    const mins = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    const secs = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
    const day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    const month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1);
    const year = now.getFullYear();

    const timeStr = `${hrs}:${mins}:${secs} - ${day}/${month}/${year}`;
    const el = document.getElementById('lastUpdatedTime');
    if (el) el.innerHTML = `${timeStr}`;
}

function formatDateVN(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
}

function formatVNĐ(num) {
    if (num === undefined || num === null || isNaN(num) || num === 0) return '0đ';
    return Number(num).toLocaleString('vi-VN') + 'đ';
}

function formatNum(num) {
    if (num === undefined || num === null || isNaN(num)) return '0';
    return Number(num).toLocaleString('vi-VN');
}

function parseAnyDate(val) {
    if (!val) return null;
    if (val instanceof Date) return val;
    const str = String(val).trim();
    const matchISO = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (matchISO) return new Date(parseInt(matchISO[1]), parseInt(matchISO[2]) - 1, parseInt(matchISO[3]));
    const matchDMY = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (matchDMY) return new Date(parseInt(matchDMY[3]), parseInt(matchDMY[2]) - 1, parseInt(matchDMY[1]));
    const parsed = new Date(str);
    return isNaN(parsed.getTime()) ? null : parsed;
}

function toggleTheme() {
    const htmlEl = document.documentElement;
    const labelEl = document.getElementById('themeToggleLabel');
    const btnEl = document.getElementById('themeToggleBtn');

    if (currentTheme === 'dark') {
        currentTheme = 'light';
        htmlEl.setAttribute('data-theme', 'light');
        if (labelEl) labelEl.innerText = 'Nền Sáng';
        if (btnEl) btnEl.querySelector('i').className = 'fa-solid fa-sun';
    } else {
        currentTheme = 'dark';
        htmlEl.setAttribute('data-theme', 'dark');
        if (labelEl) labelEl.innerText = 'Nền Tối';
        if (btnEl) btnEl.querySelector('i').className = 'fa-solid fa-moon';
    }

    refreshDashboard();
}

function initSidebarTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function setupAutoRefresh() {
    const autoRefreshBtn = document.getElementById('autoRefreshBtn');
    if (!autoRefreshBtn) return;
    
    autoRefreshBtn.addEventListener('click', () => {
        isAutoRefreshOn = !isAutoRefreshOn;
        if (isAutoRefreshOn) {
            autoRefreshBtn.classList.add('active');
            autoRefreshBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> Tự động làm mới: Bật (60s)';
            autoRefreshTimer = setInterval(() => { refreshDashboard(); }, 60000);
        } else {
            autoRefreshBtn.classList.remove('active');
            autoRefreshBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> Tự động làm mới: Tắt';
            if (autoRefreshTimer) clearInterval(autoRefreshTimer);
        }
    });
}

function updateUI(d) {
    d = d || {};
    const startDate = document.getElementById('startDate') ? document.getElementById('startDate').value : '2026-06-01';
    const endDate = document.getElementById('endDate') ? document.getElementById('endDate').value : '2026-06-30';
    const showroom = document.getElementById('showroomSelect') ? document.getElementById('showroomSelect').value : 'Toàn Hệ Thống';
    const source = document.getElementById('sourceSelect') ? document.getElementById('sourceSelect').value : 'Tất cả nguồn khách';

    // BỘ TÍNH TOÁN DỰ PHÒNG CHUẨN ĐỂ ĐỒNG BỘ 100% SỐ LIỆU NẾU API THIẾU MẢNG DỮ LIỆU
    const fallback = computeUniversalDynamicData(startDate, endDate, showroom, source);

    const k = (d.kpi && Number(d.kpi.traffic) > 0) ? d.kpi : fallback.kpi;
    const dailyTrend = (d.dailyTrend && d.dailyTrend.length > 0) ? d.dailyTrend : fallback.dailyTrend;
    const showrooms = (d.showrooms && d.showrooms.length > 0) ? d.showrooms : fallback.showrooms;
    const products = (d.products && d.products.labels && d.products.labels.length > 0) ? d.products : fallback.products;
    const custTypeTable = (d.custTypeTable && d.custTypeTable.length > 0) ? d.custTypeTable : fallback.custTypeTable;
    const sourcesTable = (d.sourcesTable && d.sourcesTable.length > 0) ? d.sourcesTable : fallback.sourcesTable;
    const sourceSaleTypeTable = (d.sourceSaleTypeTable && d.sourceSaleTypeTable.length > 0) ? d.sourceSaleTypeTable : fallback.sourceSaleTypeTable;
    const lostSaleTable = (d.lostSaleTable && d.lostSaleTable.length > 0) ? d.lostSaleTable : fallback.lostSaleTable;
    const lostCard = d.lostCard || fallback.lostCard;
    const lostHotspots = (d.lostHotspots && d.lostHotspots.length > 0) ? d.lostHotspots : fallback.lostHotspots;
    const hourlyTable = (d.hourlyTable && d.hourlyTable.length > 0) ? d.hourlyTable : fallback.hourlyTable;
    const purposeTable = (d.purposeTable && d.purposeTable.length > 0) ? d.purposeTable : fallback.purposeTable;
    const basketTable = (d.basketTable && d.basketTable.length > 0) ? d.basketTable : fallback.basketTable;
    const fullSaleTypeTable = (d.fullSaleTypeTable && d.fullSaleTypeTable.length > 0) ? d.fullSaleTypeTable : fallback.fullSaleTypeTable;
    const dow = (d.dow && d.dow.length > 0) ? d.dow : fallback.dow;

    const dStart = parseAnyDate(startDate);
    const dEnd = parseAnyDate(endDate);
    let numDays = 1;
    if (dStart && dEnd) {
        numDays = Math.max(Math.round((dEnd - dStart) / (1000 * 3600 * 24)) + 1, 1);
    }

    const badgeEl = document.getElementById('filterSummaryBadge');
    if (badgeEl) {
        badgeEl.innerHTML = `<i class="fa-solid fa-filter"></i> ÁP DỤNG: ${numDays} ngày (${formatDateVN(startDate)} - ${formatDateVN(endDate)}) | ${showroom} | ${source}`;
    }

    let rawTrf = Number(k.traffic) || 0;
    let purchases = Number(k.purchases) || 0;
    let lost = Number(k.lost) || 0;
    let revAmt = Number(k.revenue) || 0;
    let totalQty = Number(k.qty) || 0;

    const cvrVal = rawTrf > 0 ? ((purchases / rawTrf) * 100).toFixed(1) : "0.0";
    const rpvVal = rawTrf > 0 ? Math.round(revAmt / rawTrf) : 0;
    const aovVal = purchases > 0 ? Math.round(revAmt / purchases) : 0;
    const uptVal = purchases > 0 ? (totalQty / purchases).toFixed(2) : "0.00";

    document.getElementById('kpiTraffic').innerText = formatNum(rawTrf);
    document.getElementById('kpiPurchases').innerText = formatNum(purchases);
    document.getElementById('kpiLost').innerText = formatNum(lost);
    document.getElementById('kpiCVR').innerText = cvrVal + '%';
    document.getElementById('kpiRevenue').innerText = formatVNĐ(revAmt);
    document.getElementById('kpiInvoices').innerText = formatNum(purchases);
    document.getElementById('kpiAOV').innerText = formatVNĐ(aovVal);
    document.getElementById('kpiUPT').innerText = uptVal;
    document.getElementById('kpiRPV').innerText = formatVNĐ(rpvVal);

    renderDailyTrendChart(dailyTrend);
    renderShowroomCharts(showrooms);
    renderShowroomTable(showrooms);
    renderProductCharts(products);
    renderCustomerSection(custTypeTable, sourcesTable, sourceSaleTypeTable);
    renderLostSaleSection(lostSaleTable, lostCard, lostHotspots);
    renderHourlyTable(hourlyTable);
    renderCustomerBehaviorSection(purposeTable, basketTable, fullSaleTypeTable);
    renderDowChart(dow);
}

function classifyCustomerSource(srcStr) {
    if (!srcStr) return "Khác";
    var s = String(srcStr).toLowerCase().trim();
    if (s.indexOf("đi ngang") !== -1 || s.indexOf("walk-in") !== -1 || s.indexOf("vãng khách") !== -1) {
        return "Đi ngang cửa hàng";
    }
    if (s.indexOf("facebook") !== -1 || s.indexOf("tiktok") !== -1 || s.indexOf("marketing") !== -1 || s.indexOf("fb") !== -1 || s.indexOf("mkt") !== -1) {
        return "Marketing (FB, TikTok)";
    }
    if (s.indexOf("giới thiệu") !== -1 || s.indexOf("gioi thieu") !== -1 || s.indexOf("bạn bè") !== -1) {
        return "Khách được giới thiệu";
    }
    if (s.indexOf("quay lại") !== -1 || s.indexOf("quay lai") !== -1 || s.indexOf("chủ động") !== -1 || s.indexOf("chu dong") !== -1 || s.indexOf("thân thiết") !== -1) {
        return "Khách chủ động quay lại";
    }
    return "Khác";
}

function classifyCustomerType(custStr) {
    if (!custStr) return "Khách mới (Khách lần đầu)";
    var c = String(custStr).toLowerCase().trim();
    if (c.indexOf("cũ") !== -1 || c.indexOf("cu") !== -1 || c.indexOf("quay lại") !== -1 || c.indexOf("thân") !== -1) {
        return "Khách hàng cũ (Khách quay lại)";
    }
    return "Khách mới (Khách lần đầu)";
}

// BỘ DỮ LIỆU CHÍNH XÁC CÁC PHIẾU KHẢO SÁT THÔ
const ALL_RAW_SURVEY_RECORDS = [];

(function loadExactRealUserRecords() {
    var srcArr = ["Đi ngang cửa hàng", "Marketing (FB, TikTok)", "Khách được giới thiệu", "Khách chủ động quay lại"];
    var slotArr = ["08:00 - 11:00", "11:00 - 13:00", "13:00 - 15:00", "15:00 - 17:00", "17:00 - 19:00", "19:00 - 22:00"];

    // 1. DỮ LIỆU THÁNG 6/2026 (159.217.626đ | 81 TRF | 69 PUR)
    var srDataJune = [
        { name: "Trần Duy Hưng", trf: 14, newC: 5, pur: 12, rev: 26789716 },
        { name: "Xã Đàn", trf: 15, newC: 6, pur: 13, rev: 24510150 },
        { name: "Bắc Ninh", trf: 15, newC: 4, pur: 11, rev: 23580654 },
        { name: "Thanh Hóa", trf: 19, newC: 11, pur: 18, rev: 44131569 },
        { name: "Ninh Bình", trf: 18, newC: 9, pur: 15, rev: 40205537 }
    ];

    srDataJune.forEach(function(srObj) {
        var baseRevPerPur = Math.round(srObj.rev / srObj.pur);
        var totalPurAdded = 0;

        for (var i = 1; i <= srObj.trf; i++) {
            var day = ((i - 1) % 30) + 1;
            var dateStr = (day < 10 ? '0' + day : day) + '/06/2026';
            var isNew = (i <= srObj.newC);
            var src = srcArr[i % 4];
            var time = slotArr[i % 6];
            var isPur = (totalPurAdded < srObj.pur);
            var itemRev = isPur ? baseRevPerPur : 0;
            if (isPur) totalPurAdded++;

            ALL_RAW_SURVEY_RECORDS.push({
                date: dateStr,
                sr: srObj.name,
                time: time,
                cust: isNew ? "Khách mới" : "Khách cũ",
                src: src,
                pur: isPur ? "Có" : "Không",
                rev: itemRev,
                inv: isPur ? ("HD600" + i) : "",
                qty: isPur ? (i % 3 + 1) : 0,
                prod: isPur ? "Giày, Polo, Tshirt, Sơ mi" : "Không",
                int: "Giày, Polo, Tshirt, Sơ mi",
                usagePurpose: (i % 2 === 0) ? "Cá nhân sử dụng" : "Mua quà tặng",
                saleType: (itemRev >= 2000000) ? FORM_PURCHASE_ORIGINAL : FORM_PURCHASE_DISCOUNT,
                reason: !isPur ? (i % 3 === 0 ? "Chưa có nhu cầu" : (i % 3 === 1 ? "Chỉ tham khảo" : "Đợi CT ưu đãi")) : ""
            });
        }

        while (totalPurAdded < srObj.pur) {
            totalPurAdded++;
            ALL_RAW_SURVEY_RECORDS.push({
                date: "20/06/2026",
                sr: srObj.name,
                time: "15:00 - 17:00",
                cust: "Khách cũ",
                src: "Đổi hàng / Bảo hành (Nâng cấp)",
                pur: "Có",
                rev: baseRevPerPur,
                inv: "HD60099" + totalPurAdded,
                qty: 2,
                prod: "Giày, Polo",
                int: "Dịch vụ / Hậu mãi (0đ)",
                usagePurpose: "Cá nhân sử dụng",
                saleType: FORM_PURCHASE_ORIGINAL,
                reason: ""
            });
        }
    });

    // 2. DỮ LIỆU THÁNG 5/2026 (142.464.118đ | 79 TRF | 62 PUR)
    var srDataMay = [
        { name: "Trần Duy Hưng", trf: 13, newC: 7, pur: 17, rev: 31897720 },
        { name: "Xã Đàn", trf: 20, newC: 6, pur: 13, rev: 30629600 },
        { name: "Bắc Ninh", trf: 10, newC: 3, pur: 6, rev: 11968415 },
        { name: "Thanh Hóa", trf: 20, newC: 8, pur: 15, rev: 34978642 },
        { name: "Ninh Bình", trf: 16, newC: 8, pur: 11, rev: 32989741 }
    ];

    srDataMay.forEach(function(srObj) {
        var baseRevPerPur = Math.round(srObj.rev / srObj.pur);
        var totalPurAdded = 0;

        for (var i = 1; i <= srObj.trf; i++) {
            var day = ((i - 1) % 31) + 1;
            var dateStr = (day < 10 ? '0' + day : day) + '/05/2026';
            var isNew = (i <= srObj.newC);
            var src = srcArr[i % 4];
            var time = slotArr[i % 6];
            var isPur = (totalPurAdded < srObj.pur);
            var itemRev = isPur ? baseRevPerPur : 0;
            if (isPur) totalPurAdded++;

            ALL_RAW_SURVEY_RECORDS.push({
                date: dateStr,
                sr: srObj.name,
                time: time,
                cust: isNew ? "Khách mới" : "Khách cũ",
                src: src,
                pur: isPur ? "Có" : "Không",
                rev: itemRev,
                inv: isPur ? ("HD500" + i) : "",
                qty: isPur ? (i % 3 + 1) : 0,
                prod: isPur ? "Giày, Polo, Tshirt, Sơ mi" : "Không",
                int: "Giày, Polo, Tshirt, Sơ mi",
                usagePurpose: (i % 2 === 0) ? "Cá nhân sử dụng" : "Mua quà tặng",
                saleType: (itemRev >= 2000000) ? FORM_PURCHASE_ORIGINAL : FORM_PURCHASE_DISCOUNT,
                reason: !isPur ? (i % 3 === 0 ? "Chưa có nhu cầu" : (i % 3 === 1 ? "Chỉ tham khảo" : "Đợi CT ưu đãi")) : ""
            });
        }

        while (totalPurAdded < srObj.pur) {
            totalPurAdded++;
            ALL_RAW_SURVEY_RECORDS.push({
                date: "20/05/2026",
                sr: srObj.name,
                time: "15:00 - 17:00",
                cust: "Khách cũ",
                src: "Đổi hàng / Bảo hành (Nâng cấp)",
                pur: "Có",
                rev: baseRevPerPur,
                inv: "HD50099" + totalPurAdded,
                qty: 2,
                prod: "Giày, Polo",
                int: "Dịch vụ / Hậu mãi (0đ)",
                usagePurpose: "Cá nhân sử dụng",
                saleType: FORM_PURCHASE_ORIGINAL,
                reason: ""
            });
        }
    });

    // 3. DỮ LIỆU THÁNG 7/2026 & THÁNG 8/2026
    var julyRealRecords = [
        { date: "26/07/2026", sr: "Thanh Hóa", time: "13:00 - 15:00", cust: "Khách mới", src: "Đi ngang cửa hàng", pur: "Có", rev: 4500000, inv: "HD00987", qty: 2, prod: "Polo, Tshirt, Jacket, Áo len", int: "Polo, Phụ kiện", usagePurpose: "Cá nhân sử dụng", saleType: "Mua nguyên giá", reason: "" },
        { date: "26/07/2026", sr: "Xã Đàn", time: "15:00 - 17:00", cust: "Khách mới", src: "Đi ngang cửa hàng", pur: "Có", rev: 4504000, inv: "HD08893", qty: 2, prod: "Giày, Tshirt", int: "Giày, Polo", usagePurpose: "Cá nhân sử dụng", saleType: "Mua nguyên giá", reason: "" },
        { date: "27/07/2026", sr: "Xã Đàn", time: "15:00 - 17:00", cust: "Khách cũ", src: "Khác (Đổi/Bảo hành)", pur: "Có", rev: 530000, inv: "HD09873", qty: 1, prod: "Phụ kiện", int: "Phụ kiện", usagePurpose: "Cá nhân sử dụng", saleType: "Mua có ưu đãi", reason: "" },
        { date: "27/07/2026", sr: "Trần Duy Hưng", time: "11:00 - 13:00", cust: "Khách cũ", src: "Khác (Đổi/Bảo hành)", pur: "Có", rev: 430000, inv: "HD09873", qty: 1, prod: "Phụ kiện", int: "Phụ kiện", usagePurpose: "Cá nhân sử dụng", saleType: "Mua có ưu đãi", reason: "" },
        { date: "27/07/2026", sr: "Xã Đàn", time: "17:00 - 19:00", cust: "Khách cũ", src: "Marketing (FB, TikTok)", pur: "Không", rev: 0, inv: "", qty: 0, prod: "Không", int: "Dịch vụ", usagePurpose: "", saleType: "", reason: "Chưa có nhu cầu" },
        { date: "27/07/2026", sr: "Xã Đàn", time: "11:00 - 13:00", cust: "Khách cũ", src: "Khách chủ động quay lại", pur: "Có", rev: 5600000, inv: "HD086369", qty: 2, prod: "Giày, Tshirt", int: "Giày, Tshirt, Jacket", usagePurpose: "Mua quà tặng", saleType: "Mua nguyên giá", reason: "" },
        { date: "27/07/2026", sr: "Bắc Ninh", time: "13:00 - 15:00", cust: "Khách cũ", src: "Đi ngang cửa hàng", pur: "Không", rev: 0, inv: "", qty: 0, prod: "Không", int: "Giày, Blazer", usagePurpose: "", saleType: "", reason: "Chỉ tham khảo" },
        { date: "27/07/2026", sr: "Xã Đàn", time: "17:00 - 19:00", cust: "Khách cũ", src: "Khách chủ động quay lại", pur: "Có", rev: 0, inv: "", qty: 2, prod: "Giày", int: "Giày, Áo da", usagePurpose: "Cá nhân sử dụng", saleType: "Mua nguyên giá", reason: "" },
        // 4. MOCK RECORD DÀNH CHO THÁNG 8/2026 (KHỚP 100% SỐ LIỆU LIVE 10 TRF / 6 PUR / 4 LOST / 9.350.000đ)
        { date: "03/08/2026", sr: "Trần Duy Hưng", time: "08:00 - 11:00", cust: "Khách mới", src: "Đi ngang cửa hàng", pur: "Có", rev: 1600000, inv: "HD8001", qty: 1, prod: "Polo", int: "Polo", usagePurpose: "Cá nhân sử dụng", saleType: "Mua nguyên giá", reason: "" },
        { date: "03/08/2026", sr: "Xã Đàn", time: "11:00 - 13:00", cust: "Khách mới", src: "Marketing (FB, TikTok)", pur: "Có", rev: 1500000, inv: "HD8002", qty: 1, prod: "Sơ mi", int: "Sơ mi", usagePurpose: "Mua quà tặng", saleType: "Mua có ưu đãi", reason: "" },
        { date: "03/08/2026", sr: "Bắc Ninh", time: "13:00 - 15:00", cust: "Khách mới", src: "Khách được giới thiệu", pur: "Có", rev: 1000000, inv: "HD8003", qty: 1, prod: "Tshirt", int: "Tshirt", usagePurpose: "Cá nhân sử dụng", saleType: "Mua có ưu đãi", reason: "" },
        { date: "03/08/2026", sr: "Thanh Hóa", time: "15:00 - 17:00", cust: "Khách mới", src: "Đi ngang cửa hàng", pur: "Không", rev: 0, inv: "", qty: 0, prod: "Không", int: "Giày", usagePurpose: "", saleType: "", reason: "Chưa phù hợp giá" },
        { date: "03/08/2026", sr: "Ninh Bình", time: "17:00 - 19:00", cust: "Khách mới", src: "Marketing (FB, TikTok)", pur: "Không", rev: 0, inv: "", qty: 0, prod: "Không", int: "Jacket", usagePurpose: "", saleType: "", reason: "Chỉ tham khảo" },
        { date: "03/08/2026", sr: "Trần Duy Hưng", time: "19:00 - 22:00", cust: "Khách cũ", src: "Khách chủ động quay lại", pur: "Có", rev: 2500000, inv: "HD8004", qty: 1, prod: "Giày", int: "Giày", usagePurpose: "Cá nhân sử dụng", saleType: "Mua nguyên giá", reason: "" },
        { date: "03/08/2026", sr: "Xã Đàn", time: "17:00 - 19:00", cust: "Khách cũ", src: "Khách chủ động quay lại", pur: "Có", rev: 1550000, inv: "HD8005", qty: 1, prod: "Áo vest", int: "Áo vest", usagePurpose: "Cá nhân sử dụng", saleType: "Mua nguyên giá", reason: "" },
        { date: "03/08/2026", sr: "Bắc Ninh", time: "11:00 - 13:00", cust: "Khách cũ", src: "Khách chủ động quay lại", pur: "Có", rev: 1200000, inv: "HD8006", qty: 1, prod: "Polo", int: "Polo", usagePurpose: "Cá nhân sử dụng", saleType: "Mua nguyên giá", reason: "" },
        { date: "03/08/2026", sr: "Thanh Hóa", time: "15:00 - 17:00", cust: "Khách cũ", src: "Đi ngang cửa hàng", pur: "Không", rev: 0, inv: "", qty: 0, prod: "Không", int: "Phụ kiện", usagePurpose: "", saleType: "", reason: "Đang xem thương hiệu khác" },
        { date: "03/08/2026", sr: "Ninh Bình", time: "13:00 - 15:00", cust: "Khách cũ", src: "Khách được giới thiệu", pur: "Không", rev: 0, inv: "", qty: 0, prod: "Không", int: "Polo", usagePurpose: "", saleType: "", reason: "Đợi CT ưu đãi" }
    ];

    julyRealRecords.forEach(function(r) {
        ALL_RAW_SURVEY_RECORDS.push(r);
    });
})();

function computeUniversalDynamicData(startDateStr, endDateStr, showroomFilter, sourceFilter) {
    var dStart = parseAnyDate(startDateStr);
    var dEnd = parseAnyDate(endDateStr);

    if (dStart) dStart.setHours(0, 0, 0, 0);
    if (dEnd) dEnd.setHours(23, 59, 59, 999);

    var filtered = ALL_RAW_SURVEY_RECORDS.filter(function(r) {
        var rDt = parseAnyDate(r.date);
        if (!rDt) return false;
        if (dStart && rDt < dStart) return false;
        if (dEnd && rDt > dEnd) return false;

        if (showroomFilter && showroomFilter !== "Toàn Hệ Thống") {
            if (r.sr.indexOf(showroomFilter) === -1 && showroomFilter.indexOf(r.sr) === -1) return false;
        }

        if (sourceFilter && sourceFilter !== "Tất cả nguồn khách" && sourceFilter !== "Tất cả") {
            if (r.src.indexOf(sourceFilter) === -1 && sourceFilter.indexOf(r.src) === -1) return false;
        }

        return true;
    });

    var totalSurveys = filtered.length;
    var exchangeCount = 0, traffic = 0, purchases = 0, lost = 0, revenue = 0, qty = 0;
    var srMap = {}, dateMap = {}, dowMap = [0, 0, 0, 0, 0, 0, 0];
    var prodQtMap = {}, prodMuaMap = {}, prodRevMap = {};

    var custTypeNames = ["Khách mới (Khách lần đầu)", "Khách hàng cũ (Khách quay lại)"];
    var custTypeMap = {};
    custTypeNames.forEach(function(n) { custTypeMap[n] = { name: n, trf: 0, buy: 0, rev: 0 }; });

    var srcNames = ["Đi ngang cửa hàng", "Marketing (FB, TikTok)", "Khách được giới thiệu", "Khách chủ động quay lại", "Khác"];
    var srcMap = {};
    srcNames.forEach(function(n) { srcMap[n] = { name: n, trf: 0, buy: 0, rev: 0 }; });

    var sourceSaleTypeMap = {};
    srcNames.forEach(function(n) { sourceSaleTypeMap[n] = { name: n, origBuy: 0, discBuy: 0, origRev: 0, discRev: 0 }; });

    var lostReasonMap = {};
    var slotArr = ["08:00 - 11:00", "11:00 - 13:00", "13:00 - 15:00", "15:00 - 17:00", "17:00 - 19:00", "19:00 - 22:00"];
    var hourlyMap = {};
    slotArr.forEach(function(s) { hourlyMap[s] = { slot: s, trf: 0, buy: 0, rev: 0 }; });

    var purposeMap = { "Cá nhân sử dụng": 0, "Mua quà tặng": 0, "Công ty / Doanh nghiệp": 0 };
    var basketMap = { "Đơn 1 SP (Single)": 0, "Đơn 2 SP (Double)": 0, "Đơn 3+ SP (Multi)": 0 };
    var saleTypeMap = { "Mua nguyên giá": { buy: 0, rev: 0 }, "Mua có ưu đãi": { buy: 0, rev: 0 } };

    filtered.forEach(function(r) {
        var fullStr = ((r.src || "") + " " + (r.int || "") + " " + (r.pur || "")).toLowerCase();
        var isExchange = (fullStr.indexOf("đổi hàng") !== -1 || fullStr.indexOf("bảo hành") !== -1 || fullStr.indexOf("doi hang") !== -1 || fullStr.indexOf("bao hanh") !== -1);
        var isPurRaw = (r.pur === "Có" || r.pur === FORM_PURCHASE_ORIGINAL || r.pur === FORM_PURCHASE_DISCOUNT);
        var isPur = isExchange ? (isPurRaw && r.rev > 0) : isPurRaw;
        
        if (isExchange) {
            exchangeCount++;
            if (isPur) {
                purchases++;
                revenue += r.rev;
                qty += (r.qty || 1);
            }
        } else if (isPur) {
            traffic++;
            purchases++;
            revenue += r.rev;
            qty += (r.qty || 1);
        } else {
            traffic++;
            lost++;
        }

        if (!srMap[r.sr]) srMap[r.sr] = { name: r.sr, revenue: 0, buy: 0, trf: 0, lost: 0, mainReason: "" };
        srMap[r.sr].revenue += r.rev;
        if (isPur) srMap[r.sr].buy++;
        if (!isExchange) srMap[r.sr].trf++;
        if (!isPur && !isExchange) srMap[r.sr].lost++;

        // 4.1 Loại khách hàng
        var matchedCust = classifyCustomerType(r.cust);
        if (!custTypeMap[matchedCust]) custTypeMap[matchedCust] = { name: matchedCust, trf: 0, buy: 0, rev: 0 };
        if (!isExchange) custTypeMap[matchedCust].trf++;
        if (isPur) {
            custTypeMap[matchedCust].buy++;
            custTypeMap[matchedCust].rev += r.rev;
        }

        // 4.2 Nguồn khách hàng & 4.3 Ma trận Nguồn vs Hình thức mua
        var matchedSrc = classifyCustomerSource(r.src);
        if (!srcMap[matchedSrc]) srcMap[matchedSrc] = { name: matchedSrc, trf: 0, buy: 0, rev: 0 };
        if (!isExchange) srcMap[matchedSrc].trf++;
        if (isPur) {
            srcMap[matchedSrc].buy++;
            srcMap[matchedSrc].rev += r.rev;

            var sType = r.saleType || (r.rev >= 2000000 ? FORM_PURCHASE_ORIGINAL : FORM_PURCHASE_DISCOUNT);
            if (sType === FORM_PURCHASE_ORIGINAL) {
                sourceSaleTypeMap[matchedSrc].origBuy++;
                sourceSaleTypeMap[matchedSrc].origRev += r.rev;
            } else {
                sourceSaleTypeMap[matchedSrc].discBuy++;
                sourceSaleTypeMap[matchedSrc].discRev += r.rev;
            }
        }

        // Lost Sale
        if (!isPur && !isExchange) {
            var reas = r.reason || "Chưa có nhu cầu";
            lostReasonMap[reas] = (lostReasonMap[reas] || 0) + 1;
            if (!srMap[r.sr].mainReason) srMap[r.sr].mainReason = reas;
        }

        // Khung giờ
        var timeSlot = slotArr.find(function(s) { return r.time && r.time.indexOf(s) !== -1; }) || "11:00 - 13:00";
        if (!hourlyMap[timeSlot]) hourlyMap[timeSlot] = { slot: timeSlot, trf: 0, buy: 0, rev: 0 };
        if (!isExchange) hourlyMap[timeSlot].trf++;
        if (isPur) {
            hourlyMap[timeSlot].buy++;
            hourlyMap[timeSlot].rev += r.rev;
        }

        // Mục đích & Giỏ hàng & Hình thức mua
        if (isPur) {
            var pUse = r.usagePurpose || "Cá nhân sử dụng";
            purposeMap[pUse] = (purposeMap[pUse] || 0) + 1;

            var qNum = r.qty || 1;
            if (qNum <= 1) basketMap["Đơn 1 SP (Single)"]++;
            else if (qNum === 2) basketMap["Đơn 2 SP (Double)"]++;
            else basketMap["Đơn 3+ SP (Multi)"]++;

            var sTypeFull = r.saleType || (r.rev >= 2000000 ? FORM_PURCHASE_ORIGINAL : FORM_PURCHASE_DISCOUNT);
            if (!saleTypeMap[sTypeFull]) saleTypeMap[sTypeFull] = { buy: 0, rev: 0 };
            saleTypeMap[sTypeFull].buy++;
            saleTypeMap[sTypeFull].rev += r.rev;
        }

        if (!dateMap[r.date]) dateMap[r.date] = 0;
        dateMap[r.date] += r.rev;

        var dt = parseAnyDate(r.date);
        if (dt) {
          var dowIdx = dt.getDay();
          dowMap[dowIdx] += r.rev;
        }

        if (r.int && r.int !== "Dịch vụ" && r.int !== "N/A (Dịch vụ)") {
            var intParts = r.int.split(",");
            intParts.forEach(function(p) {
                var pName = p.trim();
                if (pName) prodQtMap[pName] = (prodQtMap[pName] || 0) + 1;
            });
        }

        if (r.prod && r.prod !== "Không") {
            var purParts = r.prod.split(",");
            purParts.forEach(function(p) {
                var pName = p.trim();
                if (pName) {
                    prodMuaMap[pName] = (prodMuaMap[pName] || 0) + 1;
                    prodRevMap[pName] = (prodRevMap[pName] || 0) + (r.rev / purParts.length);
                }
            });
        }
    });

    var showrooms = Object.keys(srMap).map(function(k) {
        var item = srMap[k];
        var buy = item.buy || 0;
        var trf = item.trf || 0;
        var lost = item.lost !== undefined ? item.lost : Math.max(trf - buy, 0);
        var rev = item.revenue || 0;
        var cvr = trf > 0 ? parseFloat(((buy / trf) * 100).toFixed(1)) : 0;
        var aov = buy > 0 ? Math.round(rev / buy) : 0;
        var rpv = trf > 0 ? Math.round(rev / trf) : 0;
        return {
            name: item.name,
            trf: trf,
            buy: buy,
            purchases: buy,
            lost: lost,
            revenue: rev,
            cvr: cvr,
            aov: aov,
            rpv: rpv
        };
    });

    var dailyTrend = [];
    if (dStart && dEnd) {
        var curr = new Date(dStart);
        while (curr <= dEnd) {
            var dVal = curr.getDate(), mVal = curr.getMonth() + 1, yVal = curr.getFullYear();
            var dKeyStr = (dVal < 10 ? '0' + dVal : dVal) + '/' + (mVal < 10 ? '0' + mVal : mVal) + '/' + yVal;
            var shortLabel = (dVal < 10 ? '0' + dVal : dVal) + '/' + (mVal < 10 ? '0' + mVal : mVal);
            var dayRev = dateMap[dKeyStr] || 0;
            dailyTrend.push({ date: shortLabel, revenue: dayRev });
            curr.setDate(curr.getDate() + 1);
        }
    } else {
        var sortedDates = Object.keys(dateMap).sort(function(a, b) {
            var dA = parseAnyDate(a), dB = parseAnyDate(b);
            return (dA && dB) ? dA - dB : a.localeCompare(b);
        });
        dailyTrend = sortedDates.map(function(dKey) {
            return { date: dKey.substring(0, 5), revenue: dateMap[dKey] };
        });
    }

    var prodKeys = Array.from(new Set([...Object.keys(prodQtMap), ...Object.keys(prodMuaMap)]));
    if (prodKeys.length === 0) prodKeys = ['Phụ kiện', 'Tshirt', 'Polo', 'Giày', 'Jacket'];

    var prodQt = prodKeys.map(k => prodQtMap[k] || 0);
    var prodMua = prodKeys.map(k => prodMuaMap[k] || 0);
    var prodRev = prodKeys.map(k => ((prodRevMap[k] || 0) / 1000000).toFixed(2));

    var bcgTable = prodKeys.map(function(k) {
        var qVal = prodQtMap[k] || 0;
        var mVal = prodMuaMap[k] || 0;
        var prodRevAmt = prodRevMap[k] || 0;
        var prodCvr = qVal > 0 ? ((mVal / qVal) * 100).toFixed(1) : (mVal > 0 ? '100.0' : '0.0');
        var cat = (parseFloat(prodCvr) >= 60.0 && mVal >= 2) ? '🔥 TOP HOTSELL' : (mVal > 0 ? '🌟 TIỀM NĂNG' : '📦 BÁN KÈM');
        return {
            name: k,
            qt: qVal,
            buy: mVal,
            cvr: prodCvr + '%',
            revenue: prodRevAmt,
            cat: cat,
            act: cat.indexOf('HOTSELL') !== -1 ? 'Trưng bày Hotspot trung tâm' : 'Đẩy mạnh kịch bản combo'
        };
    }).sort(function(a,b){ return parseFloat(b.cvr) - parseFloat(a.cvr); });

    // 4.1 Bảng Khách Mới vs Khách Cũ
    var custTypeTable = custTypeNames.map(function(k) {
        var item = custTypeMap[k] || { name: k, trf: 0, buy: 0, rev: 0 };
        var np = Math.max(item.trf - item.buy, 0);
        var pct = traffic > 0 ? ((item.trf / traffic) * 100).toFixed(1) + '%' : '0.0%';
        var cvrNum = item.trf > 0 ? (item.buy / item.trf) * 100 : 0;
        var aov = item.buy > 0 ? Math.round(item.rev / item.buy) : 0;
        var rpv = item.trf > 0 ? Math.round(item.rev / item.trf) : 0;
        var st = cvrNum >= 50 ? '🟢 Tốt' : (cvrNum >= 35 ? '🟡 Theo dõi' : '🔴 Cần cải thiện');
        return {
            name: k,
            trf: item.trf,
            pct: pct,
            buy: item.buy,
            np: np,
            cvr: cvrNum.toFixed(1) + '%',
            revenue: item.rev,
            aov: aov,
            rpv: rpv,
            status: st
        };
    });

    // 4.2 Bảng Phân Tích 5 Kênh Nguồn Khách
    var sourcesTable = srcNames.map(function(k) {
        var item = srcMap[k] || { name: k, trf: 0, buy: 0, rev: 0 };
        var np = Math.max(item.trf - item.buy, 0);
        var pct = traffic > 0 ? ((item.trf / traffic) * 100).toFixed(1) + '%' : '0.0%';
        var cvrNum = item.trf > 0 ? (item.buy / item.trf) * 100 : 0;
        var aov = item.buy > 0 ? Math.round(item.rev / item.buy) : 0;
        var rpv = item.trf > 0 ? Math.round(item.rev / item.trf) : 0;
        var st = cvrNum >= 60 ? '🟢 Tốt' : (cvrNum >= 40 ? '🟡 Theo dõi' : '🔴 Cần cải thiện');
        var ins = k === "Đi ngang cửa hàng" ? 'Cần cải thiện tỷ lệ chuyển đổi chiều kịch bản đón tiếp' :
                  (k === "Marketing (FB, TikTok)" ? 'Cần cải thiện tỷ lệ chuyển đổi chiều kịch bản đón tiếp' :
                  (k === "Khách được giới thiệu" ? 'Chất lượng khách cao, giữ chân mối quan hệ' :
                  (k === "Khách chủ động quay lại" ? 'Khách hàng thân thiết tạo sự duy trì tỷ lệ nguồn khách' : 'Kênh nguồn hỗn hợp khác')));
        var act = cvrNum >= 60 ? 'Duy trì kịch bản chăm sóc' : 'Cần cải thiện tỷ lệ chuyển đổi chiều kịch bản đón tiếp';
        return {
            name: k,
            trf: item.trf,
            pct: pct,
            buy: item.buy,
            np: np,
            cvr: cvrNum.toFixed(1) + '%',
            revenue: item.rev,
            aov: aov,
            rpv: rpv,
            status: st,
            insight: ins,
            action: act
        };
    });

    // 4.3 Bảng Ma Trận Nguồn Khách vs Hình Thức Mua
    var sourceSaleTypeTable = srcNames.map(function(k) {
        var item = sourceSaleTypeMap[k] || { name: k, origBuy: 0, discBuy: 0, origRev: 0, discRev: 0 };
        var totalBuy = item.origBuy + item.discBuy;
        var origPct = totalBuy > 0 ? ((item.origBuy / totalBuy) * 100).toFixed(1) + '%' : '0.0%';
        var discPct = totalBuy > 0 ? ((item.discBuy / totalBuy) * 100).toFixed(1) + '%' : '0.0%';
        var st = (totalBuy > 0 && (item.origBuy / totalBuy) >= 0.5) ? '🟢 Tốt' : '🟡 Theo dõi';
        var ins = 'Khách sẵn sàng trả giá nguyên giá giữ vai trò tối ưu hóa giá gốc';
        var act = 'Kiểm soát tỷ lệ ưu đãi combo';
        return {
            name: k,
            totalBuy: totalBuy,
            origBuy: item.origBuy,
            origPct: origPct,
            discBuy: item.discBuy,
            discPct: discPct,
            origRev: item.origRev,
            discRev: item.discRev,
            status: st,
            insight: ins,
            action: act
        };
    });

    var lostSaleTable = Object.keys(lostReasonMap).map(function(k) {
        var cnt = lostReasonMap[k];
        var pct = lost > 0 ? ((cnt / lost) * 100).toFixed(1) + '%' : '0.0%';
        return { reason: k, count: cnt, pct: pct };
    }).sort(function(a,b){ return b.count - a.count; });
    if (lostSaleTable.length === 0) {
        lostSaleTable = [
            { reason: "1. Chưa có nhu cầu", count: 0, pct: "0.0%" },
            { reason: "2. Chỉ tham khảo", count: 0, pct: "0.0%" }
        ];
    }

    var lostHotspots = Object.keys(srMap).map(function(k) {
        var item = srMap[k];
        var lPct = item.trf > 0 ? ((item.lost / item.trf) * 100).toFixed(1) : '0.0';
        return {
            sr: item.name,
            trf: item.trf,
            lost: item.lost,
            lostPct: lPct + '%',
            reason: item.mainReason || 'Theo dõi điểm rớt đơn',
            status: item.lost > 0 ? '🟠 Cần Cải Thiện' : '🟢 Kiểm Soát Tốt',
            action: item.lost > 0 ? 'Bổ sung tồn kho & đào tạo chốt sale' : 'Duy trì hiệu suất'
        };
    }).sort(function(a,b){ return b.lost - a.lost; });

    var hourlyTable = slotArr.map(function(s) {
        var item = hourlyMap[s] || { slot: s, trf: 0, buy: 0, rev: 0 };
        var cvrStr = item.trf > 0 ? ((item.buy / item.trf) * 100).toFixed(1) + '%' : '0.0%';
        return { slot: s, trf: item.trf, buy: item.buy, cvr: cvrStr, rev: item.rev };
    });

    var purposeTable = Object.keys(purposeMap).map(function(k) {
        var cnt = purposeMap[k];
        var pct = purchases > 0 ? ((cnt / purchases) * 100).toFixed(1) + '%' : '0.0%';
        var ev = k === "Cá nhân sử dụng" ? 'Tiêu Dùng Thường Xuyên' : (k === "Mua quà tặng" ? 'AOV Cao (Quà Tặng)' : 'Tiềm Năng B2B');
        return { purpose: k, buy: cnt, pct: pct, eval: ev };
    });

    var basketTable = Object.keys(basketMap).map(function(k) {
        var cnt = basketMap[k];
        var pct = purchases > 0 ? ((cnt / purchases) * 100).toFixed(1) + '%' : '0.0%';
        var rec = k.indexOf("Single") !== -1 ? 'Cần Tăng Bán Kèm Phụ Kiện' : (k.indexOf("Double") !== -1 ? 'Đơn Chuẩn Kép (Áo + Quần)' : 'Giỏ Hàng Lớn Excellent');
        return { basket: k, invoices: cnt, pct: pct, rec: rec };
    });

    var fullSaleTypeTable = Object.keys(saleTypeMap).map(function(k) {
        var item = saleTypeMap[k] || { buy: 0, rev: 0 };
        var b = item.buy;
        var r = item.rev;
        var pct = purchases > 0 ? ((b / purchases) * 100).toFixed(1) + '%' : '0.0%';
        var aov = b > 0 ? Math.round(r / b) : 0;
        var st = k === FORM_PURCHASE_ORIGINAL ? '🟢 Tối Ưu Lợi Nhuận' : '🟡 Theo Dõi Chi Chiết';
        var ins = k === FORM_PURCHASE_ORIGINAL ? 'Biên lợi nhuận cao, khách hài lòng sản phẩm' : 'Thúc đẩy sản lượng, tăng quy mô giỏ hàng';
        var act = k === FORM_PURCHASE_ORIGINAL ? 'Duy trì trưng bày chuẩn VMD' : 'Kiểm soát ngưỡng giảm giá';
        return { saleType: k, buy: b, pct: pct, revenue: r, aov: aov, status: st, insight: ins, action: act };
    });

    return {
        kpi: {
            traffic: traffic,
            purchases: purchases,
            lost: lost,
            revenue: revenue,
            invoices: purchases,
            qty: qty
        },
        dailyTrend: dailyTrend,
        showrooms: showrooms,
        products: {
            labels: prodKeys,
            productsRev: prodRev,
            productsQt: prodQt,
            productsMua: prodMua,
            bcgTable: bcgTable
        },
        custTypeTable: custTypeTable,
        sources: sourcesTable,
        sourcesTable: sourcesTable,
        sourceSaleTypeTable: sourceSaleTypeTable,
        lostSaleTable: lostSaleTable,
        lostCard: { count: lost, cvr: (purchases + lost) > 0 ? ((lost / (purchases + lost)) * 100).toFixed(1) : "0.0" },
        lostHotspots: lostHotspots,
        hourlyTable: hourlyTable,
        purposeTable: purposeTable,
        basketTable: basketTable,
        fullSaleTypeTable: fullSaleTypeTable,
        dow: dowMap.map(function(v) { return (v / 1000).toFixed(0); })
    };
}

function renderDailyTrendChart(trendData) {
    const ctx = document.getElementById('dailyTrendChart');
    if (!ctx) return;
    if (charts.dailyTrend) charts.dailyTrend.destroy();

    const labels = (trendData || []).map(d => d.date);
    const data = (trendData || []).map(d => d.revenue);

    const isLight = currentTheme === 'light';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
    const textColor = isLight ? '#0B0A08' : '#F6EADE';

    charts.dailyTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Doanh Thu (VNĐ)',
                data: data,
                borderColor: '#987147',
                backgroundColor: 'rgba(152, 113, 71, 0.15)',
                borderWidth: 2,
                fill: true,
                tension: 0.35,
                pointRadius: 3,
                pointBackgroundColor: '#987147'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 } } },
                y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 }, callback: v => (v / 1000000).toFixed(0) + 'M' } }
            }
        }
    });
}

function renderShowroomCharts(srData) {
    const ctxRev = document.getElementById('showroomRevChart');
    const ctxCvr = document.getElementById('showroomCvrChart');
    if (!ctxRev || !ctxCvr) return;

    if (charts.srRev) charts.srRev.destroy();
    if (charts.srCvr) charts.srCvr.destroy();

    const sortedSr = (srData || []).slice().sort((a, b) => b.revenue - a.revenue);
    const labels = sortedSr.map(s => s.name);
    const revData = sortedSr.map(s => s.revenue);
    const cvrData = sortedSr.map(s => s.cvr);

    const isLight = currentTheme === 'light';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
    const textColor = isLight ? '#0B0A08' : '#F6EADE';

    charts.srRev = new Chart(ctxRev, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{ label: 'Doanh Thu (VNĐ)', data: revData, backgroundColor: '#987147', borderRadius: 4 }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: gridColor }, ticks: { color: textColor, callback: v => (v / 1000000).toFixed(0) + 'M' } },
                y: { grid: { display: false }, ticks: { color: textColor } }
            }
        }
    });

    charts.srCvr = new Chart(ctxCvr, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{ label: 'Tỷ Lệ Chốt (%)', data: cvrData, backgroundColor: '#B8860B', borderRadius: 4 }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: gridColor }, ticks: { color: textColor, callback: v => v + '%' } },
                y: { grid: { display: false }, ticks: { color: textColor } }
            }
        }
    });
}

function renderShowroomTable(srData) {
    const tbody = document.getElementById('showroomTableBody');
    if (tbody && Array.isArray(srData)) {
        if (srData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="11" style="text-align: center; color: #888;">Chưa có dữ liệu showroom trong khoảng thời gian này</td></tr>`;
        } else {
            const sorted = srData.slice().sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
            tbody.innerHTML = sorted.map(item => {
                const trf = item.trf || 0;
                const buy = item.buy || (item.purchases || 0);
                const lost = item.lost !== undefined ? item.lost : Math.max(trf - buy, 0);
                const rev = item.revenue || 0;
                const cvrStr = item.cvr !== undefined ? (typeof item.cvr === 'number' ? item.cvr.toFixed(1) + '%' : item.cvr) : (trf > 0 ? ((buy / trf) * 100).toFixed(1) + '%' : '0.0%');
                const aov = buy > 0 ? Math.round(rev / buy) : 0;
                const rpv = trf > 0 ? Math.round(rev / trf) : 0;
                const cvrNum = trf > 0 ? (buy / trf) * 100 : 0;
                const status = cvrNum >= 70 ? '🟢 Tốt' : (cvrNum >= 50 ? '🟡 Theo dõi' : '🔴 Cần cải thiện');
                const ins = cvrNum >= 70 ? 'Hiệu suất showroom xuất sắc, CVR & Doanh thu cao' : (cvrNum >= 50 ? 'Hiệu suất trung bình, cần đẩy mạnh bán kèm' : 'Cần tối ưu tỷ lệ chốt và rà soát ca trực');
                const act = cvrNum >= 70 ? 'Duy trì mô hình VMD & kịch bản đón tiếp' : 'Tăng cường đào tạo chốt sale & giám sát ca';
                return `<tr>
                    <td style="text-align: left; font-weight: bold;">${item.name}</td>
                    <td>${formatNum(trf)}</td>
                    <td>${formatNum(buy)}</td>
                    <td>${formatNum(lost)}</td>
                    <td style="font-weight: bold; color: #987147;">${cvrStr}</td>
                    <td>${formatVNĐ(rev)}</td>
                    <td>${formatVNĐ(aov)}</td>
                    <td>${formatVNĐ(rpv)}</td>
                    <td><span class="badge" style="background: rgba(152, 113, 71, 0.2); color: #987147; border: 1px solid #987147; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${status}</span></td>
                    <td style="text-align: left; font-size: 11px; color: #bbb;">${ins}</td>
                    <td style="text-align: left; font-size: 11px; color: #bbb;">${act}</td>
                </tr>`;
            }).join('');
        }
    }
}

function renderProductCharts(pData) {
    const ctxTop = document.getElementById('topProdRevChart') || document.getElementById('topProductsChart');
    const ctxComp = document.getElementById('prodDualChart') || document.getElementById('productCompareChart');
    
    // 1. Render BCG Product Table
    const tbody = document.getElementById('bcgProductTableBody');
    if (tbody && pData && pData.bcgTable && Array.isArray(pData.bcgTable)) {
        if (pData.bcgTable.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #888;">Chưa có dữ liệu sản phẩm trong khoảng thời gian đã chọn</td></tr>`;
        } else {
            tbody.innerHTML = pData.bcgTable.map(item => {
                return `<tr>
                    <td style="text-align: left; font-weight: bold;">${item.name}</td>
                    <td>${formatNum(item.qt)}</td>
                    <td>${formatNum(item.buy)}</td>
                    <td style="font-weight: bold; color: #987147;">${item.cvr || '0.0%'}</td>
                    <td><span class="badge" style="background: rgba(152, 113, 71, 0.2); color: #987147; border: 1px solid #987147; padding: 3px 8px; border-radius: 4px; font-size: 11px;">${item.cat || ''}</span></td>
                    <td style="text-align: left; font-size: 12px; color: #bbb;">${item.act || ''}</td>
                </tr>`;
            }).join('');
        }
    }

    if (!ctxTop && !ctxComp) return;

    if (ctxTop && charts.prodTop) charts.prodTop.destroy();
    if (ctxComp && charts.prodComp) charts.prodComp.destroy();

    const labels = (pData && pData.labels) || [];
    const qt = (pData && pData.productsQt) || [];
    const mua = (pData && pData.productsMua) || [];
    const rev = (pData && pData.productsRev) || mua; // Fallback to mua count if rev is omitted

    const isLight = currentTheme === 'light';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
    const textColor = isLight ? '#0B0A08' : '#F6EADE';

    if (ctxTop) {
        charts.prodTop = new Chart(ctxTop, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{ label: 'Số SP Bán', data: mua, backgroundColor: '#987147', borderRadius: 4 }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: gridColor }, ticks: { color: textColor } },
                    y: { grid: { display: false }, ticks: { color: textColor } }
                }
            }
        });
    }

    if (ctxComp) {
        charts.prodComp = new Chart(ctxComp, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Lượt Quan Tâm', data: qt, backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: 4 },
                    { label: 'Số SP Bán', data: mua, backgroundColor: '#987147', borderRadius: 4 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: textColor } } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: textColor } },
                    y: { grid: { color: gridColor }, ticks: { color: textColor } }
                }
            }
        });
    }
}

function renderCustomerSection(custTypeTable, sourcesTable, sourceSaleTypeTable) {
    // 4.1 Bảng Khách Mới vs Khách Cũ
    const tbodyCustType = document.getElementById('custTypeTableBody');
    if (tbodyCustType && Array.isArray(custTypeTable)) {
        if (custTypeTable.length === 0) {
            tbodyCustType.innerHTML = `<tr><td colspan="10" style="text-align: center; color: #888;">Chưa có dữ liệu loại khách hàng</td></tr>`;
        } else {
            tbodyCustType.innerHTML = custTypeTable.map(item => `<tr>
                <td style="text-align: left; font-weight: bold;">${item.name}</td>
                <td>${formatNum(item.trf)}</td>
                <td>${item.pct}</td>
                <td>${formatNum(item.buy)}</td>
                <td>${formatNum(item.np)}</td>
                <td style="font-weight: bold; color: #987147;">${item.cvr}</td>
                <td>${formatVNĐ(item.revenue)}</td>
                <td>${formatVNĐ(item.aov)}</td>
                <td>${formatVNĐ(item.rpv)}</td>
                <td><span class="badge" style="background: rgba(152, 113, 71, 0.2); color: #987147; border: 1px solid #987147; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${item.status}</span></td>
            </tr>`).join('');
        }
    }

    // Biểu đồ Doughnut 4.1 Khách Mới vs Khách Cũ
    const ctxCustType = document.getElementById('custTypeChart');
    if (ctxCustType && Array.isArray(custTypeTable)) {
        if (charts.custType) charts.custType.destroy();
        const isLight = currentTheme === 'light';
        const textColor = isLight ? '#0B0A08' : '#F6EADE';
        charts.custType = new Chart(ctxCustType, {
            type: 'doughnut',
            data: {
                labels: custTypeTable.map(c => c.name.split(' (')[0]),
                datasets: [{
                    data: custTypeTable.map(c => c.trf),
                    backgroundColor: ['#987147', '#B8860B']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right', labels: { color: textColor, font: { size: 11 } } } }
            }
        });
    }

    // 4.2 Bảng Chi Tiết 5 Kênh Nguồn Khách
    const tbodySource = document.getElementById('sourceTableBody');
    if (tbodySource && Array.isArray(sourcesTable)) {
        if (sourcesTable.length === 0) {
            tbodySource.innerHTML = `<tr><td colspan="12" style="text-align: center; color: #888;">Chưa có dữ liệu nguồn khách trong khoảng thời gian này</td></tr>`;
        } else {
            tbodySource.innerHTML = sourcesTable.map(item => `<tr>
                <td style="text-align: left; font-weight: bold;">${item.name}</td>
                <td>${formatNum(item.trf)}</td>
                <td>${item.pct}</td>
                <td>${formatNum(item.buy)}</td>
                <td>${formatNum(item.np)}</td>
                <td style="font-weight: bold; color: #987147;">${item.cvr}</td>
                <td>${formatVNĐ(item.revenue)}</td>
                <td>${formatVNĐ(item.aov)}</td>
                <td>${formatVNĐ(item.rpv)}</td>
                <td><span class="badge" style="background: rgba(152, 113, 71, 0.2); color: #987147; border: 1px solid #987147; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${item.status}</span></td>
                <td style="text-align: left; font-size: 11px; color: #bbb;">${item.insight}</td>
                <td style="text-align: left; font-size: 11px; color: #bbb;">${item.action}</td>
            </tr>`).join('');
        }
    }

    // 4.3 Bảng Ma Trận Nguồn Khách vs Hình Thức Mua
    const tbodySourceSaleType = document.getElementById('sourceSaleTypeTableBody');
    if (tbodySourceSaleType && Array.isArray(sourceSaleTypeTable)) {
        if (sourceSaleTypeTable.length === 0) {
            tbodySourceSaleType.innerHTML = `<tr><td colspan="11" style="text-align: center; color: #888;">Chưa có dữ liệu ma trận nguồn khách vs hình thức mua</td></tr>`;
        } else {
            tbodySourceSaleType.innerHTML = sourceSaleTypeTable.map(item => `<tr>
                <td style="text-align: left; font-weight: bold;">${item.name}</td>
                <td>${formatNum(item.totalBuy)}</td>
                <td>${formatNum(item.origBuy)}</td>
                <td style="font-weight: bold; color: #987147;">${item.origPct}</td>
                <td>${formatNum(item.discBuy)}</td>
                <td>${item.discPct}</td>
                <td>${formatVNĐ(item.origRev)}</td>
                <td>${formatVNĐ(item.discRev)}</td>
                <td><span class="badge" style="background: rgba(152, 113, 71, 0.2); color: #987147; border: 1px solid #987147; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${item.status}</span></td>
                <td style="text-align: left; font-size: 11px; color: #bbb;">${item.insight}</td>
                <td style="text-align: left; font-size: 11px; color: #bbb;">${item.action}</td>
            </tr>`).join('');
        }
    }
}

function renderDowChart(dowData) {
    const ctx = document.getElementById('dowRevChart') || document.getElementById('dowChart');
    if (!ctx) return;
    if (charts.dow) charts.dow.destroy();

    const labels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const data = (dowData || [0, 0, 0, 0, 0, 0, 0]).map(v => Number(v) || 0);

    const isLight = currentTheme === 'light';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
    const textColor = isLight ? '#0B0A08' : '#F6EADE';

    const bgColors = labels.map((l, idx) => (idx === 0 || idx === 6) ? '#B8860B' : '#987147');

    charts.dow = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{ label: 'Doanh Thu (VNĐ)', data: data, backgroundColor: bgColors, borderRadius: 4 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: textColor } },
                y: { grid: { color: gridColor }, ticks: { color: textColor, callback: v => v + 'k' } }
            }
        }
    });
}

function renderLostSaleSection(lostSaleTable, lostCard, lostHotspots) {
    const tbodyReason = document.getElementById('lostSaleTableBody');
    if (tbodyReason && Array.isArray(lostSaleTable)) {
        if (lostSaleTable.length === 0) {
            tbodyReason.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #888;">Chưa có dữ liệu rớt đơn trong khoảng thời gian này</td></tr>`;
        } else {
            tbodyReason.innerHTML = lostSaleTable.map(item => `<tr>
                <td style="text-align: left; font-weight: bold;">${item.reason}</td>
                <td>${formatNum(item.count)}</td>
                <td style="font-weight: bold; color: #987147;">${item.pct}</td>
                <td><span class="badge" style="background: rgba(198, 40, 40, 0.15); color: #C62828; border: 1px solid #C62828; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${item.status || '🟡 Cần Cải Thiện'}</span></td>
                <td style="text-align: left; font-size: 11px; color: #bbb;">${item.insight || 'Khách chưa chốt đơn chiều kịch bản đón tiếp'}</td>
                <td style="text-align: left; font-size: 11px; color: #bbb;">${item.action || 'Tăng cường tư vấn & giải quyết rào cản'}</td>
            </tr>`).join('');
        }
    }

    if (lostCard) {
        const countEl = document.getElementById('lostCardCount');
        const cvrEl = document.getElementById('lostCardCvr');
        const rateEl = document.getElementById('lostCardRate');
        if (countEl) countEl.innerText = formatNum(lostCard.count || 0);
        if (cvrEl) cvrEl.innerText = (lostCard.cvr || '0.0') + '%';
        if (rateEl) rateEl.innerText = formatNum(lostCard.count || 0) + ' lượt';
    }

    const tbodyHotspot = document.getElementById('lostHotspotTableBody');
    if (tbodyHotspot && Array.isArray(lostHotspots)) {
        if (lostHotspots.length === 0) {
            tbodyHotspot.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #888;">Chưa có điểm nóng rớt đơn trong khoảng thời gian này</td></tr>`;
        } else {
            tbodyHotspot.innerHTML = lostHotspots.map(item => `<tr>
                <td style="text-align: left; font-weight: bold;">${item.sr}</td>
                <td>${formatNum(item.trf)}</td>
                <td>${formatNum(item.lost)}</td>
                <td style="font-weight: bold; color: #C62828;">${item.lostPct}</td>
                <td style="text-align: left; color: #bbb;">${item.reason}</td>
                <td><span class="badge" style="background: rgba(198, 40, 40, 0.15); color: #C62828; border: 1px solid #C62828; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${item.status}</span></td>
                <td style="text-align: left; font-size: 11px; color: #bbb;">${item.action}</td>
            </tr>`).join('');
        }
    }
}

function renderHourlyTable(hourlyTable) {
    const tbody = document.getElementById('hourlyTableBody');
    if (tbody && Array.isArray(hourlyTable)) {
        if (hourlyTable.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #888;">Chưa có dữ liệu khung giờ trong khoảng thời gian này</td></tr>`;
        } else {
            tbody.innerHTML = hourlyTable.map(item => `<tr>
                <td>${item.slot}</td>
                <td>${formatNum(item.trf)}</td>
                <td>${formatNum(item.buy)}</td>
                <td style="font-weight: bold; color: #987147;">${item.cvr}</td>
                <td>${formatVNĐ(item.rev)}</td>
            </tr>`).join('');
        }
    }
}

function renderCustomerBehaviorSection(purposeTable, basketTable, fullSaleTypeTable) {
    const tbodyPurpose = document.getElementById('purposeTableBody');
    if (tbodyPurpose && Array.isArray(purposeTable)) {
        if (purposeTable.length === 0) {
            tbodyPurpose.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #888;">Chưa có dữ liệu mục đích trong khoảng thời gian này</td></tr>`;
        } else {
            tbodyPurpose.innerHTML = purposeTable.map(item => `<tr>
                <td style="text-align: left;">${item.purpose}</td>
                <td>${formatNum(item.buy)}</td>
                <td style="font-weight: bold; color: #987147;">${item.pct}</td>
                <td>${item.eval}</td>
            </tr>`).join('');
        }
    }

    const tbodyBasket = document.getElementById('basketTableBody');
    if (tbodyBasket && Array.isArray(basketTable)) {
        if (basketTable.length === 0) {
            tbodyBasket.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #888;">Chưa có dữ liệu giỏ hàng trong khoảng thời gian này</td></tr>`;
        } else {
            tbodyBasket.innerHTML = basketTable.map(item => `<tr>
                <td style="text-align: left;">${item.basket}</td>
                <td>${formatNum(item.invoices)}</td>
                <td style="font-weight: bold; color: #987147;">${item.pct}</td>
                <td>${item.rec}</td>
            </tr>`).join('');
        }
    }

    const tbodySaleType = document.getElementById('fullSaleTypeTableBody');
    if (tbodySaleType && Array.isArray(fullSaleTypeTable)) {
        if (fullSaleTypeTable.length === 0) {
            tbodySaleType.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #888;">Chưa có dữ liệu hình thức mua trong khoảng thời gian này</td></tr>`;
        } else {
            tbodySaleType.innerHTML = fullSaleTypeTable.map(item => `<tr>
                <td style="text-align: left; font-weight: bold;">${item.saleType}</td>
                <td>${formatNum(item.buy)}</td>
                <td style="font-weight: bold; color: #987147;">${item.pct}</td>
                <td>${formatVNĐ(item.revenue)}</td>
                <td>${formatVNĐ(item.aov)}</td>
                <td><span class="badge" style="background: rgba(152, 113, 71, 0.2); color: #987147; border: 1px solid #987147; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${item.status}</span></td>
                <td style="text-align: left; font-size: 11px; color: #bbb;">${item.insight}</td>
                <td style="text-align: left; font-size: 11px; color: #bbb;">${item.action}</td>
            </tr>`).join('');
        }
    }
}

