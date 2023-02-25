import { Document, Schema, SchemaTypes, model } from 'mongoose';
import { appModelName } from './App';

interface IUser extends Document {
  username: string;
  password: string;
  app_id: string;
  email?: string;
  default_role: string;
  allowed_roles: string[];
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      match: /^[A-Za-z0-9_-]*$/,
      trim: true,
      minLength: 3,
      maxLength: 30
    },
    password: {
      type: String,
      required: true,
      minLength: 3
    },
    app_id: {
      type: SchemaTypes.ObjectId,
      ref: appModelName,
      required: true
    },
    email: {
      type: String,
      match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      trim: true
    },
    default_role: {
      type: String,
      required: true
    },
    allowed_roles: {
      type: [String],
      required: true
    }
  },
  {
    timestamps: true
  }
);

// for a given app_id username will be unique
userSchema.index({ username: 1, app_id: 1 }, { unique: true });

export const userModelName = 'User';
export const User = model<IUser>(userModelName, userSchema);
