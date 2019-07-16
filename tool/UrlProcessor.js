class UrlProcessor {
    constructor(SeedUrl) {
        this.waitUrl = [...SeedUrl]; //存储要爬取的路径
        this.crawledUrl = []; //存储已经爬取的路径
    }
    hasUrl() {
        return this.waitUrl.length > 0;
    }
    isCrawed(url) {
        return this.crawledUrl.indexOf(url);
    }
    addUrl(urlList) {
        //过滤掉已经爬取过的路径
        let newUrl = urlList.filter(item => this.crawledUrl.indexOf(item) == -1)
        this.waitUrl = [...newUrl, ...this.waitUrl];
    }
    getUrl() {
        let url = this.waitUrl.pop();
        this.crawledUrl.push(url);
        return url;
    }
}
module.exports = UrlProcessor;