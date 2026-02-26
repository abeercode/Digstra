
export default async function RoomId({ params }){
   const roomId = (await params ).RoomId
   
   return(
<>

         <div className="h-10 w-full"></div> 
<h1> here is your room   { roomId}</h1>
</>


    )


}