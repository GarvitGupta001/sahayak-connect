import { UserProvider } from "@/context/UserContext";
import "./globals.css";
export const metadata = {
    title: "Sahayak Connect",
    description:
        "Multilingual AI Agent for Welfare Access & Document Assistance",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <UserProvider>{children}</UserProvider>
            </body>
        </html>
    );
}
