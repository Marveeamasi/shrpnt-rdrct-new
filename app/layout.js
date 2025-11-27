import "./globals.css";
import { Open_Sans } from "next/font/google";

export const metadata = {
  title: "File Transfer",
  description: "Read, download, edit, and create pdfs with sharepoint" ,
};

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // whatever you need
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        {children}
        </body>
    </html>
  );
}
 