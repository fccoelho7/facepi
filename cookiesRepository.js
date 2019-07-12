const fs = require("fs");

const cookiesRepository = {
  src: "cookies.txt",
  save(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.src, JSON.stringify(data), err => {
        if (err) reject(err);
        resolve("The cookie has been saved!");
      });
    });
  },

  get() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.src, function(err, data) {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    });
  }
};

module.exports = { cookiesRepository };
