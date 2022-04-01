const fs = require("fs");
// var mainObj = {};
let mainObj = JSON.parse(fs.readFileSync("./data2022.json", "utf8"));
for (let key in mainObj) {
  mainObj[key].bigtitle = mainObj[key].bigtitle.trim();
  mainObj[key].category = mainObj[key].category.trim();
  mainObj[key].code = mainObj[key].code.trim();
  mainObj[key].title = mainObj[key].title.trim();
  mainObj[key].lang = mainObj[key].lang.trim();
  mainObj[key].teacher = mainObj[key].teacher.trim();
  mainObj[key].grade = mainObj[key].grade.trim();
  mainObj[key].department = mainObj[key].department.trim();
  mainObj[key].term = mainObj[key].term.trim();
  mainObj[key].time = mainObj[key].time.trim();
  if (mainObj[key].teacher == "") {
    mainObj[key].teacher = "教員情報なし";
  }
  mainObj[key].listTitle =
    mainObj[key].title + "（" + mainObj[key].teacher + "）";
  mainObj[key].listTitle = mainObj[key].listTitle.trim();
}

fs.writeFile("data.json", JSON.stringify(mainObj), (err) => {
  if (err) throw err;
  console.log("done");
});
