const fs = require("fs");
const cluster = require("cluster");
const axios = require("axios");
const https = require("https");
const path = require("path");
const fetch = require("node-fetch");

const data = JSON.parse(fs.readFileSync("dataVsPictures.json", "utf8"));
const clubsData = JSON.parse(fs.readFileSync("data.json", "utf8"));
const folderPath = path.join(__dirname, "images");
// async function img() {
//   if (!fs.existsSync(folderPath)) {
//     fs.mkdirSync(folderPath);
//   }
//   let savedCount = 0;
//   let errorCount = 0;
//   async function download(url, name) {
//     const response = await fetch(url);
//     const buffer = await response.buffer();
//     fs.writeFile(`./images/${name}`, buffer, () =>
//       console.log("finished downloading!")
//     );
//   }
//   data
//     .filter((obj1) => clubsData.some((obj2) => obj1.node.id === obj2.node.id))
//     .forEach((obj) =>
//       Object.keys(obj.node.cover).forEach(async (key) => {
//         if (key === "alt") {
//           return;
//         }
//         if (!key) {
//           return;
//         }
//         try {
//           const imageUrl = obj.node.cover[key];
//           console.log(imageUrl);
//           const fileName = path.join(
//             folderPath,
//             obj.node.id + "." + key + ".jpg"
//           );
//           console.log(fileName);
//           await download(imageUrl, fileName);
//         } catch (err) {
//           console.error(`Error: ${err.message}`);
//           errorCount++;
//         }
//       })
//     );
//
//   const totalCount = savedCount + errorCount;
//   const savedPercent = (savedCount / totalCount) * 100;
//   const errorPercent = (errorCount / totalCount) * 100;
//
//   console.log(`Saved ${savedCount} images (${savedPercent.toFixed(2)}%)`);
//   console.log(`Encountered ${errorCount} errors (${errorPercent.toFixed(2)}%)`);
// }
async function img() {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  let savedCount = 0;
  let errorCount = 0;
  async function download(url, name) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFile(`${name}`, buffer, () => console.log("finished downloading!"));
  }

  for (const obj of data.filter((obj1) =>
    clubsData.some((obj2) => obj1.node.id === obj2.node.id)
  )) {
    const promises = [];
    for (const key of Object.keys(obj.node.cover)) {
      if (key === "alt") {
        continue;
      }
      if (!key) {
        continue;
      }
      try {
        const imageUrl = obj.node.cover[key];
        console.log(imageUrl);
        const fileName = path.join(
          folderPath,
          obj.node.id + "." + key + ".jpg"
        );
        console.log(fileName);
        promises.push(download(imageUrl, fileName));
        savedCount++;
      } catch (err) {
        console.error(`Error: ${err.message}`);
        errorCount++;
      }
    }
    await Promise.all(promises);
  }

  const totalCount = savedCount + errorCount;
  const savedPercent = (savedCount / totalCount) * 100;
  const errorPercent = (errorCount / totalCount) * 100;

  console.log(`Saved ${savedCount} images (${savedPercent.toFixed(2)}%)`);
  console.log(`Encountered ${errorCount} errors (${errorPercent.toFixed(2)}%)`);
}

img();
