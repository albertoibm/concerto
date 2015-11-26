
// If Caman is executed the <img> block will turn into a canvas and it won't be possible to change the image again. So Caman has to be executed after the image is dropped.
// readAsDataURL needs an object as an argument, if you give it the filename it doesn't work. dataTransfer.files[0] is an object of the type file and it can be given as an argument to refered function.
// $('#image') didn't work. it said $ is not defined
// elementbyid().attr didn't work because the method doesn't exist, so the attribute src is changed directly instead
// After the image is loaded (.src = ...) it is then processed by caman and rendered, thus converting <img> into a canvas
function analize(ev){
	console.log("Finding canvas element");
	var canvas = document.getElementById("image");
	var context = canvas.getContext("2d");
	console.log("Getting image pixels");
	var img = context.getImageData(0,0,canvas.width,canvas.height);
	console.log("Creating neural network");
	var analizer = new NN([3, 5, 1]);
	analizer.defaultTraining();
	var total = 0;
	console.log(analizer.feedforward([32,34,150]));
	for(var i = 0; i < img.data.length; i += 4){
		r = img.data[i];
		g = img.data[i+1];
		b = img.data[i+2];
		res = analizer.feedforward([r,g,b])[0];
		
		if( res > 0.2){
			img.data[i] = 200;
			img.data[i+2] = 200;
			total++;
		}
	}
	console.log(res);
	context.putImageData(img, 0, 0);
	
	alert((100.0*total/(img.width*img.height))+"% of the image matches the description");
}
var topLeft, bottomRigth;
function crop(canvas, topLeft, bottomRight){
//	var img = canvas.getAttirbute("data");
	var context = canvas.getContext("2d");
	var imgCrop = context.getImageData(topLeft.x, topLeft.y, bottomRight.x, bottomRight.y);
	canvas.setAttribute("width", bottomRight.x - topLeft.x);
	canvas.setAttribute("height", bottomRight.y - topLeft.y);
	context.putImageData(imgCrop, 0, 0);
}

function getBottomRight(element, ev){
	bottomRight = getMousePos(element, ev);
	element.removeAttribute("onclick");
	crop(element, topLeft, bottomRight);
}

function getTopLeft(element, ev){
	topLeft = getMousePos(element, ev);
	alert("Now click to get the bottom-right corner to crop");
	element.setAttribute("onclick","getBottomRight(this, event)");
}
function prepareCrop(ev){
	var canvas = document.getElementById("image");
	canvas.setAttribute("onclick","getTopLeft(this, event)");
	alert("Click on the image to get the top-left corner to crop");
}
function getMousePos(element, ev){
	var el = element.getBoundingClientRect();
	return {x:ev.clientX - el.left - 10, y:ev.clientY - el.top - 10};
}
function showMenu(){
	var controls = document.getElementsByClassName("controls");
	for(i = 0; i < controls.length; i++){
		controls[i].style.opacity = 1.0;
		controls[i].style.visibility = "visible";
	}
}
function hideMenu(){
	var controls = document.getElementsByClassName("controls");
	for(i = 0; i < controls.length; i++){
		controls[i].style.opacity = 0.0;
		controls[i].style.visibility = "hidden";
	}

}
function canvas_load(src){
	var canvas = document.getElementById('image');
	var context = canvas.getContext('2d');
	var img = new Image();
	var scale = 1;
	var maxwidth = 640;
	img.onload = function() {
		if(this.width > maxwidth){
			scale = maxwidth / this.width;
		}
		context.drawImage(this, 0, 0, this.width * scale, this.height * scale);
	};
	img.src = src;
	scale = 1;
	if(img.width > maxwidth) scale = maxwidth / img.width;
	canvas.setAttribute("width", scale * img.width );
	canvas.setAttribute("height", img.height * scale);
	canvas.setAttribute("scale", scale);
}
function undisplay(ev){
	canvas_load("noimage.jpg");
	hideMenu();
}
function display(f){
	canvas_load("loading_spinner.gif");
	if(f.type.substring(0,5)=='image'){
		var fopen = new FileReader();
		fopen.onload = function(ev2){
			canvas_load(ev2.target.result);
		};
		fopen.readAsDataURL(f);
		showMenu();
	}else{
		canvas_load("noimage.jpg");
		alert("That is not an image file");
	}
}
function load(ev){
	var f = ev.target.files[0];
	display(f);
}
function drop(ev){
	ev.preventDefault();
	var f = ev.dataTransfer.files[0];
	var inputfile = document.getElementById('file');
	inputfile.files[0] = f;
	display(f);
}
function drag(ev) {
	undisplay();
	console.log("Drag");
    ev.preventDefault();
}
