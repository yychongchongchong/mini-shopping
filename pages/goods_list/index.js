import { request } from "../../request/index.js";

/* 用户上滑页面 滚动条触底 开始加载下一条数据
  1 找到滚动条触底事件
  2 判断还有没有下一页数据
    获取到数据总页数 获取到当前的页码 判断当前页码大于等于总页数
    总页数 = Math.ceil(总条数 / 页容量 pagesize)

  3 假如没有下一页数据 弹出一个提示
  4 如果还有下一页数据 用来加载下一页数据
    a 当前的页码++
    b 重新发送请求
    c 数据请求回来 要对data数组进行拼接 而不是替换*/
/* 下拉刷新页面
   1 触发下拉刷新事件 页面json文件开启配置
    找到触发下拉刷新事件
   2 重置 数据 数组
   3 充值页码 设置为1
   4 重新发送请求
   5 数据请求回来手动关闭等待效果*/
Page({
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      },
    ],
    goodsList:[]
  },
  //接口用参数
  QuaryParams:{
    quary:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  //总页数
  totalPage:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.QuaryParams.cid=options.cid||"";
    this.QuaryParams.quary=options.quary||"";
    this.getGoodslist();
  },
  //页面滚动条触底事件
  onReachBottom(){
    //判断还有没有下一页数据
    if(this.QuaryParams.pagenum>=this.totalPage){
      wx.showToast({title: '没有下一页数据了'});
        
    }else{
      this.QuaryParams.pagenum++;
      this.getGoodslist();
    }
  },
  //下拉刷新页面事件
  onPullDownRefresh(){
    this.setData({
      //1.重置数组
      goodsList:[]
    })
    //2.重置页码
    this.QuaryParams.pagenum=1;
    //3.重新发送请求
    this.getGoodslist();
    wx.stopPullDownRefresh();
  },
  //获取商品列表数据
  async getGoodslist(){
    const res = await request({url:"/goods/search",data:this.QuaryParams});
    const total = res.total;
    // console.log(res.total);
    this.totalPage=Math.ceil(total/this.QuaryParams.pagesize);
    // console.log(this.totalPage);
    // console.log(res);
    // console.log(res.goods);
    this.setData({
      goodsList:[...this.data.goodsList,...res.goods]
    })
    //关闭下拉刷新的窗口
    // wx.stopPullDownRefresh();
      
  },
  //从子组件传递过来的事件
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
  }
})