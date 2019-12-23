<?php
namespace app\index\controller;

use think\Db;
class Offer
{
	//首页数据
    public function index()
    {
        $types = Db::table('types')->where('pid',0)->select();

      	if(input('page') == 0){
        	$page = 0;
          	$limit = input('limit');
        }else{
        	$page = input('page') * input('limit');
          	$limit = input('limit');
        }
		
      	if(input('time') == 0){
        	$res = Db::table('offer')->limit($page,$limit)->select();
        }else{
        	$res = Db::table('offer')->order('time','desc')->limit($page,$limit)->select();
        }
      	
      	foreach($res as $k=>$v){
        	
        	$res[$k]['deadline'] = explode(' ',$v['deadline'])[0];
          
        }

        $data['types'] = $types;

        $data['res'] = $res;

    	return json_encode($data);
    }

    //单个分类数据
    public function list()
    {
      	if(input('page') == 0){
        	$page = 0;
          	$limit = input('limit');
        }else{
        	$page = input('page') * input('limit');
          	$limit = input('limit');
        }
      
    	$pid = input('pid');

    	$types = Db::table('types')->where('pid',$pid)->select();

    	$lists = [];

    	foreach($types as $k=>$v){

    		if(input('time') == 0){

    			$list = Db::table('offer')->where('typesid',$v['id'])->limit($page,$limit)->select();

    		}else{

    			$list = Db::table('offer')->where('typesid',$v['id'])->order('time','desc')->limit($page,$limit)->select();

    		}

    		foreach($list as $key=>$value){

    			array_push($lists,$value);

    		}

    	}

    	$data['type'] = Db::table('types')->where('pid',0)->select();

    	$data['subtype'] = Db::table('types')->where('pid != 0')->select();

    	$data['lists'] = $lists;

    	return json_encode($data);
    }

    //分类筛选
    public function screens()
    {
    	if(input('id') != 0){

    		$data['type'] = Db::table('types')->where('id',input('id'))->select();

    		$data['subtype'] = Db::table('types')->where('pid',input('id'))->select();

    	}else{

    		$data['type'] = Db::table('types')->where('pid',0)->select();

    		$data['subtype'] = Db::table('types')->where('pid != 0')->select();
    	}

    	return json_encode($data);
    }

    //筛选过的数据
    public function lists()
    {
        if(input('page') == 0){
        	$page = 0;
          	$limit = input('limit');
        }else{
        	$page = input('page') * input('limit');
          	$limit = input('limit');
        }
      
    	if(input('time') == 0){
			if(input('id') == 0){
              	//$res = Db::table('offer')->limit($page,$limit)->select();
              	$res = self::scrn(input('pid'),input('time'),$page,$limit);
            }else{
            	$res = Db::table('offer')->where('typesid',input('id'))->limit($page,$limit)->select();
            }
    	}else{
			if(input('id') == 0){
    			//$res = Db::table('offer')->limit($page,$limit)->order('time','desc')->select();
              	$res = self::scrn(input('pid'),input('time'),$page,$limit);
            }else{
            	$res = Db::table('offer')->where('typesid',input('id'))->limit($page,$limit)->order('time','desc')->select();
            }
    	}

    	return json_encode($res);
    }
  
  	static public function scrn($pid,$time,$page,$limit)
    {
    	$types = Db::table('types')->where('pid',$pid)->select();

    	$lists = [];

    	foreach($types as $k=>$v){

    		if($time == 0){

    			$list = Db::table('offer')->where('typesid',$v['id'])->limit($page,$limit)->select();

    		}else{

    			$list = Db::table('offer')->where('typesid',$v['id'])->order('time','desc')->limit($page,$limit)->select();

    		}

    		foreach($list as $key=>$value){

    			array_push($lists,$value);

    		}

    	}
      
      	return $lists;
    }
  
