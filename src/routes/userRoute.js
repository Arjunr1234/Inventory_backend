import express from 'express';
import { addCustomer, addProduct, billingProduct, getAllCustomers, getAllProducts, getCustomerLedger, getItemsReport, getSalesReport, removeCustomer, removeProduct, signIn, signUp, updateCustomer, updateProduct } from '../controllers/userController.js';
import { verify } from '../middleware/verification.js';


const userRoute = express.Router();

userRoute.post('/signup',signUp);
userRoute.post('/signin',signIn);
userRoute.post('/add-customer',verify, addCustomer);
userRoute.post('/add-product',verify, addProduct);
userRoute.post('/generate-bill', verify, billingProduct);

userRoute.get('/get-all-customers',verify, getAllCustomers);
userRoute.get('/get-all-products',verify, getAllProducts);
userRoute.get('/sales-report', verify, getSalesReport);
userRoute.get('/customer-ledger', verify, getCustomerLedger);
userRoute.get('/items-report', verify, getItemsReport);

userRoute.delete('/remove-product/:productId', verify, removeProduct);
userRoute.delete('/remove-customer/:customerId', verify, removeCustomer);

userRoute.put('/update-customer/:customerId', verify, updateCustomer);
userRoute.put('/update-product/:productId', verify, updateProduct );





export default userRoute