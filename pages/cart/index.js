/* 
1.获取用户收货地址
  a.绑定点击事件
  b.调用小程序内置 api 获取用户收货地址 wx.chooseAddress
2.获取用户对小程序所授予获取地址的权限状态  scope
  a.假设用户点击获取收获地址的提示框 确定 scope：true
  b.假设用户点击获取收货地址的提示框 取消 scope：false
    i：诱导用户打开授权设置页面   wx.openSetting
    ii：获取收货地址
  c.假设用户从来没有调用收货地址api      scope：undefined
3.页面加载完毕
  a.获取本地存储中的地址数据
  b.把数据设置给data的一个变量
4.onShow
  回到商品详情页面 第一次添加商品时 手动添加了属性
    num=1   checked=true
  a.获取缓存中的购物车数组
  b.把购物车数据 添加到data中
5.全选的实现 数据的展示
  a.onShow 获取缓存中的购物车数组
  b.根据购物车中的的商品数据 所有的商品都被选中 checked=true 全选就被选中
6.总价格和总数量
  a.都需要商品被选中才计算
  b.获取购物车数组进行遍历  遍历判断商品是否被选中 
  c.总价格 += 商品单价 * 数量
  d.总数量 += 商品的数量
  e.把计算后的价格和数量设置回data中
7.商品选中功能
  a.绑定change事件
  b.获取被修改的商品对象
  c.商品对象的选中状态 取反
  d.重新填充回data和缓存中
  e.重新计算全选 总价格 总数量...
8.全选和复选
  a.全选复选框绑定事件 change
  b.获取data中的全局变量 allChecked
  c.直接取反
  d.遍历购物车数组  让里面购物车商品选中状态跟随 checked改变而改变
  e.把购物车数组和allChecked重新设置回data中 写入缓存
9.商品数量的编辑
  a."+""-"绑定同一个点击事件  区分关键在于自定义属性
    + 1 - -1
  b.传递被点击的商品id goods_id
  c.获取data中的购物车数组 来获取需要被修改的商品对象
  d.直接修改商品对象的数量 num
  e.把cart数组重新设置回缓存和data中
10.当购物车数量为1 且用户点击-1按钮 弹窗提示 showModal用户是否要删除 
  a.确定 直接执行删除
  b.取消 什么都不做
11.点击结算
  a.判断有没有收货地址
  b.判断用户有没有选购商品
  c.都满足跳到支付页面
*/
import{getSetting,chooseAddress,openSetting,showModal,showToast } from "../../utils/asyncWx.js";
Page({

  data:{
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //1.获取本地缓存
    const address = wx.getStorageSync("address");
    //获取缓存中购物车数据
    const cart = wx.getStorageSync("cart")||[];
    //计算全选
    //every 方法是数组方法  会遍历 会接受一个回调函数 如果每一个回调函数都返回true  那么 every方法的返回值为true  只要有一个回调函数的返回值为false 那么 every方法的返回值为false  如果为空数组 返回值为true
    // const allChecked=cart.length?cart.every(v=>v.checked):false;
    this.setData({address})
    this.setCart(cart)
  },
  //点击收货地址
  async handleChooseAddress(){
    // wx.getSetting({
    //   success: (result)=>{
    //     //2.获取权限状态 发现一些属性名很怪异的时候 都要用[]形式来获取属性值
    //     // console.log(result);
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if(scopeAddress===true||scopeAddress==undefined){
    //       wx.chooseAddress({
    //         success: (result1)=>{
    //           console.log(result1);
    //         }
    //       });
    //     }else{
    //       //3.用户以前拒绝过授予权限 先诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (result)=>{
    //           //4 调用收货地址代码
    //           wx.chooseAddress({
    //             success: (result2)=>{
    //               console.log(result2);
    //             }
    //           });
    //         }
    //       });
    //     }
    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // });
    
    
    try {
      // 1.获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      //2.判断权限状态
      if(scopeAddress===false){
        //3.诱导用户打开页面
        await openSetting();
      }
      //4.调用获取收货地址的api
      let address=await chooseAddress();
      address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
      //5.存入到缓存中
      wx.setStorageSync("address", address);
      // console.log(res2);
    } catch (error) {
      console.log(error);
    }
  },
  //商品的选中
  handleItemChange(e){
    //获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    //获取购物车数组
    let cart = this.data.cart;
    // console.log(cart);
    //找到被修改的商品对象
    let index = cart.findIndex(v=>v.goods_id===goods_id);
    //选中状态取反
    // console.log(index);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart)
  },
  //设置购物车状态 重新计算底部工具栏数据 ： 全选 总价格 购买数量
  setCart(cart){
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if(v.checked){
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      }else{
        allChecked=false
      }
    });
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart);
  },
  //商品全选
  handleItemAllChecked(){
    //获取data数据
    let {cart,allChecked}=this.data;
    //修改值
    allChecked=!allChecked;
    //循环修改cart商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    //修改后的值填充回data和缓存
    this.setCart(cart)
  },
  //商品数目编辑
  // async handleItemNumEdit(e){
  //   let {cart} = this.data;
  //   const {operation,id} = e.currentTarget.dataset;
  //   cart.forEach(v=>{
  //     if(v.goods_id===id){
  //       if(v.num===1&&operation===-1){
  //         const res = await showModal({content:"您是否要删除？"});
  //         if(res.confirm){
  //           cart.splice(v,1);
  //           this.setCart(cart);
  //         }
  //       }else{
  //         v.num+=operation
  //       }
  //     }
  //     });
  //     this.setCart(cart);
  // }
  //商品数目编辑
  async handleItemNumEdit(e) {
    // 1 获取传递过来的参数 
    const { operation, id } = e.currentTarget.dataset;
    // 2 获取购物车数组
    let { cart } = this.data;
    // 3 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 4 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 4.1 弹窗提示
      const res = await showModal({ content: "您是否要删除？" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 4  进行修改数量
      cart[index].num += operation;
      // 5 设置回缓存和data中
      this.setCart(cart);
    }
  },
  //点击结算
  async handlePay(){
    //判断收货地址
    if(!this.data.address.userName){
      await showToast({title:"您还没有添加收货地址"});
      return;
    }
    //判断用户有没有选购商品
    if(this.data.totalNum===0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
      
  }
})