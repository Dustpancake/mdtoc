const fs = require('fs');

const {getheadings} = require('./headings.js');

// CONSTANTS

const TOCSTART = "<!--BEGIN TOC-->";
const TOCEND = "<!--END TOC-->";
const TOCREGEX = new RegExp(`${TOCSTART}[\\s\\S^<]*${TOCEND}`);


function fmttoc(toc) {
    // formats TOC string
    return `${TOCSTART}\n## Table of Contents\n${toc}\n${TOCEND}\n`;
}

function inserttoc(content, toc) {
    if (content.includes(TOCSTART) && content.includes('<!--END TOC-->')) {
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

function maketoc(content, depth) {
    // returns content with TOC inserted

    return new Promise((resolve, reject) => {
        getheadings(content, depth).then(ret => {
            // assemble TOC
            toc = buildtoc(ret.headings)
            console.log(toc);
            // format
            toc = fmttoc(toc); 
            // insert
            content = inserttoc(ret.content, toc);
            
            resolve(content);
        });
    });
}

function tocfile(filepath, depth) {
    let logstring = `Generating TOC for "${filepath}":`;
    console.log(logstring);
    console.log("-".repeat(logstring.length));

    fs.readFile(
        filepath, 
        {encoding: "utf-8"},
        // callack
        (err, data) => {

        if (!err) {

            maketoc(data, depth).then(newdata => {
                fs.writeFile(filepath, newdata, err => {
                    if (!err) {
                        console.log(newdata)
                        console.log("Changes written to file.")
                    } else console.log(err);
                });

            });

        } else {
            console.log(`** Skipping: Error opening file\n${err}\n`);
        }

    });

}

module.exports = {tocfile, maketoc}