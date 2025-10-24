import multer from "multer";

const fileFilter = (req, file, cb) => {

    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "text/csv"
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        // Accepting the file
        cb(null, true);
    } else {
        // Rejecting the file 
        cb(new Error("Invalid file type. Only JPG, PNG, GIF, PDF, and CSV are allowed."), false);
    }
};

const upload = multer({
    //using memory storage to hold the file as a buffer in RAM.
    storage:multer.memoryStorage(),
    
    //limiting the file size to 5MB
    limits:{
        fileSize:(1024*1024)*5
    },
    fileFilter:fileFilter
})

export default upload;
