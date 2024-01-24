import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs, query, setDoc, where } from 'firebase/firestore';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const user_id = body.user_id;
        const accessKeyId = body.accessKeyId;
        const secretAccessKey = body.secretAccessKey;

        const querySnapshot = await getDocs(query(
            collection(db, 'awsCredentials'),
            where('user_id', '==', user_id)
        ));

        if (querySnapshot.docs.length > 0) {
            const userDocRef = querySnapshot.docs[0].ref;
            await setDoc(
                userDocRef,
                { user_id, accessKeyId, secretAccessKey },
                { merge: true }
            );
            return NextResponse.json({ documentId: userDocRef.id });
        } else {
            const docRef = await addDoc(
                collection(db, 'awsCredentials'),
                { user_id, accessKeyId, secretAccessKey }
            );
            return NextResponse.json({ documentId: docRef.id });
        }
    } catch (error) {
        return NextResponse.json({
            error: 'Error while sending request.',
            message: error instanceof Error ? error.message : 'Unknown error.'
        });
    }
};