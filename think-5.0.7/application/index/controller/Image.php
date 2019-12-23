<?php
namespace app\index\controller;

use think\Db;
class Image
{
  public function image()
  {
    header('content-type:text/html;charset=utf-8');
    //配置APPID、APPSECRET
    $APPID = "wx60c1c9093ef5e766";
    $APPSECRET =  "e026ed5ef7247e278a8927c82e7aac9e"; 
    $id = input('id');
    if(input('id') != null){
    	$path = 'pages/space/space?id='.input('id');
    }else{
    	$path = 'pages/index/index';
    }
    //获取access_token
    $access_token = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$APPID&secret=$APPSECRET";

    //缓存access_token
     session_start();
     $_SESSION['access_token'] = "";
     $_SESSION['expires_in'] = 0;

     $ACCESS_TOKEN = "";
     if(!isset($_SESSION['access_token']) || (isset($_SESSION['expires_in']) && time() > $_SESSION['expires_in']))
     {

         $json = $this->httpRequest( $access_token );
         $json = json_decode($json,true); 
         // var_dump($json);
         $_SESSION['access_token'] = $json['access_token'];
         $_SESSION['expires_in'] = time()+7200;
         $ACCESS_TOKEN = $json["access_token"]; 
     } 
     else{

         $ACCESS_TOKEN =  $_SESSION["access_token"]; 
     }

    //构建请求二维码参数
    //path是扫描二维码跳转的小程序路径，可以带参数?id=xxx
    //width是二维码宽度
    $qcode ="https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=$ACCESS_TOKEN";
    $param = json_encode(array("path"=>$path,"width"=> 150));

    //POST参数
    $result = $this->httpRequest( $qcode, $param,"POST");
    //生成二维码
    file_put_contents("ewm.png", $result);
    return 'https://dianshi.ait114.com/think-5.0.7/public/static/ewm.png';
   }
  
  //把请求发送到微信服务器换取二维码
     public function httpRequest($url, $data='', $method='GET'){
        $curl = curl_init();  
        curl_setopt($curl, CURLOPT_URL, $url);  
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);  
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);  
        curl_setopt($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);  
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);  
        curl_setopt($curl, CURLOPT_AUTOREFERER, 1);  
        if($method=='POST')
        {
            curl_setopt($curl, CURLOPT_POST, 1); 
            if ($data != '')
            {
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);  
            }
        }

        curl_setopt($curl, CURLOPT_TIMEOUT, 30);  
        curl_setopt($curl, CURLOPT_HEADER, 0);  
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);  
        $result = curl_exec($curl);  
        curl_close($curl);  
        return $result;
      } 
}