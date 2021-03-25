const fs = require("fs");
const {getheadings} = require("../headings.js");

const {tocfile, finalizetoc} = require("../tocgen.js");

// CONSTANTS
const {TOCSTART, TOCEND, TOCREGEX} = require("../config.js")

function expand(content) {
    content = content.split("\n").map(i => {
        return `${i}\n`;
    });
    let last = content.length - 1;
    content[last] = content[last].trim()
    return content;
}

function recurse(cells, counter, headings, depth, do_tags, root=null) {

    return new Promise((resolve, reject) => {

        let advance = () => {
            // advance recursion step
            if (counter < cells.length - 1) {
                recurse(cells, counter + 1, headings, depth, do_tags, root).then(i => resolve(i));
            } else {
                resolve(cells);
            }
        }

        if (cells[counter].cell_type == "markdown") {
            // read celldata
            let celldata = cells[counter].source.join("");
            
            getheadings(celldata, depth, do_tags, root).then(res => {

                // update cell content
                cells[counter].source = expand(res.content)

                if (res.headings.length != 0) { // if there are heading 

                    // handle headings
                    let lastheading = res.headings.slice(-1)[0];

                    // check if root
                    if (root === null || root.count >= lastheading.count) {

                        root = lastheading;
                        res.headings.forEach(i => headings.push(i));
                    } else {
                        // subheading
                        
                        res.headings.forEach(i => root.addsubheading(i));
                    }

                }
                advance();
            });
        } else {
            // non-markdown cells
            advance();
        }
    });
}

function tocnb(nb, toc) {
    let inserted = false;
    
    // check if already has toc
    nb.cells.forEach((cell, index) => {
        if (cell.cell_type == "markdown" && !inserted) {

            let content = cell.source.join("");
            if (content.includes(TOCSTART) && content.includes(TOCEND)) {
                // update
                content = content.replace(TOCREGEX, toc.slice(0, -1))
                nb.cells[index].source = expand(content);
                inserted = true;
            }

        }
    });

    if (!inserted) {
        // else add to new cell at top
        console.log("Added new TOC.")
        nb.cells.splice(0, 0, {
            cell_type: "markdown",
            metadata: {},
            source: expand(toc.slice(0, -1))
        });
    }

    return nb;
}

function parsenb(content, depth, do_tags) {
    let nb = JSON.parse(content);
    let headings = []

    let counter = 0;

    return new Promise((resolve, reject) => {
        recurse(nb.cells, counter, headings, depth, do_tags).then(new_cells => {

            console.log(headings);

            nb.cells = new_cells;
            // assemble and insert
            toc = finalizetoc(headings, "");
            nb = tocnb(nb, toc);
    
            // return changes
            content = JSON.stringify(nb, null, 1);
            resolve(content);
        });

    });
}

function mktoc(filepath, depth, do_tags) {
    // markdown file mktoc

    tocfile(filepath, (content) => {
        parsenb(content, depth, do_tags).then(newcontent => {

            // write changes to file 
            fs.writeFile(filepath, newcontent, err => {
                if (!err) {
                    console.log("Changes written to file.")
                } else console.log(err);
            })
        })
    })

}

module.exports = {mktoc}
