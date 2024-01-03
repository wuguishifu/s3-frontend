import { Button } from "./components/ui/button";
import { useKeys } from "./context/KeyContext";
import { toast, Toaster } from 'sonner';

export default function App() {
    const { accessKey, secretKey, setAccessKey, setSecretKey } = useKeys();

    function onBuckets() {
        console.log('on buckets');
        if (!accessKey || !secretKey) {
            toast.error('Please enter your AWS Access and Secret Keys');
        }
    }

    function onRoles() {
        console.log('on roles');
        if (!accessKey || !secretKey) {
            toast.error('Please enter your AWS Access and Secret Keys');
        }
    }

    return (
        <main className="flex justify-center">
            <div className="max-w-screen-md">
                <h1 className="text-center">Bucket Builder</h1>
                <p>Use this GUI tool to create buckets for you to use in Bucket Store. This GUI tool will allow you to create new S3 buckets, create IAM roles associated with read/write access to only those buckets, etc.</p>
                <p>You will need to enter in an AWS access and secret key to use this tool. This information is <span className="bg-blue-100 px-1 rounded-sm">never saved</span> (locally or remotely) for your security. You will need to enter them each time you use this GUI tool.</p>
                <div className="flex flex-row items-center gap-4">
                    <Button onClick={onBuckets}>View/Create Buckets</Button>
                    <Button onClick={onRoles}>View/Create IAM Roles</Button>
                </div>
            </div>
            <Toaster richColors closeButton />
        </main>
    );
};