import Header from '../components/Header';
import Footer from '../components/Footer';


export default function Layout({ children }) {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="">
        {children}
      </main>
      <Footer />
    </div>
  );
}
