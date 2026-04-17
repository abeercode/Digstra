import Button from "@/components/Button"
import { createRoom } from "@/app/lib/actions";
export default function Rooms(){

return(
    <>
         <div className="h-10 w-full"></div>    {/* this is for a space for navbar*/} 
        <div> start a session now </div>

        <form action={createRoom}>

            <input type="text" name="roomName" placeholder="Room Name...." ></input>
             <button type="submit" > create a session </button>
        </form>
       
    </>
)

}