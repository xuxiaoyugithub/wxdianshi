<?php
namespace app\index\controller;

use think\Db;
class Sign
{	
  	//第一天签到加20积分
  	public $integral = 20;
  
  	//查看是否签到
  	public function index()
    {
      	$data = [];
      
      	$user = Db::table('user')->where('id',input('uid'))->find();
      
      	$res = Db::table('sign')->where('uid',input('uid'))->order('created_at','desc')->select();
      	
      	$data['signs'] = [];
      
      	if($res){
        	$data['created_at'] = date('Ymd',$res[0]['created_at']);
          	foreach($res as $k=>$v){
              	array_push($data['signs'],date('Ymd',$v['created_at']));
            }
        }
      
      	$data['today'] = date('Ymd',time());
      
      	$data['series'] = $user['series'];
      
      	return json_encode($data);
    }
  
	//签到
  	public function sign()
    {
      
    	$arr = [
        	'uid'=>input('uid'),
          	'created_at'=>time()
        ];
      
      	$res = Db::table('sign')->insert($arr);
      
      	if($res){
          	$user = Db::table('user')->where('id',input('uid'))->find();
          	
          	if($user['series'] == 0){
            	$integral = $this->integral;
            }else{
            	$integral = $this->integral * ($user['series'] + 1);
            }
          	
          	Db::table('user')->where('id',input('uid'))->update(['integral'=>$user['integral'] + $integral,'series'=>$user['series'] + 1]);
          
          	$result = Db::table('user')->where('id',input('uid'))->find();
          
     		$series = $result['series'];
          
        	return json_encode($series);
        }else{
        	return 2;
        }
    }
  
  	//查看用户是否中断连续签到
  	public function interrupt()
    {
    	$sign = Db::table('sign')->where('uid',input('uid'))->order('created_at','desc')->limit(0,1)->select();
      
      	if($sign){
        	$signs = date('Ymd',$sign[0]['created_at']);
          	$today = date('Ymd',time());
          	if(intval($today) - intval($signs) >= 2){
            	$res = Db::table('user')->where('id',input('uid'))->update(['series'=>0]);
              	if($res){
                    return 1;
                }else{
                    return 2;
                }
            }
        }else{
        	return 2;
        }
      	
    }
}
?>