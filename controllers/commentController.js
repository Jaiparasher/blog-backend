// controllers/commentController.js

const asyncHandler = require('../utils/asyncHandler');
const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const { default: mongoose } = require('mongoose');

// Create a new comment
const createComment = asyncHandler(async (req, res) => {
  const { post, user, comment } = req.body;

  if (!post || !user || !comment) {
      res.status(400);
      throw new Error('Please provide all required fields: post, user, and comment');
  }

  const newComment = new Comment({
      post,
      user,
      comment
  });

  const savedComment = await newComment.save();
  res.status(201).json(savedComment);
});

// Get all comments
const getComments = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    try {
        const commentsAggregate = Comment.aggregate([
            {
                $match: {
                    post: new mongoose.Types.ObjectId(id)
                }
            },{
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $addFields:{
                    user: { $first: "$user"}
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    user: {
                        name:1
                    },
                    comment: 1,
                    createdAt:1
                }
            }
        ]);
    
        const comments = await Comment.aggregatePaginate(
            commentsAggregate
        );
        res.json(comments);
    } catch (error) {
        console.log(error);
    }
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment) {
      // Use findByIdAndDelete to delete the comment
      await Comment.findByIdAndDelete(req.params.id);
      res.json({ message: 'Comment deleted successfully' });
  } else {
      res.status(404);
      throw new Error('Comment not found');
  }
});

module.exports = {
    createComment,
    getComments,
    deleteComment,
};
