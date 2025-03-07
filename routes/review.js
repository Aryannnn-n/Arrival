const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listing');
const Review = require('../models/review.js');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');

const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
} = require('../middleware.js');

const { addReview, deleteReview } = require('../controllers/review.js');

// Reviews
// Post Review Route
router.post('/', isLoggedIn, validateReview, isLoggedIn, wrapAsync(addReview));

// Delete Review Route
router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(deleteReview)
);

module.exports = router;
