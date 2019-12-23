<?php
namespace app\index\controller;

use think\Db;
use think\Request;
class Login
{
	public static $appid='wx60c1c9093ef5e766';

	public static $secret='e026ed5ef7247e278a8927c82e7aac9e';

    public function login()
	 {
	 	//授权登录
	 	// $params = input();
	 	$params=Request::instance()->param();
	    $url="https://api.weixin.qq.com/sns/jscode2session?appid=".self::$appid."&secret=".self::$secret."&js_code=".$params['code']."&grant_type=authorization_code";
	    $data=$this->doCurl($url);
	    $user = Db::table('user')->where('openid',$data->openid)->find();
	    if($user){
	    	return json_encode($user);
	    }else{
	    	$info = [
		    	'openid'=>$data->openid,
		    	'avatarurl'=>$params['avatarUrl'],
		    	'province'=>$params['province'],
		    	'city'=>$params['city'],
		    	'nickname'=>$params['nickName']
		    ];
		    $res = Db::table('user')->insert($info);
		    $userId = Db::name('user')->getLastInsID();
          	$per = [
            	'uid'=>$userId,
              	'tid'=>'',
              	'created_at'=>date('Y-m-d H:i:s'),
              	'updated_at'=>date('Y-m-d H:i:s'),
              	'time'=>time()
            ];
          	$personnel = Db::table('personnel')->insert($per);
          	$user = Db::table('user')->where('id',$userId)->find();
		    return json_encode($user);
	    }
	 }

	 public function doCurl($url)
	{
	    $curl = curl_init();
	    // 使用curl_setopt()设置要获取的URL地址
	    curl_setopt($curl, CURLOPT_URL, $url);
	    // 设置是否输出header
	    curl_setopt($curl, CURLOPT_HEADER, false);
	    // 设置是否输出结果
	    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	    // 设置是否检查服务器端的证书
	    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	    // 使用curl_exec()将CURL返回的结果转换成正常数据并保存到一个变量
	    $data = curl_exec($curl);
	    // 使用 curl_close() 关闭CURL会话
	    curl_close($curl);
	    return json_decode($data);
	}
}
