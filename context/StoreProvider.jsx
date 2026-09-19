"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { getProduct } from "@/lib/products";
import { GIFT_WRAP_FEE, MAX_PER_ORDER, ENGRAVING_MAX_CHARS } from "@/lib/pricing";

const STORAGE_KEY = "bosphorus-horology:v1";

const initial = { cart: [], wishlist: [], options: { giftWrap: false, engraving: "" } };

export const maxQtyFor = (p) => Math.max(0, Math.min(MAX_PER_ORDER, p.stockCount));

function reducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "add": {
      const p = getProduct(action.id);
      if (!p || p.stock === "out-of-stock") return state;
      const max = maxQtyFor(p);
      const existing = state.cart.find((l) => l.id === action.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((l) => (l.id === action.id ? { ...l, qty: Math.min(max, l.qty + action.qty) } : l)),
        };
      }
      return { ...state, cart: [...state.cart, { id: action.id, qty: Math.min(max, action.qty) }] };
    }
    case "setQty": {
      const p = getProduct(action.id);
      if (!p) return state;
      const qty = Math.max(1, Math.min(maxQtyFor(p), action.qty));
      return { ...state, cart: state.cart.map((l) => (l.id === action.id ? { ...l, qty } : l)) };
    }
    case "remove":
      return { ...state, cart: state.cart.filter((l) => l.id !== action.id) };
    case "clearCart":
      return { ...state, cart: [], options: { giftWrap: false, engraving: "" } };
    case "toggleWish":
      return {
        ...state,
        wishlist: state.wishlist.includes(action.id)
          ? state.wishlist.filter((x) => x !== action.id)
          : [...state.wishlist, action.id],
      };
    case "removeWish":
      return { ...state, wishlist: state.wishlist.filter((x) => x !== action.id) };
    case "options":
      return {
        ...state,
        options: {
          ...state.options,
          ...action.patch,
          engraving: (action.patch.engraving ?? state.options.engraving).slice(0, ENGRAVING_MAX_CHARS),
        },
      };
    default:
      return state;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  /* hydrate from localStorage (client only, avoids SSR mismatch) */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        dispatch({
          type: "hydrate",
          state: {
            cart: (parsed.cart ?? [])
              .filter((l) => getProduct(l.id))
              .map((l) => ({ id: l.id, qty: Math.max(1, Math.min(MAX_PER_ORDER, Number(l.qty) || 1)) })),
            wishlist: (parsed.wishlist ?? []).filter((id) => getProduct(id)),
            options: {
              giftWrap: Boolean(parsed.options?.giftWrap),
              engraving: String(parsed.options?.engraving ?? "").slice(0, ENGRAVING_MAX_CHARS),
            },
          },
        });
      }
    } catch {
      /* storage unavailable or corrupted, start fresh */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [state, ready]);

  /* toast */
  const notify = useCallback((message) => setToast({ key: Date.now(), message }), []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const addToCart = useCallback(
    (id, qty = 1) => {
      const p = getProduct(id);
      if (!p) return false;
      if (p.stock === "out-of-stock") {
        notify(`${p.title} is currently sold out`);
        return false;
      }
      const existing = stateRef.current.cart.find((l) => l.id === id);
      if (existing && existing.qty >= maxQtyFor(p)) {
        notify(`Limit reached: ${maxQtyFor(p)} per order for ${p.title}`);
        return false;
      }
      dispatch({ type: "add", id, qty });
      notify(`${p.title} added to your bag`);
      return true;
    },
    [notify],
  );

  const toggleWish = useCallback(
    (id) => {
      const p = getProduct(id);
      const has = stateRef.current.wishlist.includes(id);
      dispatch({ type: "toggleWish", id });
      if (p) notify(has ? `${p.title} removed from your wishlist` : `${p.title} saved to your wishlist`);
    },
    [notify],
  );

  const value = useMemo(() => {
    const lines = state.cart.map((l) => ({ product: getProduct(l.id), qty: l.qty })).filter((l) => l.product);
    const wishlist = state.wishlist.map((id) => getProduct(id)).filter(Boolean);
    return {
      ready,
      lines,
      cartCount: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.product.price, 0),
      giftWrapFee: state.options.giftWrap && lines.length ? GIFT_WRAP_FEE : 0,
      options: state.options,
      wishlist,
      wishlistCount: wishlist.length,
      isWished: (id) => state.wishlist.includes(id),
      toggleWish,
      removeWish: (id) => dispatch({ type: "removeWish", id }),
      addToCart,
      setQty: (id, qty) => dispatch({ type: "setQty", id, qty }),
      removeFromCart: (id) => dispatch({ type: "remove", id }),
      moveToWishlist: (id) => {
        if (!stateRef.current.wishlist.includes(id)) dispatch({ type: "toggleWish", id });
        dispatch({ type: "remove", id });
        notify("Moved to your wishlist");
      },
      moveToCart: (id) => {
        if (addToCart(id, 1)) dispatch({ type: "removeWish", id });
      },
      clearCart: () => dispatch({ type: "clearCart" }),
      setOptions: (patch) => dispatch({ type: "options", patch }),
      toast,
      notify,
    };
  }, [state, ready, toast, addToCart, toggleWish, notify]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
