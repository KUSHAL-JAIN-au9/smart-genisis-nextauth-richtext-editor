import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ContentState {
  content: { content: string; _id: string }[];
}

const initialState: ContentState = {
  content: [] as { content: string; _id: string }[],
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setNote: (
      state,
      action: PayloadAction<{ content: string; _id: string }[]>
    ) => {
      console.log("action.payload", action.payload);
      state.content = [...action.payload];
    },
  },
});

export const { setNote } = contentSlice.actions;

export default contentSlice.reducer;
