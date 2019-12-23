<?php
namespace app\index\controller;

use think\Db;
class Evaluate
{
	public function index()
    {
		
      	
      	if(input('cur') == 0){
        	$res = Db::table('comment c')
              ->join('user u','c.plzid = u.id')
              ->where('c.uid',input('uid'))
              ->field('c.*,u.nickname,u.avatarurl')
              ->select();
        }else if(input('cur') == 1){
        	$res = Db::table('comment c')
              ->join('user u','c.plzid = u.id')
              ->where('c.uid',input('uid'))
              ->where('c.state > 3')
              ->field('c.*,u.nickname,u.avatarurl')
              ->select();
        }else if(input('cur') == 2){
        	$res = Db::table('comment c')
              ->join('user u','c.plzid = u.id')
              ->where('c.uid',input('uid'))
              ->where('c.state = 3')
              ->field('c.*,u.nickname,u.avatarurl')
              ->select();
        }else if(input('cur') == 3){
        	$res = Db::table('comment c')
              ->join('user u','c.plzid = u.id')
              ->where('c.uid',input('uid'))
              ->where('c.state < 3')
              ->field('c.*,u.nickname,u.avatarurl')
              ->select();
        }
      
      	foreach($res as $k=>$v){
          	$label = rtrim($v['label'],' ');
          	$photo = rtrim($v['photo'],',');
        	$res[$k]['label'] = explode(' ',$label);
          	$res[$k]['photo'] = explode(',',$photo);
        }
      
      	return json_encode($res);
    }
}
