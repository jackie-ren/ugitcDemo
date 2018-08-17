文档需求
	项目环境
		需要支持的浏览器(如果兼容ie,需要支持的ie最低版本)
		是否需要支持多语言
		


是否需要支持多语言

css优化
减少在js内些css样式,
能用css做的动画尽量不用js做,提升流畅度,

js优化
策略模式,访问者模式
尽量少写ifelse,三元表达式运行更快
代码低耦合,高内聚(单一原则)使代码更容易扩展,美观易读

--还没有实现的功能用--标注
jquery 封装（扩展）
	按需求扩展jQuery对象方法
	onIframeLoad

easyui 封装（扩展）
	1.数据表格方法扩展.
	2.属性表格方法扩展.
	3.菜单方法扩展。
	4.数据表格封装。(nDatagrid,nTreegrid)--jQuery对象扩展
	5.消息弹框封装 (封装到常用方法里使用app调用)
常用方法封装（app方法，使用app调用）
	1.ajax封装 (commonAjax)
	2.加载遮罩层 (loading)
	3.数据格式化方法 （formatRows,formatRow）
	4.树形结构数据处理方法 (eachTree)
	5.url参数解析方法 (parseParams)
	6.url添加参数方法 (addUrlParams)
	7.页面弹框方法封装 (showDialog)
	8.页面右下角消息弹框 （showMessage）
	8.表头列格式化 (formatColumns)
	9.属性表格封装 (--proGrid)
	10.tab页添加方法封装 （--createTabs）

附加功能
	菜单按钮工具开发（菜单按钮可配置化）