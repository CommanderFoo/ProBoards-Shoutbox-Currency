$(function(){
	({

		init: function(){
			if(typeof pixeldepth == "undefined" || typeof pixeldepth.monetary == "undefined"){
				return;
			}
			
			this.add_currency();
			this.monitor_shoutbox();
		},

		monitor_shoutbox: function(){
			var self = this;

			$.ajaxPrefilter(function(opts, orig_opts){
				if(orig_opts.url == proboards.data("shoutbox_update_url")){
					var orig_success = orig_opts.success;

					opts.success = function(){
						orig_success.apply(this, self.parse_realtime.apply(self, arguments));
					};
				}
			});
		},
		
		parse_realtime: function(){
			if(arguments && arguments.length && arguments[0].shoutbox_post){
				var container = $("<span />").html(arguments[0].shoutbox_post);
				var posts = container.find("div.shoutbox-post");

				this.add_currency(posts);
				arguments[0].shoutbox_post = container.html();
			}

			return arguments || [];
		},

		add_currency: function(posts){
			var posts = posts || $(".shoutbox_messages div.shoutbox-post");
			
			posts.each(function(){
				var user_id = $(this).find("a.user-link:first").attr("href").match(/\/user\/(\d+)$/i)[1];
				var money = pixeldepth.monetary.data(user_id).get.money(true);
				var span = $(this).find(".shoutbox_currency");
				
				if(!span.length){
					span = $("<span class='shoutbox_currency' style='margin-right: 3px;'>[" + pixeldepth.monetary.settings.money_symbol + yootil.html_encode(yootil.number_format(money)) + "]</span>");
					$(this).prepend(span);
				} else {
					span.html(pixeldepth.monetary.settings.money_symbol + yootil.html_encode(yootil.number_format(money)));	
				}
			});
		}

	}).init();
});