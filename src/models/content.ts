import mongoose, { Schema, Document, Model } from "mongoose";

interface IContent extends Document {
  content: string;
  id: string;
}

const ContentSchema: Schema<IContent> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
});

const Content: Model<IContent> =
  mongoose.models.Content || mongoose.model<IContent>("Content", ContentSchema);

export default Content;
