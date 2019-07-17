let fs = require('fs');
let path = require('path');
let request = require('request');
class ImgDownload {
    constructor() {
        this.result = [];
        this.distPath = path.resolve(process.cwd(), './public');
        //process.cwd()返回 Node.js 进程的当前工作目录。
        if (!fs.existsSync(this.distPath)) {
            //如果路径存在，则返回 true，否则返回 false。
            fs.mkdirSync(this.distPath) //同步地创建目录。
        }
        this.distPath2 = path.resolve(process.cwd(), './public/images')
        if (!fs.existsSync(this.distPath2)) {
            //如果路径存在，则返回 true，否则返回 false。
            fs.mkdirSync(this.distPath2) //同步地创建目录。
        }
    }
    delRepeat() {
        let hash={};
        return this.result.reduce(function(item, next) {
            hash[next.src] ? '' : hash[next.src] = true && item.push(next);
            return item
        }, [])
    }
    addData(args) {
        this.result = [...this.result, ...args];
        // this.download()
    }
    async saveImgToFile(res,index) {
        const ImgFolder = path.resolve(this.distPath2,String("img"+index));
        if (!fs.existsSync(ImgFolder)) {
            fs.mkdirSync(ImgFolder);
        }
        //${path.basename(res.src).split(".")[1]}
        const imgFileName = path.resolve(ImgFolder, `${index}.gif`)
        const descFileName = path.resolve(ImgFolder, 'brief.txt');
        fs.writeFileSync(descFileName, res.desc);
        request.get({url:res.src,encoding:null}).pipe( await fs.createWriteStream(imgFileName))
    }
    download() {
        const downImg = async (urlList, index = 0) => {
            if (index >= urlList.length && index>=100) {
                return;
            };
            const urlInfo = urlList[index];
            if (urlInfo) {
                await this.saveImgToFile(urlInfo,index);
                return downImg(urlList, index + 1);
            }
        }
        const imgListInfo = this.result.map((item,ind) => {
            return {
                // id:item.id,
                desc: item.desc,
                filename: `./images/img${ind}/${path.basename(item.src)}`
            }
        })
        const jsonFileName = path.resolve(this.distPath, '../static/data.json');
        fs.writeFileSync(jsonFileName, JSON.stringify(imgListInfo, null, 2));
        downImg(this.delRepeat());
    }
}
module.exports = ImgDownload