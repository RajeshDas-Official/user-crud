import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { response } from "../utils/response.js";

// Create User
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, phone, addr, otp, verified } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { phone }]
  });

  if (existingUser) {
    if (existingUser.email === email) {
      return response(res, null, 'Email already exists', 409);
    }
    if (existingUser.phone === phone) {
      return response(res, null, 'Phone number already exists', 409);
    }
  }

  const user = await User.create({
    name,
    email,
    phone,
    addr,
    otp,
    verified: verified || false
  });

  return response(res, user, 'User created successfully', 201);
});

// Get All Users
export const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.verified !== undefined) {
    filter.verified = req.query.verified === 'true';
  }
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
      { phone: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const users = await User.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  const result = {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };

  return response(res, result, 'Users retrieved successfully', 200);
});

// Get Single User
export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return response(res, null, 'User not found', 404);
  }

  return response(res, user, 'User retrieved successfully', 200);
});

// Update User
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const user = await User.findById(id);

  if (!user) {
    return response(res, null, 'User not found', 404);
  }

  if (updateData.email || updateData.phone) {
    const duplicateQuery = { _id: { $ne: id } };
    const orConditions = [];

    if (updateData.email) {
      orConditions.push({ email: updateData.email });
    }
    if (updateData.phone) {
      orConditions.push({ phone: updateData.phone });
    }

    if (orConditions.length > 0) {
      duplicateQuery.$or = orConditions;
      const existingUser = await User.findOne(duplicateQuery);

      if (existingUser) {
        if (existingUser.email === updateData.email) {
          return response(res, null, 'Email already exists', 409);
        }
        if (existingUser.phone === updateData.phone) {
          return response(res, null, 'Phone number already exists', 409);
        }
      }
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  return response(res, updatedUser, 'User updated successfully', 200);
});

// Delete User
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return response(res, null, 'User not found', 404);
  }

  await User.findByIdAndDelete(id);

  return response(res, null, 'User deleted successfully', 200);
});

// Verify User
export const verifyUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { otp } = req.body;

  const user = await User.findById(id);

  if (!user) {
    return response(res, null, 'User not found', 404);
  }

  if (!user.otp) {
    return response(res, null, 'No OTP found for this user', 400);
  }

  if (user.otp !== otp) {
    return response(res, null, 'Invalid OTP', 400);
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { verified: true, otp: null },
    { new: true, runValidators: true }
  );

  return response(res, updatedUser, 'User verified successfully', 200);
});