(function ($) {
    "use strict";
	//===== jquery code for sidebar menu
	$('.menu-item.has-submenu .menu-link').on('click', function(e){
		e.preventDefault();
		if($(this).next('.submenu').is(':hidden')){
			$(this).parent('.has-submenu').siblings().find('.submenu').slideUp(200);
		} 
		$(this).next('.submenu').slideToggle(200);
	});

	// mobile offnavas triggerer for generic use
	$("[data-trigger]").on("click", function(e){
		e.preventDefault();
		e.stopPropagation();
		var offcanvas_id =  $(this).attr('data-trigger');
		$(offcanvas_id).toggleClass("show");
		$('body').toggleClass("offcanvas-active");
		$(".screen-overlay").toggleClass("show");

	}); 

	$(".screen-overlay, .btn-close").click(function(e){
		$(".screen-overlay").removeClass("show");
		$(".mobile-offcanvas, .show").removeClass("show");
		$("body").removeClass("offcanvas-active");
	}); 

	// minimize sideber on desktop

	$('.btn-aside-minimize').on('click', function(){
		if( window.innerWidth < 768) {
			$('body').removeClass('aside-mini');
			$(".screen-overlay").removeClass("show");
			$(".navbar-aside").removeClass("show");
			$("body").removeClass("offcanvas-active");
		} 
		else {
			// minimize sideber on desktop
			$('body').toggleClass('aside-mini');
		}
	});

	//Nice select
	if ($('.select-nice').length) {
    	$('.select-nice').select2();
	}
	// Perfect Scrollbar
	if ($('#offcanvas_aside').length) {
		const demo = document.querySelector('#offcanvas_aside');
		const ps = new PerfectScrollbar(demo);
	}

	// Dark mode toogle
	$('.darkmode').on('click', function () {
		$('body').toggleClass("dark");
	});
	
})(jQuery);





// Javascript code for WebSite


