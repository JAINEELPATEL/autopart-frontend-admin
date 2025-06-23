import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { getCurrentAdmin } from "../store/slices/authSlice";

export const useAdminData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { admin, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && !admin && !loading) {
      dispatch(getCurrentAdmin());
    }
  }, [isAuthenticated, admin, loading, dispatch]);

  return { admin, loading, isAuthenticated };
};
