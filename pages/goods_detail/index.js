import { request } from "../../request/index.js";

/* 1.发送请求，获取数据
   2.点击轮播图预览大图功能
    a. 给轮播图绑定点击事件
    b. 调用小程序的api previewImage 
   3.点击加入购物车
    a. 先绑定点击事件
    b. 获取缓存中的购物车数据 数组格式
    c. 先判断 当前的商品是否存在于购物车中
    d. 已经存在 修改上行数据 执行购物车数量++
    e. 不存在于购物车的数组中 直接给购物车数组添加新元素 新元素带上购买数量属性 num  重新把购物车数组 填充回缓存中
  4.商品收藏功能
    a.页面onShow的时候，加载缓存中的商品收藏数据
    b.判断当前商品是不是被收藏的
      是 改变页面图标
      不是 ...
    c.点击页面收藏按钮
      判断商品是否属于缓存数组中
      已经存在，把该商品删除
      如果该商品不存在 添加到收藏数组中 存入到缓存中*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    //商品收藏状态
    isCollect:false
  },

  //全局商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;

    const goods_id = options.goods_id;
    // console.log(goods_id);
    this.getGoodsDetail(goods_id)
  },

  //获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj = await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo=goodsObj;
    //获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect")||[];
    //判断当前商品是否被收藏
    //some方法 如果有一个为真则为真
    let isCollect = collect.some(v=>v.goods_id===this.GoodsInfo.goods_id)
    // console.log(goodsObj.pics);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        //iPhone部分手机不支持 webp 图片格式
        //临时自己改 确保后台存在 1.webp=》1.jpg
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,".jpg"),
        pics:goodsObj.pics,
        //
      },
      isCollect
    })
  },

  //点击轮播图放大预览
  handlePrevewImage(e){
    //1.构造要预览的图片数组
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    // console.log(urls);
    //2.点击事件触发接受传递过来的url
    const current=e.currentTarget.dataset.url;
    // console.log(current);
    wx.previewImage({
      current,
      urls,
    });
      
  },

  //点击加入购物车
  handleCartAdd(e){
    //1.获取缓存中购物车数组
    let cart = wx.getStorageSync("cart")||[];
    //2.判断商品对象是否存在于购物车数组中
    let index =cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      //3.不存在 第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      //4.已经存在购物车数据 执行num++
      cart[index].num++;
    }
    //5.把购物车重新添加回缓存中
    wx.setStorageSync("cart",cart);
    //6.弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true,
    });
      
  },
  
  //点击收藏按钮
  handleCollect(){
    let isCollect = false;
    //获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect")||[];
    //判断该商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
    //当index不等于-1时表示已经收藏过 取消收藏
    if(index!==-1){
      //在数组中删除该商品
      isCollect = false;
      collect.splice(index,1);
      //弹窗提示
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    }else{
      //在数组中添加商品对象
      console.log(this.GoodsInfo);
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    //把数组写入缓存中
    wx.setStorageSync("collect", collect);
    //修改data属性 取反
    this.setData({
      isCollect
    })
  }
})
