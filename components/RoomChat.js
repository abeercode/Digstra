"use client"
import { useState, useRef, useEffect, useMemo } from "react";
import { client } from "@/lib/supabase/client"; 
import { sendRoomMessage } from "@/app/lib/actions";

export default function RoomChat({ roomId, currentUserId, initialMessage }) {
    // Create the supabase instance
    const supabase = useMemo(() => client(), []); 
    
    const [messages, setMessages] = useState(initialMessage || []);
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef(null);



useEffect(() => {
    // 1. Create a "Channel" for this specific room
    const channel = supabase
        .channel(`room_chat_${roomId}`)
        // 2. Listen for 'INSERT' events in the 'room_messages' table
        .on(
            'postgres_changes',
            { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'room_messages', 
                filter: `room_id=eq.${roomId}` // Only listen for THIS room's messages
            },
            (payload) => {
                console.log("New message received!", payload.new);
                
                // 3. Add the new message to our list (state)
                // We use the "functional update" (prev) => ... to avoid bugs
                setMessages((prev) => [...prev, payload.new]);
            }
        )
        .subscribe();

    // 4. Cleanup: Stop listening when the user leaves the page
    return () => {
        supabase.removeChannel(channel);
    };
}, [roomId, supabase]);






const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return;

    const content = newMessage;
    setNewMessage("")

    try {
        // [MODIFIED] Store the result in a variable
        const result = await sendRoomMessage(roomId, currentUserId, content);
        
        // [NEW LOGS]
        console.log("Database Response:", result);

        if (!result.success) {
            console.error("Supabase rejected the message:", result.error);
            // If it failed, put the text back so you don't lose it
            setNewMessage(content); 
        } else {
            console.log("Success! Message saved.");
        }
    }
    catch (error) {
        console.error("Code crashed during send:", error);
        setNewMessage(content);
    }
}
// here will be the second step , after made sure the messeges is sent to console

useEffect(() => {
    // This tells the browser to find that "invisible div" we made and scroll to it
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]); // This runs EVERY time the 'messages' array changes














    return (
        <div className="flex flex-col h-[400px] w-full max-w-md border rounded-xl bg-white shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 p-3 text-white font-bold">Room Chat</div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex ${msg.user_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            msg.user_id === currentUserId 
                            ? 'bg-blue-500 text-white rounded-tr-none' 
                            : 'bg-gray-100 text-gray-800 rounded-tl-none'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold">
                    Send
                </button>
            </form>
        </div>
    );
}