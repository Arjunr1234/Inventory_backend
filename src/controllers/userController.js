import { getAllProductRepo } from "../repositories/userRepository.js";
import { addCustomerService, addProductService, billingProductService, getAllCustomersService, getAllProductService, getCustomerLedgerService, getItemsReportService, getSalesReportService, removeCustomerService, removeProductService, signInService, signUpService, updateCustomerService, updateProductService } from "../service/userService.js";
import { HttpStatusCode } from "../utils/statusCodes.js";

export const signUp = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
     console.log(req.body)
    if (!name || !email || !phone || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide necessary data" });
    }

    const userData = { name, email, phone, password };
    const response = await signUpService(userData);

    if (!response.success) {
      res.status(401).json({
        success: false,
        message: "Failed to Signup",
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userData: response.createUser,
    });
  } catch (error) {
    console.log("Error in signUp: ", error);
    next();
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Please provide necessary data",
      });
    }

    const data = { email, password };

    const response = await signInService(data);

    if (!response.success) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: response.success,
        message: response.message,
      });
    }

    // res.cookie("userToken", response.token, {
    //   httpOnly: true,
    //   samesite: "Strict",
    //   maxAge: 14 * 24 * 60 * 60 * 1000,
    // });
    res.cookie("userToken", response.token, {
      httpOnly: true, 
      sameSite: "None", 
      secure: true, 
      maxAge: 14 * 24 * 60 * 60 * 1000, 
    });

    res.status(HttpStatusCode.OK).json({
      success: response.success,
      message: response.message,
      token: response.token,
      userId: response.userId,
    });
  } catch (error) {
    console.log("Error in SignIn: ", error);
    next(error);
  }
};

export const addCustomer = async (req, res, next) => {
  try {
    const userId = req.roleId;
    const { name, address, phone } = req.body;
    const data = { name, address, phone };
    const response = await addCustomerService(userId, data);
   // console.log("respose: ", response)
    if (!response.success) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: response.success,
        message: response.message,
      });
      return;
    }
    res.status(HttpStatusCode.OK).json({
      success: response.success,
      customer: response.customer,
    });
  } catch (error) {
    console.log("Error in addCustomer : ", error);
    next();
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const userId = req.roleId; 
    const { product, descripiton, quantity, price } = req.body;
    const data = { product, descripiton, quantity, price };

    const response = await addProductService(userId, data);
   // console.log("This is respose; ", response)
    if (!response.success) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: response.success,
        message: response.message,
      });
      return;
    }
    res.status(HttpStatusCode.OK).json({
      success: response.success,
      product: response.product,
    });
  } catch (error) {
    console.log("Error in addProduct: ", error);
    next();
  }
};

export const getAllCustomers = async(req, res, next) => {
   try {
    console.log("hai")
    const userId = req.roleId;
    //const userId = req.query.id;
    console.log("userId: ", userId)
    const response = await getAllCustomersService(userId);
   // console.log("Thsi res: ", response)
    if(!response.success){
        res.status(HttpStatusCode.BAD_REQUEST).json({
           success:false, 
           message:response.message
        })
        return 
    }
      res.status(HttpStatusCode.OK).json({
        success:true,
        customers:response.customers
      })
    
   } catch (error) {
      console.log("Error in getAllcustomers: ", error)
   }
}

export const getAllProducts = async(req, res, next) => {
   try {
     const userId = req.roleId;
    //const userId = req.query.id

     const response = await getAllProductService(userId);
    // console.log("This is respose: ", response)
     if(!response.success){
      res.status(HttpStatusCode.BAD_REQUEST).json({
         success:false, 
         message:response.message
      })
      return 
  }
    res.status(HttpStatusCode.OK).json({
      success:true,
      products:response.products
    })
    
   } catch (error) {
      console.log("Error in getAllProducts: ", error);
      next()
   }
}

export const billingProduct = async(req, res, next) => {
   try {
       console.log("Entered into billingproducts")
       
       const userId = req.roleId
       const response = await billingProductService(userId, req.body);

       if(!response.success){
        res.status(HttpStatusCode.BAD_REQUEST).json({
          success:false, 
          message:response.message
       })
       return 
       }

       res.status(HttpStatusCode.OK).json({
        success:true,
        message:response.message
      })


    
   } catch (error) {
      console.log("Error in billingProduct: ", error);
      next()
   }
}

