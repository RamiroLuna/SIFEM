﻿/**
* @tabular.js Libreria para el de datos tabulares, para alta, baja, cambios y consulta de informaci�n
*
* @version 1.0
*/
define(["connections","map","validator","Alert"], function(connections,map,validator,Alert){
$.widget( "custom.reports", {
          id:'custom_reports',
          countSpinner:0,
          fields:{},
          claseHeadSelected:'hed',
          fieldsMultiRecord:{},
          fieldToFilter:null,
          fieldMultiRecordToFilter:null,
          tabActive:'',
          activeReportMultirecords:false,
          graphLoaded:false,
          dataSend:{
                    fields:[],
                    order:{},
                    filter:{}
          },
          steps:{
                    step1:{
                              label:'Selecci&oacute;n de campos',
                              number:'01',
                              valid:false
                    },
                    step2:{
                              label:'Ordenado y filtro',
                              number:'02',
                              valid:false
                    },
                    step3:{
                              label:'Despliegue y titulo',
                              number:'03',
                              valid:false
                    }
          },
          options:{
                    data:{userActive:null},
                    controller:null
          },
          getBlocker :function(){
                    var chain = '<div class="blocker">'+
                                        '<div class="veil"></div>'+
                                        '<div class="loader" align="center">'+
                                                  '<img src="img/loader.GIF">'+
                                                  '<div class="label">Procesando</div>'+
                                        '</div>'+
                                '</div>';
                    return chain;
          },
          showSpinner:function(){
                    var obj=this;
                    if (obj.countSpinner==0) {
                              $("."+obj.id +" .blocker").show();
                    }
                    obj.countSpinner+=1;
                   
          },
          hideSpinner:function(){
                    var obj=this;
                    obj.countSpinner-=1;
                    if (obj.countSpinner==0) {
                              $("."+obj.id +" .blocker").hide();
                    }
          },
          request : function(params,action,typeGraph){
                    obj=this
                    var msg = 'Servicio no disponible intente m&aacute;s tarde';
                    var r= {
                            success:function(json,estatus){
                                var valid=false;
                                
                                if (json){
                                    if (json.response.sucessfull){
                                        valid=true;
                                        switch(action){
                                                  case "getFields":
                                                            obj.createFields(json.data,'fieldsToSelect',true);
                                                            obj.createFields(json.data,'fieldsSelected',false);
                                                            break;
                                                  case "getReport":
                                                            if ($(".custom_reports #displayColumns").prop('checked')) {
                                                                     obj.showReport(json.data);
                                                            }else{
                                                                      obj.showReportRows(json.data);
                                                            }
                                                            
                                                            break;
                                                  case "getGraph":
                                                            obj.showGraph(typeGraph,json.data);
                                                            break;
                                                  case "getSeed":
                                                            setTimeout(function(){
                                                                      var source=connections.charge.download;
                                                                      var path = source.url+'&filename=reporte&id='+json.data+'&user='+obj.options.data.userActive.id;
                                                                      window.open(path);
                                                            },100);
                                                            break;
                                                  case "getFieldsMiltiRecord":
                                                            obj.buildSelectRecords(json.data);
                                                            break;
                                                  //LYAXS
												  case "getSeedPdf":															
                                                            setTimeout(function(){
                                                                      var source=connections.tabulate.downloadPdf;
                                                                      var r = $.extend(r, source);
                                                                      var path = r.url+'&filename=reporte&id='+json.data+'&user='+obj.options.data.userActive.id;
																	  //alert(json.data);
                                                                      window.open(path);
                                                            },100);
                                                            break;
												  //ENDLYAXS
                                                  case "getMiltiRecord":
                                                            if ($(".custom_reports #displayColumns").prop('checked')) {
                                                                      obj.showMultirecord(json.data,params);
                                                            }else{
                                                                      obj.showMultirecordRows(json.data,params);
                                                            }
                                                            
                                                            break;
                                        }
                                    }else{
                                        msg=json.response.message;
                                    }
                                }
                                if (!valid) {
                                         Alert.show({
                                                  title:'Notificaci&oacute;n',
                                                  type:'error',
                                                  messages:[msg],
                                                  buttons:[{label:'Cerrar'}]
                                        });
                                }
                                
                            },
                            beforeSend: function(xhr) {
                                obj.showSpinner();
                            },
                            error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
                                        
                                         Alert.show({
                                                  title:'Notificaci&oacute;n',
                                                  type:'error',
                                                  messages:[msg],
                                                  buttons:[{label:'Cerrar'}]
                                        });
                            },
                            complete: function(solicitudAJAX,estatus) {
                               obj.hideSpinner();
                            }
                            };
                    var source='';
                    
                    switch (action) {
                              case 'getFields':source = connections.reports.getFields;
                                        r = $.extend(r, source);
                                        r.data=params;
                                        break;
                              case 'getReport':source=connections.reports.getReport;
                                        r = $.extend(r, source);
                                        r.data={action:'get',report:true,user:obj.options.data.userActive.id,json:JSON.stringify(params)};
                                        //r.url=r.url+'&user='+obj.options.data.userActive.id+'&json='+JSON.stringify(params);
                                        break;
                              case 'getGraph':source=connections.reports.getGraph;
                                        
                                        r = $.extend(r, source);
                                        r.data={action:'get',user:obj.options.data.userActive.id,json:JSON.stringify(params)};
                                        //r.url=r.url+'&user='+obj.options.data.userActive.id+'&json='+JSON.stringify(params);
                                        break;
                              case 'getSeed':source=connections.charge.getSeed;
                                        r = $.extend(r, source);
                                        r.data={action:'get',user:obj.options.data.userActive.id,json:JSON.stringify(params)};
                                        //r.url=r.url+'&user='+obj.options.data.userActive.id+'&json='+JSON.stringify(params);
                                        break;
                              case 'getFieldsMiltiRecord':source=connections.multirecords.getInputs;
                                        r = $.extend(r, source);
                                        r.data={action:'get',name:params.formulario,user:obj.options.data.userActive.id};
                                        break;
                              //LYAXS
				              case 'getSeedPdf':source=connections.tabulate.getSeedPdf;
                                        r = $.extend(r, source);
                                        r.data={action:'get',user:obj.options.data.userActive.id,json:JSON.stringify(params)};
                                        //r.url=r.url+'&user='+obj.options.data.userActive.id+'&json='+JSON.stringify(params);
                                        break;
							  //ENDLYAXS
                              case 'getMiltiRecord':source=connections.multirecords.getList;
                                        r = $.extend(r, source);
                                        r.data={action:'getall',name:params.formulario,folio:params.folio,user:obj.options.data.userActive.id};
                                        break;
                                       
                    }
                    $.ajax(r);
          },
          buildSelectRecords:function(data){
                    var obj=this;
                    var opciones='';
                    obj.fieldsMultiRecord = null;
                    obj.fieldsMultiRecord={};
                    for(var x in data){
                              var i = data[x];
                              obj.fieldsMultiRecord[i.field]=i;
                              opciones+='<option value="'+i.field+'">'+i.label+'</option>';
                    }
                    var chain='';
                    chain+='<div class="FieldReport">'+
                              '<div class="label">Subregistro</div>'+
                              '<select id="fields_multiRecord" class="selectInput">'+
                                        opciones+ 
                              '</select>'+
                    '</div>';
                    $("."+obj.id+" .option_multirecord").html(chain);
                    
                    $("."+obj.id+" #fields_multiRecord").change(function(){
                              var field = $("."+obj.id+" #fields_multiRecord option:selected").val();
                              obj.fieldMultiRecordToFilter=obj.fieldsMultiRecord[field];
                              obj.showOptionsFilter(obj.fieldsMultiRecord[field],'option_filter');
                    });
                    $("."+obj.id+" #fields_multiRecord").change();
          },
          addEventToFielsRow:function(block,visible){
                    var obj = this;
                    $("."+obj.id +" ."+block+" .itemFieldReport").each(function(){
                              $(this).click(function(){
                                        var clase = "itemFieldReport_selected";
                                        var status = $(this).attr('status');
                                        if (status=='') {
                                                  status = "true";
                                                  $(this).addClass(clase);
                                        }else{
                                                  status = '';
                                                  $(this).removeClass(clase);
                                        }
                                        $(this).attr('status',status);
                              }).dblclick(function(){
                                        var block = $(this).attr('block')
                                        var field = $(this).attr('ref');
                                        if (block=='fieldsToSelect') {
                                                  obj.fields[field].selected = true;
                                                  $(this).removeClass('itemFieldReport_selected');
                                                  $("."+obj.id+" .fieldsSelected #R"+field).show();
                                        }else{
                                                  
                                                  obj.fields[field].selected = false;
                                                  $(this).removeClass('itemFieldReport_selected');
                                                  $("."+obj.id+" .fieldsToSelect #R"+field).show();
                                        }
                                        $(this).hide();
                                        $(this).attr('status','');
                                        
                              }); 

                              
                    });
                    if (!visible) {
                              $("."+obj.id +" ."+block+" .itemFieldReport").each(function(){
                                        $(this).hide();
                              });
                    }
          },
          showGraph:function(tipo,data){
                    var obj = this;
                    tipo = parseInt(tipo);
                    $(".graphPrint").remove();
                    var chain = '<div class="title_report">'+$(".custom_reports #field_graph option:selected").val()+'</div>';
                    $("body").append('<div class="graphPrint" style="display:none">'+chain+'<center><div class="containerg"></div></center></div>');
                    if (tipo==1) {
                              obj.showBarGraph(data,'data_graph');
                              obj.showBarGraph(data,'containerg');
                    }else{
                              obj.showPieGraph(data,'data_graph');
                              obj.showPieGraph(data,'containerg');
                    }
          },
          showBarGraph:function(data,clase){
                    var source = [];
                    var field = $(".custom_reports #field_graph option:selected").val();
                    var etiqueta = obj.fields[field].label;
                    for(var x in data){
                              var i = data[x];
                              source.push([i.label,parseFloat(i.value)]);
                    }
                    $('.'+clase).html();
                    $('.'+clase).highcharts({
                              chart: {
                                  type: 'column'
                              },
                              title: {
                                  text: ''
                              },
                              subtitle: {
                                  text: ''
                              },
                              credits:{
                                        enabled:false        
                              },
                              xAxis: {
                                  type: 'category',
                                  labels: {
                                      rotation: -45,
                                      style: {
                                          fontSize: '13px',
                                          fontFamily: 'Verdana, sans-serif'
                                      }
                                  }
                              },
                              yAxis: {
                                  min: 0,
                                  title: {
                                      text: etiqueta
                                  }
                              },
                              legend: {
                                  enabled: false
                              },
                              tooltip: {
                                  pointFormat: '{point.y}'
                              },
                              series: [{
                                  name: etiqueta,
                                  data: source,
                                  dataLabels: {
                                      enabled: true,
                                      rotation: -90,
                                      color: '#FFFFFF',
                                      align: 'right',
                                      format: '{point.y:.1f}', // one decimal
                                      y: 10, // 10 pixels down from the top
                                      style: {
                                          fontSize: '13px',
                                          fontFamily: 'Verdana, sans-serif'
                                      }
                                  }
                              }]
                          });
          },
          showPieGraph:function(data,clase){
                    var source = [];
                    var field = $(".custom_reports #field_graph option:selected").val();
                    var etiqueta = obj.fields[field].label;
                    for(var x in data){
                              var i = data[x];
                              source.push([i.label,parseFloat(i.value)]);
                    }
                    $('.'+clase).html();
                    $('.'+clase).highcharts({
                              chart: {
                                  plotBackgroundColor: null,
                                  plotBorderWidth: null,
                                  plotShadow: false
                              },
                              title: {
                                  text: ''
                              },
                              credits:{
                                        enabled:false        
                              },
                              tooltip: {
                                  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                              },
                              plotOptions: {
                                  pie: {
                                      allowPointSelect: true,
                                      cursor: 'pointer',
                                      dataLabels: {
                                          enabled: true,
                                          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                          style: {
                                              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                          }
                                      }
                                  }
                              },
                              series: [{
                                  type: 'pie',
                                  name: etiqueta,
                                  data: source
                              }]
                    });
          },
	  createFields:function(data,block,visible){
                    var chain='';
                    var obj = this;
                    for(var x in data){
                              var i = data[x];
                              //if ((i.datatype!='records')&&(i.datatype!='list')) {
                                        i.selected=false;
                                        obj.fields[i.field]=i;
                                        chain+='<div class="itemFieldReport" id="R'+i.field+'" ref="'+i.field+'" status="" block="'+block+'">'+
                                                  '<div class="label">'+i.label+'</div>'+
                                               '</div>';
                              //}
                              
                    }
                    $("."+obj.id +" ."+block+" .dataBlock").html('');
                    $("."+obj.id +" ."+block+" .dataBlock").append(chain);
                    obj.addEventToFielsRow(block,visible);
                    
                    
          },
          existFieldsSelected:function(){
                    var obj = this;
                    var exist = false;
                              for(var x in obj.fields){
                                        var i = obj.fields[x];
                                        if (i.selected) {
                                                  exist=true;
                                                  break;
                                        }
                              }
                    return exist;
          },
		  /**
          * Permite recargar el contenid de la interfaz
          * @data {Object} objeto que contiene los parametros de configuraci�n para este componente
          */
          update:function(data){
                   this.buildStructure();
                   this.events();
          },
		  
 /**
          * Inicializa la invocaci�n del componente
          */
          _init:function(){
                   this.show();
	  },
	  
 /**
          * Invoca la generaci�n de los elementos que integran este componente
          */
          _create: function() {
                    (function($) {
                              $.fn.hasScrollBar = function() {
                                  return this.get(0).scrollHeight > this.height();
                              }
                    })(jQuery);
                    (function($) {
                              $.fn.hasScrollBarx = function() {
                                  return this.get(0).scrollWidth > this.width();
                              }
                    })(jQuery);
                    this.update();
          },
          getSectionHeader:function(){
                    var chain='';
                    var obj=this;
                    for(var x in obj.steps){
                              var i = obj.steps[x];
                              chain+='<div class="step step'+parseInt(i.number)+'">'+
                                        '<div class="vignette">'+
                                                  '<div class="template_reports trep_vignette"></div>'+
                                                  '<div class="number">'+i.number+'</div>'+
                                        '</div>'+
                                        '<div class="label">'+i.label+'</div>'+
                                    '</div>';
                    }
                    return chain;
          },
          getSection1:function(){
                    var chain='<div class="section1 section">'+
                                        '<div class="row">'+
                                                  '<div class="col s12 m6">'+
                                                            '<div class="fieldsToSelect boxContainer">'+
                                                                      '<div class="titleBlock"><div class="label">Campos disponibles</div></div>'+
                                                                      '<div class="dataBlock"></div>'+
                                                                      '<div class="footerBlock">'+
                                                                                '<div class="label">Enviar selecci&oacute;n</div>'+
                                                                                '<div class="icon">'+
                                                                                          '<div class="template_reports trep_row_right"></div>'+
                                                                                '</div>'+
                                                                      '</div>'+
                                                                      '<div class="footerBlockAll">'+
                                                                                '<div class="label">Enviar todo</div>'+
                                                                                '<div class="icon">'+
                                                                                          '<div class="template_reports trep_row_right"></div>'+
                                                                                '</div>'+
                                                                      '</div>'+
                                                            '</div>'+
                                                  '</div>'+
                                                  '<div class="col s12 m6">'+
                                                            '<div class="fieldsSelected boxContainer">'+
                                                                      '<div class="titleBlock"><div class="label">Campos seleccionados</div></div>'+
                                                                      '<div class="dataBlock"></div>'+
                                                                      '<div class="footerBlock">'+
                                                                                
                                                                                '<div class="icon">'+
                                                                                          '<div class="template_reports trep_row_left"></div>'+
                                                                                '</div>'+
                                                                                '<div class="label">Enviar selecci&oacute;n</div>'+
                                                                      '</div>'+
                                                                      '<div class="footerBlockAll">'+
                                                                                
                                                                                '<div class="icon">'+
                                                                                          '<div class="template_reports trep_row_left"></div>'+
                                                                                '</div>'+
                                                                                '<div class="label">Enviar todo</div>'+
                                                                      '</div>'+
                                                            '</div>'+
                                                  '</div>'+
                                        '</div>'+
                                        '<div class="sectionButtons">'+
                                                  '<button class="btnRight buttonReport btn waves-effect waves-light" id="btnStep1">'+
                                                            'Siguiente'+
                                                            '<i class="mdi-hardware-keyboard-arrow-right right"></i>'+
                                                  '</button>'+
                                        '</div>'+
                                        
                              '</div>';
                    return chain;
          },
          getSection2:function(){
                    var chain='<div class="section2 section">'+
                                        '<div class="row">'+
                                                  '<div class="col s12 m6">'+
                                                            '<div id="ordering" class="boxContainer2">'+
                                                                      
                                                            '</div>'+
                                                  '</div>'+
                                                  '<div class="col s12 m6">'+
                                                            '<div id="filtering" class="boxContainer2" style="border-left: 1px solid #BBBBBB;">'+
                                                            '</div>'+
                                                  '</div>'+
                                        '</div>'+
                                        '<div class="sectionButtons">'+
                                                  '<button class="btnLeft buttonReport btn waves-effect waves-light" id="btnStep2Back">'+
                                                            'Anterior'+
                                                            '<i class="mdi-hardware-keyboard-arrow-left left"></i>'+
                                                  '</button>'+
                                                  '<button class="btnRight buttonReport btn waves-effect waves-light" id="btnStep2Next">'+
                                                            'Siguiente'+
                                                            '<i class="mdi-hardware-keyboard-arrow-right right"></i>'+
                                                  '</button>'+
                                        '</div>'+
                                        
                              '</div>';
                    return chain;
          },
          getSection3:function(){
                    var chain='<div class="section3 section">'+
                                        '<div class="row">'+
                                                  '<div class="col s12 m6">'+
                                                            '<div id="displaying" class="boxContainer2">'+
                                                                      '<div class="titleSubsection">Despliegue</div>'+
                                                                      '<div class="row" style="margin-top: 40px;">'+
                                                                                '<div class="col s12 m6">'+
                                                                                          '<div class="col s12 m12">'+
                                                                                                    '<div class="template_reports trep_columns"></div>'+
                                                                                          '</div>'+
                                                                                          '<p>'+
                                                                                                    '<input name="group1" type="radio" id="displayColumns" checked="checked" />'+
                                                                                                    '<label for="displayColumns">Por columnas</label>'+
                                                                                          '</p>'+
                                                                                '</div>'+
                                                                                '<div class="col s12 m6">'+
                                                                                          '<div class="col s12 m12">'+
                                                                                                    '<center>'+
                                                                                                    '<div class="template_reports trep_rows"></div>'+
                                                                                                    '</center>'+
                                                                                          '</div>'+
                                                                                          '<p>'+
                                                                                                    '<input name="group1" type="radio" id="displayRows" />'+
                                                                                                    '<label for="displayRows">Por filas</label>'+
                                                                                          '</p>'+
                                                                                '</div>'+
                                                                      '</div>'+
                                                                      
                                                            '</div>'+
                                                  '</div>'+
                                                  '<div class="col s12 m6">'+
                                                            '<div id="TitleRep" class="boxContainer2" style="border-left: 1px solid #BBBBBB;">'+
                                                                      '<div class="titleSubsection">Titulo del reporte</div>'+
                                                                      '<div class="FieldReport">'+
                                                                                //'<div class="label">Titulo</div>'+
                                                                                   '<input id="name_report" type="text" class="textInput"/>'+
                                                                                
                                                                      '</div>'+
                                                            '</div>'+
                                                  '</div>'+
                                        '</div>'+
                                        '<div class="sectionButtons">'+
                                                  '<button class="btnLeft buttonReport btn waves-effect waves-light" id="btnStep3Back">'+
                                                            'Anterior'+
                                                            '<i class="mdi-hardware-keyboard-arrow-left left"></i>'+
                                                  '</button>'+
                                                  '<button class="btnRight buttonReport btn waves-effect waves-light" id="btnStep3Next">'+
                                                            'Generar reporte'+
                                                            '<i class="mdi-hardware-keyboard-arrow-right right"></i>'+
                                                  '</button>'+
                                        '</div>'+
                              '</div>';
                    return chain;
          },
          getSection4:function(){
                    var obj=this;
                    var chain='<div class="section4 section">'+
                                        //obj.getBlocker()+
                                        '<div class="Header">'+
                                                  '<button class="btnLeft buttonReport btn waves-effect waves-light" id="btnStep4Back">'+
                                                            'Regresar'+
                                                            '<i class="mdi-hardware-keyboard-arrow-left left"></i>'+
                                                  '</button>'+
                                                  '<div class="exportOptions">'+
                                                            '<div class="itemReport" title="Ver datos tabulares" alt="Ver datos tabulares"><div class="template_reports trep_tabular"></div></div>'+
                                                            '<div class="itemReport" title="Ver datos gr&aacute;ficas" alt="Ver datos gr&aacute;ficas"><div class="template_reports trep_graph"></div></div>'+
                                                            '<div class="itemReport"><div class="template_reports trep_print"></div></div>'+
                                                            '<div class="itemReport"><div class="template_reports trep_csv"></div></div>'+
                                                            //'<div class="itemReport"><div class="template_reports trep_cvs"></div></div>'+
                                                            '<div class="itemReport"><div class="template_tabulate ttab_pdf"></div></div>'+
                                                  '</div>'+
                                                  
                                        '</div>'+
                                        '<div class="title_reportTabular"></div>'+
                                        '<div class="headerTabular"></div>'+
                                        '<div class="dataTabular infoReport">'+
                                                  
                                        '</div>'+
                                        '<div class="title_reportTabular_Multirecord"></div>'+
                                        '<div class="headerTabular_Multirecord"></div>'+
                                        '<div class="dataMultirecord infoMultirecord" style="display:none">'+
                                        '</div>'+
                                        '<div class="dataGraph infoReport">'+
                                                  '<div class="option_graph"></div>'+
                                                  '<div class="data_graph"></div>'+
                                        '</div>'+
                                        

                              '</div>';
                    return chain;
          },
	  buildStructure:function(){
                    var obj=this;
                    obj.hide();
                    var o = obj.options.data;
                    var chain = ''+
                              '<div class="'+obj.id+'" align="center">'+
                                        '<div class="HeaderSection">'+obj.getSectionHeader()+'</div>'+
                                        '<div class="dataSection">'+
                                                  obj.getSection1()+
                                                  obj.getSection2()+
                                                  obj.getSection3()+
                                                  obj.getSection4()+
                                                  obj.getBlocker()+
                                        '</div>'+
                              '</div>';
                    this.element.html('');
                    this.element.append(chain);
	  },
          
		     /**
          * Muestra los datos generados por este componente
          */
          show:function(){
                 $("."+this.id).show();   
          },
          
		    /**
          * Oculta la informaci�n generada por este componente
          */
          hide:function(){
                 $("."+this.id).remove();   
          },
          fillDataOrder:function(){
                    var obj = this;
                    obj.dataSend.fields=null;
                    obj.dataSend.fields=[];
                    var chain = '<div class="titleSubsection">Ordenado por campo</div>';
                    chain+='<div class="FieldReport">'+
                              '<div class="label">Campo</div>'+
                              '<select id="field_ordering" class="selectInput">';
                    for(var x in obj.fields){
                              var i = obj.fields[x];
                              if (i.selected) {
                                        obj.dataSend.fields.push(i);
                                        if ((i.datatype!='records')&&(i.type!='multiselect')) {
                                                  chain+='<option value="'+i.field+'">'+i.label+'</option>';
                                        }
                              }
                              
                    }
                    chain+='</select></div>';
                    
                    chain+='<div class="FieldReport">'+
                           '<div class="label">Orden</div>'+
                              '<select id="type_ordering" class="selectInput">'+
                                        '<option value="1">Ascendente</option>'+
                                        '<option value="2">Descendente</option>'+
                              '</select>'+
                           '</div>';
                    $("."+obj.id+" #ordering").html(chain);
                    
          },
          fillDataFilter :function(){
                    var obj = this;
                    var chain = '<div class="titleSubsection">Filtro por campo</div>';
                    chain+='<div class="FieldReport">'+
                              '<div class="label">Campo</div>'+
                              '<select id="field_filter" class="selectInput" >';
                              
                    for(var x in obj.fields){
                              var i = obj.fields[x];
                              //if ((i.selected)&&(i.datatype!='records')&&(i.type!='multiselect')) {
                              if (i.selected) {
                               
                                       chain+='<option value="'+i.field+'">'+i.label+'</option>';
                              }
                    }
                    chain+='</select></div>';
                    chain+='<div class="option_multirecord" style="width:100%;"></div>';
                    chain+='<div class="option_filter" style="width:100%;"></div>';
                    $("."+obj.id+" #filtering").html(chain);
                    
                    $("."+obj.id+" #field_filter").change(function(){
                                                  $("."+obj.id+' .option_multirecord').html('');
                                                  obj.fieldsMultiRecord = null;
                                                  obj.fieldsMultiRecord={};
                                                  var field = $("."+obj.id+" #field_filter option:selected").val();
                                                  obj.fieldToFilter = obj.fields[field];
                                                  obj.showOptionsFilter(obj.fields[field],'option_filter');
                    });
                    $("."+obj.id+" #field_filter").change();
          },
          selectSection:function(section){
                    var obj = this;
                    var claseVignette = 'activeVignette';
                    var clase = 'section_selected';
                    $("."+obj.id+" ."+clase).removeClass(clase).hide();
                    $("."+obj.id+" .section"+section).addClass(clase).show();
                    $("."+obj.id+" ."+claseVignette).removeClass(claseVignette);
                    $("."+obj.id+" .step"+section).addClass(claseVignette);
                    switch (section) {
                              case 1:
                                        break;
                              case 2:   obj.fillDataOrder();
                                        obj.fillDataFilter()
                                        
                                        break;
                              case 3:
                                        obj.storefilterAndOrder();
                                        $(".custom_reports .HeaderSection").show();
                                        $(".custom_reports .dataSection").css('top','60px');
                                        $("."+obj.id+" .dataMultirecord").hide();
                                        break;
                              
                              case 4:
                                        $(".custom_reports .HeaderSection").hide();
                                        $(".custom_reports .dataSection").css('top','0px');
                                        $(".dataTabular").show();
                                        $(".dataGraph").hide();
                                        $(".custom_reports .trep_tabular").parent().hide();
                                        $(".custom_reports .trep_graph").parent().show();
                                        obj.buildReport();
                                        obj.buildSectionGraph();
                                        
                                        obj.graphLoaded=false;
                                        obj.tabActive='tabular';
                                        break;
                    }
                    
          },
          buildSectionGraph:function(){
                    var chain='';
                    var valid = false;
                    chain='<div class="row">'+
                              '<div class="col s12 m6">'+
                                        '<div class="FieldReport">'+
                                                  '<div class="label">Campo</div>'+
                                                  '<select id="field_graph" class="selectInput">';
                                                  for(var x in obj.dataSend.fields){
                                                            var i = obj.dataSend.fields[x];
                                                            if ((i.datatype=='numeric')||(i.datatype=='real')) {
                                                                      valid=true;
                                                                      chain+='<option value="'+i.field+'">'+i.label+'</option>';
                                                            }
                                                  }
                    chain+=                      '</select>'+
                                        '</div>'+
                              '</div>'+
                              '<div class="col s12 m6">'+
                                        '<div class="FieldReport">'+
                                                            '<div class="label">Tipo de grafica</div>'+
                                                            '<select id="type_graph" class="selectInput">'+
                                                                      '<option value="1">De barras</option>'+
                                                                      '<option value="2">De pastel</option>'+
                                                            '</select>'+
                                        '</div>'+
                              '</div>';
                    $(".option_graph").html(chain);
                    $(".custom_reports #field_graph").change(function(){
                              var tipo = $('.custom_reports #type_graph option:selected').val();
                              obj.loadGraph(tipo);
                    });
                    $(".custom_reports #type_graph").change(function(){
                              var tipo = $('.custom_reports #type_graph option:selected').val();
                              obj.loadGraph(tipo);
                    });
                    if (!valid) {
                             $(".custom_reports .trep_graph").parent().hide();
                    }
          },
          hasFolio:function(data){
                    var hasfield = false
                    for(var x in data){
                              var i = data[x];
                              if (i.field=='folio') {
                                        hasfield=true;
                                        break;
                              }
                    }
                    return hasfield;
          },
          buildReport:function(){
                    var obj = this;
                    var params = $.extend({}, obj.dataSend);
                    if (obj.dataSend.filter==null) {
                              delete params.filter;
                    }
                    obj.request(params,'getReport');
          },
          storefilterAndOrder:function(){
                    var obj = this;
                    var fieldOrder = $(".custom_reports #field_ordering option:selected").val();
                    var typeOrder = $(".custom_reports #type_ordering option:selected").val();
                    obj.dataSend.order = {field:fieldOrder,value:typeOrder,dataType:obj.fields[fieldOrder].dataType};
                    var typeOperator = '1';
                    var valueFilter='';
                    var field_filter = $(".custom_reports #field_filter option:selected").val();
                    var isRecord=false;
                    var isList=false;
                    var valueFilterDate='';
                    switch (obj.fieldToFilter.datatype) {
                              case 'real':
                              case 'numeric':
                                        typeOperator = $(".custom_reports #type_operator option:selected").val();
                                        valueFilter = $(".custom_reports #value_filter").val();
                                        break;
                              case 'list':
                                        valueFilter = $(".custom_reports #value_filter option:selected").val();
                                        if (valueFilter=='-1') {
                                                  valueFilter='';
                                        }
                                        isList=true;
                                        break;
                              case 'records':
                                        isRecord=true;
                                        var subfield=$(".custom_reports #fields_multiRecord option:selected").val();
                                        switch (obj.fieldMultiRecordToFilter.datatype) {
                                               case 'numeric':
                                                  typeOperator = $(".custom_reports #type_operator option:selected").val();
                                                  valueFilter = $(".custom_reports #value_filter").val();
                                                  break;
                                               case 'list':
                                                  valueFilter = $(".custom_reports #value_filter option:selected").val();
                                                  if (valueFilter=='-1') {
                                                            valueFilter='';
                                                  }
                                                  isList=true;
                                                  break;
                                               default:
                                                  valueFilter = $(".custom_reports #value_filter").val();
                                        }
                                        
                                        break;
                              case 'time':
                              case 'date':
                                        var initialValue =$(".custom_reports #value_filter_start").val();   
                                        var lastValue = $(".custom_reports #value_filter_end").val();   
                                        valueFilterDate = {start:initialValue,end:lastValue};
                                        valueFilter='DATE';
                                        break;
                              default:
                                        valueFilter = $(".custom_reports #value_filter").val();       
                    }
                    if(validator.isEmpty(valueFilter)){
                              obj.dataSend.filter = null;
                    }else{
                              valueFilter = validator.replaceTags(valueFilter);
                              obj.dataSend.filter={};
                              if (isRecord) {
                                        obj.dataSend.filter = {field:field_filter,datatype:obj.fieldToFilter.datatype,subfield:{field:subfield,operator:typeOperator,value:valueFilter,datatype:obj.fieldMultiRecordToFilter.datatype}};
                                        if(isList){
                                                  obj.dataSend.filter.subfield['listname']=obj.fieldMultiRecordToFilter.listname;
                                        }     
                              }else{
                                        var valueToFilter = ((obj.fieldToFilter.datatype=='date')||(obj.fieldToFilter.datatype=='time'))?valueFilterDate:valueFilter;
                                        obj.dataSend.filter = {field:field_filter,operator:typeOperator,value:valueToFilter,datatype:obj.fieldToFilter.datatype};
                                        if(isList){
                                                  obj.dataSend.filter['listname']=obj.fieldToFilter.listname;
                                        }                                       

                              }
                              
                    }
                    //console.log(obj.dataSend.filter)
          },
          sendToSelected:function(){
                    var obj = this;
                    $("."+obj.id+" .fieldsToSelect .itemFieldReport_selected").each(function(){
                              var field = $(this).attr('ref');
                              obj.fields[field].selected = true;
                              $(this).hide();
                              $(this).attr('status','');
                              $(this).removeClass('itemFieldReport_selected');
                              $('.'+obj.id+' .fieldsSelected div[id="R'+field+'"]').show();
                              //$("."+obj.id+" .fieldsSelected #R"+field).show();
                    });
                    
          },
          sendToAvailable:function(){
                    var obj = this;
                    $("."+obj.id+" .fieldsSelected .itemFieldReport_selected").each(function(){
                              var field = $(this).attr('ref');
                              obj.fields[field].selected = false;
                              $(this).hide();
                              $(this).attr('status','');
                              $(this).removeClass('itemFieldReport_selected');
                              $('.'+obj.id+' .fieldsToSelect div[id="R'+field+'"]').show();
                              //$("."+obj.id+" .fieldsToSelect #R"+field).show();
                    });        
          },
          sendAllToSelected:function(){
                    var obj = this;
                    $("."+obj.id+" .fieldsToSelect .itemFieldReport").each(function(){
                              if ($(this).css('display')!='none') {
                                        var field = $(this).attr('ref');
                                        obj.fields[field].selected = true;
                                        $(this).hide();
                                        $(this).attr('status','');
                                        $(this).removeClass('itemFieldReport_selected');
                                        $('.'+obj.id+' .fieldsSelected div[id="R'+field+'"]').show();
                                        //$("."+obj.id+" .fieldsSelected #R"+field).show();
                              }
                              
                    });
                    
          },
          sendAllToAvailable:function(){
                    var obj = this;
                    $("."+obj.id+" .fieldsSelected .itemFieldReport").each(function(){
                              if ($(this).css('display')!='none') {
                                        var field = $(this).attr('ref');
                                        obj.fields[field].selected = false;
                                        $(this).hide();
                                        $(this).attr('status','');
                                        $(this).removeClass('itemFieldReport_selected');
                                        $('.'+obj.id+' .fieldsToSelect div[id="R'+field+'"]').show();
                                        //$("."+obj.id+" .fieldsToSelect #R"+field).show();
                              }
                    });        
          },
          showOptionsFilter:function(data,container){
                    var chain='';
                    var obj=this;
                    switch (data.datatype) {
                              case 'image':
                              case 'alphanumeric':
                              case 'string':
                                        chain+='<div class="FieldReport">'+
                                                  '<div class="label">Valor</div>'+
                                                  '<input id="value_filter" type="text" class="textInput"/>'+
                                               '</div>';
                              break;
                              case 'list':
                                        var opciones='';
                                        for(var x in data.list.list){
                                                  var i = data.list.list[x];
                                                  opciones+='<option value="'+i.value+'">'+i.label+'</option>';
                                        }
                                        chain+='<div class="FieldReport">'+
                                                  '<div class="label">Valor</div>'+
                                                  '<select id="value_filter" class="selectInput">'+
                                                            '<option value="-1">Cualquier valor</option>'+
                                                            opciones+ 
                                                  '</select>'+
                                               '</div>';
                              break;
                              case 'real':
                              case 'numeric':
                                        chain+='<div class="FieldReport">'+
                                                  '<div class="label">Operador</div>'+
                                                  '<select id="type_operator" class="selectInput">'+
                                                            '<option value="1">=</option>'+
                                                            '<option value="2">></option>'+
                                                            '<option value="3"><</option>'+
                                                  '</select>'+
                                               '</div>'+
                                               '<div class="FieldReport">'+
                                                  '<div class="label">Valor</div>'+
                                                  '<input id="value_filter" type="text" class="textInput"/>'+
                                               '</div>';
                              break;
                              case 'time':
                                        chain+='<div class="FieldReport">'+
                                                  '<div class="label">Hora inicial</div>'+
                                                  '<input style="margin-bottom: 0px !important;" id="value_filter_start" type="text" class="textInput"/>'+
                                               '</div>'+
                                               '<div class="FieldReport">'+
                                                  '<div class="label">Hora final</div>'+
                                                  '<input id="value_filter_end" type="text" class="textInput"/>'+
                                               '</div>';
                              break;
                              case 'date':
                                        chain+='<div class="FieldReport">'+
                                                  '<div class="label">Fecha inicial</div>'+
                                                  '<input style="margin-bottom: 0px !important;" id="value_filter_start" type="text" class="textInput"/>'+
                                               '</div>'+
                                               '<div class="FieldReport">'+
                                                  '<div class="label">Fecha final</div>'+
                                                  '<input id="value_filter_end" type="text" class="textInput"/>'+
                                               '</div>';
                              break;
                              case 'records':
                                        obj.request({action:'get',formulario:data.field},'getFieldsMiltiRecord');
                              break;
                    
                    }
                    
                    $("."+obj.id+" ."+container).html(chain);
                    if (data.datatype=='numeric') {
                              $(".custom_reports #value_filter").bind("keypress", function(evt) {
                                      var otherresult = 12;
                                        if(window.event != undefined){
                                              otherresult = window.event.keyCode;
                                        }
                                        var charCode = (evt.which) ? evt.which : otherresult;  
                                        var keyChar = String.fromCharCode(charCode);
                                        var keyChar2 = keyChar.toLowerCase();
                                        var re =   /^(-)?(\d*)$/
                                        var result = re.test(keyChar2);
                                        return result;                               
                              }).bind("paste",function(event){
                                        var item = $(this);
                                        setTimeout(function(){
                                                  var value = item.val();
                                                  var re =   /^(-)?(\d*)$/
                                                  var result = re.test(value);
                                                  if (!result) {
                                                        item.val('');
                                                  }
                                        },100);
                                        
                              });
                    }
                    if (data.datatype=='real') {
                              
                              $(".custom_reports #value_filter").bind("keypress", function(evt) {
                                      var otherresult = 12;
                                        if(window.event != undefined){
                                              otherresult = window.event.keyCode;
                                        }
                                        var charCode = (evt.which) ? evt.which : otherresult;  
                                        var keyChar = String.fromCharCode(charCode);
                                        var keyChar2 = keyChar.toLowerCase();
                                        var re =   /^(-)?(\d*)(\.?)(\d*)$/
                                        var result = re.test(keyChar2);
                                        var item = $(this);
                                        setTimeout(function(){
                                                  var value = item.val();
                                                  var result = re.test(value);
                                                  if (!result) {
                                                            value = value.substring(0,value.length-1);
                                                            item.val(value);
                                                  }
                                                  
                                        },100);
                                        return result;                               
                              }).bind("paste",function(event){
                                        var item = $(this);
                                        setTimeout(function(){
                                                  var value = item.val();
                                                  var re =   /^(-)?(\d*)(\.?)(\d*)$/
                                                  var result = re.test(value);
                                                  if (!result) {
                                                        item.val('');
                                                  }
                                        },100);
                                        
                              });
                             
                    }
                    if (data.datatype=='time') {
                             $(".custom_reports #value_filter_start,.custom_reports #value_filter_end").bind("keypress", function(evt) {
                                        return false;
                              }).bind("paste",function(event){
                                        return false;
                              }).timepicker();
                    }
                    if (data.datatype=='date') {
                              
                              $(".custom_reports #value_filter_start,.custom_reports #value_filter_end").bind("keypress", function(evt) {
                                        return false;
                              }).bind("paste",function(event){
                                        return false;
                              }).datepicker({
                                  yearRange: "-120:+120",
                                  changeMonth: true,
                                  changeYear: true
                              });
                              $(".custom_reports #value_filter_start").change(function(){
                                        var currentDate = $(this).datepicker( "getDate" );
                                        $(".custom_reports #value_filter_end").datepicker( "option", "minDate", currentDate );
                              });
                              
                    }
                    if (data.datatype=='alphanumeric') {
                              
                              $(".custom_reports #value_filter").bind("keypress", function(evt) {
                                                var otherresult = 12;
                                                  if(window.event != undefined){
                                                        otherresult = window.event.keyCode;
                                                  }
                                                  var charCode = (evt.which) ? evt.which : otherresult;  
                                                  var keyChar = String.fromCharCode(charCode);
                                                  var keyChar2 = keyChar.toLowerCase();
                                                  var re =   /^[a-z0-9 ]+$/i
                                                  var result = re.test(keyChar2);
                                                  return result;                               
                              }).bind("paste",function(event){
                                        return false;
                                        
                              });
                    }
          },
          events:function(){
                    var obj=this;
                    $("."+obj.id+" .section").each(function(){
                              $(this).hide();
                    });
                    obj.selectSection(1);
                    obj.request({action:'get',report:true,user:obj.options.data.userActive.id},'getFields');
                    $("."+obj.id+" .fieldsToSelect .footerBlockAll").click(function(){
                              obj.sendAllToSelected();
                    });
                    $("."+obj.id+" .fieldsSelected .footerBlockAll").click(function(){
                              obj.sendAllToAvailable();
                    });
                    $("."+obj.id+" .fieldsToSelect .footerBlock").click(function(){
                              obj.sendToSelected();
                    });
                    $("."+obj.id+" .fieldsSelected .footerBlock").click(function(){
                              obj.sendToAvailable();
                    });
                    $("."+obj.id+" #btnStep1").click(function(){
                              var valid= obj.existFieldsSelected();
                              if (valid) {
                                        obj.selectSection(2);
                              }else{
                                        Alert.show({
                                                  title:'Notificaci&oacute;n',
                                                  type:'error',
                                                  messages:['Debe seleccionar por lo menos un campo'],
                                                  buttons:[{label:'Cerrar'}]
                                        }); 
                              }
                              
                    });
                    $("."+obj.id+" #btnStep2Back").click(function(){
                              obj.selectSection(1);
                    });
                    $("."+obj.id+" #btnStep2Next").click(function(){
                              var valid = true;
                              /*
                              if (obj.fieldToFilter.datatype!='select') {
                                        if (validator.isEmpty($("#value_filter").val())) {
                                                  valid=false;
                                        }
                                       
                              }
                              */
                              if (valid) {
                                       obj.selectSection(3);
                              }else{
                                        Alert.show({
                                                  title:'Notificaci&oacute;n',
                                                  type:'error',
                                                  messages:['Debe introducir un valor a filtrar'],
                                                  buttons:[{label:'Cerrar'}]
                                        }); 
                              }
                              
                    });
                    $("."+obj.id+" #btnStep3Back").click(function(){
                              obj.selectSection(2);
                    });
                    $("."+obj.id+" #btnStep3Next").click(function(){
                              var valid = true;
                              if (validator.isEmpty($("."+obj.id+" #name_report").val())) {
                                                  valid=false;
                              }
                              
                              if (valid) {
                                       obj.selectSection(4);
                              }else{
                                        Alert.show({
                                                  title:'Notificaci&oacute;n',
                                                  type:'error',
                                                  messages:['Introduzca un titulo'],
                                                  buttons:[{label:'Cerrar'}]
                                        }); 
                              }
                              
                    });
                    $("."+obj.id+" #btnStep4Back").click(function(){
                              obj.selectSection(3);
                    });
                    $(".custom_reports .trep_print").click(function(){
                              if (obj.tabActive=='tabular') {
                                        if (obj.activeReportMultirecords) {
                                                 $(".reportPrintMultirecords").css('display','');
                                        }else{
                                                  
                                                 $(".reportPrint").css('display','');  
                                                 var height = $(".reportPrint .borderHeading").height();
                                                 height = parseInt(height);
                                                 newHead = 'hed'+height+'';
                                                 $(".hed").each(function(){
                                                            $(this).addClass(newHead).removeClass('hed');
                                                  });
                                                 
                                        }
                                        
                                        $(".custom_reports .section_info_user").hide();
                                        
                                        window.print();
                                        if (obj.activeReportMultirecords) {
                                                 $(".reportPrintMultirecords").css('display','none');
                                        }else{
                                                 $(".reportPrint").css('display','none');
                                        }
                                         
                                         $(".custom_reports .section_info_user").show();
                              }else{
                                         $(".graphPrint").css('display','');
                                        $(".custom_reports .section_info_user").hide();
                                        
                                        window.print();
                                         $(".graphPrint").css('display','none');
                                         $(".custom_reports .section_info_user").show();
                                        }
                             
                    });
                    $(".custom_reports .trep_csv").click(function(){
                              var params = $.extend({}, obj.dataSend);
                              if (obj.dataSend.filter==null) {
                                        delete params.filter;
                              }
                              obj.request(params,'getSeed');
                    });
                    //LYAXS
				    $(".custom_reports .ttab_pdf").click(function(){
                            var params = $.extend({}, obj.dataSend);
                              if (obj.dataSend.filter==null) {
                                        delete params.filter;
                              }
                              obj.request(params,'getSeedPdf');
							 
                    });
					//ENDLYAXS
                    $(".custom_reports .trep_tabular").parent().click(function(){
                              $(".custom_reports .trep_tabular").parent().hide();
                              $(".custom_reports .trep_graph").parent().show();
                              $(".custom_reports .dataTabular").show();
                              $(".custom_reports .dataGraph").hide();
                              obj.tabActive = 'tabular';
                              $('.headerTabular,.title_reportTabular').show();
                    });
                    $(".custom_reports .trep_graph").parent().click(function(){
                              $('.headerTabular,.title_reportTabular').hide();
                              $(".custom_reports .trep_tabular").parent().show();
                              $(".custom_reports .trep_graph").parent().hide();
                              $(".custom_reports .dataTabular").hide();
                              $(".custom_reports .dataGraph").show();
                              if (!obj.graphLoaded) {
                                       obj.graphLoaded=true;
                                       obj.loadGraph('1');
                              }
                              obj.tabActive='graph';
                    });
                    
          },
          loadGraph:function(tipo){
                    var obj = this;
                    var field = $("."+obj.id+" #field_graph option:selected").val();
                    var params = $.extend({}, obj.dataSend);      
                    params.graph = {field:field};
                    obj.request(params,'getGraph',tipo);
          },
         
          
          showReport:function(data){
                    var chainPrint='';
                    var obj=this;
                    var footer={};
                    var thereIsNumbers=false;
                    var title =$(".custom_reports  #name_report").val();
                    title = validator.replaceTags(title);
                    var chain='';
                    chain='<div class="title_report">'+title+'</div>';
                    var chainHeader='';
                    chain+='<div class="results_table_filter">';
                    var header='<div class="Heading">';
                                       // var clase = 'borderRow';
                                        var source = obj.dataSend.fields;
                                        for(var x in source){
                                                 var clase = (x==0)?'':'borderRow';
                                                 var width = obj._getWidth(source[x].label.length, source[x].field.length);
                                                 var cadena='<div class="Cell borderHeading '+clase+'" '+width+'>'+
                                                                      '<p '+width+'>'+source[x].label+'</p>'+
                                                            '</div>';
                                                  header+=cadena;
                                                  chainHeader+=cadena;
                                        }
                    header+='</div>';
                    chain=chain+header;
                    var firstRows = true;
                    var clase = 'rowFilled';
                    var contador = 1;
                    for(var x in data){
                              var i = data[x];
                              if (clase.length>0) {
                                        clase='';
                              }else{
                                        clase='rowFilled';
                              }
                              var cadena='';
                              cadena+='<div class="Row">';
                              for(var f in source){
                                        var valor=i[source[f].field];
                                        if (source[f].datatype=='records') {
                                                 var r = i[source[f].field].campo;
                                                 var hint = (parseInt(r.total)>0)?' title="De click para ver los registros" ':'';
                                                 valor ='<div class="itemRecordReport" '+hint+' ref="'+r.folio+'" field="'+source[f].field+'" label="'+r.label+'" total="'+r.total+'">'+r.total+' Registro(s)</div>';
                                        }
                                        
                                        if (((source[f].datatype=='numeric')||(source[f].datatype=='real'))&&(source[f].field.indexOf('anio')==-1)) {
                                                 if (footer[source[f].field]) {
                                                            footer[source[f].field]+=parseFloat(valor);
                                                 }else{
                                                          footer[source[f].field]=parseFloat(valor);  
                                                 }
                                                 thereIsNumbers=true;
                                        }
                                        var aditionalClase=(firstRows)?' class="f'+source[f].field+'"':'';
                                        var width = obj._getWidth(source[f].label.length, source[f].field.length);
                                        cadena+='<div class="Cell borderHeading '+clase+'" '+width+'>'+
                                                                '<p '+width+'>'+valor+'</p>'+
                                               '</div>';
                                        
                              }
                              if (firstRows) {
                                               firstRows=false;
                              }
                              cadena+='</div>';
                              chain+=cadena;
                              chainPrint+='<div class="SectioN">'+
                                                  '<div class="hed">'+
                                                    '<div>'+
                                                      '<div class="HeadeR">'+
                                                        header+
                                                        
                                                      '</div>'+
                                                      '<div class="ContenT">'+
                                                        cadena+
                                                        
                                                      '</div>'+
                                                    '</div>'+
                                                  '</div>'+
                                            '</div>';
                            /*
                              if (contador==10) {
                                        chain+='<div class="Heading sectionTitleReport"></div>';
                                        contador=1;
                              }else{
                                       contador+=1; 
                              }
                             */
                              
                    }
                    
                    if (thereIsNumbers) {
                              var totalChain='';
                              totalChain+=   '<div class="Heading">';
                                                  var clase = 'borderRow';
                                                  var source = obj.dataSend.fields;
                                                  for(var x in source){
                                                           var clase = (x==0)?'':'borderRow';
                                                           var valor = (footer[source[x].field])?footer[source[x].field]:'';
                                                           var width = obj._getWidth(source[x].label.length, source[x].field.length);
                                                           totalChain+='<div class="Cell borderHeading '+clase+'" '+width+'>'+
                                                                      '<p '+width+'>'+validator.getFormatNumber(valor)+'</p>'+
                                                                  '</div>';
                                                  }
                              totalChain+=   '</div>';
                              chain+=totalChain;
                              chainPrint+='<div class="SectioN">'+
                                                  '<div class="hed">'+
                                                    '<div>'+
                                                      '<div class="HeadeR">'+
                                                        
                                                      '</div>'+
                                                      '<div class="ContenT">'+
                                                        totalChain+
                                                        
                                                      '</div>'+
                                                    '</div>'+
                                                  '</div>'+
                                            '</div>';
                    }
                    chain+='</div>';
                    
                    $(".custom_reports .dataTabular").html(chain);
                    $(".custom_reports .title_reportTabular").html(title);
                    $(".custom_reports .headerTabular").html('<div class="results_table_filter">'+header+'</div>');
                    setTimeout(function(){
                                        if($('.custom_reports .dataTabular').hasScrollBar()){
                                                  $(".custom_reports .headerTabular").css('right','16px');
                                                  $(".custom_reports .title_reportTabular").css('right','16px').show();
                                        }
                                        $('.custom_reports .dataTabular').scroll(function(){
                                                 var position =  $('.custom_reports .dataTabular').scrollLeft();
                                                 $(".custom_reports .headerTabular").scrollLeft(position);
                                        });
                    },500);
                    $(".reportPrint").remove();
                    $("body").append('<div class="reportPrint" style="display:none"><div class="results_table_filter">'+chainPrint+'</div></div>');
                    $('.reportPrint .sectionTitleReport').each(function(){
                              $(this).html(chainHeader);
                    });
                    obj.eventsMultirecords();
                    
                    for(var x in source){
                              var f = source[x].field;
                              var widthField = $(".dataTabular .f"+f).width() ;
                              $(".headerTabular .h"+f).css('width',widthField+'px');
                              $(".headerTabular .h"+f).parent().css('width',widthField+'px');
                    }
          },
          // Metodo privado que retorna el tamaño del elemento, dependiendo de la longitud de la cadena
          _getWidth: function(lengthLabel, lengthValue){ // Marco
              return lengthLabel > 20 || lengthValue > 20 ? ' style="width:300px;" ':' style="width:200px;" ';
          },
          showReportRows:function(data){
                    
                    var obj=this;
                    var footer={};
                    var thereIsNumbers=false;
                    var title =$(".custom_reports  #name_report").val();
                    title = validator.replaceTags(title);
                    var chain='<div class="title_report">'+title+'</div>';
                    chain+='<div class="results_table_filter">';
                    var source = obj.dataSend.fields;
                              
                    
                    var clase = 'rowFilled';
                    for(var x in data){
                              var i = data[x];
                              if (clase.length>0) {
                                        clase='';
                              }else{
                                        clase='rowFilled';
                              }
                             
                              
                              for(var f in source){
                                        var valor = i[source[f].field];
                                        if (source[f].datatype=='records') {
                                                 var r = i[source[f].field].campo;
                                                 valor ='<div class="itemRecordReport" title="De click para ver los registros" ref="'+r.folio+'" field="'+source[f].field+'" label="'+r.label+'" total="'+r.total+'">'+r.total+' Registro(s)</div>';
                                        }
                                        chain+='<div class="Row">';
                                        chain+='<div class="Cell borderHeading '+clase+'">'+
                                                            '<p>'+source[f].label+'</p>'+
                                               '</div>';
                                        chain+='<div class="Cell borderHeading '+clase+'">'+
                                                            '<p>'+valor+'</p>'+
                                               '</div>';
                                        chain+='</div>';
                                        
                                        if (((source[f].datatype=='numeric')||(source[f].datatype=='real'))&&(source[f].field.indexOf('anio')==-1)){
                                                 if (footer[source[f].field]) {
                                                            footer[source[f].field]+=parseFloat(valor);
                                                 }else{
                                                          footer[source[f].field]=parseFloat(valor);  
                                                 }
                                                 thereIsNumbers=true;
                                        }
                              }
                    }
                    if (thereIsNumbers) {
                                        var source = obj.dataSend.fields;
                                        if (clase.length>0) {
                                                  clase='';
                                        }else{
                                                  clase='rowFilled';
                                        }
                                        for(var f in source){
                                                  if (footer[source[f].field]) {
                                                            var valor = footer[source[f].field];
                                                            chain+='<div class="Row">';
                                                            chain+='<div class="Cell borderHeading '+clase+'">'+
                                                                                '<p>Total '+source[f].label+'</p>'+
                                                                   '</div>';
                                                            chain+='<div class="Cell borderHeading '+clase+'">'+
                                                                                '<p>'+validator.getFormatNumber(valor)+'</p>'+
                                                                   '</div>';
                                                            chain+='</div>';
                                                  }
                                        }
                    }
                    chain+='</div>';
                    $(".custom_reports .dataTabular").html(chain);
                    $(".reportPrint").remove();
                    $("body").append('<div class="reportPrint" style="display:none">'+chain+'</div>');
                    obj.eventsMultirecords();
          },
          eventsMultirecords:function(){
                    var obj = this;
                    $("."+obj.id+" .itemRecordReport").each(function(){
                              $(this).click(function(){
                                        $('.custom_reports .trep_graph').hide();
                                        var folio = $(this).attr('ref');
                                        var formulario = $(this).attr('field');
                                        var label = $(this).attr('label');
                                        var total = parseInt($(this).attr('total'));
                                        //folio='AM0001049';
                                        //formulario ='formularios.areascorta';
                                        var params = {formulario:formulario,folio:folio,label:label,total:total};
                                        if (total>0) {
                                                  obj.request(params,'getMiltiRecord');
                                        }
                                       
                              });
                    });        
          },
          showMultirecord:function(data,info){
                    var source=[];
                    var chain='';
                    var chainHeader='';
                    chainHeader+='<div class="results_table_filter_multirecord">'+
                                        '<div class="Heading">';
                    var clase = 'rowFilled';
                    var aditionalHeader='';
                    var contador=1;
                    var firstRows = true;
                    for(var x in data){
                              var c = data[x].columns;
                              chain+='<div class="Row">';
                              clase = (clase.length>0)?'':'rowFilled';
                              for (var f in c) {
                                        var cadena ='';
                                        if (x==0) {
                                                  var cadena = '<div class="Cell borderHeading">'+
                                                                     '<p class="hm'+c[f].field+'" style="width:120px;">'+c[f].label+'</p>'+
                                                               '</div>';
                                                  chainHeader+=cadena;
                                                  aditionalHeader+=cadena;
                                        }
                                        var aditionalClase=(firstRows)?' class="fm'+c[f].field+'"':'';
                                        if (firstRows) {
                                                  var paramRecord={};
                                                  paramRecord['field']=c[f].field
                                                  source.push(paramRecord);
                                        }
                                        var cadena2 = '<div class="Cell borderHeading '+clase+'">'+
                                                            '<p '+aditionalClase+'>'+obj.getValueSelect(c[f])+'</p>'+
                                                '</div>';
                                        chain+=cadena2;
                                        //aditionalHeader+=cadena2;
                              }
                              if (firstRows) {
                                               firstRows=false;
                              }
                              chain+="</div>";
                              if (contador==10) {
                                        chain+='<div class="Heading sectionTitleReportMultirecord"></div>';
                                        contador=1;
                              }else{
                                       contador+=1; 
                              }
                    }
                    var title='<div class="title_report_multirecord">'+
                                        '<div class="btnBackAll">'+
                                                  '<div class="mdi-hardware-keyboard-arrow-left left"></div>'+
                                        '</div>'+
                                        '<div class="refFolio">Folio '+info.folio+'</div>'+
                                        '<div class="fieldMulti">'+info.label+'</div>'+
                              '</div>';
                    $("."+obj.id+" .dataMultirecord").html(title+chainHeader+'</div>'+chain);
                    $("."+obj.id+" .headerTabular_Multirecord").html(chainHeader+'</div>').show();
                    $("."+obj.id+" .title_reportTabular_Multirecord").html(title).show();
                    $("."+obj.id+" .dataMultirecord").show();
                    $("."+obj.id+" .refFolio,.btnBackAll").click(function(){
                              $('.custom_reports .trep_graph').show();
                              $("."+obj.id+" .dataMultirecord").hide();
                              obj.activeReportMultirecords=false;
                              $(".custom_reports .headerTabular_Multirecord").hide();
                              $(".custom_reports .title_reportTabular_Multirecord").hide();
                    });
                    setTimeout(function(){
                                        if($('.custom_reports .dataMultirecord').hasScrollBar()){
                                                  $(".custom_reports .headerTabular_Multirecord").css('right','16px');
                                                  $(".custom_reports .title_reportTabular_Multirecord").css('right','16px').show();
                                        }
                                        $('.custom_reports .dataMultirecord').scroll(function(){
                                                 var position =  $('.custom_reports .dataMultirecord').scrollLeft();
                                                 $(".custom_reports .headerTabular_Multirecord").scrollLeft(position);
                                        });
                    },500);
                    $(".reportPrintMultirecords").remove();
                    $("body").append('<div class="reportPrintMultirecords" style="display:none">'+title+chainHeader+'</div>'+chain+'</div>');
                    obj.activeReportMultirecords=true;
                    $('.reportPrintMultirecords .sectionTitleReportMultirecord').each(function(){
                              $(this).html(aditionalHeader);
                    });
                    for(var x in source){
                              var f = source[x].field;
                              var widthField = $(".dataMultirecord .fm"+f).width() ;
                              $(".headerTabular_Multirecord .hm"+f).css('width',widthField+'px');
                              $(".headerTabular_Multirecord .hm"+f).parent().css('width',widthField+'px');
                              $(".dataMultirecord .hm"+f).css('width',widthField+'px');
                              $(".dataMultirecord .hm"+f).parent().css('width',widthField+'px');
                    }
          },
          showMultirecordRows:function(data,info){
                    
                    var chain='';
                    var chainHeader='';
                    chainHeader+='<div class="results_table_filter_multirecord">';
                    var clase = 'rowFilled';
                    for(var x in data){
                              var c = data[x].columns;
                              clase = (clase.length>0)?'':'rowFilled';
                              for (var f in c) {
                                        chain+=   '<div class="Row">'+
                                                            '<div class="Cell borderHeading '+clase+'">'+
                                                                      '<p>'+c[f].label+'</p>'+
                                                            '</div>'+
                                                            '<div class="Cell borderHeading '+clase+'">'+
                                                                      '<p>'+obj.getValueSelect(c[f])+'</p>'+
                                                            '</div>'+
                                                  '</div>';
                              }
                    }
                    var title='<div class="title_report_multirecord">'+
                                        '<div class="btnBackAll">'+
                                                  '<div class="mdi-hardware-keyboard-arrow-left left"></div>'+
                                        '</div>'+
                                        '<div class="refFolio">Folio '+info.folio+'</div>'+
                                        '<div class="fieldMulti">'+info.label+'</div>'+
                              '</div>';
                    $("."+obj.id+" .dataMultirecord").html(title+chainHeader+chain+'</div>');
                    $("."+obj.id+" .dataMultirecord").show();
                    $("."+obj.id+" .refFolio,.btnBackAll").click(function(){
                              $("."+obj.id+" .dataMultirecord").hide();
                              obj.activeReportMultirecords=false;
                    });
                    $(".reportPrintMultirecords").remove();
                    $("body").append('<div class="reportPrintMultirecords" style="display:none">'+title+chainHeader+chain+'</div>');
                    obj.activeReportMultirecords=true;
          },
          getValueSelect:function(a){
                    var value = '';
                    switch (a.datatype) {
                              case 'list':
                                        for(var x in a.list.list){
                                                  var i = a.list.list[x];
                                                  if (i.value==parseInt(a.value)) {
                                                            value=i.label;
                                                            break;
                                                  }
                                        }
                              break;
                              default:
                                        value = a.value;
                    }
                    return value;
          },
          _refresh: function(){
            // trigger a callback/event
            this._trigger( "change" );
          },
         
          _destroy: function() {
              this.element.remove();
          },
      
          _setOption: function(key, value){
                    this.options[key] = value;
                              switch(key){
                                        case "data":
                                                  this.fields=[];
                                                  this.options.data = value;
                                                  this.update();
                                        break;
                                                          
                              }
		    }
	  }
);
});