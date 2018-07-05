// app/routes.js

var mongojs = require('mongojs');
module.exports = function (app) {
    
    app.get('/users', ensureAuthorized, function (req, res) {
        var UData = {AllUsers:{},UserTypes: {}};
        var db = mongojs('mongodb://127.0.0.1:27017/MiningExploration', []);
        db.MiningUsers.find({},{password: 0},function (err, docs) {
           UData.AllUsers = docs;
        });
        db.DropDown.find({"dropdowntype":"User"},function (err, docs) {
           UData.UserTypes = docs;
           res.json(UData);
        });
    });

    app.get('/users/:id', ensureAuthorized,function (req, res) {
        var id = req.params.id;
        var db = mongojs('mongodb://127.0.0.1:27017/MiningExploration', ['MiningUsers']);
        db.MiningUsers.findOne({ _id: mongojs.ObjectId(id) }, function (err, doc) {
            res.json(doc);
        });
    });

    app.post('/users', ensureAuthorized, function (req, res) {
        var db = mongojs('mongodb://127.0.0.1:27017/MiningExploration', ['MiningUsers']);
        db.MiningUsers.insert(req.body, function (err, docs) {
            res.json(docs);
        });
    });

    app.put('/users/:id', ensureAuthorized,function (req, res) {
        var id = req.params.id;
       var db = mongojs('mongodb://127.0.0.1:27017/MiningExploration', ['MiningUsers']);
        db.MiningUsers.findAndModify({
            query: { _id: mongojs.ObjectId(id) },
            update: { $set: { EMailID: req.body.EMailID, fullname: req.body.fullname, type: req.body.type } },
            new: true
        }, function (err, doc) {
           if (err)
            { console.log(" Woops! The error took place here... "); }
            else
            { res.json(doc); }
        }
        );
    });

    app.delete('/users/:id', ensureAuthorized,function (req, res) {
        var id = req.params.id;
       var db = mongojs('mongodb://127.0.0.1:27017/MiningExploration', ['MiningUsers']);
        db.MiningUsers.remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
            if (err)
            { console.log(" Woops! The error took place here... "); }
            else
            { res.json(doc); }

        });
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