// // src/pages/platform/ActivateCompanyAccount.jsx
// // صاحب الشركة بيجي من الإيميل → يحط باسورد → يتـ login تلقائي → redirect للـ subdomain

// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { activateAccount } from '../../services/platform/platformTenants.service';

// /* ── Password strength ── */
// function getStrength(pw) {
//   let score = 0;
//   if (pw.length >= 8)           score++;
//   if (/[A-Z]/.test(pw))         score++;
//   if (/[0-9]/.test(pw))         score++;
//   if (/[^A-Za-z0-9]/.test(pw))  score++;
//   return score; // 0-4
// }

// const STRENGTH_CONFIG = [
//   { label: '',         color: '#e2e8f0', bg: '#e2e8f0' },
//   { label: 'Weak',     color: '#ef4444', bg: '#ef4444' },
//   { label: 'Fair',     color: '#f97316', bg: '#f97316' },
//   { label: 'Good',     color: '#eab308', bg: '#eab308' },
//   { label: 'Strong',   color: '#22c55e', bg: '#22c55e' },
// ];

// function PasswordStrengthBar({ password }) {
//   const score = getStrength(password);
//   const cfg   = STRENGTH_CONFIG[score];
//   return password ? (
//     <div style={{ marginTop: 8 }}>
//       <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
//         {[1,2,3,4].map(i => (
//           <div key={i} style={{
//             flex: 1, height: 4, borderRadius: 99,
//             background: i <= score ? cfg.bg : '#e2e8f0',
//             transition: 'background .2s',
//           }} />
//         ))}
//       </div>
//       {cfg.label && (
//         <span style={{ fontSize: 12, color: cfg.color, fontWeight: 600 }}>
//           {cfg.label}
//         </span>
//       )}
//     </div>
//   ) : null;
// }

// /* ── Eye toggle ── */
// function PasswordInput({ value, onChange, placeholder, id, disabled }) {
//   const [show, setShow] = useState(false);
//   return (
//     <div style={{ position: 'relative' }}>
//       <input
//         id={id}
//         type={show ? 'text' : 'password'}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         disabled={disabled}
//         required
//         style={{
//           width: '100%', padding: '12px 44px 12px 16px',
//           border: '1.5px solid #e2e8f0', borderRadius: 10,
//           fontSize: 15, outline: 'none', background: '#fff',
//           transition: 'border-color .2s',
//           boxSizing: 'border-box',
//         }}
//         onFocus={e  => e.target.style.borderColor = '#3b82f6'}
//         onBlur={e   => e.target.style.borderColor = '#e2e8f0'}
//       />
//       <button type="button" onClick={() => setShow(s => !s)}
//         style={{
//           position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
//           background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#94a3b8',
//         }}>
//         <i className={`fas ${show ? 'fa-eye-slash' : 'fa-eye'}`} />
//       </button>
//     </div>
//   );
// }

// /* ════════════════════════════════════════════════
//    Main Page
// ════════════════════════════════════════════════ */
// export default function ActivateCompanyAccount() {
//   const { token }   = useParams();
//   const navigate    = useNavigate();

//   const [step,     setStep]     = useState('loading'); // loading | form | success | error
//   const [pw,       setPw]       = useState('');
//   const [pwConfirm,setPwConfirm]= useState('');
//   const [loading,  setLoading]  = useState(false);
//   const [errMsg,   setErrMsg]   = useState('');
//   const [company,  setCompany]  = useState(null); // من الـ token decoded
//   const [countdown,setCountdown]= useState(5);

