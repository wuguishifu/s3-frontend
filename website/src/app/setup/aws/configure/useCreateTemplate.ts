import { endpoints } from "@/lib/endpoints";

type Values = {
    access: 'general' | 'restricted';
    policies: {
        CreateBucket: boolean;
        DeleteBucket: boolean;
    };
    buckets: {
        bucketName: string;
        removalPolicy: 'DESTROY' | 'RETAIN' | 'SNAPSHOT';
    }[];
};

export default function useCreateTemplate() {
    return async (values: Values) => {
        const response = await fetch(endpoints.generateS3CfStack, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        });
        const data = await response.json();
        return data;
    };
};