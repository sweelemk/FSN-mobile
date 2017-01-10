'use strict'

$.fn.hasAttr = function(name) {
	return this.attr(name) !== undefined;
};

function extend( a, b ) {
	for( var key in b ) { 
		if( b.hasOwnProperty( key ) ) {
			a[key] = b[key];
		}
	}
	return a;
};

function customScroll(el) {
	this.el = el;
	this.init();
}

customScroll.prototype.init = function() {
	var self = this;
	this.scroll = new IScroll(self.el, {
		bounce: false,
		click: false,
		mouseWheel: true,
		probeType: 2,
		scrollbars: true,
		fadeScrollbars: true,
		HWCompositing: false,
		preventDefaultException:{ tagName:/.*/ }
	});

	if($(this.el).find(".scroll").offset().top != 0) {
		self.scroll.scrollTo(0, -Math.round($(self.el).find(".scroll").innerHeight()) + $(self.el).height())
	}
	if(this.el == ".wrapper") {
		self.endscroll();
	}
}

customScroll.prototype.destroy = function(){
	this.scroll.destroy();
}

customScroll.prototype.update = function() {
	this.scroll.refresh();	
}

customScroll.prototype.scrollUp = function(){
	this.scroll.scrollTo(0,0);
}

customScroll.prototype.scrollToElement = function (y) {
	this.scroll.scrollTo(0, y);
}
customScroll.prototype.scrollToElementTime = function (y, time) {
	this.scroll.scrollTo(0, y, time);
}

customScroll.prototype.endscroll = function() {
	var self = this;

	if(typeof gallery !== "undefined") {
		this.scroll.on("scroll", gallery.scrollValue);
		this.scroll.on("scrollEnd", gallery.scrollValue);
	}
}


var mainScroll = ".wrapper",
	scrollPopup = ".page-menu",
	// scrollModal = ".modal__wrapper",
	mainScrollInit, scrollPopupInit, scrollModalInit, burger;
window.onload =  function(){
	mainScrollInit = new customScroll(mainScroll);
	scrollPopupInit = new customScroll(scrollPopup);
	// scrollModalInit = new customScroll(scrollModal);
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	var pull = new PullMobile;
	pull.init();
	burger = new mobileMenu();
	burger.init();
}

