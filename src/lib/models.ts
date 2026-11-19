import mongoose, { Model, Schema } from 'mongoose';

export interface ITab { _id: mongoose.Types.ObjectId; title: string; content: string }
export interface IDoc { _id: mongoose.Types.ObjectId; title: string; tabs: ITab[]; createdAt: Date; updatedAt: Date }

const tabSchema = new Schema<ITab>({
  title: { type: String, default: 'Tab 1' },
  content: { type: String, default: '' }, // HTML produced by the editor
});

const docSchema = new Schema<IDoc>(
  {
    title: { type: String, default: 'Untitled document' },
    tabs: { type: [tabSchema] as unknown as ITab[], default: () => [{ title: 'Tab 1' }] as ITab[] },
  },
  { timestamps: true }
);

export const Doc: Model<IDoc> = mongoose.models.Doc || mongoose.model<IDoc>('Doc', docSchema);
