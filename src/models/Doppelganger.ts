import mongoose, { Schema, Document, Model } from 'mongoose'


export interface IDoppelganger extends Document {
    name: string
    archetype: string
    portrait: string
    realTraits: string
    backstory: string
    locationStats: string
    chatLog: Array<{ role: string; text: string; ts?: string }>
}


const DoppelSchema: Schema = new Schema({
    name: { type: String, required: true },
    archetype: { type: String, required: true },
    portrait: { type: String, required: false },
    realTraits: { type: String },
    backstory: { type: String },
    locationStats: { type: String },
    chatLog: { type: Array, default: [] }
}, { timestamps: true })


export default (mongoose.models.Doppelganger as Model<IDoppelganger>) || mongoose.model<IDoppelganger>('Doppelganger', DoppelSchema)