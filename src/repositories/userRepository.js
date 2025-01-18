import userModel from "../models/userSchema.js"
import bcrypt from 'bcryptjs'
import customerModel from '../models/customerSchema.js'
import productModel from "../models/productSchema.js";
import SaleModel from "../models/salesSchema.js";
import mongoose from "mongoose";





export const signUpRepo = async (userData) => {
    try {
        const createUser = await userModel.create(userData);
        
        if (!createUser) {
            return { success: false, message: "Failed to create User" };
        }

        const { password, ...mainData } = createUser.toObject();

        return { success: true, createUser: mainData };
    } catch (error) {
        console.log("Error in signUpRepo: ", error);
        return { success: false, message: "An error occurred during user creation" };
    }
};

export const signInRepo = async (userData) => {
  try {
    const { email, password } = userData;

    const findUser = await userModel.findOne({ email });

    if (!findUser) {
      return { success: false, message: "User is not found!!" };
    }

    const passwordValid = await bcrypt.compare(password, findUser.password);

    if (!passwordValid) {
      return { success: false, message: "Incorrect password!!" };
    }

    return {
      success: true,
      message: "Login Successfull",
      userId: findUser._id + "",
    };
  } catch (error) {
    console.log("Error in SignInRepo: ", error);
  }
};

export const addCustomerRepo = async(userId, data) => {
   try {
       const {name, address, phone} = data

       const chechPhoneNumber = await customerModel.findOne({userId, phone});
       console.log("Thsiis che: ", chechPhoneNumber)
       if(chechPhoneNumber){
          return {success:false, message:"Phone number already exists!!"}
       }
       
       const createCustomer = await  customerModel.create({
           userId,
           name,
           address,
           phone
       })
       if(!createCustomer){
           return {success:false, message:"Failed to create customer"}
       }

       const customerData = {
          
           userId:createCustomer.userId + "",
           _id:createCustomer._id + "",
           name:createCustomer.name,
           phone:createCustomer.phone,
           address:createCustomer.address

       }

       return {success:true, customer:customerData}
    
   } catch (error) {
      console.log("Error in addCustomerRepo: ", error);

   }
}


export const addProductRepo = async (userId, data) => {
  try {
    const { product, quantity, price, descripiton } = data;
    

    const createProduct = await productModel.create({
      userId,
      product,
      description: descripiton,
      quantity: parseInt(quantity),
      price: parseInt(price),
    });

    if (!createProduct) {
      return { success: false, message: "Failed to create Product" };
    }
    const productData = {
      _id: createProduct._id + "",
      userId: createProduct.userId + "",
      product: createProduct.product,
      description: createProduct.description,
      quantity: createProduct.quantity,
      price: createProduct.price,
    };
    return { success: true, product: productData };
  } catch (error) {
    console.log("Error in product repo: ", error);
  }
};


export const getAllProductRepo = async (userId) => {
  try {
    
    const getProducts = await productModel.find({ userId });

   
    if (getProducts.length === 0) {
      return { success: true, message: "No products found" };
    }

    const productData = getProducts.map((product) => ({
      _id: product._id.toString(),
      userId: product.userId.toString(),
      product:product.product,
      description: product.description,
      quantity: product.quantity,
      price: product.price,
    }));

    return { success: true, products: productData };
  } catch (error) {
    console.error("Error in getAllProductRepo: ", error);

    return {
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    };
  }
};


export const getAllCustomersRepo = async (userId) => {
  try {
    const findCustomers = await customerModel.find({ userId });

    if (findCustomers.length === 0) {
      return { success: false, message: "No customers found" };
    }

    const customerData = findCustomers.map((person) => ({
      userId:person.userId.toString(),
      _id: person._id.toString(),
      name: person.name,
      address: person.address,
      phone: person.phone,
    }));

    return { success: true, customers: customerData };
  } catch (error) {
    console.error("Error in getAllCustomersRepo: ", error);

    return {
      success: false,
      message: "Failed to fetch customers",
      error: error.message,
    };
  }
};

export const billingProductRepo = async (userId, data) => {
  try {
    const { customersId, billingProducts, paymentType } = data;

    if (
      !userId ||
      !customersId ||
      !billingProducts ||
      billingProducts.length === 0
    ) {
      throw new Error("Invalid data: Missing required fields");
    }

    const saleEntries = [];
    for (const product of billingProducts) {
      const existingProduct = await productModel.findById(product._id);
      if (!existingProduct) {
        return {
          success: false,
          message: `Product with ID ${product._id} not found`,
        };
      }

      if (existingProduct.quantity < product.quantity) {
        return {
          success: false,
          message: `Insufficient stock for product ${product.product}. Available: ${existingProduct.quantity}, Requested: ${product.quantity}`,
        };
      }

      await productModel.findByIdAndUpdate(
        product._id,
        { $inc: { quantity: -product.quantity } },
        { new: true }
      );

      saleEntries.push({
        userId,
        customerId: customersId,
        productId: product._id,
        productName: product.product,
        quantity: product.quantity,
        price: product.price,
        subtotal: product.subtotal,
        saleDate: new Date(),
        paymentType,
      });
    }

    const result = await SaleModel.insertMany(saleEntries);
    if(result){
      return {success:true, message:"Successfully generated"}
    }

    return result;
  } catch (error) {
    console.log("Error in billingProductRepo: ", error);
  }
};

// export const getSalesReportRepo = async (userId, startDate, endDate) => {
//   try {
//     console.log("This si userId: ", userId)
//     const matchStage = {
//       userId: new mongoose.Types.ObjectId(userId), 
//     };

