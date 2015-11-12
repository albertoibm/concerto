
// If Caman is executed the <img> block will turn into a canvas and it won't be possible to change the image again. So Caman has to be executed after the image is dropped.
// readAsDataURL needs an object as an argument, if you give it the filename it doesn't work. dataTransfer.files[0] is an object of the type file and it can be given as an argument to refered function.
// $('#image') didn't work. it said $ is not defined
// elementbyid().attr didn't work because the method doesn't exist, so the attribute src is changed directly instead
// After the image is loaded (.src = ...) it is then processed by caman and rendered, thus converting <img> into a canvas
Caman.DEBUG = ('console' in window);
function analize(){
	Caman("#image",function(){
		this.channels({
			green: 80
		});
		this.render();
	});
}
function chksz(img){
	console.dir(img);
	var scale;
	var maxwidth = 400;
	if(img.width > maxwidth){
		scale = maxwidth/img.width;
		img.width *= scale;
//		img.height *= scale;
		console.dir(scale);
	}
}
function undisplay(ev){
	var img = document.getElementById('image');
	img.src = "noimage.jpg";
//	img.width = 320;
//	img.height = 320;
}
function display(f){
	var previmg = document.getElementById('image').src;
	document.getElementById('image').src="loading_spinner.gif";
	if(f.type.substring(0,5)=='image'){
		var fopen = new FileReader();
		fopen.onload = function(ev2){
			document.getElementById('image').src=ev2.target.result;
		};
		fopen.readAsDataURL(f);
	}else{
		document.getElementById('image').src = previmg;
		alert("That is not an image file");
	}
}
function load(ev){
	var f = ev.target.files[0];
	display(f);
}
function drop(ev){
	ev.preventDefault();
	var dropcage = document.getElementById('div1');
	var f = ev.dataTransfer.files[0];
	var inputfile = document.getElementById('file');
	inputfile.files[0] = f;
	display(f);
	dropcage.style.visibility = 'hidden';
}
function drag(ev) {
//    alert('felt it!');
    ev.preventDefault();
    var dropcage = document.getElementById('div1');
	dropcage.style.top = 200 + window.pageYOffset + "px";
//    console.dir(dropcage);
    dropcage.style.visibility = 'visible';
}
function nodrag(ev){
	ev.preventDefault();
	document.getElementById("div1").style.visibility = "hidden";
}
