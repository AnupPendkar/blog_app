import express from 'express';
import { db } from '../config';
import path from 'path';
import {
  userLogin,
  onAuthorFollow,
  userRegister,
  userDetails,
  updateUsername,
  deleteUser,
  createCollection,
  getUserCollections,
  updateProfileInfo,
  setAboutDetails,
  updateAboutDetails,
  userLogout,
} from '../controllers/userControllers';
import {
  allPosts,
  userPosts,
  createPost,
  updatePost,
  deletePost,
  getPostById,
  totalLikesNComment,
  onPostAction,
  addPostToCollection,
  postComments,
} from '../controllers/postController';
import { uploadFile } from '../controllers/fileController';
import multer from 'multer';
import passport from 'passport';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
router.post('/upload_file', upload.single('image'), uploadFile);

// User routes
router.post('/login', userLogin);
router.post('/logout', userLogout);
router.post('/register', userRegister);
router.put('/update', updateUsername);
router.delete('/delete', deleteUser);
router.get('/user-details', userDetails);
router.get('/get-collections', getUserCollections);
router.post('/create-collection', createCollection);

router.put('/set-about-details', updateAboutDetails);
router.post('/set-about-details', setAboutDetails);

router.put('/update-profile', updateProfileInfo);

// Posts routes
router.get('/get-all-posts', allPosts);
router.get('/get-posts', userPosts);
router.get('/get-post-comments', postComments);
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

router.get('/auth/protected', (req: any, res) => {
  console.log(req.user);
  res.status(200).json({ user: req.user });
});
router.get('/auth/failure', (req, res) => {
  res.send('error happened!!!');
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://10.0.2.15:3200/#/',
    failureRedirect: '/api/auth/failure',
  })
);

export default router;
