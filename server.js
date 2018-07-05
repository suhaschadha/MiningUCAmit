// Required Modules
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var morgan     = require("morgan");
var mongojs = require('mongojs');

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/MiningExploration');
var conn = mongoose.connection;
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);


var port = process.env.PORT || 3002;
//var db = mongojs('mongodb://127.0.0.1:27017/MiningDB', ['Projects','DropDown','MiningUsers']);

/** Seting up server to accept cross-origin browser requests */
app.use(function (req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);

    next();
});

app.use(express.static(__dirname + '/public')); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./app/routes')(app); 
require('./app/userroutes')(app); 

app.use(morgan("dev"));
//error hadler
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});
process.on('uncaughtException', function(err) {
    console.log(err);
});




/** Setting up storage using multer-gridfs-storage */
/*var storage = GridFsStorage({
    gfs: gfs,
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname);
    },
    /** With gridfs we can store aditional meta-data along with the file */
  /*  metadata: function (req, file, cb) {
        cb(null, { originalname: file.originalname, CreatedBy: 'amit kumar pandey', ModifiedBy: 'amit kumar pandey', Location: 'Delhi India' });
    },
    root: 'ctFiles' //root name for collection to store files into
});

var upload = multer({ //multer settings for single upload
    storage: storage
}).single('file');*/

/** API path that will upload the files */
app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }

        res.json({ error_code: 0, err_desc: null });

    });
});

app.get('/file/:filename', function (req, res) {
    gfs.collection('ctFiles'); //set collection name to lookup into

    /** First check if file exists */
    gfs.files.find({ filename: req.params.filename }).toArray(function (err, files) {
        if (!files || files.length === 0) {
            return res.status(404).json({
                responseCode: 1,
                responseMessage: "error"
            });
        }
        /** create read stream */
        var readstream = gfs.createReadStream({
            filename: files[0].filename,
            root: "ctFiles"
        });
        /** set the proper content type */
        res.set('Content-Type', files[0].contentType)
        /** return response */
        return readstream.pipe(res);

    });
});


// Start Server
app.listen(port, function () {
    console.log( "Express server listening on port " + port);
});