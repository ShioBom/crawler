const superagent = require('superagent');
// 引入所需要的第三方包
const cheerio = require('cheerio');
// let pageParsing = require('./pageParsing.js')
let urlProcessor = require("./UrlProcessor.js");
let ImgDownload = require("./donload.js");
class Crawler {
    constructor(SeedUrl) {
        this.MAX_CRAW_NUM = 100;
        this.MAX_MISSION_NUM = 6;
        this.SeedUrl = SeedUrl; //种子url
        this.promiseQueue = [];
        this.urls = []; //解析当前页面爬取到的url数据
        this.images = []; //当前页面爬取到的图片数据
        this.count = 0;
        this.startCrawl = this.startCrawl.bind(this);
        this.waitAllPromiseOver = this.waitAllPromiseOver.bind(this);
        this.ImgDownload = new ImgDownload();
        this.urlProcessor = new urlProcessor([SeedUrl])
    }
    getRunningPromise(){
        console.log(this.promiseQueue);
        return this.promiseQueue.filter(item => !!item);
    }
    async Crawl() {
        for (let i = 0; i < this.MAX_MISSION_NUM;i++) {
            if(this.promiseQueue[i]){
                console.log("continue");
                continue;
            }
            if (this.urlProcessor.hasUrl() && this.count <= this.MAX_CRAW_NUM) {
                let currentUrl = this.urlProcessor.getUrl();
                console.log("当前爬取:" + currentUrl)
                this.count++;
                this.promiseQueue[i] =await new Promise((resolve, reject) => {
                    superagent.get(currentUrl).end((err, res) => {
                        if (err) {
                            // 如果访问失败或者出错
                            console.log(`抓取失败 - ${err}`)
                        } else {
                            resolve(res);
                        }
                    })
                }).then(res => {
                    let Urls = [];
                    let images = [];
                    let $ = cheerio.load(res.text);
                    $('a').each((ind, ele) => {
                        let url = $(ele).attr('href')
                        Urls.push(url);
                    });
                    let urls = Urls.filter(item => /^https:\/\/acg12.com\/(\d+)\/$/.test(item) === true)
                    //爬取图片数据，包括描述，名称
                    $('img').each((idx, ele) => {
                        let img = {
                            src: $(ele).attr("src"),
                        }
                        images.push(img) 
                    });
                    //过滤图片数据
                    let imgs = images.filter((item) => item['src'].includes(`https://static.acg12.com/uploads/`) === true);
                    imgs.map(item => item['desc'] = $('h1.inn-singular__post__title').text());//抓取描述
                    this.images = [...new Set(imgs)];
                    this.urls = [...new Set(urls)];
                    this.urlProcessor.addUrl(this.urls);
                    this.ImgDownload.addData(this.images)
                }).then(() => {
                    this.promiseQueue[i] = null; //爬过的任务promise置为空。
                }, (err) => {
                    console.log(err);
                    this.promiseQueue[i] = null;
                });
            } else {
                break;
            }
        }
        
    }
    async startCrawl(){
        await this.Crawl();
        return this.waitAllPromiseOver();
    }
    async waitAllPromiseOver(){
        const promiseQueue = this.getRunningPromise();
        // console.log(promiseQueue);
        if(promiseQueue.length){
          return await Promise.all(promiseQueue).then(this.waitAllPromiseOver);
        }else{
          //所有页面解析结束，开始下载
          this.ImgDownload.download();
        }
    }
}

module.exports = Crawler