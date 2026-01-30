const express = require('express');
const multer = require('multer');
const storage = require('../config/multer');
const auth = require('../middleware/auth');
const Plant = require('../models/Plant');

const router = express.Router();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log('Multer fileFilter called with file:', file);
    cb(null, true);
  }
});

// PUBLIC: get all plants
router.get('/', async (req, res) => {
  try {
    const plants = await Plant.find().sort({ date: -1 });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: upload plant (Cloudinary)
router.post('/', auth, (req, res, next) => {
  console.log('POST request received');
  console.log('Content-Type:', req.headers['content-type']);
  next();
}, upload.single('image'), async (req, res) => {
  try {
    console.log('After multer - Upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);

    if (!req.file) {
      console.log('ERROR: No file received');
      return res.status(400).json({ message: 'Image is required - ensure file field name is "image"' });
    }

    if (!req.body.title) {
      // If title is missing (which shouldn't happen from new frontend but might from old generic requests), provide a default? 
      // The user requirement says "required", but also "Ensure existing plant records without a title do NOT crash the app". 
      // For new uploads, we should enforce it.
      // Actually user requirement 2 said: "Ensure existing plant records without a title do NOT crash the app: Use a default value like "Growth Update" if title is missing."
      // That usually refers to GET (display), but for POST (creation) the Admin/Upload page changes say "Make the title required before upload."
      // So valid validation is correct here.
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!req.body.description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    console.log('Creating plant with image:', req.file.path || req.file.secure_url);

    const plant = await Plant.create({
      title: req.body.title,
      image: req.file.path || req.file.secure_url,
      description: req.body.description,
    });

    res.status(201).json(plant);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: Update plant
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, date } = req.body;
    let updateData = { description };

    if (title) {
      updateData.title = title;
    }

    if (date) {
      updateData.date = date;
    }

    if (req.file) {
      updateData.image = req.file.path || req.file.secure_url;
    }

    const updatedPlant = await Plant.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedPlant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.json(updatedPlant);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Delete plant
router.delete('/:id', auth, async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    await Plant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plant removed' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUBLIC: Add comment
router.post('/:id/comments', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    plant.comments.push({ text });
    await plant.save();

    res.status(201).json(plant);
  } catch (err) {
    console.error('Comment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Delete comment
router.delete('/:id/comments/:commentId', auth, async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Filter out the comment
    const commentIndex = plant.comments.findIndex(c => c._id.toString() === req.params.commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    plant.comments.splice(commentIndex, 1);
    await plant.save();

    res.json(plant);
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
