// Required node modules
//const d3 = require('d3-node');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const Promise = require('bluebird');
const d3 = require("d3");
const d3nBar = require('./barchart.js');
const d3nLine = require('./linechart.js');
const d3nPie = require('./piechart.js');
const d3output = require('d3node-output');
const PAGE_HEIGHT = 1000;
const PAGE_WIDTH = 1850;

async function createReport(range, templateFile) {
  // Prepare a document
  const doc = new PDFDocument({
    size: [PAGE_HEIGHT, PAGE_WIDTH],
    layout: 'landscape',
    bufferPages: true,
  });

  // For Unicode.
  doc.registerFont('OpenSans', './template/font/Open_Sans/OpenSans-Regular.ttf');

  // Output
  if (!fs.existsSync('./output')) { fs.mkdirSync('./output'); }
  doc.pipe(fs.createWriteStream("./output/report.pdf"));

  // Load template
  var template = loadTemplate(range, templateFile);
  
  // Fill pages with data
  await fillPages(doc, template);

  // Finish
  doc.end();
}

async function fillPages(doc, template) {
  const numPages = template.pages.length;
  var pageNo = 0;
  
  while (pageNo < numPages) {
    console.log("Generating page " + (pageNo + 1));
    // Background color
    if (template.pages[pageNo]["background_color"]) {
      await insertElement(
        doc, 
        template.pages[pageNo].name, 
        {
          "name": "background color",
          "type": "rect",
          "position": [0, 0],
          "size": [PAGE_WIDTH, PAGE_HEIGHT],
          "color": template.pages[pageNo]["background_color"]
        }
      );
    }
    // Put elements into the page
    for (element of template.pages[pageNo].elements) {
      await insertElement(doc, template.pages[pageNo].name, element);
    }
    // Move to next page
    if (pageNo++ < numPages - 1) { doc.addPage() };
  }
}

function loadTemplate(range, templateFile) {
  switch(range.toLowerCase()) {
    case 'daily':
      return loadTemplateDaily(templateFile);    
    case 'weekly':
      return loadTemplateWeekly(templateFile);
    case 'monthly':
      return loadTemplateMonthly(templateFile);
    case 'quarterly':
      return loadTemplateQuarterly(templateFile);
    case 'yearly':
      return loadTemplateYearly(templateFile);
    default:  
      return loadTemplateCustomRange(templateFile);
  }
}

function loadTemplateDaily(templateFile) {
  return (templateFile ? 
    JSON.parse(fs.readFileSync(templateFile)) : 
    JSON.parse(fs.readFileSync('./template/daily/defaultDailyReportTemplate.json'))
  )
}

function loadTemplateWeekly(templateFile) {
  return (templateFile ? 
    JSON.parse(fs.readFileSync(templateFile)) : 
    JSON.parse(fs.readFileSync('./template/weekly/defaultWeeklyReportTemplate.json'))
  )
}

function loadTemplateMonthly(templateFile) {
  return (templateFile ? 
    JSON.parse(fs.readFileSync(templateFile)) : 
    JSON.parse(fs.readFileSync('./template/monthly/defaultMonthlyReportTemplate.json'))
  )
}

function loadTemplateQuarterly(templateFile) {
  return (templateFile ? 
    JSON.parse(fs.readFileSync(templateFile)) : 
    JSON.parse(fs.readFileSync('./template/quarterly/defaultQuarterlyReportTemplate.json'))
  )
}

function loadTemplateYearly(templateFile) {
  return (templateFile ? 
    JSON.parse(fs.readFileSync(templateFile)) : 
    JSON.parse(fs.readFileSync('./template/yearly/defaultYearlyReportTemplate.json'))
  )
}

function loadTemplateCustomRange(templateFile) {
  return (templateFile ? 
    JSON.parse(fs.readFileSync(templateFile)) : 
    JSON.parse(fs.readFileSync('./template/yearly/defaultCustomRangeReportTemplate.json'))
  )
}

