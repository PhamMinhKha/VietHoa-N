var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var database = require("./database");
var multer = require('multer');
var upload = multer();
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
// app.use(bodyParser.urlencoded());
app.use(upload.array());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.post("/", function (req, res) {
  console.log(req.body);
  res.send("ok")
});
app.get("/", function (req, res) {
  console.log(JSON.parse(req.query.msg));
  res.send("ok")
});
function tach_ten_file(filename)
{
  const regex = /\[(.*?)\]/g;
  const matches = [...filename.matchAll(regex)];
  const values = matches.map(match => match[1]);

  // Giá trị "0100846018258000"
  const firstValue = values[0];

  // Giá trị "v0"
  const secondValue = values[1];
  return {
    id: firstValue,
    version: secondValue
  }
}
app.get("/mock", async function (req, res) {
  const fs = require('fs');
  const path = require('path');

  const folderPath = ['viethoa', 'switch_patch', 'switch_app']; // Đường dẫn đến thư mục bạn muốn đọc
  folderPath.map(async(p) => {
  {
    var newPath = `./uploads/${p}`
    
    await fs.readdir(newPath, async (err, files) => {
      console.log(files);
      if (err) {
        console.error('Lỗi khi đọc thư mục:', err);
        return;
      }
      var list_file = []
      for await (const file of files) {
        var phan_tich = tach_ten_file(file)
        const filePath = path.join(newPath, file);
        await list_file.push({
          title: file,
          filename: encodeURI(file),
          size: 0,
          id: phan_tich.id,
          version: phan_tich.version
        })
      }
      // Ghi chuỗi JSON vào file
      console.log(p);
      await fs.writeFile(`./uploads/${p}.json`, JSON.stringify(list_file), (err) => {
        if (err) {
          console.error('Lỗi khi ghi file:', err);
          return;
        }
        console.log('File JSON đã được ghi thành công!' + p);
      });
    });
  }
})
  res.send('Đã tạo mock.json mới')
})
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
