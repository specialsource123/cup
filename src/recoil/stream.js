import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const connectedState = atom({
  key: 'connectedState',
  default: false, // 기본값을 false로 설정
  effects_UNSTABLE: [persistAtom], // 상태를 로컬 스토리지에 저장
});