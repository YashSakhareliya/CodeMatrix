import mongoose from "mongoose";
import argon2 from 'argon2';
import jwt from "jsonwebtoken";
import { customAlphabet } from 'nanoid';

const { Schema, model, Types } = mongoose;
const generateUserId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz', 6);

const studentSchema = new Schema({
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
    uid: {
        type: String,
        minlength: 6,
        maxlength: 6,
        unique: true,
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
        type: Types.ObjectId,  
        required: true
    }],
    currentInstructor: {
        type: Types.ObjectId, 
        required: false, 
        default: null
    },
    instructorsHistory: [{
        instructorId: {
          type: Types.ObjectId,  
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

studentSchema.pre("save", async function (next) {
    if (!this.uid) {
        let unique = false;
        while (!unique) {
            const newId = generateUserId(); 
            const exists = await this.constructor.exists({ uid: newId }); 
            if (!exists) {
                this.uid = newId;
                unique = true;
            }
        }
    }
    next();
});

studentSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    return token;
}

studentSchema.methods.comparePassword = async function (password) {
    return await argon2.verify(this.password, password);
}

studentSchema.statics.hashPassword = async function (password) {
    return await argon2.hash(password);
}

const Student = model("Student", studentSchema);

export default Student;
