	if ($('.js-hamburger').length) {
        $('.js-hamburger').click(function(){

          var nav = $('.header-mobile-nav')

          $(this).toggleClass('is-active');
          nav.toggleClass('is-active');
          $('body').toggleClass('menu-open');
      }); 
    };

    //promo page slider

    if ($('.js-poster-slider').length) {

        $('.js-poster-slider').slick({
              dots: true,
              arrows: false,
              infinite: true,
              speed: 700,
              slidesToShow: 1,
              slidesToScroll: 1,
              fade: true
        });

    };

    if($('.order-tab-content').length) {
        $(function() {

            var tab = $('.order-tab-content'),
                tabs = $('.order-head li');

            tab.hide().filter(':first').show();

            $('.js-order').click(function(){
                var btn_hash = this.hash;

                tab.hide(); 
                tab.filter(this.hash).show();

                tabs.each(function(){

                    var li_attr = $(this).attr('data-tab');

                    if(li_attr == btn_hash){
                        $(this).addClass('active')
                        $(this).siblings().removeClass('active')
                    }
                })
                return false;
            })
        });
    }