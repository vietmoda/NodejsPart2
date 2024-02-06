import mongoose from "mongoose";
import { Schema } from "mongoose";

const studentSchema = new Schema({
    name:{
        type: String,
        require: true,
        unique: true
    },
    studentPassword:{
        type: String,
        require: true,
    },
    birthday:{
        type: Date,
        require: true
    },
    mssv:{
        type: String,
        require: true,
        unique: true
    },
    studentClass:{
        type: String,
    },
    access_token:{
        type: String,
        unique: true
    },
    refresh_token:{
        type: String,
        unique: true
    },
    isAdmin:{
        type: Boolean,
        unique: true,
        default: false
    }
},
{
    timestamps: true
}
)

export const Student = mongoose.model('Student', studentSchema)