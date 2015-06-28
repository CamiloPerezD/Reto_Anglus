var palabras=["personaje"];
var estado=false;
var anterior="";
function colisiona(item1,item2){
	var supDerecha=esquinaSupDerecha(item1);
	var supIzquierda=esquinaSupIzquierda(item1);
	var infIzquierda=esquinaInfIzquierda(item1);
	var infDerecha=esquinaInfDerecha(item1);
	var supDerechaI=esquinaSupDerecha(item2);
	var supIzquierdaI=esquinaSupIzquierda(item2);
	var infIzquierdaI=esquinaInfIzquierda(item2);
	var infDerechaI=esquinaInfDerecha(item2);

	if ((infDerecha[1]>=supIzquierdaI[1])&&(infDerecha[1]<=infIzquierdaI[1])) {
		if ((infDerecha[0]>=supIzquierdaI[0])&&(infDerecha[0]<=supDerechaI[0])) {
			return true;
		}else{
			if ((infIzquierda[0]>=supIzquierdaI[0])&&(infIzquierda[0]<=supDerechaI[0])) {
				return true;
			}
		}
	}else{
		if ((infDerechaI[1]>=supIzquierda[1])&&(infDerechaI[1]<=infIzquierda[1])) {
			if ((infDerechaI[0]>=supIzquierda[0])&&(infDerechaI[0]<=supDerecha[0])) {
				return true;
			}else{
				if ((infIzquierdaI[0]>=supIzquierda[0])&&(infIzquierdaI[0]<=supDerecha[0])) {
					return true;
				}
			}
		}
	}
	return false;
}
function esquinaSupIzquierda(item){
	var x= castear(document.getElementById(item).style.marginLeft);
	var y= castear(document.getElementById(item).style.marginTop);
	return [x,y];
}
function esquinaSupDerecha(item){
	var x= (castear(document.getElementById(item).style.marginLeft))+(document.getElementById(item).clientWidth);
	var y= castear(document.getElementById(item).style.marginTop);
	return [x,y];
}
function esquinaInfIzquierda(item){
	var x= castear(document.getElementById(item).style.marginLeft);
	var y= (castear(document.getElementById(item).style.marginTop))+(document.getElementById(item).clientHeight);
	return [x,y];
}
function esquinaInfDerecha(item){
	var x= (castear(document.getElementById(item).style.marginLeft))+(document.getElementById(item).clientWidth);
	var y= (castear(document.getElementById(item).style.marginTop))+(document.getElementById(item).clientHeight);
	return [x,y];
}
function ubicarPersonaje(){
	var ancho=document.getElementById('interaccion').clientWidth;
	var alto=document.getElementById('interaccion').clientHeight;
	var anchoImg=document.getElementById('personaje').clientWidth;
	var altoImg=document.getElementById('personaje').clientHeight;
	document.getElementById("personaje").style.marginTop =((alto/2)-(altoImg/2))+"px";
	document.getElementById("personaje").style.marginLeft =((ancho/2)-(anchoImg/2))+"px";
}
function asignarPosicion(){	
	var left= Math.floor(Math.random()*((document.getElementById("interaccion").clientWidth)-(document.getElementById("personaje").clientWidth)-10));
	var top= Math.floor(Math.random()*471);
	return [top,left];
}
function sobrepone(id){
	var colision=false;
	for (var i = 0; i < palabras.length; i++) {
		if (colisiona(id,palabras[i])){
			return true;
		}
	}
	return false;
}
function generarImagen(url,id,palabras){
	document.getElementById("personaje").style.border = "1px solid #0000FF";
	var imagen = document.createElement('img');
	imagen.setAttribute("id",id);
	imagen.setAttribute("class","cuadrante");
	imagen.setAttribute("src",url);
	document.getElementById("interaccion").appendChild(imagen);
	document.getElementById(id).style.border = "1px solid #0000FF";
	posicion=asignarPosicion();
	document.getElementById(id).style.marginTop = posicion[0] + "px";
	document.getElementById(id).style.marginLeft = posicion[1] + "px";
	while(sobrepone(id)){
		posicion=asignarPosicion();
		document.getElementById(id).style.marginTop = posicion[0] + "px";
		document.getElementById(id).style.marginLeft = posicion[1] + "px";		
	}
	document.getElementById(id).style.position = "absolute";
}
function cargarJson(){
	$.ajax({
		url: 'http://reto.anglus.co/data.json', 
		dataType:"json",
		success: function (data) {
			for (i=0; i<data["words"].length; i++){
				generarImagen(data["words"][i]["image"],data["words"][i]["name"]);
				palabras.push(data["words"][i]["name"]);
			}
			var index=palabras.indexOf("personaje");
			palabras.splice(index,1);
			palabraAleatoria(document.getElementById('animal').innerHTML);

		},
		error:function (e) {
			console.log(e);
		}
	});
}
function castear(pos){
	posicion=(pos.split("px"))[0];
	return parseFloat(posicion);
}
function inicializar(){
	ubicarPersonaje();
	cargarJson();
}
function aliminarAnimal(imagen){
	var node = document.getElementById(imagen);
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
	var index=palabras.indexOf(imagen);
	palabras.splice(index,1);
}
function mover(e)	{
	if (!estado) {
		var num = e?e.keyCode:event.keyCode;
		var objeto= document.getElementById("personaje");
		var pos=0;
		switch(num) {
	    case 37:
			pos=objeto.style.marginLeft;
	        posicion=castear(pos); 
	        console.log(posicion);
	        if (posicion>0) {       
			    posicion=(posicion)-8.0;
			    objeto.style.marginLeft=posicion+"px";
		    }    		
	        break;
	    case 38:
	    	pos=objeto.style.marginTop;
	        posicion=castear(pos);
	        if (posicion-8>0) {
		        posicion=(posicion)-8.0;
		        objeto.style.marginTop=posicion+"px";        	
	        };      
	        break;
	    case 39:
	    	pos=objeto.style.marginLeft;
	        posicion=castear(pos);
	        anchoContenedor=(document.getElementById('interaccion').clientWidth);        
	    	if ((posicion+8)<(anchoContenedor)-(document.getElementById("personaje").width)) {
		        posicion=(posicion)+8.0;
		        objeto.style.marginLeft=posicion+"px";		
	    	};
	        break;
	    case 40:
	    	pos=(objeto.style.marginTop);
	        posicion=castear(pos); 
	        if (((posicion + 8)+document.getElementById("personaje").height)<document.getElementById('interaccion').clientHeight) {
		        posicion=(posicion)+8.0;
		        objeto.style.marginTop=posicion+"px";        	
	        };
	        break;
		}

		for (var i = 0; i < palabras.length; i++) {
			if(colisiona("personaje",palabras[i])){	


				if (palabras[i]== document.getElementById("animal").innerHTML) {
					document.getElementById("obtenidos").innerHTML="+10";
					setTimeout(function () {
						document.getElementById("obtenidos").innerHTML="0";
						document.getElementById("total").innerHTML=parseInt(document.getElementById("total").innerHTML)+10;
						aliminarAnimal(palabras[i]);
						if (palabras.length>0) {
							palabraAleatoria(document.getElementById('animal').innerHTML);
						}else{
							document.getElementById("animal").innerHTML="GANÓ :)";
							crearBotonReinicio();
							estado=true;
						}
					}, 1000);
				}else{
					if ((parseInt(document.getElementById("total").innerHTML)-10)>=0) {
						document.getElementById("obtenidos").innerHTML="-10";
						setTimeout(function () {
							document.getElementById("obtenidos").innerHTML="0";
							document.getElementById("total").innerHTML=parseInt(document.getElementById("total").innerHTML)-10;
						}, 1000);					
					}else{
						document.getElementById("animal").innerHTML="PERDIÓ";
						crearBotonReinicio();
						estado=true;
					}
				}					

				posicion=asignarPosicion();
				document.getElementById("personaje").style.marginTop = posicion[0] + "px";
				document.getElementById("personaje").style.marginLeft = posicion[1] + "px";
				while(sobrepone("personaje")){
					posicion=asignarPosicion();
					document.getElementById("personaje").style.marginTop = posicion[0] + "px";
					document.getElementById("personaje").style.marginLeft = posicion[1] + "px";		
				}
				break;
			}
		}
	}
}
function crearBotonReinicio(){
	var boton = document.createElement('button');
	boton.setAttribute("id","reiniciar");
	boton.setAttribute("onclick","reiniciar()");
	document.getElementById("encabezado").appendChild(boton);
	document.getElementById("reiniciar").innerHTML="Reiniciar";
}
function palabraAleatoria(anterior){
	var posicion=Math.floor(Math.random()*((palabras.length)));
	while(anterior==palabras[posicion]){
		posicion=Math.floor(Math.random()*((palabras.length)));
	}
	document.getElementById('animal').innerHTML = palabras[posicion];
}
function reiniciar(){
	location.reload();
}
document.onkeydown = mover;
if(document.all)
	document.captureEvents(Event.KEYDOWN);	