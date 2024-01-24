import Link from "next/link";
import AWSCredentialsInputForm from "./credentials-form";

export default function AWSCredentials() {
    return (
        <>
            <h1>Your AWS Credentials</h1>
            <p>
                You can update your AWS credentials here. These credentials are used to access your AWS account and create the necessary resources for your app. Follow the steps in the{' '}
                <Link
                    href='/settings/aws/configure'
                    target="_blank"
                    className="underline underline-offset-4">
                    Configure AWS
                </Link>
                {' '}tab to learn about what IAM permissions are required by Bucket Store and create a pair of access keys.
            </p>
            <p>You should never enter a root-level key or a key that has full AWS access here (or anywhere, for that matter). This can compromise the security of your AWS account, and is strongly recommended against. You can read more about root-level access keys on the{' '}
                <Link
                    href='https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user_manage_add-key.html'
                    target='_blank'
                    className='underline underline-offset-4'>
                    AWS Docs
                </Link>.
            </p>
            <p>
                Once you save your credentials, you will not be able to see your Secret Access Key anymore. Make sure you save it somewhere secure if you will need to have access to it again. If you lose your keys, you can always create new ones in the{' '}
                <Link
                    href='https://console.aws.amazon.com/iam/home?#/security_credentials'
                    target='_blank'
                    className='underline underline-offset-4'>
                    AWS IAM Console
                </Link>.
            </p>
            <AWSCredentialsInputForm />
        </>
    );
};