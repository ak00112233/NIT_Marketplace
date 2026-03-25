import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../services/AuthContext';
import { useToast } from '../components/Toast';
import { useTheme } from '../services/ThemeContext';
import ThemedIcon from '../components/ThemedIcon';

const BRANCHES      = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'SET', 'ADS', 'MNC', 'AIML', 'PIE', 'VLSI', 'RA', 'IIOT', 'BArch'];
const BOYS_HOSTELS  = ['H1','H2','H3','H4','H5','H6','H7','H8','H9','H10','H11'];
const GIRLS_HOSTELS = ['KALPANA CHAWLA','BHAGIRATHI','CAUVERY','ALAKNANDA'];
const YEARS         = [1, 2, 3, 4, 5];

/* ────────────────────────────────────────────────────────── */
/*  Reusable labelled input                                   */
/* ────────────────────────────────────────────────────────── */
function Field({ label, icon, error, children }) {
  const { theme } = useTheme();
  return (
    <div>
      <label className="block text-xs font-semibold text-ink-2 mb-1">{label}</label>
      <div className="relative">
        {icon && (
          <ThemedIcon
            name={icon}
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            color={theme.pri}
          />
        )}
        {children}
      </div>
      {error && <p className="text-[11px] text-red-500 mt-1 font-medium">{error}</p>}
    </div>
  );
}

function inputCls(icon, err) {
  return `w-full ${icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 border rounded-xl text-sm bg-bg text-ink focus:outline-none focus:ring-2 transition-all ${
    err ? 'border-red-300 focus:ring-red-200' : 'border-border focus:ring-pri/20 focus:border-pri'
  }`;
}

