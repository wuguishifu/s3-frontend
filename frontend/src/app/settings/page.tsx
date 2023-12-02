import AmazonS3 from "@/components/providers/Amazon-s3"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
    return (
        <div className="flex flex-col w-full">
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
                <div className="max-w-6xl w-full mx-auto grid gap-2">
                    <h1 className="font-semibold text-3xl">Cloud Storage Settings</h1>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 items-start gap-6 max-w-6xl w-full mx-auto">
                    <Card>
                        <CardHeader className="flex items-center gap-2">
                            <img
                                alt="AWS"
                                height="64"
                                width="64"
                                src="/providers/aws.svg"
                                className="object-contain aspect-square"
                            />
                            <CardTitle>Amazon S3</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AmazonS3 />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex items-center gap-2">
                            <img
                                alt="Google Drive"
                                height="64"
                                width="64"
                                src="/providers/google-drive.svg"
                                className="object-contain aspect-square"
                            />
                            <CardTitle>Google Drive</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full">Manage Settings</Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
