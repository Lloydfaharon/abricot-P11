
import Image from "next/image";


export default function Footer() {
    return (
        <footer className="w-full border border-gray-200 bg-white px-7 py-6 flex items-center justify-between ">

            <Image src="/images/Logo 2.svg" alt="Logo" width={100} height={100} />
            <h1>Abricot 2025</h1>
        </footer>
    );
}