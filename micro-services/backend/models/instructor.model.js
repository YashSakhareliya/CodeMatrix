import mongoose from "mongoose";
import argon2 from 'argon2';
import jwt from "jsonwebtoken";

const { Schema, model, Types, ObjectId } = mongoose;
const instructorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    students: [{
        type: ObjectId,
        required: true
    }],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

instructorSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    return token;
}

instructorSchema.methods.comparePassword = async function (password) {
    return await argon2.verify(this.password, password);
}

instructorSchema.statics.hashPassword = async function (password) {
    return await argon2.hash(password);
}

export default mongoose.model('Instructor', instructorSchema);