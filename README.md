# mdtoc

A simple table of contents generator for markdown documents. 

To setup, clone the repository and run
```
cd mdtoc && npm install
```

If you want to be able to use the tool in any directory for OSX or Linux, also run
```
echo "export PATH=$(pwd):$PATH" >> ~/.profile
```

### Usage
In a terminal
```
mdtoc {file|dir} [{file|dir}, ...]
```
The program will crawl directories for `.md` files and generate a table of contents in the format

1. [Heading]()
2. [Heading]()
	1. [Subheading]()
		1. [Sub-subheading]()
	2. [Subheading]()
3. [Heading]()

### Features
- Creates hyperlinked index references using `<a name="">` tags.
- Nests headings, subheadings, and sub-subheadings in coherent format.
- Places generated table of contents at top of document, tagged with 
```
<!--BEGIN TOC-->
...
<!--END TOC-->
```
If the tags are moved and the program executed again, `mdtoc` will replace the existing table of contents, instead of reinserting at the top of the document.