import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    const {noteId } = await req.json();

    await db.delete($notes).where(eq($notes.id,noteId))
    return new NextResponse("success fully deleted", { status: 200})
}