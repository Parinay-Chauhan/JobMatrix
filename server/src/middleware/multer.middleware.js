import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // file kaha temporarily save hogi
    cb(null, "./public/temp");
  },

  filename: function (req, file, cb) {
    // file ka naam kya hoga
    // Sanitize filename: replace spaces with underscores
    // cb(null, Date.now() + "-" + file.originalname);
    const sanitizedFileName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${sanitizedFileName}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOC, DOCX, and images (JPEG, PNG, WebP) are allowed."), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max limit
  },
  fileFilter: fileFilter,
});
