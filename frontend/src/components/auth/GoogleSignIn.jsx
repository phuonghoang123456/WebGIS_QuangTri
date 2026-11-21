
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";

import { useAuth } from "../../context/AuthContext";

function GoogleSignInButton() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSuccess(response) {
    if (!response.credential || busy) return;

    setError("");
    setBusy(true);

    try {
      const account = await loginWithGoogle(
        response.credential
      );

      navigate(
        account.role === "ADMIN" ? "/admin" : "/home",
        { replace: true }
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Không thể đăng nhập bằng Google."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="webgis-google-login">
      <div className="webgis-google-divider">
        <span>HOẶC TIẾP TỤC VỚI</span>
      </div>

      <div className="webgis-google-button">
        {busy ? (
          <span>Đang xác thực Google...</span>
        ) : (
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() =>
              setError("Không thể kết nối Google.")
            }
            theme="outline"
            size="large"
            shape="rectangular"
            width="320"
            text="continue_with"
          />
        )}
      </div>

      {error && (
        <p className="webgis-auth-alert error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function GoogleSignIn() {
  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <p className="webgis-google-config-error">
        Chưa cấu hình Google Client ID.
      </p>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleSignInButton />
    </GoogleOAuthProvider>
  );
}
