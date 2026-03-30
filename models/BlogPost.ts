// Place at: models/BlogPost.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogPost extends Document {
  title:       string;
  slug:        string;
  excerpt:     string;
  content:     string;        // full article body (markdown/plain text)
  category:    string;
  tags:        string[];
  author:      string;        // admin's name
  authorId:    mongoose.Types.ObjectId;
  readTime:    string;        // e.g. "5 min"
  featured:    boolean;
  published:   boolean;       // draft vs live
  views:       number;
  createdAt:   Date;
  updatedAt:   Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title:     { type: String, required: true, trim: true, maxlength: 200 },
    slug:      { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt:   { type: String, required: true, trim: true, maxlength: 400 },
    content:   { type: String, required: true },
    category:  { type: String, required: true, index: true },
    tags:      { type: [String], default: [] },
    author:    { type: String, required: true },
    authorId:  { type: Schema.Types.ObjectId, ref: "User", required: true },
    readTime:  { type: String, default: "5 min" },
    featured:  { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: false, index: true },
    views:     { type: Number,  default: 0 },
  },
  { timestamps: true }
);

BlogPostSchema.index({ slug:      1 }, { unique: true });
BlogPostSchema.index({ category:  1, published: 1 });
BlogPostSchema.index({ featured:  1, published: 1 });
BlogPostSchema.index({ createdAt: -1 });

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
