    /*
     *  设备管理
     *
     * */

    // 调用关联时间初始化
    associationTime("#startTime","#endTime");

    let pageNum = 10//每次页数
        ,paGe = 1   //第几页  修改时，出现在被修改页面
        ,keyword = []  //搜索内容
        ,flag = null;   // 分页赋值

    $(document).ready(function(){
        list.list(paGe,pageNum);

        equipment.types("#equipmentType","#equipmentModel",1);  // 设备类型列表
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
                url: url + robotDevice + version1 +'/device/list',
                data:dataObject,
                dataType:'json',
                success:function(data){
                    const list = $(".list");  //将选择器赋值给常量
                    list.empty();  //清空
                    if(data.code === 200){
                        let listData = '';
                        $.each(data.data.items,function(i,d){
                            listData += `<tr>
                            <td><input data-id="${ d.id }" type="checkbox" onclick="checkDown(this)"></td>
                            <td>${ i + 1 }</td>
                            <td>${ noTd(d.deviceId) }</td>
                            <td>${ noTd(d.sequence) }</td>
                            <td>${ noTd(d.mac) }</td>
                            <td>${ noTd(d.appKey) }</td>
                            <td>${ noTd(d.deviceName) }</td>
                            <td>${ noTd(d.typeName) }</td>
                            <td>${ noTd(d.modelName) }</td>
                            <td>${ noTd(d.version) }</td>
                            <td>${ d.online?'在线':'离线' }</td>
                            <td>${ noTd(d.agentName) }</td>
                            <td>${ noTd(d.creator) }</td>
                            <td>${ noTd(d.createTime) }</td>
                            <td>${ noTd(d.Ip) }</td>
                            <td>${ noTd(d.area) }</td>
                            <td>${ noTd(d.oemName) }</td>
                            <td class="operating"><a href="assUser.html" class="bg success">查看</a></td>
                            <td>${ noTd(d.status) }</td>
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
                                    list.list(paGe,pageNum);
                                }
                            });
                        }else{
                            if(flag){
                                paGe = 0;
                                list.list(paGe,pageNum);
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
            const max = parseInt($(_this).parents('.pageGo').siblings('.pagination').find('li.next').prev().text());
            const val = parseInt($(_this).siblings('input').val());
            const num = (val>0?val:1)>max?max:(val>0?val:1);
            paGe = num - 1;
            this.list(paGe,pageNum);
            $(_this).siblings('input').val(num);
        },
    };

    /*
     *   importData：批量导入、export：导出、templateExport：导入模板下载
     * */

    let batch = {
        export:function(_this){
            const form = $("#searchForm").serialize();  //将form序列化
            $(_this).attr({"href": url + robotDevice + version1 + "/device/export?" + form});
        },
        importData:function(_this){
            //判断格式
            const name = _this.value;
            const postfix = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
            if(postfix !== 'xls' && postfix !== 'xlsx'){
                layer.msg('请选择xls和xlsx的格式文件上传！');
                $(_this).val("");   //清空数据，以防noChange内容不变时，不执行函数
                return ;
            }

            let form = new FormData($("#Import")[0]);
            form.append("userId",userId);
            $.ajax({
                type:'post',
                url: url + robotDevice + version1 +'/device/import',
                data: form,
                contentType: false,
                processData: false,
                success:function(data){
                    if(data.code === 0){
                        layer.msg('添加成功');
                    }else{
                        layer.msg(data.message);
                    }
                },
                beforeSend:function(){
                    layer.load(0, {shade:[0.1,'#000']}); //0代表加载的风格，支持0-2
                },
                complete:function(){
                    layer.closeAll('loading'); //关闭信息框
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
            });
            $(_this).val("");   //清空数据，以防noChange内容不变时，不执行函数
        },
        templateExport:function(_this){
            $(_this).attr({"href": url + robotDevice + version1 + "/" });
        }
    };

    /*
     *   单个删除按钮，多个删除按钮，删除请求调用
     * */

    let detele = {
        single:function(_this){
            layer.confirm('是否删除记录', {
                btn: ['确定','取消'] //按钮
            }, function(){
                let id = [$(_this).parents("tr").find("input[type=checkbox]").attr("data-id")];
            });
        },
        multiple:function(){
            const dataID = $('#list_tab tbody input[type=checkbox]:checked');   //单选按钮
            let id = [];
            $.each(dataID,function(index,val){
                id.push($(val).attr("data-id"));   //获取id
            });

            if(id.length <= 0) {layer.msg("请选择！"); return;}
            layer.confirm('是否删除记录', {
                btn: ['确定','取消'] //按钮
            }, function(){
                detele.transfer(id);
            });
        },
        transfer:function(id){
            $.ajax({
                type:'post',
                url: url + robotDevice + version1 +'/device/delete',
                data: {
                    "userId":userId,
                    "ids":id.join(",")
                },
                dataType:'json',
                // traditional:true,
                success:function(data){
                    if(data.code === 0){
                        layer.msg('删除成功');
                    }else{
                        layer.msg(data.message);
                    }
                },
                beforeSend:function(){
                    layer.load(0, {shade:[0.1,'#000']}); //0代表加载的风格，支持0-2
                },
                complete:function(){
                    layer.closeAll('loading'); //关闭信息框
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){ beingGiven(XMLHttpRequest, textStatus, errorThrown)  }
            });
        }
    };

    /*
     *   停用和启用，分为单个和批量
     * */

    let modify = {
        single:function(status){
            let dataID = $('#lebel_tab tbody input[type=checkbox]:checked');   //单选按钮
            let id = [];
            $.each(dataID,function(index,val){
                id.push($(val).attr("data-id"));   //获取id
            });
            onOFF(id,status);   //调用函数
        },
        multiple:function(wo,status){
            let self = wo;
            switch (status){
                case 0:
                    let id1 = [$(self).parents("tr").find("input[type=checkbox]").attr("data-id")];
                    onOFF(id1,status);
                    break;
                case 1:
                    let id2 = [$(self).parents("tr").find("input[type=checkbox]").attr("data-id")];
                    onOFF(id2,status);
                    break;
            }
        },
        transfer:function(id,status){
            $.ajax({
                type:'post',
                url: DMBServer_url + '/web/api/exams/status.json',
                data:{
                    ids	:id,    //台账模板ID，数组
                    status:status  //状态, 0:禁用,1:启用
                },
                dataType:'json',
                traditional:true,
                success:function(data){
                    if(data.code === 0){
                        switch (status){
                            case 0:
                                //启用成功
                                returnMessage(1,'取消成功！');
                                break;
                            case 1:
                                //禁用成功
                                returnMessage(1,'发布成功！');
                                break;
                        }
                        $("#lebel_tab thead th:first input").removeAttr("checked");
                        label(paGe,pageNum,keyword);
                    }else{
                        //无数据提醒框
                        returnMessage(2,'修改失败！');
                    }
                },
                error:function(data){
                    //报错提醒框
                    returnMessage(2,'报错：' + data.status);
                }
            });
        }
    }


    /*  导入成功导入失败
     ---------------------------------------------------------------------------------------------------------*/
    function importDetails(data){
        let pageCount,vpage;   //初始的
        let html,sum = 1;
        let import_list = $(".import_list");
        import_list.empty();
        $.each(data.data.failList,function(index,val){
            //阶段 0:群众,10:积极份子,20:重点对象,30预备党员,100党员
            let type = '';
            switch(val.type){
                case 0:type = '群众';
                    break;
                case 10:type = '积极份子';
                    break;
                case 20:type = '重点对象';
                    break;
                case 30:type = '预备党员';
                    break;
                case 100:type = '党员';
                    break;
            }
            let joinPartyDate = val.joinPartyDate?val.joinPartyDate:" ";
            html += '<tr><td>'+ sum +'</td>'+
                '<td>'+ val.name +'</td>'+
                '<td>'+ val.examName +'</td>'+
                '<td>'+ val.examScore +'</td></tr>';
            // <tr>
            // <th>姓名</th>
            // <th>科目</th>
            // <th>成绩</th>
            // </tr>
            sum++;
        });
        import_list.append(html);

        // 显示弹出框
        $("#importModal").addClass("show in");
    }
    function importDown(){
        // 关闭弹出框
        $("#importModal").removeClass("show in");
    }