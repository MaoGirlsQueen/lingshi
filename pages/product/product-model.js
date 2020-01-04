import { Base } from '../../utils/base.js'
class Product extends Base{
  constructor(){
    super();
  }

  getDetainInfo(id,call){
    var params = {
      url: `/product/` + id,
      type: 'GET',
      sCallBack: (res) => {
        call && call(res)
      }
    }
    this.request(params)
  }
}
export { Product}