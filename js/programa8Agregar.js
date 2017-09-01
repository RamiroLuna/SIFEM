$('#aceptar').on('click', function(){
	$('#formularioPrincipal').validate({
		errorElement: 'span',
		wrapper: 'label',
		rules: {
			region:{
				valueNotEquals: '-1'
			},

			anio:{
				valueNotEquals: '-1'
			}
		},
		messages:{
			region:{
				valueNotEquals: 'Seleccione una opción'
			},

			anio:{
				valueNotEquals: 'Seleccione una opción'
			}
		}
	});
});

jQuery.validator.addMethod("valueNotEquals", 
	function(value, element, arg){
		return arg != value;
	}
);