var Matrix = function Matrix(a,b){
	this.values = numeric.random([a,b])
}
var NN = function NN(sizes){
	this.layers = sizes.length;
	this.biases = [];
	this.weights = [];
	for(i = 0; i < sizes.length - 1; i++){
		this.biases = this.biases.concat(numeric.random([1,sizes[i+1]]));
		this.weights = this.weights.concat(new Matrix(sizes[i+1],sizes[i]));
	}
	this.sigmoid = function(z){
		return numeric.div(1,numeric.add(1,numeric.exp(z)));
	}
	this.feedforward = function(a){
		for(i = 0; i < this.layers - 1; i++){
			tmp = []
			a = this.sigmoid(numeric.add(numeric.dot(this.weights[i].values,a),this.biases[i]));
		}
		return a;
	}
}