var PullMobile = function(){

	var defaults = {
		contentEl: 'out',
		ptrEl: 'pan-loader',
		distanceToRefresh: 70,
		loadingFunction: false,
		resistance: 2.5
	};

	var options = {};

	var self = this;

	var pan = {
		enabled: false,
		distance: 0,
		startingPositionY: 0,
		isFunction: false,
		idLoading: false
	};

	var bodyClass = document.body.classList;

	this.init = function(params){
		params = params ? params : {};
		options = {
			contentEl: params.contentEl || document.getElementById(defaults.contentEl),
			ptrEl: params.ptrEl || document.getElementById(defaults.ptrEl),
			distanceToRefresh: params.distanceToRefresh || defaults.distanceToRefresh,
			loadingFunction: params.loadingFunction || defaults.loadingFunction,
			resistance: params.resistance || defaults.resistance
		};

		// if(!options.contentEl || options.ptrEl) {
		// 	return false;
		// }

		var h = new Hammer(options.contentEl);

		h.get( 'pan' ).set( { direction: Hammer.DIRECTION_VERTICAL } );

		h.on('panstart', this._panStart);
		h.on('panup', this._panUp);
		h.on('pandown', this._panDown);
		h.on('panend', this._panEnd);


	};

	this._panStart = function() {
		pan.startingPositionY = document.body.offsetHeight;

		if(pan.startingPositionY === Math.round(options.contentEl.getBoundingClientRect().bottom)) {
			pan.enabled = true;
		}
	};

	this._panUp = function(e){

		if(!pan.enabled) {
			return;
		}
		e.preventDefault();
		pan.distance = e.distance / options.resistance;

		self._setPanContent();
		self._setBodyClass();

	};

	this._panDown = function(e){
		if(! pan.enabled || pan.distance === 0) {
			return;
		}

		e.preventDefault();

		
		pan.distance = e.distance / options.resistance;
		
		self._setPanContent();
		self._setBodyClass();
		
		if(!pan.isFunction) {
			mainScrollInit.destroy();
			pan.isFunction = true;
		}
	};

	this._setPanContent = function(){
		document.getElementById('touch').style.webkitTransform = 'translate3d( 0, -' + pan.distance + 'px, 0 )';
		document.getElementById('pan-loader').style.webkitTransform = 'translate3d( 0, -' + pan.distance + 'px, 0 )';
		$(".outer").attr("stroke-dashoffset", 50 - (pan.distance/1.4));
	};

	this._panEnd = function(e) {
		if(!pan.enabled) {
			return;
		}

		if(pan.isFunction) {
			mainScrollInit.init();
			pan.isFunction = false;
		}

		e.preventDefault();

		document.getElementById('touch').style.webkitTransform = '';
		document.getElementById('pan-loader').style.webkitTransform = '';

		pan.isLoading = false;
		pan.distance = 0;
		pan.enabled = false;

	};

	// this._setBodyClass = function() {
	// 	if ( pan.distance > options.distanceToRefresh ) {
	// 		bodyClass.add( 'ptr-refresh' );
	// 	} else {
	// 		bodyClass.remove( 'ptr-refresh' );
	// 	}		
	// };
	
	this._setBodyClass = function() {
		if ( pan.distance > options.distanceToRefresh ) {
			bodyClass.add( 'ptr-refresh' );
			
			if(!pan.isLoading){
				self._doLoading();
				pan.isLoading = true;
			}

			document.getElementById('touch').style.webkitTransform = '';
			document.getElementById('pan-loader').style.webkitTransform = '';
		}
		
	};

	this._doLoading = function(){
		bodyClass.add('loading');
		setTimeout(function(){
			loading($(".nav-page-button"))
		}, 1500);			
	};
};

var _doReset = function() {
	var bodyClass = document.body.classList;
		bodyClass.remove('loading');
		bodyClass.remove('ptr-refresh');
		bodyClass.add('ptr-reset');

	var bodyClassRemove = function() {
		bodyClass.remove('ptr-reset');
		document.body.removeEventListener( 'transitionend', bodyClassRemove, false );
	};

	document.body.addEventListener( 'transitionend', bodyClassRemove, false );
};

function mobileMenu() {		
	_this = this;
	var trigger = $(".burger"),
		container = $(".page-menu"),
		link = container.find(".ajax-trigger"),
		scroll = $(".out"),
		close = container.find(".close"),
		posY;	

	_this.init = function() {
		
		_this.initEvent()
	}

	_this.initEvent = function(){
		trigger.on("click", function(){
			if(!$(this).hasClass("open")) {
				_this.openMenu();
			} else {
				_this.closeMenu();
			}
		});
	}

	_this.openMenu = function() {
		trigger.addClass("open open_burger");
		container.addClass("open");
		scroll.attr("style", "overflow: hidden");
		mainScrollInit.destroy();
	}

	_this.closeMenu = function() {
		posY = $(".scroll").offset().top;
		trigger.removeClass("open open_burger");
		container.removeClass("open");
		scroll.removeAttr("style")
		mainScrollInit.init();
		mainScrollInit.scrollToElement(posY);
	}

	_this.triggerLink = function(item){
		var $this = item;

		$this.parent("li").addClass("active").siblings().removeClass("active");

		setTimeout(function(){
			_this.closeMenu();
		},300);
	}
};


function FullGallery(el) {
	this.el = el;

	this.smallGalleryEl = $(".small-gallery");
	this.initVariables();

	this.options = {
		scrolling: false
	}
};

