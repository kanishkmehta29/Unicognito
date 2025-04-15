const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Storage type configuration - can be 'local' or 'cloudinary'
const STORAGE_TYPE = process.env.STORAGE_TYPE || 'cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Ensure directories exist function - improved to handle all needed directories
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
};

// Create all necessary directories
const setupDirectories = () => {
  // Main uploads directory
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  ensureDirectoryExists(uploadsDir);
  
  // Temp directory for multer
  const tempDir = path.join(uploadsDir, 'temp');
  ensureDirectoryExists(tempDir);
  
  // Public uploads directory
  const publicUploadsDir = path.join(__dirname, '..', 'public', 'uploads');
  ensureDirectoryExists(publicUploadsDir);
  
  // Create subdirectories for different content types
  const contentTypes = ['profiles', 'posts', 'projects', 'courses', 'communities', 'community-posts', 'discussions', 'message-attachments'];
  contentTypes.forEach(type => {
    ensureDirectoryExists(path.join(publicUploadsDir, type));
  });
};

// Run directory setup on module load
setupDirectories();

/**
 * Uploads a single file to either Cloudinary or local storage
 * @param {Object} file - File object from multer
 * @param {string} folderName - Optional folder name for organizing uploads
 * @returns {Promise<string>} URL to the uploaded file
 */
const uploadFile = async (file, folderName = '') => {
  if (!file) {
    throw new Error('No file provided for upload');
  }
  
  if (STORAGE_TYPE === 'cloudinary') {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',
        folder: folderName
      });
      
      // Clean up the temporary file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  } else {
    // Local file storage logic
    const targetDir = path.join(__dirname, '..', 'public', 'uploads', folderName);
    ensureDirectoryExists(targetDir);
    
    const filename = `${Date.now()}-${path.basename(file.originalname || 'unnamed')}`;
    const targetPath = path.join(targetDir, filename);
    
    try {
      if (fs.existsSync(file.path)) {
        fs.copyFileSync(file.path, targetPath);
        fs.unlinkSync(file.path);
      } else {
        console.error(`Source file not found: ${file.path}`);
        throw new Error(`Source file not found: ${file.path}`);
      }
      
      return `/uploads/${folderName}/${filename}`;
    } catch (error) {
      console.error('Local file upload error:', error);
      throw error;
    }
  }
};

/**
 * Uploads multiple files to either Cloudinary or local storage
 * @param {Array} files - Array of file objects from multer
 * @param {string} folderName - Optional folder name for organizing uploads
 * @returns {Promise<Array<string>>} Array of URLs to the uploaded files
 */
const uploadMultipleFiles = async (files, folderName = '') => {
  if (!files || files.length === 0) return [];
  const uploadPromises = files.map(file => uploadFile(file, folderName));
  return Promise.all(uploadPromises);
};

/**
 * Gets the current storage type configuration
 * @returns {string} Current storage type ('local' or 'cloudinary')
 */
const getStorageType = () => STORAGE_TYPE;

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  getStorageType,
  ensureDirectoryExists // Export for potential use elsewhere
};