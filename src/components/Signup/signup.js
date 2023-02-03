import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "./signup.css"
const Signup=()=>{
    const[user,setuser]=useState({
        username:"",
        email:"",
        password:"",
        confirmpassword:""
    })
    

    const handlechange=e=>{
const {name,value}=e.target
setuser({...user,[name]:value})
    }
    const register=()=>{
        const {username,email,password,confirmpassword}=user
        if(username&&email&&password&&(password===confirmpassword)){
            axios.post("http://localhost:5000/register",user)
            .then(res=>{
                alert(res.data.message)
            })
        }else{
            alert("Invalid input")
        }
        
    }
    return (
        <>
            <section id="signup-container">
                <h1>Sign Up</h1>
                <div id="username">  <label>Username:  </label>
                <input type="text" placeholder="Username" name="username"  value={user.username}
                onChange={handlechange}/></div>
                <div id="email"> <label>Email:  </label>
                <input type="text" placeholder="E-mail" name="email"  value={user.email} onChange={handlechange}
                /></div>
                <div id="password"><label>Password:  </label>
                <input type="password" placeholder="Password" name="password"  value={user.password}
                onChange={handlechange}/></div>
                <div id="confirm"><label> Confirm Password:  </label>
                <input type="password" placeholder="Confirm-Password" name="confirmpassword"  value={user.confirmpassword}
                onChange={handlechange}/></div>
                <button id="signup-button" onClick={register} >Sign Up</button>
                <p>Have an account?</p>
            <Link to={"/login"}> <button  id="signin-button"  >Sign In</button></Link>
            </section>
            
      
          
        
           
        </>
    )
}
export default Signup