async function insertElement(doc, pageName, element) {
  switch (element.type) {
    case 'text':
      return insertText(doc, pageName, element);
    case 'bullet_point':
      return insertBullletPoint(doc, pageName, element);
    case 'image':
      return insertImage(doc, pageName, element);
    case 'piechart':
      return insertPieChart(doc, pageName, element);
    case 'linechart':
      return insertLineChart(doc, pageName, element);
    case 'barchart':
      return insertBarChart(doc, pageName, element);
    case 'path':
      return insertPath(doc, pageName, element);
    case 'rect':
      return insertRectangle(doc, pageName, element);
    case 'roundedRect':
      return insertRoundedRectangle(doc, pageName, element);
    case 'circle':
    case 'ellipse':
    case 'polygon':
    default:
      return;
  }
}

function insertText(doc, pageName, element) {
  if (element.font_family) {
    doc.font(element.font_family);
  }
  if (element.font_size > 0) {
    doc.fontSize(element.font_size);
  }
  if (element.text_color) {
    doc.fillColor(element.text_color);
  }

  doc.text(
    element.content, 
    element.position[0],
    element.position[1],
    {
      align: element.align,
      width: element.width,
      height: element.height,
      fontWeight: element.font_weight
    }
  );
}

async function insertBullletPoint(doc, pageName, element) {
  doc.list(element.content, {
    bulletIndent: element.bulletIndent,
    textIndent: element.textIndent
  })
}

async function insertImage(doc, pageName, element) {
  if (pageName === "intro" && element.name === "organization logo") {
    doc.image(
      element.source, 
      element.position[0], 
      element.position[1],
      {
        fit: [250, 50],
        align: 'center',
        valign: 'center',
        //scale: element.scale
      } 
    );
  } else if (pageName === "intro" && element.name === "customer logo") {
    doc.image(
      element.source, 
      element.position[0], 
      element.position[1],
      {
        fit: [600, 600],
        align: 'center',
        valign: 'center',
        //scale: element.scale
      } 
    );
  } else {
    doc.image(
      element.source, 
      element.position[0], 
      element.position[1],
      {
        scale: element.scale
      } 
    );
  }
}

async function insertPieChart(doc, pageName, element) {   
  var options = {};
  if (element.height && element.width) {
    options = {
      height: element.height,
      width: element.width
    };
  }

  await piechartParseData(element)
    .then(data => piechartGenerator(data, options))
    .then(pngLocation => { doc.image(pngLocation) })
    .catch(err => { console.log(err); return false; })
}

function piechartParseData(element) {
  console.log("  parsing data");
  return new Promise((resolve, reject) => {
    return (element.dataURL && element.dataURL != "") ? reject() :
      resolve(d3.csvParse(piechartJson2Csv(element.data)))
  })
}

function piechartJson2Csv(jsonData) {
  var outputString = 'label,value\n';
  var keys = Object.keys(jsonData);
  for (var i=0; i < keys.length; i++) {
    if (!isNaN(jsonData[keys[i]])) {
      outputString += keys[i] + "," + jsonData[keys[i]] + "\r\n";  
    }    
  }
  return outputString;
}

function piechartGenerator(data, options) {
  return new Promise((resolve, reject) => {
    const outputFile = './.tmp/piechart_' + generateId(12);
    d3output(outputFile, d3nPie({ data:data }), options, (err, res) => {
      if (err) {
        console.log("  no piechart");
        return reject();
      } else {
        console.log("  piechart generated");  
        return resolve(outputFile + ".png");
      }
    });
  })
}

async function insertLineChart(doc, pageName, element) {
  var options = {};
  if (element.height && element.width) {
    options = {
      height: element.height,
      width: element.width
    };
  }

  await linechartParseData(element)
    .then(data => linechartGenerator(data, options))
    .then(pngLocation => { doc.image(pngLocation) })
    .catch(err => { console.log(err); return false; })
}

