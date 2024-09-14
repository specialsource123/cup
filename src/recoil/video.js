import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const {persistAtom} = recoilPersist()


export const likes = atom({
    key:"likes",
    default:0,
    effects_UNSTABLE:[persistAtom]
})