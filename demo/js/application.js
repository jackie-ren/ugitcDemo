(function() {

        window.app = {
            // 项目路径名称
            ctx: window.ctx || "",
            // 当前使用语言数据
            lang: window.appLang,
            // 上层window窗口对象
            parent: window.parent,
            // 父窗口中的iframe元素 如果不在iframe里，为空
            iframeEle: null,

            // iframe窗口 传递的参数
            iframeParams: null,

            // 当前页面URL参数
            params: {},

            // iframe加载完毕事件回调列表
            iframeLoadList: [],

            // iframe加载事件，如果要获取外部传入的值请在此绑定事件
            /**
             * 绑定iframe加载事件 iframeParams获得值将会触发事件
             * @param fn 要绑定的回调
             */
            iframeLoad: function(fn) {
                if ($.isFunction(fn)) {
                    app.iframeLoadList.push(fn);
                    if (app.iframeEle) {
                        fn.call(app, app.iframeParams, app.iframeEle, app.parent);
                    }
                    return;
                }
                $(app.iframeLoadList).each(function() {
                    this.call(app, app.iframeParams, app.iframeEle, app.parent);
                });
            },

            log: function() {
                if (window.console) {
                    window.console.log.apply(window.console, arguments);
                }
            },

            setParent: function(win) {
                this.parent = win;
            },

            /**
             * 从iframe外部设置值 并调用回调事件iframeLoad
             * @param params 设置的参数
             */
            setIframeParams: function(params) {
                this.iframeParams = params;
                this.iframeLoad();
            },

            setIframeEle: function(ele) {
                this.iframeEle = ele;
            },
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
                show: function(target) {
                    target = target || $("body");
                    var loadDiv = target.data("pverlay");
                    if (!loadDiv) {
                        loadDiv = $("<div class='pageOverlay-load'></div>");
                        if (target.get(0).nodeName == "BODY") {
                            loadDiv.css("position", "fixed")
                        }
                        target.append(loadDiv);
                        // 记录显示次数
                        target.data("showNum", 0);
                        target.data("pverlay", loadDiv);
                    }
                    if (target.data("showNum") == 0) {
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

                hide: function(target) {
                    // 延迟一毫秒防止ie8卡顿时的点击
                    setTimeout(function() {
                        target = target || $("body");
                        target.data("showNum", target.data("showNum") - 1);
                        if (target.data("showNum") == 0) {
                            target.data("pverlay").hide();
                            target.data().spinner.stop();
                        }
                    }, 1);

                }
            },
            /*
             *数据格式转化
             */
            formatRows: function(data) {
                $(data).each(function() {
                    app.formatRow(this);
                })
                return data;
            },
            /**
             *数据格式化
             */
            formatRow: function(data) {
                // 数据对象格式 key是转换后的名称，value是需要转换的名称
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
            },
            /**
             *
             * @param data 需要遍历的节点数组
             * @param callback 每个节点的回调函数  return false; 停止遍历
             * @param parent 父节点 根节点不传或传null
             * @param level 层级
             * @createBy wencai.ren
             * @createDate 2018-07-17
             */
            eachTree: function(data, callback, parent, level) {
                var _this = this;
                level = level || 0;
                for (var a = 0; a < data.length; a++) {
                    var node = data[a];
                    if (callback.call(node, node, parent, a, level, data) === false) {
                        return false;
                    }
                    if (node.children && node.children.length) {
                        if (this.eachTree(node.children, callback, node, level + 1) === false) {
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
            addUrlParams: function(url, params, isUrl) {
                if (isUrl !== false && url.indexOf("?") == -1) {
                    url += "?";
                }
                for (var item in params) {
                    var value = params[item];
                    if (typeof(value) === "object") {
                        value = JSON.stringify(value);
                    }
                    if (!url || (url.substr(url.length - 1) != "&" && url.substr(url.length - 1) != "?")) {
                        url += "&";
                    }
                    url += decodeURIComponent(item) + "=" + encodeURIComponent(value);
                }
                return url;
            },
            /**
             * 通用iframe加载完毕方法，向子页面设置参数
             * @param ele iframe节点
             * @param params 要设置到iframe中的参数
             * @private
             */
            _iframeOnload: function(ele, params){
                // 将当前window和iframe元素保存到iframe页面中，方便调用
                if (ele.contentWindow.app) {
                    var iframeWin = ele.contentWindow;
                    iframeWin.app.setIframeEle(ele);
                    iframeWin.app.setIframeParams(params);
                    // 给iframe中class为close加上关闭窗口事件
                    iframeWin.$(".close").click(function(){
                        $(ele).parents(".window-body").window("close");
                    });
                }
            },

            /**
             * 删除iframe并清理内存
             * @param $iframe
             */
            removeIframe: function($iframe){

                if($iframe.size()){
                    var frame = $iframe.get(0);
                    // 如果是http开头则不是本项目中的页面，无法对iframe内的内容进行操作，直接删除
                    if($iframe.attr("src").substr(0, 4) == "http"){
                        $iframe.remove();
                        return;
                    }
                    $iframe.removeIframeLoad();
                    if(frame.contentWindow.app){
                        frame.contentWindow.app = null;
                    }
                    frame.contentWindow.document.write("");
                    frame.contentWindow.close();
                    if(frame.contentWindow.document.clear){
                        frame.contentWindow.document.clear();
                    }
                    frame.contentWindow.CollectGarbage && frame.contentWindow.CollectGarbage();
                    $(frame).attr("src", "about:blank");
                    $(frame).remove();
                    window.CollectGarbage && window.CollectGarbage();
                }
            },
            /**
             * 初始化表单
             * [initForm description]
             * @param  {[type]} form       [表单节点]
             * @param  {[type]} success    [成功回调函数]
             * @param  {[type]} error      [失败回调函数]
             * @param  {[type]} beforeSend [提交前处理事件]
             * @return {[type]}            [description]
             */
            initForm: function(form, success, error, beforeSend) {
                // 覆盖form的submit事件 改为ajax提交
                success = success || $.noop;
                error = error || $.noop;
                beforeSend = beforeSend || $.noop;

                form.submit(function() {
                    // 存在easyui则调用校验
                    if(form.form){
                        // 启用校验并校验
                        form.form("enableValidation");
                        if(!form.form("validate")){
                            return false;
                        }
                    }


                    var dataArr = form.serializeArray();
                    // 最终要提交的数据
                    var data = {};
                    $(dataArr).each(function(){
                        data[this.name] = this.value;
                    });
                    // 调用提交前回调
                    var result = beforeSend.call(this, data);
                    if(result === false){
                        return false;
                    }

                    app.commonAjax({
                        data: data,
                        loading: true,
                        url: form.attr("action"),
                        type: form.attr("method") || "POST",
                        success: function(data) {

                            // 错误处理
                            if (data && data.success === false) {
                                app.showMessage(data.message || app.lang.message.error);
                                error.call(this, data);
                            } else {
                                success.call(this, data);
                            }
                        },
                        error: function() {
                            app.showMessage(app.lang.message.error);
                            error.apply(this, arguments);
                        }
                    });
                    return false;
                });
                // 存在easyui则调用校验相关方法
                if(form.form){
                    form.form("disableValidation");
                    form.find(".validatebox-text").blur(function() {
                        $(this).validatebox("enableValidation").validatebox("validate");
                    }).each(function(){
                        $(this).validatebox("options").tipPosition = "bottom";
                    });
                }

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
                    _beforeSend: function() {
                        if (this.loading) {
                            app.loading.show(this.loading === true ? null : this.loading);
                        }
                    },
                    beforeSend: function() {
                        this._beforeSend.apply(this, arguments);
                    },
                    _complete: function(e) {
                        if (this.loading) {
                            app.loading.hide(this.loading === true ? null : this.loading);
                        }
                        if (e.responseJSON && e.responseJSON.isLogin === false) {
                            window.top.location.href = e.responseJSON.forward || window.ctx + "/login.jsp"
                        }
                        if (e.responseJSON && e.responseJSON.redirectUrl) {
                            window.top.location.href = e.responseJSON.redirectUrl;
                        }
                    },
                    complete: function() {
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
                    onMove: function(left, top) {
                        if (top <= 0) {
                            $(this).panel("resize", { top: 10 })
                        }
                    }
                };
                var options = $.extend(defualt, option);
                if ($(window).height() < options.height + 18) {
                    options.top = 0;
                }
                var $iframe = $('<iframe frameborder="0" src=' + app.ctx + options.url + ' style="width:100%;height:100%;vertical-align: middle;"></iframe>');
                $dialog.append($iframe);
                options.onClose = function() {
                    var iframeEle = $(this).find("iframe").get(0);
                    $(this).window("options").close.call(this, iframeEle.contentWindow.dialogReturn);
                    app.removeIframe($(iframeEle));
                    iframeEle = null;
                    $dialog.remove();
                };
                $iframe.onIframeLoad(function() {

                    if (this.contentWindow.windowHW) {
                        $dialog.panel("resize", this.contentWindow.windowHW);
                        $dialog.window("center");
                        if ($dialog.panel("options").top < 0) {
                            $dialog.panel("resize", { top: 0 });
                        }
                    }
                    if (this.contentWindow.app) {
                        app._iframeOnload(this, options.params);
                    }


                });

                $dialog.dialog(options);
            },
            /**
             * 从右下角弹出一个消息框 并抛出异常
             * @param content 内容
             * @param title 标题 可以为空
             */
            showMessageError: function(content, title) {
                app.showMessage(content, title);
                throw new Error(content);
            },
            /**
             * 从右下角弹出一个消息框
             * @param content 内容
             * @param title 标题 可以为空
             */
            showMessage: function(content, title) {
                if (!$.messager) {
                    alert(content);
                    return;
                }
                $.messager.show({
                    title: title || app.lang.message.title,
                    msg: content,
                    timeout: 3000,
                    showType: 'slide'
                });
            },
            /**
             * 弹出提示框 有确定按钮
             * @param content 提示内容
             * @param success 关闭后的事件 可空
             * @param title 标题 可空
             * @param icon 图标 可空
             */
            showAlert: function(content, success, title, icon) {
                $.messager.alert(title || app.lang.message.title, content, icon, success || $.noop);
            },
            /**
             * 弹出提示框 有确定按钮
             * @param content 提示内容
             * @param success 关闭后的事件
             * @param title 标题 可空
             */
            showConfirm: function(content, success, title) {
                $.messager.confirm(title || app.lang.message.title, content, success);
            },
        };
        window.app.init();
})();