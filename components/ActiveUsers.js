"use client"
import { useEffect, useState, useMemo } from "react"; 
import { client } from "@/lib/supabase/client";

export default function ActiveUsers({ roomId, userName, currentUserId}) {
    const [users, setUsers] = useState([]);
    const supabase = useMemo(() => client(), []);

 useEffect(() => {
        // 2. SAFETY CHECK: If we don't have the ID or Name yet, wait.
        if (!currentUserId || !userName) return;

        // 3. UNIQUE KEY: Combine Name + ID so Supabase sees different users 
        // even if they are on the same browser/network.
        const uniqueKey = `${userName}_${currentUserId}`; 

        const channel = supabase.channel(`presence_${roomId}`, {
            config: { presence: { key: uniqueKey } },
        });

        channel
            .on("presence", { event: "sync" }, () => {
                const newState = channel.presenceState();
                
                // 4. CLEANUP: Extract just the names from the keys
                // Example: ["Abeer_123", "S_456"] -> ["Abeer", "S"]
                const names = Object.keys(newState).map(key => key.split('_')[0]);
                
                // Remove duplicates just in case one user has two tabs open
                setUsers([...new Set(names)]); 
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({ online_at: new Date().toISOString() });
                }
            });

        return () => {
            channel.unsubscribe();
        };
        // 5. DEPENDENCIES: Re-run if any of these change
    }, [roomId, userName, currentUserId, supabase]);
return (
        <div className="mt-6 p-4 border-2 border-dashed border-blue-200 rounded-xl bg-white shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Live Study Group
            </h3>
            <div className="flex flex-wrap gap-2">
                {users.length === 0 ? (
                    <span className="text-gray-400 italic text-sm">Waiting for peers to join...</span>
                ) : (
                    users.map((user) => (
                        <div key={user} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 transition-all">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold">{user}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}