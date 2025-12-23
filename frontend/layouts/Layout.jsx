import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import HeaderGuest from '../components/HeaderGuest';
import Footer from '../components/Footer';

export default function Layout({ children }) {
  // 1. Tạo state để lưu trạng thái đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 2. Lấy thông tin đường dẫn hiện tại (để khi chuyển trang nó tự check lại)
  const location = useLocation();

  useEffect(() => {
    // 3. Kiểm tra xem có token trong localStorage không
    // (Lúc làm chức năng Login thành công, bạn nhớ lưu token vào đây nhé)
    const token = localStorage.getItem('accessToken'); 
    
    // Nếu có token => true (Đã đăng nhập), ngược lại => false
    setIsLoggedIn(!!token); 
  }, [location]); // Chạy lại mỗi khi đổi trang

  return (
    <div className="flex flex-col min-h-screen">
      {/* 4. Điều kiện hiển thị Header */}
      {isLoggedIn ? <Header /> : <HeaderGuest />}
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
