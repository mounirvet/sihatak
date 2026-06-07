import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Arabic section layout — renders the Arabic (RTL) chrome around all Arabic
// pages. The root <html> is already lang="ar" dir="rtl", so this just adds
// the header/footer. English pages live under /en/ with their own layout.

export default function ArLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
