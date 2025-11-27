import imageCompression from 'browser-image-compression'; 
import supabase from './settings';

const utils = async (imageFile) => {
    const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
        useWebWorker: true,
        fileType: 'image/webp',
    };
    const compressedImage = await imageCompression(imageFile, options);
    if (!compressedImage) throw new Error('Image compression failed');

    const uniqueFileName = `image_${Date.now()}_${compressedImage.name}`;
    const filePath = `images/${uniqueFileName}`;

    const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, compressedImage);

    if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error('Image upload failed');
    }

    const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

    if (!urlData.publicUrl) {
        throw new Error('Failed to get public URL');
    }

    console.log('Here is the image URL:', urlData.publicUrl);
    return urlData.publicUrl;
};

export default utils;