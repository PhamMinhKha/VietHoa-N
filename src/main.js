var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var database = require("./database");
//Allow all requests from all domains & localhost
app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/get_list_top_coin", function (req, res) {
  console.log("GET From SERVER");
  var data = req.body;
});

app.post("/submit_break_galaxy", async function (req, res) {
  var data = req.body;
  if (data.id) {
    var is_exist_user = await database.kiem_tra_nguoi_dung(data.id);
    //Nếi is_exist_user == false tức là user chưa tồn tại thì tạo user mới
    try {
      if (is_exist_user === false) {
        var result_user = await database.create_new_top(data);
      } else {
        var result_user = await database.update_nguoi_dung(data);
      }
      var your_rank = await database.your_rank(data);
      var top_10 = await database.top_10();
      var total = await database.total_player();
      return res.json({
        status: true,
        mes: "Thành công cập nhật dữ liệu",
        data: {
          top_10,
          your_rank,
          total,
        },
      });
    } catch (error) {
      res.json({
        status: false,
        mes: "Cập nhật không thành công thông tin user",
        error,
      });
    }
  } else
    res.json({
      status: false,
      mes: "Không tìm thấy id của máy",
    });
});

app.listen(6069);
