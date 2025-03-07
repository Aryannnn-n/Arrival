const mongoose = require('mongoose');
const Listing = require('../models/listing');
const initData = require('./data');

// DB connection
const db_url = 'mongodb://127.0.0.1:27017/Air';
async function main() {
  await mongoose.connect(db_url);
}

main()
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.log(err);
  });

const dataInsert = async function () {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: '67bc050e22156b5f6f4d0bf2',
  }));
  await Listing.insertMany(initData.data);
  console.log('hello');
};

dataInsert();

// const dataIns = async function () {
//   const data1 = new Listing({
//     title: 'sb',
//     description: 'sb',
//     price: 1400,
//     location: 'nashik',
//     country: 'India',
//   });

//   await data1.save();
// };

// dataIns();
