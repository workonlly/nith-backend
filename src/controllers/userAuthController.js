const { SuccessResponse, ErrorResponse } = require("../middlewares/utils/common");
const { UserAuthService  } = require("../services");
const { StatusCodes } = require("http-status-codes");


async function createUser(req, res) {
  try {
    const data={
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        department_id: req.body.department_id || null   
    }
    const user = await UserAuthService.createUser(data);
    SuccessResponse.message = "User created successfully";
    SuccessResponse.data = user;
    return res
      .status(StatusCodes.CREATED)
      .json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = error.message;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

async function loginUser(req, res) {
  try {
    const response = await UserAuthService.loginUser(req.body);
    SuccessResponse.message = "User logged in successfully";
    SuccessResponse.data = response;
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = error.message;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}


module.exports = {
  createUser,
  loginUser
};