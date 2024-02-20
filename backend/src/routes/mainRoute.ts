import express from 'express';
import { db } from '../config';
import { userLogin, userRegister, updateUsername, deleteUser } from '../controllers/userControllers';
import { allPosts, userPosts, createPost, updatePost, deletePost, getPostById } from '../controllers/postController';
import { uploadFile } from '../controllers/fileController';
import multer from 'multer';

const router = express.Router();

router.get('/', async (req, res) => {
  const userData = await db.query.users.findMany({
    with: {
      posts: true,
    },
  });

  const data = userData?.filter((usr) => usr?.posts?.length > 0);

  res.send(data);
});

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

// Posts routes
router.get('/get-all-posts', allPosts);
router.get('/get-posts', userPosts);
router.get('/get-post-by-id', getPostById);
router.post('/create-post', createPost);
router.put('/update-post', updatePost);
router.delete('/delete-post', deletePost);

export default router;
