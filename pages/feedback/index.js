/* 
1.点击 “+” 触发tap点击事件
  a.调用小程序内部的选择图片的api
  b.获取到这些图片的路径
  c.把这些图片路径存入data的一个变量中
  d.页面可以根据 图片数组 进行循环显示
2.点击 自定义图片 组件
  a. 获取被点击元素索引
  b.获取data中图片数组
  c.根据索引 数组中删除对应元素
3.当用户点击提交按钮
  a.获取文本域内容
    data定义变量 表示输入框内容
    文本域绑定输入事件 事件触发时 把输入框的值存入到变量中
  b.对这些内容 进行合法性验证
  c.验证通过 用户选择的图片 上传到专门的图片服务器 返回图片外网的链接
    遍历图片数组
    挨个上传
    自己再维护  存放 图片上传后的外网的链接
  d.文本域和外网的图片的路径 一起提交给服务器  ...
  e.清空当前页面
  f.返回上一页*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品、商家投诉",
        isActive:false
      },
    ],
    //被选中的图片路径数组
    chooseImgs:[],
    //文本域内容
    textVal:""
  },
  //外网图片的路径数组
  UpLoadImgs:[],
  handleTabsItemChange(e){
    // 1.获取被点击的标题索引
    // console.log(e);
    const index =e.detail.index.index;
    //2.修改原数组
    let tabs = this.data.tabs;
    // console.log(tabs);
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    // console.log(tabs);
    //3.赋值
    this.setData({
      tabs
    })
  },
  //点击加号选择图片事件
  handleChooseImg(){
    //选择图片api
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          //图片数组进行拼接
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
      }
    });
      
  },
  //点击自定义组件删除图片
  handleDeleteImg(e){
    const {index} = e.currentTarget.dataset;
    let chooseImgs = this.data.chooseImgs;
    chooseImgs.splice(index,1);
    this.setData({chooseImgs})
  },
  //文本域输入按钮
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  //点击提交按钮
  handleFormSubmit(){
    const {textVal,chooseImgs} = this.data;
    //合法性验证
    if(!textVal.trim()){
      //不合法
      wx.showToast({
        title: '输入信息不合法，请重新输入！',
        icon: 'none',
        mask: true,
      });
    }
    //上传图片到专门服务器

    //上传图片api不支持多个文件同时上传  遍历数组 挨个上传
    //显示正在等待图标
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });
    //判断有没有要上传的图片数组
    if(chooseImgs.length!=0){
      chooseImgs.forEach((v,i)=>{
      wx.uploadFile({
        //图片上传路径
        url: 'https://img.coolcr.cn/api/upload',
        //被上传文件路径
        filePath: v,
        //上传文件名称 后台获取文件 file
        name: "image",
        //顺带文本信息
        formData: {},
        success: (result)=>{
          // console.log(result);
          // console.log(result.data);
          let url = JSON.parse(result.data).data.url;
          // console.log(url);
          this.UpLoadImgs.push(url);
          //所有的图片都上传完毕了 才触发
          if(i===chooseImgs.length-1){
            console.log("把文本的内容和外网的图片数组 提交到后台中");
            wx.hideLoading();
            wx.showToast({
              title: '反馈成功',
              icon: 'success',
              mask: true,
            });
            // 提交都成功了 重置当前页面 
            this.setData({
              textVal:"",
              chooseImgs:[]
            })
            //返回上个页面
            wx.navigateBack({
              delta: 1
            });
          }
        }
      });
    })
    }else{
      console.log("只是提交了文本:",this.data.textVal);
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
    }

   
  }
  
})