//   /* ── Decode token info (client-side) ── */
//   useEffect(() => {
//     if (!token) { setStep('error'); setErrMsg('No activation token found.'); return; }
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       if (payload.exp * 1000 < Date.now()) {
//         setStep('error'); setErrMsg('This activation link has expired. Please contact support.');
//         return;
//       }
//       setCompany({ email: payload.email });
//       setStep('form');
//     } catch {
//       setStep('error'); setErrMsg('Invalid activation link.');
//     }
//   }, [token]);

//   /* ── Countdown redirect after success ── */
//   useEffect(() => {
//     if (step !== 'success') return;
//     const t = setInterval(() => setCountdown(c => {
//       if (c <= 1) { clearInterval(t); return 0; }
//       return c - 1;
//     }), 1000);
//     return () => clearInterval(t);
//   }, [step]);

//   /* ── Submit ── */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrMsg('');

//     if (pw !== pwConfirm) { setErrMsg('Passwords do not match.'); return; }
//     if (getStrength(pw) < 2) { setErrMsg('Password is too weak. Use uppercase letters and numbers.'); return; }

//     try {
//       setLoading(true);
//       const res = await activateAccount(token, pw);


// //       const data = res.data;

// //       // ✅ بنحفظ الـ token
// //       if (data.token) localStorage.setItem('token', data.token);

// //       setStep('success');


// // const subdomain = window.location.hostname.split('.')[0];

// //       // ✅ redirect بعد 5 ثواني
// //    setTimeout(() => {
// //   window.location.href = `http://${subdomain}.localhost:5173`;
// // }, 5000);
// // ✅ الصح — تاخد الـ subdomain من الـ response
// const data = res.data;
// if (data.token) localStorage.setItem('token', data.token);
// // data.redirectUrl جاي من الباك
// setTimeout(() => { window.location.href = data.redirectUrl; }, 5000);


//     } catch (err) {
//       const msg = err.response?.data?.message || 'Activation failed. Please try again.';
//       if (msg.toLowerCase().includes('expired')) {
//         setStep('error'); setErrMsg('This activation link has expired.');
//       } else {
//         setErrMsg(msg);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ════════════ RENDER ════════════ */
//   return (
//     <div style={{
//       minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
//       background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
//       fontFamily: "'Segoe UI', system-ui, sans-serif", padding: 16,
//     }}>

//       {/* Background pattern */}
//       <div style={{
//         position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden',
//         background: `radial-gradient(circle at 20% 80%, rgba(59,130,246,.12) 0%, transparent 50%),
//                      radial-gradient(circle at 80% 20%, rgba(99,102,241,.10) 0%, transparent 50%)`,
//       }} />

//       <div style={{
//         width: '100%', maxWidth: 440, position: 'relative', zIndex: 1,
//         animation: 'fadeUp .5s ease both',
//       }}>

//         {/* ── Logo / Brand ── */}
//         <div style={{ textAlign: 'center', marginBottom: 32 }}>
//           <div style={{
//             width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px',
//             background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             boxShadow: '0 8px 32px rgba(59,130,246,.4)',
//           }}>
//             <i className="fas fa-shield-alt" style={{ fontSize: 24, color: '#fff' }} />
//           </div>
//           <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>
//             WorkGuard
//           </div>
//           <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
//             Workforce Management Platform
//           </div>
//         </div>

//         {/* ── Card ── */}
//         <div style={{
//           background: 'rgba(255,255,255,.97)',
//           borderRadius: 20, overflow: 'hidden',
//           boxShadow: '0 24px 64px rgba(0,0,0,.35)',
//         }}>

//           {/* ══ LOADING ══ */}
//           {step === 'loading' && (
//             <div style={{ padding: '48px 32px', textAlign: 'center' }}>
//               <div className="spinner-border text-primary mb-3" />
//               <div style={{ color: '#64748b' }}>Verifying your activation link...</div>
//             </div>
//           )}

//           {/* ══ ERROR ══ */}
//           {step === 'error' && (
//             <div style={{ padding: '48px 32px', textAlign: 'center' }}>
//               <div style={{
//                 width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px',
//                 background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center',
//               }}>
//                 <i className="fas fa-times-circle" style={{ fontSize: 28, color: '#ef4444' }} />
//               </div>
//               <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
//                 Link Invalid or Expired
//               </div>
//               <div style={{ color: '#64748b', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
//                 {errMsg}
//               </div>
//               <button onClick={() => navigate('/')}
//                 style={{
//                   padding: '10px 24px', borderRadius: 8, border: 'none',
//                   background: '#3b82f6', color: '#fff', fontWeight: 600,
//                   cursor: 'pointer', fontSize: 14,
//                 }}>
//                 Back to Login
//               </button>
//             </div>
//           )}

//           {/* ══ FORM ══ */}
//           {step === 'form' && (
//             <>
//               {/* Header band */}
//               <div style={{
//                 background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
//                 padding: '28px 32px',
//               }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                   <div style={{
//                     width: 44, height: 44, borderRadius: 12,
//                     background: 'rgba(255,255,255,.2)',
//                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     flexShrink: 0,
//                   }}>
//                     <i className="fas fa-key" style={{ fontSize: 20, color: '#fff' }} />
//                   </div>
//                   <div>
//                     <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>
//                       Activate Your Account
//                     </div>
//                     <div style={{ color: 'rgba(255,255,255,.8)', fontSize: 13 }}>
//                       Set a password to get started
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div style={{ padding: '28px 32px' }}>

//                 {/* Email badge */}
//                 {company?.email && (
//                   <div style={{
//                     display: 'flex', alignItems: 'center', gap: 10,
//                     background: '#f0f9ff', borderRadius: 10, padding: '10px 14px', marginBottom: 24,
//                     border: '1px solid #bae6fd',
//                   }}>
//                     <i className="fas fa-envelope" style={{ color: '#3b82f6', fontSize: 14 }} />
//                     <div>
//                       <div style={{ fontSize: 11, color: '#64748b' }}>Activating account for</div>
//                       <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{company.email}</div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Error */}
//                 {errMsg && (
//                   <div style={{
//                     background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
//                     padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#dc2626',
//                     display: 'flex', alignItems: 'flex-start', gap: 8,
//                   }}>
//                     <i className="fas fa-exclamation-circle" style={{ marginTop: 2 }} />
//                     {errMsg}
//                   </div>
//                 )}

//                 <form onSubmit={handleSubmit}>
//                   {/* Password */}
//                   <div style={{ marginBottom: 20 }}>
//                     <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
//                       Password
//                     </label>
//                     <PasswordInput
//                       id="password" value={pw}
//                       onChange={e => setPw(e.target.value)}
//                       placeholder="Min 8 chars, uppercase, number"
//                       disabled={loading}
//                     />
//                     <PasswordStrengthBar password={pw} />
//                   </div>

//                   {/* Confirm */}
//                   <div style={{ marginBottom: 24 }}>
//                     <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
//                       Confirm Password
//                     </label>
//                     <PasswordInput
//                       id="confirm" value={pwConfirm}
//                       onChange={e => setPwConfirm(e.target.value)}
//                       placeholder="Re-enter your password"
//                       disabled={loading}
//                     />
//                     {pwConfirm && pw !== pwConfirm && (
//                       <div style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>
//                         <i className="fas fa-times me-1" />Passwords do not match
//                       </div>
//                     )}
//                     {pwConfirm && pw === pwConfirm && pw.length > 0 && (
//                       <div style={{ fontSize: 12, color: '#22c55e', marginTop: 6 }}>
//                         <i className="fas fa-check me-1" />Passwords match
//                       </div>
//                     )}
//                   </div>

//                   {/* Requirements */}
//                   <div style={{
//                     background: '#f8fafc', borderRadius: 10, padding: '12px 16px', marginBottom: 24,
//                     fontSize: 12, color: '#64748b',
//                   }}>
//                     <div style={{ fontWeight: 600, marginBottom: 6, color: '#374151' }}>Password requirements:</div>
//                     {[
//                       ['At least 8 characters',       pw.length >= 8],
//                       ['One uppercase letter (A-Z)',   /[A-Z]/.test(pw)],
//                       ['One number (0-9)',              /[0-9]/.test(pw)],
//                     ].map(([label, met]) => (
//                       <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
//                         <i className={`fas fa-${met ? 'check-circle' : 'circle'}`}
//                           style={{ color: met ? '#22c55e' : '#cbd5e1', fontSize: 12 }} />
//                         <span style={{ color: met ? '#16a34a' : '#94a3b8' }}>{label}</span>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Submit */}
//                   <button type="submit" disabled={loading || pw !== pwConfirm || getStrength(pw) < 2}
//                     style={{
//                       width: '100%', padding: '14px', borderRadius: 10, border: 'none',
//                       background: loading || pw !== pwConfirm || getStrength(pw) < 2
//                         ? '#94a3b8'
//                         : 'linear-gradient(135deg, #3b82f6, #6366f1)',
//                       color: '#fff', fontWeight: 700, fontSize: 15,
//                       cursor: loading || pw !== pwConfirm || getStrength(pw) < 2 ? 'not-allowed' : 'pointer',
//                       transition: 'all .2s', boxShadow: '0 4px 16px rgba(59,130,246,.3)',
//                     }}>
//                     {loading ? (
//                       <><span className="spinner-border spinner-border-sm me-2" />Activating...</>
//                     ) : (
//                       <><i className="fas fa-rocket me-2" />Activate & Login</>
//                     )}
//                   </button>
//                 </form>
//               </div>
//             </>
//           )}

//           {/* ══ SUCCESS ══ */}
//           {step === 'success' && (
//             <div style={{ padding: '48px 32px', textAlign: 'center' }}>
//               {/* Animated checkmark */}
//               <div style={{
//                 width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px',
//                 background: 'linear-gradient(135deg, #22c55e, #16a34a)',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 boxShadow: '0 8px 32px rgba(34,197,94,.35)',
//                 animation: 'pop .4s cubic-bezier(.175,.885,.32,1.275) both',
//               }}>
//                 <i className="fas fa-check" style={{ fontSize: 36, color: '#fff' }} />
//               </div>

//               <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
//                 Account Activated! 🎉
//               </div>
//               <div style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
//                 Your WorkGuard account is ready.<br />
//                 You'll be redirected automatically in <strong>{countdown}</strong> second{countdown !== 1 ? 's' : ''}...
//               </div>

//               {/* Progress bar */}
//               <div style={{ background: '#e2e8f0', borderRadius: 99, height: 6, overflow: 'hidden', marginBottom: 24 }}>
//                 <div style={{
//                   height: '100%', borderRadius: 99,
//                   background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
//                   width: `${((5 - countdown) / 5) * 100}%`,
//                   transition: 'width 1s linear',
//                 }} />
//               </div>

//               <button onClick={() => { window.location.href = '/'; }}
//                 style={{
//                   padding: '12px 32px', borderRadius: 10, border: 'none',
//                   background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
//                   color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14,
//                   boxShadow: '0 4px 16px rgba(59,130,246,.3)',
//                 }}>
//                 <i className="fas fa-arrow-right me-2" />Go to Dashboard
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div style={{ textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,.4)', fontSize: 12 }}>
//           Need help? Contact <a href="mailto:support@workguard.app" style={{ color: 'rgba(255,255,255,.6)' }}>
//             support@workguard.app
//           </a>
//         </div>
//       </div>

//       {/* Animations */}
//       <style>{`
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(24px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes pop {
//           from { opacity: 0; transform: scale(.5); }
//           to   { opacity: 1; transform: scale(1); }
//         }
//       `}</style>
//     </div>
//   );
// }

// src/pages/platform/ActivateCompanyAccount.jsx
// صاحب الشركة بيجي من الإيميل → يحط باسورد → يتـ login تلقائي → redirect للـ subdomain

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activateAccount } from '../../services/platform/platformTenants.service';

/* ── Password strength ── */
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  return score; // 0-4
}

const STRENGTH_CONFIG = [
  { label: '',         color: '#e2e8f0', bg: '#e2e8f0' },
  { label: 'Weak',     color: '#ef4444', bg: '#ef4444' },
  { label: 'Fair',     color: '#f97316', bg: '#f97316' },
  { label: 'Good',     color: '#eab308', bg: '#eab308' },
  { label: 'Strong',   color: '#22c55e', bg: '#22c55e' },
];

function PasswordStrengthBar({ password }) {
  const score = getStrength(password);
  const cfg   = STRENGTH_CONFIG[score];
  return password ? (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 99,
            background: i <= score ? cfg.bg : '#e2e8f0',
            transition: 'background .2s',
          }} />
        ))}
      </div>
      {cfg.label && (
        <span style={{ fontSize: 12, color: cfg.color, fontWeight: 600 }}>
          {cfg.label}
        </span>
      )}
    </div>
  ) : null;
}

