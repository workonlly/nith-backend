const { createDepartmentController } = require('./departmentCrudFactory');

module.exports = createDepartmentController({
  code: 'phy',
  displayName: 'Physics',
  tablePrefix: 'phy',
});