  	//岗位详情
  	public function part()
    {
    	$res = Db::table('offer')
          ->join('user','user.id = offer.uid')
          ->where('offer.id',input('id'))
          ->find();
      
      	$status = Db::table('apply')->where('uid',input('uid'))->where('oid',input('id'))->find();
      
      	if($status){
        	$res['status'] = 2;
        }else{
        	$res['status'] = 1;
        }
      	
      	$res['deadline'] = explode(' ',$res['deadline'])[0];
      
      	return json_encode($res);
    }
  
  	//检查用户是否完善简历
  	public function speed()
    {
    	$user = Db::table('user')->where('id',input('uid'))->find();
      
      	if($user['speed'] == 6){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//申请职位
  	public function apply()
    {
      	$arr = [
        	'uid'=>input('uid'),
          	'oid'=>input('oid'),
          	'created_at'=>date('Y-m-d H:i:s',time())
        ];
      
    	$res = Db::table('apply')->insert($arr);
      
      	if($res){
        	return 1;
        }else{
        	return 0;
        }
          
    }
  
  	//全部人才
  	public function personnel()
    {
      	if(input('page') == 0){
        	$page = 0;
          	$limit = input('limit');
        }else{
        	$page = input('page') * input('limit');
          	$limit = input('limit');
        }
      	
      	if(input('time') == 0){
        	$personnel = Db::table('user u')
              ->join('personnel p','p.uid = u.id')
              //->join('types t','t.id like p.tid')
              ->where('p.state',1)
              ->limit($page,$limit)
              ->field('user.*,personnel.*')
              ->select();
        }else{
        	$personnel = Db::table('user u')
              ->join('personnel p','p.uid = u.id')
              ->join('types t','t.id like p.tid')
              ->where('p.state',1)
              ->order('time','desc')
              ->limit($page,$limit)
              ->field('types.name,user.*,personnel.*')
              ->select();
        }
    	
      	foreach($personnel as $k=>$v){
          	$tid = rtrim($v['tid'],',');
        	$label = explode(',',$tid);
          	$arr = [];
          	foreach($label as $key=>$value){
            	$arr[$key] = Db::table('types')->where('id',$value)->find()['name'];
            }
          	$personnel[$k]['label'] = $arr;
        }
      
      	//$data['type'] = Db::table('types')->where('pid',0)->select();

    	//$data['subtype'] = Db::table('types')->where('pid != 0')->select();
      
      	return json_encode($personnel);
    }
  
  	//单个分类人才
  	public function single()
    {
      	if(input('page') == 0){
        	$page = 0;
          	$limit = input('limit');
        }else{
        	$page = input('page') * input('limit');
          	$limit = input('limit');
        }
      
      	$type = Db::table('types')->where('pid',input('pid'))->select();

      	$data['personnel'] = [];
      
      	$id = [];

      	foreach($type as $k=>$v){
        	$personnel = Db::table('user u')
              ->join('personnel p','p.uid = u.id')
              //->join('types t','t.id = p.tid')
              ->where('p.tid','like','%'.$v['id'].'%')
              ->where('p.state',1)
              ->limit($page,$limit)
              ->field('user.*,personnel.*')
              ->select();

          	foreach($personnel as $key=>$value){
				if($data['personnel'] == [] || !in_array($value['id'],$id)){
                $tid = rtrim($value['tid'],',');
                $label = explode(',',$tid);
                $arr = [];
                foreach($label as $keys=>$values){
                   $arr[$keys] = Db::table('types')->where('id',$values)->find()['name'];
                }
                $personnel[$key]['label'] = $arr;

                array_push($data['personnel'],$personnel[$key]);
                array_push($id,$personnel[$key]['id']);
                }
            }
        }

      	$data['type'] = Db::table('types')->where('pid',0)->select();

    	$data['subtype'] = Db::table('types')->where('pid != 0')->select();
      
      	return json_encode($data);
    }
  	
  	//人才筛选
  	public function talent()
    {
      	if(input('page') == 0){
        	$page = 0;
          	$limit = input('limit');
        }else{
        	$page = input('page') * input('limit');
          	$limit = input('limit');
        }
      
    	if(input('time') == 0){
          	if(input('tid') == 0){
            	//$personnel = Db::table('user u')
                  //->join('personnel p','p.uid = u.id')
                  //->join('types t','t.id = p.tid')
                  //->where('p.state',1)
                  //->limit($page,$limit)
                  //->field('types.name,user.*,personnel.*')
                  //->select();
              	$personnel = self::tanl(input('pid'),input('time'),$page,$limit);
            }else{
              	
              
            	$personnel = Db::table('user u')
                  ->join('personnel p','p.uid = u.id')
                  //->join('types t','t.id like p.tid')
                  ->where('p.tid','like','%'.input('tid').'%')
                  ->where('p.state',1)
                  ->limit($page,$limit)
                  ->field('user.*,personnel.*')
                  ->select();
            }
        }else{
          	if(input('tid') == 0){
            	//$personnel = Db::table('user u')
                  //->join('personnel p','p.uid = u.id')
                  //->join('types t','t.id = p.tid')
                  //->where('p.state',1)
                  //->order('p.time','desc')
                  //->limit($page,$limit)
                  //->field('types.name,user.*,personnel.*')
                 // ->select();
              	$personnel = self::tanl(input('pid'),input('time'),$page,$limit);
            }else{
            	$personnel = Db::table('user u')
                  ->join('personnel p','p.uid = u.id')
                  //->join('types t','t.id like p.tid')
                  ->where('p.tid','like','%'.input('tid').'%')
                  ->where('p.state',1)
                  ->order('p.time','desc')
                  ->limit($page,$limit)
                  ->field('user.*,personnel.*')
                  ->select();
            }
        }
      
      	foreach($personnel as $k=>$v){
          	$tid = rtrim($v['tid'],',');
        	$label = explode(',',$tid);
          	$arr = [];
          	foreach($label as $key=>$value){
            	$arr[$key] = Db::table('types')->where('id',$value)->find()['name'];
            }
          	$personnel[$k]['label'] = $arr;
        }

      	return json_encode($personnel);
    }
  
  	static public function tanl($pid,$time,$page,$limit)
    {
    	$type = Db::table('types')->where('pid',$pid)->select();
      
      	$data = [];
      
      	foreach($type as $k=>$v){
          if($time == 0){
          	$personnel = Db::table('user u')
              ->join('personnel p','p.uid = u.id')
              ->join('types t','t.id = p.tid')
              ->where('p.tid',$v['id'])
              ->where('p.state',1)
              ->limit($page,$limit)
              ->field('types.name,user.*,personnel.*')
              ->select();
          }else{
          	$personnel = Db::table('user u')
              ->join('personnel p','p.uid = u.id')
              ->join('types t','t.id = p.tid')
              ->where('p.tid',$v['id'])
              ->where('p.state',1)
              ->order('p.time','desc')
              ->limit($page,$limit)
              ->field('types.name,user.*,personnel.*')
              ->select();
          }
        	
          	foreach($personnel as $key=>$value){

    			array_push($data,$value);

    		}
        }
      
      	return $data;
    }
  
  	//修改展示自己状态
  	public function save()
    {
    	if(input('state') == 0){
        	$state = 2;
        }else{
        	$state = 1;
        }
      
      	$res = Db::table('personnel')->where('uid',input('uid'))->update(['state'=>$state]);
      
      	if($res){
        	return 1;
        }else{
        	return 2;
        }
    }
  
  	//查询展示自己状态
  	public function lookup()
    {
    	$res = Db::table('personnel')->where('uid',input('uid'))->find()['state'];
      	
      	if($res){
        	return json_encode($res);
        }else{
        	return 3;
        }
    }
}
