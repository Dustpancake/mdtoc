var path = require('path');
var fs = require('fs');

const filesys = require("./filesystem.js");

// File type handling

const ipynb = require("./filetypes/ipynb.js");
const md = require("./filetypes/markdown.js");

function markdown(file, depth, do_tags) {
    md.mktoc(file, depth, do_tags);
}

function ipythonb(file, depth, do_tags) {
    ipynb.mktoc(file, depth, do_tags);
}

// Methods

function generate(file, depth, do_tags) {
    let ext = path.extname(file);

    if (ext == ".md") {
        // markdown file
        markdown(file, depth, do_tags);
    } else if (ext == ".ipynb") {
        // jupyter notebook
        ipythonb(file, depth, do_tags)
    }
}

function run(root, depth, do_tags) {
    if (!fs.lstatSync(root).isDirectory()) {
        generate(root, depth, do_tags);
    } else {
        
        /* entrypoint of crawler */
        filesys.crawldir(root, (file) => {
            generate(file, depth, do_tags);
        });
    }
}

module.exports = {run}