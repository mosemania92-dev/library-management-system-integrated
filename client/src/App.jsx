import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import BookDetail from "./pages/BookDetail.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ReadingListPage from "./pages/ReadingListPage.jsx";
import SpaceBookingPage from "./pages/SpaceBookingPage.jsx";
import BorrowRequestPage from "./pages/BorrowRequestPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import { ReadingListProvider } from "./context/ReadingListContext.jsx";

export default function App() {
  return <ReadingListProvider>
    <Navbar />
    <main className="container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reading-list" element={<ReadingListPage />} />
        <Route path="/space-booking" element={<ProtectedRoute><SpaceBookingPage /></ProtectedRoute>} />
        <Route path="/borrow/:id" element={<ProtectedRoute><BorrowRequestPage /></ProtectedRoute>} />
        <Route path="*" element={<div className="state-box"><h2>Page not found</h2></div>} />
      </Routes>
    </main>
  </ReadingListProvider>;
}
