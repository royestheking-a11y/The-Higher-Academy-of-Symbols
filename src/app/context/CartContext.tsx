import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  bookId: string;
  title_ar: string;
  title_en: string;
  price: number;
  quantity: number;
  coverImage?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (book: any, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartTotal: 0,
  cartCount: 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sa_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('sa_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book: any, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.bookId === (book.id || book._id));
      if (existing) {
        return prev.map(item => 
          item.bookId === (book.id || book._id) 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        id: book.id || book._id,
        bookId: book.id || book._id,
        title_ar: book.title_ar,
        title_en: book.title_en,
        price: book.salePrice || book.price,
        quantity,
        coverImage: book.coverImage
      }];
    });
  };

  const removeFromCart = (bookId: string) => {
    setCartItems(prev => prev.filter(item => item.bookId !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.bookId === bookId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
