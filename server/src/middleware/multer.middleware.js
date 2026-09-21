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

export const upload = multer({ storage: storage });
