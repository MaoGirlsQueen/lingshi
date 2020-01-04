// pages/order/order.js
import {
  Cart
} from '../cart/cart-model.js';
import {
  Address
} from '../../utils/address.js';
import {
  Order
} from "order-model.js";
var cart = new Cart()
let order = new Order()

var address = new Address();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: 0,
    productsArr: [],
    orderStatus: 0,
    id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let from = options.from;

   if(from == 'cart'){
     this._fromCart(options.account)
   }else{
     var id = options.id;
     this._fromOrder(id);
   }

  },
  _fromCart(account){
    let productsArr = [];
    this.data.account = account;
    productsArr = cart.getCartDataFromLocal(true);
    this.setData({
      productsArr,
      account,
      orderStatus: 0
    })

    address.getAddressInfo(res => {
      this._bindAddressInfo(res);
    });

  },
  _fromOrder(id){
    if (id) {
      var that = this;
      //下单后，支付成功或者失败后，点左上角返回时能够更新订单状态 所以放在onshow中
      order.getOrderInfoById(id, (data) => {
        that.setData({
          orderStatus: data.status,
          productsArr: data.snap_items,
          account: data.total_price,
          basicInfo: {
            orderTime: data.create_time,
            orderNo: data.order_no
          },
        });

        // 快照地址
        var addressInfo = data.snap_address;
        addressInfo.totalDetail = address.setAddressInfo(addressInfo);
        that._bindAddressInfo(addressInfo);
      });
    }
  },
  editAddress() {
    wx.chooseAddress({
      success: (res) => {
        let addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        }
        this._bindAddressInfo(addressInfo)
        address.submitAddress(res, (flag) => {
          if (!falg) {
            this.showTips("操作提示", "地址信息更新失败！");
          }
        })
      },
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  /*绑定地址信息*/
  _bindAddressInfo(addressInfo) {
    this.setData({
      addressInfo: addressInfo
    });
  },
  /*下单和付款*/
  pay: function() {
    if (!this.data.addressInfo) {
      this.showTips('下单提示', '请填写您的收货地址');
      return;
    }
    if (this.data.orderStatus == 0) {
      this._firstTimePay();
    } else {
      this._oneMoresTimePay();
    }
  },
  /*第一次支付*/
  _firstTimePay: function() {
    var orderInfo = [],
      procuctInfo = this.data.productsArr,
      order = new Order();
    for (let i = 0; i < procuctInfo.length; i++) {
      orderInfo.push({
        product_id: procuctInfo[i].id,
        count: procuctInfo[i].counts
      });
    }

    var that = this;
    //支付分两步，第一步是生成订单号，然后根据订单号支付
    order.doOrder(orderInfo, (data) => {
      //订单生成成功
      if (data.pass) {
        //更新订单状态
        var id = data.order_id;
        that.data.id = id;
        that.data.fromCartFlag = false;

        //开始支付
        that._execPay(id);
      } else {
        that._orderFail(data); // 下单失败
      }
    });
  },
  /* 再次次支付*/
  _oneMoresTimePay: function() {
    this._execPay(this.data.id);
  },
  /*
       *下单失败
       * params:
       * data - {obj} 订单结果信息
       * */
  _orderFail: function (data) {
    var nameArr = [],
      name = '',
      str = '',
      pArr = data.pStatusArray;
    for (let i = 0; i < pArr.length; i++) {
      if (!pArr[i].haveStock) {
        name = pArr[i].name;
        if (name.length > 15) {
          name = name.substr(0, 12) + '...';
        }
        nameArr.push(name);
        if (nameArr.length >= 2) {
          break;
        }
      }
    }
    str += nameArr.join('、');
    if (nameArr.length > 2) {
      str += ' 等';
    }
    str += ' 缺货';
    wx.showModal({
      title: '下单失败',
      content: str,
      showCancel: false,
      success: function (res) {

      }
    });
  },
  /*
   *开始支付
   * params:
   * id - {int}订单id
   */
  _execPay: function(id) {
    if (!order.onPay) {
      this.showTips('支付提示', '本产品仅用于演示，支付系统已屏蔽', true); //屏蔽支付，提示
      this.deleteProducts(); //将已经下单的商品从购物车删除
      return;
    }
    var that = this;
    order.execPay(id, (statusCode) => {
      if (statusCode != 0) {
        that.deleteProducts(); //将已经下单的商品从购物车删除   当状态为0时，表示

        var flag = statusCode == 2;
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=order'
        });
      }
    });
  },
  //将已经下单的商品从购物车删除
  deleteProducts: function() {
    var ids = [],
      arr = this.data.productsArr;
    for (let i = 0; i < arr.length; i++) {
      ids.push(arr[i].id);
    }
    cart.delete(ids);
  },

  /*
   * 提示窗口
   * params:
   * title - {string}标题
   * content - {string}内容
   * flag - {bool}是否跳转到 "我的页面"
   */
  showTips: function(title, content, flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function(res) {
        if (flag) {
          wx.switchTab({
            url: '/pages/my/my'
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setNavigationBarTitle({
      title: "订单详情",
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.id) {
      this._fromCart(this.data.id)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})