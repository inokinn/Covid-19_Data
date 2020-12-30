function myFunction()
{
  // 感染状況データを取得
  var result = this.getCovid19Data();
  // 取得したデータをフィルタリング
  var filteringResult = this.filteringCovid19DataWhereToday(result);
  // 取得したデータをスプレッドシートに反映
  this.setArrayToSheet(filteringResult);
}

// 感染データを取得
function getCovid19Data()
{
  // 感染状況データをインターネット経由で取得
  var targetUrl = "https://raw.githubusercontent.com/kaz-ogiwara/covid19/master/data/prefectures.csv"
  var prefecturesCsv = UrlFetchApp.fetch(targetUrl).getContentText("UTF-8");
  // 取得したデータをパースし配列に格納して返す
  return Utilities.parseCsv(prefecturesCsv);
}

// データのフィルタリング（全国の3日前の感染者数）
function filteringCovid19DataWhereToday(values)
{
  // date を2日前に設定する小細工
  var date = new Date();
  var hoge = Utilities.formatDate(date, "Asia/Tokyo", "yyyy/MM/dd");
  var tmpDay = date.getDate();
  date.setDate(tmpDay - 3);
  // 3日前の年月日を取得
  var year = date.getFullYear();
  var month = date.getMonth() + 1;    // getMonth の返り値は 0 スタートなので +1 する
  var day = date.getDate();
  // 年月日でデータをフィルタリング
  return values.filter(i => i[0] == year && i[1] == month && i[2] == day);

}

// スプレッドシートへの書き込み
function setArrayToSheet(values)
{
  // スプレッドシートのインスタンスを取得
  var sheet = SpreadsheetApp.getActiveSheet();
  // シートの初期化
  sheet.clear();
  // スプレッドシートへの書き込み
  sheet.getRange(1, 1, values.length, values[0].length).setValues(values);
}

// アクセスされた際、Webページへの出力を行う
function doGet()
{
  return HtmlService.createTemplateFromFile('index').evaluate();
}