<?php
namespace app\index\controller;

use think\Db;
class Index
{
	//首页数据
    public function index()
    {
      	if(input('page') == 0){
        	$page = 0;
          	$limit = input('limit');
        }else{
        	$page = input('page') * input('limit');
          	$limit = input('limit');
        }
      
    	$res = Db::table('space s')
          ->join('user u','u.id = s.uid')
          ->limit($page,$limit)
          ->field('s.*,u.nickname,u.avatarurl')
          ->select();
      
      	foreach($res as $k=>$v){
        	
        	$res[$k]['content'] = mb_substr($v['content'],0,56);
          
          	$res[$k]['images'] = explode(',',$v['images']);
          
          	$res[$k]['islike'] = Db::table('likes')->where(['uid'=>input('uid'),'sid'=>$v['id']])->find();
          
        }

    	return json_encode($res);
    }
  
  	//数据
  	public function space()
    {
    	$limit = input('page')*input('limit')+1;
      
      	$res = Db::table('space s')
          ->join('user u','u.id = s.uid')
          ->limit(0,$limit)
          ->field('s.*,u.nickname,u.avatarurl')
          ->select();
      
      	foreach($res as $k=>$v){
        	
        	$res[$k]['content'] = mb_substr($v['content'],0,56);
          
          	$res[$k]['images'] = explode(',',$v['images']);
          
        }

      	return json_encode($res);
    }
  
  	//首页轮播图
  	public function banner()
    {
    	$res = Db::table('banner')->select();
      
      	return json_encode($res);
    }

    //首页分类
    public function type()
    {
    	$res = Db::table('type')->select();

    	return json_encode($res);
    }

    //筛选
    public function screen()
    {
      	if(input('page') == 0){
        	$page = 0;
          	$limit = input('limit');
        }else{
        	$page = input('page') * input('limit');
          	$limit = input('limit');
        }
      
        if(input('tid') == 1){
          	if(input('top') == 0){
            	//$res = Db::table('space')->limit($page,$limit)->select();
                $res = Db::table('space s')
                  ->join('user u','u.id = s.uid')
                  ->limit($page,$limit)
                  ->field('s.*,u.nickname,u.avatarurl')
                  ->select();
            }else if(input('top') == 1){
              	$res = [];
            	$users = Db::table('follow')->where('gzid',input('uid'))->select();
              	foreach($users as $k=>$v){
                	$wz = Db::table('space s')
                      ->join('user u','u.id = s.uid')
                      ->where('s.uid',$v['bgid'])
                      ->limit($page,$limit)
                      ->field('s.*,u.nickname,u.avatarurl')
                      ->select();
                  	foreach($wz as $k=>$v){
                    	array_push($res,$wz[$k]);
                    }
                }
            }else{
            	$res = Db::table('space s')
                  ->join('user u','u.id = s.uid')
                  ->where('s.top',input('top'))
                  ->limit($page,$limit)
                  ->field('s.*,u.nickname,u.avatarurl')
                  ->select();
            }
        }else{
        	if(input('top') == 0){
            	$res = Db::table('space s')
                  ->join('user u','u.id = s.uid')
                  ->where('s.tid',input('tid'))
                  ->limit($page,$limit)
                  ->field('s.*,u.nickname,u.avatarurl')
                  ->select();
            }else if(input('top') == 1){
              	$res = [];
            	$users = Db::table('follow')->where('gzid',input('uid'))->select();
              	foreach($users as $k=>$v){
                	$wz = Db::table('space s')
                      ->join('user u','u.id = s.uid')
                      ->where('uid',$v['bgid'])
                      ->where('tid',input('tid'))
                      ->limit($page,$limit)
                      ->field('s.*,u.nickname,u.avatarurl')
                      ->select();
                  	foreach($wz as $k=>$v){
                    	array_push($res,$wz[$k]);
                    }
                }
            }else{
            	$res = Db::table('space s')
                  ->join('user u','u.id = s.uid')
                  ->where('tid',input('tid'))
                  ->where('top',input('top'))
                  ->limit($page,$limit)
                  ->field('s.*,u.nickname,u.avatarurl')
                  ->select();
            }
        }
      
      	foreach($res as $k=>$v){
        	
        	$res[$k]['content'] = mb_substr($v['content'],0,56);
          
          	$res[$k]['images'] = rtrim($v['images'],',');
          
          	$res[$k]['images'] = explode(',',$v['images']);
          
        }

    	return json_encode($res);
    }

