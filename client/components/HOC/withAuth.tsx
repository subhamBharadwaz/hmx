import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect } from "react";

/**
 * * The withAuth function takes an argument: WrappedComponent.
 * * The WrappedComponent is the component that needs to be protected with authentication.
 * * The withAuth function returns a function that takes props as an argument.
 */

const withAuth = (WrappedComponent, isAdminOnly = false) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const { isAuthenticated, user, loading } = useSelector(
      (state: RootState) => state.auth
    );

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          router.push("/auth/login");
        }

        if (isAdminOnly && isAuthenticated && user?.role !== "admin") {
          router.push("/404");
        }
      }
    }, [router, isAuthenticated, user, loading]);

    if (!isAuthenticated) {
      return null;
    }
    if (isAdminOnly && user?.role !== "admin") {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  /**
   * * The Wrapper component has a displayName property set to a string that includes the displayName or name of the WrappedComponent, so that the component name is correctly displayed in the React Developer Tools
   */
  Wrapper.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return Wrapper;
};

export default withAuth;
