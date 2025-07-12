import {
  LOGIN_SUCCESS,
  LOGOUT,
  ADD_FAVOURITE,
  REMOVE_FAVOURITE,
} from "../actions/authActions";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  favourites: [],
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
      return {
        ...state,
        user: null,
        token: null,
        favourites: [],
      };
    case ADD_FAVOURITE:
      if (state.favourites.some((f) => f.id === action.payload.id))
        return state;
      return {
        ...state,
        favourites: [...state.favourites, action.payload],
      };
    case REMOVE_FAVOURITE:
      return {
        ...state,
        favourites: state.favourites.filter((f) => f.id !== action.payload),
      };
    default:
      return state;
  }
};

export default authReducer;
