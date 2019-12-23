<?php
namespace app\index\controller;

use think\Db;
class Resume
{
	//个人简历首页
    public function index()
    {

        $user = Db::table('user')->where('id',input('uid'))->find();

    	$res = Db::table('advantage')->where('uid',input('uid'))->find();

        $undergo = Db::table('undergo')->where('uid',input('uid'))->select();
      
      	$education = Db::table('education')->where('uid',input('uid'))->select();
      
      	$honor = Db::table('honor')->where('uid',input('uid'))->select();

        $detail = Db::table('detail')->where('uid',input('uid'))->find();

        $detail['age'] = $user['age'];

        if(!$res){
            $res = '';
        }

        $data = [
            'str'=>$res,
            'undergo'=>$undergo,
            'detail'=>$detail,
          	'education'=>$education,
          	'honor'=>$honor
        ];

    	return json_encode($data);
    }

    public function catDetail()
    {
        $res = Db::table('detail')->where('uid',input('uid'))->find();

        $age = Db::table('user')->where('id',input('uid'))->find();

        $res['age'] = $age['age'];

        return json_encode($res);
    }

    //用户数据修改
    public function doDetail()
    {
        $arr = [
            'uid'=>input('uid'),
            'education'=>input('education'),
            'state'=>input('state'),
          	'realname'=>input('realname'),
          	'school'=>input('school'),
          	'major'=>input('major'),
          	'system'=>input('system'),
          	'photo'=>input('photo')
        ];
      
      	$user = Db::table('user')->where('id',input('uid'))->find();

        $res = Db::table('detail')->where('uid',input('uid'))->find();

        if($res){
          	$users = Db::table('user')->where('id',input('uid'))->update(['age'=>input('age')]);
            $result = Db::table('detail')->where('uid',input('uid'))->update($arr);
        }else{
            $result = Db::table('detail')->insert($arr);
          	$users = Db::table('user')->where('id',input('uid'))->update(['age'=>input('age'),'speed'=>$user['speed'] + 1]);
          	if($user['speed'] + 1 == 6){
            	$this->per_state(input('uid'));
            }
        }

        if($result){
            return 1;
        }else{
            return 2;
        }
    }

    //个人优势页面
    public function advantage()
    {
        $res = Db::table('advantage')->where('id',input('id'))->find();

        return json_encode($res);
    }

    //个人优势数据修改
    public function doAdvantage()
    {
        $id = input('id');

        $uid = input('uid');

        $content = input('content');

        if($id == 0){

            $arr = [
                'uid' => $uid,
                'content' => $content
            ];

          	$user = Db::table('user')->where('id',$uid)->find();
          
            $res = Db::table('advantage')->insert($arr);
          
          	$users = Db::table('user')->where('id',$uid)->update(['speed'=>$user['speed'] + 1]);
          
          	if($user['speed'] + 1 == 6){
            	$this->per_state(input('uid'));
            }

            $lastId = Db::name('advantage')->getLastInsID();

            $result = Db::table('advantage')->where('id',$lastId)->find();

            if($result){
                return json_encode($result);
            }else{
                return false;
            }

        }else{

            $res = Db::table('advantage')->where('id',$id)->update(['content'=>$content]);

            $result = Db::table('advantage')->where('id',$id)->find();

            if($result){
                return json_encode($result);
            }else{
                return false;
            }

        }
        return $id;
    }

    //项目经历添加
    public function addUndergo()
    {
        $uid = input('uid');
        
        $arr = [
            'uid' => input('uid'),
            'project' => input('project'),
            'role' => input('role'),
            'start_time' => input('start_time'),
            'end_time' => input('end_time'),
            'describe' => input('describe'),
          	'contribute'=>input('contribute'),
          	'thumb'=>input('thumb')
        ];
      
      	$undergo = Db::table('undergo')->where('uid',input('uid'))->select();
      
      	if(!$undergo){
          	$user = Db::table('user')->where('id',input('uid'))->find();
        	$users = Db::table('user')->where('id',input('uid'))->update(['speed'=>$user['speed'] + 1]);
          	if($user['speed'] + 1 == 6){
            	$this->per_state(input('uid'));
            }
        }

        $res = Db::table('undergo')->insert($arr);

        if($res){
            return 1;
        }else{
            return 2;
        }
    }

    //项目经历查看
    public function catUndergo()
    {
        $id = input('id');

        $res = Db::table('undergo')->where('id',$id)->find();

      	$res['thumb'] = rtrim($res['thumb'],',');
      	
      	if($res['thumb'] == ''){
        	$res['thumb'] = [];
        }else{
        	$res['thumb'] = explode(',',$res['thumb']);
        }
    
        return json_encode($res);
    }

