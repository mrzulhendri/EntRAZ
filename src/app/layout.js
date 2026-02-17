import './globals.css';
import './RAZGlobals.css';
import './RAZTVMode.css';
import TVNavigation from './components/TVNavigation';

export const metadata = {
  title: 'EntRAZ - Entertainment Universe',
  description: 'Stream movies, anime, donghua and read comics, novels in one place.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TVNavigation />
        {children}
      </body>
    </html>
  );
}
