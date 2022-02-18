import multer from "multer";
import cosmicjs from "cosmicjs";

const {
    AVATAR_BUCKET,
    AVATAR_WRITE_KEY,
    POST_BUCKET,
    POST_WRITE_KEY,
} = process.env;

const Cosmic = cosmicjs();

const avatarBucket = Cosmic.bucket({
    slug: AVATAR_BUCKET,
    write_key: AVATAR_WRITE_KEY
});

const postBucket = Cosmic.bucket({
    slug: POST_BUCKET,
    write_key: POST_WRITE_KEY
});

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const cosmicImageUpload = async (req: any) => {
    if(req?.file?.originalname) {
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer,
        };

        if(req.url && req.url.includes('post')) {
            return await postBucket.addMedia({ media: media_object });
        } else {
            return await avatarBucket.addMedia({ media: media_object });       
        };
    };
};

export { upload, cosmicImageUpload };
