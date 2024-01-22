import AWSCloudFormationSetupForm from "./cloudformation";

export default function Formation() {
    return (
        <main className="w-full items-center flex flex-col">
            <div className="max-w-screen-md">
                <h1 className="text-center">Bucket Store Formation</h1>
                <p className="text-muted-foreground">You can use this tool to create an AWS CloudFormation template to configure your AWS account with resources that allow Bucket Store to view and modify your buckets. For your privacy, none of the information you enter in this form will be stored anywhere (locally or remotely).</p>
                <AWSCloudFormationSetupForm />
            </div>
        </main>
    );
};