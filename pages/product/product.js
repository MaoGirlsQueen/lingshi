// pages/product/product.js
import {
  Product
} from 'product-model.js';
import {
  Cart 
} from '../cart/cart-model.js';
var product = new Product();
var cart = new Cart();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:[],
    id:0,
    countsArray:[1,2,3,4,5,6,7,8,9,10],
    productCounts:1,
    currentTabsIndex:0,
    productTab: ['商品详情', '产品参数', '售后保障'],
    cartTotalCounts:0
  },
  onTabsItemTap(e){
    const index = product.getDataSet(e,"index");
     this.setData({
       currentTabsIndex:index
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id;
    this.data.id = id;
    this._getDeatiInfo();
  },
   _getDeatiInfo(){
     product.getDetainInfo(this.data.id,(res)=>{
        this.setData({
          cartTotalCounts: cart.getCartTotalCounts(),
          product:res
        })
     });
   },
  bindPickerChange(e){
    let index = e.detail.value;
    let selectCount = this.data.countsArray[index];
    this.setData({
      index: e.detail.value,
      productCounts: selectCount
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: "商品详情",
    })
  },

  onAddingToCartTap(e){
    let conuts = this.data.cartTotalCounts + this.data.productCounts;
    this.setData({
      cartTotalCounts: conuts
    })
    this.addToCart()
  },
  addToCart(){
    let tempObj = {};
    let keys = ["id","name","main_img_url","price"];
    for (let key in this.data.product){
      if (key.indexOf(key)>=0){
        tempObj[key] = this.data.product[key];
       }
    }
    cart.add(tempObj, this.data.productCounts)
  },
  onCartTap(){
    wx.switchTab({
      url: '../cart/cart'
    })
  }
})