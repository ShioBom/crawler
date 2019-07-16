require('babel-register');
require('babel-polyfill');

let Crawler = require("./crawler.js")

let SeedUrl = "https://acg12.com/192604/";
new Crawler(SeedUrl).startCrawl()