function linechartParseData(element) {
  console.log("  parsing data");
  return new Promise((resolve, reject) => {
    if (element.dataURL && element.dataURL != "") {
      return reject();
    } else {
      var output = [];

      if (element.data.length == 1) {
        // Single line
        const parseTime = d3.timeParse('%d-%b-%y');
        output.push(Object.keys(element.data[0]).map(key => ({ 
          key: parseTime(key), 
          value: +element.data[0][key] 
        }))); 
      } else {
        // Multiple lines
      }

      resolve(output[0])
    }
  })
}

function linechartGenerator(data, options) {
  return new Promise((resolve, reject) => {
    const outputFile = './.tmp/linechart_' + generateId(12);
    d3output(outputFile, d3nLine({ data:data }), options, (err, res) => {
      if (err) {
        console.log("  no linechart");
        return reject();
      } else {
        console.log("  linechart generated");  
        return resolve(outputFile + ".png");
      }
    });
  })
}

async function insertBarChart(doc, pageName, element) {   
  var options = {};
  if (element.height && element.width) {
    options = {
      height: element.height,
      width: element.width
    };
  }

  await barchartParseData(element)
    .then(data => barchartGenerator(data, options))
    .then(pngLocation => { console.log(pngLocation); doc.image(pngLocation); console.log("bar chart inserted"); return; })
    .catch(err => { console.log(err); return false; })
}

function barchartParseData(element) {
  console.log("  parsing data");
  return new Promise((resolve, reject) => {
    return (element.dataURL && element.dataURL != "") ? reject() :
      resolve(d3.csvParse(barchartJson2Csv(element.data)))
  })
}

function barchartJson2Csv(jsonData) {
  var outputString = 'key,value\n';
  var keys = Object.keys(jsonData);
  for (var i=0; i < keys.length; i++) {
    if (!isNaN(jsonData[keys[i]])) {
      outputString += keys[i] + "," + jsonData[keys[i]] + "\r\n";  
    }    
  }
  return outputString;
}

function barchartGenerator(data, options) {
  return new Promise((resolve, reject) => {
    const outputFile = './.tmp/barchart_' + generateId(12);
    d3output(outputFile, d3nBar({ data:data }), options, (err, res) => {
      console.log("  generating output");
      if (err) {
        console.log("  no barchart");
        return reject();
      } else {
        console.log("  barchart generated");  
        return resolve(outputFile + ".png");
      }
    });
  })
}

function insertRectangle(doc, pageName, element) {
  return new Promise((resolve, reject) => {
    if (element.lineWidth) {
     return resolve(
        doc.rect(
          element.position[0], 
          element.position[1],
          element.size[0],
          element.size[1]
        )
          .lineWidth(element.lineWidth)
          .stroke(element.lineColor)
          .fill(element.color)
      )
    } else {
      return resolve(
        doc.rect(
          element.position[0], 
          element.position[1],
          element.size[0],
          element.size[1]
        )
          .fill(element.color)
      )
    }
  })
}

function insertRoundedRectangle(doc, pageName, element) {
  return new Promise((resolve, reject) => {
    if (element.lineWidth) {
     return resolve(
        doc.roundedRect(
          element.position[0], 
          element.position[1],
          element.size[0],
          element.size[1],
          element.cornerRadius
        )
          .lineWidth(element.lineWidth)
          .stroke(element.lineColor)
          .fill(element.color)
      )
    } else {
      return resolve(
        doc.roundedRect(
          element.position[0], 
          element.position[1],
          element.size[0],
          element.size[1],
          element.cornerRadius
        )
          .fill(element.color)
      )
    }
  })
}

function insertPath(doc, pageName, element) {
  return new Promise((resolve, reject) => {
    return resolve(
      doc.path(element.path).stroke()
    )
  })
}

function generateId(length) {
  // Generate a random string as image ID
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

createReport(
  range = 'weekly', 
  templateFile = null
);