/**
 * Created by liguanjian on 2017/7/29.
 */

let fs = require("fs");

class data_provider {

    constructor() {
        this.dataPath;
    }

    readData(path) {
        this.dataPath = path;
        var isExist = fs.existsSync(this.dataPath);
        var data;
        if (isExist) {
            try {
                data = JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
            }
            catch (e) {
                console.log("parse data error!");
                data = "解析文件错误，请确定这是对话文件。";
            }
            return data;
        } else {
            return "data file no exist, please check on it.";
        }
    }

    wirteData() {
        fs.writeFileSync(this.dataPath, JSON.stringify(_.uniq(oldList)));
    }
}

module.exports = new data_provider();