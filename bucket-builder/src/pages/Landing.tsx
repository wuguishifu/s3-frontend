import { open } from "@tauri-apps/api/shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Landing() {
    return (
        <main className="flex justify-center">
            <div className="max-w-screen-md px-4">
                <h1 className="text-center">Bucket Builder</h1>
                <p className="mb-0">You can use this GUI tool to configure your AWS account for Bucket Store, or you can manually configure in your AWS settings. Bucket Store requires access keys with the following IAM actions:</p>
                <ul className="list-disc px-8">
                    <li>s3:ListBucket<span className="text-black/50"> - used to list all items in a folder</span></li>
                    <li>s3:GetObject<span className="text-black/50"> - used to get a specific file</span></li>
                    <li>s3:PutObject<span className="text-black/50"> - used to upload a file</span></li>
                    <li>s3:DeleteObject<span className="text-black/50"> - used to delete a file</span></li>
                    <li>s3:ListAllMyBuckets<span className="text-black/50"> - used to list all folders</span></li>
                    <li>s3:GetBucketWebsite<span className="text-black/50"> - used to get an access point URL for a specific bucket*</span></li>
                    <li>s3:CreateBucket (optional)<span className="text-black/50"> - used to create root level folders</span></li>
                    <li>s3:DeleteBucket (optional)<span className="text-black/50"> - used to delete root level folders</span></li>
                </ul>
                <p className="text-black/50 mt-0">*this is required because buckets with specified URL endpoints are only accessible through them.</p>
                <p className="mb-0">This GUI tool has two options for creating credentials with the above specs:</p>
                <ol className="list-decimal px-8">
                    <li>Creating a general IAM role for access all S3 buckets in your AWS account.</li>
                    <li>Creating an IAM role for accessing specified buckets in your AWS account. This option is better for privacy, but you will not be able to create root level folders*.</li>
                </ol>
                <p className="text-black/50 mt-0">*You can manually add folders through the AWS console by adding the S3 resource to the IAM role.</p>
                <h1 className="text-center">Usage</h1>
                <p>Clicking "Get Started" below will take you through the process of setting up an IAM role and key credentials in your AWS account. The output of this GUI tool is a CloudFormation Stack template file. You will then need to use this template file in your AWS account to generate the role and credentials.</p>
                <p>For your privacy, none of the information you enter into this GUI will be saved anywhere (remote or local).</p>
                <div className="flex flex-row items-center justify-center gap-4 mb-8">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button variant="secondary" className="w-56" onClick={() => open("https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazons3.html")}>Amazon S3 Docs</Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="my-0">Read the Amazon S3 docs for more information about IAM actions.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Link to="/setup" className={cn(buttonVariants({ variant: "default" }), 'w-56')}>Get Started</Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="my-0">Get Started</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </main>
    );
};