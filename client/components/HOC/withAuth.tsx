import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect } from "react";

/**
 * * The withAuth function takes two arguments: WrappedComponent and LayoutComponent.
 * * The WrappedComponent is the component that needs to be protected with authentication, and the LayoutComponent is the layout component to be used.
 * * The withAuth function returns a function that takes props as an argument.
 */

const withAuth = (WrappedComponent, LayoutComponent) => {
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

        if (isAuthenticated && user?.role !== "admin") {
          router.push("/404");
        }
      }
    }, [router, isAuthenticated, user, loading]);

    if (!isAuthenticated || (isAuthenticated && user?.role !== "admin")) {
      return null;
    }

    return (
      <LayoutComponent>
        <WrappedComponent {...props} />
      </LayoutComponent>
    );
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
