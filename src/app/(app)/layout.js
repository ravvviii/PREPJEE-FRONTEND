import { RequireAuth } from '@/components/common/route-guard';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/layout/container';

export default function AppLayout({ children }) {
  return (
    <RequireAuth>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1 py-2">
          <Container>{children}</Container>
        </main>
        <Footer />
      </div>
    </RequireAuth>
  );
}
