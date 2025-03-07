const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { listingSchema, reviewSchema } = require('../schema.js');

const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');

const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

// mvc pattern
const {
  index,
  newListingForm,
  createListing,
  showListing,
  editListing,
  updateListing,
  destroyListing,
} = require('../controllers/listing.js');

router;

// New Route
router.get('/new', isLoggedIn, newListingForm);

// Edit Route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(editListing));

// Create Route && // index route
router
  .route('/')
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    upload.single('image'),
    validateListing,
    wrapAsync(createListing)
  );

// Show Route
// Update Route
// Delete Route

router
  .route('/:id')
  .get(wrapAsync(showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('image'),
    validateListing,
    wrapAsync(updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(destroyListing));

module.exports = router;
