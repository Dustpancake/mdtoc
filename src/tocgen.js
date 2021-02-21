const fs = require('fs');

const {getheadings} = require('./headings.js');

// CONSTANTS
const {TOCSTART, TOCEND, TOCREGEX} = require("./config.js")

function fmttoc(toc) {
    // formats TOC string
    return `${TOCSTART}\n## Table of Contents\n${toc}\n${TOCEND}\n`;
}

function inserttoc(content, toc) {
    if (content.includes(TOCSTART) && content.includes(TOCEND)) {
        return content.replace(TOCREGEX, toc.slice(0, -1))
    } else {
        return toc + content;
    }
}

function indent(string) {
    // indents each line of string with 4 spaces
    let items = string.split("\n");
    items.pop(); // remove last item, as is empty
    return `    ${items.join("\n    ")}\n`; // add new line character back
}

function buildtoc(headings) {
    let toc = "";

    headings.forEach((h, index) => {
        // entry fmt 
        toc += `${index+1}. [${h.title}](#${h.tag})\n`

        if (h.subheadings.length != 0) {
            toc += indent(
                buildtoc(h.subheadings)
            );
        }

    });

    return toc;
}

function finalizetoc(headings, content) {
    toc = buildtoc(headings)
    console.log(toc);
    // format
    toc = fmttoc(toc); 
    // insert
    content = inserttoc(content, toc);
    return content;
}

function maketoc(content, depth) {
    // returns content with TOC inserted

    return new Promise((resolve, reject) => {
        getheadings(content, depth).then(ret => {
            resolve(
                finalizetoc(ret.headings, ret.content)
            );
        });
    });
}

function tocfile(filepath, handler) {
    let logstring = `Generating TOC for "${filepath}":`;
    console.log(logstring);
    console.log("-".repeat(logstring.length));

    fs.readFile(
        filepath, 
        {encoding: "utf-8"},
        // callack
        (err, data) => {

        if (!err) {
            // call handler on data
            handler(data);
        } else {
            console.log(`** Skipping: Error opening file\n${err}\n`);
        }

    });

}

module.exports = {tocfile, maketoc, finalizetoc}