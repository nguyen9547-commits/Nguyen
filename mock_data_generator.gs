/**
 * SHINKO RETAIL ANALYTICS V3 - DEV TOOL: MOCK DATA GENERATOR
 * Mục đích: Tự động chèn `count` dòng khảo sát ngẫu nhiên theo đúng ma trận
 * Data Schema vào tab 01_Form_Response để kiểm tra tức thì tính chính xác
 * của 6 tab Sheet và Dashboard mà không cần thao tác tay trên web.
 */

function generateMockData(count) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var rawSheetName = (ss.getSheetByName("01_Form_Response")) ? "01_Form_Response" : (ss.getSheetByName("01_Dữ_Liệu_Gốc") ? "01_Dữ_Liệu_Gốc" : "01_Form_Response");
  var s01 = ss.getSheetByName(rawSheetName);
  if (!s01) {
    s01 = ss.insertSheet(rawSheetName);
    s01.appendRow(["Dấu thời gian", "Showroom", "Khung giờ đến", "Phân loại khách hàng", "Nguồn biết đến Showroom", "Mục đích ghé Showroom", "Sản phẩm quan tâm", "Khách có thử đồ không", "Khách có mua hàng không", "Mục đích sử dụng", "Hình thức mua", "Số lượng sản phẩm mua", "Danh mục sản phẩm đã mua", "Mã hóa đơn", "Số tiền trên hóa đơn (VNĐ)", "Lý do chưa mua", "Trạng thái Kiểm toán"]);
  }

  var numRecords = count || 20;
  var showrooms = ["SHINKO - Trần Duy Hưng", "SHINKO - Xã Đàn", "SHINKO - Bắc Ninh", "SHINKO - Thanh Hóa", "SHINKO - Ninh Bình"];
  var timeSlots = ["08:00 - 11:00", "11:00 - 13:00", "13:00 - 15:00", "15:00 - 17:00", "17:00 - 19:00", "19:00 - 22:00"];
  var custTypes = ["Khách mới", "Khách cũ"];
  var sources = ["Đi ngang cửa hàng", "Marketing (Facebook, TikTok, Website...)", "Khách được giới thiệu", "Khách chủ động quay lại", "Khác"];
  var visitPurposes = ["Mua cho bản thân", "Mua quà tặng", "Tham khảo mẫu", "Khác"];
  var products = ["Giày", "Polo", "Tshirt", "Sơ mi", "Quần", "Jacket", "Blazer", "Áo len", "Áo da", "Dây lưng", "Ví/Bóp tay", "Cặp/Túi", "Phụ kiện khác"];
  var usagePurposes = ["Cá nhân sử dụng", "Mua quà tặng", "Công ty/Doanh nghiệp", "Khác"];
  var purchaseTypes = ["Mua nguyên giá", "Mua có ưu đãi"];
  var lostReasons = ["Giá chưa phù hợp", "Hết size/màu", "Chưa thích mẫu", "Chỉ tham khảo", "Chưa có nhu cầu", "Muốn suy nghĩ thêm", "Đang xem thương hiệu khác", "Đợi CT ưu đãi", "Không vừa form", "Khác"];

  var rows = [];
  var now = new Date();

  for (var i = 0; i < numRecords; i++) {
    var randDays = Math.floor(Math.random() * 90);
    var dt = new Date(now.getTime() - randDays * 24 * 60 * 60 * 1000);
    var sr = showrooms[Math.floor(Math.random() * showrooms.length)];
    var slot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
    var cType = custTypes[Math.floor(Math.random() * custTypes.length)];
    var src = sources[Math.floor(Math.random() * sources.length)];
    var vPurp = visitPurposes[Math.floor(Math.random() * visitPurposes.length)];
    
    // Pick 1-3 random interested products
    var numInt = Math.floor(Math.random() * 3) + 1;
    var intProds = [];
    for (var k = 0; k < numInt; k++) {
      var p = products[Math.floor(Math.random() * products.length)];
      if (intProds.indexOf(p) === -1) intProds.push(p);
    }
    
    var tried = (Math.random() > 0.3) ? "Có thử" : "Không thử";
    var isBuy = (Math.random() > 0.35); // ~65% CVR
    var hasPur = isBuy ? "Có" : "Không";
    
    var uPurp = "", pType = "", qty = "", purProds = "", invCode = "", invAmt = "", nonReason = "";
    if (isBuy) {
      uPurp = usagePurposes[Math.floor(Math.random() * usagePurposes.length)];
      pType = purchaseTypes[Math.floor(Math.random() * purchaseTypes.length)];
      var qtyNum = Math.floor(Math.random() * 5) + 1;
      qty = qtyNum.toString();
      purProds = intProds.join(", ");
      invCode = "HD" + Math.floor(100000 + Math.random() * 900000);
      var avgPrice = 850000 + Math.floor(Math.random() * 400000);
      invAmt = (qtyNum * avgPrice).toString();
    } else {
      nonReason = lostReasons[Math.floor(Math.random() * lostReasons.length)];
    }

    rows.push([
      dt, sr, slot, cType, src, vPurp, intProds.join(", "),
      tried, hasPur, uPurp, pType, qty, purProds, invCode,
      invAmt, nonReason, "OK"
    ]);
  }

  if (rows.length > 0) {
    s01.getRange(s01.getLastRow() + 1, 1, rows.length, 17).setValues(rows);
    Logger.log("✅ Đã chèn thành công " + rows.length + " dòng dữ liệu thử nghiệm vào " + rawSheetName);
    // Auto trigger sync
    if (typeof setupV3Architecture === "function") {
      setupV3Architecture();
    }
  }
}
