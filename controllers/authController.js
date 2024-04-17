const crypto = require('crypto')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require(`./../models/userModel`)
const catchAsync = require(`./../utils/catchAsync`)
const AppError = require(`./../utils/appError`)
const Email = require(`./../utils/email`)
const { token } = require('morgan')

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  }
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('jwt', token, cookieOptions)

  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user
    }
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  })
  const url = `${req.protocol}://${req.get('host')}/me`
  await new Email(newUser, url).sendWelcome()
  createSendToken(newUser, 201, res)
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError('Pls provide email and password', 400))
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }
  createSendToken(user, 200, res)
})

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })
  res.status(200).json({ status: 'success' })
}

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401))
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401))
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401))
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser
  res.locals.user = currentUser

  next()
})

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)

      const currentUser = await User.findById(decoded.id)
      if (!currentUser) {
        return next()
      }

      // Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next()
      }

      // GRANT ACCESS TO PROTECTED ROUTE
      res.locals.user = currentUser
      return next()
    }
  } catch (err) {
    return next()
  }
  next()
}

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You are not allowed to do this action', 403))
    }
    next()
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) return next(new AppError('There is no user with this email', 404))

  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    await new Email(user, resetURL).sendPasswordReset()
    res.status(200).json({
      status: 'success',
      message: 'token sent to email'
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpiresIn = undefined
    await user.save({ validateBeforeSave: false })
    return next(new AppError('there was an error sending the email. try this late', 500))
  }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })
  // 2. if the token has not expired, and there is the user, set new password
  if (!user) {
    return next(new AppError('token is invalid or has expired', 400))
  }
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()
  // 3. update changedPassword property for the user
  // 4. log the user in, send JWT
  createSendToken(user, 200, res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. get user from User.collection
  const user = await User.findById(req.user.id).select('+password')
  // 2. check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('your current password is incorrect', 401))
  }
  // 3. if so, update password
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()
  // 4. log user in, send JWT
  createSendToken(user, 200, res)
})
