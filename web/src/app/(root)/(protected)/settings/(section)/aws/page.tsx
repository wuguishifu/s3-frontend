import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AWSSetup() {
    return (
        <div className="justify-center" id="setup">
            <div className="max-w-screen-md px-4 lg:max-w-screen-xl">
                <h1>Setting up your AWS account</h1>
                <p>In order for Bucket Store to access Amazon S3 buckets in your AWS account, you will need to create an access key. Access keys allow external applications, such as Bucket Store, to access resources in your AWS account. Bucket Store requires the following IAM actions:</p>
                <ul className="list-disc px-8">
                    <li>s3:ListBucket<span className="text-muted-foreground"> - used to list all items in a folder</span></li>
                    <li>s3:GetObject<span className="text-muted-foreground"> - used to get a specific file</span></li>
                    <li>s3:PutObject<span className="text-muted-foreground"> - used to upload a file</span></li>
                    <li>s3:DeleteObject<span className="text-muted-foreground"> - used to delete a file</span></li>
                    <li>s3:ListAllMyBuckets<span className="text-muted-foreground"> - used to list all folders</span></li>
                    <li>s3:GetBucketWebsite<span className="text-muted-foreground"> - used to get an access point URL for a specific bucket*</span></li>
                    <li>s3:CreateBucket (optional)<span className="text-muted-foreground"> - used to create root level folders</span></li>
                    <li>s3:DeleteBucket (optional)<span className="text-muted-foreground"> - used to delete root level folders</span></li>
                </ul>
                <p className="text-muted-foreground mt-0">*this is required because buckets with specified URL endpoints are only accessible through them.</p>
                <p>
                    You can either create an IAM role for general access to your Amazon S3 buckets or create a restricted role that will only be able to access specific buckets. Making a general key will allow Bucket Store to create and delete buckets and will have access to every bucket in your Amazon S3. If you have specific buckets you do not want to show up in Bucket Store, it is recommended to use a restricted IAM role. You can view more information about IAM credentials in the{' '}
                    <Link
                        href="https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazons3.html"
                        className="underline underline-offset-4"
                        target="_blank">
                        Amazon S3 Docs
                    </Link>.
                </p>
                <p>There are two options for setting up an access key: using the Bucket Store Formation tool or manually through your AWS account. It is recommended to use the Bucket Store Formation tool, as this will ensure you don't make any errors during manual IAM credential setup — the AWS website isn't super easy to navigate.</p>
                <h2>Set up with Formation</h2>
                <p>Formation is a Bucket Store GUI tool that can be used to create an AWS CloudFormation template to generate resources for your AWS account. You can access it by clicking the "Create Template" button below.</p>
                <div className="flex flex-row items-center justify-center">
                    <Link
                        href="/formation"
                        target="_blank"
                        className={cn(buttonVariants({ variant: "default" }), 'w-56')}>
                        Create Template
                    </Link>
                </div>
                <p>Once you download the template, you can deploy it into AWS through the AWS CloudFormation console. Here are the steps on how to do this:</p>
                <ol className="list-decimal px-8">
                    <li>
                        Navigate to the{' '}
                        <Link
                            href='https://console.aws.amazon.com/cloudformation'
                            target="_blank"
                            className="underline underline-offset-4">
                            AWS CloudFormation
                        </Link>
                        {' '}console.
                    </li>
                    <li>Click the "Create stack" button.</li>
                    <li>Select "Upload a template file" and upload the template file you downloaded from Formation.</li>
                    <li>Click "Next" and enter a stack name. This can be anything you want, but it is recommended to use something like "bucket-store-formation."</li>
                    <li>Configure the stack options if you'd like, or keep them default. Click on "Next" and make sure to check "I acknowledge that AWS CloudFormation might create IAM resources."</li>
                    <li>Click "Submit" and wait for the stack to be created.</li>
                    <li>Click on the stack that was just created and go to the "Outputs" tab.</li>
                    <li>Write down the "BucketStoreAccessKeyId" and "BucketStoreSecretAccessKey." This access key pair will allow Bucket Store to access S3 resources in your AWS account.</li>
                    <li>Skip to the "Using your access key" section.</li>
                </ol>
                <h2>Manual Setup</h2>
                <p>If you are familiar with AWS infrastructure, you can create an IAM role and user for access to your Amazon S3 buckets. Keep in mind, Bucket Store needs an access key with the IAM roles described above. Here are the steps on how to do this:</p>
                <ol className="list-decimal px-8">
                    <li>
                        Navigate to the{' '}
                        <Link
                            href='https://console.aws.amazon.com/iam'
                            target="_blank"
                            className="underline underline-offset-4">
                            AWS IAM
                        </Link>
                        {' '}console.
                    </li>
                    <li>Go to the "Policies" tab and click "Create policy."</li>
                    <li>Select "S3" as the service.</li>
                    <li>Under "List" enable "ListBucket" and "ListAllMyBuckets."</li>
                    <li>Under "Read" enable "GetObject" and "GetBucketWebsite."</li>
                    <li>Under "Write" enable "PutObject" and "DeleteObject." Optionally, enable "CreateBucket" and "DeleteBucket."</li>
                    <li>Under "Resources" select "All" or select "Specific" and enter a list of ARNs for "bucket" and check "all" for "object".</li>
                    <li>Click on "Next," add a policy name like "BucketStorePolicy," and click "Create."</li>
                    <li>Go to the "Users" tab and click "Create user."</li>
                    <li>Add a User name like "BucketStoreUser" and click "Next."</li>
                    <li>Select "Attach policies directly," check the policy you just created, and click "Next."</li>
                    <li>Click "Create user."</li>
                    <li>Click on the user you just created and go to the "Security credentials" tab.</li>
                    <li>Click on "Create access key."</li>
                    <li>Select "Application running outside AWS" and click "Next."</li>
                    <li>Click "Create access key."</li>
                    <li>Write down the "Access key" and "Secret access key." This access key pair will allow Bucket Store to access S3 resources in your AWS account.</li>
                    <li>Continue to the "Using your access key" section.</li>
                </ol>
                <h2>Using your access key</h2>
            </div>
        </div>
    );
};