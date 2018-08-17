/**
*主模块
*/
(function() {
	var ugitc=angular.module("ugang",[]);
	// 初始化
	ugitc.run(['$rootScope','$log','$http',function($rootScope,$log,$http){
		// 定义全局变量
		$rootScope.name="";
	}])
	ugitc.controller("index",["$scope","$element",function($scope,$element){
		console.log("Hello UGITC!");
		var $mygrid=$element.find(".mygrid");
		var $mytabs=$element.find(".mytabs");
		$scope.name="UGITC";
		$mytabs.tabs("add",{
			title:'New Tab',    
		    content:'Tab Body',    
		    closable:true,    
		    tools:[{    
		        iconCls:'icon-mini-refresh',    
		        handler:function(){    
		            alert('refresh');    
		        }    
		    }]
		});
		//,filtrate:true赛选
		$mygrid.datagrid({
			columns:[[
			{field:'ck',checkbox:true},
		        {field:'code',title:'Code',width:200,align:'center'},    
		        {field:'name',title:'Name',width:100,align:'center'},    
		        {field:'price',title:'Price',width:100,align:'center'}    
		    ]],
		    data:[
		    	{code:1,name:"a",price:13},
		    	{code:2,name:"b",price:14},
		    	{code:3,name:"c",price:15},
		    	{code:3,name:"c",price:15},
		    	{code:3,name:"c",price:15},
		    	{code:3,name:"c",price:15},
		    	{code:3,name:"c",price:15},
		    	{code:3,name:"c",price:15},
		    	{code:3,name:"c",price:15},
		    	{code:3,name:"c",price:15},
		    	{code:3,name:"c",price:15},
		    	{code:3,name:"c",price:15},
		    	{code:3,name:"c",price:15},
		    	{code:3,name:"c",price:15},
		    	{code:3,name:"c",price:15},
		    	{code:3,name:"c",price:15},
		    	{code:3,name:"c",price:15},
		    	{code:3,name:"c",price:15},
		    	{code:3,name:"c",price:15},
		    	{code:3,name:"c",price:15},
		    ],
		    pagination:true,//显示分页工具栏
		    fitColumns:true,//网格自适应
		    fit:true,
		    // rownumbers:true,//显示行号列
		    checkbox:true, //显示复选框
		    onClickCell:function(rowIndex, field, value){
		    	debugger;
		    },
		    onHeaderContextMenu:function(e,field){
		    	// debugger;
		    	var $div=$("<div>test</div>");
		    	var call=$(this).datagrid("getColumnOption",field);
		    	if(call.search){
		    		var tmenu = $('<div style="width:100px;"></div>').appendTo('body');
		    	}
		    	debugger;
		    },
		    onRowContextmenu:function(e,rowIndex,rowData){
		    	console.log(rowIndex);
		    }


		});
	}]);
})();