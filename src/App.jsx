import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import Products from "./pages/Products";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import EditProduct from "./pages/EditProduct";
import ForgotPassword from "./pages/ForgetPassword";
import AddTestimonial from "./components/AddTestimonial";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetails";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {" "}
      {/* ✅ use your repo name here */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/add-testimonial" element={<AddTestimonial />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
