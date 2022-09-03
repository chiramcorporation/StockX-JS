const myForm = document.getElementById("myForm");
const holdingsForm = document.getElementById("holdingsForm");
const csvFile = document.getElementById("csvFile");
const displaySection = document.getElementById("displaySection");
const holdingsFileMessageEelement = document.getElementById("holdingsFileUploadMessage");
// const holdingsCacheMessageEelement = document.getElementById("holdingsCacheLoadMessage");
const tradeDataFileUploadMessageEelement = document.getElementById("tradeDataFileUploadMessage");
const processingFilesMessageElement = document.getElementById("processingFilesMessage");
const finalDownloadButtonEelement = document.getElementById("finalDownloadButton");
const totalHoldingsElement = document.getElementById("totalHoldings");
const amountToDrawElement = document.getElementById("amountToDraw");

const STORAGE_CONST = {
  HOLDINGS_LABEL: 'stockx_js_stock_holdings',
  TRADES_LABEL: 'stockx_js_trade_data'
};


let tradeFileUploaded = false;
let holdingsFileUploaded = false;

let tradeDataCacheData = [];
let newTradeDataRecords = [];
let tradeDataKeys = [];
let holdingsFileData = [];
let holdingsMap = {};
let holdingsAltMap = {};
let processedHoldingsData = [];

/**
 * onLoad of Application, will be called for loading keys from LocalStorage Trade Data
 */
function loadTradeDataKeys() {
// exchange
// order_id
// trade_id
  if (tradeDataCacheData && Array.isArray(tradeDataCacheData)) {
    tradeDataCacheData.forEach(element => {
      tradeDataKeys.push('' + element.exchange + element.order_id + element.trade_id + '');
    });
  } else {
    console.log('No Queue defined');
  }
}
/**
 * When TradeData file uploaded, will be called for loading new Trades into
 */
function insertNewTrades(tempTradeData) {
  // tradeDataFileData
  tempTradeData.forEach(tradeRecord => {
    const tempKey = '' + tradeRecord.exchange + tradeRecord.order_id + tradeRecord.trade_id + '';
    if (!tradeDataKeys.includes(tempKey)) {
      newTradeDataRecords.push(tradeRecord);
      tradeDataKeys.push(tempKey);
    }
  });
  tradeDataFileUploadMessageEelement.innerHTML = "Successfully Uploaded Trade Data File";
  tradeDataFileUploadMessageEelement.hidden = false;
  tradeFileUploaded = true;
  // console.log(newTradeDataRecords);
}

window.onload = function() {
  // console.log('window.onload function called');
  const holdingsString = localStorage.getItem(STORAGE_CONST.HOLDINGS_LABEL);
  if (holdingsString && holdingsString.length > 0) {
    holdingsFileData = processedHoldingsData = JSON.parse(holdingsString);
    displayProcessedHoldingsData();
    holdingsFileMessageEelement.innerHTML = "Successfully loaded Holdings From Cache, if there is any descrepancy upload a new file and overwrite the records";
    holdingsFileMessageEelement.hidden = false;
    finalDownloadButtonEelement.hidden = false;
    holdingsFileUploaded = true;
  } else {
    holdingsFileMessageEelement.innerHTML = "No Holding Records available or Uploaded. Now Application supports creation of Holdings from Trade Data. Just Upload Trade Data and process";
    holdingsFileMessageEelement.hidden = false;
    holdingsFileUploaded = true;
  }

  const tradeDataString = localStorage.getItem(STORAGE_CONST.TRADES_LABEL);
  if (tradeDataString && tradeDataString.length > 0) {
    tradeDataCacheData = JSON.parse(tradeDataString);
    loadTradeDataKeys();
  }
};


function csvToArray(str, delimiter = ",") {

  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  if (rows[rows.length - 1].trim() == "") {
    rows.splice(-1);
  }

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
}

function getTextLine(item) {
  return [item.Symbol,item.ISIN,item.Sector,item['Quantity Available'],item.amount_to_recover,item.alternateSymbol].join(",");
}

