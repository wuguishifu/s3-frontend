import { serializeQuery } from "@/lib/utils";

const header = 'http://localhost:8080/api';

const endpoint = (endpoint: string, query?: any) => {
    return `${header}${endpoint}${query ? `?${serializeQuery(query)}` : ''}`;
}

export default {
    buckets: {
        list: () => endpoint('/buckets'),
        create: () => endpoint('/buckets'),
        delete: (props: { name: string }) => endpoint('/buckets', props),
        uploadUrl: (props: { bucket: string, filename: string }) => endpoint('/buckets/upload-url', props),
        documents: {
            list: (props: { bucket: string, continuationToken?: string }) => endpoint('/buckets/documents', props),
            delete: (props: { bucket: string, filenames: string[] }) => endpoint('/buckets/documents', props)
        }
    }
}