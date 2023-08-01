const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const camps = await Campground.find({});
  res.render("campgrounds/index", { camps });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res) => {
  req.files.map((f) => ({ url: f.path, filename: f.filename }));
  const campground = new Campground(req.body);
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Successfully made a new campground!!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const updatedCamp = await Campground.findByIdAndUpdate(id, req.body);
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  updatedCamp.images.push(...imgs);
  await updatedCamp.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await updatedCamp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${updatedCamp._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};

module.exports.showCampground = async (req, res, next) => {
  const { id } = req.params;
  const foundCamp = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author", model: "User" },
    })
    .populate("author");
  if (!foundCamp) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/details", { foundCamp });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const foundCamp = await Campground.findById(id);
  if (!foundCamp) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { foundCamp });
};
