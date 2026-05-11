const { SuccessResponse, ErrorResponse } = require("../middlewares/utils/common");
const { DepartmentService } = require("../services");
const { StatusCodes } = require("http-status-codes");

async function addDepartment(req, res) {
    try {
        const departmentData = {
            name: req.body.name,
            code: req.body.code,
        };
        const newDepartment = await DepartmentService.createDepartment(departmentData);
        SuccessResponse.data = newDepartment;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.error = error;
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
}


module.exports = {
    addDepartment,
};