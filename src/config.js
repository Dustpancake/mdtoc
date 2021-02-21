
// configurable
const TOCSTART = "<!--BEGIN TOC-->";
const TOCEND = "<!--END TOC-->";

// calculated
const TOCREGEX = new RegExp(`${TOCSTART}[\\s\\S^<]*${TOCEND}`);
const RE_TOCSTART = new RegExp(`^${TOCSTART}`);
const RE_TOCEND = new RegExp(`^${TOCEND}`);

module.exports = {TOCSTART, TOCEND, TOCREGEX, RE_TOCSTART, RE_TOCEND}