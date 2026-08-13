const fs = require('fs');
const path = require('path');

const controllers = ['blog.js', 'building.js', 'finance_commitee.js', 'senate.js'];
for (const file of controllers) {
  const filePath = path.join('src/authorities', file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove the redefined deleteLocalFile function
  const deleteRegex = /const deleteLocalFile = async \([^)]+\) => {[\s\S]*?};\n/g;
  content = content.replace(deleteRegex, '');
  
  fs.writeFileSync(filePath, content);
}
console.log('Fixed local function definitions');