!function(e){"use strict";gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);const t=new Lenis({lerp:.1,touchMultiplier:0,smoothWheel:!1,smoothTouch:!1,mouseWheel:!1,autoResize:!0,smooth:!0,easing:e=>Math.min(1,1.001-Math.pow(2,-10*e)),syncTouch:!0});gsap.ticker.add((e=>{t.raf(1e3*e)})),gsap.ticker.lagSmoothing(0),requestAnimationFrame((function e(o){t.raf(o),requestAnimationFrame(e)}));const o=document.querySelector(".scrollToTop");o.addEventListener("click",(e=>{e.preventDefault(),gsap.to(window,{duration:1,scrollTo:0})})),gsap.set(o,{autoAlpha:0,y:50}),gsap.to(o,{autoAlpha:1,y:0,scrollTrigger:{trigger:"body",start:"top -20%",end:"top -20%",toggleActions:"play none reverse none"}}),e(window).on("load",(function(){e(".preloader").fadeOut(),e(".vs-hero").addClass("animate-elements"),e(".preloader").length&&e(".preloaderCls").on("click",(function(t){t.preventDefault(),e(".preloader").hide()}))}));const n=document.querySelectorAll("[data-scroll]"),s=new IntersectionObserver((e=>{e.forEach((e=>{e.isIntersecting?e.target.classList.add("is-inview"):e.target.classList.remove("is-inview")}))}),{threshold:.1});n.forEach((e=>s.observe(e)));const a=gsap.timeline({scrollTrigger:{trigger:"#navbars",start:"top+=600",end:"+=1",toggleActions:"play none none none",scrub:1,duration:.2}});if(gsap.set("#navbars",{opacity:0,visibility:"hidden",y:-82}),a.to("#navbars",{opacity:1,visibility:"visible",y:0,duration:.2,ease:"power2.out"}),e(".reveal").length){document.querySelectorAll(".reveal").forEach((e=>{let t=e.querySelector("img"),o=gsap.timeline({scrollTrigger:{trigger:e,toggleActions:"play none none none"}});o.set(e,{autoAlpha:1}),o.from(e,1.5,{xPercent:-100,ease:Power2.out}),o.from(t,1.5,{xPercent:100,scale:1.3,delay:-1.5,ease:Power2.out})}))}var i,r,l;function c(e){var t=e.siblings(".indicator"),o=e.css("width"),n=e.css("height"),s=e.position().left,a=e.position().top;e.addClass("active").siblings().removeClass("active"),t.css({left:s+"px",top:a+"px",width:o,height:n})}if(e.fn.vsmobilemenu=function(t){var o=e.extend({menuToggleBtn:".vs-menu-toggle",bodyToggleClass:"vs-body-visible",subMenuClass:"vs-submenu",subMenuParent:"vs-item-has-children",subMenuParentToggle:"vs-active",meanExpandClass:"vs-mean-expand",appendElement:'<span class="vs-mean-expand"></span>',subMenuToggleClass:"vs-open",toggleSpeed:400},t);return this.each((function(){var t=e(this);function n(){t.toggleClass(o.bodyToggleClass);var n="."+o.subMenuClass;e(n).each((function(){e(this).hasClass(o.subMenuToggleClass)&&(e(this).removeClass(o.subMenuToggleClass),e(this).css("display","none"),e(this).parent().removeClass(o.subMenuParentToggle))}))}t.find("li").each((function(){var t=e(this).find("ul");t.addClass(o.subMenuClass),t.css("display","none"),t.parent().addClass(o.subMenuParent),t.prev("a").append(o.appendElement),t.next("a").append(o.appendElement)}));var s="."+o.meanExpandClass;e(s).each((function(){e(this).on("click",(function(t){var n;t.preventDefault(),n=e(this).parent(),e(n).next("ul").length>0?(e(n).parent().toggleClass(o.subMenuParentToggle),e(n).next("ul").slideToggle(o.toggleSpeed),e(n).next("ul").toggleClass(o.subMenuToggleClass)):e(n).prev("ul").length>0&&(e(n).parent().toggleClass(o.subMenuParentToggle),e(n).prev("ul").slideToggle(o.toggleSpeed),e(n).prev("ul").toggleClass(o.subMenuToggleClass))}))})),e(o.menuToggleBtn).each((function(){e(this).on("click",(function(){n()}))})),t.on("click",(function(e){e.stopPropagation(),n()})),t.find("div").on("click",(function(e){e.stopPropagation()}))}))},e(".vs-menu-wrapper").vsmobilemenu(),e("[data-bg-src]").length>0&&e("[data-bg-src]").each((function(){var t=e(this).attr("data-bg-src");e(this).css("background-image","url("+t+")"),e(this).removeAttr("data-bg-src").addClass("background-image")})),e(".vs-carousel").each((function(){var t=e(this);function o(e){return t.data(e)}var n='<button type="button" class="slick-prev"><i class="'+o("prev-arrow")+'"></i></button>',s='<button type="button" class="slick-next"><i class="'+o("next-arrow")+'"></i></button>';e("[data-slick-next]").each((function(){e(this).on("click",(function(t){t.preventDefault(),e(e(this).data("slick-next")).slick("slickNext")}))})),e("[data-slick-prev]").each((function(){e(this).on("click",(function(t){t.preventDefault(),e(e(this).data("slick-prev")).slick("slickPrev")}))})),1==o("arrows")&&(t.closest(".arrow-wrap").length||t.closest(".container").parent().addClass("arrow-wrap")),t.slick({dots:!!o("dots"),fade:!!o("fade"),arrows:!!o("arrows"),speed:o("speed")?o("speed"):1e3,asNavFor:!!o("asnavfor")&&o("asnavfor"),autoplay:(o("autoplay"),!1),infinite:0!=o("infinite"),slidesToShow:o("slide-show")?o("slide-show"):1,adaptiveHeight:!!o("adaptive-height"),centerMode:!!o("center-mode"),autoplaySpeed:o("autoplay-speed")?o("autoplay-speed"):8e3,centerPadding:o("center-padding")?o("center-padding"):"0",focusOnSelect:0!=o("focuson-select"),pauseOnFocus:!!o("pauseon-focus"),pauseOnHover:!!o("pauseon-hover"),variableWidth:!!o("variable-width"),vertical:!!o("vertical"),verticalSwiping:!!o("vertical"),prevArrow:o("prev-arrow")?n:'<button type="button" class="slick-prev"><i class="far fa-chevron-left"></i></button>',nextArrow:o("next-arrow")?s:'<button type="button" class="slick-next"><i class="far fa-chevron-right"></i></button>',rtl:"rtl"==e("html").attr("dir"),responsive:[{breakpoint:1600,settings:{arrows:!!o("xl-arrows"),dots:!!o("xl-dots"),slidesToShow:o("xl-slide-show")?o("xl-slide-show"):o("slide-show"),centerMode:!!o("xl-center-mode"),centerPadding:0}},{breakpoint:1400,settings:{arrows:!!o("ml-arrows"),dots:!!o("ml-dots"),slidesToShow:o("ml-slide-show")?o("ml-slide-show"):o("slide-show"),centerMode:!!o("ml-center-mode"),centerPadding:0}},{breakpoint:1200,settings:{arrows:!!o("lg-arrows"),dots:!!o("lg-dots"),slidesToShow:o("lg-slide-show")?o("lg-slide-show"):o("slide-show"),centerMode:!!o("lg-center-mode")&&o("lg-center-mode"),centerPadding:0}},{breakpoint:992,settings:{arrows:!!o("md-arrows"),dots:!!o("md-dots"),slidesToShow:o("md-slide-show")?o("md-slide-show"):1,centerMode:!!o("md-center-mode")&&o("md-center-mode"),centerPadding:0}},{breakpoint:767,settings:{arrows:!!o("sm-arrows"),dots:!!o("sm-dots"),slidesToShow:o("sm-slide-show")?o("sm-slide-show"):1,centerMode:!!o("sm-center-mode")&&o("sm-center-mode"),centerPadding:0,vertical:!!o("sm-vertical"),verticalSwiping:!!o("sm-vertical")}},{breakpoint:576,settings:{arrows:!!o("xs-arrows"),dots:!!o("xs-dots"),slidesToShow:o("xs-slide-show")?o("xs-slide-show"):1,centerMode:!!o("xs-center-mode")&&o("xs-center-mode"),centerPadding:0,vertical:!!o("xs-vertical"),verticalSwiping:!!o("xs-vertical")}}]});e(".slick-status");t.on("afterChange",(function(t,o,n){var s=o.slideCount,a=n+1;e(".slick-status__active").text(a<10?"0"+a:a),e(".slick-status span:last").text(s<10?"0"+s:s)})),t.on("init",(function(){var o=t.slick("getSlick").slideCount;e(".slick-status__active").text("01"),e(".slick-status span:last").text(o<10?"0"+o:o)}))})),e(".nav-link").on("shown.bs.tab",(function(t){e(".vs-carousel").slick("setPosition")})),e.fn.vsTab=function(t){var o=e.extend({sliderTab:!1,tabButton:"button",indicator:!1},t);e(this).each((function(){var t=e(this),n=t.find(o.tabButton);if(n.on("click",(function(t){t.preventDefault();var n=e(this);n.addClass("active").siblings().removeClass("active"),o.sliderTab&&e(s).slick("slickGoTo",n.data("slide-go-to"))})),o.sliderTab){var s=t.data("asnavfor"),a=0;n.each((function(){var n=e(this);n.attr("data-slide-go-to",a),a++,n.hasClass("active")&&e(s).slick("slickGoTo",n.data("slide-go-to")),e(s).on("beforeChange",(function(e,n,s,a){t.find(o.tabButton+'[data-slide-go-to="'+a+'"]').addClass("active").siblings().removeClass("active")}))}))}}))},e(".vs-slider-tab").length&&e(".vs-slider-tab").vsTab({sliderTab:!0,tabButton:".tab-btn"}),function(t){var o=t,n="is-invalid",s='[name="email"]',a='[name="name"],[name="email"],[name="phone"],[name="message"]',i=e(t).next(".form-messages");function r(){var t,r=e(o).serialize();t=function(){var t,i=!0;function r(s){s=s.split(",");for(var a=0;a<s.length;a++)t=o+" "+s[a],e(t).val()?(e(t).removeClass(n),i=!0):(e(t).addClass(n),i=!1)}r(a),e(o+" "+s).val()&&e(o+" "+s).val().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)?(e(o+" "+s).removeClass(n),i=!0):(e(o+" "+s).addClass(n),i=!1);return i}(),t&&jQuery.ajax({url:e(o).attr("action"),data:r,type:"POST"}).done((function(t){i.removeClass("error"),i.addClass("success"),i.text(t),e(o+' input:not([type="submit"]),'+o+" textarea").val("")})).fail((function(e){i.removeClass("success"),i.addClass("error"),""!==e.responseText?i.html(e.responseText):i.html("Oops! An error occurred and your message could not be sent.")}))}e(o).on("submit",(function(e){e.preventDefault(),r()}))}(".ajax-contact"),i=".sidemenu-wrapper",r=".sideMenuCls",l="show",e(".sideMenuToggler").on("click",(function(t){t.preventDefault(),e(i).addClass(l)})),e(i).on("click",(function(t){t.stopPropagation(),e(i).removeClass(l)})),e(i+" > div").on("click",(function(t){t.stopPropagation(),e(i).addClass(l)})),e(r).on("click",(function(t){t.preventDefault(),t.stopPropagation(),e(i).removeClass(l)})),function(t,o,n,s){e(o).on("click",(function(o){o.preventDefault(),e(t).addClass(s)})),e(t).on("click",(function(o){o.stopPropagation(),e(t).removeClass(s)})),e(t).find("form").on("click",(function(o){o.stopPropagation(),e(t).addClass(s)})),e(n).on("click",(function(o){o.preventDefault(),o.stopPropagation(),e(t).removeClass(s)}))}(".popup-search-box",".searchBoxTggler",".searchClose","show"),e(".popup-image").magnificPopup({type:"image",gallery:{enabled:!0}}),e(".popup-video").magnificPopup({type:"iframe"}),new WOW({boxClass:"wow",animateClass:"wow-animated",offset:0,mobile:!1,live:!0,scrollContainer:null,resetAnimation:!1}).init(),e(".login-tab a").each((function(){var t=e(this);t.hasClass("active")&&c(t),t.on("mouseover",(function(){c(e(this))}))})),e(".vs-color-plate").length){var d=e("#plate-color").val();e("#plate-color").on("change",(function(t){var o=t.target.value;e("body").css("--theme-color",o)})),e("#plate-reset").on("click",(function(){e("body").css("--theme-color",""),e("#plate-color").val(d)})),e("#plate-toggler").on("click",(function(){e(".vs-color-plate").toggleClass("open")}))}function u(e){return e.toString().padStart(2,"0")}e(".quantity-plus").each((function(){e(this).on("click",(function(t){t.preventDefault();var o=e(this).closest(".quantity-container").find(".qty-input"),n=parseInt(o.val());isNaN(n)||o.val(u(n+1))}))})),e(".quantity-minus").each((function(){e(this).on("click",(function(t){t.preventDefault();var o=e(this).closest(".quantity-container").find(".qty-input"),n=parseInt(o.val());!isNaN(n)&&n>1&&o.val(u(n-1))}))})),e("#ship-to-different-address-checkbox").on("change",(function(){e(this).is(":checked")?e("#ship-to-different-address").next(".shipping_address").slideDown():e("#ship-to-different-address").next(".shipping_address").slideUp()})),e(".woocommerce-form-login-toggle a").on("click",(function(t){t.preventDefault(),e(".woocommerce-form-login").slideToggle()})),e(".woocommerce-form-coupon-toggle a").on("click",(function(t){t.preventDefault(),e(".woocommerce-form-coupon").slideToggle()})),e(".shipping-calculator-button").on("click",(function(t){t.preventDefault(),e(this).next(".shipping-calculator-form").slideToggle()})),e('.wc_payment_methods input[type="radio"]:checked').siblings(".payment_box").show(),e('.wc_payment_methods input[type="radio"]').each((function(){e(this).on("change",(function(){e(".payment_box").slideUp(),e(this).siblings(".payment_box").slideDown()}))})),e(".rating-select .stars a").each((function(){e(this).on("click",(function(t){t.preventDefault(),e(this).siblings().removeClass("active"),e(this).parent().parent().addClass("selected"),e(this).addClass("active")}))})),document.addEventListener("DOMContentLoaded",(function(){const e=document.querySelectorAll(".swatch");e.forEach((t=>{t.addEventListener("click",(function(){e.forEach((e=>e.classList.remove("active"))),this.classList.add("active")}))}))})),e("#slider-range").slider({range:!0,min:30,max:150,values:[30,570],slide:function(t,o){e("#minAmount").text(o.values[0]+"$"),e("#maxAmount").text(o.values[1]+"$")}}),e("#minAmount").text("$"+e("#slider-range").slider("values",0)),e("#maxAmount").text("$"+e("#slider-range").slider("values",1)),e.fn.countdown=function(){this.each((function(){var t=e(this),o=new Date(t.data("offer-date")).getTime();function n(e){return t.find(e)}var s=setInterval((function(){var e=(new Date).getTime(),a=o-e,i=Math.floor(a/864e5),r=Math.floor(a%864e5/36e5),l=Math.floor(a%36e5/6e4),c=Math.floor(a%6e4/1e3);i<10&&(i="0"+i),r<10&&(r="0"+r),l<10&&(l="0"+l),c<10&&(c="0"+c),a<0?(clearInterval(s),t.addClass("expired"),n(".message").css("display","block")):(n(".day").html(i),n(".hour").html(r),n(".minute").html(l),n(".seconds").html(c))}),1e3)}))},e(".offer-counter").length&&e(".offer-counter").countdown(),document.addEventListener("DOMContentLoaded",(function(){const e=document.getElementById("popup");if(e){function t(){window.innerWidth>=1440&&window.scrollY>300&&(e.style.display="flex",window.removeEventListener("scroll",t))}window.addEventListener("scroll",t);const o=document.getElementById("close-popup");o&&o.addEventListener("click",(function(){e.style.display="none"}));const n=document.querySelector(".no-thanks");n&&n.addEventListener("click",(function(){e.style.display="none"}))}})),gsap.utils.toArray(".vs-gsap-img-parallax").forEach((function(e){let t=e.querySelector("img");gsap.timeline({scrollTrigger:{trigger:e,scrub:.5}}).from(t,{yPercent:-30,ease:"none"}).to(t,{yPercent:30,ease:"none"})})),document.addEventListener("DOMContentLoaded",(()=>{document.querySelectorAll(".menu-wrapper").forEach((e=>{const t=e.querySelector(".menu-toggle"),o=e.querySelector(".menu-list"),n=e.querySelectorAll(".menu-item"),s=gsap.timeline({paused:!0,reversed:!0});s.to(o,{opacity:1,visibility:"visible",y:"0%",duration:.5,ease:"power2.out"}).to(n,{opacity:1,y:0,duration:.5,ease:"power2.out",stagger:.1},"<"),t.addEventListener("click",(e=>{e.stopPropagation(),t.classList.toggle("active"),s.reversed()?(s.play(),s.reversed(!1)):(s.reverse(),s.reversed(!0))})),document.addEventListener("click",(o=>{e.contains(o.target)||s.reversed()||(s.reverse(),s.reversed(!0),t.classList.remove("active"))}))}))})),document.addEventListener("DOMContentLoaded",(function(){document.querySelectorAll(".it-scroll-element").forEach((e=>{const t=parseFloat(e.getAttribute("data-it-scroll-speed"))||.8,o=parseInt(e.getAttribute("data-it-scroll-y"),10)||250;gsap.from(e,{scrollTrigger:{trigger:e,toggleActions:"play none none none",start:"top bottom",end:"bottom top",scrub:.5,pin:!1,markers:!1},y:o,duration:t,ease:"power2.out"})}))})),document.addEventListener("DOMContentLoaded",(function(){document.querySelectorAll(".it-parallax-background").forEach((e=>{const t=parseFloat(e.getAttribute("data-it-parallax-speed"))||.3;gsap.to(e,{scrollTrigger:{trigger:e,start:"top bottom",end:"bottom top",scrub:!0,markers:!1},y:(e,o)=>-o.offsetHeight*t,ease:"none"})}))}));if(document.querySelector(".bg-position")){gsap.to(".bg-position",{backgroundPosition:"50% 100%",ease:"none",scrollTrigger:{trigger:".bg-position",start:"top bottom",end:"bottom top",scrub:!0}});document.querySelector(".bg-position .overlay")&&gsap.to(".bg-position .overlay",{backgroundColor:"rgba(255, 62, 1, 0.2)",ease:"none",scrollTrigger:{trigger:".bg-position",start:"top bottom",end:"bottom top",scrub:!0}})}document.onkeydown=function(e){return 123!=event.keyCode&&((!e.ctrlKey||!e.shiftKey||e.keyCode!="I".charCodeAt(0))&&((!e.ctrlKey||!e.shiftKey||e.keyCode!="C".charCodeAt(0))&&((!e.ctrlKey||!e.shiftKey||e.keyCode!="J".charCodeAt(0))&&((!e.ctrlKey||e.keyCode!="U".charCodeAt(0))&&void 0))))}}(jQuery);
