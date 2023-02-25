import { Document, model, Schema, SchemaTypes } from 'mongoose';
import { appModelName } from './App';

export interface IAppSecret extends Document {
  jwt_secret: string;
  app_id: string;
}

const appSecretSchema = new Schema(
  {
    jwt_secret: {
      type: String,
      required: true,
      trim: true
    },
    app_id: {
      type: SchemaTypes.ObjectId,
      ref: appModelName
    }
  },
  {
    timestamps: true
  }
);

export const appSecretModelName = 'AppSecret';

export const AppSecret = model<IAppSecret>(appSecretModelName, appSecretSchema);
