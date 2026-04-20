'use server'

import { auth } from "@/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
const pdf = require("pdf-parse-fork");

import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
})

// import pdf from "pdf-parse"

export async function createRoom(formData) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Please log in first!");
    }

    const user = session.user;
    //debugging use
    console.log("Creating room for:", user.email);

    const supabase = await createClient();
    const nameInput = formData.get('roomName') || "New Study Session";
    const durationInput = formData.get("duration");

    // database Insert
    const { data: newRoom, error } = await supabase
        .from('rooms')
        .insert([
            {
                name: nameInput,
                host_id: user.id,
                duration_minutes: parseInt(durationInput)
            }
        ])
        .select()
        .single();

    if (error) {
        console.error("Database Insert Error:", error.message);
        throw new Error("Could not create room. Please try again.");
    }
    console.log("Room created! ID is:", newRoom.id); // Check your VS Code terminal for this!

    if (!newRoom?.id) {
        throw new Error("Room was created but I couldn't get the ID back!");
    }

    redirect(`/Rooms/${newRoom.id}`);
}



//another action that handle when the session is ended and update the needed columns
export async function updateRoomStatus(roomId) {
    try {
        const supabase = await createClient();

        // LOG 1: Check if the function starts
        console.log("Checking Room ID:", roomId);

        const { data, error } = await supabase
            .from('rooms')
            .update({
                is_finished: true,
                expires_at: new Date().toISOString()
            })
            .eq('id', roomId) // Ensure roomId is exactly what's in the DB
            .select();

        // LOG 2: Check for errors
        if (error) {
            console.error("SUPABASE UPDATE ERROR:", error.message);
            return { success: false, error: error.message };
        }

        // LOG 3: Check if any row was actually found
        if (!data || data.length === 0) {
            console.error("UPDATE FAILED: No room found with that ID.");
            return { success: false };
        }

        console.log("SUCCESS: Room marked as finished!");
        return { success: true };

    } catch (err) {
        console.error("CRITICAL SERVER ERROR:", err);
        return { success: false };
    }
}

// action that update the started_at column once it's called 
export async function startRoomTimer(roomId) {
    const supabase = await createClient(); // Use your server client
    const { error } = await supabase
        .from('rooms')
        .update({ started_at: new Date().toISOString() })
        .eq('id', roomId);

    if (error) throw new Error(error.message);
    return { success: true };
}


export async function sendRoomMessage(roomId, userId, content) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('room_messages')
        .insert([{ room_id: roomId, user_id: userId, content: content }])
        .select();

    if (error) {
        // This logs on your Fedora terminal (server-side)
        console.error("Supabase Error:", error.message);

        // This sends the error back to the browser
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function extractPdfText(formData) {
    const inputFile = formData.get("inputFile");
    if (!inputFile) return "No file selected";

    try {
        const arrayBuffer = await inputFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const data = await pdf(buffer);
        return data.text;

    } catch (error) {
        console.error("Extraction error:", error);
        return "Failed to read PDF. Try a different file.";
    }
}


async function generateQuestions(text) {


    
}