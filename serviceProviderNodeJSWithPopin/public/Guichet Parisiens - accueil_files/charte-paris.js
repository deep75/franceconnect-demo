$(document).ready(function() {
	$(".external").attr({
		target : '_blank',
		title : 'Ouvrir dans une nouvelle fenêtre'
	});

	$("#q").click(function(event) {
		if ($(this).val() == 'Rechercher dans tout Paris.fr') {
			$(this).val('');
		}
	});
	
	$("a.btn-top").click( function(event) {
		vUrl = location.href.replace( location.hash,"") + '#top'; 
		$(this).attr('href', vUrl ); 
	});
	
	$("#qPhone").click(function(event) {
		if ($(this).val() == 'Rechercher dans tout Paris.fr') {
			$(this).val('');
		}
	});
	
	 // Tooltip
	 if( $('.tooltips').length > 0 ){
		$(".tooltips").tooltip({
		  selector: "a[data-toggle='tooltip']"
		})
	};
	
	 // Article
	if( $('.article-player').length > 0 ){
		$('.article-player').camera({
			height:'421px',
			time:5000,
			transPeriod: 750,
		});
	}
});