(function($) {

	// 数据转化通用格式
	/**
	 * @param  {[type]}
	 * @return {[type]}
	 */
	$.fn.formatRow = function(obj) {
		var data = this[0];
		var contrast = {
			typeName: ['XAT_ObjectType_NAME', 'XAT_OBJECTTYPE_NAME', 'XAT_ObjectType_Name', 'TYPENAME'],
			// 如果有多个别名则使用数组
			typeId: ['XAT_ObjectType', 'XAT_OBJECTTYPE'],
			statusId: ['XAT_Status', 'XAT_STATUS'],
			statusName: 'XAT_Status_NAME',
			name: ['XAT_Name', 'XAT_NAME'],
			id: ['XAT_ID', 'XAT_Id', 'XOID', 'ID'],
			code: 'XAT_Code'
		};
		$.extend(contrast, obj);
		for (var k in contrast) {
			var attrs = contrast[k];
			if ($.isArray(attrs)) {
				$(attrs).each(function() {
					data[k] !== undefined || (data[k] = data[this]);
				});
			} else {
				data[k] !== undefined || (data[k] = data[attrs]);
			}
		}
		//
		return data;
	};
	//批量数据转化通用格式
	$.fn.formatRows = function(obj) {
		var _this = this;
		_this.each(function() {
			$(this).formatRow(obj);
		});
		return _this
	};
	// GRANT ALL PRIVILEGES ON *.* TO 'jackie'@'%'IDENTIFIED BY '123456' WITH GRANT OPTION;
	// access denied for user 'jackie'@'desktop-bbnltbe'
	/**
	 *序列化表单,返回对象格式数据{name:value,name:value}
	 */
	$.fn.serializes = function() {
		var params = {};
		var data = this.serializeArray();
		$.each(data, function(name, value) {
			var key = this.name;
			var value = this.value;
			if (params[this.name] !== undefined) {
				if (!params[key].push) {
					params[key] = [params[key]];
				}
				params[key].push(value || "");
			} else {
				params[key] = value || "";

			}
		});
		var $radio = $('input[type=radio],input[type=checkbox]', this);
		$.each($radio, function() {
			if (!params.hasOwnProperty(this.name)) {
				params[this.name] = '';
			}
		});
		return params;
	};
	$.fn.validatebox=function(){
		
	}

})(jQuery);