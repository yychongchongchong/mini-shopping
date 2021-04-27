// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:[],
    tabs:[
      {
        id:0,
        value:"商品收藏",
        isActive:true
      },
      {
        id:1,
        value:"品牌收藏",
        isActive:false
      },
      {
        id:2,
        value:"店铺收藏",
        isActive:false
      },
      {
        id:4,
        value:"浏览足迹",
        isActive:false
      }
    ]
  },
  //根据标题索引激活选中
  changeTitleByIndex(index){
    let {tabs} = this.data;
    tabs.forEach((v,i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e){
    const {index} = e.detail.index;
    this.changeTitleByIndex(index)
  },
  onShow(){
    const collect = wx.getStorageSync("collect")||[];
    this.setData({collect})  
  }
 
})