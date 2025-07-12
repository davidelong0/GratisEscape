import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

const ConfermaEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Token non valido");
      navigate("/login");
      return;
    }

    api
      .get(`/auth/confirm?token=${token}`)
      .then((res) => {
        toast.success(res.data);
        setTimeout(() => navigate("/login"), 2500);
      })
      .catch((err) => {
        const msg = err.response?.data || "Errore nella conferma email";
        toast.error(msg);
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="text-center mt-5">
      {loading ? <Spinner animation="border" /> : <p>Reindirizzamento in corso...</p>}
    </div>
  );
};

export default ConfermaEmailPage;


