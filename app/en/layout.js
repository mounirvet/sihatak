import HeaderEn from '../../components/HeaderEn';
import FooterEn from '../../components/FooterEn';

// English section layout. The root <html> is Arabic/RTL, so we wrap the English
// section in an LTR container with English chrome. Pages set lang via metadata
// and the wrapper sets dir="ltr" for correct text direction.

export default function EnLayout({ children }) {
  return (
    <div dir="ltr" lang="en" className="text-left">
      <HeaderEn />
      <main>{children}</main>
      <FooterEn />
    </div>
  );
}
