import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from './login/Login';
import Join from './login/Join';
import { RecoilRoot } from 'recoil';
import Studio from './studio/Studio';
import AuthRoutes from './auth/AuthRoutes';
import VideoDetail from './watch/VideoDetail';
import { Stream } from './watch/Stream';
import LoginSuccess from './watch/LoginSuccess';
import Shorts from './watch/Shorts';
import Home from './homepage/Home';
import { Google } from './login/Google';
import Comments from './comment/Comment';
import Appp from './watch/Appp';
import MyComponent from './MyComponent';


function App() {
  return (

<BrowserRouter>
<RecoilRoot>
<Routes>
<Route path='shorts' element={< Shorts/>} />
<Route path='comments' element={< Comments/>} />
<Route path='watch' element={< VideoDetail/>} />
<Route path="/login/success" element={<LoginSuccess />} />
<Route path="/My" element={<MyComponent/>} />
<Route path='/appp' element={< Appp/>} />
<Route path='/' element={< Home />} />
<Route path="/login" element={< Login/>} />
<Route path ="/join" element={< Join/>} />
<Route path ="/day" element={< Stream/>} />
<Route path ="/google" element={< Google/>} />
<Route element={<AuthRoutes />}>
<Route path='/studio/*' element={< Studio/>} />
</Route> 
</Routes>
</RecoilRoot>
</BrowserRouter>
  );
}

export default App;