//     if (endDate) {
//       if (!startDate) {
//         matchStage.saleDate = { $lte: new Date(endDate) };
//       } else {
//         matchStage.saleDate = {
//           $gte: new Date(startDate),
//           $lte: new Date(endDate),
//         };
//       }
//     }

    
//     const sales = await SaleModel.aggregate([
//       {
//         $match: matchStage, 
//       },
//       {
//         $lookup: {
//           from: "customers", 
//           localField: "customerId", 
//           foreignField: "_id", 
//           as: "userDetails", 
//         },
//       },
//       {
//         $unwind: "$userDetails", 
//       },
//       {
//         $project:{
//           _id: { $toString: "$_id" },
//           productName:1,
//           customer:"$userDetails.name",
//           quantity:1,
//           price:1,
//           saleDate:1,
//           paymentType:1

//         }
//      }
//     ]);

//    //  console.log("This si slaesddddddddddddddddddddddddddddddd: sla", sales)

    
//     return {success:true, salesData:sales}
    
//   } catch (error) {
//     console.error("getSalesReportRepo: ", error); 
//     throw new Error("Failed to fetch sales report");
//   }
// };

export const getSalesReportRepo = async (userId, startDate, endDate) => {
  try {
    if (!userId) throw new Error("User ID is required");
    
    const matchStage = {
      userId: new mongoose.Types.ObjectId(userId),
    };

    if (endDate) {
      if (!startDate) {
        matchStage.saleDate = { $lte: new Date(endDate) };
      } else {
        matchStage.saleDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
    }

    const sales = await SaleModel.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          productName: 1,
          customer: "$userDetails.name",
          quantity: 1,
          price: 1,
          saleDate: 1,
          paymentType: 1,
        },
      },
    ]);

    if (sales.length === 0) {
      return { success: true, salesData: [], message: "No sales data found" };
    }

    return { success: true, salesData: sales };
  } catch (error) {
    console.error("getSalesReportRepo: ", error);
    throw new Error("Failed to fetch sales report");
  }
};

export const getCustomerLedgerRepo = async (
  userId,
  startDate,
  endDate,
  customerId
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(customerId)
    ) {
      return { success: false, message: "Invalid userId or customerId" };
    }

    const matchStage = {
      userId: new mongoose.Types.ObjectId(userId),
      customerId: new mongoose.Types.ObjectId(customerId),
    };

    if (endDate) {
      if (!startDate) {
        matchStage.saleDate = { $lte: new Date(endDate) };
      } else {
        matchStage.saleDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
    }

    const sales = await SaleModel.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          productName: 1,
          customer: "$userDetails.name",
          quantity: 1,
          price: 1,
          saleDate: 1,
          paymentType: 1,
        },
      },
    ]);

    return { success: true, customerLedger: sales };
  } catch (error) {
    console.log("Error in getCustomerLedgerRepo: ", error);
  }
};

export const getItemsReportRepo = async (
  userId,
  startDate,
  endDate,
  productId
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return { success: false, message: "Invalid userId or productId" };
    }

    const matchStage = {
      userId: new mongoose.Types.ObjectId(userId),
      productId: new mongoose.Types.ObjectId(productId),
    };

    if (endDate) {
      if (!startDate) {
        matchStage.saleDate = { $lte: new Date(endDate) };
      } else {
        matchStage.saleDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
    }

    const sales = await SaleModel.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          productName: 1,
          customer: "$userDetails.name",
          quantity: 1,
          price: 1,
          saleDate: 1,
          paymentType: 1,
        },
      },
    ]);

    return { success: true, itemsReport: sales };
  } catch (error) {
    console.log("Error in getItemsReportRepo: ", error);
  }
};

export const removeProductRepo = async(userId, productId) => {
   try {
        console.log("Entered in to removeProductRepo")
        const removeProduct = await productModel.deleteOne({_id:productId});

        if(removeProduct.deletedCount === 0){
           return {success:false, message:"Failed to delete the product"}
        }

          return {success:true, message:"Successfully deleted!!"}
    
   } catch (error) {
      console.log("Error in removeProductRepo: ", error)
   }
}



export const removeCustomerRepo = async (userId, customerId) => {
  try {
    console.log("Entered in removeCustomerRepo");
    const removeCustomer = await customerModel.deleteOne({ _id: customerId });

    if (removeCustomer.deletedCount === 0) {
      return { success: false, message: "Failed to deleted customer" };
    }

    return { success: true, message: "Successfully removed customer!!" };
  } catch (error) {
    console.log("Error in removeCustomerRepo: ", error);
  }
};

export const updateProductRepo = async (productId, data) => {
  try {
    console.log("This is updateProductRepo: ", productId, data);

    const updateProduct = await productModel.updateOne(
      { _id: productId },
      { $set: data }
    );

    if (updateProduct.modifiedCount === 0) {
      return {
        success: false,
        message:
          "Failed to update the product. Product not found or no changes made.",
      };
    }

    return { success: true, message: "Product updated successfully!" };
  } catch (error) {
    console.log("Error in updateProductRepo: ", error);
  }
};

export const updateCustomerRepo = async(customerId, data) => {
  try {
    console.log("This is customerUpdateRepo: ", customerId, data);

    const updateCustomer = await customerModel.updateOne(
      {_id:customerId},
      {$set:data}
    );
    console.log("This is updateCustomer: ", updateCustomer)
    if (updateCustomer.modifiedCount === 0) {
      return {
        success: false,
        message:
          "Failed to update the customer. customer not found or no changes made.",
      };
    }

    return { success: true, message: "Customer updated successfully!" };
   
  } catch (error) {
     console.log("Error in updateCustomerRepo: ", error);
  }
}



