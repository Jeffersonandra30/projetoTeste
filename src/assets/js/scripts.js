$(function() {

	// Masks & Characters Validation

		/* Phone Function */
	    var phoneMask = function(val) {
	    	return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
	    },
	    phoneMaskOptions = {
	        onKeyPress: function(val, e, field, options) {
	            field.mask(phoneMask.apply({}, arguments), options);
	        }
	    };

	    /* Masks */
	    $('.t-phone').mask(phoneMask, phoneMaskOptions);
	    $('.t-cpf').mask('000.000.000-00');
	    $('.t-date').mask('00/00/0000');

	    /* Validation */
	    // $('.t-phone').blur(function() {
	    // 	var charcount = $(this).val().length;
	    // 	if (charcount < 14) {
	    // 		$(this).addClass('error');
	    // 	} else {
	    // 		$(this).removeClass('error');
	    // 	}
	    // });
	    $('.t-date').blur(function() {
	    	var charcount = $(this).val().length;
	    	if (charcount < 10) {
	    		$(this).addClass('error');
	    	} else {
	    		$(this).removeClass('error');
	    	}
	    });


	// ==========================
	// == General Functions

		/* Background Image */
		$('[data-bgi]').each(function() {
			var bgi = $(this).data('bgi');
			$(this).css('background-image', 'url(' + bgi + ')');
			$(this).removeAttr('data-bgi');
		});

		/* Anchor Links */
		$('.anchor').click(function() {
			var target = $(this).attr('anchor');
			$('html, body').animate({
				scrollTop: $('#' + target).offset().top - 100
			}, 800);
		});
		

	// ===========================
	
	// ===========================
	// == Slick

		/* sliderHome */
		$('#sliderHome .slides').slick({
			arrows: false,
			fade: true,
			infinite: true,
		});

		/* Parceiros */
		$('#features .carousel').slick({
			infinite: true,
			arrows: false,
			centerMode: true,
  			centerPadding: '60px',
			slidesToShow: 3,
			slidesToScroll: 1
		});

		/* Depoimentos */
		$('#testimonials .carousel').slick({
			infinite: true,
			arrows: false,
			fade: true,
			slidesToShow: 1,
			slidesToScroll: 1
		});
});
