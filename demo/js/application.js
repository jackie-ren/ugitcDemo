(function(){

var app={
	ctx: window.ctx,
	/**
         * 通用ajax方法
         * 自动在url前加 项目名
         * @param options 和$.ajax参数一样
         * @createBy wencai.ren
         * @createDate 2018-07-17
         */
        commonAjax: function(options) {
            var defaultOptions = {

            };
            options.url = this.ctx + options.url;
            options = $.extend(defaultOptions, options);

            return $.ajax(options);
        },
        loading: {
            show: function(target){
                target = target || $("body");
                var loadDiv = target.data("pverlay");
                if(!loadDiv){
                    loadDiv = $("<div class='pageOverlay-load'></div>");
                    if(target.get(0).nodeName == "BODY"){
                        loadDiv.css("position", "fixed")
                    }
                    target.append(loadDiv);
                    // 记录显示次数
                    target.data("showNum", 0);
                    target.data("pverlay", loadDiv);
                }
                if(target.data("showNum") == 0){
                    loadDiv.show();
                    var oldOptions = app.defaults.loading;
                    var options = $.extend({}, oldOptions);
                    var ratio = 0.2;
                    //options.lines = parseInt(oldOptions.lines * ratio);
                    options.width = parseInt(oldOptions.width * ratio);
                    options.radius = parseInt(oldOptions.radius * ratio);
                    var spinner = new Spinner(options).spin(target.get(0));
                    target.data("spinner", spinner);
                    //return spinner;
                }
                target.data("showNum", target.data("showNum") + 1);

            },

            hide: function(target){
                // 延迟一毫秒防止ie8卡顿时的点击
                setTimeout(function(){
                    target = target || $("body");
                    target.data("showNum", target.data("showNum") - 1);
                    if(target.data("showNum") == 0){
                        target.data("pverlay").hide();
                        target.data().spinner.stop();
                    }
                }, 1);

            }
        },
        /*
        *数据格式转化
        */
        formatRows:function(data){
        	$(data).each(function(){
        		app.formatRow(this);
        	})
        	return data;
        },
        /**
        *数据格式化
        */
        formatRow:function(data){
            // 数据对象格式 key是转换后的名称，value是需要转换的名称
            var contrast = {
                typeName: ['XAT_ObjectType_NAME', 'XAT_OBJECTTYPE_NAME', 'XAT_ObjectType_Name','TYPENAME'],
                // 如果有多个别名则使用数组
                typeId: ['XAT_ObjectType', 'XAT_OBJECTTYPE'],
                statusId: ['XAT_Status', 'XAT_STATUS'],
                statusName: 'XAT_Status_NAME',
                name: ['XAT_Name', 'XAT_NAME'],
                id: ['XAT_ID', 'XAT_Id', 'XOID','ID'],
                code: 'XAT_Code'
            };
            for(var k in contrast){
                var attrs=contrast[k];
                if($.isArray(attrs)){
                    $(attrs).each(function(){
                        data[k] !== undefined || (data[k] = data[this]);
                    });
                }else{
                    data[k] !== undefined || (data[k] = data[attrs]);
                }
            }
        	//
        	return data;
        }
        /**
         *
         * @param data 需要遍历的节点数组
         * @param callback 每个节点的回调函数  return false; 停止遍历
         * @param parent 父节点 根节点不传或传null
         * @param level 层级
         * @createBy wencai.ren
         * @createDate 2018-07-17
         */
        eachTree: function(data, callback, parent, level){
            var _this = this;
            level = level || 0;
            for(var a = 0; a < data.length; a++){
                var node = data[a];
                if(callback.call(node, node, parent, a, level, data) === false){
                    return false;
                }
                if (node.children && node.children.length) {
                    if(this.eachTree(node.children, callback, node, level+1) === false){
                        return false;
                    }
                }

            }

        },
        /**
         * 解析URL参数
         * @param url 要解析的url地址
         * @return JSON格式的参数
         * @createBy wencai.ren
         * @createDate 2018-07-17
         */
        parseParams: function(url) {
            if (url.indexOf("?") != -1) {
                url = url.substr(url.indexOf("?") + 1);
            }
            var paramsArr = url.match(/[^\?\=\&]*\=[^\?\=\&]*/g);
            var params = {};
            if (paramsArr != null) {
                $.each(paramsArr, function() {
                    var kv = this.split("=");
                    params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
                });
            }
            return params;
        },
        /**
         * 给一个url添加参数
         * @param url 要添加参数的url
         * @param params 要添加的参数对象 Object
         * @param isUrl 是否url，默认true, 为true不存在？则会自动添加？ false则不会添加
         */
        addUrlParams: function(url, params, isUrl){
            if(isUrl !== false && url.indexOf("?") == -1){
                url += "?";
            }
            for(var item in params){
                var value = params[item];
                if(typeof(value) === "object"){
                    value = JSON.stringify(value);
                }
                if(!url || (url.substr(url.length - 1) != "&" && url.substr(url.length - 1) != "?")){
                    url += "&";
                }
                url += decodeURIComponent(item) + "=" + encodeURIComponent(value);
            }
            return url;
        },
        /**
         * 初始化
         * @createBy TanYong
         * @createDate 2015-06-23
         */
        init: function() {

            $.ajaxSetup({
                xhrFields: {
                    //withCredentials: true
                },
                _beforeSend: function(){
                    if(this.loading){
                        app.loading.show(this.loading === true ? null : this.loading);
                    }
                },
                beforeSend: function(){
                    this._beforeSend.apply(this, arguments);
                },
                _complete: function(e){
                    if(this.loading){
                        app.loading.hide(this.loading === true ? null : this.loading);
                    }
                    if(e.responseJSON && e.responseJSON.isLogin === false){
                        window.top.location.href = e.responseJSON.forward ||  window.ctx + "/login.jsp"
                    }
                    if (e.responseJSON && e.responseJSON.redirectUrl) {
                        window.top.location.href = e.responseJSON.redirectUrl;
                    }
                },
                complete: function(){
                    this._complete.apply(this, arguments);
                },
                dataType: "JSON",
                contentType: "application/x-www-form-urlencoded",
                method: "POST",
                cache: false,
                error: function() {
                    app.showMessage(app.lang.message.error);
                }
            });
            this.params = this.parseParams(window.location.search);
        },
        /**
         * 通用弹框
         * @param option.params 是扩展参数，设置后在子页面可以通过app.iframeLoad时间获取到
         *          option.close 打开iframe页面关闭的回调函数， 在iframe页面可以通过设置window.dialogReturn来设置要返回给close方法的参数
         * @createBy ChenXiang
         * @createDate 2015-06-23
         */
        showDialog: function(option) {
            this.dilogCount = this.dilogCount || 1;
            var $dialog = $('<div class="di-a"></div>');
            var defualt = {
                //title: app.lang.message.title,
                title: "",
                width: 400,
                height: 200,
                closed: false,
                modal: true,
                shadow: false,
                params: {},
                close: $.noop,
                onMove: function(left,top){
                    if(top<=0){
                        $(this).panel("resize",{top:10})
                    }
                }
            };
            var options = $.extend(defualt, option);
            if($(window).height() < options.height + 18 ){
                options.top = 0 ;
            }
            var $iframe = $('<iframe frameborder="0" src=' + app.ctx + options.url + ' style="width:100%;height:100%;vertical-align: middle;"></iframe>');
            $dialog.append($iframe);
            options.onClose = function(){
                var iframeEle = $(this).find("iframe").get(0);
                $(this).window("options").close.call(this, iframeEle.contentWindow.dialogReturn);
                app.removeIframe($(iframeEle));
                iframeEle = null;
                $dialog.remove();
            };
            $iframe.onIframeLoad(function(){

                if(this.contentWindow.windowHW){
                    $dialog.panel("resize", this.contentWindow.windowHW);
                    $dialog.window("center");
                    if($dialog.panel("options").top<0){
                        $dialog.panel("resize",{top:0});
                    }
                }
                if(this.contentWindow.app){
                    app._iframeOnload(this, options.params);
                }


            });

            $dialog.dialog(options);
        },
        /**
		 * 从右下角弹出一个消息框
		 * @param content 内容
		 * @param title 标题 可以为空
		 */
		showMessage: function(content, title) {
            if(!$.messager){
                alert(content);
                return;
            }
			$.messager.show({
				title: title || app.lang.message.title,
				msg: content,
				timeout: 3000,
				showType: 'slide'
			});
		}
    };
}
})();