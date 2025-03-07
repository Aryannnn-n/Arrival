const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.addReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  let { comment, rating } = req.body;
  const newReview = new Review({ comment, rating });
  newReview.author = req.user._id;
  await newReview.save();
  // Push the review ID into the listing's reviews array
  listing.reviews.push(newReview._id);
  await listing.save();
  req.flash('success', 'New Review Added Successfully !');
  res.redirect(`/listings/${req.params.id}`); // Redirect to the listing page
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review Deleted Successfully !');
  res.redirect(`/listings/${id}`);
};
