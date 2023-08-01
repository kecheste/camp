const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://127.0.0.1/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Mongo connection established!!");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    let random1000 = Math.floor(Math.random() * 1000);
    let price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      author: "64bcf5c436ed7742568c13af",
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dtnpzejau/image/upload/v1690529358/YelpCamp/ak9vfeeogdpdgmpf5bma.jpg",
          filename: "YelpCamp/ak9vfeeogdpdgmpf5bma",
        },
        {
          url: "https://res.cloudinary.com/dtnpzejau/image/upload/v1690529358/YelpCamp/mdeusxdrc43bnbj4z81x.jpg",
          filename: "YelpCamp/mdeusxdrc43bnbj4z81x",
        },
      ],
      description:
        "Documentation and examples for Bootstraps powerful, responsive navigation header, the navbar. Includes support for branding, navigation, and more, including support for our collapse plugin.",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
