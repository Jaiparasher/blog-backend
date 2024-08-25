// routes/postRoutes.js

const express = require('express');
const { 
    getPosts, 
    getPostById, 
    createPost, 
    updatePost, 
    deletePost, 
    searchPosts 
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware');

const router = express.Router();

router.get('/search', searchPosts);

router.route('/')
    .get(getPosts)
    .post(protect,upload.single("photo"), createPost);

router.route('/:id')
    .get(getPostById)
    .put(protect, updatePost)
    .delete(protect, deletePost);



module.exports = router;
