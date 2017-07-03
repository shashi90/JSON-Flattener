var multer = require('multer');
var fs = require('fs-extra');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
    	var dest = './public/input_json_files/';
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        var timestamp = Date.now();
        var filename = file.originalname.substring(0, file.originalname.lastIndexOf('.'))
        //cb(null, file.originalname);
        cb(null, filename + '-' + timestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

var upload = multer({
    storage: storage
}).single('file');


var flattener = function(jsonObj, objName) {
	var type = getType(jsonObj);

}

var flattenObject = function(iJson) {
	var result = {};
	var restId;
    function recurse (cur, prop, index) {
        if (Array.isArray(cur)) {
             for(var i=0, l=cur.length; i<l; i++) {
				if(cur[i].id) {
					restId = cur[i].id;
				}
                recurse(cur[i], prop, i);
			 }
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
				if(cur[p].constructor.name === 'Array' || cur[p].constructor.name === 'Object') {
					if(!result[prop ? prop+"_"+p : p]) {
						result[prop ? prop+"_"+p : p] = [];
					}
					recurse(cur[p], prop ? prop+"_"+p : p, index);
				} else {
					if(result[prop]) {
						if(result[prop][index]) {
							result[prop][index][p] = cur[p];
						} else {
							result[prop][index] = {
								__index: index,
								id: restId,
							};
							result[prop][index][p] = cur[p];
						}
					}
				}
				
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(iJson, "", 0);
    return result;
};

module.exports = function(app) {
	app.get("/json_flattener", function(req, res){
		return res.render('flattener');
	});

	app.post('/json/upload', upload, function(req, res) {
		fs.readJson(req.file.path, function(err, outputObj) {
		  	if (err) console.error(err);
		  	var outputJson = flattenObject(outputObj);
		  	var timestamp = Date.now();
		  	var jsonFiles = [];
		  	for (var k in outputJson) {
		  		var file = './public/output_json_files/' + timestamp + "/" + k + ".json";
		  		fs.outputFile(file, JSON.stringify(outputJson[k], null, 4), function(er) {
		  			console.log(er);
		  		});
		  		jsonFiles.push({path:file.slice(8), name: k + ".json"});
		  	}
		  	return res.json({status: 1, jsonObj: outputJson, jsonFiles: jsonFiles});
		})
    });

    app.post("/flatten", function(req, res){
    	return res.json({status: 1, jsonObj: flattenObject(req.body)});
    })
}