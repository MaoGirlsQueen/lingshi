// pages/category/category.js
import {
  Category
} from 'category-model.js';
var category = new Category();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryTypeArr: [],
    currentMenuIndex: 0,
    loadedData: {},
    transClassArr: ['tanslate0', 'tanslate1', 'tanslate2', 'tanslate3', 'tanslate4', 'tanslate5']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getCategory();

  },
  _getCategory() {
    category.getCategoryData((categoryData) => {
      this.setData({
        categoryTypeArr: categoryData
      })
      category.getProductByCategoryData(categoryData[0].id, res => {
        let dataObj = {
          procucts: res,
          topImgUrl: categoryData[0].img.url,
          title: categoryData[0].name
        };

        this.setData({
          categoryInfo: dataObj,

        })
        this.data.loadedData[0] = dataObj
      })
    })

  },

  changeCategory(e) {
    const index = category.getDataSet(e, "index");
    const id = category.getDataSet(e, "id");
    this.setData({
      currentMenuIndex: index
    })
    if (!this.isLoadedData(index)) {
      category.getProductByCategoryData(id, res => {
        let dataObj = {
          procucts: res,
          topImgUrl: this.data.categoryTypeArr[index].img.url,
          title: this.data.categoryTypeArr[index].name
        };

        this.setData({
          categoryInfo: dataObj,

        })
        this.data.loadedData[index] = dataObj
      })
    } else {
      this.setData({
        categoryInfo: this.data.loadedData[index],

      })
    }

  },
  isLoadedData(index) {
    if (this.data.loadedData[index]) {
      return true;
    }
    return false;
  },
  onProductsItemTap: function (event) {
    var id = category.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setNavigationBarTitle({
      title: "商品分类",
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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