function downloadFinalData() {
  const firstLine = 'Symbol,ISIN,Sector,Quantity Available,amount_to_recover,alternateSymbol';
  var linesData = [firstLine, ...processedHoldingsData.map(getTextLine)];
  var fileName = "Holdings" + new Date().toISOString() + ".csv";
  downLoadFinalFile(linesData, fileName);
}

function downloadTradeTemplate() {
  const firstLine = 'symbol,isin,trade_date,exchange,segment,series,trade_type,quantity,price,trade_id,order_id,order_execution_time';
  const secondLine = 'SYMBOL,ISIN,2021-05-14,NSE,EQ,EQ,buy,4.000000,5357.600000,1776173,1000000006006988,2021-05-14T09:56:04';
  const rows = [firstLine, secondLine];

  downLoadFinalFile(rows, "tradeData.csv");
}

function downloadHoldingsTemplate() {
  const firstLine = 'Symbol,ISIN,Sector,Quantity Available,amount_to_recover,alternateSymbol';
  const secondLine = 'SYMBOL,INE208A01029,Industrials,255,16589.9,SYMBOL';
  const rows = [firstLine, secondLine];

  downLoadFinalFile(rows, "holdings.csv");
}

function downLoadFinalFile(rows, fileName) {
  let csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", fileName);
  document.body.appendChild(link); // Required for FF

  link.click();
}

myForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const input = csvFile.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const text = e.target.result;
    const tempTradeData = csvToArray(text);
    insertNewTrades(tempTradeData);
  };

  reader.readAsText(input);
});

holdingsForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const input = holdingsUploadFile.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const text = e.target.result;
    holdingsFileData = csvToArray(text);
    holdingsFileMessageEelement.innerHTML = "Successfully Uploaded Holdings File";
    holdingsFileMessageEelement.hidden = false;
    holdingsFileUploaded = true;
  };

  reader.readAsText(input);
});
/**
 * @param  {*} tradeRecord 
 * Creates a new Holding record from Trade record if there is no Holding exists
 * returns the HoldingRecord
 */
function createNewHoldingRecord(tradeRecord) {
  if (tradeRecord && tradeRecord.symbol && tradeRecord.price && tradeRecord.quantity && tradeRecord.trade_type) {
    const newHoldingRec = {};
    newHoldingRec.Symbol = tradeRecord.symbol;
    newHoldingRec.ISIN = tradeRecord.isin;
    newHoldingRec.Sector = 'UnKnown';
    newHoldingRec.alternateSymbol = tradeRecord.symbol;
    if (tradeRecord.trade_type.toLowerCase() === "buy") {
      var totalAmount = +(+tradeRecord.quantity * +tradeRecord.price);
      var costAmount = +((totalAmount * 2 * 0.6) / 100);
      const amountToRecover = ( totalAmount + costAmount).toFixed(2);
      newHoldingRec.amount_to_recover = amountToRecover + "";
      newHoldingRec['Quantity Available'] = (+tradeRecord.quantity) + "";
      return newHoldingRec;
    } else if (tradeRecord.trade_type.toLowerCase() === "sell") {
      // throw Error
      return null;
    }
  } else {
    return null;
  }
}
/**
 * To Process the Trade Data and update Holdings with latest Quantity and Amount
 * 
 */