FullGallery.prototype = {
	initVariables: function(){
		var self = this;
		this.mainColorContainer = $(".bg-color");
		this.init();
		
		if(this.smallGalleryEl.length) {
			this.smallGallery();
		}
	},
	init: function(){
		this.slide = this.el.find(".full-gallery_slide");
		this.f_Slide = this.el.find(".full-gallery_slide").first();
		this.f_Slide_Color = this.f_Slide.find("img").data("color");

		this.f_Slide.addClass("current");
		this.mainColorContainer.css("background-color", this.f_Slide_Color);

		this.screenSize();
		this.screenResize();
	},
	screenSize: function(){
		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;

		this.screen1_2 = this.screenHeight / 2;

	},
	screenResize: function(){
		var self = this;
		window.addEventListener("resize", function(){
			self.screenSize();
		}, true);
	},
	scrollValue: function(){
		var self = this;

		(!window.requestAnimationFrame) ? setTimeout(gallery.updateSections(-self.y), 300) : window.requestAnimationFrame(function(){gallery.updateSections(-self.y)});
	},
	updateSections: function(posTop) {
		var self = this;
		this.slide.each(function(){
			var _this = $(this);

				if(_this.hasClass("small-gallery")) {
					var _thisColor = _this.find(".slick-active img").data("color");
				} else {
					var _thisColor = _this.find("img").data("color");
				}
				
			if(self.screen1_2 >= _this.offset().top) {
				_this.parent().find(".current").eq(-1).removeClass('current');
				_this.addClass('current');
				$(".bg-color").css('background-color', _thisColor);
			} else if(self.screen1_2 <= _this.offset().top) {
				_this.removeClass('current');
			}
		})
	},
	smallGallery: function(){
		this.smallGalleryEl.find(".small-gallery_container").slick({
			arrows: false,
			infinite: false,
			touchMove: false,
			touchThreshold: 3
		})
	},
	update: function(){
		this.init();
	}
}

function Filter(el) {
	this.el = el;
	this.init();
}
Filter.prototype = {
	init: function(){
		this.trigger = this.el.find(".filter-trigger");
		this.fader = this.el.find(".filter-body_action");
		this.submit = this.el.find(".form-submit");
		this.form = this.el.find("form");
		this.events();
	},
	events: function(){
		var self = this;
		this.trigger.on("click", function(){
			
			if(!this.classList.contains("open")){
				self.openFilter();
			} else {
				self.closeFilter();
			}
		});
		this.submit.on("click", function(event){
			var link = self.submitForm();
			console.log(link)
			self.closeFilter();
			event.preventDefault();
		})
	},
	openFilter: function(){
		this.trigger.addClass("open");
		this.fader.slideDown({
			duration: 350,
			complete: function(){
				mainScrollInit.update();
			}
		});
	},
	closeFilter: function(){
		this.trigger.removeClass("open");
		this.fader.slideUp({
			duration: 350,
			complete: function(){
				mainScrollInit.update();
			}
		});
	},
	submitForm: function(){
		var self = this;
		this.action = this.form.attr("action");
		this.dataForm = this.form.serializeArray();
		this.arrayValue = [];

		this.dataForm.map(function(el){
			if(el.value.length) {
				self.arrayValue.push(el.value);
			}				
		});
		if(this.arrayValue.length) {
			return this.action + "filter/" + this.arrayValue.join("/") + "/";
		} else {
			return this.action
		}			
	}
};

