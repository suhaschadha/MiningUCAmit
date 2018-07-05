// app/routes.js
var mongojs = require('mongojs');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var dbUrl = require("../config/db");
var moment = require('moment');


module.exports = function (app) {
    app.post('/authenticate', function (request, response) {
        var db = mongojs('mongodb://127.0.0.1:27017/MiningExploration', ['MiningUsers']);
        db.MiningUsers.findOne({ EMailID: 'geo@gmail.com' }, function (err, doc) {
            if (doc.EMailID == request.body.emailid && doc.password == request.body.password) {
                //Create token and login the user
                var jwt = require("jsonwebtoken");
                var NewUser = {
                    id: 1,
                    fullname: doc.fullname,
                    email: doc.EMailID,
                    token: null
                }

                NewUser.token = jwt.sign(NewUser, NewUser.email, { expiresIn: 60 * 60 });
                response.json({
                    type: true,
                    data: NewUser,
                    token: NewUser.token
                });
            }
        });
          db.MiningUsers.findOne({ EMailID: 'mining@gmail.com' }, function (err, doc) {
            if (doc.EMailID == request.body.emailid && doc.password == request.body.password) {
                //Create token and login the user
                var jwt = require("jsonwebtoken");
                var NewUser = {
                    id: 1,
                    fullname: doc.fullname,
                    email: doc.EMailID,
                    token: null
                }

                NewUser.token = jwt.sign(NewUser, NewUser.email, { expiresIn: 60 * 60 });
                response.json({
                    type: true,
                    data: NewUser,
                    token: NewUser.token
                });
            }
        });
    });

    app.post('/signin', function (req, res) {
        User.findOne({ email: req.body.email, password: req.body.password }, function (err, user) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                    res.json({
                        type: false,
                        data: "User already exists!"
                    });
                } else {
                    var userModel = new User();
                    userModel.email = req.body.email;
                    userModel.password = req.body.password;
                    userModel.save(function (err, user) {
                        user.token = jwt.sign(user, process.env.JWT_SECRET);
                        user.save(function (err, user1) {
                            res.json({
                                type: true,
                                data: user1,
                                token: user1.token
                            });
                        });
                    })
                }
            }
        });
    });

    app.get('/me', ensureAuthorized, function (req, res) {
        User.findOne({ token: req.token }, function (err, user) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                res.json({
                    type: true,
                    data: user
                });
            }
        });
    });

    app.get('/projects', ensureAuthorized, function (req, res) {
        
        var UData = {AllUsers:{},UserTypes: {}};
        var db = mongojs('mongodb://127.0.0.1:27017/MiningDB', []);
        db.Projects.find(function (err, docs) {
            res.json(docs);
        });
    });

    app.get('/entity', ensureAuthorized, function (req, res) {
        
        var UData = {AllUsers:{},UserTypes: {}};
        var db = mongojs('mongodb://127.0.0.1:27017/MiningDB', []);
        db.DropDown.find(function (err, docs) {
            res.json(docs);
        });
    });

    app.get('/projects/:id', ensureAuthorized,function (req, res) {
        var id = req.params.id;
        var db = mongojs('mongodb://127.0.0.1:27017/MiningDB', ['Projects']);
        db.Projects.findOne({ _id: mongojs.ObjectId(id) }, function (err, doc) {
            res.json(doc);
        });
    });

    app.post('/projects', ensureAuthorized, function (req, res) {
        var db = mongojs('mongodb://127.0.0.1:27017/MiningDB', ['Projects']);
        db.Projects.insert(req.body, function (err, docs) {
            res.json(docs);
        });
    });

    app.put('/projects/:id', ensureAuthorized,function (req, res) {
        var id = req.params.id;
        var db = mongojs('mongodb://127.0.0.1:27017/MiningDB', ['Projects']);
        db.Projects.findAndModify({
            query: { _id: mongojs.ObjectId(id) },
            update: { $set: { projectname: req.body.projectname, projecttype: req.body.projecttype, projectdesc: req.body.projectdesc } },
            new: true
        }, function (err, doc) {
           if (err)
            { console.log(" Woops! The error took place here... "); }
            else
            { res.json(doc); }
        }
        );
    });

    app.delete('/projects/:id', ensureAuthorized,function (req, res) {
        var id = req.params.id;
        var db = mongojs('mongodb://127.0.0.1:27017/MiningDB', ['Projects']);
        db.Projects.remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
            if (err)
            { console.log(" Woops! The error took place here... "); }
            else
            { res.json(doc); }

        });
    });

    app.get('/fileDetails', ensureAuthorized, function (req, res) {
        
        //var mongoose = require('mongoose');
        //mongoose.connect('mongodb://127.0.0.1:27017/gridfstest');
        //var conn = mongoose.connection;
        //var multer = require('multer');
        //var GridFsStorage = require('multer-gridfs-storage');
        //var Grid = require('gridfs-stream');
        //Grid.mongo = mongoose.mongo;
        //var gfs = Grid(conn.db);
        
        //gfs.collection('ctFiles');
        //gfs.collection('ctFiles').find().toArray(function (err, documents) {
        //    console.log(documents.length, 'Total Uploaded files');
        //    //console.log(documents, 'docs');
        //    res.json(documents);
        //});

        var data=[];
        var i=0;
        var db = mongojs('mongodb://127.0.0.1:27017/MiningDB', ['Uploaded','Projects']);
            db.Uploaded.find().count(function (err, count) {
            db.Uploaded.find().forEach(function (err, DocM) {
                if (DocM) {
                    db.Projects.findOne({ _id: mongojs.ObjectId(DocM.project) }, function (err, DocD) {
                        DocM.project = DocD.projectname;
                        data.push(DocM);
                        i = i + 1;
                        if (i == count) {
                            res.json(data);
                        }
                    });
                }
            });
        });


        /*var collection = db.collection('Uploaded');
        console.log(collection, 'coll');
        collection.find(function (err, docs) {
            console.log(docs.length, 'Total Uploaded files');
            res.json(docs);
        });*/


    });

    app.delete('/filelist/:id', function (req, res) {


        var collection = db.collection('ctFiles.files');
        var id = req.params.id;
        console.log(id, 'id')
        collection.remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
            res.json(doc);
        });

    });

    app.post('/saveshipmentconversion/', uploadfile.array('file', 12), function (req, res, next) {
        var miningcompanyid = req.params.id;
        var myFiles = req.files;
        var ShipMentFiles = {};
        var files = [];
        ShipMentFiles.files = files;
        //var datetime = JSON.stringify(new Date());
        var date=moment().format("DD MMM YYYY");
        console.log(date);
        //var date=datetime.substring(1,11);
        var filesizelong = (myFiles[0].size)/1048576;
        var filesize = filesizelong.toFixed(2);
        //Get the files hash 
        var hash = require("../config/hash");
        for (var i = 0; i <= myFiles.length - 1; i++) {
            //siz = req.files[i].size;
            hash.generateFileHash('./Uploads/' + myFiles[i].originalname, myFiles[i].originalname, function (hashcode, filename,size) {
                var file = {
                    "filename": filename,
                    "filehash": hashcode
                }
                ShipMentFiles.files.push(file);
                if (ShipMentFiles.files.length == myFiles.length) {
                    var NewShipment = {
                        fileid: req.body.fileid,
                        location: req.body.location,
                        entitytype: req.body.entitytype,
                        project: req.body.project,
                        shipmentfiles: ShipMentFiles,
                        date:date,
                        size:filesize
                    };
                    var db = mongojs(dbUrl.url, ['Uploaded']);
                    db.Uploaded.insert(NewShipment, function (err, docs) {
                        var CreateJSONString = require("../config/CreateJSON");
                        CreateJSONString.CreateJSONMining(docs, function (JSONData) {
                       //     var hash = require("../config/hash");
                         //   hash.GetHASHforString(JSON.stringify(JSONData), function (hashcode) {
                                var contract = require('../config/contract');
                                var ShipmentID = JSONData.id;
                                console.log(JSONData.id);
                                contract.saveData(ShipmentID, hashcode, function (result) {
                                        if (result == "Saved") {//Change the status of the stock
                                            console.log("Contract Saved.");
                                            res.redirect('http://localhost:3002/');
                                        }
                                });
                            });
                       // });
                    });
                }
            });
        }
    });

   app.get('/fabricationshipmentdetail/:id', ensureAuthorized, function (req, res) {
        var data = [];
        var ShipmentId = req.params.id;
        var hash = require("../config/hash");
        var contract = require('../config/contract');
        var db = mongojs(dbUrl.url, ['Uploaded', 'Projects','DropDown']);
        db.Uploaded.findOne({ _id: mongojs.ObjectId(ShipmentId) }, function (err, DocM) {
           // hash.GetHASHforString(JSON.stringify(DocM), function (hashcode) {
              //  contract.getData(ShipmentId, function (result) {
                    db.Projects.findOne({ _id: mongojs.ObjectId(DocM.project) }, function (err, DocD) {
                        //data.push(JSON.parse(result[0]));
                        //DocM.hashcode = result[0];
                        DocM.project = DocD.projectname;
                        db.DropDown.findOne({ _id: mongojs.ObjectId(DocM.entitytype) }, function (err, DocE) {
                        DocM.entitytype = DocE.dropdownname;
                        data.push(DocM);
                        res.json(data);
                         });
                    });
             //   });
           // });

        });
    });

        app.get('/download/:id/:filename', ensureAuthorized, function (req, res) {
        var id = req.params.id;
        var filepath = '';
        filepath = './Uploads/' + req.params.filename;
        //Get the HASH Code of downlading file and compare with the one in chain
        var hash = require("../config/hash");
        hash.generateFileHash(filepath , req.params.filename, function (hashcode, filename) {
            //get the hash code form BC
            var contract = require('../config/contract');
            contract.getData(id, function (result) {
                if (result != undefined) {
                    //var files = JSON.parse(JSON.parse(result[0]).shipmentfiles);
                    var fil = JSON.parse(result[0]);
                 //   var file = JSON.parse(fil).shipmentfiles;
                 //   var files = JSON.parse(file);
                   // for (var i = 0; i <= files.files.length - 1; i++) {
                       // if (files.files[i].filename == req.params.filename) {
                           // if (files.files[i].filehash == hashcode)
                           if (fil == hashcode)
                            { res.json({ 'data': 'OK', 'filename': req.params.filename}); }
                            else {
                                res.json({ 'data': 'The file is corrupt.' });
                            }
                     //   }

                   // }

                }
            });
        });
    });

        app.get('/downloadfile/:filename', function (req, res) {
        var filepath ='';
        filepath = '/Uploads/' + req.params.filename;
        var filename = req.params.filename;
        var appDir = path.dirname(filename);
        var file = appDir + filepath;
        var mimetype = mime.lookup(file);
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);
        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
    });


};

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var uploadfile = multer({ storage: storage });