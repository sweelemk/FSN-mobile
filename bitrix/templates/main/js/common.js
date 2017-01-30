'use strict'
function preload(){
	var siteLoader = $(".screen-load"),
		activeLoad = siteLoader.find(".load-active"),
		activeContainer = siteLoader.find(".load-container"),
		timeLine = new TimelineLite();

	timeLine
		.set(activeLoad, {
			width: 0
		})
		.to(activeLoad, 1.2, {
			width: "10%",
			ease: Power2.easeOut
		})
		.to(activeLoad, 0.5, {
			width: "25%",
			ease: Power2.easeOut
		})
		.to(activeLoad, 1.5, {
			width: "33.5%",
			ease: Power2.easeOut
		})
		.to(activeLoad, 1.5, {
			width: "60.5%",
			ease: Power2.easeOut
		})
		.to(activeLoad, 0.7, {
			width: "80.5%",
			ease: Power2.easeOut
		})
		.to(activeLoad, 1, {
			width: "100%",
			ease: Power2.easeOut
		})
		.to(siteLoader, 0.3, {
			autoAlpha: "0",
			delay: 0.7,
			display: 'none',
			ease: Power2.easeOut,
			onComplete: function(){
				$(".out").addClass("load");
				setTimeout(function(){
					$(".out").removeClass("unload load");
				},1600)
			}
		})
}

$(document).ready(function(){
	preload();
})

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
	if(document.querySelector(el) != null)
		this.init();
		this.scrollUpdate();
}

customScroll.prototype.init = function() {
	var self = this;
	if(!document.querySelectorAll(self.el).length) return;

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
	// if(typeof gallery !== "undefined") {
	// 	this.scroll.on("scroll", gallery.scrollValue);
	// 	this.scroll.on("scrollEnd", gallery.scrollValue);
	// }
}
customScroll.prototype.scrollUpdate = function(){
	var self = this;
	$(window).resize(function(){
		this.timer;
		clearTimeout(this.timer);
		this.timer = setTimeout(function(){
			self.update();
		},300);
	})
}


var mainScroll = ".wrapper",
	scrollPopup = ".page-menu",
	scrollModal = ".modal__wrapper",
	scrollBrand = ".brand-modal",
	mainScrollInit, scrollPopupInit, scrollModalInit, scrollBrandInit, burger, pull;
window.onload =  function(){
	mainScrollInit = new customScroll(mainScroll);
	scrollPopupInit = new customScroll(scrollPopup);
	scrollModalInit = new customScroll(scrollModal);
	scrollBrandInit = new customScroll(scrollBrand);
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	pull = new PullMobile();
	pull.init();
	burger = new mobileMenu();
	burger.init();
};



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

	var bodyClassRemove = function() {
		document.body.removeEventListener( 'transitionend', bodyClassRemove, false );
	};

	document.body.addEventListener( 'transitionend', bodyClassRemove, false );
};

