const mongoose = require("mongoose");

// ─── Helper: Generate Reference Number ────────────────────────────────────────
const generateReferenceNumber = async () => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  
  // Count enquiries created today
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  
  const count = await mongoose.model('ContactEnquiry').countDocuments({
    createdAt: { $gte: startOfDay, $lt: endOfDay }
  });
  
  const sequenceNum = String(count + 1).padStart(4, '0');
  return `CE-${dateStr}-${sequenceNum}`;
};

const contactEnquirySchema = new mongoose.Schema({
  // ─── Public/Core Fields ───────────────────────────────────────────────────
  reference_number: {
    type: String,
    unique: true,
    sparse: true, // Allow null during creation before generation
  },
  first_name: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  last_name: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  company: {
    type: String,
    trim: true,
    default: null,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
  },
  inquiry_type: {
    type: String,
    required: [true, "Inquiry type is required"],
    enum: ["General Enquiry", "Recruitment", "Workforce Solutions", "Partnership", "Immigration", "Other"],
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true,
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
  },

  // ─── Attachment Fields ────────────────────────────────────────────────────
  attachment_url: {
    type: String,
    default: null,
  },
  attachment_name: {
    type: String,
    default: null,
  },
  attachment_type: {
    type: String,
    default: null,
  },
  attachment_size: {
    type: Number,
    default: null,
  },

  // ─── Admin Fields (not settable by public API) ────────────────────────────
  status: {
    type: String,
    enum: ["new", "in_progress", "resolved", "closed"],
    default: "new",
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  internal_notes: {
    type: String,
    default: null,
  },

  // ─── Soft Delete ──────────────────────────────────────────────────────────
  deleted_at: {
    type: Date,
    default: null,
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// ─── Pre-save Hook: Generate Reference Number ─────────────────────────────────
contactEnquirySchema.pre('save', async function(next) {
  if (this.isNew && !this.reference_number) {
    this.reference_number = await generateReferenceNumber();
  }
  next();
});

// ─── Query Hook: Exclude Soft-Deleted Records by Default ─────────────────────
contactEnquirySchema.query.notDeleted = function() {
  return this.where('deleted_at').equals(null);
};

contactEnquirySchema.pre(/^find/, function(next) {
  // Only apply soft-delete filter to find queries, not to findByIdAndUpdate, etc.
  if (this.options._recursed) {
    return next();
  }
  this.where('deleted_at').equals(null);
  next();
});

module.exports = mongoose.model("ContactEnquiry", contactEnquirySchema);
