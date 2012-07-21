
var mongoose= require('mongoose')
, Schema= mongoose.Schema
, ObjectId= Schema.ObjectId;

var User= new Schema({
    fbid: {type: String, index: {unique: true}},
    username: {type: String},
    name: {type: String}
});

var Action= new Schema({
    viewer_id: String,
    viewed_id: String,
    view_type: Number,// 0 is image, 1 is profile page
    view_id: String,
    timestamp: {type: Date, default: new Date()}
});

mongoose.model("User", User);
mongoose.model("Action", Action);
