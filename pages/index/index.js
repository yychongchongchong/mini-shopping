//Page Object
//引入发送请求的方法
import {request} from "../../request/index.js"
Page({
  data: {
    //轮播图数组
    swiperList:[],
    //导航数据
    cateList:[],
    //楼层数据
    floorList:[]

  },
  //options(Object)
  //页面加载时就会触发的生命周期事件
  onLoad: function(options) {
    //1.发送异步请求获取轮播图数据
    //优化手段可以通过es6 的promise来解决
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // });
    this.getSwiperList();  
    this.getCateList();
    this.getFloorList();
  },
  //获取轮播图数据
  getSwiperList(){
    request({url:"/home/swiperdata"})
    .then(result => {
      for(let k = 0 ; k<=result.length ; k++){
        result.forEach((v,i)=>{
          v.navigator_url=v.navigator_url.replace("main","index");
        })
      }
      this.setData({
      swiperList:result
    })
    })
  },
  getCateList(){
    request({url:"/home/catitems"})
    .then(result => {
          this.setData({
          cateList:result
        })
    })
  },
  getFloorList(){
    request({url:"/home/floordata"})
    .then(result => {
      for(let k = 0; k < result.length;k++){
        result[k].product_list.forEach((v,i)=>{
          v.navigator_url=v.navigator_url.replace('?', '/index?');
        })
      }
      this.setData({
      floorList:result
    })
    })
  }
});
  