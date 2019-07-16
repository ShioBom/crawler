let fs  = require('fs');
let path  = require('path');
let url = require('url')
let request = require('request');
class ImgDownload{
    constructor(){
        this.result = [];
        this.distPath = path.resolve(process.cwd(),'./dist');
        //process.cwd()返回 Node.js 进程的当前工作目录。
        if(!fs.existsSync(this.distPath)){

            //如果路径存在，则返回 true，否则返回 false。
            fs.mkdirSync(this.distPath)//同步地创建目录。
        }
        this.distPath2 = path.resolve(process.cwd(),'./dist/images')
        if(!fs.existsSync(this.distPath2)){

            //如果路径存在，则返回 true，否则返回 false。
            fs.mkdirSync(this.distPath2)//同步地创建目录。
        }
    }
    addData(args){
        this.result = [...this.result,...args];
        // console.log(this.result);
        setTimeout(() => {
            this.download();
        }, 5000);
    }
    saveImgToFile(res,buffer){
        const ImgFolder = path.resolve(this.distPath2,String((Number.parseInt(Math.random()*1000))));
        if(!fs.existsSync(ImgFolder)){
            fs.mkdirSync(ImgFolder);
        }
        const imgFileName = path.resolve(ImgFolder,path.basename(res.src))
        const descFileName = path.resolve(ImgFolder,'brief.txt');
        fs.writeFileSync(descFileName,res.desc);
        // fs.writeFileSync(imgFileName,buffer);
        request(res.src).pipe(fs.createWriteStream(imgFileName)) // 下载文件到本地
    }
    download(){
        const fetchImg = (urlList,index =0)=>{
            // console.log(urlList)
            const urlInfo = urlList[index];
            if(urlInfo){
                let urlpath = url.parse(urlInfo.src).href;
                // console.log(urlpath);
                return new Promise((resolve,reject)=>{
                    request(urlpath,(err,res,body)=>{
                        if(!err){
                            resolve(body);
                        }else{
                            console.log(err);
                        }
                    }).res
                }).then(res=>{
                    // console.log("res",res);
                    this.saveImgToFile(urlInfo, res);
                    return fetchImg(urlList,index+1);
                })
            }else{
                return Promise.resolve();
            }
        }
         return fetchImg(this.result.slice(0,3)).then(()=>{
                const imgListInfo = this.result.map(item=>{
                    return{
                        // id:item.id,
                        desc:item.desc,
                        filename:`./images/${item.mmId}/${path.basename(item.picUrl)}`
                    }
                })
                // console.log(imgListInfo);
                const jsonFileName = path.resolve(this.distPath,'data.json');
                fs.writeFileSync(jsonFileName,JSON.stringify(imgListInfo,null,2));
            })
    }
}
module.exports = ImgDownload