const users=[]
const addup=({id,username,room})=>{
username=username.trim().toLowerCase()
room=room.trim().toLowerCase()

const existinguser=users.find((user)=>user.room===room&&user.username===username)
if(existinguser){
    if(!username || !room) return { error: 'Username and room are required.' };
  if(existinguser) return { error: 'Username is taken.' };
   
}
const user={id,username,room}
users.push(user)
return {error: null, user};
}
const deleteuser=()=>{
const index=users.findIndex((user)=>user.id===id)
if(index!==-1){
    return users.splice(index,1)[0]
}
}

const getuser=(id)=> {
    return users.find((user)=>user.id===id)
}
const userroom=(room)=>users.filter((user)=>user.room===room)

module.exports={addup,deleteuser,getuser,userroom}