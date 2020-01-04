import {Base} from '../../utils/base.js'
class Home extends Base{
   constructor(){
     super();
   }
  getBannerData(id,call){
    var params = {
      url: `/banner/` + id,
      type: 'GET',
      sCallBack: (res) => {
        call && call(res.items)
      }
    }
    this.request(params)
  }
  getThemeData(call){
    var params = {
      url: `/theme/?ids=1,2,3`,
      type: 'GET',
      sCallBack: (res) => {
        call && call(res)
      }
    }
    this.request(params)
  }

  getRecentData(call){
    var params = {
      url: `/product/recent`,
      type: 'GET',
      sCallBack: (res) => {
        call && call(res)
      }
    }
    this.request(params)
  }
}
export { Home}