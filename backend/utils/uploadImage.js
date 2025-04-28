import { v2 as cloudinary } from 'cloudinary';
// cloudinary.config({ 
//     cloud_name: 'djkvanqrx', 
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET 
// });

cloudinary.config({ 
    cloud_name: 'djkvanqrx', 
    api_key: '948216279599393',
    api_secret: 'wj_uyLZPUb9ERmfMN8IfICb3gnk'
});

const uploadImage = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        console.log(localFilePath);
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        return uploadResult;
    } catch(error) {
        console.log(error);
        throw error;
    }
}

export {uploadImage}