(function ($) {
    function ContextMenu (options) {
        this.wrap = options.wrap;
        this.dataArr = options.dataArr;
        this.len = this.dataArr.length;
        this.width = options.width || 200,
        this.height = options.handler || '30px',
        this.regional = options.regional  || 'body';//鼠标点击的区域
        this.flag = false;
        this.createDom();
        this.bindEvent();
        this.initStyle();
    }
    
    ContextMenu.prototype.createDom = function () {
        $( '.my-contextMenu', this.wrap).remove();
        var oDiv = $('<div class="my-contextMenu"> </div>');
        var oUl = $('<ul class="my-contextMenu-ul"></ul>');

        this.dataArr.forEach(function (ele, index) {
            $('<li><a href="#" data-index="' + index + '">\n'
            + ele.name +'</a></li>').appendTo(oUl);
        });

        $(oDiv).append(oUl)
                .appendTo( $(this.wrap) );

    }

    ContextMenu.prototype.initStyle = function () {
        $('.my-contextMenu', this.wrap).css({
            position: 'absolute',
            'visibility': 'hidden',
            border: '1px solid #eee',
            backgroundColor: '#fff',
            borderRadius: 3,
            width: this.width,
            boxShadow: '2px 3px 5px #888',
            zIndex: 999
        })
        .find('.my-contextMenu-ul').css({
            listStyle: 'none',
            padding: 0,
            margin: 0,
        })
        .find('li > a').css({
            padding:' 5px 10px',
            display: 'block',
            height: this.height,
            lineHeight: this.height,  
            textDecoration: 'none',
            color: '#666',
            fontSize: 14,         
        })
    }

    ContextMenu.prototype.bindEvent = function () {
        var self = this;
 
        // a hover
        $('.my-contextMenu-ul > li > a', '.my-contextMenu').hover(function () {
            $(this).css({
                backgroundColor: '#eee',
                color: '#000',
            })
        }, function () {
            $(this).css({
                backgroundColor: '',
                color: '#666',
            })
        });

        //cilck 执行 函数
        $('.my-contextMenu-ul', '.my-contextMenu').on('click', 'a', function (e) {
            e.preventDefault();
            var index = $(this).data('index');
            if ( $.type(self.dataArr[index].handler) == 'function' ) {
                self.dataArr[index].handler();
            } else {
                alert('程序有误！！！');
            }
        });

        $(this.regional).contextmenu(function (e) {
            var mymenu = $('.my-contextMenu');
            mymenu.css({
                'visibility': 'visible',
                left: e.clientX + 5 + 'px',
                top: e.clientY + 5 + 'px',
            });
            self.flag = true;
            clearContextMenu();
            return false;
        });

        // 清除
        function clearContextMenu() {
            $('body').click(function () {
                if (self.flag) {
                    $('.my-contextMenu').css('visibility', 'hidden');
                    self.flag = false;
                }
                // $('body').contextmenu(function () {
                //     $('.my-contextMenu').css('visibility', 'hidden');
                // })
            });

        }

    }

    $.fn.extend({
        myContextMenu: function (options) {
            options.wrap = this;
            new ContextMenu(options);
            return this;
        }
    })
} (jQuery))