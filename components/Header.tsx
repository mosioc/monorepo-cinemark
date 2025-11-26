"use client";

import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>
    </header>
  );
};

export default Header;
