/* 
1.页面加载从缓存中获取购物车数据 渲染到页面中
  这些数据checked属性为true
2.微信支付
  a.企业账号实现微信支付 企业账号的小程序后台必须给开发者添加白名单
    一个appid可以绑定多个开发者 共用appid和开发权限 */
Page({

  data:{
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //获取本地缓存
    const address = wx.getStorageSync("address");
    //获取缓存中购物车数据
    let cart = wx.getStorageSync("cart")||[];
    //过滤后的购物车数组
    cart = cart.filter(v=>v.checked);
    //计算全选
    //every 方法是数组方法  会遍历 会接受一个回调函数 如果每一个回调函数都返回true  那么 every方法的返回值为true  只要有一个回调函数的返回值为false 那么 every方法的返回值为false  如果为空数组 返回值为true
    // const allChecked=cart.length?cart.every(v=>v.checked):false;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
      
    });
    this.setData({
      cart,
      address,
      totalPrice,
      totalNum
    });
  },
  handlepayTwocode(){
    wx.navigateTo({
      url: '/pages/pay_twocode/index',
    });
      
  }
})