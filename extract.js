const fs = require('fs');
const tsCode = fs.readFileSync('data/components.ts', 'utf8');
const coursesCode = fs.readFileSync('data/home.ts', 'utf8');
const runRegex = (code, varName) => {
  const match = code.match(new RegExp(export const  + varName + (?:: [^=]+)? = ([\\s\\S]+?);));
  if (match) return eval('(' + match[1] + ')');
  return [];
};
const comps = runRegex(tsCode, 'roboticsComponents');
fs.writeFileSync('data/components.json', JSON.stringify(comps, null, 2));

const courses = runRegex(coursesCode, 'courses');
fs.writeFileSync('data/courses.json', JSON.stringify(courses, null, 2));
