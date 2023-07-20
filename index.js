const { request } = require("graphql-request");
const fs = require("fs");

const endpoint = "https://www.allsquaregolf.com/graph-api/v2/graphql";

const query = (after) => `query Clubs {
    clubs(after: ${after ? `"${after}"` : null}) {
        pageInfo {
            hasNextPage
            endCursor
            afterCount
        }
        edges {
            node {
                name
                content
                street
                zipcode
                city
                phone
                email
                website
                latitude
                longitude
                holes
                yearBuilt
                architect
                id
                country {
                    name
                    continent {
                        name
                    }
                }
                logo {
                    alt
                    original
                }
                cover {
                    original
                }
            }
        }
    }
}`;

async function main() {
  let after = null;
  let hasNextPage = true;
  let allData = [];

  while (hasNextPage) {
    const data = await request(endpoint, query(after));
    hasNextPage = false;
    allData.push(...data.clubs.edges);
    hasNextPage = data.clubs.pageInfo.hasNextPage;
    after = data.clubs.pageInfo.endCursor;
  }

  fs.writeFileSync("data.json", JSON.stringify(allData));
}

main();
