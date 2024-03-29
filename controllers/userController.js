const User = require(`./../models/userModel`)
const catchAsync = require(`./../utils/catchAsync`)
const AppError = require(`./../utils/appError`)

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  // SEND RESPOND
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users
    }
  })
})

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. if error if user posts password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password update, pls use /updateMyPassword', 400))
  }
  // 2. filter unwanted fields
  const filterdBody = filterObj(req.body, 'name', 'email')
  // 3. update user document

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterdBody, { new: true, runValidators: true })

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })
  res.status(204).json({
    status: 'success',
    data: null
  })
})

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route is not defined!'
  })
}

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route is not defined!'
  })
}

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route is not defined!'
  })
}

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route is not defined!'
  })
}
