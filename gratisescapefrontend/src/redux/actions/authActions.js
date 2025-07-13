import api from "../../services/api";
import { toast } from "react-toastify";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";
export const ADD_FAVOURITE = "ADD_FAVOURITE";
export const REMOVE_FAVOURITE = "REMOVE_FAVOURITE";

export const login = (credentials, navigate) => async (dispatch) => {
  try {
    const res = await api.post("/auth/login", credentials);
    localStorage.setItem("token", res.data.token);
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    toast.success("Login effettuato con successo!");
    navigate("/");
  } catch (error) {
    if (
      error.response?.status === 403 &&
      error.response.data === "Devi cambiare la password al primo accesso."
    ) {
      toast.info("Devi cambiare la password al primo accesso.");
      navigate("/change-password-first");
    } else {
      toast.error("Credenziali errate");
    }
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  return { type: LOGOUT };
};

export const forgotPassword = (email) => async () => {
  try {
    await api.post("/auth/forgot-password", { email });
    toast.success("Email inviata con il link per il reset!");
  } catch {
    toast.error("Errore durante la richiesta");
  }
};

export const resetPassword = (token, newPassword) => async () => {
  try {
    await api.post("/auth/reset-password", { token, newPassword });
    toast.success("Password reimpostata con successo!");
  } catch {
    toast.error("Errore durante il reset");
  }
};

export const changePassword = (oldPassword, newPassword) => async () => {
  try {
    await api.post("/auth/change-password", { oldPassword, newPassword });
    toast.success("Password aggiornata con successo!");
  } catch {
    toast.error("Errore durante il cambio password");
  }
};

export const addFavourite = (viaggio) => ({
  type: ADD_FAVOURITE,
  payload: viaggio,
});

export const removeFavourite = (id) => ({
  type: REMOVE_FAVOURITE,
  payload: id,
});
