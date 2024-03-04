import express from 'express';
import { db } from '../config';
import { userLogin, onAuthorFollow, userRegister, userDetails, updateUsername, deleteUser, createCollection, getUserCollections } from '../controllers/userControllers';
import { allPosts, userPosts, createPost, updatePost, deletePost, getPostById, totalLikesNComment, onPostAction, addPostToCollection } from '../controllers/postController';
import { uploadFile } from '../controllers/fileController';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
router.post('/upload_file', upload.single('image'), uploadFile);

// User routes
router.post('/login', userLogin);
router.post('/register', userRegister);
router.put('/update', updateUsername);
router.delete('/delete', deleteUser);
router.get('/user-details', userDetails);
router.get('/get-collections', getUserCollections);
router.post('/create-collection', createCollection);

// Posts routes
router.get('/get-all-posts', allPosts);
router.get('/get-posts', userPosts);
router.get('/get-post-by-id', getPostById);
router.post('/create-post', createPost);
router.put('/update-post', updatePost);
router.delete('/delete-post', deletePost);

router.get('/get-post-likes-comments', totalLikesNComment);
router.post('/follow-author', onAuthorFollow);

router.post('/add-post-to-collection', addPostToCollection);

router.post('/on-post-action', onPostAction);
router.put('/on-post-action', onPostAction);
router.delete('/on-post-action', onPostAction);

export default router;
