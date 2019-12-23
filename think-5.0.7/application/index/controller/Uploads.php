<?php
namespace app\index\controller;

use think\Db;
class Uploads
{
	public function uploads()
    {
		$file =request()->file("file");
		$info = $file->move(ROOT_PATH.'./public/uploads/');//图片保存路径
		if ($info) {
			return 'https://dianshi.ait114.com/think-5.0.7/public/uploads/'.str_replace('\\', '/', $info->getSaveName());
		}else{
			return false;
		}
    }
}
