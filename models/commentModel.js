// models/commentModel.js

const mongoose = require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

const commentSchema = mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Post',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        comment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
commentSchema.plugin(mongooseAggregatePaginate)

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