    //修改项目经历
    public function updateUndergo()
    {
        $id = input('id');

      	//$thumb = Db::table('undergo')->where('id',input('id'))->find()['thumb'];
      
        $arr = [
            'project' => input('project'),
            'role' => input('role'),
            'start_time' => input('start_time'),
            'end_time' => input('end_time'),
            'describe' => input('describe'),
          	'contribute'=>input('contribute'),
          	'thumb'=>input('thumb')
        ];
		
        $res = Db::table('undergo')->where('id',$id)->update($arr);
		
        if($res){
            //$result = Db::table('undergo')->where('id',$id)->find();

            return 1;
        }else{
            return 2;
        }
    }
  
  	//删除项目经历
  	public function delUndergo()
    {
    	$res = Db::table('undergo')->where('id',input('id'))->delete();
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//添加教育经历
  	public function education()
    {
    	$data = input();
      	
      	$education = Db::table('education')->where('uid',input('uid'))->select();
      
      	if(!$education){
        	$user = Db::table('user')->where('id',input('uid'))->find();
          	$users = Db::table('user')->where('id',input('uid'))->update(['speed'=>$user['speed'] + 1]);
          	if($user['speed'] + 1 == 6){
            	$this->per_state(input('uid'));
            }
        }
      
      	$data['created_at'] = date('Y-m-d H:i:s');
      
      	$res = Db::table('education')->insert($data);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
      
      	return json_encode($data);
    }
  
  	//查看教育经历
  	public function cateducation()
    {
    	$res = Db::table('education')->where('id',input('id'))->find();
      
      	return json_encode($res);
    }
  
  	//修改教育经历
  	public function updateEdu()
    {
    	$arr = [
        	'school'=>input('school'),
          	'education'=>input('education'),
          	'system'=>input('system'),
          	'major'=>input('major'),
          	'after'=>input('after'),
          	'start_time'=>input('start_time'),
          	'end_time'=>input('end_time')
        ];
      
      	$res = Db::table('education')->where('id',input('id'))->update($arr);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//删除教育经历
  	public function delEducation()
    {
    	$res = Db::table('education')->where('id',input('id'))->delete();
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//添加曾获荣誉
  	public function honor()
    {
    	$data = input();
      
      	$honor = Db::table('honor')->where('uid',input('uid'))->select();
      
      	if(!$honor){
        	$user = Db::table('user')->where('id',input('uid'))->find();
          	$users = Db::table('user')->where('id',input('uid'))->update(['speed'=>$user['speed'] + 1]);
          	if($user['speed'] + 1 == 6){
            	$this->per_state(input('uid'));
            }
        }
      
      	$data['created_at'] = date('Y-m-d H:i:s');
      
      	$res = Db::table('honor')->insert($data);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//查看曾获荣誉
  	public function catHonor()
    {
    	$res = Db::table('honor')->where('id',input('id'))->find();
      
      	return json_encode($res);
    }
  
  	//删除荣誉
  	public function delHonor()
    {
    	$res = Db::table('honor')->where('id',input('id'))->delete();
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//我的标签
  	public function myLabel()
    {
    	$res = DB::table('personnel')->where('uid',input('uid'))->find();
      
      	$tid = rtrim($res['tid'],',');
      
      	$label = explode(',',$tid);
      
      	$labels = [];
      
      	foreach($label as $k=>$v){
        	$arr = Db::table('types')->where('id',$v)->find();
          
          	array_push($labels,$arr);
        }
      
      	return json_encode($labels);
    }
  
  	//所有标签
  	public function label()
    {
    	$data['type'] = Db::table('types')->where('pid',0)->select();
      
      	$data['subtypes'] = Db::table('types')->where('pid != 0')->select();
      
      	return json_encode($data);
    }
  
  	//修改我的标签
  	public function upLabel()
    {
      	$personnel = Db::table('personnel')->where('uid',input('uid'))->find();
      
      	if($personnel['tid'] == ''){
        	$user = Db::table('user')->where('id',input('uid'))->find();
          	$users = Db::table('user')->where('id',input('uid'))->update(['speed'=>$user['speed'] + 1]);
          	if($user['speed'] + 1 == 6){
            	$this->per_state(input('uid'));
            }
        }
      
    	$res = Db::table('personnel')->where('uid',input('uid'))->update(['tid'=>input('tid')]);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//修改展示状态
  	public function per_state($uid)
    {
    	$res = Db::table('personnel')->where('uid',$uid)->update(['state'=>1]);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
}