export const getSalesReport = async(req, res, next) => {
    try {
       
        const startDate = req.query.startDate;
        const endDate = req.query.endDate
        
        const userId = req.roleId
        const response = await getSalesReportService(userId, startDate, endDate);
        
        if(!response.success){
          res.status(HttpStatusCode.BAD_REQUEST).json({
            success:false, 
            message:response.message
         })
         return 
         }

        res.status(HttpStatusCode.OK).json({
          success:true,
          salesData:response.salesData
        }) 
      
    } catch (error) {
        console.log("Error in getSalesReport: ", error);
        next()
    }
}

export const getCustomerLedger = async (req, res, next) => {
  try {
    const userId = req.roleId;
    const { customerId, startDate, endDate } = req.query;

    const response = await getCustomerLedgerService(
      userId,
      startDate,
      endDate,
      customerId
    );
    if(!response.success){
          res.status(HttpStatusCode.BAD_REQUEST).json({
            success:false, 
            message:response.message
         })
         return 
         }
         
        res.status(HttpStatusCode.OK).json({
          success:true,
          customerReport:response.customerLedger
        }) 

  } catch (error) {
    console.log("Error in getCustomerLedger: ", error);
    next();
  }
};


export const getItemsReport = async (req, res, next) => {
    console.log("Entered into in getItemReport: ")
  try {
    console.log("this is query: ", req.query)
    const userId = req.roleId;
    const { productId, startDate, endDate } = req.query;

    const response = await getItemsReportService(
      userId,
      startDate,
      endDate,
      productId
    );

    if(!response.success){
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success:false, 
        message:response.message
     })
     return 
     }
     
    res.status(HttpStatusCode.OK).json({
      success:true,
      itemsReport:response.itemsReport
    }) 



  } catch (error) {
    console.log("Error in getItemsReport: ", error);
    next();
  }
};

export const removeProduct = async(req, res, next) => {
    try {
        const userId = req.roleId;
        const productId = req.params.productId;
        console.log("This is productId: ", productId)
        
        const response = await removeProductService(userId, productId);

        if(!response.success){
          res.status(HttpStatusCode.BAD_REQUEST).json({
            success:false, 
            message:response.message
         })
         return 
         }
         
        res.status(HttpStatusCode.OK).json({
          success:true,
          message:response.message
        }) 

    } catch (error) {
       console.log("Error in removeProduct: ", error);
       next();
    }
}

export const removeCustomer = async(req, res, next) => {
  try {
      const userId = req.roleId;
      const customerId = req.params.customerId;

      const response = await removeCustomerService(userId, customerId)
      
      if(!response.success){
        res.status(HttpStatusCode.BAD_REQUEST).json({
          success:false, 
          message:response.message
       })
       return 
       }
       
      res.status(HttpStatusCode.OK).json({
        success:true,
        message:response.message
      }) 
  } catch (error) {
     console.log("Error in removeCustomer: ", error);
     next();
  }
}

export const updateCustomer = async(req, res, next) => {
   try {
      const customerId = req.params.customerId;
      console.log("Thsi is the body: ", req.body)
      const {name, phone, address} = req.body
      const data = {name, phone, address}
      const response = await updateCustomerService(customerId, data);
      console.log("This is the repsosne: ", response)
      if(!response.success){
        res.status(HttpStatusCode.BAD_REQUEST).json({
          success:false, 
          message:response.message
       })
       return 
       }
       
      res.status(HttpStatusCode.OK).json({
        success:true,
        message:response.message
      }) 
   } catch (error) {
      console.log("Error in updateCustomer: ", error);
      next()
   }
}

export const updateProduct = async(req, res, next) => {
  try {

    const productId = req.params.productId;
      console.log("Thsi is the body: ", req.body)
      const {product, description, quantity, price} = req.body 
      const data = {product, description, quantity, price}
      const response = await updateProductService(productId, data);
      if(!response.success){
        res.status(HttpStatusCode.BAD_REQUEST).json({
          success:false, 
          message:response.message
       })
       return 
       }
       
      res.status(HttpStatusCode.OK).json({
        success:true,
        message:response.message
      }) 
  } catch (error) {
     console.log("Error in updateProduct: ", error);
     next()
  }
}
 
