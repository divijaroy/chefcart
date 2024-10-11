import React, { createContext, useContext, useReducer } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.item];
    case "REMOVE":
      let newArr = [...state]
      newArr.splice(action.index, 1)
      return newArr;
    case "DROP":
      let empArray = []
      return empArray
    case "UPDATE":
      return state.map((food) => {
        if (food.id === action.id) {
          return {
            ...food,
            selectedQuantity: parseInt(action.selectedQuantity),
            totalPrice: action.totalPrice,
          };
        }
        return food;
      });
    case 'SWAP':
      return state.map((food) => {
        if (food.id === action.oldItem.id) {
          return {
            ...action.newItem, // Replace old item with the new item
            selectedQuantity: action.newItem.selectedQuantity || 1, // Carry over any quantity if provided
            totalPrice: action.newItem.totalPrice || action.newItem.DiscountPrice * 1, // Ensure a valid total price
          };
        }
        return food;
      });
    case 'UPDATE_QUANTITY':  // Add this case for quantity updates
      return state.map((food, index) => {
        if (index === action.index) {
          return {
            ...food,
            selectedQuantity: action.updatedFood.selectedQuantity,
            totalPrice: action.updatedFood.totalPrice,
          };
        }
        return food;
      });
    default:
      console.log("Error in Reducer");
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
