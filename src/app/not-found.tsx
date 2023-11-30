import { Centered } from "./centered";

export default function NotFound() {
    return (
        <Centered>
            <div className="flex flex-col w-full px-[10%] h-full justify-center">
                <div className="text-[4em] font-semibold animate-fade-in fill-mode-both text-black">404 error</div>
                <div className="text-[2em] font-regular animate-fade-in fill-mode-both animation-delay-200 text-grey">Sorry! I'm not sure what you're looking for.</div>
                <ul className="list-disc list-inside pt-2 pl-4">
                    <li className="animate-fade-in animation-delay-400 fill-mode-both text-[1.2em] text-grey">
                        Try double checking the url.
                    </li>
                    <li className="animate-fade-in animation-delay-600 fill-mode-both text-[1.2em] text-grey">
                        If you think this is a mistake, feel free to <a className="text-blue underline" href="mailto:bramer.bo@gmail.com">email me</a>.
                    </li>
                </ul>
            </div>
        </Centered>
    );
};