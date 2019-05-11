import fs from "fs";
import path from "path";
import lessToJs from "less-vars-to-js";

export default () => {
  const themePath = path.join(__dirname, "../themes/default.less");
  return lessToJs(fs.readFileSync(themePath, "utf8"));
};