function Revealer(el){
	var _this = this;

	_this.el = el;

	_this.transformNames = { 'WebkitTransform' : 'webkitTransform', 'OTransform' : 'oTransform', 'msTransform' : 'MSTransform', 'transform' : 'transform' },
	_this.transformName = _this.transformNames[Modernizr.prefixed( 'transform' )];

	_this.setVariables = function(){
		_this.width = window.innerWidth;
		_this.height = window.innerHeight;

		_this.pageDiagonal = Math.sqrt(Math.pow(_this.width, 2) + Math.pow(_this.height, 2));

		_this.widthVal = _this.heightVal = _this.pageDiagonal + "px";

		_this.transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,135deg) translate3d(0,' + _this.pageDiagonal + 'px,0)';

		_this.el.css(_this.transformName, _this.transform);
		_this.el.css("width", _this.widthVal);
		_this.el.css("height", _this.heightVal);
	};

	_this.resizeVariables = function(){
		var timeout;
		$(window).on("resize", function(){
			clearTimeout(timeout);
			timeout = setTimeout(function(){
				_this.setVariables();
			}, 200);
		});
	};

	_this.init = function(){
		_this.setVariables();
		_this.resizeVariables();
	};
}

function loading(link) {
	var _this = this;

	if(typeof link == "object") {
		var _href = $(link).attr("href") || $(link).data("href");
	} else {
		var _href = link;
	}
	_this.initAnimation = function(){
		$(".revealer").addClass("animation-layer-in");
	};
	_this.endAnimation = function(){
		$(".revealer").addClass("animation-layer-out");
		$(".revealer").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oAnimationEnd animationend", function(){
			$(this).removeClass("animation-layer-out animation-layer-in");
			// $(this).removeClass(_this.params.animOut);
		})
	};
	
	$.ajax({
		url: _href,
		datatype: "html",
		beforeSend: function(){
			_this.initAnimation();
		},
		success: function(content){
			var cont = $(content).find(".wrapper .scroll").html();
			var bodyColor = $(content).find(".bg-color").css("background-color");

			window.history.pushState("page" + _href, _href, _href);
			window.history.replaceState("page" + _href, _href, _href);

			var parentIndex = $(content).find(".menu .active").parent().index();
			var navIndex = $(content).find(".menu .active").index();
			$(".menu").find(".active").removeClass("active");

			$(".menu").find(".menu-item").parent().eq(parentIndex).find("li").eq(navIndex).addClass("active");

			setTimeout(function(){
				$(".wrapper").find(".scroll").html(cont).promise().done(function(){
					_doReset();
					mainScrollInit.scrollUp();
					mainScrollInit.update();
					_this.endAnimation();
				});
			}, 700);
		}
	});
};

$(window).bind("popstate", function(){
	var newPageArray = location.pathname;
	loading(newPageArray)
});

function Pagination(el, options) {
	this.el = el;

	this.default = {
		trigger: ".trigger",
		btnPrev: "#prev",
		btnNext: "#next",
		paginCurrent: ".current"
	};
	
	this.options = extend( {}, this.default );
	extend( this.options, options );
	this.init();
}
Pagination.prototype = {
	init: function(){
		this.allPage = +this.el.find(".pagination-all").text();

		this.initEvents();
	},
	initEvents: function(){
		var self = this;
		$(this.options.trigger).on("click", function(){
			this.link = $(this).attr("href");
			if(this.link == "#") {
				return false;
			}
			self._ajaxPagin(this.link)
			return false;
		})
	},
	_ajaxPagin: function(element){
		var self = this;
		$.ajax({
			url: element,
			datatype: "html",
			beforeSend: function(){
				mainScrollInit.scrollToElementTime(0,800);
				setTimeout(function(){
					$(self.options.appendContainer).addClass("load");
				},1000);				
			},
			success: function(content){
				var that = this;
				this.cont = $(content).find(self.options.appendContainer).html();
				this.nextCurr = $(content).find(self.options.paginCurrent).html();
				
				setTimeout(function(){
					$(self.options.appendContainer).html(that.cont).promise().done(function(){
						gallery.update();
						mainScrollInit.update();
						$(self.options.appendContainer).removeClass("load");
						$(self.el).find(self.default.paginCurrent).html(that.nextCurr);
					});
				}, 1500);					
			}
		})
	}
}