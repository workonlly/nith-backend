const fs = require('fs');
const path = require('path');

const controllers = ['blog.js', 'building.js', 'senate.js'];
for (const file of controllers) {
  const filePath = path.join('src/authorities', file);
  let lines = fs.readFileSync(filePath, 'utf8').split('\n');
  
  let startIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const deleteLocalFile = async (fileUrl) => {')) {
      startIndex = i;
      break;
    }
  }
  
  if (startIndex !== -1) {
    let endIndex = startIndex;
    while (endIndex < lines.length && lines[endIndex].trim() !== '};') {
      endIndex++;
    }
    lines.splice(startIndex, endIndex - startIndex + 1);
    fs.writeFileSync(filePath, lines.join('\n'));
  }
}
console.log('Fixed completely');
