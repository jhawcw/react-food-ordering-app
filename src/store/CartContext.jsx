import { createContext, useContext, useReducer, useState } from "react";

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

const cartReducer = (state, action) => {
  if (action.type === "ADD_ITEM") {
    //update state to add meal
    const exitingCartItemIndex = state.items.findIndex((item) => item.id === action.item.id);
    const updatedItems = [...state.items];

    if (exitingCartItemIndex > -1) {
      const existingItem = state.items[exitingCartItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      updatedItems[exitingCartItemIndex] = updatedItem;
    } else {
      updatedItems.push({ ...action.item, quantity: 1 });
    }
    return { ...state, items: updatedItems };
  }
  if (action.type === "REMOVE_ITEM") {
    // update state to remove meal
    const exitingCartItemIndex = state.items.findIndex((item) => item.id === action.id);
    const existingCartItem = state.items[exitingCartItemIndex];

    const updatedItems = [...state.items];
    if (existingCartItem.quantity === 1) {
      updatedItems.splice(exitingCartItemIndex, 1);
    } else if (existingCartItem.quantity > 1) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      updatedItems[exitingCartItemIndex] = updatedItem;
    }
    return { ...state, items: updatedItems };
  }

  if (action.type === "CLEAR_CART") {
    return { ...state, items: [] };
  }

  return state;
};

export const CartContextProvider = ({ children }) => {
  // const [] = useState([]);
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

  function addItem(item) {
    dispatchCartAction({ type: "ADD_ITEM", item: item });
  }

  function removeItem(id) {
    dispatchCartAction({ type: "REMOVE_ITEM", id: id });
  }

  function clearCart() {
    dispatchCartAction({ type: "CLEAR_CART" });
  }

  const cartContext = {
    items: cart.items,
    addItem: addItem,
    removeItem: removeItem,
    clearCart: clearCart,
  };

  console.log(cartContext);

  return <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>;
};

export default CartContext;
