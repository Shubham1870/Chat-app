import React from "react";
import{BrowserRouter,Route,Routes} from 'react-router-dom'
import Join from "./components/Join/join"
import Chat from "./components/Chat/chat";
const App=()=>{
    return(
        <>
        <BrowserRouter>
            <Routes>
            <Route path="/" exact element={<Join/>}></Route>
            <Route path="/chat" element={<Chat location={window.location}/>}></Route>
        </Routes>
        </BrowserRouter>
        </>
    )
}
export default App