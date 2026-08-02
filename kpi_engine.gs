/**
 * SHINKO RETAIL ANALYTICS V3 - KPI ENGINE & ANALYSIS TABLES (TỆP 2 / 2)
 * Tệp này chứa: syncKPIEngine() đồng bộ 10+ Bảng Phân Tích Chuyên Sâu lên cả 
 * 03_Bảng_Tính_KPI và 04_Báo_Cáo_Tổng_Quan cho Ban Giám Đốc.
 */

function parseDateVal(val) {
  if (!val) return null;
  if (val instanceof Date) return val;
  var str = val.toString().trim();
  if (!str) return null;
  if (str.indexOf('/') !== -1) {
    var parts = str.split(' ')[0].split('/');
    if (parts.length === 3) {
      var d = parseInt(parts[0], 10);
      var m = parseInt(parts[1], 10);
      var y = parseInt(parts[2], 10);
      if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
        return new Date(y, m - 1, d);
      }
    }
  }
  var dt = new Date(str);
  return isNaN(dt.getTime()) ? null : dt;
}

function syncKPIEngine(ss) {
  if (!ss) ss = SpreadsheetApp.getActiveSpreadsheet();
  var s02 = ss.getSheetByName("02_Kho_Xử_Lý_Dữ_Liệu") || ss.getSheetByName("02_Data_Processing");
  var s03 = ss.getSheetByName("03_Bảng_Tính_KPI") || ss.getSheetByName("03_KPI_Engine");
  var s04 = ss.getSheetByName("04_Báo_Cáo_Tổng_Quan") || ss.getSheetByName("04_Dashboard");
  if (!s02 || !s03) return;

  var selSr = s03.getRange("F2").getValue().toString().trim();
  var valB2 = s03.getRange("B2").getValue();
  var valD2 = s03.getRange("D2").getValue();

  var liveUrl = typeof getLiveDashboardUrl === 'function' ? getLiveDashboardUrl() : "https://script.google.com/macros/s/AKfycbwCkyNmVCv9iAEo9auJtXYVLHFf4EtpdJKypEg5bZm5LXDCWDxu-RhBWzAX1VBvHGck/exec";

  // ĐỒNG BỘ NGUYÊN VẸN BỘ LỌC SANG 04_BÁO_CÁO_TỔNG_QUAN VÀ CHÈN LINK ĐẦU SHEETS
  if (s04) {
    s04.getRange("B2").setValue(valB2);
    s04.getRange("D2").setValue(valD2);
    s04.getRange("F2").setValue(selSr);
    s04.getRange("G2:L2").merge()
       .setValue("🔗 DASHBOARD ONLINE TRÊN DI ĐỘNG: " + liveUrl)
       .setFontWeight("bold").setBackground("#F6EADE").setFontColor("#987147");
  }

  var startDt = parseDateVal(valB2);
  var endDt = parseDateVal(valD2);

  if (startDt) startDt.setHours(0, 0, 0, 0);
  if (endDt) endDt.setHours(23, 59, 59, 999);

  var rawData = s02.getRange(2, 1, Math.max(s02.getLastRow() - 1, 1), 72).getValues();

  var filtered = rawData.filter(function(r) {
    if (!r[0]) return false;

    if (selSr && selSr !== "Toàn Hệ Thống") {
      var sr = r[21] ? r[21].toString().trim() : "";
      if (sr.indexOf(selSr) === -1 && selSr.indexOf(sr) === -1) return false;
    }

    if (startDt || endDt) {
      var rowDt = parseDateVal(r[0]);
      if (!rowDt && r[16]) rowDt = parseDateVal(r[16]);
      if (rowDt) {
        if (startDt && rowDt < startDt) return false;
        if (endDt && rowDt > endDt) return false;
      }
    }

    return true;
  });

  // 1. Core KPIs
  var trf = filtered.length;
  var buy = 0;
  var lost = 0;
  var rev = 0;
  var qty = 0;

  filtered.forEach(function(r) {
    if (r[25] === 1) buy++;
    if (r[26] === 1) lost++;
    rev += (Number(r[14]) || 0);
    if (r[25] === 1) qty += (Number(r[29]) || 0);
  });

  var summaryRow = [[
    trf, buy, lost, trf > 0 ? buy / trf : 0, rev, buy,
    buy > 0 ? rev / buy : 0, buy > 0 ? qty / buy : 0,
    trf > 0 ? rev / trf : 0, buy > 0 ? rev / buy : 0, "OK"
  ]];

  s03.getRange("A6:K6").setValues(summaryRow)
     .setFontWeight("bold").setFontSize(12).setHorizontalAlignment("center").setBackground("#F6EADE");

  s03.getRange("A6:C6").setNumberFormat("#,##0");
  s03.getRange("D6").setNumberFormat("0.0%");
  s03.getRange("E6:G6").setNumberFormat("#,##0");
  s03.getRange("H6").setNumberFormat("0.00");
  s03.getRange("I6:J6").setNumberFormat("#,##0");

  if (s04) {
    s04.getRange("A4:K4").merge().setValue("1. EXECUTIVE SUMMARY — 10 CHỈ SỐ KINH DOANH CỐT LÕI")
       .setFontWeight("bold").setBackground("#987147").setFontColor("#FFFFFF");
    s04.getRange("A5:K5").setValues([[
      "LƯỢT KHÁCH", "KHÁCH MUA", "KHÁCH CHƯA MUA", "TỶ LỆ CHỐT ĐƠN",
      "DOANH THU (VNĐ)", "SỐ HÓA ĐƠN", "GIÁ TRỊ HĐ TB", "SỐ SP / HÓA ĐƠN",
      "DOANH THU/LƯỢT KHÁCH", "DOANH THU/KHÁCH MUA", "TRẠNG THÁI"
    ]]).setFontWeight("bold").setBackground("#0B0A08").setFontColor("#FFFFFF").setHorizontalAlignment("center");

    s04.getRange("A6:K6").setValues(summaryRow)
       .setFontWeight("bold").setFontSize(12).setHorizontalAlignment("center").setBackground("#F6EADE");
    s04.getRange("A6:C6").setNumberFormat("#,##0");
    s04.getRange("D6").setNumberFormat("0.0%");
    s04.getRange("E6:G6").setNumberFormat("#,##0");
    s04.getRange("H6").setNumberFormat("0.00");
    s04.getRange("I6:J6").setNumberFormat("#,##0");
  }

  // 2. Showroom Scorecard
  var srList = ["Trần Duy Hưng", "Xã Đàn", "Bắc Ninh", "Thanh Hóa", "Ninh Bình"];
  var srRows = [];
  var tSrT = 0, tSrB = 0, tSrR = 0, tSrQ = 0;

  srList.forEach(function(srName, idx) {
    var srTrf = 0, srBuy = 0, srRev = 0, srQty = 0;
    filtered.forEach(function(r) {
      var srVal = r[21] ? r[21].toString().trim() : "";
      if (srVal.indexOf(srName) !== -1 || srName.indexOf(srVal) !== -1) {
        srTrf++;
        if (r[25] === 1) srBuy++;
        srRev += (Number(r[14]) || 0);
        if (r[25] === 1) srQty += (Number(r[29]) || 0);
      }
    });

    tSrT += srTrf; tSrB += srBuy; tSrR += srRev; tSrQ += srQty;

    var srCvr = srTrf > 0 ? srBuy / srTrf : 0;
    var srRevPct = rev > 0 ? srRev / rev : 0;
    var srQtyPct = qty > 0 ? srQty / qty : 0;
    var srAov = srBuy > 0 ? srRev / srBuy : 0;
    var srUpt = srBuy > 0 ? srQty / srBuy : 0;

    srRows.push([
      idx + 1, srName, srTrf, srBuy, srCvr, srRev, srRevPct, srQty, srQtyPct, srAov, srUpt
    ]);
  });

  var totSrCvr = tSrT > 0 ? tSrB / tSrT : 0;
  var totSrRevPct = rev > 0 ? tSrR / rev : 0;
  var totSrQtyPct = qty > 0 ? tSrQ / qty : 0;
  var totSrAov = tSrB > 0 ? tSrR / tSrB : 0;
  var totSrUpt = tSrB > 0 ? tSrQ / tSrB : 0;

  srRows.push([
    "-", "TỔNG CỘNG HỆ THỐNG", tSrT, tSrB, totSrCvr, tSrR, totSrRevPct, tSrQ, totSrQtyPct, totSrAov, totSrUpt
  ]);

  s03.getRange("A11:K16").setValues(srRows);
  s03.getRange("A11:K16").setHorizontalAlignment("center");
  s03.getRange("A16:K16").setFontWeight("bold").setBackground("#F6EADE");
  s03.getRange("C11:D16").setNumberFormat("#,##0");
  s03.getRange("E11:E16").setNumberFormat("0.0%");
  s03.getRange("F11:F16").setNumberFormat("#,##0");
  s03.getRange("G11:G16").setNumberFormat("0.0%");
  s03.getRange("H11:H16").setNumberFormat("#,##0");
  s03.getRange("I11:I16").setNumberFormat("0.0%");
  s03.getRange("J11:J16").setNumberFormat("#,##0");
  s03.getRange("K11:K16").setNumberFormat("0.00");

  if (s04) {
    s04.getRange("A9:K9").merge().setValue("2. SHOWROOM SCORECARD — HIỆU SUẤT SHOWROOM & TỶ TRỌNG SẢN PHẨM BÁN")
       .setFontWeight("bold").setBackground("#0B0A08").setFontColor("#FFFFFF");
    s04.getRange("A10:K10").setValues([[
      "STT", "Showroom", "Lượt Khách (TRF)", "Khách Mua (PUR)", "Tỷ Lệ Chốt (CVR)",
      "Doanh Thu (REV)", "Tỷ Trọng DT %", "Số SP Bán (QTY)", "Tỷ Trọng SP %",
      "Giá Trị HĐ TB (AOV)", "Số SP/HĐ (UPT)"
    ]]).setFontWeight("bold").setBackground("#987147").setFontColor("#FFFFFF").setHorizontalAlignment("center");

    s04.getRange("A11:K16").setValues(srRows);
    s04.getRange("A11:K16").setHorizontalAlignment("center");
    s04.getRange("A16:K16").setFontWeight("bold").setBackground("#F6EADE");
    s04.getRange("C11:D16").setNumberFormat("#,##0");
    s04.getRange("E11:E16").setNumberFormat("0.0%");
    s04.getRange("F11:F16").setNumberFormat("#,##0");
    s04.getRange("G11:G16").setNumberFormat("0.0%");
    s04.getRange("H11:H16").setNumberFormat("#,##0");
    s04.getRange("I11:I16").setNumberFormat("0.0%");
    s04.getRange("J11:J16").setNumberFormat("#,##0");
    s04.getRange("K11:K16").setNumberFormat("0.00");
  }

  // 3. Products Breakdown (13 Products)
  var pList = [
    "Giày", "Polo", "Tshirt", "Sơ mi", "Quần", "Jacket",
    "Blazer", "Áo len", "Áo da", "Dây lưng", "Ví/Bóp tay", "Cặp/Túi", "Phụ kiện khác"
  ];
  var pRows = [];
  var tPrdQt = 0, tPrdBuy = 0, tPrdRev = 0;

  pList.forEach(function(pName, idx) {
    var pQt = 0, pBuy = 0, pRev = 0;
    var colQtIdx = 44 + idx;
    var colMuaIdx = 57 + idx;

    filtered.forEach(function(r) {
      if (r[colQtIdx] === 1) pQt++;
      if (r[colMuaIdx] === 1) {
        pBuy++;
        var numProdInBill = Number(r[29]) || 1;
        var billAmt = Number(r[14]) || 0;
        pRev += (billAmt / numProdInBill);
      }
    });

    tPrdQt += pQt; tPrdBuy += pBuy; tPrdRev += pRev;

    var pCvr = pQt > 0 ? pBuy / pQt : 0;
    var pAov = pBuy > 0 ? pRev / pBuy : 0;
    var evalStr = pCvr >= 0.7 ? "Hiệu Quả Cao" : (pCvr >= 0.4 ? "Trung Bình" : "Cần Thúc Đẩy");
    var recStr = pCvr >= 0.7 ? "Tăng trưng bày" : "Đổi vị trí / Ưu đãi";

    pRows.push([
      idx + 1, pName, pQt, 0, pBuy, 0, pCvr, pRev, pAov, evalStr, recStr
    ]);
  });

  pRows.forEach(function(row) {
    row[3] = tPrdQt > 0 ? row[2] / tPrdQt : 0;
    row[5] = tPrdBuy > 0 ? row[4] / tPrdBuy : 0;
  });

  var totPCvr = tPrdQt > 0 ? tPrdBuy / tPrdQt : 0;
  var totPAov = tPrdBuy > 0 ? tPrdRev / tPrdBuy : 0;
  pRows.push([
    "-", "TỔNG CỘNG 13 SẢN PHẨM", tPrdQt, 1, tPrdBuy, 1, totPCvr, tPrdRev, totPAov, "-", "-"
  ]);

  s03.getRange("A20:K33").setValues(pRows);
  s03.getRange("A20:K33").setHorizontalAlignment("center");
  s03.getRange("A33:K33").setFontWeight("bold").setBackground("#F6EADE");
  s03.getRange("C20:C33").setNumberFormat("#,##0");
  s03.getRange("D20:D33").setNumberFormat("0.0%");
  s03.getRange("E20:E33").setNumberFormat("#,##0");
  s03.getRange("F20:G33").setNumberFormat("0.0%");
  s03.getRange("H20:I33").setNumberFormat("#,##0");

  if (s04) {
    s04.getRange("A18:K18").merge().setValue("3. PHÂN TÍCH SẢN PHẨM (13 SẢN PHẨM RIÊNG BIỆT)")
       .setFontWeight("bold").setBackground("#0B0A08").setFontColor("#FFFFFF");
    s04.getRange("A19:K19").setValues([[
      "STT", "Danh Mục Sản Phẩm", "Lượt Quan Tâm", "Tỷ Trọng QT %", "Lượt Mua",
      "Tỷ Trọng Mua %", "Tỷ Lệ Chốt CVR SP", "Doanh Thu SP", "Giá Trị Đơn TB",
      "Đánh Giá Hiệu Quả", "Khuyến Nghị Bán Hàng"
    ]]).setFontWeight("bold").setBackground("#987147").setFontColor("#FFFFFF").setHorizontalAlignment("center");

    s04.getRange("A20:K33").setValues(pRows);
    s04.getRange("A20:K33").setHorizontalAlignment("center");
    s04.getRange("A33:K33").setFontWeight("bold").setBackground("#F6EADE");
    s04.getRange("C20:C33").setNumberFormat("#,##0");
    s04.getRange("D20:D33").setNumberFormat("0.0%");
    s04.getRange("E20:E33").setNumberFormat("#,##0");
    s04.getRange("F20:G33").setNumberFormat("0.0%");
    s04.getRange("H20:I33").setNumberFormat("#,##0");
  }

  // 4. Lost Sales
  var lostList = [
    "Chưa có nhu cầu", "Hết size/màu", "Chưa phù hợp giá",
    "Chưa thích kiểu dáng", "Chỉ vào tham khảo", "Đang xem thương hiệu khác",
    "Đợi chương trình ưu đãi", "Không có người tư vấn", "Muốn suy nghĩ thêm", "Khác"
  ];
  var lostRows = [];
  var tLostCount = 0;

  lostList.forEach(function(lName, idx) {
    var lCnt = 0;
    filtered.forEach(function(r) {
      var reason = r[15] ? r[15].toString() : "";
      if (reason.indexOf(lName) !== -1) lCnt++;
    });
    tLostCount += lCnt;
    lostRows.push([
      idx + 1, lName, lCnt, 0,
      lCnt > 10 ? "Cao" : "Trung Bình", "Cần cải thiện tư vấn/chính sách",
      "", "", "", "", ""
    ]);
  });

  lostRows.forEach(function(row) {
    row[3] = tLostCount > 0 ? row[2] / tLostCount : 0;
  });

  lostRows.push([
    "-", "TỔNG CỘNG LOST SALE", tLostCount, 1, "-", "-", "", "", "", "", ""
  ]);

  s03.getRange("A64:K74").setValues(lostRows);
  s03.getRange("A64:K74").setHorizontalAlignment("center");
  s03.getRange("A74:K74").setFontWeight("bold").setBackground("#F6EADE");
  s03.getRange("C64:C74").setNumberFormat("#,##0");
  s03.getRange("D64:D74").setNumberFormat("0.0%");

  if (s04) {
    s04.getRange("A62:K62").merge().setValue("5. PHÂN TÍCH LOST SALE — NGUYÊN NHÂN RỚT ĐƠN & TỶ TRỌNG")
       .setFontWeight("bold").setBackground("#0B0A08").setFontColor("#FFFFFF");
    s04.getRange("A63:K63").setValues([[
      "STT", "Nguyên Nhân Chưa Chốt Đơn", "Số Lượt Rớt Đơn", "Tỷ Trọng Lost Sale %",
      "Mức Độ Ảnh Hưởng", "Hành Động Khắc Phục Đề Xuất", "", "", "", "", ""
    ]]).setFontWeight("bold").setBackground("#987147").setFontColor("#FFFFFF").setHorizontalAlignment("center");

    s04.getRange("A64:K74").setValues(lostRows);
    s04.getRange("A64:K74").setHorizontalAlignment("center");
    s04.getRange("A74:K74").setFontWeight("bold").setBackground("#F6EADE");
    s04.getRange("C64:C74").setNumberFormat("#,##0");
    s04.getRange("D64:D74").setNumberFormat("0.0%");
  }

  // 5. Daily Trend
  var dateMap = {};
  filtered.forEach(function(r) {
    var dStr = r[16] ? r[16].toString() : "";
    if (dStr) {
      if (!dateMap[dStr]) dateMap[dStr] = { trf: 0, buy: 0, rev: 0 };
      dateMap[dStr].trf++;
      if (r[25] === 1) dateMap[dStr].buy++;
      dateMap[dStr].rev += (Number(r[14]) || 0);
    }
  });

  var sortedDates = Object.keys(dateMap).sort(function(a, b) {
    var pA = a.split('/'), pB = b.split('/');
    if (pA.length === 3 && pB.length === 3) {
      return new Date(pA[2], pA[1] - 1, pA[0]) - new Date(pB[2], pB[1] - 1, pB[0]);
    }
    return a.localeCompare(b);
  });

  var dailyRows = [];
  var tDyT = 0, tDyB = 0, tDyR = 0;

  sortedDates.forEach(function(dKey, dIdx) {
    var obj = dateMap[dKey];
    tDyT += obj.trf; tDyB += obj.buy; tDyR += obj.rev;
    var dCvr = obj.trf > 0 ? obj.buy / obj.trf : 0;
    var dAov = obj.buy > 0 ? obj.rev / obj.buy : 0;
    var dRpv = obj.trf > 0 ? obj.rev / obj.trf : 0;

    dailyRows.push([dIdx + 1, dKey, obj.trf, obj.buy, obj.rev, dCvr, dAov, dRpv, "", "", ""]);
  });

  if (dailyRows.length === 0) {
    dailyRows.push(["1", "Chưa có dữ liệu ngày", 0, 0, 0, 0, 0, 0, "", "", ""]);
  }

  var totDyCvr = tDyT > 0 ? tDyB / tDyT : 0;
  var totDyAov = tDyB > 0 ? tDyR / tDyB : 0;
  var totDyRpv = tDyT > 0 ? tDyR / tDyT : 0;
  dailyRows.push(["-", "TỔNG CỘNG THEO NGÀY", tDyT, tDyB, tDyR, totDyCvr, totDyAov, totDyRpv, "", "", ""]);

  s03.getRange(123, 1, dailyRows.length, 11).setValues(dailyRows);
  s03.getRange(123, 1, dailyRows.length, 11).setHorizontalAlignment("center");
  s03.getRange(123 + dailyRows.length - 1, 1, 1, 11).setFontWeight("bold").setBackground("#F6EADE");
  s03.getRange(123, 3, dailyRows.length, 3).setNumberFormat("#,##0");
  s03.getRange(123, 6, dailyRows.length, 1).setNumberFormat("0.0%");
  s03.getRange(123, 7, dailyRows.length, 2).setNumberFormat("#,##0");

  // ĐẶT LINK TRUY CẬP CHÍNH XÁC Ở CUỐI SHEET 03 (DÒNG 138+)
  var endRowS03 = 123 + dailyRows.length + 2;
  s03.getRange(endRowS03, 1, 1, 11).merge()
     .setValue("🔗 LINK XEM EXECUTIVE DASHBOARD ONLINE TRÊN DI ĐỘNG: " + liveUrl)
     .setFontWeight("bold").setFontSize(11)
     .setBackground("#F6EADE").setFontColor("#987147")
     .setHorizontalAlignment("center");

  if (s04) {
    s04.getRange("A121:K121").merge().setValue("6.3. TỔNG HỢP CHI TIẾT THEO NGÀY (DAILY TREND MATRIX)")
       .setFontWeight("bold").setBackground("#0B0A08").setFontColor("#FFFFFF");
    s04.getRange("A122:K122").setValues([[
      "STT", "Ngày", "Lượt Khách (TRF)", "Khách Mua (PUR)", "Doanh Thu (REV)",
      "Tỷ Lệ Chốt (CVR)", "Giá Trị HĐ TB (AOV)", "DT/Lượt Khách (RPV)", "", "", ""
    ]]).setFontWeight("bold").setBackground("#987147").setFontColor("#FFFFFF").setHorizontalAlignment("center");

    s04.getRange(123, 1, dailyRows.length, 11).setValues(dailyRows);
    s04.getRange(123, 1, dailyRows.length, 11).setHorizontalAlignment("center");
    s04.getRange(123 + dailyRows.length - 1, 1, 1, 11).setFontWeight("bold").setBackground("#F6EADE");
    s04.getRange(123, 3, dailyRows.length, 3).setNumberFormat("#,##0");
    s04.getRange(123, 6, dailyRows.length, 1).setNumberFormat("0.0%");
    s04.getRange(123, 7, dailyRows.length, 2).setNumberFormat("#,##0");
  }
}
