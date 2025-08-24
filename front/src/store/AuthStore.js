import { atom, useSetRecoilState , useRecoilState , selector , useRecoilValue} from "recoil";



export const AuthStore = atom({
  key: "AuthStore",
  default: {
    authUser: null,
    isSigningUp: false,
    isLogingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

  socket:null
    
  }
});

export const UserId = atom({
   key:"UserId",
   default:""
})


