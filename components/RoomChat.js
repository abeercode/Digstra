"use client"
import { useState, useRef, useEffect } from "react";
import { sendRoomMessage } from "@/app/lib/actions";
import { client } from "@/lib/supabase/client";

export default function RoomChat({ roomId, currentUserId, initialMessages }) {
    // 1. Memory: Where we store the list of messages
    const supabase = client();
    const [messages, setMessages] = useState(initialMessages || []);

    // 2. Input: What the user is currently typing
    const [newMessage, setNewMessage] = useState("");

    // 3. Scroll Reference: To keep the chat at the bottom
    const scrollRef = useRef(null);

    const handleSendMessage = async (e) => {
        // 1. Prevent the page from refreshing (Standard for forms)
        e.preventDefault();

        // 2. Safety Check: Don't send empty messages
        if (!newMessage.trim()) return;

        // 3. Keep a copy of the message text
        const content = newMessage;

        // 4. Clear the input box IMMEDIATELY
        // This makes the app feel fast (Optimistic UI)
        setNewMessage("");

        try {
            // 5. Call the Server Action we created in Step 2
            // We pass: Which room? Who sent it? What is the text?
            await sendRoomMessage(roomId, currentUserId, content);

            console.log("Message sent to database!");
        } catch (error) {
            console.error("Failed to send message:", error);
            // Optional: If it fails, put the text back in the box so the user doesn't lose it
            setNewMessage(content);
        }
    };


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
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.user_id === currentUserId
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