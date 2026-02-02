import { Fragment } from "react/jsx-dev-runtime";
import React from "react";
import { Eye, EyeOff } from "lucide-react";

// AuthCard renders only login for admins.
const AuthCard = ({
  showPassword,
  setShowPassword,
  loginForm,
  setLoginForm,
  loginError,
  handleLoginSubmit,
}) => {
  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={handleLoginSubmit}>
        <div className="login-brand">
          <div style={{ width: '100%', textAlign: 'center' }}>
            <p className="brand-title">FaceWallet Admin</p>
            <p className="brand-subtitle"></p>
          </div>
        </div>
        <>
            <h2>Admin sign in</h2>
            <p className="muted"></p>
            <label>
              Email address
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Enter Email"
              />
            </label>
            <label className="password-label">
              Password
              <div className="input-with-icon">
                <input
                  className="with-right-icon"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength="6"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Enter Password"
                />
                <button
                  type="button"
                  className="icon-btn right"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="login-actions">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={loginForm.remember}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, remember: event.target.checked }))}
                />
                Remember me
              </label>
              <button type="submit" className="primary-btn">
                Sign in
              </button>
            </div>

            {loginError && <p className="error-text">{loginError}</p>}
        </>
      </form>
    </div>
  )
}

export default AuthCard
