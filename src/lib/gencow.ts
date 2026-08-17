import { createAuthClient, createGencowClient } from "@gencow/client";
import { api } from "../gencow/api";

export const baseUrl = import.meta.env.VITE_API_URL
  ?? (import.meta.env.DEV ? "http://localhost:5457" : window.location.origin);
export const auth = createAuthClient(baseUrl);
export const apiClient = createGencowClient({ api, baseUrl, auth });
