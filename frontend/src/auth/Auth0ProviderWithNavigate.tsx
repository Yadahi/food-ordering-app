import { AppState, Auth0Provider, User } from "@auth0/auth0-react";

type Props = {
  children: React.ReactNode;
};

/**
 * A component that wraps the Auth0Provider component from the @auth0/auth0-react package
 * This component also handles redirecting the user back to the page they were on after they login or logout.
 * @param children The children of this component.
 * @returns The Auth0Provider component wrapped with our custom redirect handling.
 */
const Auth0ProviderWithNavigate = ({ children }: Props) => {
  // Get the necessary configuration values from the environment variables.
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;

  // Throw an error if any of the necessary configuration values are missing.
  if (!domain || !clientId || !redirectUri) {
    throw new Error("unable to initialize auth0");
  }

  /**
   * Callback function that handles the redirect after the user logs in or logs out.
   * @param appState The application state passed in the URL fragment.
   * @param user The user object returned from Auth0.
   */
  const onRedirectCallback = (appState?: AppState, user?: User) => {
    console.log("onRedirectCallback", appState, user);
  };

  // Wrap the Auth0Provider component with our custom redirect handling.
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        // Use the environment variable for the redirect URI.
        redirect_uri: redirectUri,
      }}
      // Provide our custom redirect handling callback.
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigate;
