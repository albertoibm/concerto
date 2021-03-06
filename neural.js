console.log("Neural");
exp = Math.exp;
pow = Math.pow;
sigmoidPrime = function(z){
	expz = numeric.exp(numeric.neg(z));
	expzm1=numeric.add(1,expz);
	return numeric.div(expz,numeric.pow(expzm1,2));
}
sigmoid = function(z){
	return numeric.div(1, numeric.add(1,numeric.exp(numeric.neg(z))));
}
var Matrix = function Matrix(a,b){
	this.values = numeric.random([a,b]);
}
var Vector = function Vector(v){
	this.values = v;
}
var NN = function NN(sizes){
	this.layers = sizes.length;
	this.biases = [];
	this.weights = [];
	this.epsilon = -5;
	for(i = 0; i < sizes.length - 1; i++){
		this.biases = this.biases.concat(numeric.random([1,sizes[i+1]]));
		this.weights = this.weights.concat(new Matrix(sizes[i+1],sizes[i]));
	}
	this.feedforward = function(a){
		a = numeric.div(a,255.0);
		for(i = 0; i < this.layers - 1; i++)
			a = sigmoid(numeric.add(numeric.dot(this.weights[i].values,a),this.biases[i]));
		return a;
	}
	this.backpropagate = function(y, d){
		var x = []; //list of vectors x=wy+b
		var ys = [y]; //list of vectors y=sigmoid(x)
		var dw = []; //list of corrections for weights
		var db = []; // list of correctinos for biases
		//feed forward
		for(i = 0; i < this.layers - 1; i++){
			xu = numeric.add( numeric.dot( this.weights[i].values, y), this.biases[i]);
			y = sigmoid( xu );
			ys = ys.concat( Array(y) );
			x = x.concat( Array(xu) );
		}
		//backward pass
		dEdy = numeric.sub(y, d);
		for(i = 0; i < this.layers - 1; i++){
			dEdx = numeric.mul( dEdy, sigmoidPrime(x[x.length-1 - i]));
			dEdw = numeric.dot( numeric.transpose([dEdx]), [ys[ys.length-1 - i -1]]);
			weight = this.weights[this.weights.length-1 - i].values;
			dw = dw.concat({values:numeric.mul(this.epsilon, dEdw)});
			db = db.concat({values:numeric.mul(this.epsilon, dEdx)});
			dEdy = numeric.dot( dEdx, weight);
		}
		return {w:dw, b:db};
	}
	this.learn = function(y, d){
		y = numeric.div(y,255);
		delta = this.backpropagate(y, d);
		for(i = 0; i < this.layers-1; i++){
			this.weights[i].values = (numeric.add(this.weights[i].values, delta.w[this.layers-2 - i].values));
			this.biases[i] = numeric.add(this.biases[i], delta.b[this.layers-2 - i].values);
		}
	}
	this.train = function(positive, negative){
		for(i = 0; i < positive.length + negative.length; i++){
			if(i < positive.length) this.learn(positive[i], 1);
			else this.learn(negative[i-positive.length],0);
		}
	}
	this.filter = function(r,g,b){
		return this.feedforward([r,g,b]) > 0.5;
	}
	this.defaultTraining = function(){
		for(var j=0;j<200;j++){
			this.learn([32, 34, 150],1);
			this.learn([13, 23, 2],0);
			this.learn([150,2,20],0);
			this.learn([123,200,80],0);
			this.learn([0,0,255],1);
			this.learn([255,0,0],0);
			this.learn([0,255,0],0);
			this.learn([255,0,255],0);
			this.learn([0,255,255],0);
			this.learn([255,255,255],0);
			this.learn([100,80,240],1);
		}
	}
}
if(require.main === module){
	// Used fot tests off the browser
	var numeric = require('./numeric-1.2.6');
	var ins = 3, mid = 5, out = 1;
	console.log("Creating new neural network with "+ins);
	console.log("inputs, "+mid+" hidden neurons and");
	console.log(out+" output neurons");
	wa =new NN([ins, mid, out]);
	wa.defaultTraining();	
	console.log("feedforward");
	console.log("Dark Blue "+wa.feedforward([32,34,150]));
	console.log("Red "+wa.feedforward([255,0,0]));
	console.log("Green "+wa.feedforward([0,255,0]));
	console.log("Blue "+wa.feedforward([0,0,255]));
}
