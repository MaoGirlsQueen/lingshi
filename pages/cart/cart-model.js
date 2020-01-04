import { Base } from '../../utils/base.js'
class Cart extends Base{
  constructor(){
    super()
    this._storageKeyName="cart"
  }
  /**
   * 
   * 加入到购物车
   * 如果之前没有这样的商品，则直接添加一条新的记录，数量为counts
   * 如果有，则将相应的数量+counts
   * item  obj 商品对象
   * counts  int  商品数量                                                                                                                                                                                   
   * **/
  add(item,counts){
    let cartData = this.getCartDataFromLocal();
    let isHasInfo = this._isHasThatOne(item.id, cartData);
    if (isHasInfo.index== -1){
       item.counts = counts;
       item.selectStatus = true;
      cartData.push(item)
    }else{
      cartData[isHasInfo.index].counts += counts
    }
    wx.setStorageSync(this._storageKeyName, cartData);
  }

   //获取本地的缓存的购物车数据
  getCartDataFromLocal(flag){
    let res = wx.getStorageSync(this._storageKeyName);
    if(!res){
      res =[]
    }
    

    //在下单的时候过滤不下单的商品，
    if (flag) {
      var newRes = [];
      for (let i = 0; i < res.length; i++) {
        if (res[i].selectStatus) {
          newRes.push(res[i]);
        }
      }
      res = newRes;
    }
    return res;
  }
  // 判断新增的数据是不是在缓存中存在
  _isHasThatOne(id,carr){
    let item=null;
    let result = {
      index:-1
    }
    for (let i = 0; i < carr.length;i++){
      item = carr[i];
      if (carr[i].id == id){
        result = {
          index: i,
          data: item
        }
        break;
      }
    }
    return result;
  }
   // 计算购物车的总数量
  getCartTotalCounts(flag){
    let data = this.getCartDataFromLocal();
    let counts= 0;
    for(let i=0;i<data.length;i++){
      if(flag){
        if (data[i].selectStatus){
          counts += data[i].counts;
        }
      }else{
        counts += data[i].counts;
      }
      
    }
    return counts;
  }

  //修改商品数量的方法
  /*
    * 修改商品数目
    * params:
    * id - {int} 商品id
    * counts -{int} 数目
    * */
  _changeCounts(id, counts) {
    var cartData = this.getCartDataFromLocal(),
      hasInfo = this._isHasThatOne(id, cartData);
   
    if (hasInfo.index != -1) {
      if (hasInfo.data.counts >= 1) {
        cartData[hasInfo.index].counts += counts;
      }
    }
    this.execSetStorageSync(cartData)
  }
  /*
     * 增加商品数目
     * */
  addCounts(id) {
    this._changeCounts(id, 1);
  };

  /*
  * 购物车减
  * */
  cutCounts(id) {
    this._changeCounts(id, -1);
  };
  /*
    * 删除某些商品
    */
  delete(ids) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }
    var cartData = this.getCartDataFromLocal();
    for (let i = 0; i < ids.length; i++) {
      var hasInfo = this._isHasThatOne(ids[i], cartData);
      if (hasInfo.index != -1) {
        cartData.splice(hasInfo.index, 1);  //删除数组某一项
      }
    }
    this.execSetStorageSync(cartData)
  }
  execSetStorageSync(data) {
    wx.setStorageSync(this._storageKeyName, data);
  };

}

export { Cart }