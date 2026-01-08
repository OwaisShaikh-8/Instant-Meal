import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    
   {
    
    fullname: {
        type:String,
        required:true
    }
    ,
    email: {
        type: String,
        required: true
    }
    ,
    password: {
        type: String,
        required:true
    }
    ,
    confirmPassword: {
        type: String,
    }
    ,

    role:{
        type:String,
        enum:["customer", "vendor"],
        required:true
    }
    ,
    companyName :{
        type: String,
        required : function(){
            return this.role === "vendor"
        }
    }

},
{timesatmps:true}
)

const User = mongoose.model("User",userSchema)
export default User;