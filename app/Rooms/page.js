import Button from "@/components/Button"
import { createRoom } from "@/app/lib/actions";
export default function Rooms() {

    const options = []
    for (let i = 1; i <= 120; i += 1) {
        options.push(<option value={i} key={i}>{i}</option>);

    }
    return (

        <>
            <div className="h-10 w-full"></div>
            <div> start a session now </div>
            <form action={createRoom}>
                <input type="text" name="roomName" placeholder="Room Name...." ></input>

                <div name="timerSections" >
                    <label >set timer</label>
                    <select name="duration" id="duration" defaultValue="25"><option value="" disabled>
                        Select time
                    </option>{options}</select>
                </div>

                <button type="submit" > create a session </button>
            </form>
        </>
    )

}