    //文章详情页
    public function details()
    {
        $res = Db::table('space s')
          ->join('user u','u.id = s.uid')
          ->where('s.id',input('id'))
          ->field('s.*,u.nickname,u.avatarurl')
          ->find();

      	$res['images'] = rtrim($res['images'],',');
      
      	$res['images'] = explode(',',$res['images']);
      
      	$data['message'] = Db::table('user u')
          ->join('message m','m.uid = u.id')
          ->where('m.sid',input('id'))
          ->select();
      
      	$data['plnum'] = Db::table('message')->where('sid',input('id'))->count();
      
      	$data['reply'] = Db::table('user u')
              ->join('reply r','r.uid = u.id')
              ->where('r.sid',input('id'))
              ->select();
      
      	foreach($data['reply'] as $k=>$v){
          	$user = Db::table('user')->where('id',$v['rid'])->find();
        	$data['reply'][$k]['rnickname'] = $user['nickname'];
          	$data['reply'][$k]['ravatarurl'] = $user['avatarurl'];
        }
      
      	$data['likes'] = Db::table('likes')->where('sid',input('id'))->count();
      
      	$data['isLike'] = Db::table('likes')->where('sid',input('id'))->where('uid',input('uid'))->find();
      
      	$data['res'] = $res;
      
        return json_encode($data);
    }
  
  	//用户详情
 	public function userdetail()
    {
    	$data['user'] = Db::table('user')->where('id',input('uid'))->find();
      
      	$data['scount'] = Db::table('space')->where('uid',input('uid'))->count();
      
      	$data['space'] = Db::table('space')->where('uid',input('uid'))->select();
      
      	$data['follow'] = Db::table('follow')->where('gzid',input('uid'))->count();
      
      	$data['fans'] = Db::table('follow')->where('bgid',input('uid'))->count();
      
      	$arr = [
        	'gzid'=>input('userid'),
          	'bgid'=>input('uid')
        ];
      
      	$res = Db::table('follow')->where($arr)->find();
      
      	if($res){
        	$data['state'] = 1;
        }else{
        	$data['state'] = 0;
        }
      
      	return json_encode($data);
    }
  
  	//关注的人
  	public function followUsers()
    {
    	$data = Db::table('user u')
          	->join('follow f','u.id = f.bgid')
          	->where('f.gzid',input('uid'))
          	->select();
      
      	return json_encode($data);
    }
  
  	//用户粉丝
  	public function fans()
    {
    	$data = Db::table('user u')
          	->join('follow f','u.id = f.gzid')
          	->where('f.bgid',input('uid'))
          	->select();
      
      	foreach($data as $k=>$v){
        	$data[$k]['isfollow'] = Db::table('follow')->where('gzid',input('uid'))->where('bgid',$v['gzid'])->find() ? 2 : 1;
        }
      
      	return json_encode($data);
    }
  
  	//关注
  	public function follow()
    {
    	$arr = [
        	'gzid'=>input('gzid'),
          	'bgid'=>input('bgid')
        ];
      
      	$res = Db::table('follow')->insert($arr);
      
      	$data = Db::table('user u')
          	->join('follow f','u.id = f.gzid')
          	->where('f.bgid',input('bgid'))
          	->select();
      
      	//推送消息
        $array = [
            'uid'=>input('bgid'),
            'user'=>input('gzid'),
            'content'=>'关注了您',
            'type'=>3,
            'created_at'=>date('Y-m-d H:i:s')
        ];
          
        Db::table('notice')->insert($array);
      
      	return json_encode($data);
    }
  
  	//取关
  	public function cancels()
    {
    	$arr = [
        	'gzid'=>input('gzid'),
          	'bgid'=>input('bgid')
        ];
      
      	$res = Db::table('follow')->where($arr)->delete();
      	
      	$data['users'] = Db::table('user u')
          	->join('follow f','u.id = f.gzid')
          	->where('f.bgid',input('bgid'))
          	->select();
      
      	return json_encode($data);
    }
  
  	//我的页面粉丝关注数量
  	public function myFollow()
    {
      	//$data['scount'] = Db::table('space')->where('uid',input('uid'))->count();
      
    	//$data['follow'] = Db::table('follow')->where('gzid',input('uid'))->count();
      
      	//$data['fans'] = Db::table('follow')->where('bgid',input('uid'))->count();
      
      	$data = Db::table('user')->where('id',input('uid'))->find();
      
      	return json_encode($data);
    }
  	
