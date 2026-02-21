import Header from '@/app/components/header/Header';
import Footer from '@/app/components/footer/Footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-dvh bg-gray-50">
            <Header />
            <div className="w-full max-w-screen-2xl mx-auto px-6 flex-1 py-8">
                {children}
            </div>
            <Footer />
        </div>
    );
}