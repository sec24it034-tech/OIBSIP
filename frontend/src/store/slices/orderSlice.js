import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyOrders, getOrderById } from '../../api';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchMyOrders = createAsyncThunk('order/fetchMyOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await getMyOrders();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchOrderById = createAsyncThunk('order/fetchOrderById', async (id, { rejectWithValue }) => {
  try {
    const response = await getOrderById(id);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o._id === orderId);
      if (order) {
        order.orderStatus = status;
      }
      if (state.currentOrder && state.currentOrder._id === orderId) {
        state.currentOrder.orderStatus = status;
      }
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateOrderStatus, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;