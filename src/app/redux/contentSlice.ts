import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ContentState {
  content: string[];
}

const initialState: ContentState = {
  content: [],
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setNote: (state, action: PayloadAction<string[]>) => {
      console.log("action.payload", action.payload);
      state.content = [...action.payload];
    },
  },
});

export const { setNote } = contentSlice.actions;

export default contentSlice.reducer;
