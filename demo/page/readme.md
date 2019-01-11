接口规范

添加删除修改接口返回格式JSON
{
	success：true||false,
	message:"成功或失败消息信息"
}
表格查询接口返回格式JSON
{
	data：[{a:1，b:2},{a:2,b:2}],--表格显示数据
	total:count 查询的总条数，前天分页统计用
}
