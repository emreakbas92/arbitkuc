const express = require('express');
const https = require('https');
const app = express();
const tokens = [
  { symbol: "ZBC-USDT", contract: "ZBC" },
  { symbol: "SLCL-USDT", contract: "SLCL" },
  { symbol: "PLD-USDT", contract: "PLD" },
  { symbol: "GST-USDT", contract: "GST" },
  { symbol: "HAWK-USDT", contract: "HAWK" },
  { symbol: "GMT-USDT", contract: "GMT" },
  { symbol: "RACEFI-USDT", contract: "RACEFI" },
  { symbol: "GARI-USDT", contract: "GARI" },
  { symbol: "SLIM-USDT", contract: "SLIM" },
  { symbol: "SRM-USDT", contract: "SRM" },
  { symbol: "HBB-USDT", contract: "HBB" },
  { symbol: "FCON-USDT", contract: "FCON" },
  { symbol: "FIDA-USDT", contract: "FIDA" },
  { symbol: "LIKE-USDT", contract: "LIKE" },
  { symbol: "AURY-USDT", contract: "AURY" },
  { symbol: "XTAG-USDT", contract: "XTAG" },
  { symbol: "CWAR-USDT", contract: "CWAR" },
  { symbol: "SHILL-USDT", contract: "SHILL" },
  { symbol: "SOLR-USDT", contract: "SOLR" },
  { symbol: "SONUSDT", contract: "0x3b0E967cE7712EC68131A809dB4f78ce9490e779-bsc" },
  { symbol: "STRMUSDT", contract: "0xC598275452fA319d75ee5f176FD3B8384925b425-bsc" },
  { symbol: "SLGUSDT", contract: "0x2348b010Fa9c0Ce30Bb042D54c298a3411361a01-bsc" },
  { symbol: "STGUSDT", contract: "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b-bsc" },
  { symbol: "PRIMALUSDT", contract: "0xCb5327Ed4649548e0d73E70b633cdfd99aF6Da87-bsc" },
  { symbol: "LGXUSDT", contract: "0x9096B4309224d751FCB43d7eB178dcFFc122aD15-bsc" },
  { symbol: "LFWUSDT", contract: "0xD71239a33C8542Bd42130c1B4ACA0673B4e4f48B-bsc" },
  { symbol: "COUSDT", contract: "0x936B6659Ad0C1b244Ba8Efe639092acae30dc8d6-bsc" },  
  { symbol: "TIMEUSDT", contract: " 0x3b198e26E473b8faB2085b37978e36c9DE5D7f68-bsc" }, 
  { symbol: "ORTUSDT", contract: " 0x9E711221B34A2d4B8F552BD5f4A6C4e7934920f7-bsc" }, 
  { symbol: "QMALLUSDT", contract: "0x07e551E31A793E20dc18494ff6b03095A8F8Ee36-bsc" },
  { symbol: "AZYUSDT", contract: "0x7b665B2F633d9363b89A98b094B1F9E732Bd8F86-bsc" },
  { symbol: "DEFYUSDT", contract: "0xBF9f916bBda29A7F990F5F55c7607D94D7C3A60b-polygon" },
  { symbol: "COTUSDT", contract: "0x8d520c8E66091cfD6743fe37Fbe3A09505616C4b-polygon" },
  { symbol: "MVUSDT", contract: "0xA3c322Ad15218fBFAEd26bA7f616249f7705D945-polygon" },
  { symbol: "NXDUSDT", contract: "0x228b5C21ac00155cf62c57bcc704c0dA8187950b-polygon" },
  { symbol: "KASTAUSDT", contract: "0x235737dBb56e8517391473f7c964DB31fA6ef280-polygon" },
  { symbol: "GENEUSDT", contract: "GENE" },
  { symbol: "ZBCUSDT", contract: "ZBC" },
  { symbol: "REALUSDT", contract: "REAL" },
  { symbol: "GMTUSDT", contract: "GMT" },
  { symbol: "FIDAUSDT", contract: "FIDA" },
  { symbol: "MBSUSDT", contract: "MBS" },
  { symbol: "1SOLUSDT", contract: "1SOL" },
  { symbol: "GSTUSDT", contract: "GST" },
  { symbol: "SHILLUSDT", contract: "SHILL" },
  { symbol: "CWARUSDT", contract: "CWAR" },
  { symbol: "DFLUSDT", contract: "DFL" },
  { symbol: "XAVAUSDT", contract: "0xd1c3f94DE7e5B45fa4eDBBA472491a9f4B166FC4-avalanche" },
  { symbol: "CRAFTUSDT", contract: "0x8aE8be25C23833e0A01Aa200403e826F611f9CD2-avalanche" },
  { symbol: "IMEIUSDT", contract: "0xF891214fdcF9cDaa5fdC42369eE4F27F226AdaD6-avalanche" },
  { symbol: "GMXUSDT", contract: "0x62edc0692BD897D2295872a9FFCac5425011c661-avalanche" },
  { symbol: "OBXUSDT", contract: "0xcCf719c44e2C36E919335692E89d22Cf13D6aaEB-avalanche" },
  { symbol: "XETAUSDT", contract: "0x31c994AC062C1970C086260Bc61babB708643fAc-avalanche" }
];

