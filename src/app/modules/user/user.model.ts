import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";
import { USER_ROLE, USER_STATUS } from "./user.constant";
import config from "../../config";
import bcryptjs from "bcryptjs";
const userSchema = new Schema<TUser> ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true


    },
    phone:{
        type: String,
       
        unique: true
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(USER_ROLE),
        default: USER_ROLE.USER
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(USER_STATUS),
        default: USER_STATUS.ACTIVE
    },
    passwordChange: {
        type: Date
    },
    stripeCustomerId: { type: String },  // Add this to your schema
},)

userSchema.pre("save", async function (next){
    const user = this;
    user.password = await bcryptjs.hash(user.password , Number(config.bcrypt_salt_round))
    next();
});

userSchema.post("save", async function (doc,next){
    doc.password = "";
    next();
});

export const User = model<TUser>("user",userSchema);