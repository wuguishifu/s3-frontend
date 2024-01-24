import { endpoints } from "@/lib/api/endpoints";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const response = await fetch(endpoints.generateS3CfStack, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!data.stack) return NextResponse.json({ error: 'Error while creating stack.' });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Error while sending request.' });
    }
};