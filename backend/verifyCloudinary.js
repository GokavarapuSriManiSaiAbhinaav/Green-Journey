const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api/plants';

// 1. Generate Token
// Use a real-looking objectId just in case, though schema doesn't validate ID format for simple auth middleware
const token = jwt.sign({ id: '65b2a0c8e8b2a0c8e8b2a0c8' }, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log('Generated Token:', token);

// 2. Create dummy image
const imagePath = path.join(__dirname, 'test_image.png');
// 1x1 Red Pixel PNG
const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
fs.writeFileSync(imagePath, buffer);

// 3. Upload
async function upload() {

    const formData = new FormData();
    const fileDocs = new Blob([buffer], { type: 'image/png' });
    formData.append('image', fileDocs, 'test_image.png');
    formData.append('description', 'Test upload from verification script');

    try {
        console.log('Sending request to', API_URL);
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!res.ok) {
            const text = await res.text();
            console.error('Upload Failed:', res.status, text);
            process.exit(1);
        }

        const data = await res.json();
        console.log('Upload Success!', data);

        if (data.image && data.image.includes('cloudinary')) {
            console.log('VERIFICATION PASSED: Cloudinary URL detected.');
        } else {
            console.error('VERIFICATION WARNING: Image URL does not look like Cloudinary:', data.image);
        }

    } catch (err) {
        console.error('Network Error:', err);
        process.exit(1);
    } finally {
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
}

upload();
