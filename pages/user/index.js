// pages/user/index.js
Page({

  data:{
    userInfo:{},
    //被收藏商品数量
    collectNum:0
  },
  onShow(){
    const userInfo = wx.getStorageSync("userInfo");
    const collect = wx.getStorageSync("collect")||[];
    this.setData({userInfo,collectNum:collect.length})  
  }
})