/* ── Eye toggle ── */
function PasswordInput({ value, onChange, placeholder, id, disabled }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required
        style={{
          width: '100%', padding: '12px 44px 12px 16px',
          border: '1.5px solid #e2e8f0', borderRadius: 10,
          fontSize: 15, outline: 'none', background: '#fff',
          transition: 'border-color .2s',
          boxSizing: 'border-box',
        }}
        onFocus={e  => e.target.style.borderColor = '#3b82f6'}
        onBlur={e   => e.target.style.borderColor = '#e2e8f0'}
      />
      <button type="button" onClick={() => setShow(s => !s)}
        style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#94a3b8',
        }}>
        <i className={`fas ${show ? 'fa-eye-slash' : 'fa-eye'}`} />
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════
   Main Page
════════════════════════════════════════════════ */
export default function ActivateCompanyAccount() {
  const { token }   = useParams();
  const navigate    = useNavigate();

  const [step,     setStep]     = useState('loading'); // loading | form | success | error
  const [pw,       setPw]       = useState('');
  const [pwConfirm,setPwConfirm]= useState('');
  const [loading,  setLoading]  = useState(false);
  const [errMsg,   setErrMsg]   = useState('');
  const [company,  setCompany]  = useState(null); // من الـ token decoded
  const [countdown,setCountdown]= useState(5);

  /* ── Decode token info (client-side) ── */
  useEffect(() => {
    if (!token) { setStep('error'); setErrMsg('No activation token found.'); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        setStep('error'); setErrMsg('This activation link has expired. Please contact support.');
        return;
      }
      setCompany({ email: payload.email });
      setStep('form');
    } catch {
      setStep('error'); setErrMsg('Invalid activation link.');
    }
  }, [token]);

  /* ── Countdown redirect after success ── */
  useEffect(() => {
    if (step !== 'success') return;
    const t = setInterval(() => setCountdown(c => {
      if (c <= 1) { clearInterval(t); return 0; }
      return c - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [step]);

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');

    if (pw !== pwConfirm) { setErrMsg('Passwords do not match.'); return; }
    if (getStrength(pw) < 2) { setErrMsg('Password is too weak. Use uppercase letters and numbers.'); return; }

    try {
      setLoading(true);
      const res = await activateAccount(token, pw);
      const data = res.data;

      // ✅ بنحفظ الـ token
      if (data.token) localStorage.setItem('token', data.token);

      setStep('success');

      // ✅ redirect للـ subdomain من الـ response
      const redirectUrl = data.redirectUrl || '/';
      setTimeout(() => { window.location.href = redirectUrl; }, 5000);

    } catch (err) {
      const msg = err.response?.data?.message || 'Activation failed. Please try again.';
      if (msg.toLowerCase().includes('expired')) {
        setStep('error'); setErrMsg('This activation link has expired.');
      } else {
        setErrMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ════════════ RENDER ════════════ */
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      fontFamily: "'Segoe UI', system-ui, sans-serif", padding: 16,
    }}>

      {/* Background pattern */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden',
        background: `radial-gradient(circle at 20% 80%, rgba(59,130,246,.12) 0%, transparent 50%),
                     radial-gradient(circle at 80% 20%, rgba(99,102,241,.10) 0%, transparent 50%)`,
      }} />

      <div style={{
        width: '100%', maxWidth: 440, position: 'relative', zIndex: 1,
        animation: 'fadeUp .5s ease both',
      }}>

        {/* ── Logo / Brand ── */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(59,130,246,.4)',
          }}>
            <i className="fas fa-shield-alt" style={{ fontSize: 24, color: '#fff' }} />
          </div>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>
            WorkGuard
          </div>
          <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
            Workforce Management Platform
          </div>
        </div>

        {/* ── Card ── */}
        <div style={{
          background: 'rgba(255,255,255,.97)',
          borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,.35)',
        }}>

          {/* ══ LOADING ══ */}
          {step === 'loading' && (
            <div style={{ padding: '48px 32px', textAlign: 'center' }}>
              <div className="spinner-border text-primary mb-3" />
              <div style={{ color: '#64748b' }}>Verifying your activation link...</div>
            </div>
          )}

          {/* ══ ERROR ══ */}
          {step === 'error' && (
            <div style={{ padding: '48px 32px', textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px',
                background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className="fas fa-times-circle" style={{ fontSize: 28, color: '#ef4444' }} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                Link Invalid or Expired
              </div>
              <div style={{ color: '#64748b', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
                {errMsg}
              </div>
              <button onClick={() => navigate('/')}
                style={{
                  padding: '10px 24px', borderRadius: 8, border: 'none',
                  background: '#3b82f6', color: '#fff', fontWeight: 600,
                  cursor: 'pointer', fontSize: 14,
                }}>
                Back to Login
              </button>
            </div>
          )}

          {/* ══ FORM ══ */}
          {step === 'form' && (
            <>
              {/* Header band */}
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                padding: '28px 32px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'rgba(255,255,255,.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <i className="fas fa-key" style={{ fontSize: 20, color: '#fff' }} />
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>
                      Activate Your Account
                    </div>
                    <div style={{ color: 'rgba(255,255,255,.8)', fontSize: 13 }}>
                      Set a password to get started
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '28px 32px' }}>

                {/* Email badge */}
                {company?.email && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: '#f0f9ff', borderRadius: 10, padding: '10px 14px', marginBottom: 24,
                    border: '1px solid #bae6fd',
                  }}>
                    <i className="fas fa-envelope" style={{ color: '#3b82f6', fontSize: 14 }} />
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>Activating account for</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{company.email}</div>
                    </div>
                  </div>
                )}

                {/* Error */}
                {errMsg && (
                  <div style={{
                    background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
                    padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#dc2626',
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                  }}>
                    <i className="fas fa-exclamation-circle" style={{ marginTop: 2 }} />
                    {errMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Password */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
                      Password
                    </label>
                    <PasswordInput
                      id="password" value={pw}
                      onChange={e => setPw(e.target.value)}
                      placeholder="Min 8 chars, uppercase, number"
                      disabled={loading}
                    />
                    <PasswordStrengthBar password={pw} />
                  </div>

                  {/* Confirm */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
                      Confirm Password
                    </label>
                    <PasswordInput
                      id="confirm" value={pwConfirm}
                      onChange={e => setPwConfirm(e.target.value)}
                      placeholder="Re-enter your password"
                      disabled={loading}
                    />
                    {pwConfirm && pw !== pwConfirm && (
                      <div style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>
                        <i className="fas fa-times me-1" />Passwords do not match
                      </div>
                    )}
                    {pwConfirm && pw === pwConfirm && pw.length > 0 && (
                      <div style={{ fontSize: 12, color: '#22c55e', marginTop: 6 }}>
                        <i className="fas fa-check me-1" />Passwords match
                      </div>
                    )}
                  </div>

                  {/* Requirements */}
                  <div style={{
                    background: '#f8fafc', borderRadius: 10, padding: '12px 16px', marginBottom: 24,
                    fontSize: 12, color: '#64748b',
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: 6, color: '#374151' }}>Password requirements:</div>
                    {[
                      ['At least 8 characters',       pw.length >= 8],
                      ['One uppercase letter (A-Z)',   /[A-Z]/.test(pw)],
                      ['One number (0-9)',              /[0-9]/.test(pw)],
                    ].map(([label, met]) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <i className={`fas fa-${met ? 'check-circle' : 'circle'}`}
                          style={{ color: met ? '#22c55e' : '#cbd5e1', fontSize: 12 }} />
                        <span style={{ color: met ? '#16a34a' : '#94a3b8' }}>{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={loading || pw !== pwConfirm || getStrength(pw) < 2}
                    style={{
                      width: '100%', padding: '14px', borderRadius: 10, border: 'none',
                      background: loading || pw !== pwConfirm || getStrength(pw) < 2
                        ? '#94a3b8'
                        : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                      color: '#fff', fontWeight: 700, fontSize: 15,
                      cursor: loading || pw !== pwConfirm || getStrength(pw) < 2 ? 'not-allowed' : 'pointer',
                      transition: 'all .2s', boxShadow: '0 4px 16px rgba(59,130,246,.3)',
                    }}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Activating...</>
                    ) : (
                      <><i className="fas fa-rocket me-2" />Activate & Login</>
                    )}
                  </button>
                </form>
              </div>
            </>
          )}

          {/* ══ SUCCESS ══ */}
          {step === 'success' && (
            <div style={{ padding: '48px 32px', textAlign: 'center' }}>
              {/* Animated checkmark */}
              <div style={{
                width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(34,197,94,.35)',
                animation: 'pop .4s cubic-bezier(.175,.885,.32,1.275) both',
              }}>
                <i className="fas fa-check" style={{ fontSize: 36, color: '#fff' }} />
              </div>

              <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                Account Activated! 🎉
              </div>
              <div style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                Your WorkGuard account is ready.<br />
                You'll be redirected automatically in <strong>{countdown}</strong> second{countdown !== 1 ? 's' : ''}...
              </div>

              {/* Progress bar */}
              <div style={{ background: '#e2e8f0', borderRadius: 99, height: 6, overflow: 'hidden', marginBottom: 24 }}>
                <div style={{
                  height: '100%', borderRadius: 99,
                  background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                  width: `${((5 - countdown) / 5) * 100}%`,
                  transition: 'width 1s linear',
                }} />
              </div>

              <button onClick={() => { window.location.href = '/'; }}
                style={{
                  padding: '12px 32px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14,
                  boxShadow: '0 4px 16px rgba(59,130,246,.3)',
                }}>
                <i className="fas fa-arrow-right me-2" />Go to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,.4)', fontSize: 12 }}>
          Need help? Contact <a href="mailto:support@workguard.app" style={{ color: 'rgba(255,255,255,.6)' }}>
            support@workguard.app
          </a>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop {
          from { opacity: 0; transform: scale(.5); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}