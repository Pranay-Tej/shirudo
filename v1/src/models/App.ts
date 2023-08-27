import { Document, model, Schema } from 'mongoose';

export interface IApp extends Document {
  name: string;
}

const appSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

export const appModelName = 'App';

export const App = model<IApp>(appModelName, appSchema);
