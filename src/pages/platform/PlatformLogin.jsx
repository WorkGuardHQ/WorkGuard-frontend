// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { platformPost } from '../../helpers/platformApi';
// import { savePlatformToken } from '../../helpers/platformAuth';
// import Toast from '../../components/ui/Toast';
// import logo from '../../assets/logo.png';
// import '../../style/Login.css';


// export default function PlatformLogin() {
//   const navigate = useNavigate();
//   const [form, setForm]     = useState({ email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast]   = useState({ show: false, message: '', type: 'error' });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await platformPost('/auth/login', form);
//       savePlatformToken(res.data.token);
//       navigate('/platform/dashboard');
//     } catch (err) {
//       setToast({
//         show: true,
//         type: 'error',
//         message: err.response?.data?.message || 'Login failed',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

  
//   return (
//     <div className="login-container bg-gradient-login"
//     // style={{ minHeight: '100vh', background: '#0f172a98',
//     //   display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      
      
//       >
//       <div className="glass-card p-4 login-card animate-fade-in"
      
      
//     //   style={{ background: '#1e293b', borderRadius: 16, padding: '2.5rem',
//     //     width: '100%', maxWidth: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
        
//         >

//         <div
        
//         style={{ textAlign: 'center', marginBottom: '2rem' }}
        
//         >
//           <div 
//           className="text-center mb-4"
//         //   style={{ fontSize: '2rem', marginBottom: 8 }}
          
//           >
//             {/* 🛡️ */}
            
//                  <img src={logo} alt="WorkGuard HR" className="  mb-3 logo" style={{ width: '20rem', height: '8rem' }} />
//             </div>
//           <h4 style={{ color: '#f1f5f9', fontWeight: 700, margin: 0 }}>
//             WorkGuard Platform
//           </h4>
//           <p style={{ color: '#090d5e', fontSize: '0.85rem', marginTop: 4 }}>
//             System Administration
//           </p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label style={{ color: '#eff2f6', fontSize: '0.83rem', fontWeight: 600 }}>
//               Email
//             </label>
//             <input
//               type="email"
//               className="form-control mt-1"
//               style={{ background: '#dfe2e761', border: '1px solid #334155',
//                 color: '#f1f5f9', borderRadius: 8 }}
//               value={form.email}
//               onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label style={{ color: '#fbfdfe', fontSize: '0.83rem', fontWeight: 600 }}>
//               Password
//             </label>
//             <input
//               type="password"
//               className="form-control mt-1"
//               style={{ background: '#d8deec61', border: '1px solid #334155',
//                 color: '#f1f5f9', borderRadius: 8 }}
//               value={form.password}
//               onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="btn w-100 btn btn-success"
//             disabled={loading}
//             style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
//               color: '#fff', fontWeight: 600, borderRadius: 8, padding: '0.6rem' }}
//           > <i className="fas fa-sign-in-alt me-2"></i>
//             {loading
//               ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
//               : 'Sign In'}
//           </button>

          
//         </form>
//       </div>

//       <Toast
//         show={toast.show}
//         type={toast.type}
//         message={toast.message}
//         onClose={() => setToast(p => ({ ...p, show: false }))}
//       />
//     </div>
//   );
// }


// src/pages/platform/PlatformLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginPlatform } from '../../services/platform/platformAuth.service';
import { savePlatformToken } from '../../helpers/platformAuth';
import logo from '../../assets/platform.png';
import '../../style/PLATFORM/platform-login.css';

export default function PlatformLogin() {
  const navigate          = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginPlatform(form);
      savePlatformToken(res.data.token);
      navigate('/platform/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div
    //   style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    // >
    
      <div className="platform-login-page">
      {/* <div
        style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: '2.5rem', width: 420, maxWidth: '95vw' }}
      > */}
      <div className="platform-login-card">
        {/* Header */}
        <div className="text-center mb-4">
        <img
  src={logo}
  alt="WorkGuard HR"
  className="platform-login-logo"
/>
                   
                   {/* <div className="logo-fallback" style={{ display: 'none' }}> */}
                    {/* <div className="platform-login-header">
                     WorkGuard
                   </div> */}
          <h4 style={{ color: '#f1f5f9', fontWeight: 800, margin: 0 }}>
            WorkGuard Platform
          </h4>
          <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '0.85rem' }}>
            System Administration
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="alert mb-3"
            style={{ background: '#450a0a', border: '1px solid #ef4444', color: '#fca5a5', fontSize: '0.83rem' }}
          >
            <i className="fas fa-exclamation-circle me-2" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: 4, fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              className="platform-login-input"
              style={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }}
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: 4, fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              className="form-control"
              style={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }}
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required
            />
          </div>

          <button
            className="platform-login-btn"
          >
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
              : <><i className="fas fa-sign-in-alt me-2" />Sign In</>
            }
          </button>
        </form>
      </div>
    </div>
  );
}