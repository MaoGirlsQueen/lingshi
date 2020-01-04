import { Base } from '../../utils/base.js'
class Category extends Base {
   constructor(){
     super();
   }
  getCategoryData(call) {
    var params = {
      url: `/category/all`,
      type: 'GET',
      sCallBack: (res) => {
        call && call(res)
      }
    }
    this.request(params)
  }

  getProductByCategoryData(id,call) {
    var params = {
      url: `/product/by_category?id=`+id,
      type: 'GET',
      sCallBack: (res) => {
        call && call(res)
      }
    }
    this.request(params)
  }
}
export { Category }