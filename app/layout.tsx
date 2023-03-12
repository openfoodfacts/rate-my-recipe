import "./globals.css";
import "@fontsource/public-sans";
import StateProvider from "../redux/StateProvider";

export const metadata = {
  title: "Rate My Recipe",
  description: "Experiment with your recipe to get healthier ones.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StateProvider>{children}</StateProvider>
      </body>
    </html>
  );
}
