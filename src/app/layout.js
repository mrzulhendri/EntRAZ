import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/components/AuthProvider";
import AudioPlayer from "@/components/AudioPlayer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "EntRAZ - Premium Entertainment Hub",
    description: "Live TV, VOD, Comics, and Music in one place. Ad-free, lightning fast, and TV-friendly.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="id">
            <body className={`${inter.className} selection:bg-indigo-500/30 overflow-x-hidden`}>
                <div className="relative min-h-screen">
                    {/* Animated Background Orbs */}
                    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
                        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-violet-500/10 blur-[100px] rounded-full animate-pulse delay-500" />
                    </div>

                    <AuthProvider>
                        <Navigation />

                        <main className="relative z-0 lg:ml-20 xl:ml-64 pb-20 lg:pb-0">
                            {children}
                        </main>

                        <AudioPlayer />
                    </AuthProvider>
                </div>
            </body>
        </html>
    );
}
