import {Config} from './config.js';
import {Token} from "./token.js"

class Base{
  constructor(){
    this.baseRequestUrl = Config.restUrl;
  }
   //当noRefetch为true时，不做未授权处理重试机制
  request(params,noRefetch){
    var url = this.baseRequestUrl+params.url;
    if (!params.type){
      params.type='Get'
    }
    wx.request({
      url,
      method: params.type,
      header:{
        'content-type':'application/json',
        'token':wx.getStorageSync('token')
      },
      data: params.data,
      success:(res)=>{
        let code = res.statusCode.toString();
        let startChar = code.charAt(0);
        if (startChar == '2'){
          params.sCallBack && params.sCallBack(res.data);
        }
        else{
          if(code == '401'){
            if (!noRefetch){
              this._refetch(params)
            }
           
          }
          if (noRefetch){
            params.eCallBack && params.eCallBack(res.data);
          }
          
        }
        
      },
      fail:(err)=>{
        
      }
    })
  }
  _refetch(params){
    let token = new Token();
    token.getTokenFromServer(token=>{
      this.request(params,true)
    })
  }
  getDataSet(e,key){
    return e.currentTarget.dataset[key]
  }
}
export {Base}