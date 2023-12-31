import AWSCloudFormationSetupForm from "./forms/cloudformation";

export default function AWSCloudFormationSetup() {
    return (
        <main className="flex justify-center">
            <div className="max-w-screen-md px-4 w-full items-center flex flex-col">
                <h1 className="text-center">Setup</h1>
                <AWSCloudFormationSetupForm />
            </div>
        </main>
    );
};