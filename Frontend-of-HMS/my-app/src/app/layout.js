import "./globals.css";
import { ThemeProvider } from "../app/context/ThemeContext";
import { AuthProvider } from "../app/context/AuthContext";
import { NotificationProvider } from "../app/context/NotificationContext";
import { RoleProvider } from "../app/context/RoleContext";


export const metadata = {
  title: "MediCare HMS",
  description: "Hospital Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <RoleProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </RoleProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}