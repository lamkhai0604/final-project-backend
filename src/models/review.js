const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review needs a body"],
    minLength: 5
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Review must belong to a user"]
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Review must belong to a tour"],
    ref: "Tour"
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


reviewSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
}


reviewSchema.pre(/^find/, function (next) {
  this
    .populate("user", "-__v -tokens -password -createdAt -updatedAt")
  // .populate("tour", "-guides -organizer -description -createdAt -__v")

  next();
})

// calculate rating and save to DB (Model Tour)
reviewSchema.statics.calculateAvgRating = async function (tourId) {
  console.log('calculateAvgRating is running')
  // find all the reviews that have the tour:tourId
  // generate a new object with {
  //  _id: tourId,
  //  ratingQ: number of docs found,
  //  ratingA: average of field 'rating' in all the found docs 
  // }
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: "$tour",
        ratingQuantity: { $sum: 1 }, 
        ratingAverage: { $avg: "$rating" }  
      }
    }
  ]);

  
  await mongoose.model("Tour").findByIdAndUpdate(tourId, {
    ratingAverage: stats.length === 0 ? 0 : stats[0].ratingAverage,
    ratingQuantity: stats.length === 0 ? 0 : stats[0].ratingQuantity
  })
}


// gonna use Doc middleware pre save
reviewSchema.post("save", async function(){
 // this = doc (instance)
 await this.constructor.calculateAvgRating(this.tour)
})

reviewSchema.pre(/^findOneAnd/, async function(next){
  // this = query 
  // we dont have Review model
  // attach the review doc to the query itself
  this.doc = await this.findOne();
  next()
})

reviewSchema.post(/^findOneAnd/, async function(){
  // this is also the query.
  // I wabnt to use Review model
  // this.doc now is the same as `this` inside reviewSchema.post("save",

  await this.doc.constructor.calculateAvgRating(this.doc.tour)
})


module.exports = mongoose.model("Review", reviewSchema)

