<?php
namespace app\index\controller;

use think\Db;
class Release
{
	//父类型数据
    public function index()
    {
    	$types = Db::table('types')->where('pid',0)->select();

    	return json_encode($types);
    }

    //子类型数据
    public function subtypes()
    {
    	$subtypes = Db::table('types')->where('pid',input('id'))->select();

    	return json_encode($subtypes);
    }

    //发布悬赏
    public function reoffer()
    {
    	if(input('index') == 0){
    		$unit = '小时';
    	}

    	if(input('index') == 1){
    		$unit = '天';
    	}

    	if(input('index') == 2){
    		$unit = '月';
    	}

    	if(input('index') == 3){
    		$unit = '次';
    	}

      	if(input('place') == ''){
        	$place = '不限工作地点';
        }else{
        	$place = input('place');
        }
      
    	$arr = [
    		'uid'=>input('uid'),
    		'username'=>Db::table('user')->where('id',input('uid'))->find()['nickname'],
          	'content'=>input('content'),
    		'details'=>input('details'),
    		'money'=>input('money').'元/'.$unit,
    		'phone'=>input('phone'),
          	'weixin'=>input('weixin'),
    		'title'=>input('title'),
    		'typesid'=>input('typesid'),
    		'deadline'=>input('deadline'),
    		'place'=>$place,
          	'created_at'=>date('Y-m-d H:i:s'),
          	'time'=>time()
    	];

    	$res = Db::table('offer')->insert($arr);

    	return json_encode($res);
    }
  
  	//发布展示
  	public function reShow()
    {
    	$arr = [
        	'uid'=>input('uid'),
          	'tid'=>input('tid'),
          	'created_at'=>date('Y-m-d H:i:s'),
          	'time'=>time()
        ];
      
      	$res = Db::table('personnel')->insert($arr);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//判断用户是否已经发布过展示
  	public function isShow()
    {
    	$res = Db::table('personnel')->where('uid',input('uid'))->find();
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//查看用户是否实名认证
  	public function isreal()
    {
    	$res = Db::table('real')->where('uid',input('uid'))->find();
      
      	if($res){
        	return json_encode($res);
        }else{
        	return 2;
        }
    }
}
