'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full px-6 py-4 z-20">
      <Link href="/" className="inline-block">
        <Image 
          src="/images/logo.png" 
          alt="EcoStock" 
          width={200}
          height={200}
          className="h-[130px] w-auto drop-shadow-lg hover:scale-105 transition-transform"
        />
      </Link>
    </header>
  );
}
