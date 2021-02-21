const fs = require("fs");
const {tocfile, maketoc} = require("../tocgen.js");

function mktoc(filepath, depth) {
    // markdown file mktoc

    tocfile(filepath, (content) => {

        maketoc(content, depth).then(newdata => {
            fs.writeFile(filepath, newdata, err => {
                if (!err) {
                    console.log("Changes written to file.")
                } else console.log(err);
            });

        });
    })

}

module.exports = {mktoc}
