"use client"
import { useEffect, useState, useMemo } from "react"; 
import { client } from "@/lib/supabase/client";

export default function ActiveUsers({ roomId, userName, currentUserId }) {
    const [users, setUsers] = useState([]);
    const supabase = useMemo(() => client(), []);

    useEffect(() => {
        // If we don't have the user's info yet, don't connect
        if (!currentUserId || !userName) return;

        // Create a unique key so one person can have two tabs open without bugs
        const presenceKey = `${userName}_${currentUserId}`;

        const channel = supabase.channel(`presence_${roomId}`, {
            config: { presence: { key: presenceKey } },
        });

        channel
            .on("presence", { event: "sync" }, () => {
                const newState = channel.presenceState();
                console.log("Current Presence State:", newState);
                
                // Convert the object into a list of names
                // We split by the '_' we added above to get just the Name
                const activeNames = Object.keys(newState).map(key => key.split('_')[0]);
                
                // Remove duplicates (Set) and update state
                setUsers([...new Set(activeNames)]);
            })
            .on("presence", { event: "join" }, ({ key, newPresences }) => {
                console.log("User joined:", key);
            })
            .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
                console.log("User left:", key);
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    // This "tracks" the user so others can see them
                    await channel.track({
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, [roomId, userName, currentUserId, supabase]);

    return (
        <div className="bg-white rounded-xl border p-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Active Students ({users.length})
            </h3>
            
            <div className="flex flex-wrap gap-2">
                {users.length === 0 ? (
                    <p className="text-gray-400 text-sm italic">Just you for now...</p>
                ) : (
                    users.map((user) => (
                        <div key={user} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                            {user}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}