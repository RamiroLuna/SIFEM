define(["connections","validator"], function(connections,validator){
    var data = amplify.store('dataLoggingProbosque');
    var show=function(params){
	buildAlert(params);
	event(params);
    };
    var getButtons =function(params){
	var buttons = params.buttons;
	var chain='';
	    if (buttons[0]) {
		chain+='<button class="textButton textButton_'+params.type+'">'+buttons[0].label+'</button>';
					
	    }
	    if (buttons[1]) {
		chain+='<button class="textButton textButton_'+params.type+'">'+buttons[1].label+'</button>';
	    }
	return chain;
    };
    var buildAlert=function(params){
	var a = '';
	var msgs = params.messages;
	for(var x in msgs){
	    var i = msgs[x];
	    a+='<p>'+i+'</p>';
	}
	var content = (params.content)?params.content:'';
	
    var chain = '<div class="custom_alert '+((params.clase)?params.clase:'')+'">'+
			'<div class="custom_alert_veil"></div>'+
			'<div class="message">'+
				'<div class="header '+params.type+'"><div class="label">'+params.title+'</div></div>'+
				'<div class="content">'+
				    a+
				    content+
				    '<div class="buttons" align="center">'+
					getButtons(params)+
				    '</div>'+
				'</div>'+
			'</div>'+
		    '</div>';
	hide();
	$('body').append(chain);
    };
    var hide = function(clase){
	if (clase) {
	    $("."+clase).remove();
	}else{
	    $(".custom_alert").remove();
	    $("#custom_multirecords").remove();
	}
    }
    var event = function(params){
        var data = amplify.store('dataLoggingProbosque');
	if (params.buttons[0]) {
	    $( ".custom_alert button:first" ).click(function(){
		
		    if (params.buttons[0].event) {
			params.buttons[0].event();
		    }
		    hide();
		    //alert(JSON.stringify(data));
		    if (data.program == 13) {
		    	$("#custom_multirecords").remove();
			}

	    });
	}
	if (params.buttons[1]) {
	    $( ".custom_alert button:last" ).click(function(){
		
		    if (params.buttons[1].event) {
			params.buttons[1].event();
		    }
		    hide();
	    });
	}
    };
    return {
	    show:show,
	    hide:hide
    }
    
});