function mobileMenu() {		
	_this = this;
	
	_this.initEvent = function(){
		_this.trigger.addEventListener("click", _this.openMenu, false);

		_this.link.forEach(function(el){
			el.addEventListener("click", function(){
				_this.triggerLink($(this));
				return false;
			});
		});
	}

	_this.openMenu = function() {
		if(_this.trigger.classList.contains("modal")) return false;
		if(!_this.trigger.classList.contains("open")) {
			_this.trigger.classList.add("open");
			_this.trigger.classList.add("open_burger");
			_this.container.classList.add("open");
	 	} else {
	 		_this.closeMenu();
		}		
	}

	_this.closeMenu = function() {
		_this.trigger.classList.remove("open", "open_burger");
		setTimeout(function(){
			_this.container.classList.remove("open");
		}, 300);		
	}

	_this.triggerLink = function(item){
		var $this = item;

		$this.parent("li").addClass("active").siblings().removeClass("active");

		setTimeout(function(){
			_this.closeMenu();
			setTimeout(function(){
				loading($this.attr("href"));
			}, 500);
		},300);
		return false;
	}
	
	_this.init = function() {
		_this.trigger = document.querySelector(".burger");
		_this.container = document.querySelector(".page-menu");
		_this.link = [].slice.call(document.querySelectorAll(".menu-item_link"));
		_this.scroll = document.querySelector(".out");
		_this.posY;

		_this.initEvent();
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
		// this.init();
		
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
		this.reset = this.el.find(".form-reset");
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
			loading(this.form.attr("action"));
			self.closeFilter();
			event.preventDefault();
		});
		this.reset.on("click", function(event){
			loading();
			self.closeFilter();
			event.preventDefault();
		});
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
		})
	};
	
	$.ajax({
		url: _href,
		datatype: "html",
		beforeSend: function(){
			_this.initAnimation();
		},
		success: function(content){
			var cont = $(content).find("#touch").html();
			var bodyColor = $(content).find(".bg-color").css("background-color");

			window.history.pushState("page" + _href, _href, _href);
			window.history.replaceState("page" + _href, _href, _href);

			var parentIndex = $(content).find(".menu .active").parent().index();
			var navIndex = $(content).find(".menu .active").index();
			$(".menu").find(".active").removeClass("active");

			$(".menu").find(".menu-item").parent().eq(parentIndex).find("li").eq(navIndex).addClass("active");

			setTimeout(function(){
				$("#touch").html(cont).promise().done(function(){
					_doReset();
					mainScrollInit.init();
					scrollBrandInit.init();
					_this.endAnimation();
					$(".bg-color").css("background-color", bodyColor);				
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
				this.linkNext = $(content).find(self.options.btnNext).attr("href");
				this.linkPrev = $(content).find(self.options.btnPrev).attr("href");

				window.history.pushState("page" + element, element, element);
				window.history.replaceState("page" + element, element, element);
				
				setTimeout(function(){
					$(self.options.appendContainer).html(that.cont).promise().done(function(){
						mainScrollInit.update();
						$(self.options.appendContainer).removeClass("load");
						$(self.el).find(self.default.paginCurrent).html(that.nextCurr);
						$(self.el).find(self.default.btnNext).attr("href", that.linkNext);
						$(self.el).find(self.default.btnPrev).attr("href", that.linkPrev);
					});
				}, 1500);
			}
		});
	}
}
function triggerLink(){
	$("body").on("click", ".ajax-trigger", function(e) {
		loading($(this));
		return false;
	});
}
$(document).ready(function(){
	triggerLink();
})

function Form(){
	var _this = this;

	_this.initEvents = function(){
		$("body").off("click.modal").on("click.modal", "[data-modal]", function(event){
			var _ = $(this),
				_data = _.data("modal");

			_this.openModal(_data);
			event.preventDefault();
			return false;
		});

		$("body").off("click.modalBurger").on("click.modalBurger", ".burger", _this.bindEventClick);
	};

	_this.bindEventClick = function(){
		if(_this.modal.hasClass("open")) {
			_this.closeModal();
		}
		
		if($(".js-validation").hasClass("validation-success") || $(".js-validation").hasClass("validation-error")) {
			valid.options.onReset($(".js-validation"));
		}
	}

	_this.openModal = function(data){
		var modal = $("[data-modal-popup='" + data + "']");

		modal.addClass("open");
		_this.burger.addClass("modal open_burger");

	};

	_this.closeModal = function(){
		_this.modal.removeClass("open");
		_this.burger.removeClass("open_burger");
		setTimeout(function(){
			_this.burger.removeClass("modal");
		},300);
	}

	_this.init = function(){
		_this.burger = $(".burger");
		_this.modal = $(".modal__wrapper");

		_this.initEvents();
	}
}
if(typeof Validation == "undefined") {
	function Validation(el, options){
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this.init();
	};
	Validation.prototype.options = {
		onSubmit : function(form) {
			return false;
		},
		onReset: function(form){
			return false;
		}
	};

	Validation.prototype = {
		init: function(){
			this.input = this.el.find("input");
			this.submit = this.el.find("[type='submit']");

			this.initEvents();
		},
		checkInput: function(input){
			if(input.val() != "") {
				input.removeClass("empty");
			} else {
				input.addClass("empty");
			}
		},
		showErrorMsg: function(input){
			var self = this;
			if(input.hasClass("empty")){
				var msg = input.data("error-msg");
				if(!msg){
					msg = self.options.errorMsg
				}
				input.parent().append("<span class='error-msg'>" + msg + "</span>")
			} else {
				input.parent().find(".error-msg").remove();
			}
			scrollPopupInit.update();
		},
		valid: function(input){
			var self = this;
			this.size = this.el.find(".empty").length;

			if(this.size > 0) {
				this.el.addClass("validation-error").removeClass("validation-success");
			} else {
				this.el.addClass("validation-success").removeClass("validation-error");
			}
		},
		resetForm: function(){
			this.input.removeClass("empty");
			this.input.parent().find(".error-msg").remove();
		},
		initEvents: function(){
			var self = this;
			this.input.on("input", function(){
				self.checkInput($(this));
				self.valid($(this));
			});
			this.input.on("blur", function(){
				self.checkInput($(this));
				self.showErrorMsg($(this));
				self.valid($(this));
			});

			this.submit.on("click", function(e){
				self.input.each(function(){
					self.checkInput($(this));
					self.showErrorMsg($(this));
					self.valid($(this));
				});
				if(self.el.hasClass("validation-success")) {
					self.options.onSubmit();
				}
				e.preventDefault();
				return false;
			});
		}
	}
};

function AccordionGallery(el){
	this.el = el;

	this.option = {
		defaultText: "Подробнее",
		openText: "Скрыть"
	}

	this.init();
}
AccordionGallery.prototype = {
	init: function(){
		this.showMore = this.el.find(".cross-link");

		this.initEvents();
	},
	initEvents: function(){
		var self = this;
		this.showMore.on("click", function(){
			if($(this).hasClass("open")){
				self.closeBox($(this))
			} else {
				self.openBox($(this))
			}
		});
	},
	openBox: function(item){
		var  self = this;
		$(item).parent().find(".hidden-box").slideDown({
			duration: 350,
			complete: function(){
				mainScrollInit.update();
				$(item).addClass("open").find("span").text(self.option.openText);
			}
		});
	},
	closeBox: function(item){
		var  self = this;
		$(item).parent().find(".hidden-box").slideUp({
			duration: 350,
			complete: function(){
				mainScrollInit.update();
				$(item).removeClass("open").find("span").text(self.option.defaultText);
			}
		});
	}
}
function BrandModal(el){
	this.el = el;
	this.init()
}
BrandModal.prototype = {
	init: function(){
		this.modalContainer = $(".brand-modal");
		this.brandContainer = $(".brand-modal_container");
		this.burger = this.modalContainer.parents(".out").find(".burger");
		this.scrollArea = this.modalContainer.find(".scroll-area");

		this.eventHandlers();
	},
	eventHandlers: function() {
		var self = this;
		this.el.on("click", function(){
			this.index = $(this).data("brand");
			self.openWindow(this.index)
		});
		this.brandContainer.on("click", function(event){
			event.stopPropagation();
		});
		this.modalContainer.on("click", function(){
			self.closeWindow();
		});
		$('body').off("click.brand").on("click.brand", ".burger", function(){
			self.closeWindow();
		});
	},
	openWindow: function(el) {
		var self = this;
		this.modal = this.modalContainer.find("[data-modal-index=" + (+el) + "]");
		scrollBrandInit.scrollUp();
		setTimeout(function(){			
			self.scrollArea.height(self.modal.innerHeight());
			scrollBrandInit.update();
		},300);
		this.modalContainer.addClass("mobal-open modal-animate");
		this.modal.addClass("open");
		this.burger.addClass("modal open_burger");
	},
	closeWindow: function(){
		var self = this;
		if(this.modalContainer.hasClass("mobal-open")){
			this.brandContainer.removeClass("open");
			this.modalContainer.removeClass("modal-animate");
			this.burger.removeClass("open_burger");
			setTimeout(function(){
				self.modalContainer.removeClass("mobal-open");
				self.burger.removeClass("modal");
			}, 500);
		}
			
	}
}
function SimpleValidForm(el, options){
	this.el = el;
	this.options = extend( {}, this.options );
	extend( this.options, options );
	this.init();
};
SimpleValidForm.prototype.options = {
	onSubmit: function(){
		return false;
	}
}
SimpleValidForm.prototype = {
	init: function(){
		this.input = [].slice.call($(this.el).find(".input-form"));
		this.submit = $(this.el).find(".submit");

		this.initEvents();
	},
	initEvents: function(){
		var self = this;
		this.submit.on("click", function(event){
			self.input.forEach(function(item){
				self.validate(item);
				return false;
			});
			event.preventDefault();
		});
	},
	validate: function(input){
		if(input.value === "") {
			this.errorEvent(input)
		} else {
			input.classList.remove("error");
			this.options.onSubmit(this.el);
		}
	},
	errorEvent: function(inputItem){
		inputItem.classList.add("error");
	}	
};

function HorizontalGallery(el){
	this.el = el;

	this.init();
}
HorizontalGallery.prototype = {
	init: function(){
		var self = this;

		this.video = this.el.find("video");

		this.el.slick({
			infinite: false,
			slidesToShow: 1,
			swipeToSlide: 1,
			slidesToScroll: 1,
			centerMode: true,
			centerPadding: '15px',
			arrows: false,
			speed: 800,
			touchMove: false,
			touchThreshold: 5,
			responsive: [
				{
					breakpoint: 1025,
					settings: {
						centerPadding: '50px'
					}
				},
				{
					breakpoint: 768,
					settings: {
						centerPadding: '15px'
					}
				}
			]
		});

		this.slideLength = this.el.find(".slider-item").length;

		this.dur = 900;

		this.action = false;

		this.paginAll = this.el.next().find(".pagination-all");
		this.paginCurrent = this.el.next().find(".current");

		if(this.slideLength < 10) {
			this.paginAll.text("0" + this.slideLength);
		} else {
			this.paginAll.text(this.slideLength);
		}
	
		this.slideItem = this.el.find(".slider-item");

		this.eventHandlers();
	},
	eventHandlers: function(){
		var self = this;

		this.el.on("afterChange", function(slick, currentSlide){

			this.currSlide = $(this).slick("slickCurrentSlide") + 1;

			if(self.slideLength < 10) {
				self.paginCurrent.text("0" + this.currSlide);
			} else {
				self.paginCurrent.text(this.currSlide);
			}

			console.log(this.currSlide)

		});
	}
};

function ModalVideo(el){
	this.el = el;

	this.videoOBJ = [];

	this.opt = {
		timeout: 500
	}

	this.init();
}
ModalVideo.prototype = {
	init: function(){
		this.modalWindow = $(".modal-video");
		this.modalFrame = this.modalWindow.find(".modal-video-frame");
		this.burger = $(".burger");
		this.mainCover = $(".out");

		this.eventHandlers();
	},
	eventHandlers: function(){
		var self = this;
		this.el.on("click", function(){
			this.videoID = $(this).data("id");
			this.templateFrame = self.templateVideo(this.videoID);

			self.openModal(this.templateFrame);
		});

		$("body").off('click.video').on("click.video", ".burger", function(){
			self.closeModal();		
		});
		this.modalWindow.on("click", function(){
			self.closeModal();
		});
		this.modalFrame.on("click", function(event){
			event.stopPropagation();
		})
	},
	templateVideo: function(id) {
		var self = this;
		this.iframeImg = document.createElement("img");
		this.iframeImgURL = "http://i.ytimg.com/vi/" + id + "/maxresdefault.jpg" ;

		this.iframeImg.setAttribute("src", this.iframeImgURL);

		this.iframeVideo = document.createElement("iframe");
		this.iframeVideoURL = "https://www.youtube.com/embed/" + id;
		
		this.iframeVideo.setAttribute("src", this.iframeVideoURL);

		this.videoOBJ.push(this.iframeImg, this.iframeVideo);
		return this.videoOBJ;
	},
	openModal: function(link){

		var self = this;

		this.modalWindow.addClass("modal-video-open modal-video-overlay");

		this.modalFrame.addClass("animate").append(link[0]);

		this.burger.addClass("open_burger modal");

		setTimeout(function(){
			self.mainCover.addClass("openModal");
			self.modalFrame.append(link[1]);
			self.loadFrame();
		}, this.opt.timeout*1.5);
	},
	loadFrame: function(){
		this.modalFrame.find("iframe").on("load", function(){
			$(this).addClass("load");
		});
	},
	closeModal: function(){
		var self = this;

		if(this.modalWindow.hasClass("modal-video-open")){
			this.modalFrame.removeClass("animate");
			this.burger.removeClass("open_burger");
			setTimeout(function(){
				self.modalWindow.removeClass("modal-video-overlay");
				self.modalFrame.empty();
				self.burger.removeClass("modal");
				self.videoOBJ = [];
			}, this.opt.timeout*1.5);
			setTimeout(function() {
				self.modalWindow.removeClass("modal-video-open");
				self.mainCover.removeClass("openModal");
			}, this.opt.timeout*2.5);
		}
	}
}
function maps(){
	if(typeof (google) != "object") {
		var tag = document.createElement("script");

		tag.setAttribute("type", "text/javascript");
		tag.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key=AIzaSyCcDrkEbKdrAWUT7ZorYyn-NwTj9YD6DN4&callback=initMap");
		document.querySelector(".map-modal").appendChild(tag);
	} else {
		$(initialize);
	}
}
function initMap(){
	$(window).bind(initialize());
}
function initialize() {
	var arrCoord = $("#map").data("position");
	var coord = arrCoord.split(",");
	var stylez = [{"featureType":"all","elementType":"geometry","stylers":[{"color":"#262c33"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"gamma":0.01},{"lightness":20},{"color":"#949aa6"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"saturation":-31},{"lightness":-33},{"weight":2},{"gamma":"0.00"},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.locality","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":30},{"saturation":30},{"color":"#353c44"},{"visibility":"on"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"saturation":"0"},{"lightness":"0"},{"gamma":"0.30"},{"weight":"0.01"},{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"lightness":"100"},{"saturation":-20},{"visibility":"simplified"},{"color":"#31383f"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":10},{"saturation":-30},{"color":"#2a3037"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"saturation":"-100"},{"lightness":"-100"},{"gamma":"0.00"},{"color":"#2a3037"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"visibility":"on"},{"color":"#575e6b"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#4c5561"},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"lightness":-20},{"color":"#2a3037"}]}];
	var mapOptions = {
		zoom: 16,
		disableDefaultUI: true,
		scrollwheel: true,
		panControl: false,
		zoomControl: false,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.SMALL,
			position: google.maps.ControlPosition.RIGHT_CENTER
		},
		scaleControl: true,
		center: new google.maps.LatLng(coord[0], coord[1]),
	};

	map = new google.maps.Map(document.getElementById('map'),mapOptions);
	var mapType = new google.maps.StyledMapType(stylez, { name:"Grayscale" });
	map.mapTypes.set('tehgrayz', mapType);
	map.setMapTypeId('tehgrayz');
	var image = 'img/icons/baloon.png';
	var myLatLng = new google.maps.LatLng(coord[0], coord[1]);
	var beachMarker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		icon: image,
		title:""
	});

	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center); 
	});

	// var zoomControlDiv = document.createElement('div');
 //  	var zoomControl = new ZoomControl(zoomControlDiv, map);

 //  	zoomControlDiv.index = 1;
	// map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomControlDiv);
};
function ZoomControl(controlDiv, map) {
	controlDiv.style.padding = "30px";

	var controlWrapper = document.createElement('div');
		controlWrapper.style.cursor = 'pointer';
		controlWrapper.style.textAlign = 'center';
		controlWrapper.style.width = '30px'; 
		controlWrapper.style.height = '60px';
		controlDiv.appendChild(controlWrapper);

	var zoomInButton = document.createElement('div');
		zoomInButton.classList.add("zoomIn");
		zoomInButton.style.width = '30px'; 
		zoomInButton.style.height = '30px';
		controlWrapper.appendChild(zoomInButton);

	var zoomOutButton = document.createElement('div');
		zoomOutButton.classList.add("zoomOut");
		zoomOutButton.style.width = '30px'; 
		zoomOutButton.style.height = '30px';
		controlWrapper.appendChild(zoomOutButton);

	google.maps.event.addDomListener(zoomInButton, 'click', function() {
		map.setZoom(map.getZoom() + 1);
	});

	google.maps.event.addDomListener(zoomOutButton, 'click', function() {
		map.setZoom(map.getZoom() - 1);
	});
}

