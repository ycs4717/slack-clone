import { Link, Navigate, useNavigate } from 'react-router-dom';
import '../Signup/auth.css';
import { useState } from 'react';
import { authRepository } from '../../modules/auth/auth.repository';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { currentUser, setCurrentUser } = useCurrentUserStore();
  const navigate = useNavigate();

  const signin = async () => {
    try {
      if (email == '' || password == '') return;
      const { user, token } = await authRepository.signin(email, password);
      localStorage.setItem('token', token);
      const status = await authRepository.checkPasskey(email);
      setCurrentUser(user);
      if (status === 1) {
        navigate('/create-passkey');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (currentUser != null) return <Navigate to="/" />;

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h1 className="signup-title">Sign in</h1>
        <p className="signup-subtitle">メールアドレスでログインしてください</p>

        <div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="continue-button"
            disabled={email == '' || password == ''}
            onClick={signin}
          >
            Continue
          </button>
        </div>
        <p className="signin-link">
          ユーザー登録は<Link to="/signup">こちら</Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;
