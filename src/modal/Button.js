import React  from 'react';
import { useRecoilState } from 'recoil';
import { isEditingState, modalActivceState } from '../recoil/channel';
import Videoupload from './Videoupload';
import Videoedit from './Videoedit';


const Button = ({selectedVideo , setVideos, setSelectedVideo}) => {


const [active, setActive] = useRecoilState(modalActivceState)
const [isEditing, isSetEditing] = useRecoilState(isEditingState)








    return (
         <div className='createVideo'>
  
            
        <label id="modalBtn" onClick={()=> {setActive(true)}}> 버튼  
</label>


  <span>dfd</span>


        <input type="checkbox" id="modal-status"  checked={active} onChange={()=>{}}/>

           
{isEditing ? <Videoedit selectedVideo={selectedVideo}  setVideos={setVideos} />: <Videoupload/>}
          </div>



    );
};

export default Button;