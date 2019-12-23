<?php
namespace app\index\controller;

use think\Db;
class Tasks
{
	public function index()
    {
      	if(input('status') == 0){
        	$status = 1;
        }else if(input('status') == 1){
        	$status = 2;
        }else if(input('status') == 2){
        	$status = 5;
        }else if(input('status') == 3){
        	$status = 3;
        }else if(input('status') == 4){
        	$status = 4;
        }
      
    	//$arr = [
        	//'a.uid'=>input('uid'),
          	//'a.status'=>$status
        //];
      
      	//$res = Db::table('apply')->where($arr)->select();
      
      	$res = Db::table('apply a')
          	  ->join('offer o','o.id = a.oid')
          	  ->join('user u','u.id = o.uid')
              ->where('a.uid',input('uid'))
              ->where('a.status',$status)
          	  ->field('a.*,u.avatarurl,o.*')
              ->select();

      	//$offer = [];
      
      	//foreach($res as $k=>$v){
          	//$offer[$k] = $v['oid'];
        //}
      	
      	//$offer = array_values(array_unique($offer));
      	
      	//$offers = [];
      
      	//foreach($offer as $k=>$v){

        	//$offers[$k] = Db::table('offer')->where('id',$v)->find();
        //}

      	return json_encode($res);
    }
  
  	//用户接受任务
  	public function accept()
    {
    	$arr = [
        	'uid'=>input('uid'),
          	'oid'=>input('oid')
        ];
      
      	$res = Db::table('apply')->where($arr)->update(['status'=>5]);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//用户放弃任务
  	public function giveup()
    {
    	$arr = [
        	'uid'=>input('uid'),
          	'oid'=>input('oid')
        ];
      
      	$res = Db::table('apply')->where($arr)->update(['status'=>4]);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//用户完成任务
  	public function complete()
    {
    	$arr = [
        	'uid'=>input('uid'),
          	'oid'=>input('oid')
        ];
      
      	$res = Db::table('apply')->where($arr)->update(['status'=>3]);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
}
