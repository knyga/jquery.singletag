(function($) {

    AbstractSingletag = (function(options) {

        function AbstractSingletag(options) {
            this.options = options;
            this.$el = $(options.el);
            return this;
        };

        AbstractSingletag.prototype.addList = function() {
            this.$list = $('<ul class="singletag-list"></ul>');

            this.$el.after(this.$list);
            this.updateList('');
            this.$el.trigger('addList');
        };

        AbstractSingletag.prototype.showList = function() {
            this.$list.show();
            this.$el.trigger('showList');
        };

        AbstractSingletag.prototype.hideList = function() {
            this.$list.hide();
            this.$el.trigger('hideList');
        };

        AbstractSingletag.prototype.updateList = function (query) {
            var that = this,
                rg = new RegExp(query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "i");

            this.$list.html('');

            for(var i= 0, ia = 0;i<options.availableTags.length;i++) {
                if(!rg.test(options.availableTags[i])) {
                    continue;
                }

                var $item = $('<li><a href="javascript://">'+options.availableTags[i]+'</a></li>');
                $item.on('click', 'li', function() {
                    that.select($(this).text());
                });

                if(ia++ >= this.options.maxItemsCount) {
                    $item.hide();
                }

                this.$list.append($item);
            }

            this.$el.trigger('updateList', query);
        };

        AbstractSingletag.prototype.select = function(value) {
            this.$el.val(value);
            this.hideList();
            this.updateList(value);
            this.$el.trigger('selectOption', value);
        }

        return new AbstractSingletag(options);
    });

    $.fn.singletag = function(opts) {
        var options = $.extend({}, defaults, opts);
        var events = ['selectOption', 'updateList', 'hideList', 'showList', 'addList'];

        return this.each(function() {
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

            for(var i=0;i<events.length;i++) {
                var ename = events[i];

                if(options.hasOwnProperty(ename)) {
                    $this.on(ename, options[ename]);
                }
            }

            return this;
        });
    };

    var defaults = {
        availableTags: [],
        maxItemsCount: 4
    };

})(jQuery);