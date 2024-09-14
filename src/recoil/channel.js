import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const {persistAtom} = recoilPersist()

export const modalActivceState = atom({
    key:"modalActiveState",
    default:true,
    effects_UNSTABLE:[persistAtom],
    
})
export const isEditingState = atom({
    key:"isEditingState",
    default:false,
    effects_UNSTABLE:[persistAtom],
})
export const selectedVideoState = atom({
    key:"selectedVideoState",
    default:null,
    effects_UNSTABLE:[persistAtom],
})
