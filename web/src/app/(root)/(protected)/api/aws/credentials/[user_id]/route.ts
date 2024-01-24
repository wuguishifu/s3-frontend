import { db } from '@/lib/firebase';
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import { NextResponse } from "next/server";

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
                accessKeyId: data.accessKeyId,
                secretAccessKey: data.secretAccessKey
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