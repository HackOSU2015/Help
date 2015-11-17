var express = require('express');
var router = express.Router();
var levv = require('levenshtein');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test3');
var MaladySchema = new mongoose.Schema({
	name: String,
	hospitalIds: [Number]
});

function isNumber(obj) { return !isNaN(parseFloat(obj)) }



var HospitalSchema = new mongoose.Schema({

	hospitalName: String,
	hospitalId: Number,
	overallRating: Number,
	numRatings: Number,
	description: String,
	tags: [{tagName:String, rating:Number, numRatings: Number}],
	reviews: []
});
var Hospital = mongoose.model('Hospital', HospitalSchema);

var Malady = mongoose.model('Malady', MaladySchema);


router.get('/', function (req, res) {
	var input_malady_name = req.param('malady');
	//var malady = new Malady({name: malady_name, id: 2, hospitalIds: [12, 2]});
	Malady.find({}).exec(function(err, result) {
		if (!err) {
			var json_res = result;//JSON.stringify(result, undefined, 2);

			var list = json_res
			var matching_mals = []
			for(index in list)
			{
			    var obj = list[index];
			    var name = obj["name"];
			    //console.log(name);
			    var lev = new levv( input_malady_name, name );
			    //console.log(lev.distance);
			    
			    if( lev.distance < 6)
			    {
			    	matching_mals.push([obj, lev.distance]);
			    	console.log(name);
			    }

			}
			//res.json(matching_mals);
			matching_mals.push([obj, lev.distance]);
			//sorting the matching maladies in ascending order of lev distance
			matching_mals.sort(function(a,b){return a[1]-b[1]});
			console.log("hello2");
			console.log(matching_mals);
			//get top 3 tags from matching_mals, i.e. with the least lev distance
			var NUM_TAGS_TO_RETURN = 3;
			var top_3_mals = [];
			for(i=0;i<NUM_TAGS_TO_RETURN;i++){
				console.log("whats up");
				console.log(matching_mals[i][0]);
				console.log(matching_mals[1]);
				top_3_mals.push(matching_mals[i][0]);
				console.log(matching_mals[1]);
			}
			console.log("hello");
			console.log(top_3_mals);
			//get the top 3 hospitals associated with each of the 3 tags
			var unique_hosp_ids = [];
			for(obj_i in top_3_mals){
				var mal_obj = top_3_mals[obj_i];
				console.log("hi");
				console.log(require('util').inspect(mal_obj, true, 10));
				var hosp_id_list = mal_obj.hospitalIds;
				console.log(hosp_id_list);

				for (hosp_idx in hosp_id_list){
					var hosp_idd = hosp_id_list[hosp_idx];
					console.log("hosp_id");
					console.log(hosp_idd);
					//if(!( hosp_idd in unique_hosp_ids)){
					if(isNumber(hosp_idd)){
						unique_hosp_ids.push(hosp_idd);// = true;	
					}
					
					//}
				}
			}
			console.log(unique_hosp_ids);
			final_res = []
			for (key in unique_hosp_ids){
				console.log("key");
				console.log(unique_hosp_ids[key]);
				
	
			}

			console.log(JSON.stringify(unique_hosp_ids));
			Hospital.find({hospitalId: {$in: unique_hosp_ids } }).exec(function(err, hosp_result) {
					console.log(JSON.stringify(unique_hosp_ids[0]));
					console.log("bye");
					console.log(JSON.stringify(hosp_result));
					//final_res.push(hosp_result);
					console.log()
					console.log("byeeee");
					//console.log(JSON.stringify(final_res));
					res.json(hosp_result);
			});
			


			//get the unique set of hospitals from this list of 9 hospitals and return a list of [hospObj, top_3_matching_tags]


			//res.send(JSON.stringify(final_res));
		} else{
			res.send("ERROR!");
		}
	});
	/*malady.save(function(err){
		if(err)
			console.log(err);
		else
			console.log(malady);
	});
*/


	//res.send("You have " + malady_name + "\n It is now stored!");
});

module.exports = router;