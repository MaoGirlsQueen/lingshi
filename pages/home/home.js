// pages/home/home.js
import {Home} from 'home-model.js';
var home = new Home();
Page({
  data: {
    bannerArr:[],
    themeArr:[]
  },

  onLoad: function (options) {
    this._loadData();
  },
  _loadData:function(){
    var id =1;
    home.getBannerData(id, (res) => {
      this.setData({
        bannerArr:res
      })
    });

    home.getThemeData((res) => {
      this.setData({
        themeArr: res
      })
    })

    home.getRecentData(res=>{
      this.setData({
        productArr: res
      })
    });
  },
  onClickBanner:(e)=>{
    const id = home.getDataSet(e,"id");
    wx.navigateTo({
      url: '../product/product?id='+id,
    })
  },
  onThemeTap:(e)=>{
    const id = home.getDataSet(e, "id");
    const name = home.getDataSet(e, "name");
    wx.navigateTo({
      url: '../theme/theme?id=' + id+'&name='+name,
    })
  },
  onProductsItemTap:(e)=>{
    const id = home.getDataSet(e, "id");
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  }
})