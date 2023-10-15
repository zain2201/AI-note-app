// /api/createNoteBook
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { generateImagePrompt,generateImage } from "@/lib/openAI";
import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";

export const runtime = "edge"

export async function POST(req:Request){

    const {userId} = auth()
    if(!userId) return new NextResponse( "unauthorized");
    const body = await req.json();
    const {name} = body;
    const image_description = await generateImagePrompt(name)
    if(!image_description) return new NextResponse("failed to generate image description",{
        status:500,
    });
    const image_url = await generateImage(image_description);
    if(!image_url) return new NextResponse("failed to generate image",{
        status:500,
    })
    const note_ids = await db
    .insert($notes)
    .values({
      name,
      userId,
      imageUrl: image_url,
    })
    .returning({
      insertedId: $notes.id,
    });
    console.log(image_description)
    return  NextResponse.json({
        note_id: note_ids[0].insertedId,
    })
 }


