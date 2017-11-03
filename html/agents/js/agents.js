
    let pageNum = 10//每次页数
        ,paGe = 1   //第几页  修改时，出现在被修改页面
        ,keyword = []  //搜索内容
        ,flag = null;   // 分页赋值

    $(document).ready(function(){
        list.list(paGe,pageNum);

        $("#search").on("click",function(){
            list.list(paGe,pageNum);
        })
    });

    /*
     *   列表、搜索、跳转
     * */

    let list = {
        list:function(page,size){
            let pageCount,vpage;   //初始的
            //开始时显示数据
            let dataObject = {
                page:page,
                size:size
            };

            // 添加搜索条件
            $.each($('#newForm .form-control'),function(index,val){
                if($(val).val().length > 0){
                    dataObject[$(val).attr("name")] = $(val).val();
                }
            });

            $.ajax({
                type:'get',
                url: url + robotAgent + version1 +'/agent/list.json',
                data:dataObject,
                dataType:'json',
                success:function(data){
                    const list = $(".list");  //将选择器赋值给常量
                    list.empty();  //清空
                    if(data.code === 200){
                        let listData = '';
                        $.each(data.data.items,function(i,d){
                            listData += `<tr>
                                    <td><input type="checkbox" onclick="checkDown(this)"></td>
                                    <td>${ i + 1 }</td>
                                    <td>${ noTd(d.agentUsername) }</td>
                                    <td>${ noTd(d.agentName) }</td>
                                    <td class="operating"><a onclick="list.toView(this)" href="javascript:" class="bg success">查看</a></td>
                                    <td>${ agentsLevel(d.level) }</td>
                                    <td>${ noTd(d.ratio) }%</td>
                                    <td>${ noTd(d.linkName) }</td>
                                    <td>${ noTd(d.phone) }</td>
                                    <td>${ noTd(d.email) }</td>
                                    <td>${ noTd(d.address) }</td>
                                    <td>${ noTd(d.parentAgentName) }</td>
                                    <td class="operating"><a class="bg success">编辑</a></td>
                                </tr>`
                        });
                        list.append(listData);

                        //分页
                        pageCount = data.data.totalPages;
                        vpage = pageCount>10?10:pageCount;
                        if(pageCount>1){
                            $('.pages').show();
                            flag = true;
                            initPagination('#pagination',pageCount,vpage,page + 1,function(num,type){
                                if(type === 'change'){
                                    paGe = num - 1;
                                    list(paGe,pageNum,keyword);
                                }
                            });
                        }else{
                            if(flag){
                                paGe = 0;
                                list(paGe,pageNum,keyword);
                                flag = false;
                                $('.pages').hide();
                            }
                        }
                    }else{
                        $('.pages').hide();
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
            });
        },
        pageTo:function(_this){
            let max=parseInt($(_this).parents('.pageGo').siblings('.pagination').find('li.next').prev().text());
            let val=parseInt($(_this).siblings('input').val());
            let num=(val>0?val:1)>max?max:(val>0?val:1);
            paGe = num - 1;
            this.list(paGe,pageNum);
            $(_this).siblings('input').val(num);
        },
        toView:function(){
            layer.open({
                type: 1,
                skin: 'layui-layer-demo', //样式类名
                closeBtn: 0, //不显示关闭按钮
                anim: 2,
                shadeClose: true, //开启遮罩关闭
                content: '<div style="width: 300px;padding: 15px;"><p>设备类型：</p><p>设备型号：</p></div>'
            });
        },
    };

    /*
    *   选择代理设备类型和上级代理商
    *
    * */
    $("#agentsModify").on("click",function(){
    });






