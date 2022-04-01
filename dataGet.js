const puppeteer = require("puppeteer");
const fs = require("fs");
// var mainObj = {};
var mainObj = JSON.parse(fs.readFileSync("./data2022.json", "utf8"));

(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: false,
    timeout: 0,
  });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
  });
  await page.goto(
    "http://syllabus.shizuoka.ac.jp/ext_syllabus/syllabusSearchDirect.do?nologin=on",
    {
      waitUntil: "networkidle2",
    }
  );

  await page.select('select[name="syllabusTitleID"]', "2148"); //2022年度:2161,2157,2155,2150,2148 2021年度：2143,2137,2130,2132,2129 2020年度：2125,2121,2119,2111,2114,2112　2019年度:2108,2104,2102,2094,2097,2095
  await page.waitFor(1000);
  await Promise.all([
    page.waitForNavigation({ timeout: 0 }),
    page.click(
      "body > form > table:nth-child(2) > tbody > tr > td:nth-child(2) > img:nth-child(1)"
    ),
  ]);

  //   let scrapingData = 'data';
  //   fs.writeFile('data2021.json', JSON.stringify(scrapingData), err => {
  //   	if (err) throw err;
  //   	console.log('done');
  //   });

  let tds = await page.evaluate(() => {
    let tds = Array.from(document.querySelectorAll("td"));
    let table = tds.map((td) => td.innerText);
    return table;
  });
  tds.splice(0, 16);

  let preObj = {};

  for (let i = 0; i < tds.length; i++) {
    switch (i % 10) {
      case 0:
        preObj.bigtitle = tds[i];
        break;
      case 1:
        preObj.category = tds[i];
        break;
      case 2:
        preObj.code = tds[i];
        break;
      case 3:
        preObj.title = tds[i];
        break;
      case 4:
        preObj.lang = tds[i];
        break;
      case 5:
        preObj.teacher = tds[i];
        break;
      case 6:
        preObj.grade = tds[i];
        break;
      case 7:
        preObj.department = tds[i];
        break;
      case 8:
        preObj.term = tds[i];
        break;
      case 9:
        preObj.time = tds[i];
        mainObj[preObj.title + preObj.code + preObj.teacher] = preObj;
        preObj = {};
        break;
    }
  }

  //   for (var item in mainObj) {
  //     console.log(item)
  //     if (item.indexOf(code) !== -1) {
  //       console.log("ok")
  //       mainObj[item].aaaaaa = "foooo"
  //     } else {
  //       console.log("boo")
  //     }
  //   }

  //   let ids = new Array(228)
  //   ids.fill(0);

  //   const promiseArray = ids.map(function (value, index) {
  //     return new Promise(async (resolve, reject) => {
  //       let code = await page.evaluate((i) => {
  //         let code = document.querySelector("body > form > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(" + i + ") > td:nth-child(3) > div").innerText;
  //         return code;
  //       }, index + 2);
  //       await Promise.all([
  //         page.click('body > form > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(' + i + ') > td:nth-child(3) > div'),
  //         page.waitForNavigation({
  //           timeout: 0,
  //         }),
  //       ]);
  //       await Promise.all([
  //         page.click('body > form:nth-child(8) > table > tbody > tr > td > input[type=image]'),
  //         page.waitForNavigation({
  //           timeout: 0,
  //         }),
  //       ]);
  //       console.log(code);
  //       resolve();
  //     });
  //   })
  //   await Promise.all(promiseArray);

  fs.writeFile("data2022.json", JSON.stringify(mainObj), (err) => {
    if (err) throw err;
    console.log("done");
  });

  await browser.close();
})();
