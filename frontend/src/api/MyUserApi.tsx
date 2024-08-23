import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CreateUserRequest = {
  auth0Id: string;
  email: string;
};

/**
 * Custom hook to create a new user.
 * Uses the `useMutation` hook from `react-query` to handle the mutation.
 *
 * @returns An object containing the `createUser` function to trigger the mutation,
 *          the `isLoading` boolean indicating if the mutation is in progress,
 *          and the `isSuccess` boolean indicating if the mutation was successful.
 */
export const useCreateMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  /**
   * Asynchronous function to create a new user.
   * Sends a POST request to the `/api/my/user` endpoint with the user data.
   *
   * @param {CreateUserRequest} user - The user data to create a new user.
   * @returns A Promise that resolves to the response from the server.
   * @throws An error if the request fails.
   */
  const createMyUserRequest = async (user: CreateUserRequest) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }
  };

  /**
   * The `useMutation` hook from `react-query` is used to handle the mutation.
   * It takes the `createMyUserRequest` function as its first argument, and returns
   * an object containing the `mutateAsync` function to trigger the mutation,
   * the `isLoading` boolean indicating if the mutation is in progress,
   * and the `isSuccess` boolean indicating if the mutation was successful.
   */
  const {
    mutateAsync: createUser,
    isLoading,
    isError,
    isSuccess,
  } = useMutation(createMyUserRequest);

  return { createUser, isLoading, isError, isSuccess };
};

type UpdateMyUserRequest = {
  name: string;
  addressLine1: string;
  city: string;
  country: string;
};

/**
 * Custom hook to update the current user's profile.
 * Uses the `useMutation` hook from `react-query` to handle the mutation.
 *
 * @returns An object containing the `updateUser` function to trigger the mutation,
 *          the `isLoading` boolean indicating if the mutation is in progress,
 *          and the `isSuccess` boolean indicating if the mutation was successful.
 */
export const useUpdateMyUser = () => {
  // Get the access token from Auth0
  const { getAccessTokenSilently } = useAuth0();

  /**
   * Asynchronous function to update the current user's profile.
   * Sends a PUT request to the `/api/my/user` endpoint with the updated profile data.
   *
   * @param {UpdateMyUserRequest} formData - The updated profile data.
   * @returns A Promise that resolves to the response from the server.
   * @throws An error if the request fails.
   */
  const updateMyUserRequest = async (formData: UpdateMyUserRequest) => {
    // Get the access token from Auth0
    const accessToken = await getAccessTokenSilently();

    // Send a PUT request to the server
    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    // Return the response from the server
    return response.json();
  };

  // Use the `useMutation` hook to handle the mutation
  const {
    mutateAsync: updateUser,
    isLoading,
    isSuccess,
    error,
    reset,
  } = useMutation(updateMyUserRequest);

  // Show a success toast if the mutation was successful
  if (isSuccess) {
    toast.success("Profile updated successfully");
  }

  // Show an error toast if there was an error and reset the mutation
  if (error) {
    toast.error(error.toString());
    reset();
  }

  // Return the mutation function and loading state
  return { updateUser, isLoading };
};
