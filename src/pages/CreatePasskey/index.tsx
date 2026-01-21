import { Navigate, useNavigate } from 'react-router-dom';
import '../Signup/auth.css';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';
import { authRepository } from '../../modules/auth/auth.repository';
import { useState } from 'react';

function CreatePasskey() {
  const { currentUser } = useCurrentUserStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!currentUser) return <Navigate to="/signin" />;

  const create = async () => {
    try {
      setLoading(true);
      // Placeholder: backend should return options and a WebAuthn flow should be implemented here
      await authRepository.createPasskey();
      alert('패스키 생성 요청이 서버로 전송되었습니다.');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('패스키 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const skip = async () => {
    try {
      await authRepository.skipPasskey();
    } catch (err) {
      console.error(err);
    } finally {
      navigate('/');
    }
  };

  return (
    <div className="signup-container passkey-container">
      <div className="signup-form-container passkey-card">
        <h2 className="signup-title">패스키 설정</h2>
        <p className="signup-subtitle">패스키를 설정하면 비밀번호 없이 로그인할 수 있습니다. 지금 패스키를 생성하시겠습니까?</p>
        <div className="passkey-actions">
          <button className="passkey-primary" onClick={create} disabled={loading}>
            패스키 만들기
          </button>
          <button className="passkey-secondary" onClick={skip} disabled={loading}>
            무시하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePasskey;
