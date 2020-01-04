// pages/cart/cart.js
import {
  Cart
} from 'cart-model.js';
var cart = new Cart();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedCounts: 0,
    cartData: [],
    selectedTypeCounts: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let cartData = cart.getCartDataFromLocal()
    let cal = this._calcTotalAccountAndCounts(cartData);
    this.setData({
      selectedCounts: cal.selectedCounts,
      cartData,
      account: cal.account,
      selectedTypeCounts: cal.selectedTypeCounts
    })
  },
  _calcTotalAccountAndCounts(data) {
    let len = data.length,
      account = 0, //所需要计算的总价格，但是要注意排除掉未选中的商品
      selectedCounts = 0, // 购买商品的总个数，但是要注意排除掉未选中的商品
      selectedTypeCounts = 0; //购买商品的种类的总个数

    let multiple = 100;
    for (let i = 0; i < len; i++) {
      //避免 0.05 + 0.01 = 0.060 000 000 000 000 005 的问题，乘以 100 *100
      if (data[i].selectStatus) {
        account += data[i].counts * multiple * Number(data[i].price) * multiple;
        selectedCounts += data[i].counts;
        selectedTypeCounts++;
      }
    }
    return {
      selectedCounts: selectedCounts,
      selectedTypeCounts: selectedTypeCounts,
      account: account / (multiple * multiple)
    }
  },
  toggleSelect(e){
    let id = cart.getDataSet(e,"id");
    let status = cart.getDataSet(e, "status");
    let index = this._getProductIndexById(id);
    this.data.cartData[index].selectStatus = !status;
    this._resetCartData()
  },
  toggleSelectAll(e){
    let status = cart.getDataSet(e, "status")=='true';
    var data = this.data.cartData,
      len = data.length;
    for (let i = 0; i < len; i++) {
      data[i].selectStatus = !status;
    }
    this._resetCartData();
  },
  /*根据商品id得到 商品所在下标*/
  _getProductIndexById: function (id) {
    var data = this.data.cartData,
      len = data.length;
    for (let i = 0; i < len; i++) {
      if (data[i].id == id) {
        return i;
      }
    }
  },
  /*更新购物车商品数据*/
  _resetCartData: function () {
    var newData = this._calcTotalAccountAndCounts(this.data.cartData); /*重新计算总金额和商品总数*/
    this.setData({
      account: newData.account,
      selectedCounts: newData.selectedCounts,
      selectedTypeCounts: newData.selectedTypeCounts,
      cartData: this.data.cartData
    });
  },
  changeCounts(e){
    let id = cart.getDataSet(e, "id");
    let type = cart.getDataSet(e, "type");
    let index = this._getProductIndexById(id);
    let counts =1;
    if(type=='add'){
      cart.addCounts(id)
    }else{
      counts=-1
      cart.cutCounts(id);
    }
    this.data.cartData[index].counts+=counts;
    this._resetCartData();
  },
  delete(e){
    let id = cart.getDataSet(e, "id");
    let index = this._getProductIndexById(id);
    this.data.cartData.splice(index,1);
    cart.delete(id);
    this._resetCartData();
  },
  onHide(){
    cart.execSetStorageSync(this.data.cartData);
  },
  submitOrder() {
    wx.navigateTo({
      url: '../order/order?account='+this.data.account+'&from=cart'
    })
  }
  
})