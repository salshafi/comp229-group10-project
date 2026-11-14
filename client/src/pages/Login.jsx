
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Search, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-art">

        {/* FindIt PNG Logo */}
        <div className="auth-brand">
          <img
            src="/findit-logo.png"
            alt="FindIt Campus Lost and Found"
            className="auth-logo"
          />
        </div>

        <div className="auth-art-content">
          <span className="eyebrow light">
            A LITTLE HELP GOES A LONG WAY
          </span>

          <h1>
            Lost something?
            <br />
            <em>Let's find it.</em>
          </h1>

          <p>
            A thoughtful campus community, bringing lost belongings
            and their people back together.
          </p>

          <div className="art-stat">
            <div className="art-stat-icon">
              <Search />
            </div>

            <div>
              <strong>One community.</strong>
              <span>Countless things found.</span>
            </div>
          </div>
        </div>

        <div className="art-footer">
          Made for campus, built around community.
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-wrap">

          <span className="eyebrow">WELCOME BACK</span>

          <h2>Sign in to FindIt</h2>

          <p className="muted">
            Pick up where you left off.
          </p>

          {error && (
            <div className="alert error">{error}</div>
          )}

          <form onSubmit={submit} className="form-stack">

            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@college.ca"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </label>

            <button className="btn primary full" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>

          </form>

          <div className="auth-switch">
            New to FindIt? <Link to="/register">Create an account</Link>
          </div>

          <div className="auth-security">
            <ShieldCheck size={16} />
            Your account is protected
          </div>

        </div>
      </div>

    </div>
  );
}
