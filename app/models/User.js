schema = {
    user: {
        id: null,
        fullname: null,
        email: null,
        token: null
    }
}
var User = function (data) {
    this.data = this.sanitize(data);
}

User.prototype.sanitize = function (data) {
data = data || {};
uschema = schema.user;
return uschema; 
}

module.exports = User;