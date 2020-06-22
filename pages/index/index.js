//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},//动画
    huabaoImage1: '../../images/dlrb.png',//画报图片
    huabaoImage2: '',//画报图片
    huabaoImage3: '',//画报图片
    huabaoImage4: '',//画报图片
    // 测试的图片地址,hb1.jpg
    testURL: '',
    // 第一张图片的宽
    firstimgW: '',
    // 第一张图片的高
    firstimgH: '',
    // 第二张图片的宽
    twoimgW: '',
    // 第二张图片的高
    twoimgH: '',
    // 第三张图片的宽
    threeimgW: '',
    // 第三张图片的高
    threeimgH: '',
    // 第四张图片的宽
    fourimgW: '',
    // 第四张图片的高
    fourimgH: '',
    huabaoText:'哈喽，我是迪丽热巴的忠实fans',//测试画报上显示的文字
    huabaoZhuTi:'明星',//测试的主题标签
    huabaoBiaoQian:["热巴粉丝","明星追踪","美图"],//测试的标签数组数据
    isshow: false,
    // 控制画布显示
    canvasShow: false,
    url: '',//此url是画布绘制完后生成的图片路径
    shareCanvasItem: {
      Height: 5000
    },//初始canvas高度，设置背景黑，此高度必须大于 动态生成内容高度，否则 无法全面覆盖背景
  },

  // 点击生成canvas，显示生成的画报图片
  showModal: function () {
    var that = this;
    that.setData({
      hideModal: false,
    })
    // 调用画报生成图片
    that.share0();
  },
  // 退出海报界面
  hideModal: function () {
    var that = this;
      that.setData({
        hideModal: true
      });
  },

  /* Canvas画报上的图片不能为网络地址，需要以下方式将图片地址转为临时文件路径 */
  /* 本次我们使用的是本地图片，所以不需要此方法 */
  getImagetempFilePath(){
    wx.downloadFile({
      // 第一张图片
      url: that.data.list[0].PVList[0],//试例，
      success(res) {
        console.log("输出下载本地的图片", res.tempFilePath);
        that.setData({
          huabaoImage1: res.tempFilePath //试例，
        })
      }
    });
  },
  /* 第二、三、四图片如上..... */

  /** 获取要绘制在画布上的图片的真实宽高 */
  // 获取第一张图片的高度
  imgWH(e) {
    var width = e.detail.width;
    var height = e.detail.height;
    console.log('第一张图width:', width)
    console.log('第一张图height:', height)
    this.setData({
      firstimgW: width,
      firstimgH: height
    })
  },
  /* 第二、三、四图片如上..... */

  /** 画报绘制事件 */
  share0: function (e) {
    var that = this
    var self = this;
    var res = wx.getSystemInfoSync();
    console.log("获取系统信息", res)
    var canvasWidth = res.windowWidth;
    var canvasHeight = self.data.shareCanvasItem.Height;
    // 获取canvas的的宽  自适应宽（设备宽/750) px
    var Rpx = (canvasWidth / 750).toFixed(2);
    //上边距
    var paddingTop = Rpx * 20;
    //左边距
    var paddingLeft = Rpx * 20;
    //右边距
    var paddingRight = Rpx * 20;
    //当前编写高，距离画布顶部的距离
    var currentLineHeight = Rpx * 40;//currentLineHeight决定画布的最终高度

    // 获取画布的实体对象
    var context = wx.createCanvasContext('shareCanvas');

    //画布全局背景颜色默认填充
    context.setFillStyle('#FFFFFF');
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    // 第二张图片宽高比列ratio，防止在拉伸的时候图变形
    var ratio2 = that.data.twoimgW / that.data.twoimgH;
    // 第三张图片宽高比列ratio，防止在拉伸的时候图变形
    var ratio3 = that.data.threeimgW / that.data.threeimgH;
    // 第四张图片宽高比列ratio，防止在拉伸的时候图变形
    var ratio4 = that.data.fourimgW / that.data.fourimgH;

    // 脏脏写的画布 布局 begin
    var oneImgW = Rpx * 750 - Rpx * 30 - Rpx * 30 - Rpx * that.data.firstimgW
    var frist_img_W = Rpx * that.data.firstimgW + oneImgW;//第一张图片的宽
    // 第一张图片宽高比列ratio，防止在拉伸的时候图变形
    var ratio = that.data.firstimgW / that.data.firstimgH;

    // context.drawImage绘制图片，方法详情参见官方文档
    context.drawImage(that.data.huabaoImage1, Rpx * 30, Rpx * 30, Rpx * that.data.firstimgW + oneImgW, (Rpx * that.data.firstimgW + oneImgW) / ratio);

    // 没次绘制完一个元素后记得加上该元素的高度
    // 画布高度 += 绘制元素高度
    currentLineHeight += (Rpx * that.data.firstimgW + oneImgW) / ratio;

    // 以下情况按照实际开发
    if (3 == '三张图的时候') {
      //只有三张图
      context.drawImage(that.data.huabaoImage2, Rpx * 30, currentLineHeight, (frist_img_W) / 2 - Rpx * 10, (frist_img_W) / 2);
      context.drawImage(that.data.huabaoImage3, (frist_img_W) / 2 + Rpx * 30, currentLineHeight, (frist_img_W) / 2, (frist_img_W) / 2);
      // 当前画布的高累加
      currentLineHeight += (frist_img_W) / 2;
    } else if (4 == '四张图的时候') {
      //只有四张图
      context.drawImage(that.data.huabaoImage2, 100, 100, ((frist_img_W) / 3 - Rpx * 10), (((frist_img_W) / 3 - Rpx * 10)) / ratio2, Rpx * 30, currentLineHeight, (frist_img_W) / 3 - Rpx * 10, (frist_img_W) / 3 - Rpx * 10);

      context.drawImage(that.data.huabaoImage3, 0, 0, (frist_img_W) / 3, ((frist_img_W) / 3) / ratio3, (frist_img_W) / 3 + Rpx * 35, currentLineHeight, (frist_img_W) / 3 - Rpx * 10, (frist_img_W) / 3 - Rpx * 10);

      context.drawImage(that.data.huabaoImage4, 0, that.data.fourimgH / 3, (frist_img_W) / 3 - Rpx * 10, ((frist_img_W) / 3 - Rpx * 10) / ratio4, (frist_img_W) / 3 + Rpx * 40 + (frist_img_W) / 3, currentLineHeight, (frist_img_W) / 3 - Rpx * 10, (frist_img_W) / 3 - Rpx * 10);
      // 当前画布的高累加
      currentLineHeight += (frist_img_W) / 3;
    } else if (2 == that.data.huabaoImageLength) {
      //只有两张图
      context.drawImage(that.data.huabaoImage2, Rpx * 30, currentLineHeight, (frist_img_W), (frist_img_W) / ratio2);
      // 当前画布的高累加
      currentLineHeight += (frist_img_W) / ratio2;
    }


    // 绘制圆角矩形，方法在../../utils/canvasUtil.js文件中
    var rectColor = '#E4F4FB';//矩形的颜色
    that.drawRoundedRect3(context, Rpx * 30, currentLineHeight + Rpx * 20, Rpx * 67, Rpx * 40, 4, true, rectColor);
    // 绘制文字
    context.setFontSize(14)
    context.setFillStyle('#4A87B1')
    context.fillText("精华", Rpx * 40, currentLineHeight + Rpx * 50)


    // 绘制文字，及换行计算；文本大于画布宽度，则换行
    context.setFontSize(15)
    context.setFillStyle('#333333')//文字颜色：默认黑色
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    var ctx = context;
    var str = "          "  + that.data.huabaoText;
    var leftWidth = Rpx * 30;//文字距离左边的距离（100里面包括Rpx * 30）
    var initHeight = currentLineHeight + Rpx * 50;
    var titleHeight = Rpx * 566;
    var canvasWidth = frist_img_W - leftWidth + Rpx * 20;

    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); 
        //绘制截取部分
        initHeight += 22; //22为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
        currentLineHeight += 22// 没换一行，画布高度累加
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }

    }

    // 画布高度累加
    currentLineHeight += Rpx * 100

    // 主题标签（绘制圆角矩形）
    var themeColor = '#3DABF5';
    that.drawRoundedRect3(context, Rpx * 30, currentLineHeight - Rpx * 10, context.measureText(that.data.huabaoZhuTi).width + Rpx * 19, Rpx * 40, 4, true,themeColor);

    context.setFillStyle('#FFFFFF')
    context.setFontSize(14)
    context.fillText(that.data.huabaoZhuTi, Rpx * 41, currentLineHeight + Rpx * 20);

    // 画布高度累加
    currentLineHeight += Rpx * 90

    // 标签列表（这里是循环添加即数组集合）
    if (that.data.huabaoBiaoQian == "" || that.data.huabaoBiaoQian == " ") {
      currentLineHeight -= Rpx * 30//如果数组为空，则画布上移
    } else {
      var leftDistance = Rpx * 30;
      var biaoqiancolor1 = '#F4F8FA';//矩形背景颜色
      var biaoqiancolor11 = '#FFFFFF';//文字颜色
      that.data.huabaoBiaoQian.forEach((item, index) => {
        if (item == "" || item == " ") {
          // 如果标签内容为空
          that.drawRoundedRect3(context, leftDistance, currentLineHeight - Rpx * 30, Rpx * 0, Rpx * 0, 4, true, biaoqiancolor11);
        } else {
          that.drawRoundedRect3(context, leftDistance, currentLineHeight - Rpx * 30, context.measureText('#' + item).width + Rpx * 27, Rpx * 40, 4, true, biaoqiancolor1);
          context.setFillStyle('#8A98A0')
          context.setFontSize(14)
          context.fillText('#' + item, leftDistance + Rpx * 10, currentLineHeight);
        }
        leftDistance += context.measureText('#' + item).width + Rpx * 60;
        //context.measureText(item.chName).width //算出当前字符串的长度
      })
      currentLineHeight += Rpx * 30
    }


    // 海报生成地址坐标
    var jinghuaColor1 = '#F4F8FA';
    that.drawRoundedRect3(context, Rpx * 30, currentLineHeight, context.measureText('中国').width + Rpx * 41, Rpx * 40, 4, true, jinghuaColor1);

    context.drawImage('../../images/coordinate.png', Rpx * 36, currentLineHeight + Rpx * 8, Rpx * 27, Rpx * 27)
    context.setFillStyle('#8998A0')
    context.setFontSize(12)
    context.fillText('中国', Rpx * 66, currentLineHeight + Rpx * 30);

    // 画布高度追加
    currentLineHeight += Rpx * 70

    // 二维码设置
    // 背景
    ctx.setFillStyle('#F9F9F9')
    context.fillRect(Rpx * 30, currentLineHeight, frist_img_W, Rpx * 150)
    // 添加小程序二维码
    context.drawImage('/images/looktv.jpg', Rpx * 40, currentLineHeight + Rpx * 13, Rpx * 120, Rpx * 120)

    context.fillStyle = "#333333";
    context.setFontSize(14)
    context.fillText('长按识别小程序码查看详情', Rpx * 190, currentLineHeight + Rpx * 70)

    context.setFontSize(11)
    context.fillStyle = "#888888";
    context.fillText('今天你的操作下饭了吗', Rpx * 190, currentLineHeight + Rpx * 110)
    // 脏脏--end
    //内容行高控制
    currentLineHeight += Rpx * 200;
    console.log("最终canvas的高度:", currentLineHeight)
    //设置最终canvas高度
    self.setData({
      shareCanvasItem: {
        Height: currentLineHeight,
      },
    });
    that.setData({
      hideModal: false
    });
    context.draw();//开始绘制成图片
    that.saveImg();//调用图片生成方法
  },
  // 图片生成方法
  saveImg: function () {
    var that = this;
    wx.showLoading({
      title: '生成中',
    })
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        fileType: 'jpg',
        success: function (res) {
          wx.hideLoading()
          // console.log("canvasToTempFilePath图片地址：", res.tempFilePath)
          console.log("canvasToTempFilePath图片地址：", res)
          // this.data.url = res.tempFilePath;
          that.setData({
            url: res.tempFilePath,
            // canvasShow: true,
            hideModal: false
          })
          that.saveImge();
          //跳转公共查看canvas图片页面
          // wx.navigateTo({
          //   url: `/pages/commonShare/commonShare?url=${res.tempFilePath}`
          // })
          // return res.tempFilePath;
        }
      })
    }, 1000);
  },
  // js 点击预览图片
  previewImg() {
    wx.previewImage({
      urls: [this.data.url],
    })
  },
  // 保存海报图片
  saveImge() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.url, 
      success(res) {
        console.log("success");
        wx.showToast({
          title: '海报保存成功',
          icon: 'none',
          duration: 1500,
          mask: true,
          success: function () {
          }
        })
        setTimeout(function () {
          wx.showToast({
            title: '点击屏幕返回',
            image: '../../images/djpm.png',
            duration: 1500,
            mask: true
          })
        }, 1500)
      },
      fail: function (res) {
        console.log("哈哈哈哈哈", res);
      }
    })
  },
  // 获取第一张图片的高度
  imgWH(e) {
    var width = e.detail.width;
    var height = e.detail.height;
    console.log('第一张图width:', width)
    console.log('第一张图height:', height)
    this.setData({
      firstimgW: width,
      firstimgH: height
    })
  },
  // 获取第二张图片的高度
  imgWH2(e) {
    var width = e.detail.width;
    var height = e.detail.height;
    console.log('第二张图width:', width)
    console.log('第二张图height:', height)
    this.setData({
      twoimgW: width,
      twoimgH: height
    })
  },
  // 获取第三张图片的高度
  imgWH3(e) {
    var width = e.detail.width;
    var height = e.detail.height;
    console.log('第三张图width:', width)
    console.log('第三张图height:', height)
    this.setData({
      threeimgW: width,
      threeimgH: height
    })
  },
  // 获取第四张图片的高度
  imgWH4(e) {
    var width = e.detail.width;
    var height = e.detail.height;
    console.log('第四张图width:', width)
    console.log('第四张图height:', height)
    this.setData({
      fourimgW: width,
      fourimgH: height
    })
  },
  onLoad: function () {


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

  },

  share() {

    //获取相册授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
            }
          })
        }
      }
    })

    var that = this;
    wx.showLoading({
      title: '保存中...',
      mask: true
    });
    wx.saveImageToPhotosAlbum({
      filePath: that.data.url,
      success: function (res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.hideLoading()
        console.log(res)
      }
    })
  },

  //文本换行 参数：1、canvas对象，2、文本 3、距离左侧的距离 4、距离顶部的距离 (5、6)文本显示的宽度
  drawText1: function (ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 22; //22为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    console.log("自动换行的值，", titleHeight)
    return titleHeight

  },
  /**
   * 绘制圆角矩形
   * @param {*} ctx CanvasContext
   * @param {*} x x轴 坐标
   * @param {*} y y轴 坐标
   * @param {*} width 宽
   * @param {*} height 高
   * @param {*} r r 圆角
   * @param {boolean} fill 是否填充颜色
   * @color 要填充的背景颜色
   */
  drawRoundedRect3(ctx, x, y, width, height, r, fill, color) {
    ctx.beginPath();
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 3 / 2);
    ctx.lineTo(width - r + x, y);
    ctx.arc(width - r + x, r + y, r, Math.PI * 3 / 2, Math.PI * 2);
    ctx.lineTo(width + x, height + y - r);
    ctx.arc(width - r + x, height - r + y, r, 0, Math.PI * 1 / 2);
    ctx.lineTo(r + x, height + y);
    ctx.arc(r + x, height - r + y, r, Math.PI * 1 / 2, Math.PI);
    ctx.closePath();
    if (fill) {
      ctx.setFillStyle(color);
      ctx.fill();
    }

  },
  /**
   * canvas 文本换行计算
   * @param {*} context CanvasContext
   * @param {string} text 文本
   * @param {number} width 内容宽度
   * @param {font} font 字体（字体大小会影响宽）
   */
  breakLinesForCanvas(context, text, width, font) {
    function findBreakPoint(text, width, context) {
      var min = 0;
      var max = text.length - 1;
      while (min <= max) {
        var middle = Math.floor((min + max) / 2);
        var middleWidth = context.measureText(text.substr(0, middle)).width;
        var oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width;
        if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
          return middle;
        }
        if (middleWidth < width) {
          min = middle + 1;
        } else {
          max = middle - 1;
        }
      }
      return -1;
    }
    var result = [];
    if (font) {
      context.font = font;
    }
    var textArray = text.split('\r\n');
    for (let i = 0; i < textArray.length; i++) {
      let item = textArray[i];
      var breakPoint = 0;
      while ((breakPoint = findBreakPoint(item, width, context)) !== -1) {
        result.push(item.substr(0, breakPoint));
        item = item.substr(breakPoint);
      }
      if (item) {
        result.push(item);
      }
    }
    return result;
  }
})
