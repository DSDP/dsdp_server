var fs       = require('fs');
module.exports  =  { 

    uploadFile: function (req, res, dirname) {
        var infiles  = 0
        var outfiles = 0;
        var done     = false;
        var errors   = new Array();

        req.busboy.on('file', function (fieldname, file, filename) {
            infiles++;

            onFile(fieldname, file, filename, dirname, function(err) {
                outfiles++;

                if(err){
                    errors.push(err)
                }

                if (done && infiles === outfiles) {
                    if(errors.length > 0){
                        console.log(errors);
                        res.status(500).json(errors)
                    }else{
                        console.log("All Files Uploaded");
                        res.status(200).json("{ result: 'All files uploaded' }")
                    }
                }
            });
        });

        req.busboy.once('finish', function() { done = true });
        req.pipe(req.busboy);
    }

};

function onFile(fieldname, file, filename, dirname, next) {
    var fstream = fs.createWriteStream(dirname + '/files/' +  filename);

    fstream.on('error', function(err) {
        file.unpipe();
        next(err);
    });

    fstream.once('close', function() {
        console.log("Upload Finished of " + filename);             
        next();
    });

    console.log("Uploading: " + fieldname + " " + filename);
    file.pipe(fstream);
 }