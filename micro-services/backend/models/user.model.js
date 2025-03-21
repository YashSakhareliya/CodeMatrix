import mongoose  from "mongoose";
import argon2 from 'argon2';
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        trim: true,
    },
    website: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return /^\+?[0-9]{10,15}$/.test(value);
            },
            message: "Invalid phone number format",
        },
    },
    birthdate: {
        type: Date, 
    },
    socialLinks: {
        instagram: { type: String, trim: true },
        twitter: { type: String, trim: true },
    },
    location: {
        type: String,
        trim: true,
    },
    activeInstructors: [{
        type: ObjectId, 
        required: true
    }],
    currentInstructor: {
        type: ObjectId, 
        required: false, 
        default: null
    },
    instructorsHistory: [{
        instructorId: {
          type: ObjectId, 
          required: true
        },
        joinedAt: {
          type: Date,
          required: true,
          default: Date.now
        },
        leftAt: {
          type: Date,
          required: false,
          default: null
        }
    }],
    createdAt: { type: Date, default: Date.now }
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await argon2.verify(this.password, password);
}

userSchema.statics.hashPassword = async function (password) {
    return await argon2.hash(password);
}

const User = mongoose.model("User", userSchema);

export default User;