import axios from "axios"
import { Link } from "react-router-dom"
import "./signin.css"
import { useState } from "react"
const Signin=()=>{
    const[user,setuser]=useState({
        username:"",
        password:""
    })
   

    const handlechange=e=>{
        const{name,value}=e.target
        setuser({...user,[name]:value})
    }
const login=()=>{
axios.post("http://localhost:5000/login",user).then(res=>{
    alert(res.data.message)
        window.location.replace("/join");
    }
        
   
})


}
    return (
        <>
            <section id="signin-container">
                <h1>Sign In</h1>
                <form>
                <div id="email"> <label>Email:   </label>
                <input type="email" placeholder="Email" name="email"  value={user.email}
                onChange={handlechange}/></div>
                <div id="password">
                <label>Password:  </label>
                <input type="password" autoComplete="true" placeholder="Password" name="password"  value={user.password}
                onChange={handlechange}/>
                </div>
                </form>
                <button id="signin-button" onClick={login} >Sign In</button>
                <p>Don't have an account?</p>
<Link to={"/register"}>
<button id="signup-button">Sign Up</button>
</Link>
            </section>
 
            
        </>
    )
}
export default Signin