  	//发布文章
  	public function release()
    {
      	if(input('tid') == 2){
        	$css = 1;
        }else{
        	$css = 0;
        }    	
      
    	$arr = [
        	'uid'=>input('uid'),
          	'title'=>input('title'),
          	'content'=>input('content'),
          	'tid'=>input('tid'),
          	'top'=>2,
          	'images'=>input('photo'),
          	'css'=>$css,
          	'created_at'=>date('Y-m-d H:i:s',time())
        ];
      
      	$res = Db::table('space')->insert($arr);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//评论文章
  	public function message()
    {
    	$arr = [
        	'uid'=>input('uid'),
          	'sid'=>input('sid'),
          	'content'=>input('content'),
          	'created_at'=>date('Y-m-d H:i:s'),
        ];
      
      	$res = Db::table('message')->insert($arr);
      
      	if($res){
          	$data['message'] = Db::table('user u')
              ->join('message m','m.uid = u.id')
              ->where('m.sid',input('sid'))
              ->select();
          	$data['plnum'] = Db::table('message')->where('sid',input('sid'))->count();
          	//推送消息
            $user = Db::table('space')->where('id',input('sid'))->find();

            $array = [
                'uid'=>$user['uid'],
                'user'=>input('uid'),
              	'sid'=>input('sid'),
              	'content'=>'评论了您的文章',
                'type'=>2,
                'created_at'=>date('Y-m-d H:i:s')
            ];
          
          	Db::table('notice')->insert($array);
          
          	$plnum = Db::table('space')->where('id',input('sid'))->find()['plnum'];
          
          	Db::table('space')->where('id',input('sid'))->update(['plnum'=>$plnum+1]);
          
        	return json_encode($data);
        }else{
        	return false;
        }
    }
  
  	//回复
  	public function reply()
    {
      	$user = Db::table('user')->where('id',input('rid'))->find();
      
    	$arr = [
        	'uid'=>input('uid'),
          	'rid'=>input('rid'),
          	//'rnickname'=>$user['nickname'],
          	//'ravatarurl'=>$user['avatarurl'],
          	'sid'=>input('sid'),
          	'mid'=>input('mid'),
          	'reid'=>input('reid'),
          	'content'=>input('content'),
          	'created_at'=>date('Y-m-d H:i:s')
        ];
      
      	$res = Db::table('reply')->insert($arr);
      
      	if($res){
          	$data = Db::table('user u')
              ->join('reply r','r.uid = u.id')
              ->where('r.sid',input('sid'))
              ->select();
          
          	foreach($data as $k=>$v){
                $user = Db::table('user')->where('id',$v['rid'])->find();
                $data[$k]['rnickname'] = $user['nickname'];
                $data[$k]['ravatarurl'] = $user['avatarurl'];
            }
          	//推送消息
            //$user = Db::table('space')->where('id',input('sid'))->find();

            $array = [
                'uid'=>input('uid'),
                'user'=>input('rid'),
              	'sid'=>input('sid'),
              	'content'=>'回复了您的评论',
                'type'=>2,
                'created_at'=>date('Y-m-d H:i:s')
            ];
          
          	Db::table('notice')->insert($array);
          	return json_encode($data);
        }else{
        	return false;
        }
    }
  
  	//点赞
  	public function likes()
    {
    	$arr = [
        	'uid'=>input('uid'),
          	'sid'=>input('sid')
        ];
      	
      	$res = Db::table('likes')->insert($arr);
      
      	if($res){
          	//推送消息
            $user = Db::table('space')->where('id',input('sid'))->find();

            $array = [
                'uid'=>$user['uid'],
                'user'=>input('uid'),
              	'sid'=>input('sid'),
              	'content'=>'点赞了您的文章',
                'type'=>1,
                'created_at'=>date('Y-m-d H:i:s')
            ];
          
          	Db::table('notice')->insert($array);
          	
          	$dznum = Db::table('space')->where('id',input('sid'))->find()['dznum'];
          
          	Db::table('space')->where('id',input('sid'))->update(['dznum'=>$dznum+1]);
          
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//取消点赞
  	public function cancleLike()
    {
    	$arr = [
        	'uid'=>input('uid'),
          	'sid'=>input('sid')
        ];
      
      	$res = Db::table('likes')->where($arr)->delete();
      	
      	if($res){
          
          	$dznum = Db::table('space')->where('id',input('sid'))->find()['dznum'];
          
          	Db::table('space')->where('id',input('sid'))->update(['dznum'=>$dznum-1]);
          
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//修改头像昵称
  	public function updateUser()
    {
    	$arr = [
        	'avatarurl'=>input('avatarurl'),
          	'nickname'=>input('nickname')
        ];
      
      	$res = Db::table('user')->where('id',input('uid'))->update($arr);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//删除文章
  	public function del()
    {
      	$m = Db::table('message')->where('sid',input('id'))->select();
      
      	if(!empty($m)){
        	$message = Db::table('message')->where('sid',input('id'))->delete();
        }
      	
      	$r = Db::table('reply')->where('sid',input('id'))->select();
      
      	if(!empty($r)){
        	$reply = Db::table('reply')->where('sid',input('id'))->delete();
        }
      
    	$res = Db::table('space')->where('id',input('id'))->delete();
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//删除评论
  	public function delMessage()
    {
      	$sid = Db::table('message')->where('id',input('id'))->find()['sid'];
      
    	$res = Db::table('message')->where('id',input('id'))->delete();
      
      	if($res){
          	$plnum = Db::table('space')->where('id',$sid)->find()['plnum'];
          
          	Db::table('space')->where('id',$sid)->update(['plnum'=>$plnum-1]);
          
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//删除回复
  	public function delReply()
    {
    	$res = Db::table('reply')->where('id',input('id'))->delete();
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
}
