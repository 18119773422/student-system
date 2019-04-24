var nowPage = 1;
var pageSize = 5;
var allPageSize = 0;
var tabaData = [];
var flag = false;
var searchWord = '';
var searchSex = -1;
function bindEvent() {
    // student menu click event
    $('.left-menu').on('click', 'dd', function (e) {
        $(this).addClass('active').siblings('dd').removeClass('active');
        var Id = $(this).attr('showContentId');
        $('.content').fadeOut();
        $('#' + Id).fadeIn();
        if (Id == 'right-student-list') {
            getTableData();
            $('.search').css({
                display: 'block'
            })
        } else if (Id == 'right-add-student') {
            $('.search').css({
                display: 'none'
            })
        }
    });

    //add student
    function addStudent() {
        $('#add-student-btn').on('click', function (e) {
            e.preventDefault();
            if (flag) {
                return false;
            }
            flag = true;
            var data = $('#add-student-form').serializeArray();
            data = formatData(data);
            transferData('addStudent', data, function () {
                var status = window.confirm('添加数据成功，是否跳转页面');
                if (status) {
                    $('.list').trigger('click');
                } else {
                    $('#add-student-form')[0].reset();
                }
                flag = false;
            });
        })
    }

    addStudent();

    //模拟创建学生
    // for (var i = 0; i < 100; i++) {
    //     var data = {
    //         address: "1号",
    //         birth: 2000,
    //         sNo: 12345678911,
    //         email: "0001@qq.com",
    //         name: "aaa888",
    //         phone: "12345670001",
    //         sex: 1,
    //     }
    //     data.name = '测试' + i + '号';
    //     data.sNo =  999 + i;
    //     data.address = '模拟住址' + i + '号';
    //     data.sex = i % 2;
    //     console.log(data);
    //     transferData('addStudent', data, function() {})
    // }


    // 回填数据
    function renderFrom(data) {
        var form = $('#edit-student-form')[0];
        for (var prop in data) {
            if (form[prop]) {
                form[prop].value = data[prop];
            }
        }
    }

    //edit student 
    function editStudent() {
        $('#tbody').on('click', '.edit', function () {
            var index = $(this).data('index');
            renderFrom(tabaData[index]);
            $('.dialog').slideDown();
            //  修改学生

            $('#edit-student-btn').on('click', function (e) {
                e.preventDefault();
                if (flag) {
                    return false;
                }
                flag = true;
                var data = $('#edit-student-form').serializeArray();
                var data = formatData(data);
                $.extend(data, { sNo: tabaData[index].sNo });
                var count = 0;
                // 判断 数据是否修改过
                for (var num in data) {
                    if (data[num] != tabaData[index][num]) {
                        count += 1;
                    }
                    // 如果有一个数据为空，我们阻止提交表单
                    if (data[num].length == 0) {
                        alert('数据填写不完整！！！！\n' + data[num]);
                        return false;
                    }
                }
                // 没有对数据进行修改我们阻止提交
                if (count == 0) {
                    alert('数据修改失败，可能未对数据进行修改！！！');
                    // alert(true);
                } else {
                    transferData('updateStudent', data, function (res) {
                        alert(res.msg);
                        $('.student-list').slideUp();
                        getTableData();
                        $('.student-list').slideDown();
                        $('.mask').trigger('click');
                        flag = false;
                        count = 0;
                    });
                }
            });
        });

        $('.mask').on('click', function () { $('.dialog').slideUp() });
    }
    editStudent();

    // del 
    function delStudent() {
        $('#tbody').on('click', '.del', function (e) {
            e.preventDefault();
            var index = $(this).data('index');
            var status = window.confirm('是否删除该学生？\n' + tabaData[index].name);

            if (status) {
                transferData('delBySno', {
                    sNo: tabaData[index].sNo
                }, function (res) {
                    alert(res.msg);
                    $('.list').trigger('click');
                })
            }
        })
    }
    delStudent();
    // renderpage 渲染数据
    function renderpage(data) {

        var str = '';
        data.forEach(function (ele, index) {
            str += '\
                <tr>\
                    <td>' + ele.sNo + '</td>\
                    <td>' + ele.name + '</td>\
                    <td>' + (ele.sex ? '女' : '男') + '</td>\
                    <td>' + ele.email + '</td>\
                    <td>' + (new Date().getFullYear() - ele.birth) + '</td>\
                    <td>' + ele.phone + '</td>\
                    <td>' + ele.address + '</td>\
                    <td>\
                        <button class="btn edit" data-index=' + index + '>编辑</button>\
                        <button class="btn del" data-index='+ index + '>删除</button>\
                    </td>\
                </tr>\
                '
        });
        $('tbody').html(str);
            // 分页
        // $('#turnPage').turnPage({
        //     nowPage: nowPage,
        //     pageSize: pageSize,
        //     allPageSize: allPageSize,
        //     changePageHandler: function (obj) {
        //             nowPage = obj.nowPage,
        //             pageSize = obj.pageSize,
        //         // getTableData()
        //         filterSearchWord()
        //         console.log(nowPage, pageSize, allPageSize);
        //     }
        // });
    }


    // get data
    function getTableData() {
        var data = {
            page: nowPage,
            size: pageSize
        }
        transferData('findByPage', data, function (res) {
            var allPageSize = res.data.cont;
            tabaData = res.data.findByPage;
            $('#turnPage').turnPage({
                nowPage: nowPage,
                pageSize: pageSize,
                allPageSize: allPageSize,
                changePageHandler: function (obj) {
                    nowPage = obj.nowPage,
                    pageSize = obj.pageSize,      
                    $('.student-list').fadeOut();
                    getTableData();
                    $('.student-list').fadeIn();
                }
            })
            renderpage(tabaData);



            // tabaData = res.data.findByPage;
            // allPageSize = res.data.cont;
            // renderpage(tabaData);

        });

    }
    // 页面一打开的时候就渲染页面
    getTableData();

    //表单数据 转换数据格式
    function formatData(data) {
        var obj = {};
        if ($.type(data) != 'array') {
            alert('data error');
            return false;
        }
        data.forEach(function (ele) {
            if (!obj[ele.name]) {
                obj[ele.name] = ele.value;
            }
        });
        return obj;
    }

    // 传输数据
    function transferData(url, data, cb) {
        $.ajax({
            url: 'http://api.duyiedu.com/api/student/' + url,
            data: $.extend(data, {
                appkey: 'testData_1554196932590',
            }),
            type: 'get',
            dataType: 'json',
            success: function (res) {
                if (res.status == 'success') {
                    $.type(cb) == 'function' && cb(res);
                } else {
                    alert(res.msg)
                }
            }
        })
    }

    //按关键字 获取数据
    function filterSearchWord() {
            //获取数据
            transferData('searchStudent', {
                sex: searchSex,
                page: nowPage,
                size: pageSize,
                search: searchWord
            } , function (res) {
                var allPageSize = res.data.cont;
                $('#turnPage').turnPage({
                    nowPage: nowPage,
                    pageSize: pageSize,
                    allPageSize: allPageSize,
                    changePageHandler: function (obj) {
                        nowPage = obj.nowPage,
                        pageSize = obj.pageSize,
                        $('.student-list').fadeOut();
                        filterSearchWord();
                        $('.student-list').fadeIn();
                    }
                })
                renderpage(res.data.searchList);
                // console.log(res.data.searchList);
                // $('.student-list').hide();
                // allPageSize = res.data.cont;
                // renderpage(res.data.searchList);
                // $('.student-list').fadeIn();
            })
        }

    // 按关键字搜索    
    $('#search-submit').on('click', function () {
        nowPage = 1;
        searchWord = $('#search-word').val();
        if (searchWord == '') {
            alert('需输入关键字搜索后可用\n 我们已经为你更新了页面数据');
            getTableData();
            return false;
        }
        filterSearchWord();
    })


    function changeSearchSex() {
        return {
            male: function() {
                searchSex = 0;
                $('#search-submit').trigger('click');
            },
            female: function () {
                searchSex = 1;
                $('#search-submit').trigger('click');
            },
            all: function () {
                searchSex = -1;
                $('#search-submit').trigger('click');
            }
        }
    }
    function changePageSize() {
        num = parseInt(window.prompt('每页显示多少个学生？', pageSize));
        //如果不填数据就是null然后经过parseInt之后变成 NaN, 将NaN转换为字符串作为比较
        if (('' + num) != 'NaN') {
            pageSize = num;
            getTableData();
            myEvent();
        }
    }
    // 自定义事件
    function myEvent() {
        $('.header').myContextMenu({
            dataArr: [
                {
                    name: '按男神类搜索',
                    handler: changeSearchSex().male
                },
                {
                    name: '按女神类搜索',
                    handler: changeSearchSex().female
                }, {
                    name: '无限制条件搜索',
                    handler: changeSearchSex().all
                }, {
                    name: '每页显示数量 当前(' + pageSize + ')',
                    handler: changePageSize
                }
            ],
            regional: '.header'

        });
    }
    myEvent();
    






    // 鼠标右击菜单
    // $('.header').contextmenu(function () {
    //     alert( 111);
    //     return false;
    // })



    //搜索
    // $('#search-submit').on('click', function (e) {
    //     var search = $('#search-word').val();
    //     if (search == '') {
    //         return false;
    //     }
    //     var searchData = {
    //         search: search,
    //         sex: -1,
    //         page: nowPage,
    //         size: pageSize
    //     }
    //     console.log(searchData);
    //     // return false;
    //     transferData('searchStudent', searchData, function (res) {
    //         console.log(res.data.searchList);
    //         $('.student-list').hide();
    //         allPageSize = res.data.cont;
    //         renderpage(res.data.searchList);
    //         $('.student-list').fadeIn();
    //     })
    // });

}
bindEvent();
