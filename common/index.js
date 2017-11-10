$(function() {
    /*
    *   左侧可伸缩导航栏
    * */
    var Accordion = function(el, multiple) {
        this.el = el || {};
        this.multiple = multiple || false;

        // Variables privadas
        var links = this.el.find('.link');
        // Evento
        links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
    };

    Accordion.prototype.dropdown = function(e) {
        var $el = e.data.el;
        $this = $(this),
            $next = $this.next();

        $next.slideToggle();
        $this.parent().toggleClass('open');

        if (!e.data.multiple) {
            $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
        };
    };

    let accordion = new Accordion($('#accordion'), false);


    /*
     *   左侧伸缩导航栏路径
     * */
    let commonUrl = "http://192.168.1.140:6366";

    let url = [
        [
            {
                "name":"经营概况",
                "url":"html/statistics/overview.html",
            },
        ],
        [
            {
                "name":"设备列表",
                "url":"html/fm/fm.html",
            },
        ],
        [
            {
                "name":"代理商列表",
                "url":"html/agents/agents.html",
            },
        ],
        [
            {
                "name":"业务分成列表",
                "url":"html/dividedInto/dividedInto.html",
            },
            {
                "name":"待审核业务分成",
                "url":"html/dividedInto/dividedInto_audit.html",
            },
        ],
        [
            {
                "name":"账号管理",
                "url":commonUrl + "/page/account/account.html",
            },
            {
                "name":"添加账号",
                "url":commonUrl + "/page/account/account_add.html",
            },
            {
                "name":"角色管理",
                "url":commonUrl + "/page/character/character.html",
            },
            {
                "name":"添加角色",
                "url":commonUrl + "/page/character/character_add.html",
            },
            // {
            //     "name":"角色权限修改",
            //     "url":commonUrl + "/page/character/character_edit.html",
            // },
            {
                "name":"操作日志管理",
                // "url":commonUrl + "/page/account/account.html",
            },
            {
                "name":"修改密码",
                "url":commonUrl + "/repass.html",
            }
        ],
    ];
    /*
    *   根据li的index来判断读取数组中的第几层
    * */

    $(".accordion").on("click",'.submenu a',function(){
        const oneIndex = $(this).parent().parent().parent().index();
        const twoIndex = $(this).parent().index();
        if(!url[oneIndex]){
            layer.msg("暂无路径");
            return;
        }
        const urlUrl = url[oneIndex][twoIndex].url;
        $("#iframe").attr("src",urlUrl);
    });
});

