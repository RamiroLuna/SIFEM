$('#aceptar').on('click', function(){
	$('#poligonos').validate({
		errorElement: 'span',
		wrapper: 'label',
		rules: {
			accionAgraria: {
				required: true,
				empty: true,
				maxlength: 255
			},

			fechaPublicacionDof: {
				required: true,
				empty: true
			},

			fechaResolucionPresidencial: {
				required: true,
				empty: true
			}, 

			fechaAsambleaProcede: {
				required: true,
				empty: true
			}, 

			documentoAmparaPropiedad: {
				required: true,
				empty: true,
				maxlength: 255
			},

			numeroDocumentoAmparaPropiedad: {
				required: true,
				empty: true,
				maxlength: 255
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

			superficiePoligono: {
				required: true,
				decimales: true				
			},

			superficieCartografica: {
				required: true,
				decimales: true
			},

			superficieArbolada: {
				required: true,
				decimales: true
			},

			superficieOtrosUsos: {
				required: true,
				decimales: true
			},

			tipoClima: {
				valueNotEquals: '-1'
			},

			tipoVegetacion: {
				valueNotEquals: '-1'
			},

			tipoFisiografia: {
				required: true,
				empty: true,
				maxlength: 255
			},

			corrientesIntermitentes: {
				required: true,
				empty: true,
				maxlength: 255
			},

			corrientesPermanentes: {
				required: true,
				empty: true,
				maxlength: 255
			},

			manantialesOjoAgua: {
				required: true,
				empty: true,
				maxlength: 255
			},

			manantialesOjoAguaAbastecen: {
				required: true,
				empty: true,
				maxlength: 255
			},

			erosion: {
				required: true,
				empty: true,
				maxlength: 255
			},

			especiesArboreas: {
				valueNotEquals: '-1'
			},

			distribucionEstratoArbustivo: {
				required: true,
				empty: true,
				maxlength: 255
			},

			distribucionRenuevo: {
				required: true,
				empty: true,
				maxlength: 255
			},

			coberturaPromedioArbolado: {
				required: true,
				empty: true,
				maxlength: 255
			},

			fauna: {
				required: true,
				empty: true,
				maxlength: 255
			},

			observacionesPoligono: {
				required: true,
				empty: true,
				maxlength: 255
			},

			figura: {
				required: true,
				empty: true,
				maxlength: 3000
			}
		},

		messages: {
			accionAgraria: {
				required: 'Campo requerido',
				empty: 'No deje espacios vacios',
				maxlength: 'Maximo 255 caracteres'
			},

			fechaPublicacionDof: {
				required: 'Campo requerido',
				empty: 'No deje espacios vacios'
			},

			fechaResolucionPresidencial: {
				required: 'Campo requerido',
				empty: 'No deje espacios vacios'
			},

			fechaAsambleaProcede: {
				required: 'Campo requerido',
				empty: 'No deje espacios vacios'
			},

			documentoAmparaPropiedad: {
				required: 'Campo requerido',
				empty: 'No deje espacios',
				maxlength: 'Maximo 255 caracteres'
			},

			numeroDocumentoAmparaPropiedad: {
				required: 'Campo requerido',
				empty: 'No deje espacios',
				maxlength: 'Maximo 255 caracteres'
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

			superficiePoligono: {
				required: 'Campo requerido',
				decimales: 'Ingrese formato correcto 0.00'				
			},

			superficieCartografica: {
				required: 'Campo requerido',
				decimales: 'Ingrese formato correcto 0.00'
			},

			superficieArbolada: {
				required: 'Campo requerido',
				decimales: 'Ingrese formato correcto 0.00'
			},

			superficieOtrosUsos: {
				required: 'Campo requerido',
				decimales: 'Ingrese formato correcto 0.00'
			},

			tipoClima: {
				valueNotEquals: 'Seleccione una opción'
			},

			tipoVegetacion: {
				valueNotEquals: 'Seleccione una opción'
			},

			tipoFisiografia: {
				required: 'Campo requerido',
				empty: 'No deje espacios vacios',
				maxlength: 'Maximo 255 caracteres'
			},

			corrientesIntermitentes: {
				required: 'Campo requerido',
				empty: 'No deje espacios vacios',
				maxlength: 'Maximo 255 caracteres'
			},

			corrientesPermanentes: {
				required: 'Campo requerido',
				empty: 'No deje espacios vacios',
				maxlength: 'Maximo 255 caracteres'
			},

			manantialesOjoAgua: {
				required: 'Campo requerido',
				empty: 'No deje espacios vacios',
				maxlength: 'Maximo 255 caracteres'
			},

			manantialesOjoAguaAbastecen: {
				required: 'Campo requerido',
				empty: 'No deje espacios vacios',
				maxlength: 'Maximo 255 caracteres'
			},

			erosion: {
				required: 'Campo requerido',
				empty: 'No deje espacios vacios',
				maxlength: 'Maximo 255 caracteres'
			},

			especiesArboreas: {
				valueNotEquals: 'Seleccione una opción'
			},

			distribucionEstratoArbustivo: {
				required: 'Campo requerido',
				empty: 'No deje espacios vacios',
				maxlength: 'Maximo 255 caracteres'
			},

			distribucionRenuevo: {
				required: 'Campo requerido',
				empty: 'No deje espacios vacios',
				maxlength: 'Maximo 255 caracteres'
			},

			coberturaPromedioArbolado: {
				required: 'Campo requerido',
				empty: 'No deje espacios vacios',
				maxlength: 'Maximo 255 caracteres'
			},

			fauna: {
				required: 'Campo requerido',
				empty: 'No deje espacios vacios',
				maxlength: 'Maximo 255 caracteres'
			},

			observacionesPoligono: {
				required: 'Campo requerido',
				empty: 'No deje espacios vacios',
				maxlength: 'Maximo 255 caracteres'
			},

			figura: {
				required: 'Campo requerido',
				empty: 'No deje espacios vacios',
				maxlength: 'Maximo 3000 caracteres'
			}
		},

		submitHandler: function(form){
			return false;
		}
	});
});

jQuery.validator.addMethod("empty", 
	function(value, element){
		return !/^\s*$/.test(value);
	}
);

jQuery.validator.addMethod("numeros", 
	function(value, element){
	 return this.optional(element) ||  /^[0-9]+$/.test(value);
});

jQuery.validator.addMethod("decimales",
	function(value, element){
		return this.optional(element) || /^[0-9]{1,9}(\.[0-9]{2})+$/.test(value);
	}
);

jQuery.validator.addMethod("valueNotEquals", 
	function(value, element, arg){
		return arg != value;
	}
);