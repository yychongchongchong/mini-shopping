// pages/category/index.js
import {request} from "../../request/index.js"
Page({

 
  data: {
    //左侧菜单数据
    leftMenuList:[],
    //右侧菜单数据
    rightMenuList:[],
    //被点击的左侧菜单
    currentIndex:0,
    //右侧内容滚动条距离滚动条距离
    scrollTop: 0

  },
  //接口返回数据
  Cates:[],
  
  onLoad: function (options) {
    /* web中的本地存储和小程序中本地存储的区别
      1.写代码方式不一样了
        web:localStorage.setItem("key","value")  localStorage.getItem("key")
        小程序:wx.setStorageSync("key","value")  wx.getStorageSync("key")
      2.存的时候 有没有做类型转换
        web:不管存入的是什么类型的数据，都会优先调用toString(),把数据变成了字符串，再存入进去
        小程序:不存在类型转换的操作哟 存什么样的数据进去，获取的就是什么类型的数据
    */

    // 1.判断本地存储中是否有旧的数据
    /* {time:Date.now(),data:[...]} */
    // 2.没有旧数据 直接发送新请求
    // 3.有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可

    // 1.获取本地存储数据
    const Cates = wx.getStorageSync("cates");
    // 2.判断
    if(!Cates){
      // 不存在
      this.getCates();
    }else{
      //有旧的数据 定义过期时间
      if(Date.now()-Cates.time>1000*60*5){
        this.getCates();
      }
      else{
        this.Cates=Cates.data;
        //构造左侧大菜单数据
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        //构造右侧商品数据
        let rightMenuList=this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightMenuList
      })
      }
    }
  },
  //获取分类数据
  async getCates(){
    // request({
    //   url:"/categories"
    // })
    // .then(res =>{

    //   // console.log(res.data.message);
    //   this.Cates=res.data.message;
    //   //把接口数据存入到本地存储中
    //   wx.setStorageSync("cates",{time:Date.now(),data:this.Cates})
    //   //构造左侧大菜单数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name);
    //   //构造右侧商品数据
    //   let rightMenuList=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightMenuList
    //   })
    // })


    //1.使用es7的async await发送请求
    const res = await request({url:"/categories"});
    // this.Cates=res.data.message;
    this.Cates=res;
    //把接口数据存入到本地存储中
    wx.setStorageSync("cates",{time:Date.now(),data:this.Cates})
    //构造左侧大菜单数据
    let leftMenuList=this.Cates.map(v=>v.cat_name);
    //构造右侧商品数据
    let rightMenuList=this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightMenuList
    })
  },
  //左侧菜单点击事件
  handleItemTap(e){
    // console.log(e.currentTarget.dataset.index);
    let currentIndex = e.currentTarget.dataset.index;
    let rightMenuList=this.Cates[currentIndex].children;
    this.setData({
      currentIndex,
      rightMenuList,
      scrollTop:0
    })
  }
})