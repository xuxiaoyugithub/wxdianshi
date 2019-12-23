<?php
namespace app\index\controller;

use think\Db;
class Withdraw
{
//微信小程序提现到零钱
  public function withdraw(Request $request)
  {
      //$openid = $request->param('wxopenid');
      $openid = input('openid');
      $amount = input('money');
 
      $data = [
          'mch_appid' => 'wx60c1c9093ef5e766',
          'mchid' => '小程序商户号',//商户号
          'nonce_str' => self::getNonceStr(),//随机字符串，长度要求在32位以内
          'partner_trade_no' => self::create_order_no(),//商户订单号
          'openid' => $openid,
          'check_name' => 'NO_CHECK',
          'amount' => $amount * 100,//标价金额，单位分
          'desc' => '提现的描述',
          'spbill_create_ip' => self::getip()//终端IP
      ];
 
      $data['sign'] = self::makeSign($data);
 
      $xmldata = self::array2xml($data);
 
      $url = "https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers";
      $res = self::curl_post_ssl2($url, $xmldata);
 
      if (empty($res)) {
          return json(['status' => 0, 'data' => '', 'msg' => '连接失败']);
      }
 
      $content = self::xml2array($res);
      p($content);//打印提现结果
  }
 
  //商户系统内部订单号，要求32个字符内
  public function getNonceStr($length = 32) {
      $chars = "abcdefghijklmnopqrstuvwxyz0123456789";
      $str   = "";
      for ( $i = 0; $i < $length; $i++ )  {
          $str .= substr($chars, mt_rand(0, strlen($chars)-1), 1);
      }
      return $str;
  }
 
  //生成唯一订单号(简化版)
  public function create_order_no() {
      $order_no = substr(date('YmdHis'),2).rand(10000, 99999);
      return $order_no;
  }
 
  //获取IP地址
  public function getip() {
      static $ip = '';
      $ip = $_SERVER['REMOTE_ADDR'];
      if(isset($_SERVER['HTTP_CDN_SRC_IP'])) {
          $ip = $_SERVER['HTTP_CDN_SRC_IP'];
      } elseif (isset($_SERVER['HTTP_CLIENT_IP']) && preg_match('/^([0-9]{1,3}\.){3}[0-9]{1,3}$/', $_SERVER['HTTP_CLIENT_IP'])) {
          $ip = $_SERVER['HTTP_CLIENT_IP'];
      } elseif(isset($_SERVER['HTTP_X_FORWARDED_FOR']) AND preg_match_all('#\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}#s', $_SERVER['HTTP_X_FORWARDED_FOR']matches)) {
          foreach ($matches[0] AS $xip) {
              if (!preg_match('#^(10|172\.16|192\.168)\.#', $xip)) {
                  $ip = $xip;
                  break;
              }
          }
      }
         return $ip;
     }
 
  //生成签名
  public function makeSign($data){
      //获取微信支付秘钥
      $key = "小程序支付key";//这个在微信商户平台可以查看
      // 去空
      $data=array_filter($data);
      //签名步骤一：按字典序排序参数
      ksort($data);
      $string_a=http_build_query($data);
      $string_a=urldecode($string_a);
      //签名步骤二：在string后加入KEY
      $string_sign_temp=$string_a."&key=".$key;
      //签名步骤三：MD5加密
      $sign = md5($string_sign_temp);
      // 签名步骤四：所有字符转为大写
      $result=strtoupper($sign);
      return $result;
  }
 
 
  public function array2xml($arr, $level = 1)
  {
      $s = $level == 1 ? "<xml>" : '';
      foreach ($arr as $tagname => $value) {
          if (is_numeric($tagname)) {
              $tagname = $value['TagName'];
              unset($value['TagName']);
          }
          if (!is_array($value)) {
              $s .= "<{$tagname}>" . (!is_numeric($value) ? '<![CDATA[' : '') . $value . (!is_numeric($value) ? ']]>' : '') . "</{$tagname}>";
          } else {
              $s .= "<{$tagname}>" . $this->array2xml($value, $level + 1) . "</{$tagname}>";
          }
      }
 
      $s = preg_replace("/([\x01-\x08\x0b-\x0c\x0e-\x1f])+/", ' ', $s);
      return $level == 1 ? $s . "</xml>" : $s;
  }
 
 
 
  public function curl_post_ssl2($url, $xmldata, $second=30,$aHeader=array()){
      $isdir = str_replace('Api.php','',__FILE__) . 'cert/';//这个是证书，需要到微信商户平台下载，然后放到服务器上
 
      $ch = curl_init();
      curl_setopt($ch,CURLOPT_TIMEOUT,$second);
      curl_setopt($ch,CURLOPT_RETURNTRANSFER, 1);
      //这里设置代理，如果有的话
      //curl_setopt($ch,CURLOPT_PROXY, '10.206.30.98');
      //curl_setopt($ch,CURLOPT_PROXYPORT, 8080);
      curl_setopt($ch,CURLOPT_URL,$url);
      curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,false);
      curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,false);
      curl_setopt($ch, CURLOPT_HTTPHEADER, $aHeader);
 
      curl_setopt($ch, CURLOPT_SSLCERTTYPE, 'PEM');//证书类型
      curl_setopt($ch, CURLOPT_SSLCERT, $isdir . 'apiclient_cert.pem');//证书位置
      curl_setopt($ch, CURLOPT_SSLKEYTYPE, 'PEM');//CURLOPT_SSLKEY中规定的私钥的加密类型
      curl_setopt($ch, CURLOPT_SSLKEY, $isdir . 'apiclient_key.pem');//证书位置
      curl_setopt($ch, CURLOPT_CAINFO, 'PEM');
      //curl_setopt($ch, CURLOPT_CAINFO, $isdir . 'rootca.pem');这个是可选的
 
      curl_setopt($ch,CURLOPT_POST, 1);
      curl_setopt($ch,CURLOPT_POSTFIELDS,$xmldata);
      $data = curl_exec($ch);
      if(curl_errno($ch)){
          echo 'Error+'.curl_error($ch);
      }
      curl_close($ch);
      return $data;
  }
 
//将xml转为array
  public function xml2array($xml){
      　　//禁止引用外部xml实体
   　　libxml_disable_entity_loader(false);
   　　$result= json_decode(json_encode(simplexml_load_string($xml, 'SimpleXMLElement', LIBXML_NOCDATA)), true);
   　　return $result;
　}
}
?>