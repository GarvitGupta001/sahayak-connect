import { UserProvider } from "@/context/UserContext";
import ChatProvider from "@/context/ChatContext";
import "./globals.css";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <title>Sahayak Connect</title>
                <link rel="icon" href="/sahaayaklogo%20(1).png" />
            </head>
            <body>
                <UserProvider>
                    <ChatProvider>{children}</ChatProvider>
                </UserProvider>
            </body>
        </html>
    );
}
