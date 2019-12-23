<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------
use think\Route;

Route::get('index/index','index/index/index');

Route::get('index/index/space','index/index/space');

Route::get('index/type','index/index/type');

Route::get('index/banner','index/index/banner');

Route::get('index/screen','index/index/screen');

Route::get('index/details','index/index/details');

Route::get('index/userdetail','index/index/userdetail');

//关注
Route::get('index/index/follow','index/index/follow');

//取关
Route::get('index/index/cancels','index/index/cancels');

//用户关注列表
Route::get('index/index/followUsers','index/index/followUsers');

//用户粉丝列表
Route::get('index/index/fans','index/index/fans');

//我的页面关注,粉丝,文章数量
Route::get('index/index/myFollow','index/index/myFollow');

//发布文章
Route::post('index/index/release','index/index/release');

//文章评论
Route::post('index/index/message','index/index/message');

//回复评论
Route::post('index/index/reply','index/index/reply');

//点赞
Route::get('index/index/likes','index/index/likes');

//取消点赞
Route::get('index/index/cancleLike','index/index/cancleLike');

//删除文章
Route::get('index/index/del','index/index/del');

//删除评论
Route::get('index/index/delMessage','index/index/delMessage');

//删除回复
Route::get('index/index/delReply','index/index/delReply');

Route::get('index/login','index/login/login');

Route::get('index/resume','index/resume/index');

Route::get('index/catdetail','index/resume/catDetail');

Route::post('index/dodetail','index/resume/doDetail');

Route::get('index/advantage','index/resume/advantage');

Route::post('index/doadvantage','index/resume/doAdvantage');

Route::post('index/addundergo','index/resume/addUndergo');

Route::get('index/catundergo','index/resume/catUndergo');

Route::post('index/updateundergo','index/resume/updateUndergo');

//添加教育经历
Route::get('index/resume/education','index/resume/education');

//修改教育经历
Route::get('index/resume/updateEdu','index/resume/updateEdu');

//删除教育经历
Route::get('index/resume/delEducation','index/resume/delEducation');

//添加曾获荣誉
Route::get('index/resume/honor','index/resume/honor');

//查看曾获荣誉
Route::get('index/resume/catHonor','index/resume/catHonor');

//删除荣誉
Route::get('index/resume/delHonor','index/resume/delHonor');

//查看教育经历
Route::get('index/resume/cateducation','index/resume/cateducation');

//我的标签
Route::get('index/resume/myLabel','index/resume/myLabel');

//所有标签
Route::get('index/resume/label','index/resume/label');

//修改我的标签
Route::get('index/resume/upLabel','index/resume/upLabel');

//删除项目经历
Route::get('index/resume/delUndergo','index/resume/delUndergo');

//修改用户头像昵称
Route::get('index/index/updateUser','index/index/updateUser');

//发布选择父类型页面
Route::get('index/release','index/release/index');

//发布选择子类型页面
Route::get('index/subtypes','index/release/subtypes');

//发布悬赏处理
Route::post('index/reoffer','index/release/reoffer');

//发布展示
Route::post('index/release/reShow','index/release/reShow');

//判断是否显示
Route::get('index/release/isShow','index/release/isShow');

//检查用户是否实名认证
Route::get('index/release/isreal','index/release/isreal');

//悬赏首页
Route::get('index/offer','index/offer/index');

//悬赏单个类型数据列表
Route::get('index/list','index/offer/list');

//人才市场数据
Route::get('index/offer/personnel','index/offer/personnel');

//筛选人才
Route::get('index/offer/talent','index/offer/talent');

//单个分类人才数据
Route::get('index/offer/single','index/offer/single');

//展示自己状态修改
Route::get('index/offer/save','index/offer/save');

//查询展示自己状态
Route::get('index/offer/lookup','index/offer/lookup');

//悬赏筛选
Route::get('index/offer/screens','index/offer/screens');

//悬赏筛选过的数据
Route::get('index/offer/lists','index/offer/lists');

//悬赏按时间排序
Route::get('index/offer/time','index/offer/time');

//悬赏岗位详情
Route::get('index/offer/part','index/offer/part');

//检查用户是否完善简历哦
Route::get('index/offer/speed','index/offer/speed');

//申请职位
Route::get('index/offer/apply','index/offer/apply');

//小程序二维码生成
Route::get('index/image','index/image/image');

//我发布的任务首页
Route::get('index/task','index/task/index');

//删除任务
Route::get('index/task/delOffer','index/task/delOffer');

//任务申请人
Route::get('index/task/candidate','index/task/candidate');

//个人简历详情
Route::get('index/task/message','index/task/message');

//同意申请人
Route::get('index/task/agree','index/task/agree');

//拒绝申请人
Route::get('index/task/refuse','index/task/refuse');

//拒绝完成任务
Route::get('index/task/refuses','index/task/refuses');

//提交评价
Route::post('index/task/comment','index/task/comment');

//我申请的任务
Route::get('index/tasks/index','index/tasks/index');

//用户接受任务
Route::get('index/tasks/accept','index/tasks/accept');

//用户放弃任务
Route::get('index/tasks/giveup','index/tasks/giveup');

//用户完成任务
Route::get('index/tasks/complete','index/tasks/complete');

//发布者确认完成任务
Route::get('index/task/completion','index/task/completion');

//图片上传
Route::post('index/uploads/uploads','index/uploads/uploads');

//评论列表
Route::get('index/evaluate/index','index/evaluate/index');

//通知消息
Route::get('index/chat/notice','index/chat/notice');

//通知消息列表
Route::get('index/chat/news','index/chat/news');

//消息数
Route::get('index/chat/number','index/chat/number');

//微信支付
Route::post('index/payment/pay','index/payment/pay');

//提现余额
Route::get('index/withdarw/withdarw','index/withdarw/withdarw');

//用户余额
Route::get('index/wallet/wallet','index/wallet/wallet');

//增加用户余额
Route::get('index/wallet/addBalance','index/wallet/addBalance');

//实名认证
Route::post('index/wallet/realname','index/wallet/realname');

//产看用户是否实名认证
Route::get('index/wallet/isreal','index/wallet/isreal');

//交易记录
Route::get('index/wallet/record','index/wallet/record');

//交易详情
Route::get('index/wallet/corddetail','index/wallet/corddetail');

//银行卡列表
Route::get('index/wallet/bankcard','index/wallet/bankcard');

//添加银行卡
Route::post('index/wallet/addbank','index/wallet/addbank');

//删除银行卡
Route::get('index/wallet/delbank','index/wallet/delbank');

//每日签到
Route::get('index/sign/sign','index/sign/sign');

//查看用户是否签到
Route::get('index/sign/index','index/sign/index');

//判断用户是否中断连续签到
Route::get('index/sign/interrupt','index/sign/interrupt');