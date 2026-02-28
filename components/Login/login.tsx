"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("กรุณากรอก Username และ Password");
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with your actual authentication logic
      // e.g. await signIn("credentials", { username, password })
      await new Promise((res) => setTimeout(res, 800)); // mock delay
      router.push("/dashboard");
    } catch {
      setError("Username หรือ Password ไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* ─── Left orange panel ─── */}
      <div className="left-panel">
        <div className="left-content">
          <h1 className="welcome-text">
            Hello,
            <br />
            welcome to!
          </h1>
          <p className="system-name">
            ระบบติดตามบริหารงานลูกค้า
            <br />
            Service Tracking Systems V2.0 (STS)
          </p>
        </div>

        {/* Decorative polygon inside left panel */}
        <div className="polygon-inner" aria-hidden="true" />
      </div>

      {/* ─── Right white panel ─── */}
      <div className="right-panel">
        {/* Top decorative rounded rectangle */}
        <div className="deco-top-bar" aria-hidden="true" />

        <form className="sign-in-form" onSubmit={handleLogin} noValidate>
          <h2 className="sign-in-title">Sign IN</h2>

          {/* Username */}
          <div className="input-group">
            <span className="input-icon" aria-hidden="true">
              {/* Person icon */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Enter your  username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <span className="input-icon" aria-hidden="true">
              {/* Lock icon */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              type="password"
              placeholder="Enter your  password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "กำลังเข้าสู่ระบบ..." : "LogIn"}
          </button>
        </form>

        {/* Bottom-right decorative polygon */}
        <div className="polygon-outer" aria-hidden="true" />
      </div>

      <style jsx>{`
        /* ─────────────────── Layout ─────────────────── */
        .login-wrapper {
          display: flex;
          width: 100vw;
          min-height: 100vh;
          font-family: "Inter", sans-serif;
          overflow: hidden;
          background: #ffffff;
        }

        /* ─────────────────── Left Panel ─────────────────── */
        .left-panel {
          position: relative;
          width: 44%;
          background: #f97216;
          border-radius: 0 60px 60px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .left-content {
          position: relative;
          z-index: 2;
          padding: 0 48px;
          text-align: center;
        }

        .welcome-text {
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 700;
          line-height: 1.2;
          color: #ffffff;
          margin: 0 0 48px 0;
        }

        .system-name {
          font-size: clamp(14px, 1.8vw, 22px);
          font-weight: 500;
          line-height: 1.5;
          color: #ffffff;
          text-align: center;
          margin: 0;
        }

        // /* Decorative polygon (lower-left of the left panel) */
        // .polygon-inner {
        //   position: absolute;
        //   width: 340px;
        //   height: 300px;
        //   bottom: -80px;
        //   left: -60px;
        //   background: #E66913;
        //   clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
        //   transform: rotate(-49.4deg);
        //   z-index: 1;
        // }

        /* ─────────────────── Right Panel ─────────────────── */
        .right-panel {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          overflow: hidden;
        }

        /* Top accent bar (Rectangle 80 style) */
        .deco-top-bar {
          position: absolute;
          top: 0;
          right: 0;
          width: 55%;
          height: 80px;
          background: #e66913;
          border-radius: 0 0 0 50px;
        }

        /* Bottom-right decorative polygon */
        .polygon-outer {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 55%;
          height: 80px;
          background: #e66913;
          border-radius: 0 0 0 50px;
          transform: scaleY(-1);
        }

        /* ─────────────────── Form ─────────────────── */
        .sign-in-form {
          position: relative;
          z-index: 2;
          width: min(420px, 85%);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .sign-in-title {
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 700;
          color: #13298c;
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        /* Input group */
        .input-group {
          position: relative;
          display: flex;
          align-items: center;
          border: 1.5px solid #d0d5dd;
          border-radius: 10px;
          background: #ffffff;
          transition: border-color 0.2s;
          height: 56px;
        }

        .input-group:focus-within {
          border-color: #f97216;
          box-shadow: 0 0 0 3px rgba(249, 114, 22, 0.12);
        }

        .input-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          color: #98a2b3;
          flex-shrink: 0;
        }

        .input-group input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 15px;
          color: #344054;
          background: transparent;
          padding-right: 16px;
          font-family: "Inter", sans-serif;
        }

        .input-group input::placeholder {
          color: #98a2b3;
        }

        .input-group input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Error message */
        .error-msg {
          font-size: 13px;
          color: #d92d20;
          margin: -12px 0 0 0;
          padding: 0;
        }

        /* Login button */
        .login-btn {
          width: 100%;
          height: 56px;
          background: #13298c;
          color: #ffffff;
          font-size: 20px;
          font-weight: 700;
          font-family: "Inter", sans-serif;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition:
            background 0.2s,
            transform 0.1s;
          letter-spacing: 0.5px;
        }

        .login-btn:hover:not(:disabled) {
          background: #0e1f6e;
        }

        .login-btn:active:not(:disabled) {
          transform: scale(0.98);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* ─────────────────── Responsive ─────────────────── */
        @media (max-width: 640px) {
          .login-wrapper {
            flex-direction: column;
          }

          .left-panel {
            width: 100%;
            border-radius: 0 0 40px 40px;
            padding: 48px 24px;
            min-height: 220px;
          }

          .polygon-inner {
            display: none;
          }

          .right-panel {
            flex: 1;
            padding: 40px 24px 60px;
          }

          .deco-top-bar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
