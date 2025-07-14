import {
  LOGIN_SUCCESS,
  LOGOUT,
  ADD_FAVOURITE,
  REMOVE_FAVOURITE,
} from "../actions/authActions";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  favourites: JSON.parse(localStorage.getItem("favourites") || "[]"),
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };

    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        token: null,
        // mantieni preferiti se vuoi che restino persistenti, altrimenti svuota
        favourites: JSON.parse(localStorage.getItem("favourites") || "[]"),
      };

    case ADD_FAVOURITE: {
      if (state.favourites.some((f) => f.id === action.payload.id))
        return state;
      const updated = [...state.favourites, action.payload];
      localStorage.setItem("favourites", JSON.stringify(updated));
      return {
        ...state,
        favourites: updated,
      };
    }

    case REMOVE_FAVOURITE: {
      const updated = state.favourites.filter((f) => f.id !== action.payload);
      localStorage.setItem("favourites", JSON.stringify(updated));
      return {
        ...state,
        favourites: updated,
      };
    }

    default:
      return state;
  }
};

export default authReducer;
