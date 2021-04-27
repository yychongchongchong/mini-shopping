/* 
1.给输入框 值绑定事件 input数据
  a.获取到输入框的值
  b.合法性判断
  c.检测通过 把输入框的值 发送到后台
  d.返回到的数据打印到页面上
2.防抖 (防止抖动)
  定时器 输入稳定发送请求
  a.定义一个全局定时器id

  防抖一般用于输入框中  防止重复输入 重复发送请求
  节流一般是用在页面下拉和上拉
*/
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    //取消按钮是否显示
    isFocus:false,
    //输入框的值
    inputValue:""
  },
  TimeId:-1,
  //输入框的值改变了触发的事件
  handleInput(e){
    // console.log(e);
    //获取输入框的值
    const {value} = e.detail;
    //合法性判断
    if(!value.trim()){
      //隐藏取消按钮
      this.setData({
        isFocus:false,
        goods:[]
      })
      //值不合法
      return
    }
    //显示取消按钮
    this.setData({
      isFocus:true
    })
    //通过合法性判断 获取参数
    //清除定时器
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(()=>{
      this.qsearch(value);
    },1000)
  },
  //发送请求获取 建议 数据
  async qsearch(query){
    const res = await request({url:"/goods/qsearch",data:{query}});
    // console.log(res);
    this.setData({
      goods:res
    })
  },
  //点击取消按钮
  handleCancel(){
    //清空数据
    this.setData({
      inputValue:"",
      isFocus:false,
      goods:[]
    })
  }
})