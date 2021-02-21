const config = require("./config.js")

function parseheading(line) {
    /* return count of # at start of line*/
    return line.split(' ')[0].match(/#/g || []).length
}

class Heading {
    /* class for storing headings */ 

    constructor(heading, hashcount, counter) {
        this.raw = heading
        // computed
        this.title = heading.substring(hashcount).trim();
        this.count = hashcount;
        this.tag = `${counter}-` + this.title.replace(/ /g, "-")
        // subheadings
        this.subheadings = []
    }

    tagged() {
        return `${this.raw} <a name="${this.tag}"></a>`;
    }

    addsubheading(subheading) {
        if (this.subheadings.length != 0) {
            // check if further nested
            let lastheading = this.subheadings.slice(-1)[0];

            if (lastheading.count < subheading.count) {
                lastheading.addsubheading(subheading);
            } else {
                this.subheadings.push(subheading);
            }

        } else {
            this.subheadings.push(subheading);
        }
    }

};

function escapes(state, line) {
    // updates state depending on whether in escape sequence or not
    if (line.match(/^```/)) {
        if (state == "codeblock") {
            state = ""
        } else state = "codeblock";
    } else if (line.match(config.RE_TOCSTART)) {
        state = "toc"
    } else if (line.match(config.RE_TOCEND)) {
        state = "";
    }
    return state;
}

function getheadings(content, hashdepth=2, currentroot=null) {
    /* returns promise which resolves to object
        {
            headings: Heading[] 
            content: String
        }
    of major headings and modified content */

    return new Promise((resolve, reject) => {

        var state = ""; // keep track of escape sequences; atm only ``` and $$
        let rootheadings = []
        let counter = 0

        content.split("\n").forEach(rawline => {
            // update state of escapes
            state = escapes(state, rawline);

            if (state == "" && rawline.startsWith("#")) {
                // remove tag if it exists
                line = rawline.split("<a name")[0].trim();

                // count number of #
                let hashcount = parseheading(line);

                if (currentroot === null && hashcount != hashdepth) {
                    // don't include in TOC
                } else {
                    // instance new heading
                    let heading = new Heading(line, hashcount, counter);
                    counter++;

                    // replace line in content with tagged version
                    content = content.replace(
                        rawline,
                        heading.tagged()
                    )
                    
                    if (currentroot !== null && currentroot.count != hashcount) {
                        // add as a subheading
                        currentroot.addsubheading(heading);

                    } else {
                        // add as a root
                        rootheadings.push(heading);
                        currentroot = heading;
                    }
                }
            }
        });
        
        // return
        resolve({
            headings: rootheadings,
            content: content
        })

    });
}


// commonJS export 
module.exports = {getheadings}