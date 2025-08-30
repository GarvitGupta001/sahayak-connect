import { UserProvider } from "@/context/UserContext";
import "./globals.css";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <title>Sahayak Connect</title>
                <link rel="icon" href="/logo.png" />
            </head>
            <body>
                <UserProvider>{children}</UserProvider>
            </body>
        </html>
    );
}
