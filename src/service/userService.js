import bcrypt from 'bcryptjs'
import { addCustomerRepo, addProductRepo, billingProductRepo, getAllCustomersRepo, getAllProductRepo, getCustomerLedgerRepo, getItemsReportRepo, getSalesReportRepo, removeCustomerRepo, removeProductRepo, signInRepo, signUpRepo, updateCustomerRepo, updateProductRepo } from '../repositories/userRepository.js';
import jwt from 'jsonwebtoken'


export const signUpService = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const data = {
      ...userData,
      password: hashedPassword,
    };
    const response = await signUpRepo(data);
    return response;
  } catch (error) {
    console.log("Error in signUPService: ", error);
  }
};


export const signInService = async (userData) => {
  try {
    const response = await signInRepo(userData);

    if (!response.success) {
      return { success: false, message: response.message };
    }

    const payload = { id: response.userId };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "14d",
    });

    return {
      success: true,
      message: response.message,
      token,
      userId: response.userId,
    };
  } catch (error) {
    console.log("Error in SignInService: ", error);
    throw error
  }
};

export const addCustomerService = async(userId, data) => {
   try {
      const response = await addCustomerRepo(userId, data);
      return response
    
   } catch (error) {
      console.log("Error i addCustomerService: ", error);
   }
}

export const addProductService = async(userId, data) => {
   try {
      const response = await addProductRepo(userId, data);
      return response
    
   } catch (error) {
      console.log("Error in addProductService: ", error);

   }
}

export const getAllCustomersService = async(userId) => {
    try {
       const response = await getAllCustomersRepo(userId);
       return response
      
    } catch (error) {
       console.log("Error in getAllCustomers: ", error);

    }
}

export const getAllProductService = async(userId) => {
   try {
       const response = await getAllProductRepo(userId);
       return response
   } catch (error) {
      console.log("Error in getALLproductService: ", error)
   }
}

export const billingProductService = async(userId, data) => {
   try {
       const response = await billingProductRepo(userId, data)
       return response
    
   } catch (error) {
      console.log("Error in billingProductService: ", error)
   }
}

export const getSalesReportService = async(userId, startDate, endDate) => {
     try {
          const response = await getSalesReportRepo(userId, startDate, endDate)
          return response
     } catch (error) {
        console.log("Error in getSalesReportService: ", error)
     }
}

export const getCustomerLedgerService = async(userId, startData, endDate, customerId) => {
  try {
        const  response = await getCustomerLedgerRepo(userId, startData, endDate, customerId);
        return response
  } catch (error) {
    console.log("Error in getCustomerLedgerService: ", error);
  
  }
}

export const getItemsReportService = async(userId, startData, endDate, productId) => {
  try {
      const response = await getItemsReportRepo(userId, startData, endDate, productId);
      return response
    
  } catch (error) {
    console.log("Error in getItemsReportService: ", error);
    
  }
}

export const removeProductService = async(userId, productId) => {
   try {
    const response = await removeProductRepo(userId, productId);
    return response
    
   } catch (error) {
     console.log("Error in removeProductService: ", error);
     
   }
}

export const removeCustomerService = async(userId, customerId) => {
  try {

      const response = await removeCustomerRepo(userId, customerId);
      return response
   
  } catch (error) {
    console.log("Error in removeCustomerService: ", error);
    
  }
}

export const updateProductService = async(productId, data) => {
   try {
        const response = await updateProductRepo(productId, data);
        return response
    
   } catch (error) {
      console.log("Error in updateProductService: ", error)
   }
}

export const updateCustomerService = async(cusomterId, data) => {
  try {
      const response = await updateCustomerRepo(cusomterId, data);
      return response
   
  } catch (error) {
     console.log("Error in updateCustomerService: ", error)
  }
}