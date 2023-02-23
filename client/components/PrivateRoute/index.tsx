import { useEffect } from "react";
import { useRouter } from "next/router";
import { Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export default function PrivateRoute({ protectedRoutes, children }) {
  const router = useRouter();

  const { isAuthenticated, loading, user } = useSelector(
    (state: RootState) => state.auth
  );

  const pathIsProtected = protectedRoutes.indexOf(router.pathname) !== -1;

  useEffect(() => {
    if (!loading && !isAuthenticated && pathIsProtected) {
      if (user?.role !== "admin") {
        router.push("/404");
      }
      router.push("/login");
    }
  }, [loading, isAuthenticated, pathIsProtected, router, user?.role]);

  if ((loading || !isAuthenticated) && pathIsProtected) {
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    );
  }

  return children;
}
