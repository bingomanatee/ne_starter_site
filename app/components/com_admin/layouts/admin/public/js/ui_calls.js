/*==== Simple DatePicker ====*/
$(function() {
	$( "#datepicker" ).datepicker();
});

/*==== Multiple DatePicker ====*/
$(function() {
	$( "#multiple_datepicker" ).datepicker({
		numberOfMonths: 3,
		showButtonPanel: true
	});
});

/*==== Tabs ====*/
$(function() {
	$( ".tabs" ).tabs();
});

/*==== Accordion ====*/
$(function() {
	$( ".accordion" ).accordion({
		active: false,
		collapsible: true,
		autoHeight: false,
		navigation: true
	});
});
	
/*==== Simple Slider ====*/
$(function() {
	$( "#simple_slider" ).slider(
	);
});

/*==== Multiple Vertical Slider ====*/
$(function() {
	// setup Multiple Vertical
	$( "#multiple_vertical_slider > span" ).each(function() {
		// read initial values from markup and remove that
		var value = parseInt( $( this ).text(), 10 );
		$( this ).empty().slider({
			value: value,
			range: "min",
			animate: true,
			orientation: "vertical"
		});
	});
});

/*==== Slider Range ====*/
$(function() {
	$( "#slider-range" ).slider({
		range: true,
		min: 0,
		max: 500,
		values: [ 75, 300 ],
		slide: function( event, ui ) {
			$( "#range_amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
		}
	});
	$( "#range_amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
		" - $" + $( "#slider-range" ).slider( "values", 1 ) );
});

/*==== SliderRange Minimum ====*/
$(function() {
	$( "#slider-range-min" ).slider({
		range: "min",
		value: 385,
		min: 1,
		max: 700,
		slide: function( event, ui ) {
			$( "#amount" ).val( "$" + ui.value );
		}
	});
	$( "#amount" ).val( "$" + $( "#slider-range-min" ).slider( "value" ) );
});

/*==== Progres bar ====*/
/*1*/$(function() {
		$( "#progressbar" ).progressbar({
			value: 59
		});
});
	
/*2*/$(function() {
		$( "#progressbar2" ).progressbar({
			value: 35
		});
	});
		
/*3*/$(function() {
		$( "#progressbar3" ).progressbar({
			value: 72
		});
	});
	
/*4*/$(function() {
		$( "#progressbar4" ).progressbar({
			value: 53
		});
	});