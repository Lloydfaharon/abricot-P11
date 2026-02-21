// app/components/AuthLayout.tsx
import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subTitle?: string; // Optionnel
  imageSrc: string;
  bottomText: string;
  linkText: string;
  linkUrl: string;
}

export default function AuthLayout({
  children,
  title,
  imageSrc,
  bottomText,
  linkText,
  linkUrl,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      {/* --- CÔTÉ GAUCHE (Formulaire) --- */}
      <main className=" lg:w-150 w-full  flex flex-col gap-12 md:gap-24 justify-center items-center lg:gap-40  px-8 sm:px-12 lg:px-10 py-12">
        {/* Logo ABRICOT */}
        <div className="mb-12">
          <Image
            src="/images/logo.svg" // Chemin depuis le dossier 'public'
            alt="Logo Abricot"
            width={180} // Largeur en pixels (ajuste selon ton image)
            height={60} // Hauteur en pixels (ajuste pour garder les proportions)
            priority // Important : charge le logo en priorité
            className="h-auto w-auto" // Optionnel : garde le ratio si tu changes la taille CSS
          />
        </div>

        <div className="mb-8 w-full flex flex-col justify-center items-center gap-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-2">{title}</h1>
          {/* Le formulaire spécifique (Login ou Register) s'insère ici */}
          <div className="w-full max-w-md">{children}</div>
        </div>

        <div className="mt-8 gap-2 flex text-sm text-black">
          {bottomText}{" "}
          <Link
            href={linkUrl}
            className="text-orange-500 font-normal hover:underline"
          >
            {linkText}
          </Link>
        </div>
      </main>

      {/* --- CÔTÉ DROIT (Image) --- */}
      {/* Hidden sur mobile, visible à partir de lg (large screens) */}
      <div className="hidden lg:block w-1/1 relative bg-gray-100">
        <Image
          src={imageSrc}
          alt="Illustration"
          fill
          sizes="(max-width: 1024px) 0vw, 50vw"
          className="object-cover"
          priority // Important pour l'image au dessus de la ligne de flottaison
        />
      </div>
    </div>
  );
}
