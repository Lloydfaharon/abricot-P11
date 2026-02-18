import Header from '@/app/components/header/Header';
import Footer from '@/app/components/footer/Footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-[100dvh] bg-gray-50">
            <Header />
            <div className="w-full max-w-[1440px] mx-auto px-6 flex-1 py-8">
                {children}
            </div>
            <Footer />
        </div>
    );
}