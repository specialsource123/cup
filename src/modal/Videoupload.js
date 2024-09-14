import React from 'react';
import { isEditingState, modalActivceState } from '../recoil/channel';
import { useSetRecoilState } from 'recoil';

const Videoupload = () => {
    const setActive = useSetRecoilState(modalActivceState)
    const isSetEditing = useSetRecoilState(isEditingState)
    return (
        <div id="modal-wrap">
        <div id="modal-box">
        <div>
             <div className='modalTop'>
                <span>업로드</span>
                <label className='myButton'  onClick={()=> {setActive(false); isSetEditing(false)}} >X</label>
            </div>
                        <div className='toUpload'>
              <div className='uploadHolder'> <label className='uploadBtn' htmlFor='modalUpload' />
           <label htmlFor='modalUpload'><h2>동영상 업로드</h2></label> 
            <label htmlFor='modalUpload' className='uploadBlock' >파일 선택</label>
            <p> blabla</p>
            </div>  
            </div>
        </div>
              </div>

              <label id="modal-bg"  onClick={()=> {setActive(false); isSetEditing(false)}} />
            </div>
    );
};

export default Videoupload;