const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((res) => console.log(`connected to MongoDB`))
  .catch((err) => console.log(`error to connect MongoDB: ${err.message}`));

const personSchema = new mongoose.Schema({
  name: {
    unique: true,
    required: true,
    type: String,
    minlength: 3,
  },
  number: {
    required: true,
    type: String,
    minlength: 8,
  },
});

// Apply the uniqueValidator plugin to personSchema.
personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
