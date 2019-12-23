<?php
namespace app\index\controller;

use think\Db;
class Task
{
	//我发布的任务首页
  	public function index()
    {
    	$res = Db::table('offer')->where('uid',input('id'))->select();
      
      	foreach($res as $k=>$v){
        	$res[$k]['isTouchMove'] = false;
        }
      
      	return json_encode($res);
    }
  
  	//删除任务
  	public function delOffer()
    {
		
      	$arr = [
        	'oid'=>input('id'),
          	'completion'=>1
        ];
      
      	$offer = Db::table('apply')->where($arr)->where('status',2)->whereOr('status',5)->select();

      	$res = false;
      
      	if(empty($offer)){
          
        	$res = Db::table('offer')->where('id',input('id'))->delete();
      
      		$result = Db::table('apply')->where(['oid'=>input('id'),'status'=>1])->whereOr(['oid'=>input('id'),'status'=>4])->delete();
        }
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//任务候选人
  	public function candidate()
    {
    	if(input('status') == 0){
        	$res = Db::table('apply a')
              ->join('user u','u.id = a.uid')
              ->where('a.oid',input('oid'))
              ->where('a.status',1)
              ->select();
        }else if(input('status') == 1){
        	$res = Db::table('apply a')
              ->join('user u','u.id = a.uid')
              ->where('a.oid',input('oid'))
              ->where('a.status',2)
              ->whereOr('a.status',5)
              ->select();
        }else if(input('status') == 2){
        	$res = Db::table('user u')
              ->join('apply a','u.id = a.uid')
              ->where('a.oid',input('oid'))
              ->where('a.status',3)
              ->select();
        }else if(input('status') == 3){
        	$res = Db::table('apply a')
              ->join('user u','u.id = a.uid')
              ->where('a.oid',input('oid'))
              ->where('a.status',4)
              ->select();
        }
      
      	return json_encode($res);
    }
  
  	//个人详情
  	public function message()
    {
    	$data['detail'] = Db::table('user u')
          	->join('detail d','d.uid = u.id')
          	->where('u.id',input('uid'))
          	->find();
      
      	$data['advantage'] = Db::table('advantage')->where('uid',input('uid'))->find();
      
      	$data['undergo'] = Db::table('undergo')->where('uid',input('uid'))->select();
      
      	$data['education'] = Db::table('education')->where('uid',input('uid'))->select();
      
      	$data['honor'] = Db::table('honor')->where('uid',input('uid'))->select();
      
      	foreach($data['undergo'] as $k=>$v){
        	if($v['thumb'] != ''){
              	$thumb = rtrim($v['thumb'],',');
            	$data['undergo'][$k]['thumb'] = explode(',',$thumb);
            }
        }
      
      	return json_encode($data);
    }
  
  	//同意申请人
 	public function agree()
    {
    	$arr = [
        	'uid'=>input('uid'),
          	'oid'=>input('oid')
        ];
      
      	$res = Db::table('apply')->where($arr)->update(['status'=>2]);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//拒绝申请人
  	public function refuse()
    {
    	$arr = [
        	'uid'=>input('uid'),
          	'oid'=>input('oid')
        ];
      
      	$res = Db::table('apply')->where($arr)->update(['status'=>6]);
      
      	if($res){
        	return 1;
        }else{
          	return 2;
        }
    }
  
  	//确认完成任务
  	public function completion()
    {
    	$res = Db::table('apply')->where('id',input('id'))->update(['completion'=>2]);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//拒绝完成任务
  	public function refuses()
    {
    	$res = Db::table('apply')->where('id',input('id'))->update(['completion'=>3]);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//提交评价
  	public function comment()
    {
      	if(input('content') == ''){
        	$content = '此用户没有填写评论';
        }else{
        	$content = input('content');
        }
      
      	$arr = [
        	'uid'=>input('uid'),
          	'plzid'=>input('plzid'),
          	'state'=>input('state'),
          	'label'=>input('label'),
          	'photo'=>input('photo'),
          	'content'=>$content,
          	'created_at'=>date('Y-m-d H:i:s',time())
        ];
		
      	$res = Db::table('comment')->insert($arr);
      
      	if($res){
          	Db::table('apply')->where('id',input('oid'))->update(['state'=>2]);
        	return 1;
        }else{
        	return 2;
        }
    }
}