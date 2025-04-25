import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: 'djkvanqrx', 
    api_key: '948216279599393', 
    api_secret: 'wj_uyLZPUb9ERmfMN8IfICb3gnk' // Click 'View API Keys' above to copy your API secret
});

const uploadImage = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const uploadResult = await cloudinary.uploader(localFilePath, {
            resource_type: "auto"
        });
    } catch(error) {
        console.log(error);
        throw error;
    }
}

export {uploadImage}