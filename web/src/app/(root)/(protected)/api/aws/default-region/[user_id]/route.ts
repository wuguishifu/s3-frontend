import { db } from '@/lib/firebase';
import { addDoc, collection, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { NextResponse } from "next/server";

export async function POST(req: Request, context: { params: { user_id: string } }) {
    const user_id = context.params.user_id;

    try {
        const body = await req.json();
        const defaultRegion = body.defaultRegion;

        const querySnapshot = await getDocs(query(
            collection(db, 'awsCredentials'),
            where('user_id', '==', user_id)
        ));

        if (querySnapshot.docs.length > 0) {
            const userDocRef = querySnapshot.docs[0].ref;
            await setDoc(
                userDocRef,
                { user_id, defaultRegion },
                { merge: true }
            );
            return NextResponse.json({ documentId: userDocRef.id, defaultRegion });
        } else {
            const docRef = await addDoc(
                collection(db, 'awsCredentials'),
                { user_id, defaultRegion }
            );
            return NextResponse.json({ documentId: docRef.id, defaultRegion });
        }
    } catch (error) {
        return NextResponse.json({
            error: 'Error while sending request.',
            message: error instanceof Error ? error.message : 'Unknown error.'
        });
    }
};

export async function GET(_: Request, context: { params: { user_id: string } }) {
    const user_id = context.params.user_id;
    try {
        const querySnapshot = await getDocs(query(
            collection(db, 'awsCredentials'),
            where('user_id', '==', user_id)
        ));

        if (querySnapshot.docs.length > 0) {
            const userDocRef = querySnapshot.docs[0].ref;
            const userDoc = await getDoc(userDocRef);
            const data = userDoc.data();

            if (!data) return NextResponse.json({
                error: 'Error while fetching data.',
                message: 'No data found.'
            });

            return NextResponse.json({
                documentId: userDocRef.id,
                user_id: data.user_id,
                defaultRegion: data.defaultRegion
            });
        } else {
            return NextResponse.json({
                error: 'Error while fetching data.',
                message: 'User doc not found.'
            });
        }
    } catch (error) {
        return NextResponse.json({
            error: 'Error while sending request.',
            message: error instanceof Error ? error.message : 'Unknown error.'
        });
    }
};

export async function DELETE(_: Request, context: { params: { user_id: string } }) {
    const user_id = context.params.user_id;
    try {
        const querySnapshot = await getDocs(query(
            collection(db, 'awsCredentials'),
            where('user_id', '==', user_id)
        ));

        if (querySnapshot.docs.length > 0) {
            const userDocRef = querySnapshot.docs[0].ref;
            await setDoc(
                userDocRef,
                { user_id, defaultRegion: 'us-east-1' },
                { merge: true }
            );
            return NextResponse.json({ deleted: true });
        } else {
            return NextResponse.json({
                deleted: false,
                error: 'Error while deleting data.',
                message: 'User doc not found.'
            });
        }
    } catch (error) {
        return NextResponse.json({
            deleted: false,
            error: 'Error while sending request.',
            message: error instanceof Error ? error.message : 'Unknown error.'
        });
    }
}