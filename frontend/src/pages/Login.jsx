import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Menambahkan icon Eye dan EyeOff untuk fitur lihat password
import { LogIn, User, Lock, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // State baru untuk mengatur apakah password terlihat atau tidak
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State untuk loading button
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Mulai loading

    try {
      // Pastikan URL ini sesuai dengan port backend Anda (5000)
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { username, password });      
      // Simpan data sesi
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Notifikasi Sukses
      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil!',
        text: `Selamat datang kembali, ${response.data.user.name}.`,
        timer: 1500,
        showConfirmButton: false,
        background: '#fff',
        confirmButtonColor: '#BF3131'
      });
      
      // Redirect sesuai role
      setTimeout(() => {
          if (response.data.user.role === 'admin') navigate('/admin');
          else navigate('/kasir');
      }, 1500);

    } catch (error) {
      // --- BAGIAN PENTING UNTUK DEBUGGING ---
      // Ini akan mencetak error lengkap ke Console Browser (Tekan F12)
      console.error("🔥 DETAIL ERROR LOGIN:", error);

      let errorMessage = 'Terjadi kesalahan pada server.';
      
      // Cek jenis errornya
      if (error.response) {
        // Server merespon tapi dengan status error (misal: 400 password salah, 404 username tidak ada)
        errorMessage = error.response.data.message || 'Login gagal. Periksa kembali data Anda.';
      } else if (error.request) {
        // Request terkirim tapi tidak ada respon (Backend MATI atau port salah)
        errorMessage = 'Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda.';
      }

      Swal.fire({
        icon: 'error',
        title: 'Oops, Login Gagal!',
        text: errorMessage,
        confirmButtonColor: '#BF3131' // Warna merah RM Doa Bunda
      });
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  return (
    <div className="min-h-screen bg-doabunda-light flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/food.png')]">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-t-8 border-doabunda-primary">
        
        {/* Header Merah */}
        <div className="bg-doabunda-dark p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-doabunda-primary opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-doabunda-gold to-transparent"></div>
          <h1 className="relative z-10 text-doabunda-gold text-4xl font-black uppercase tracking-tighter drop-shadow-md">
            RM. DOA BUNDA
          </h1>
          <p className="relative z-10 text-white/90 mt-3 text-sm font-medium tracking-widest uppercase">
            Sistem Point of Sale Premium
          </p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="p-10 space-y-7">
          
          {/* Input Username */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-doabunda-primary transition-colors" size={22} />
              <input 
                type="text" 
                placeholder="Masukkan username (contoh: admin)" 
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-doabunda-primary focus:ring-4 focus:ring-doabunda-primary/20 outline-none transition-all duration-200 bg-gray-50 focus:bg-white font-medium text-gray-800 placeholder:text-gray-400"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Input Password dengan Tombol Intip */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-doabunda-primary transition-colors" size={22} />
              <input 
                // Tipe input berubah berdasarkan state showPassword
                type={showPassword ? "text" : "password"} 
                placeholder="Masukkan password" 
                className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-300 focus:border-doabunda-primary focus:ring-4 focus:ring-doabunda-primary/20 outline-none transition-all duration-200 bg-gray-50 focus:bg-white font-medium text-gray-800 placeholder:text-gray-400"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              
              {/* Tombol Mata (Toggle Password) */}
              <button
                type="button" // Penting: type="button" agar tidak men-submit form
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-doabunda-primary transition-colors p-1 focus:outline-none"
                tabIndex="-1" // Agar tidak bisa di-tab
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
             <p className="text-xs text-gray-500 mt-2 ml-1 italic">
              *Klik ikon mata untuk melihat password.
            </p>
          </div>

          {/* Tombol Submit dengan Efek Loading */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-doabunda-primary to-doabunda-dark text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
               // Spinner sederhana saat loading
               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : (
              <>
                <LogIn size={22} strokeWidth={2.5} /> 
                <span className="tracking-wider">MASUK KE SISTEM</span>
              </>
            )}
          </button>
        </form>
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 font-medium border-t border-gray-100">
          &copy; 2024 RM. Doa Bunda IT Division
        </div>
      </div>
    </div>
  );
};

export default Login;