const { createDepartmentController } = require('./departmentCrudFactory');

module.exports = createDepartmentController({
  code: 'msc',
  displayName: 'Materials Science & Engineering',
  tablePrefix: 'msc',
});
