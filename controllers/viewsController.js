const Tour = require('../models/tourModel')
const User = require('../models/userModel')
const Booking = require('../models/bookingModel')

const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. get tour data from collection
  const tours = await Tour.find()
  // 2. build template
  // 3. render template using data from 1
  res.status(200).render('overview', {
    title: 'All tours',
    tours
  })
})

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'reviews rating user'
  })

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404))
  }
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com https://js.stripe.com/v3/;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://js.stripe.com/v3/ https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('tour', {
      title: `${tour.name}`,
      tour
    })
})

exports.getLoginForm = (req, res) => {
  res
    .status(200)
    .set('Content-Security-Policy', "connect-src 'self' https://cdnjs.cloudflare.com")
    .render('login', {
      title: 'Login into account'
    })
}

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  })
}

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })
  const tourIds = bookings.map(el => el.tour)
  const tours = await Tour.find({ _id: { $in: tourIds } })
  res.status(200).render('overview', {
    title: 'My tours',
    tours
  })
})

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  )
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  })
})
