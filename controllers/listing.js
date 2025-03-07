const Listing = require('../models/listing');
const ExpressError = require('../utils/ExpressError');

// index route
module.exports.index = async (req, res) => {
  let data = await Listing.find();
  // console.log(data);
  res.render('listings/index', { data });
};

// New Route
module.exports.newListingForm = (req, res) => {
  res.render('listings/new');
};

// Create Route
module.exports.createListing = async (req, res, next) => {
  let data = req.body;
  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(data);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash('success', 'New Listing Added Successfully !');
  res.redirect('/listings');
};

// Show Route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  // console.log(id);
  let listing = await Listing.findById(id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('owner');
  //if listing info not exist
  // console.log(listing);
  if (!listing) {
    req.flash('error', 'The Listing Are You Looking For Does Not Exist !');
    res.redirect('/listings');
  }
  res.render('listings/show', { listing });
};

// Edit Route
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'The Listing Are You Looking For Does Not Exist !');
    res.redirect('/listings');
  }

  let orignalImageUrl = listing.image.url;
  orignalImageUrl = orignalImageUrl.replace('/upload', '/upload/h_300/w_250');

  res.render('listings/edit', { listing, orignalImageUrl });
};

// Update Route
module.exports.updateListing = async (req, res) => {
  if (!req.body) {
    throw new ExpressError(400, 'Send Some Data');
  }
  let { id } = req.params;
  let data = req.body;
  let listing = await Listing.findByIdAndUpdate(id, data);

  if (typeof req.file !== 'undefined') {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash('success', 'Listing Updated Successfully !');
  res.redirect(`/listings/${id}`);
};

// Delete Route
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  req.flash('success', 'Listing Deleted !');
  res.redirect('/listings');
};
