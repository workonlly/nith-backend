const fs = require('fs');
const path = require('path');

const uploadJs = `
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const filename = Date.now() + '-' + file.originalname.replace(/\\s+/g, '_');
    cb(null, filename);
  }
});

const uploadAuthorities = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for document uploads.'), false);
    }
  },
  limits: { fileSize: 20 * 1024 * 1024 }
});

const uploadMiddleware = (req, res, next) => {
  uploadAuthorities.single('file')(req, res, (err) => {
    if (err) return next(err);
    if (req.file) {
      req.file.location = 'http://localhost:4000/uploads/' + req.file.filename;
    }
    next();
  });
};

const deleteLocalFile = (fileUrl) => {
  if (!fileUrl) return;
  try {
    const urlParts = fileUrl.split('/uploads/');
    if (urlParts.length < 2) return;
    const filename = decodeURIComponent(urlParts[1]);
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('Error deleting local file:', err);
  }
};

module.exports = { 
  uploadAuthorities: { single: () => uploadMiddleware }, 
  deleteLocalFile 
};
`;

fs.writeFileSync('src/middleware/upload.js', uploadJs.trim());

const controllers = ['blog.js', 'building.js', 'finance_commitee.js', 'senate.js'];
for (const file of controllers) {
  const filePath = path.join('src/authorities', file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove AWS S3 and Minio imports
  content = content.replace(/const { DeleteObjectCommand } = require\('@aws-sdk\/client-s3'\);\n?/g, '');
  content = content.replace(/const s3Client = require\('\.\.\/db\/minio'\);\n?/g, '');
  
  // Update upload import
  content = content.replace(
    /const { uploadAuthorities, AUTHORITY_BUCKET } = require\('\.\.\/middleware\/upload'\);/g,
    "const { uploadAuthorities, deleteLocalFile } = require('../middleware/upload');"
  );
  
  // Replace deleteMinioFile definition
  const deleteMinioRegex = /const deleteMinioFile = async \([^)]+\) => {[\s\S]*?};\n/g;
  content = content.replace(deleteMinioRegex, '');
  
  // Replace calls to deleteMinioFile
  content = content.replace(/deleteMinioFile/g, 'deleteLocalFile');
  
  // Ensure the file saves
  fs.writeFileSync(filePath, content);
}

console.log('Refactor complete!');
