<?php
namespace app\index\controller;

use think\Db;
class Chat
{
  	//消息数
  	public function number()
    {
    	$data['notice'] = Db::table('notice')->where('uid',input('uid'))->where('state',1)->count();
      
      	$data['private'] = 0;
      
      	return json_encode($data);
    }
  
	public function notice()
    {
      	$arr = [
        	'state'=>1,
          	'uid'=>input('uid')
        ];
      
      	$data['system'] = Db::table('notice')->where('type',4)->where($arr)->count();
      
    	$data['likes'] = Db::table('notice')->where('type',1)->where($arr)->count();
      
      	$data['message'] = Db::table('notice')->where('type',2)->where($arr)->count();
      
      	$data['follow'] = Db::table('notice')->where('type',3)->where($arr)->count();
      
      	$data['count'] = $data['likes'] + $data['message'] + $data['follow'] + $data['system'];
      
      	return json_encode($data);
    }
  
  	public function news()
    {
      	if(input('type') == 4){
        	$res = Db::table('notice')->where(['uid'=>input('uid'),'type'=>4])->select();
        }else{
        	$res = Db::table('user u')
              ->join('notice n','u.id = n.user')
              ->where('n.uid',input('uid'))
              ->where('n.type',input('type'))
              ->select();
        }
      
      	foreach($res as $k=>$v){
        	if($v['state'] == 1){
            	Db::table('notice')->where('id',$v['id'])->update(['state'=>2]);
            }
        }

      	if($res){
        	return json_encode($res);
        }else{
        	return 2;
        }
    }
}
?>