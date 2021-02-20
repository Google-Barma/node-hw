import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 30,
      required: [true, 'name required'],
    },
    email: {
      type: String,
      minlength: 5,
      maxlength: 30,
      required: [true, 'email required'],
    },
    phone: {
      type: String,
      minlength: 10,
      maxlength: 13,
      required: [true, 'phone required'],
    },
    subscription: {
      type: String,
    },
    password: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: [true, 'password required'],
    },
    token: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true },
);

const Contact = mongoose.model('Contact', userSchema);

export default Contact;