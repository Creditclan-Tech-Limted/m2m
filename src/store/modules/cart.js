import { EventBus } from "@/lib/event-bus";

const state = {
  items: [],
  plans: [],
};

const getters = {
  inCart: (state) => (item) => {
    return state.items.some(_item => _item.id === item.id);
  },
  outright: (state) => {
    return state.items.reduce((acc, item) => {
      if (item.plan.outright) {
        return acc + item.plan.outright
      }
      return acc;
    }, 0);
  },
  upfront: () => {
    return state.items.reduce((acc, item) => {
      if (item.plan.upfront) return acc + item.plan.upfront;
      return acc;
    }, 0)
  },
  repayment: (state) => {
    const total = state.items.reduce((acc, item) => {
      if (item.plan?.monthly && item.plan?.duration) {
        return acc + (item.plan.monthly * item.plan.duration * item.plan.unit);
      }
      return acc;
    }, 0);
    const months = state.items.reduce((max, item) => {
      return max < item.plan?.duration ? item.plan?.duration : max
    }, 0);
    return {
      total,
      monthly: total ? total / months : 0,
      months
    }
  }
};

const mutations = {
  addItem: (state, item) => {
    const isExist = state.items.find(c => +c.id === +item.id);
    if (isExist) {
      isExist.qty++;
      const updatedItems = state.items.map(c => (+c.id === +item.id ? { ...c, qty: c.qty, item_amount: (+c.price * +c.qty), plan: { price: c.price, quantity: c.qty } } : c));
      state.items = updatedItems;
    } else {
      const newItem = { ...item, qty: item.quantity, item_amount: (+item.price * item.quantity), plan: { price: item.price, quantity: item.quantity } };
      state.items = [newItem, ...state.items];
    }
  },
  increaseQuantity(state, id) {
    const isExist = state.items.find((c) => +c.id === +id);
    if (isExist) {
      isExist.qty++;
      const updatedItem = state.items.map((c) =>
        +c.id === +id
          ? {
            ...c,
            qty: c.qty,
            item_amount: +c.price * +c.qty,
            plan: { price: c.price, quantity: c.qty },
          }
          : c
      );
      state.items = updatedItem;

    }
  },
  decreaseQuantity(state, id) {
    const isExist = state.items.find((c) => +c.id === +id);
    if (isExist) {
      if (isExist.qty > 1) {
        isExist.qty--;
      } else {
        isExist.qty = 1;
      }
      const updatedItem = state.items.map((c) =>
        c.id === id
          ? {
            ...c,
            qty: isExist.qty,
            item_amount: +isExist.price * +isExist.qty,
            plan: { price: isExist.price, quantity: isExist.qty },
          }
          : c
      );
      state.items = updatedItem;
    }
  },
  removeCartItem: (state, id) => {
    const isExist = state.items.find((c) => +c.id === id);
    if (isExist) {
      const updatedItem = state.items.filter((c) => c.id !== id);
      state.items = updatedItem;

    }
  },
  clear() {
    state.items = []
    state.plans = []
  }
};

const actions = {
  show() {
    EventBus.$emit('cart')
  }
};

const cart = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

export default cart;