function processData() {

  if (!tradeFileUploaded || !holdingsFileUploaded) {
    alert("Must upload Holdings Data file and Trade Data file, before processing");
    return;
  }

  // Getting Map Object from HoldingsData
  if (holdingsFileData != null && holdingsFileData.length > 0) {
    holdingsFileData.forEach(element => {
      if (element != undefined && element != null && element.Symbol != null && element.Symbol != undefined && element.Symbol != "") {
        holdingsMap[element.Symbol] = element;
        if (element.Symbol !== element.alternateSymbol) {
          holdingsAltMap[element.alternateSymbol] = element.Symbol;
        }
      }
    });
  }

  if (newTradeDataRecords != null && newTradeDataRecords.length > 0) {
    // for each Trade Record, check existing Holdings and process
    newTradeDataRecords.forEach(element => {
      let holdingRec = holdingsMap[element.symbol];
      if (holdingRec != null && holdingRec != undefined) {
        // Nothing should be done
      } else {
        holdingRec = holdingsMap[holdingsAltMap[element.symbol]];
      }
      // holdingRec.amount_to_recover
      // holdingRec['Quantity Available']

      // element.price: "382.700000"
      // element.quantity: "4.000000"
      // element.trade_type: "buy"/"sell"

      if (holdingRec != null && holdingRec != undefined) {
        var amountToRecover = +holdingRec.amount_to_recover;
        var totalAmount = +(+element.quantity * +element.price);
        if (element.trade_type.toLowerCase() === "buy") {
          var costAmount = +((totalAmount * 2 * 0.6) / 100);
          amountToRecover = (amountToRecover + totalAmount + costAmount).toFixed(2);
          holdingRec.amount_to_recover = amountToRecover + "";
          holdingRec['Quantity Available'] = (+holdingRec['Quantity Available'] + +element.quantity) + "";
        } else if (element.trade_type.toLowerCase() === "sell") {
          amountToRecover = (amountToRecover - totalAmount).toFixed(2);
          holdingRec.amount_to_recover = amountToRecover + "";
          holdingRec['Quantity Available'] = (+holdingRec['Quantity Available'] - +element.quantity) + "";
        } else if (element.trade_type.toLowerCase() === "dividend") {
          amountToRecover = (amountToRecover - +element.price).toFixed(2);
          holdingRec.amount_to_recover = amountToRecover + "";
        } else if (element.trade_type.toLowerCase() === "bonus") {
          holdingRec['Quantity Available'] = (+holdingRec['Quantity Available'] + +element.quantity) + "";
        }
        tradeDataCacheData.push(element);
      } else {
        // No Holding record for that SYMBOL, need to create new Holding Record
        const newHoldingRec = createNewHoldingRecord(element);
        if (newHoldingRec) {
          holdingsMap[element.symbol] = newHoldingRec;
          holdingsFileData.push(newHoldingRec);
          tradeDataCacheData.push(element);
        }
      }

    });
    processedHoldingsData = Object.values(holdingsMap);
    localStorage.setItem(STORAGE_CONST.HOLDINGS_LABEL, JSON.stringify(processedHoldingsData));
    localStorage.setItem(STORAGE_CONST.TRADES_LABEL, JSON.stringify(tradeDataCacheData));
    displayProcessedHoldingsData();
    processingFilesMessageElement.innerHTML = "Successfully Processed Holdings and Trade Files";
    processingFilesMessageElement.hidden = false;
    finalDownloadButtonEelement.hidden = false;
    newTradeDataRecords = [];
  }
}

function displayProcessedHoldingsData() {
  var html = "<table border='1|1'>";
  html += "<tr>";
  html += "<th>" + "Symbol" + "</th>";
  html += "<th>" + "ISIN" + "</th>";
  html += "<th>" + "Quantity Available" + "</th>";
  html += "<th>" + "amount_to_recover" + "</th>";
  html += "<th>" + "Alt Symbol" + "</th>";
  html += "</tr>";
  var countH = 0;
  var amountToRecover = 0;
  processedHoldingsData.forEach(element => {
    if (element != undefined && element != null && element != "") {
      html += "<tr>";
      html += "<td>" + element.Symbol + "</td>";
      html += "<td>" + element.ISIN + "</td>";
      html += "<td>" + element["Quantity Available"] + "</td>";
      html += "<td>" + element.amount_to_recover + "</td>";
      html += "<td>" + element.alternateSymbol + "</td>";

      html += "</tr>";
      countH = countH + 1;
      amountToRecover = amountToRecover + +element.amount_to_recover;
    }
      
  });
  html += "</table>";

  displaySection.innerHTML = html;
  totalHoldingsElement.innerHTML = totalHoldingsElement.innerHTML + "<b>" + countH + "</b>";
  amountToDrawElement.innerHTML = amountToDrawElement.innerHTML + "<b>" + amountToRecover + "</b>";
}
