(function($) {

    AbstractSingletag = (function(options) {

        function AbstractSingletag(options) {
            this.options = options;
            this.$el = $(options.el);
            return this;
        };

        AbstractSingletag.prototype.addList = function() {
            console.log('add list');

            this.$list = $('<ul class="singletag-list"></ul>');

            this.$el.after(this.$list);
            this.updateList('');
        };

        AbstractSingletag.prototype.showList = function() {
            console.log('show list');

            this.$list.show();
        };

        AbstractSingletag.prototype.hideList = function() {
            console.log('hide list');

            this.$list.hide();
        };

        AbstractSingletag.prototype.updateList = function (query) {
            console.log('update list', query);

            var that = this,
                rg = new RegExp(query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "i");

            this.$list.html('');

            for(var i= 0, ia = 0;i<options.availableTags.length;i++) {
                if(!rg.test(options.availableTags[i])) {
                    continue;
                }

                var $item = $('<li><a href="javascript://">'+options.availableTags[i]+'</a></li>');
                $item.on('click', 'a', function() {
                    that.select($(this).text());
                });

                if(ia++ >= this.options.maxItemsCount) {
                    $item.hide();
                }

                this.$list.append($item);
            }
        };

        AbstractSingletag.prototype.select = function(value) {
            console.log('select', value);
            this.$el.val(value);
            this.hideList();
            this.updateList(value);
        }

        return new AbstractSingletag(options);
    });

    $.fn.singletag = function(opts) {
        var options = $.extend({}, defaults, opts);

        this.each(function() {
            var that = this,
                $this = $(this),
                stag = new AbstractSingletag($.extend({}, options, {
                        el: this
                    }));

            stag.addList();

            $this.on('focus', function() {
                console.log('focus');
                stag.showList();
            });
            $this.on('keyup', function(e) {
                console.log('keydown');
                stag.updateList($this.val());
            });

            $(document).mouseup(function(e) {
                if (!stag.$list.is(e.target) && stag.$list.has(e.target).length === 0 &&
                    !$this.is(e.target) && $this.has(e.target).length === 0)
                {
                    stag.hideList();
                }
            });
        });
    };

    var defaults = {
        availableTags: [],
        maxItemsCount: 4
    };

})(jQuery);