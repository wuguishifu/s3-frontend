'use client';

import { BucketTable } from "./bucket-table";
import { columns, type Bucket } from "./columns";

const data = {
    "buckets": [
        {
            "name": "bo-portfolio",
            "created_at": "2023-06-11T02:18:34.000Z",
            "region": "us-east-1"
        },
        {
            "name": "jank-tm",
            "created_at": "2023-07-06T23:16:12.000Z",
            "region": "us-east-1"
        },
        {
            "name": "s3c-development",
            "created_at": "2023-12-01T10:01:34.000Z",
            "region": "us-east-1"
        },
        {
            "name": "s3c-development-1",
            "created_at": "2023-12-01T07:14:21.000Z",
            "region": "us-west-1"
        },
        {
            "name": "s3c-development-2",
            "created_at": "2023-12-01T07:14:07.000Z",
            "region": "us-east-2"
        },
        {
            "name": "s3c-development-3",
            "created_at": "2023-12-01T07:21:41.000Z",
            "region": "us-west-2"
        }
    ]
}

export default function Buckets() {
    // const { data, error, loading } = useFetch<{ buckets: Bucket[] }>(endpoints.buckets.list());

    return (
        <main className="flex flex-col items-center justify-between p-24">
            <h1 className="font-bold text-3xl">My Buckets</h1>
            {data?.buckets && (
                <BucketTable
                    data={data.buckets}
                    columns={columns}
                />
            )}
            {/* <CreateBucket /> */}
        </main>
    );
};

type BucketProps = {
    bucket: Bucket
}

function Bucket(props: BucketProps) {
    const { bucket } = props;
    return (
        <div className="w-96 bg-secondary rounded-md flex flex-row">
            <div>{bucket.name}</div>
            <div>{new Date(bucket.created_at).toLocaleDateString()}</div>
            <div>{bucket.region}</div>
        </div>
    )
}