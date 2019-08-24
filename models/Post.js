const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const Schema = mongoose.Schema;

const PostSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    title: {
        type : String,
        required : true,
        minlength : 1,
    },
    status: {
        type : String,
        default : 'public'
    },
    allowComments: {
        type : Boolean,
        require : true
    },
    body: {
        required : true,
        type : String
        
    },
    file: {
        type : String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    slug: {
        type: String
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]
    //Square brackets for the array of comments


}, {usePushEach: true});
PostSchema.plugin(URLSlugs('title',{field: 'slug'}));
module.exports = mongoose.model('posts', PostSchema);
