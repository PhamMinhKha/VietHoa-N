const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/break_galaxy");
  console.log("connect mongodb");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const Player_Schema = new mongoose.Schema({
  country: String,
  player: String,
  coin: Number,
  level: Number,
  id: String,
});

var Player = mongoose.model("player", Player_Schema);

function create_new_top(data) {
  console.log(data);
  var newPlayer = new Player({
    country: data.country,
    player: data.player,
    coin: data.coin,
    level: data.level,
    id: data.id,
  });
  newPlayer.save();
}
async function update_nguoi_dung(data) {
  return await Player.findOneAndUpdate(
    { id: data.id },
    {
      country: data.country,
      player: data.player,
      coin: data.coin,
      level: data.level,
    }
  );
}
async function kiem_tra_nguoi_dung(id) {
  var result_count = await Player.countDocuments({ id });
  if (result_count > 0) {
    //Tìm thấy người dùng
    return true;
  } else {
    //Không tìm thấy người dùng
    return false;
  }
}
async function your_rank(dataPlayer) {
  var your_rank = {};
  your_rank.coin = await Player.countDocuments({
    coin: { $gte: dataPlayer.coin },
  }).sort({
    coin: "asc",
  });
  your_rank.level = await Player.countDocuments({
    level: { $gte: dataPlayer.level },
  }).sort({
    level: "asc",
  });
  return your_rank;
}
async function top_10() {
  var top10 = {};
  top10.coin = await Player.find().sort({ coin: "desc" }).limit(10);
  top10.level = await Player.find().sort({ level: "desc" }).limit(10);
  return top10;
}
async function total_player() {
  return await Player.countDocuments();
}
module.exports = {
  create_new_top: create_new_top,
  kiem_tra_nguoi_dung: kiem_tra_nguoi_dung,
  update_nguoi_dung: update_nguoi_dung,
  your_rank: your_rank,
  top_10: top_10,
  total_player: total_player,
};