/* Styled select with theme chevron arrow */
function SelectField({ label, error, value, onChange, placeholder, children }) {
  const { theme } = useTheme();
  const hasValue = value !== '';
  return (
    <Field label={label} error={error}>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`w-full pl-3 pr-8 py-2.5 border rounded-xl text-sm bg-bg focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
            error ? 'border-red-300 focus:ring-red-200' : 'border-border focus:ring-pri/20 focus:border-pri'
          } ${hasValue ? 'text-ink font-medium' : 'text-ink-3'}`}
        >
          {children}
        </select>
        {/* Custom chevron */}
        <svg
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={error ? '#f87171' : hasValue ? theme.pri : 'currentColor'}
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </Field>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  LEFT decorative panel                                     */
/* ────────────────────────────────────────────────────────── */
function LeftPanel({ mode }) {
  const { theme } = useTheme();
  return (
    <div
      className="hidden lg:flex lg:w-[52%] h-full relative overflow-hidden text-white"
      style={{ backgroundColor: theme.pri }}
    >
      {/* animated blobs */}
      <div className="absolute w-[500px] h-[500px] rounded-full opacity-20 -top-32 -left-32 animate-pulse bg-white/20 blur-3xl" />
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-15 bottom-20 right-0 animate-pulse bg-white/10 blur-3xl" style={{ animationDelay: '1s' }} />
      <div className="absolute w-[300px] h-[300px] rounded-full opacity-10 top-1/2 left-1/3 animate-pulse bg-black/20 blur-3xl" style={{ animationDelay: '0.5s' }} />

      <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16 max-w-xl">
        <h2 className="text-[2.4rem] lg:text-[2.7rem] font-extrabold leading-[1.1]">
          {mode === 'login' ? (
            <>The Smarter Way<br />to Trade <span className="opacity-70">on Campus</span></>
          ) : (
            <>Join the Campus<br />Marketplace <span className="opacity-70">Today</span></>
          )}
        </h2>
        <p className="mt-5 text-white/70 text-sm leading-relaxed">
          {mode === 'login'
            ? 'Join 1,800+ NIT Kurukshetra students buying, selling, and exchanging items safely within campus. Verified profiles. Zero commission.'
            : 'Create your account with your official @nitkkr.ac.in email and start listing or buying items in minutes.'}
        </p>

        <div className="mt-9 space-y-3.5">
          {[
            { icon: 'check',  color: 'text-emerald-300', text: <><strong>Verified Users</strong> only with @nitkkr email</> },
            { icon: 'deal',   color: 'text-amber-300',   text: <><strong>Face-to-Face</strong> deals in campus hostels</> },
            { icon: 'rupee',  color: 'text-blue-200',    text: <><strong>Zero Commission</strong> — keep everything you earn</> },
          ].map(({ icon, color, text }) => (
            <div key={icon} className="flex items-center gap-3">
              <ThemedIcon name={icon} size={22} className={color} />
              <span className="text-sm text-white/80">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  LOGIN form                                               */
/* ────────────────────────────────────────────────────────── */
function LoginForm({ onSwitchMode }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const { loginUser }           = useAuth();
  const { showToast }           = useToast();
  const { theme }               = useTheme();
  const navigate                = useNavigate();

  const validateEmail = (v) => setEmailErr(v.length > 0 && !v.endsWith('@nitkkr.ac.in'));

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { showToast('Please enter both email and password', 'error'); return; }
    setLoading(true);
    try {
      const data = await api.login(email, password);
      if (data.token) {
        loginUser(data);
        showToast('Login success!', 'success');
        setTimeout(() => navigate(data.role === 'admin' ? '/admin' : '/'), 600);
      } else {
        showToast(data.message || 'Some error occurred', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Some error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 flex-1">
      <Field label="NIT Email Address" icon="email" error={emailErr ? 'Please login with institute ID' : ''}>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }}
          placeholder="yourname@nitkkr.ac.in"
          className={inputCls('email', emailErr)}
        />
      </Field>

      <Field label="Password" icon="lock">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className={inputCls('lock', false)}
        />
      </Field>


      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 text-white font-extrabold rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[14px] tracking-wide uppercase hover:opacity-90"
        style={{ backgroundColor: loading ? '#9ca3af' : theme.pri, boxShadow: loading ? 'none' : `0 8px 25px ${theme.pri}55` }}
      >
        {loading
          ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <><ThemedIcon name="login" size={18} color="#ffffff" /> Sign In</>}
      </button>

      <p className="text-center text-xs text-ink-3 pt-1">
        New to campus marketplace?{' '}
        <button type="button" onClick={onSwitchMode} className="font-semibold hover:underline" style={{ color: theme.pri }}>
          Create an account
        </button>
      </p>
    </form>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  SIGN UP form  (2-step: form → OTP)                       */
/* ────────────────────────────────────────────────────────── */
function SignUpForm({ onSwitchMode }) {
  const [step, setStep]           = useState(1);   // 1 = form, 2 = otp
  const [form, setForm]           = useState({ name: '', email: '', rollNo: '', branch: '', year: '', hostel: '', mobileNo: '', password: '', confirmPassword: '' });
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError]   = useState('');
  const [resendCd, setResendCd]   = useState(0);   // seconds until resend allowed
  const [expirySec, setExpirySec] = useState(300);  // 5 min countdown
  const { loginUser }             = useAuth();
  const { showToast }             = useToast();
  const { theme }                 = useTheme();
  const navigate                  = useNavigate();
  const otpRefs                   = Array.from({ length: 6 }, () => React.useRef(null));

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim())                                 errs.name     = 'Full name is required';
    if (!form.email.endsWith('@nitkkr.ac.in'))             errs.email    = 'Must be a @nitkkr.ac.in email';
    if (!/^[0-9]{5,9}$/.test(form.rollNo))                errs.rollNo   = 'Roll number must be 5-9 digits';
    if (!form.branch)                                      errs.branch   = 'Please select a branch';
    if (!form.year)                                        errs.year     = 'Please select your year';
    if (!form.hostel)                                      errs.hostel   = 'Please select a hostel';
    if (!/^[0-9]{10}$/.test(form.mobileNo))               errs.mobileNo = 'Enter a valid 10-digit mobile number';
    if (form.password.length < 6 || form.password.length > 12) errs.password = 'Password must be 6–12 characters';
    if (form.password !== form.confirmPassword)            errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Step 1: Send OTP ── */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.sendOtp(form.email);
      showToast(`OTP sent to ${form.email}`, 'success');
      setStep(2);
      setResendCd(60);
      setExpirySec(300);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    } catch (err) {
      showToast(err.message || 'Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ── Resend cooldown & expiry countdown ── */
  React.useEffect(() => {
    if (step !== 2) return;
    const id = setInterval(() => {
      setResendCd((c) => Math.max(0, c - 1));
      setExpirySec((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  /* ── OTP digit input handling ── */
  const handleOtpChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpDigits];
    next[idx] = val;
    setOtpDigits(next);
    setOtpError('');
    if (val && idx < 5) otpRefs[idx + 1].current?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      otpRefs[idx - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...otpDigits];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setOtpDigits(next);
    otpRefs[Math.min(pasted.length, 5)].current?.focus();
  };

  /* ── Step 2: Verify OTP & register ── */
  const handleVerify = async (e) => {
    e.preventDefault();
    const otp = otpDigits.join('');
    if (otp.length < 6) { setOtpError('Please enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      payload.year       = Number(payload.year);
      payload.whatsappNo = payload.mobileNo;
      const data = await api.verifyOtpAndRegister(payload, otp);
      if (data.token) {
        loginUser(data);
        showToast('Account created! Welcome 🎉', 'success');
        setTimeout(() => navigate('/'), 800);
      } else {
        showToast(data.message || 'Registration failed', 'error');
      }
    } catch (err) {
      setOtpError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  /* ── Resend OTP ── */
  const handleResend = async () => {
    if (resendCd > 0) return;
    setLoading(true);
    try {
      await api.sendOtp(form.email);
      showToast('New OTP sent!', 'success');
      setResendCd(60);
      setExpirySec(300);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
      otpRefs[0].current?.focus();
    } catch (err) {
      showToast(err.message || 'Failed to resend OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  // selectCls kept for reference but selects now use SelectField component
  const mm = String(Math.floor(expirySec / 60)).padStart(2, '0');
  const ss = String(expirySec % 60).padStart(2, '0');

  /* ── Step 2 UI ── */
  if (step === 2) {
    return (
      <form onSubmit={handleVerify} className="space-y-5 flex-1">
        {/* Email reminder */}
        <div className="rounded-xl p-3 text-xs text-center" style={{ background: `${theme.pri}15`, color: theme.pri }}>
          OTP sent to <strong>{form.email}</strong>
        </div>

        {/* 6-digit boxes */}
        <div>
          <label className="block text-xs font-semibold text-ink-2 mb-3 text-center">Enter 6-digit OTP</label>
          <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
            {otpDigits.map((d, i) => (
              <input
                key={i}
                ref={otpRefs[i]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className={`w-11 h-12 text-center text-lg font-bold border rounded-xl bg-bg text-ink focus:outline-none focus:ring-2 transition-all ${
                  otpError ? 'border-red-300 focus:ring-red-200' : 'border-border focus:ring-pri/30 focus:border-pri'
                }`}
                style={d ? { borderColor: theme.pri } : {}}
              />
            ))}
          </div>
          {otpError && <p className="text-[11px] text-red-500 mt-2 font-medium text-center">{otpError}</p>}
        </div>

        {/* Expiry countdown */}
        <div className="text-center text-xs text-ink-3">
          {expirySec > 0
            ? <>OTP expires in <span className="font-semibold tabular-nums" style={{ color: expirySec < 60 ? '#ef4444' : theme.pri }}>{mm}:{ss}</span></>
            : <span className="text-red-500 font-medium">OTP expired — please resend.</span>
          }
        </div>

        {/* Verify button */}
        <button
          type="submit"
          disabled={loading || expirySec === 0}
          className="w-full py-3.5 text-white font-extrabold rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[14px] tracking-wide uppercase hover:opacity-90"
          style={{ backgroundColor: (loading || expirySec === 0) ? '#9ca3af' : theme.pri, boxShadow: (loading || expirySec === 0) ? 'none' : `0 8px 25px ${theme.pri}55` }}
        >
          {loading
            ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <><ThemedIcon name="check" size={18} color="#ffffff" /> Verify &amp; Create Account</>}
        </button>

        {/* Resend + back */}
        <div className="flex items-center justify-between text-xs text-ink-3 pt-1">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="hover:underline"
            style={{ color: theme.pri }}
          >
            ← Edit details
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCd > 0 || loading}
            className="hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: theme.pri }}
          >
            {resendCd > 0 ? `Resend in ${resendCd}s` : 'Resend OTP'}
          </button>
        </div>
      </form>
    );
  }

  /* ── Step 1 UI (original form) ── */
  return (
    <form onSubmit={handleSendOtp} className="space-y-3 flex-1">
      {/* Row: Name */}
      <Field label="Full Name" icon="profile" error={errors.name}>
        <input
          type="text"
          value={form.name}
          onChange={set('name')}
          placeholder="Enter Your Name"
          className={inputCls('profile', errors.name)}
        />
      </Field>

      {/* Row: Email */}
      <Field label="NIT Email Address" icon="email" error={errors.email}>
        <input
          type="email"
          value={form.email}
          onChange={set('email')}
          placeholder="roll@nitkkr.ac.in"
          className={inputCls('email', errors.email)}
        />
      </Field>

      {/* Row: Roll No + Branch */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Roll Number" error={errors.rollNo}>
          <input
            type="text"
            value={form.rollNo}
            onChange={set('rollNo')}
            placeholder="e.g. 124102066"
            className={inputCls('', errors.rollNo)}
          />
        </Field>
        <SelectField label="Branch" error={errors.branch} value={form.branch} onChange={set('branch')} placeholder="Branch">
          <option value="">Select Branch</option>
          {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
        </SelectField>
      </div>

      {/* Row: Year + Hostel */}
      <div className="grid grid-cols-2 gap-3">
        <SelectField label="Year" error={errors.year} value={form.year} onChange={set('year')}>
          <option value="">Select Year</option>
          {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
        </SelectField>
        <SelectField label="Hostel" error={errors.hostel} value={form.hostel} onChange={set('hostel')}>
          <option value="">Select Hostel</option>
          <optgroup label="── Boys Hostels">
            {BOYS_HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
          </optgroup>
          <optgroup label="── Girls Hostels">
            {GIRLS_HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
          </optgroup>
        </SelectField>
      </div>

      {/* Row: Mobile */}
      <Field label="Mobile Number" icon="phone" error={errors.mobileNo}>
        <input
          type="tel"
          value={form.mobileNo}
          onChange={set('mobileNo')}
          placeholder="Enter Phone Number"
          className={inputCls('phone', errors.mobileNo)}
        />
      </Field>

      {/* Row: Password + Confirm */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Password" icon="lock" error={errors.password}>
          <input
            type="password"
            value={form.password}
            onChange={set('password')}
            placeholder="6–12 chars"
            className={inputCls('lock', errors.password)}
          />
        </Field>
        <Field label="Confirm Password" icon="lock" error={errors.confirmPassword}>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={set('confirmPassword')}
            placeholder="Confirm Password"
            className={inputCls('lock', errors.confirmPassword)}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 text-white font-extrabold rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[14px] tracking-wide uppercase hover:opacity-90"
        style={{ backgroundColor: loading ? '#9ca3af' : theme.pri, boxShadow: loading ? 'none' : `0 8px 25px ${theme.pri}55` }}
      >
        {loading
          ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <><ThemedIcon name="email" size={18} color="#ffffff" /> Send OTP to Email</>}
      </button>

      <p className="text-center text-xs text-ink-3 pt-1">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchMode} className="font-semibold hover:underline" style={{ color: theme.pri }}>
          Sign in
        </button>
      </p>
    </form>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Main page                                                */
/* ────────────────────────────────────────────────────────── */
export default function AuthPage() {
  const [mode, setMode] = useState('login');   // 'login' | 'signup'
  const { user }        = useAuth();
  const { theme }       = useTheme();
  const navigate        = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin' : '/');
  }, [user, navigate]);

  return (
    <div className="h-full overflow-hidden flex">
      <LeftPanel mode={mode} />

      {/* ═══ RIGHT PANEL ═══ */}
      <div className="flex-1 h-full overflow-y-auto bg-bg">
        <div className="flex flex-col min-h-full items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-[420px] py-4">
            <div className="bg-surface rounded-2xl shadow-xl border border-border p-7 sm:p-8 flex flex-col">

              {/* ── Mode tabs ── */}
              <div className="flex rounded-xl overflow-hidden border border-border mb-6 text-sm font-semibold">
                {[['login','Sign In'], ['signup','Sign Up']].map(([m, label]) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className="flex-1 py-2.5 transition-all"
                    style={{
                      backgroundColor: mode === m ? theme.pri : 'transparent',
                      color: mode === m ? '#fff' : theme.pri,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* ── Heading ── */}
              <div className="mb-5">
                <h1 className="text-[1.35rem] font-extrabold text-ink">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-xs text-ink-3 mt-0.5">
                  {mode === 'login'
                    ? 'Login to your campus marketplace account'
                    : 'Join the NIT Kurukshetra campus marketplace'}
                </p>
              </div>

              {/* ── Form ── */}
              {mode === 'login'
                ? <LoginForm  onSwitchMode={() => setMode('signup')} />
                : <SignUpForm onSwitchMode={() => setMode('login')}  />
              }

              <div className="mt-5 pt-4 border-t border-border text-center text-[10px] text-ink-3">
                © 2026 NIT KKR Marketplace — Campus Exclusive
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
