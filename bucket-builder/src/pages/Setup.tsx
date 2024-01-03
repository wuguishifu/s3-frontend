import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function Setup() {
    return (
        <main className="flex justify-center">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="absolute top-0 left-0">
                        <Link className={cn(buttonVariants({ variant: "ghost" }))} to="/"><ChevronLeft /></Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="my-0">back</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <div className="max-w-screen-md px-4">
                <h1 className="text-center">Setup</h1>
            </div>
        </main>
    );
};