import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({ //định nghĩa schema
  userName: {
    type: String,
    require: true, //không được để null hoặc undefined
    unique: true //đảm bảo giá trị là duy nhất
  },
  password: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  email:{
    type: String,
    require: true,
    unique: true
  },
  access_token:{
    type: String,
  },
  refresh_token:{
    type: String,
    unique: true
  },
  isAdmin:{
    type:Boolean,
    unique: true,
    default: false
  }
},
{
    timestamps: true
}
);

export const User = mongoose.model('User', userSchema); //tạo ra đối tượng user và có tên colection là user
