var mongoose = require('mongoose');

var fs = require('fs');
mongoose.connect('mongodb://localhost/test3');
var MaladySchema = new mongoose.Schema({
	id: Number,
	name: String,
	hospitalIds: [Number]
});
var Malady = mongoose.model('Malady', MaladySchema);
var array = fs.readFileSync('../dataset/tags.txt').toString().split("\n");
var idx = 1;
for(i in array) {
    
    console.log();

    var malady = new Malady({name: array[i], hospitalIds: [Math.floor((Math.random() * 10)), Math.floor((Math.random() * 10))]});

	malady.save(function(err){
		if(err)
			console.log(err);
		else
			console.log(malady);
	});

    idx=idx+1;
}