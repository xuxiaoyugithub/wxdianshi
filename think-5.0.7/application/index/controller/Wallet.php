<?php
namespace app\index\controller;

use think\Db;
class Wallet
{
	//查询账户余额
  	public function wallet()
    {
    	$user = Db::table('user')->where('id',input('uid'))->find();
      
      	return json_encode($user);
    }
  
  	//充值成功增加余额
  	public function addBalance()
    {
    	$user = Db::table('user')->where('id',input('uid'))->find();
      	
      	$balance = $user['balance'] + input('total_fee');
      
      	$res  = Db::table('user')->where('id',input('uid'))->update(['balance'=>$balance]);
      
      	$arr = [
        	'uid'=>input('uid'),
          	'state'=>1,
          	'money'=>input('total_fee'),
          	'balance'=>$balance,
          	'content'=>'充值',
          	'time'=>time(),
          	'created_at'=>date('Y-m-d H:i:s')
        ];
      
      	Db::table('record')->insert($arr);
      
      	$brr = [
        	'uid'=>input('uid'),
          	'user'=>0,
          	'content'=>'充值了'.input('total_fee').' 剩余余额 ￥'.$balance,
          	'state'=>4,
          	'created_at'=>date('Y-m-d H:i:s')
        ];
      
      	Db::table('notice')->insert($brr);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//提现成功余额减少
  	public function reduce()
    {
    	$user = Db::table('user')->where('id',input('uid'))->find();
      
      	$balance = $user['balance'] - input('money');
      
      	$res = Db::table('user')->where('id',input('uid'))->update(['balance'=>$balance]);
      
      	$arr = [
        	'uid'=>input('uid'),
          	'state'=>1,
          	'money'=>input('money'),
          	'content'=>'提现',
          	'status'=>2,
          	'balance'=>$balance,
          	'time'=>time(),
          	'created_at'=>date('Y-m-d H:i:s')
        ];
      
      	Db::table('record')->insert($arr);
      
      	$brr = [
        	'uid'=>input('uid'),
          	'user'=>0,
          	'content'=>'提现了'.input('money').' 剩余余额 ￥'.$balance,
          	'state'=>4,
          	'created_at'=>date('Y-m-d H:i:s')
        ];
      
      	Db::table('notice')->insert($brr);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//实名认证
  	public function realname()
    {
    	$arr = [
        	'uid'=>input('uid'),
          	'realname'=>input('realname'),
          	'idnumber'=>input('idnumber'),
          	'contact'=>input('contact'),
          	'positive'=>input('positive'),
          	'back'=>input('back'),
          	'created_at'=>date('Y-m-d H:i:s')
        ];
      
      	$brr = [
        	'uid'=>input('uid'),
          	'name'=>input('realname'),
          	'number'=>input('number'),
          	'type'=>input('type'),
          	'phone'=>input('phone'),
          	'created_at'=>date('Y-m-d H:i:s')
        ];
      
      	$res = Db::table('real')->insert($arr);
      
      	$result = Db::table('bankcard')->insert($brr);
      
      	if($res && $result){
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
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//交易记录
  	public function record()
    {
    	$res = Db::table('record')->where('uid',input('uid'))->order('time','desc')->select();
      
      	return json_encode($res);
    }
  
  	//交易详情
  	public function corddetail()
    {
    	$res = Db::table('record')->where('id',input('id'))->find();
      
      	return json_encode($res);
    }
  
  	//银行卡列表
  	public function bankcard()
    {
    	$res = Db::table('bankcard')->where('uid',input('uid'))->select();
      
      	foreach($res as $k=>$v){
        	$len = strlen($v['number']);
          	$res[$k]['number'] = '**************'.substr($v['number'],$len-5,$len);
        }
      
      	return json_encode($res);
    }
  
  	//添加银行卡
  	public function addbank()
    {
    	$arr = input();

      	$res = Db::table('bankcard')->insert($arr);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//删除银行卡
  	public function delbank ()
    {
    	$res = Db::table('bankcard')->where('id',input('id'))->delete();
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
}
?>