import Link from "next/link"

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-6 py-6 sm:px-10">
            <Link href="/" className="flex items-center">
                <img
                    src="/assets/mainwebsitelogo.png"
                    alt="Machon Aleh Zayis"
                    className="h-[40px] w-auto object-contain sm:h-[48px]"
                />
            </Link>
            <a
                href="https://alehzayis.com/"
                className="font-body text-[0.8rem] font-semibold uppercase tracking-[0.17em] text-[#4A1521]/60 hover:text-[#4A1521]"
            >
                Main Website
            </a>
        </nav>
    )
}
export default Navbar