const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Game title is required'],
    trim: true,
    maxlength: [100, 'Game title cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Game price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Game description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Game cover image URL is required']
  },
  publisher: {
    type: String,
    trim: true,
    required: [true, 'Publisher is required']
  },
  developer: {
    type: String,
    trim: true,
    required: [true, 'Developer is required']
  },
  platforms: {
    type: [String],
    required: [true, 'At least one platform is required'],
    enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'Other']
  },
  category: { // Renamed from genre to category for consistency with frontend
    type: String,
    required: [true, 'Game category is required'],
    enum: ['Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Puzzle', 'Racing', 'Fighting', 'Horror', 'Platformer', 'Open World', 'Multiplayer', 'Singleplayer', 'Indie', 'AAA', 'Games']
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(tags) {
        return tags.length <= 10; // Limit to 10 tags
      },
      message: 'Cannot have more than 10 tags'
    }
  },
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required']
  },
  ageRating: {
    type: String,
    enum: ['E', 'E10+', 'T', 'M', 'AO', 'RP', 'PEGI 3', 'PEGI 7', 'PEGI 12', 'PEGI 16', 'PEGI 18', 'USK 0', 'USK 6', 'USK 12', 'USK 16', 'USK 18'],
    required: [true, 'Age rating is required']
  },
  trailerUrl: {
    type: String,
    match: [/^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/, 'Please use a valid YouTube URL']
  },
  screenshots: {
    type: [String]
  },
  requirements: {
    minimum: {
      OS: { type: String },
      CPU: { type: String },
      RAM: { type: String },
      GPU: { type: String },
      DirectX: { type: String },
      Storage: { type: String }
    },
    recommended: {
      OS: { type: String },
      CPU: { type: String },
      RAM: { type: String },
      GPU: { type: String },
      DirectX: { type: String },
      Storage: { type: String }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  _id: false // Disable automatic _id generation
});

module.exports = mongoose.model('Product', productSchema);