import createHttpError from 'http-errors';
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { User } from "../models/user.js";

export const updateUserAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'No file');
  }
  const userId = req.user._id;

  const cloudinaryResult = await saveFileToCloudinary(req.file.buffer, userId);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { avatar: cloudinaryResult.secure_url },
    { new: true, returnDocument: 'after' }
  );

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }


  res.status(200).json({
    url: updatedUser.avatar,
  });
};

//   const result = await saveFileToCloudinary(req.file.buffer, req.user._id);


//   const updatedUser = await User.findOneAndUpdate(
//     { _id: req.user._id },
//     { avatarUrl: result.secure_url },
//     { returnDocument: "after" }
//   );

//   res.status(200).json({ url: updatedUser.avatar });
// };
