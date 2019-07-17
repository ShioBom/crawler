import React, { Component } from 'react'
import './index.css'
import axios from 'axios';
import ImageLayout from '../../tool/ImageLayout.js';

class Main extends React.Component {
    constructor() {
        super();
    }
    render() {
        return(
            <div className="main-body">111<img src='./images/0.gif'/></div>
        )
    }
    componentDidMount(){
        //发送请求,请求json文件数据
        axios.get("")
        //json文件数据里面保存了图片的宽高


        // let images = [];//存储图片数据的数组
        // const $box = document.getElementById("main-body");
        // let layout = new ImageLayout(images, $box.clientWidth,5,1.55);//每行放5张图片，图片标准宽高比为1.55
        // layout.completedImages.forEach(item => {
        // let $imageBox = document.createElement("div");
        // $imageBox.setAttribute("class", "img-box");
        // $imageBox.style.width = item.width + "px";
        // $imageBox.style.height = item.height + "px";
        // let $img = document.createElement("img");
        // $img.setAttribute("src", item.src);
        // $imageBox.appendChild($img);
        // $box.appendChild($imageBox);
    }
}
export default Main;