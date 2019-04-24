(function ($) {
    function turnPage(options) {
        this.wrap = options.wrap;//保存父级
        this.nowPage = options.nowPage;//当前页码
        this.pageSize = options.pageSize;//每一页展示多少条数据
        this.allPageSize = options.allPageSize;//总共多少条数据
        this.allPage = Math.ceil( this.allPageSize / this.pageSize );//总页数
        this.changePageHandler = options.changePageHandler;//改变页面处理程序 
        this.createDom();//创建DOM
        this.initStyle();//初始化样式
        this.bindEvent();//事件处理
    }
    //创建dom
    turnPage.prototype.createDom = function () {
        // 每次调用 创建dom 之前需要先清空原先的元素 
        // $('.my-turnPage',this.wrap).remove();
        $(this.wrap).empty();
        var oUl = $('<ul class="my-turnPage"></ul>');
        // 当前页码   “大于1”     的时候 我们需要有 “上一页” 的按钮
        if (this.nowPage > 1) {
            $('<li class="prev-turnPage">上一页</li>').appendTo(oUl);
        }
        // 当前页码  "大于等于4"   的时候我们需要创建 第 1 页
        if (this.nowPage >= 4) {
            $('<li class="num">1</li>').appendTo(oUl);
        }
        // 当前页码  “大于4”       的时候，我们需要有 “…” 来隔开-----前 省略号
        if (this.nowPage > 4) {
            $('<span>…</span>').appendTo(oUl);
        }
        //中间的 5位页码
        for (var i = this.nowPage - 2; i <= this.nowPage + 2; i++) {
            //当前页加上 active 方便加上样式
            if (i == this.nowPage) {
                $('<li class="num active">' + i + '</li>').appendTo(oUl);
            } else if ( i > 0 && i < this.allPage ) {
                $('<li class="num">' + i + '</li>').appendTo(oUl);
            }
        }
        // 当前页码 “ + 2 小于 ” 总页数 - 1，这样才有展示的必要 我们需要有 “ … ” 来隔开
        if (this.nowPage + 2 < this.allPage -1) {
            $('<span>…</span>').appendTo(oUl);
        }
        // 当前页码不等于最后一页的时候，我们需要 显示 "最后一页" 和 "下一页按钮"
        if (this.nowPage != this.allPage) {
            $('<li class="num">' + this.allPage + '</li>').appendTo(oUl);
            $('<li class="next-turnPage">下一页</li>').appendTo(oUl);
        }
        // 总共多少页可以不用展示
        // $('<li>共' + this.allPage + '</li>').appendTo(oUl);
        $(this.wrap).append(oUl);
    }
    // 初始化样式
    turnPage.prototype.initStyle = function () {
        $('.my-turnPage', this.wrap).css({
            padding: 0,
            margin: 0,
            listStyle: 'none',
            minWidth: 350
        })
            .find('li')
                .css({
                    display: 'inline-block',
                    margin: 10,
                    cursor: 'pointer',
                    backgroundColor: '#6a5acd',
                    padding: '5px 12px',
                    color: '#fff'
                })
                    .end()
                        .find('li.active')
                            .css({
                                backgroundColor: '#fff',
                                color: '#6a5acd',
                                border: '1px solid #6a5acd'
                            })
    }
    // 事件处理
    turnPage.prototype.bindEvent = function () {
        var self = this;
        // 上一页按钮
        $('.prev-turnPage', this.wrap).on('click', function () {
            //当前页码 不能小于1
            if (self.nowPage <= 1) {
                return false;
            }
            self.nowPage--;
            self.changePage(self.nowPage);
        });
        // 下一页按钮
        $('.next-turnPage', this.wrap).on('click', function () {
            // 当前页码 不能大于总页数
            if (self.nowPage >= self.allPage) {
                return false;
            }
            self.nowPage++;
            self.changePage(self.nowPage);
        });
        // 点击页码 （索引）
        $('.my-turnPage', this.wrap).on('click', '.num', function () {
            if (self.nowPage > 0 && self.nowPage <= self.allPage) {
                // 取到的是string类型的字符串， 转换为数字类型的之后，才能调用函数
                self.nowPage = parseInt( $(this).text() );
                self.changePage(self.nowPage);
            }
            // console.log( $(this).text() );
        })
    }
    // 改变当前页码 
    turnPage.prototype.changePage = function (nowPage) {
        this.nowPage = nowPage;
        this.createDom();
        this.initStyle();
        this.bindEvent();
        console.log(typeof this.changePageHandler)
        typeof this.changePageHandler == 'function' && this.changePageHandler({
            nowPage: this.nowPage,
            pageSize: this.pageSize
        });
    }
    $.fn.extend({
        turnPage: function (options) {
            options.wrap = this;
            new turnPage(options);
            return this;
        }
    })
}(jQuery))