const fs = require('fs');
const path = require('path');

function crawldir(fpath, callback) {
    /* crawls through directory and executes callback on each file */

    if (fs.existsSync(fpath) && fs.lstatSync(fpath).isDirectory()) {
        // read directory contents

        fs.readdir(fpath, (err, files) => {

            files.forEach(file => {
                // skip dotfiles
                if (file.startsWith(".")) {
                    // skip
                } else { 
                    // join path
                    file = path.join(fpath, file);

                    if (fs.lstatSync(file).isDirectory()) {
                        crawldir(file, callback)
                    }
                    else callback(file);
                }

            });
            
        });

    }

}

module.exports = {crawldir}