import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const storeOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if guest checkout
  orderNumber: { type: String, required: true, unique: true },
  customerDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    postalCode: { type: String },
  },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'cancelled', 'refunded'], default: 'pending' },
  shippingStatus: { type: String, enum: ['pending', 'packed', 'shipped', 'delivered', 'returned'], default: 'pending' },
  trackingNumber: { type: String },
}, { timestamps: true });

storeOrderSchema.set('toJSON', { virtuals: true });
storeOrderSchema.set('toObject', { virtuals: true });

const StoreOrder = mongoose.model('StoreOrder', storeOrderSchema);
export default StoreOrder;
