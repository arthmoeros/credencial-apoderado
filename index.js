const PDFDocument = require('pdfkit');
const fs = require('fs');
const { list } = require('pdfkit');

let offsetX = 80;
let offsetY = 70;

function xpos(pos){
  return offsetX+pos;
}

function ypos(pos){
  return offsetY+pos;
}

function generateCredencial(data){
  var pdfDoc = new PDFDocument;
  pdfDoc.pipe(fs.createWriteStream(`credencial-${data.index.toString().padStart(2, '0')}.pdf`));
  
  pdfDoc.image('images/front.png', {width: 300});
  pdfDoc.moveDown(0.5)
  pdfDoc.image('images/back.png', {width: 300});
  pdfDoc.text(data.nombres, xpos(65), ypos(20));
  pdfDoc.text(data.apellidos, xpos(65), ypos(36));
  pdfDoc.text(data.curso, xpos(65), ypos(52));
  pdfDoc.image(`data/${data.index.toString().padStart(2, '0')}.jpg`, xpos(12), ypos(84), {width: 80, height: 80});
  
  pdfDoc.fontSize(12);
  pdfDoc.text(data.nombreApoderado, xpos(65), ypos(205));
  pdfDoc.text(data.rutApoderado, xpos(65), ypos(205+13));
  pdfDoc.text(data.fonoApoderado, xpos(65), ypos(205+13*2));
  
  pdfDoc.text(data.nombreSuplente, xpos(65), ypos(250));
  pdfDoc.text(data.rutSuplente, xpos(65), ypos(250+13));
  pdfDoc.text(data.fonoSuplente, xpos(65), ypos(250+13*2));
  
  pdfDoc.text(data.fonoEmergencia, xpos(65), ypos(295));
  
  pdfDoc.end();
}

function processDataList(){
  let listContents = fs.readFileSync('data/list.csv').toString();
  listContents.split('\n').forEach((line, index) => {
    if(line.trim().length > 0){
      let items = line.split(';');
      let data = { 
        nombres: items[0],
        apellidos: items[1],
        curso: items[2],
        nombreApoderado: items[3],
        rutApoderado: items[4],
        fonoApoderado: items[5],
        nombreSuplente: items[6],
        rutSuplente: items[7],
        fonoSuplente: items[8],
        fonoEmergencia: items[9],
        index
      };
  
      generateCredencial(data);
    }
  })
}

processDataList();