let al, sat;
setInterval(() => {
  tokens.forEach((token) => {
    // Get the ask and bid prices for the token from Huobi
    https.get(`https://api.kucoin.com/api/v1/market/stats?symbol=${token.symbol}`, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if(!json.data || !json.data.buy || !json.data.sell) return;
          const ask = json.data.sell;
          const bid = json.data.buy;

          // Get the price of the token on the BSC network from Dex.guru
          https.get(`https://api.dex.guru/v1/tokens/${token.contract}`, (res) => {
            let data = "";
            res.on("data", (chunk) => {
              data += chunk;
            });
            res.on("end", () => {
              try {
                const json = JSON.parse(data);
                let price = json.priceUSD;
                // Get the price of the token on the BSC network from Jup.ag
                https.get(`https://price.jup.ag/v1/price?id=${token.contract}`, (res) => {
                  let data = "";
                  res.on("data", (chunk) => {
                    data += chunk;
                  });
                  res.on("end", () => {
                    try {
                      const json = JSON.parse(data);
                      let jupPrice = json.data.price;
                      // Calculate the ratio of the Huobi ask price to the BSC price
                      token.al_dex = price / bid;
                      token.al_jup = jupPrice / bid;
                      token.sat_dex = price / ask;
                      token.sat_jup = jupPrice / ask;
                      console.log(token);
                    } catch (err) {
                      console.log("Error: " + err.message);
                    }
                  });
                }).on("error", (err) => {
                  console.log("Error: " + err.message);
                });
              } catch (err) {
                console.log("Error: " + err.message);
              }
            });
        }).on("error", (err) => {
          console.log("Error: " + err.message);
        });
      } catch (err) {
        console.log("Error: " + err.message);
      }
    });
  }).on("error", (err) => {
  console.log("Error: " + err.message);
});
});
}, 30000);


app.get("/", (req, res) => {
  res.send(`
    <h1>Token List</h1>
    <table>
      <tr>
        <th>Symbol</th>
        <th>Contract Address</th>
        <th>BSC/Bybit Bid Ratio</th>
        <th>Bybit/BSC Ask Ratio</th>
        <th>Jup/Bybit Ask Ratio</th>
        <th>Bybit/Jup Ask Ratio</th>
      </tr>
      ${tokens.map(token => {
        if (token.al_dex < 0.98 || token.sat_dex > 1.02 || token.sat_jup > 1.01 || token.al_jup < 0.99) {
          return `
            <tr>
              <td>${token.symbol}</td>
              <td>${token.contract}</td>
              <td>${token.al_dex < 0.99 ? token.al_dex : ''}</td>
              <td>${token.sat_dex > 1.00 ? token.sat_dex : ''}</td>
              <td>${token.al_jup < 0.99 ? token.al_jup : ''}</td>
              <td>${token.sat_jup > 1.00 ? token.sat_jup : ''}</td>
            </tr>
          `;
        }
        return '';
      }).join('')}
    </table>
  `);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

