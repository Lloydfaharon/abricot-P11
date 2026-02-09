import Header from '@/app/components/header/Header';
import Footer from '@/app/components/footer/Footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <div className="mx-30 flex-1">{children}</div>
            <Footer />
        </div>
    );
}