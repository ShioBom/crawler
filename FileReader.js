let fs = require('fs');
let path = require('path');

let arr = [];
var file = path.join(__dirname, 'data.json'); //文件路径，__dirname为当前运行js文件的目录
fs.readFile(file, 'utf-8', (err, data) => {
    if (!err) {
        let arr = JSON.parse(data);
    } else {
        console.log(err);
    }
})
export default arr;