// app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  // Dès qu'on arrive sur le site, on redirige vers le login
  redirect('/login');
  
  // Ce return n'est jamais atteint, mais nécessaire pour TypeScript
  return null;
}