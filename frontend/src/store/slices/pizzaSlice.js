import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
//import { getPizzas, getPizzaById, getIngredients } from '../api';

const initialState = {
  pizzas: [],
  ingredients: {
    bases: [],
    sauces: [],
    cheeses: [],
    toppings: [],
  },
  currentPizza: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchPizzas = createAsyncThunk('pizza/fetchPizzas', async (_, { rejectWithValue }) => {
  try {
    const response = await getPizzas();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch pizzas');
  }
});

export const fetchPizzaById = createAsyncThunk('pizza/fetchPizzaById', async (id, { rejectWithValue }) => {
  try {
    const response = await getPizzaById(id);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch pizza');
  }
});

export const fetchIngredients = createAsyncThunk('pizza/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const response = await getIngredients();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch ingredients');
  }
});

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    clearCurrentPizza: (state) => {
      state.currentPizza = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Pizzas
      .addCase(fetchPizzas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPizzas.fulfilled, (state, action) => {
        state.loading = false;
        state.pizzas = action.payload;
      })
      .addCase(fetchPizzas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Pizza By ID
      .addCase(fetchPizzaById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPizzaById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPizza = action.payload;
      })
      .addCase(fetchPizzaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Ingredients
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentPizza } = pizzaSlice.actions;
export default pizzaSlice.reducer;