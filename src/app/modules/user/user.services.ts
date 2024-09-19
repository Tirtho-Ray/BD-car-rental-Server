import { TUser } from "./user.interface";
import { User } from "./user.model";

const createAdminIntoDB  = async(payload:TUser)=>{
    const result = await User.create(payload);
    return result;
}
const updateUserIntoDB = async (_id: string, payload: TUser) => {
  // console.log('Payload before save:', payload); 
    const admin = await User.findByIdAndUpdate({ _id }, payload);
    return admin;
  };

export const UserServices ={
    createAdminIntoDB,
 updateUserIntoDB 
    
}