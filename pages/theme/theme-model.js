import { Base } from '../../utils/base.js';
class Theme extends Base{
  constructor(){
    super();
  }

  getProductsData(id,call){
    var params = {
      url: `/theme/` + id,
      type: 'GET',
      sCallBack: (res) => {
        call && call(res)
      }
    }
    this.request(params)
  }
}
export { Theme }