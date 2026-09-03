import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    clerkId:{
        type : String,
        required : true,
        unique : true,
    },
    email:{
        type : String,
        required : true,
        unique : true,
    },
    fullName:{
        type : String,
        required : true,
    },
    profilePic:{
        type : String,
        default : "",
    },
},
{ timestamps : true},
);

//createdAt , updatedAt will be automatically created by mongoose because of timestamps:true

const User = mongoose.model("User", userSchema);

export default User;