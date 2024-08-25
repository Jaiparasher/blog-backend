// controllers/postController.js

const asyncHandler = require('../utils/asyncHandler');
const Post = require('../models/postModel');
const { uploadOnCloudinary } = require('../utils/cloudinary');
// Get all posts
const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({});
    res.json(posts);
});

// Get post by ID
const getPostById = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        res.json(post);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// Create a new post
const createPost = asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    const photoLocalPath = req.file?.path;
    console.log(req);
    

    if (!photoLocalPath) res.status(404).json("Photo is required")

    const photo = await uploadOnCloudinary(photoLocalPath).catch((error) => console.log(error))
    
    const post = new Post({
        user: req.user._id,
        title,
        content,
        photo:photo.url
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
});

// Update a post
const updatePost = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    const post = await Post.findById(req.params.id);

    if (post) {
        post.title = title || post.title;
        post.content = content || post.content;

        const updatedPost = await post.save();
        res.json(updatedPost);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// Delete a post
const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        // Delete the post
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully' });
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// Search posts

const searchPosts = asyncHandler(async (req, res) => {
    const query = req.query.q; 
    if (!query) {
        res.status(400);
        throw new Error('Search query is required');
    }

    try {
        // Perform the search
        const posts = await Post.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ]
        });

        res.json(posts);
    } catch (error) {
        res.status(500);
        throw new Error('Server Error');
    }
});

module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    searchPosts,
};
