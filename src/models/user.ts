import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  image?: string;
  password?: string;
  contents: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
      validate: {
        validator: function (value: string) {
          // Regular expression for password validation
          const passwordRegex =
            /^(?=.*[A-Z])(?=.*[a-zA-Z]{2,})(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          return passwordRegex.test(value);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid password!`,
      },
    },
    contents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Content",
      },
    ],
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
