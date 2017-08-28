//////Validaciones//////
$('#aceptar').on('click', function(){
	$('#formularioPredios').validate({
		errorElement: 'span',
		wrapper: 'label',
		rules: {
			region: {
				valueNotEquals: '-1'
			},

			municipio: {
				valueNotEquals: '-1'
			},

			localidad: {
				valueNotEquals: '-1'
			},

			sedemex: {
				numeros: true,
				maxlength: 8
			},

			nombrePredio: {
				required: true,
				empty: true,
				maxlength: 200
			},

			tipoTenenciaTierra: {
				valueNotEquals: '-1'
			},

			latitud: {
				required: true,
				numeros: true,
				maxlength: 7
			},

			longitud: {
				required: true,
				numeros: true,
				maxlength: 7
			},

			superficieTotal: {
				decimales: true
			},

			superficieCartografica: {
				decimales: true
			},

			superficieArbolada: {
				decimales: true
			},

			superficieOtrosUsos: {
				decimales: true
			},

			estatusPredio: {
				valueNotEquals: '-1'
			},

			registroForestalNacional: {
				maxlength: 30
			},

			permisoAprovechamientoForestal: {
				valueNotEquals: '-1'
			}
		},
		messages:{
			region: {
				valueNotEquals: 'Seleccione una opción'
			},

			municipio: {
				valueNotEquals: 'Seleccione una opción'
			},

			localidad: {
				valueNotEquals: 'Seleccione una opción'
			},

			sedemex: {
				numeros: 'Ingrese solo números',
				maxlength: 'Maximo 8 caracteres'
			},

			nombrePredio: {
				required: 'Campo requerido',
				empty: 'No deje espacios vacios',
				maxlength: 'Maximo 200 caracteres'
			},

			tipoTenenciaTierra: {
				 valueNotEquals: 'Seleccione una opción'
			},

			latitud: {
				required: 'Campo requerido',
				numeros: 'Ingrese solo números',
				maxlength: 'Maximo 7 caracteres'
			},

			longitud: {
				required: 'Campo requerido',
				numeros: 'Ingrese solo números',
				maxlength: 'Maximo 7 caracteres'
			},

			superficieTotal: {
				decimales: 'Ingrese formato correcto 0.00'
			},

			superficieCartografica: {
				decimales: 'Ingrese formato correcto 0.00'
			},

			superficieArbolada: {
				decimales: 'Ingrese formato correcto 0.00'
			},

			superficieOtrosUsos: {
				decimales: 'Ingrese formato correcto 0.00'
			},

			estatusPredio: {
				valueNotEquals: 'Seleccione una opción'
			},

			registroForestalNacional: {
				maxlength: 'Maximo 30 caracteres'
			},

			permisoAprovechamientoForestal: {
				valueNotEquals: 'Seleccione una opción'
			}
		},

		submitHandler: function(form){
			return false;
		}
	});
});

jQuery.validator.addMethod("valueNotEquals", 
	function(value, element, arg){
		return arg != value;
	}
);

jQuery.validator.addMethod("numeros", 
	function(value, element){
	 return this.optional(element) ||  /^[0-9]+$/.test(value);
});

jQuery.validator.addMethod("empty", 
	function(value, element){
		return !/^\s*$/.test(value);
	}
);

jQuery.validator.addMethod("decimales",
	function(value, element){
		return this.optional(element) || /^[0-9]{1,9}(\.[0-9]{2})+$/.test(value);
	}
);

