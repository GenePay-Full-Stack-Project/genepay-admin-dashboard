export const getEnv = () => {
  // Runtime env (for production)
  const runtimeEnv = window.__env__ || {};

  return {
    VITE_API_BASE:
      runtimeEnv.VITE_API_BASE ||
      import.meta.env.VITE_API_BASE ||
      ""
  };
};
