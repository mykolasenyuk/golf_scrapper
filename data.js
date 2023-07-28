const fs = require("fs");

const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

const clubs = data.map((el) => {
  const club = `(${el.node.id},'${
    el.node.name ? el.node.name.replace(/'/g, "`") : null
  }','${
    el.node.content
      ? el.node.content.replace(/\n/g, " ").replace(/'/g, "")
      : null
  }',
      '${el.node.street ? el.node.street.replace(/'/g, "`") : null} ${
    el.node.zipcode ? el.node.zipcode : null
  } ${el.node.country.name ? el.node.country.name : null}','${
    el.node.phone ? el.node.phone : null
  }','${el.node.website ? el.node.website : null}', ${
    el.node.latitude ? el.node.latitude : null
  }, ${el.node.longitude ? el.node.longitude : null}, ${
    el.node.holes ? el.node.holes : null
  },'${el.node.city ? el.node.city.replace(/'/g, "`") : null}')`;
  // console.log(club);
  return club;
});

const sql = `INSERT INTO Clubs (id,name, description, address,phone1, site, gpsLat, gpsLon, holes, city) VALUES `;

const dataString = clubs.map((item) => `${item}`).join(",");
const finalString =
  sql +
  dataString.replace(/\n/g, " ").replace(/(?<=\w)'(?=\w)|''/g, (match) => {
    if (match === "''") {
      return "";
    } else {
      return "`";
    }
  });
// console.log(finalString);
// console.log(sql + dataString);

fs.writeFileSync("string.txt", JSON.stringify(finalString));
