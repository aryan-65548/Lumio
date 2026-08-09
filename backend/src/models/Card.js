import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    name: {
      type: String,
      required: [true, 'Builder name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Builder role is required'],
      trim: true,
    },
    techStack: {
      type: String,
      default: '',
    },
    vibe: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: [true, 'Card title is required'],
      trim: true,
    },
    theme: {
      type: String,
      enum: ['goa', 'aot'],
      default: 'goa',
    },
    photoUrl: {
      type: String,
      default: '',
    },
    cardImageUrl: {
      type: String,
      required: [true, 'Card image URL is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Card = mongoose.models.Card || mongoose.model('Card', cardSchema);
export default Card;
