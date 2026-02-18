const apiEnv = import.meta.env.VITE_API_BASE;

if (!apiEnv) {
    console.warn("VITE_API_BASE is not set. API calls may fail.");
}

export const API_BASE = apiEnv || "https://altbackend.vercel.app";
