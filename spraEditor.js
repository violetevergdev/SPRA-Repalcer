import xml2js from "xml2js";
import iconv from "iconv-lite";
import fs from "fs";

const parser = new xml2js.Parser();
const builder = new xml2js.Builder({
  xmldec: {
    encoding: "Windows-1251",
  },
});

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const decodedXml = iconv.decode(data, "Windows-1251");
        const doc = parser.parseStringPromise(decodedXml);
        resolve(doc);
      }
    });
  });
};

(async () => {
  const files = fs.readdirSync("./input");
  const spraFiles = files.filter((file) => file.includes("SPRA"))[0];
  const spisFiles = files.filter((file) => file.includes("SPIS"));

  const spraDoc = await readFile(`./input/${spraFiles}`);
  const spraDiscrep =
    spraDoc.ФайлПФР.ПачкаИсходящихДокументов[0].СПИСОК_РАСХОЖДЕНИЙ[0]
      .Расхождения;

  const spraDiscrepAmount = spraDiscrep.length;
  const spisFilesAmount = spisFiles.length;
  console.log(`Всего ${spraDiscrepAmount} расхождений и ${spisFilesAmount} файла для поиска информации.`)

  for (const spisFile of spisFiles) {
    console.log(`Обрабатываю ${spisFiles.indexOf(spisFile)+1} файл.`)
    const spisDoc = await readFile(`./input/${spisFile}`);

    const spisRecip =
      spisDoc.ФайлПФР.ПачкаВходящихДокументов[0].СПИСОК_НА_ЗАЧИСЛЕНИЕ[0]
        .СведенияОполучателе;

    spraDiscrep.forEach((discrep) => {
      const spraNum = discrep.НомерВыплатногоДела[0];
      const matchingRecip = spisRecip.find(
        (resip) => resip.НомерВыплатногоДела[0] === spraNum,
      );

      if (matchingRecip) {
        discrep.НомерВмассиве = matchingRecip.НомерВмассиве[0];
      }
    });
  }


  const spraUpdatedFile = builder.buildObject(spraDoc);
  const encodedXml = iconv.encode(spraUpdatedFile, "Windows-1251");
  fs.writeFileSync(`./input/${spraFiles}`, encodedXml);
})();