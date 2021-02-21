var path = require('path');
var fs = require('fs');

const filesys = require("./filesystem.js");
const tocgen = require("./tocgen.js");

function markdown(file, depth) {
    tocgen.tocfile(file, depth);
}

function ipythonb(file, depth) {
    console.log("ipynb is todo")
}

function generate(file, depth) {
    let ext = path.extname(file);

    if (ext == ".md") {
        // markdown file
        markdown(file, depth);
    } else if (ext == ".ipynb") {
        // jupyter notebook
        ipythonb(file, depth)
    }
}

function run(root, depth) {
    if (!fs.lstatSync(root).isDirectory()) {
        generate(root, depth);
    } else {
        
        /* entrypoint of crawler */
        filesys.crawldir(root, (file) => {
            generate(file, depth);
        });
    }
}

module.exports = {run}