function mapModal() {
	var _this = this;

	_this.opt = {
		timeout: 500
	}

	_this.eventHandlers = function(){
		_this.trigger.on("click", function(e){

			_this.openModal();

			e.preventDefault();
		});

		_this.mapCloseBtn.on("click", function(){
			_this.closeModal();
		});

		// _this.modalContainer.on("click", function(){
		// 	_this.closeModal()
		// });

		_this.mapContainer.on("click", function(e){
			e.stopPropagation();
		});
	};

	_this.openModal = function(){
		_this.modalContainer.addClass("map-open map-overlay");
		_this.mapContainer.addClass("open-map");
		_this.mapCloseBtn.addClass("open_burger modal")
	};

	_this.closeModal = function(){
		_this.mapContainer.removeClass("open-map");
		_this.modalContainer.removeClass("map-overlay");
		_this.mapCloseBtn.removeClass("open_burger");

		setTimeout(function(){
			_this.modalContainer.removeClass("map-open");
			_this.mapCloseBtn.removeClass("modal")
		}, _this.opt.timeout);
	}

	_this.init = function(){
		_this.trigger = $(".js-modal-map");
		_this.modalContainer = $(".map-modal");
		_this.mapContainer = _this.modalContainer.find(".map-container");
		_this.mapCloseBtn = _this.modalContainer.parents(".out").find(".burger");
		_this.eventHandlers();
	}
}