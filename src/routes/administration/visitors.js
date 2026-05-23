const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3Client = require('../../db/minio');
const visitorController = require('../../controllers/visitorController');

const router = express.Router();

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'images',
    key: (req, file, cb) => cb(null, `visitor-${Date.now()}-${file.originalname}`),
  }),
});

router.get('/page', visitorController.getVisitorPage);
router.put('/page', visitorController.updateVisitorPage);

router.get('/', visitorController.getAllVisitors);
router.get('/:id', visitorController.getVisitorById);
router.post('/', upload.single('image'), visitorController.createVisitor);
router.put('/:id', upload.single('image'), visitorController.updateVisitor);
router.delete('/:id', visitorController.deleteVisitor);

module.exports = router;