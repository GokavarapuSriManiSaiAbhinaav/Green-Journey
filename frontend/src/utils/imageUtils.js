/**
 * Resizes an image file to a specified maximum width/height while maintaining aspect ratio.
 * 
 * @param {File} file - The image file to resize.
 * @param {number} maxWidth - Maximum width (default 1200px).
 * @param {number} maxHeight - Maximum height (default 1200px).
 * @param {number} quality - Quality (0 to 1, default 0.8).
 * @returns {Promise<File>} - Resolves with the resized File object.
 */
export const resizeImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        if (!file.type.match(/image.*/)) {
            reject(new Error('File is not an image'));
            return;
        }

        const reader = new FileReader();

        reader.onload = (readerEvent) => {
            const image = new Image();
            image.onload = () => {
                let width = image.width;
                let height = image.height;

                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, width, height);

                // Export to blob
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Canvas is empty'));
                            return;
                        }
                        // Create a new file with the resized blob
                        const resizedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });
                        resolve(resizedFile);
                    },
                    file.type,
                    quality
                );
            };
            image.onerror = () => reject(new Error('Failed to load image'));
            image.src = readerEvent.target.result;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};
