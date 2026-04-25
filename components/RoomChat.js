"use client"
import { useState, useRef, useEffect, useMemo } from "react";
import { client } from "@/lib/supabase/client";
import { sendRoomMessage } from "@/app/lib/actions";

export default function RoomChat({ roomId, currentUserId, initialMessages, currentUserName }) {

    const supabase = useMemo(() => client(), []);
    const [messages, setMessages] = useState(initialMessages || []);
    const [newMessage, setNewMessage] = useState("");
    const [userCache, setUserCache] = useState({}); // like a phone-book , key is user_id and value is username
    const scrollRef = useRef(null);

    //function to fetch names with logging
    const fetchUsername = async (userId) => {
        if (!userId || userId === currentUserId || userCache[userId]) return;

        const { data, error } = await supabase
            .from('profiles')
            .select('username, full_name') // Fetch both just in case
            .eq('id', userId)
            .single();

        if (error) {
            console.error("Error fetching name for", userId, error.message);
            return;
        }

        const displayName = data.username || data.full_name || "Student";
        setUserCache(prev => ({ ...prev, [userId]: displayName }));
    };

    // Populate from initial messages immediately

    useEffect(() => {
        const initialCache = {};
        initialMessages?.forEach(msg => {
            if (msg.user_id !== currentUserId) {

                const name = msg.profiles?.username || msg.profiles?.full_name;
                if (name) initialCache[msg.user_id] = name;
            }
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUserCache(prev => ({ ...prev, ...initialCache }));
    }, [initialMessages, currentUserId]);



    //REALTIME: Listen for new messages
    useEffect(() => {
        const channel = supabase
            .channel(`room_chat_${roomId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'room_messages',
                filter: `room_id=eq.${roomId}`
            }, (payload) => {
                setMessages((prev) => [...prev, payload.new]);
                // Fetch name for the new message sender
                fetchUsername(payload.new.user_id);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [roomId, supabase]);

    // Keep it at the bottom and refreshed every time messages is changed/expanded
    useEffect(() => {
        // scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        const container = scrollRef.current?.parentElement;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }

    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault(); //stop the page from refreshing when user hit enter
        if (!newMessage.trim()) return;
        const content = newMessage;
        setNewMessage(""); // clear the input area 
        try {
            await sendRoomMessage(roomId, currentUserId, content);
        } catch (error) {
            setNewMessage(content);
        }
    };

    return (
        <div className="flex flex-col h-[400px] w-full max-w-md border rounded-xl bg-white shadow-lg overflow-hidden">
            <div className="bg-blue-600 p-3 text-white font-bold">Room Chat</div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, index) => {
                    const isMe = msg.user_id === currentUserId;

                    //If me -> currentUserName
                    //if in cache -> userCache[id]
                    // if in msg object (server side) -> msg.profiles.username
                    //else -> "loading..."
                    const senderName = isMe
                        ? currentUserName
                        : (userCache[msg.user_id] || msg.profiles?.username || msg.profiles?.full_name || "Student...");

                    return (
                        <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] text-gray-400 mb-1 px-1 font-bold">
                                {senderName}
                            </span>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-200 text-gray-800 rounded-tl-none'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold">
                    Send
                </button>
            </form>
        </div>
    );
}