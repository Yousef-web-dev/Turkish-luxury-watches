"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as auth from "@/lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(auth.getCurrentUser());
    setReady(true);
    // keep several tabs in sync
    const onStorage = (e) => {
      if (!e.key || e.key === "bh:session" || e.key === "bh:users") setUser(auth.getCurrentUser());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const signUp = useCallback(async (data) => {
    const res = await auth.signUp(data);
    if (res.ok) setUser(res.user);
    return res;
  }, []);

  const logIn = useCallback(async (data) => {
    const res = await auth.logIn(data);
    if (res.ok) setUser(res.user);
    return res;
  }, []);

  const logInDemo = useCallback(async () => {
    await auth.ensureDemoAccount();
    return logIn({ email: auth.DEMO_ACCOUNT.email, password: auth.DEMO_ACCOUNT.password, remember: true });
  }, [logIn]);

  const logOut = useCallback(() => {
    auth.logOut();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (data) => {
      if (!user) return { ok: false, error: "Log in to update your profile." };
      const res = auth.updateProfile(user.id, data);
      if (res.ok) setUser(res.user);
      return res;
    },
    [user],
  );

  const changePassword = useCallback(
    async (current, next) => {
      if (!user) return { ok: false, error: "Log in to change your password." };
      return auth.changePassword(user.id, current, next);
    },
    [user],
  );

  const addOrder = useCallback((order) => (user ? auth.addOrder(user.id, order) : null), [user]);
  const getOrders = useCallback(() => (user ? auth.getOrders(user.id) : []), [user]);

  const value = useMemo(
    () => ({
      user,
      ready,
      signUp,
      logIn,
      logInDemo,
      logOut,
      updateProfile,
      changePassword,
      resetPassword: auth.resetPassword,
      accountExists: auth.accountExists,
      addOrder,
      getOrders,
    }),
    [user, ready, signUp, logIn, logInDemo, logOut, updateProfile, changePassword, addOrder, getOrders],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/** Only allow same-site redirects after login. */
export function safeNext(value, fallback = "/account") {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}
