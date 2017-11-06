    /*
    *  关联用户
    * */
    let pageNum = 10//每次页数
        ,paGe = 1   //第几页  修改时，出现在被修改页面
        ,flag = null;   // 分页赋值

    $(document).ready(function(){
        list.list(paGe,pageNum);
    });

    /*
     *   列表、搜索、跳转
     * */

    let list = {
        list:function(page,size){
            let pageCount,vpage;   //初始的
            //开始时显示数据
            let dataObject = {
                "page":page,
                "size":size,
            };

            $.ajax({
                type:'get',
                url: url + robotDevice + version1 +'/device/userList',
                data:dataObject,
                dataType:'json',
                success:function(data){
                    const list = $(".list");  //将选择器赋值给常量
                    list.empty();  //清空
                    if(data.code === 200){
                        let listData = '';
                        $.each(data.data.items,function(i,d){
                            listData += ``
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
        }
    };