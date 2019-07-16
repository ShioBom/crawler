/**
 * @description 图片横向瀑布流布局，最大限度保证每张图片完整显示
 * @class ImageLayout
 */
class ImageLayout {
    constructor(images, containerWidth, numberLine = 2, stdRatio) {
      //图片列表
      this.images = JSON.parse(JSON.stringify(images));
      //布局完毕的图片列表
      this.completedImages = [];
      //容器宽度
      this.containerWidth = containerWidth;
      //单行显示的图片数量
      this.numberLine = numberLine;
      //图片标准宽高比
      this.stdRatio = stdRatio;
      //图片撑满整行时标准宽度
      this.stdHeight = this.containerWidth / this.stdRatio;
      this.blockAndLayout();
    }
    /**
     * @description 完整显示这张图片
     * @param {*} image
     * @memberof ImageLayout
     */
    showFullImage(image) {
      console.log(image);
      let ratio = image.width / image.height;
      console.log("ratio", ratio);
      image.height = parseInt(this.containerWidth / ratio);
      image.width = this.containerWidth;
      this.completedImages.push(image);
      console.log(this.completedImages);
    }
  
    /**
     * @description 将图片数量根据单行数量分块并开始计算布局
     * @returns
     * @memberof ImageLayout
     */
  
    blockAndLayout() {
      let images = JSON.parse(JSON.stringify(this.images));
      //当图片只有一张时，完整显示这张图片
      if (images.length === 1) {
        this.showFullImage(this.images[0]);
        return;
      }
      let temp = [];
      for (let i = 0; i < images.length; i++) {
        temp.push(images[i]);
        //当已经是最后一张图片时或当单行图片达到限制数量时
        if ((i + 1) % this.numberLine === 0 || i === images.length - 1) {
          //计算每行的布局
          this.computedImagesLayout(temp);
          //清除上一行已经计算过布局的图片
          temp = [];
        }
      }
    }
    /**
     *
     * @description 根据分组计算每一行图片的布局
     * @param {*} images 每一行的图片数组
     * @memberof ImageLayout
     */
    computedImagesLayout(images) {
      images = JSON.parse(JSON.stringify(images));
      if (images.length === 1) {
        //当分组只有一张图片时
        this.layoutSingleImage(images[0]);
      } else {
        //当分组中有多张图片时
        this.layoutMultipleImages(images);
      }
    }
    /**
     * @description 分组中只有一张图片时，图片的显示
     * @param {*} image
     * @memberof ImageLayout
     */
    layoutSingleImage(image) {
      let ratio = image.width / image.height;
      image.height = this.stdHeight;
      image.width = image.height * ratio;
      this.completedImages.push(image);
    }
    /**
     * @description 分组中有多张图片时候的布局
     * @param {*} images
     * @memberof ImageLayout
     */
    layoutMultipleImages(images) {
      let pictures = JSON.parse(JSON.stringify(images));
      let relateWidths = []; //保存每张图的相对宽度
      let ratios = []; //保存每张图片的宽高比
      pictures.forEach(item => {
        //计算每张图的宽高比
        let ratio = item.width / item.height;
        //根据标准高度计算相对宽度
        let relateWidth = this.stdHeight * ratio;
        relateWidths.push(relateWidth);
        ratios.push(ratio);
      });
      //计算每张图相对宽度的总和
      let totolWidth = relateWidths.reduce((sum, item) => sum+item,0);
      let lineHeight = 0; //行高
      let restWidth = this.containerWidth; //容器剩余宽度，最初等于容器宽度
      pictures.forEach((item, i) => {
        if (i === 0) {
          //根据相对宽度与总宽度的比值计算第一张图片在容器中的实际宽高
          item.width = parseInt(
            this.containerWidth * (relateWidths[0] / totolWidth)
          );
          item.height = lineHeight = parseInt(item.width / ratios[0]);
          //计算第一张布局后的剩余宽度
          restWidth = restWidth - item.width;
        } else if (i === pictures.length - 1) {
          //计算每组中最后一张图片在容器的宽度，宽度为容器剩余宽度。
          item.width = restWidth;
          item.height = lineHeight;
        } else {
          //计算中间图片在容器中的实际宽高
          item.height = lineHeight;
          item.width = parseInt(item.height * ratios[i]);
          restWidth -= item.width;
        }
        this.completedImages.push(item);
      });
    }
  }
  export default ImageLayout;
  