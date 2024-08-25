const express = require('express');
const { 
    createComment, 
    getComments, 
    deleteComment 
} = require('../controllers/commentController'); // Ensure correct path and exports
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, createComment)

router.route('/:id')
    .delete(protect, deleteComment)
    .get(getComments);

module.exports = router;