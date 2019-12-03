/**
 * AspieCode Text Engine for Asperger Media Pty Ltd
 * Copyright © 2019 Asperger Media Pty Ltd
 * Based off aspiecode, whirlpool.net.au (c) Simon Wright, 2008
 * 
 * @license PRIVATE
 * This code must not be copied and/or distributed without
 * the express permission of the author.
 */

/**
 * 2019-12-04: Intial Branch of aspiecode
 */

function aspiecode(src, params) {
	var txt = src;
	var i = 0;
	enabled = {
		aspiecode: true,
		headings: false,
		paragraph: true,
		entities: true,
		basichtml: true,
		autolink: true,
		wordfilter: true,
		linelimit: true,
		metablocks: false
	};
	
	if (typeof params == 'string') {
		enabled = {
			aspiecode: (params.indexOf("a") > -1),
			headings:  (params.indexOf("h") > -1),
			paragraph: (params.indexOf("p") > -1),
			entities:  (params.indexOf("e") > -1),
			basichtml: (params.indexOf("b") > -1),
			autolink:  (params.indexOf("i") > -1),
			wordfilter:(params.indexOf("f") > -1),
			linelimit: (params.indexOf("l") > -1),
			metablocks:(params.indexOf("m") > -1)
		};
	} else if (typeof params == 'object') {
		for (i in params) {
			enabled[i] = params[i];
		}
	}

	/* Repair iOS smart punctuation bugs: ‘ ’ and “ ” */
	if (enabled.aspiecode) {
		txt = txt.replace(/\[[\u2018\u2019]/g, "['")
		         .replace(/\[[\u201C\u201D]/g, '["')
				 .replace(/[\u2018\u2019]\]/g, "']")
				 .replace(/[\u201C\u201D]\]/g, '"]');
	}

	/* Exclude meta blocks {{}} even across line breaks */
	if (enabled.metablocks) {
		txt = txt.replace(/\{\{[\s\S]+\}\}/g, "");
	}
	
	/* Temporarily escape HTML into «angle-quotes» */
	txt = txt
		.replace(/\u00AB/g, "&laquo;")
		.replace(/\u00BB/g, "&raquo;") // escape real angle-quotes
		.replace(/</g, "\u00AB")
		.replace(/>/g, "\u00BB"); // escape html
	
	/* Split into paragraphs */
	txt = txt
		.replace(/\r\n?/g, "\n") // remove char 13 (carriage returns), or replace 13/10 with 10
		.replace(/([^\n])\n([=#*]{1,3}\s|[+]{3}|[:$]\s|@[0-9]{1,12}\s|\+\+\{)/g, "$1\n\n$2") // if the line starts with a paragraph controller, make sure it's got two newlines preceeding
		.replace(/([^\n])\n(-----)/g, "$1\n\n$2") // if the line starts with a paragraph controller, make sure it's got two newlines preceeding
		.replace(/([^\n])\n([^\n])/g, "$1<br>$2") // when there's only one newline, replace with a line break
		.replace(/\n\n+/g, "\n"); // now that we've differentiated breaks from pars, strip multiple newlines
	
	/* Bad ascii */
	txt = txt.replace(/\u00A0/g, " "); // non-breaking space (ascii 160)
	
	if (enabled.aspiecode) {
				
				/* Wiki aspiecode (regexp matches either [[$2|$3]] or [[$4]]) */
				txt = txt.replace(/\(\((([-A-Z0-9_ ]+?)\|(.+?)|([-A-Z0-9_ ]+?))\)\)/ig, "<a class=\"wiki\" href=\"/wiki/$2$4\">$3$4</a>");
				
				/* Wiki links - replace spaces with underscores */
				txt = txt.replace(/"\/wiki\/([-A-Z0-9_ ]*?) ([-A-Z0-9_]*?) ([-A-Z0-9_]*?) ([-A-Z0-9_]*?) ([-A-Z0-9_]*?)"/ig, '"/wiki/$1_$2_$3_$4_$5"')
				         .replace(/"\/wiki\/([-A-Z0-9_ ]*?) ([-A-Z0-9_]*?) ([-A-Z0-9_]*?) ([-A-Z0-9_]*?)"/ig, '"/wiki/$1_$2_$3_$4"')
				         .replace(/"\/wiki\/([-A-Z0-9_ ]*?) ([-A-Z0-9_]*?) ([-A-Z0-9_]*?)"/ig, '"/wiki/$1_$2_$3"')
				         .replace(/"\/wiki\/([-A-Z0-9_ ]*?) ([-A-Z0-9_]*?)"/ig, '"/wiki/$1_$2"');
				
				/* Define and assign aspiecode to each paragraph */
				var aspiecode = [
					{code:"\\*", 	tag:"strong"},
					{code:"/",   	tag:"em"},
					{code:"_", 	 	tag: "u"},
					{code:"\\\\",	tag:"sub"},   
					{code:"\\^", 	tag:"sup"},
					{code:"-",   	tag:"strike"},
					{code:"#",   	tag:"tt"},
					{code:"\\(", 	tag:"small", code2:"\\)"},
					{code:"\"",  	tag:"span", plus:" class=\"wcrep1\""},
					{code:"'" ,  	tag:"span", plus:" class=\"wcrep2\""},
					{code:"`",   	tag:"span", plus:" class=\"wcgrey\""},
					{code:"~",   	tag:"span", plus:" class=\"wcserif\""},
					//{code:"\\+", 	tag:"span", plus:" class=\"wcauth\""}, // deprecated, will be removed soon
					{code:"_",   	tag:"span", plus:" class=\"wcspoil\""},
					{code:"\\?", 	tag:"a", plus:" href=\"http://www.google.com.au/search?q=$1\""}
				];
				for (i = 0; i < aspiecode.length; i++) {
					txt = txt.replace(
						new RegExp("\\(" + aspiecode[i].code + "(.+?)" + (aspiecode[i].code2?aspiecode[i].code2:aspiecode[i].code) + "\\)", "g"),
						"<" + aspiecode[i].tag + (aspiecode[i].plus?aspiecode[i].plus:"") + ">$1</" + aspiecode[i].tag + ">"
					);
				}
				
				/* Process aspiecode escape sequence */
				txt = txt.replace(/\(\.(.+?)\.\)/g, "($1)");
				
	}
	if (enabled.basichtml) {
				
				/* Un-escape permitted HTML */
				var allowhtml = [
					{tag:"a", inner:" href=\"(/|https?://|mailto:)[^\"]+?\""},
					{tag:"strong|b"},
					{tag:"em|i"},
					{tag:"small"},
					{tag:"tt"},
					{tag:"sup"},
					{tag:"sub"},
					{tag:"strike"}
				];
				for (i = 0; i < allowhtml.length; i++) {
					txt = txt.replace(
						new RegExp("\u00AB(" + allowhtml[i].tag + ")(" + (allowhtml[i].inner?allowhtml[i].inner:"()") + ")\u00BB(.+?)\u00AB/\\1\u00BB", "ig"),
						"<" + allowhtml[i].tag.split("|")[0] + "$2>$4</" + allowhtml[i].tag.split("|")[0] + ">"
					);
				}
				
	}
	if (enabled.entities) {
					
				/* Automatic entities */
				txt = txt
					.replace(/&(\s)/ig, "&amp;$1")
					.replace(/ -- /ig, " &mdash; ")
					.replace(/ - /ig, " &ndash; ")
					.replace(/\(c\)/ig, "&copy;")
					.replace(/\(r\)/ig, "&reg;")
					.replace(/\(tm\)/ig, "&trade;")
					.replace(/(\s)1\/4([^0-9])/ig, "$1&frac14;$2")
					.replace(/(\s)1\/2([^0-9])/ig, "$1&frac12;$2")
					.replace(/(\s)3\/4([^0-9])/ig, "$1&frac34;$2");
				
	}
	if (enabled.wordfilter) {
	
				/* Swearing */
				txt = txt
					.replace(/fuck(ed|ing|er)/ig, "flapp$1")
					.replace(/fuck/ig, "flap")
					.replace(/cunt/ig, "legend");
	}
	if (enabled.autolink) {
	
				/* Detect links and email addresses that don't start with ["/:] as these are probably inside a tag already */
				txt = " " + txt;
				//txt = txt.replace(/([^""\/=])\b(https?:\/\/|ftp:\/\/|file:\/\/|www\.)([-A-Z0-9+&@#\/%?=~_|!:,.;()]*[-A-Z0-9+&@#\/%=~_|])/ig, '$1<a href="$2$3">$2$3</a>');
				txt = txt.replace(/([^""\/=])\b(https?:\/\/|ftp:\/\/|file:\/\/|www\.)([-A-Z0-9+&@#\/%?=~_|!:,.;]*(?:_\([-A-Z0-9+&@#\/%=~_|?!:,.;]*\)|[-A-Z0-9+&@#\/%=~_|]))/ig, '$1<a href="$2$3">$2$3</a>');
				txt = txt.replace(/href="www\./ig, 'href="http:/'+'/www.');
				txt = txt.replace(/([^"":=])\b(?:mailto:)?([A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4})\b/ig, '$1<a href="mailto:$2">$2</a>');
	
	}
	
	/* Prep the lines and meta arrays */
	var linein = txt.split('\n');
	var lines = [];
	var meta = [];
	
	/* Encapsulate distinct paragraphs with the appropriate tags */
	for (i = 0; i < linein.length; i++) {
		var l = linein[i].replace(/^\s+/, '').replace(/(\s|<br>)+$/, ''); // delete any preceding space and trailing <br> tags
		var m = "";
		
		if (enabled.headings && l.search(/^===\s+/) != -1)            { m = "2"; } // heading 2
		if (enabled.headings && l.search(/^==\s+/) != -1)             { m = "3"; } // heading 3
		if (enabled.headings && l.search(/^=\s+/) != -1)              { m = "4"; } // heading 4
		if (enabled.headings && l.search(/^\+\+\{.+\}$/) != -1)       { m = "+"; } // wiki include
		if (enabled.paragraph && l.search(/^:\s+/) != -1)             { m = ":"; } // blockquote
		if (enabled.paragraph && l.search(/^\$\s+/) != -1)            { m = "$"; } // code
		if (enabled.paragraph && l.search(/^-----$/) != -1)           { m = "-"; } // horizontal rule
		if (enabled.paragraph && l.search(/^@[0-9]{1,12}\s+/) != -1)  { m = "@"; } // forum reference ("@1234 Foo Bar writes..."; replace break with new paragraph)
		if (enabled.paragraph && l.search(/^[*#]{1,3}\s+/) != -1)     { m = l.match(/^([*#]{1,3})\s+/)[1]; } // lists
		if (m.length == 0 && l.length > 0)                            { m = "p"; }
		
		switch (m.charAt(0)) {
			case "2": l = "<h2>" + l.replace(/^===\s+/,'') + "</h2>"; break;
			case "3": l = "<h3>" + l.replace(/^==\s+/,'') + "</h3>"; break;
			case "4": l = "<h4>" + l.replace(/^=\s+/,'') + "</h4>"; break;
			case "p": l = "<p>" + l + "</p>"; break;
			case ":": l = "<p>" + l.replace(/^:\s+/,'') + "</p>"; break;
			case "@": l = "<p class=\"reference\">" + l.replace(/^@([0-9]{1,12})\s+/,'$1 ').replace(/<br>/, "</p>\n<p>") + "</p>"; break;
			case "#":
			case "*": l = "<li>" + l.replace(/^[*#]{1,3}\s+/,'') + "</li>"; break;
			case "$": l = l.replace(/^\$\s+/,''); break;
			case "-": l = "<hr>"; break;
			case "+": l = l.replace(/^\+\+\{(.+)\}$/,"$1"); l = "<p class=\"include\" title=\"" + l + "\">(include: " + l + ")</p>"; break;
			default: continue; // skip this line
		}
		
		/* Identify and skip non-printing lines. Line must either have a printable character or an <hr> */
		var printable = l;
		if (i < 2) { printable = printable.replace(/<span class="wcspoil">.{1,4}<\/span>/g, ""); } // no short spoilers on first line
		printable = printable.replace(/<[^>]*>?/g, "").replace(/&nbsp;/g, "").replace(/\s+/g, "").replace(/[,.:;''`]{1,3}/, "");
		if (i === 0) { printable = printable.replace(/\W{1,3}/, ""); } // no short non-word bits on the first line
		if (printable.length === 0 && m !== "-") continue;
		
		/* If the line hasn't been "continued" into oblivion, append to new arrays */
		lines.push(l);
		meta.push(m);
	}
	
	/* Encapsulate lists and blockquotes with beginning and end tags */
	for (i = 0; i < lines.length; i++) {
		if (meta[i]==":") { // if line is a blockquote
		
			if (i==0              || meta[i] != meta[i-1]) lines[i] = "<blockquote>\n" + lines[i]; // if CURRENT neq LAST then prepend <blockquote>
			if (i==lines.length-1 || meta[i] != meta[i+1]) lines[i] += "\n</blockquote>"; // if CURRENT neq NEXT then append </blockquote>
			
		} else if (meta[i]=="$") { // if line is a pre block
		
			if (i==0              || meta[i] != meta[i-1]) lines[i] = "<pre>" + lines[i]; // if CURRENT neq LAST then prepend <blockquote>
			if (i==lines.length-1 || meta[i] != meta[i+1]) lines[i] += "</pre>"; // if CURRENT neq NEXT then append </blockquote>
			
		} else if (meta[i].match(/(\*|#)+/)) { // if line is a list item
		
			for (var j = 2; j >= 0; j--) { // for each of the three possible levels, decending (2,1,0)
				var current = meta[i].charAt(j); // get current list state
				if (current.length && (i==0              || current != meta[i-1].charAt(j) )) lines[i] = (current=="*"?"<ul>\n":"<ol>\n") + lines[i]; // if CURRENT neq LAST then prepend <?l>
				if (current.length && (i==lines.length-1 || current != meta[i+1].charAt(j) )) lines[i] += (current=="*"?"\n</ul>":"\n</ol>"); // if CURRENT neq NEXT then append </?l>
			}
			
		}
	}

	txt = lines.join('\n');
	
	
	/* Style various A tags */
	txt = txt
			//.replace(/(<a.+?>)https?:\/\/(wpool\.com|whrl\.pl)(\/.+?<\/a>)/g, "$1$2$3")
			
			.replace(/<a href=""?https?:(\/\/[a-z.]*aspergers\.network)/ig, "<a href=\"$1") // strip protocol from URL of all internal links
			
			.replace(/(<a.+?>)https?:\/\/aspergers\.network\/forums(\/.+?<\/a>)/g, "$1$2") // fix link label: strip out aspergers.network/forums domain from labels
			
			.replace(/<a href=""?(\/\/[a-z.]*whirlpool\.net\.au)/ig, "<a class=\"internal\" href=\"$1") // style internal links
			.replace(/<a href=""?(\/[^\/])/ig, "<a class=\"internal\" href=\"$1") // style internal links
			.replace(/<a href=""?https?:\/\/whrl\.pl/ig, "<a class=\"internal\" href=\"//whrl.pl") // style internal links
			.replace(/<a href=""?http/ig, "<a class=\"external\" rel=\"nofollow\" target=\"_blank\" href=\"http") // style external links
			.replace(/<a href=""?mailto/ig, "<a class=\"email\" href=\"mailto") // style email links
			
			.replace(/<span class="wcauth"> ?([0-9]{1,12})([^<]+?)<\/span>/ig, "<span class=\"wcauth\"><a onclick=\"jumpToReplyId($1);return false;\" title=\"$1\">$2</a></span>") // old style forum references
			.replace(/<p class="reference">([0-9]{1,12}) (.+?)<\/p>/ig, "<p class=\"reference\"><a onclick=\"jumpToReplyId($1);return false;\" title=\"$1\">$2</a></p>"); // new style forum references
	
	
	/* Rejected unicode */
	txt = txt.replace(/[\u2580\u2581\u2582\u2583\u2584\u2585\u2586\u2587\u2588\u2589\u258A\u258B\u258C\u258D\u258E\u258F\u2590\u2591\u2592\u2593\u2594\u2595\u2596\u2597\u2598\u2599\u259A\u259B\u259C\u259D\u259E\u259F]/g, "waah "); // http://www.alanwood.net/unicode/block_elements.html
	
	
	if (enabled.linelimit) {
				
				var inputString = txt;
				var outputArray = [];
				var maxColumns = 30;
				var spaceMatchRegexp = /^((<[^>]+>|[^<\s]){0,30}\s+)+/;
				var ptagMatchRegexp = /^<\/?[p|h1|h2|h3|ul|ol|li|hr|br]>/;
				var entityMatchRegexp = /^&\w+?;/;
				var charCount = 0;
				var howMuchToGrab = 0;
				// var iterations = 0;
				while(inputString.length) {
					// iterations++;
					
					// Short-circuit where near/at end
					if(inputString.length < maxColumns) {
						outputArray.push(inputString);
						break;
					}
					
					var spaceMatches = inputString.match(spaceMatchRegexp);
					var ptagMatches = inputString.match(ptagMatchRegexp);
					
					// skip to next candidate area
					if(spaceMatches && spaceMatches[0]) {
						howMuchToGrab = spaceMatches[0].length;
						charCount = 0;
					// jump html tags
					} else if(inputString.charAt(0) == "<" && inputString.indexOf(">") > -1) {
						howMuchToGrab = inputString.indexOf(">");
						if (inputString.match(ptagMatchRegexp)) charCount = 0; // if it's a paragraph tag, reset the character count
					// jump entities
					} else if(inputString.match(entityMatchRegexp) ) { 
						howMuchToGrab = (inputString.indexOf(";") > -1) ? 1+inputString.indexOf(";") : inputString.length;
						charCount++;
					// normal character
					} else { // optimisation todo: grab as much as I can (ensuring charCount > maxColumns is true))
						howMuchToGrab = 1;
						charCount++;
					}
					
					// move chunk from input to output 
					outputArray.push(inputString.substring(0, howMuchToGrab));
					inputString = inputString.substring(howMuchToGrab);
					
					// if the limit is hit, add a word break
					if(charCount >= maxColumns) {
						outputArray.push("<wbr>"); // http://www.quirksmode.org/oddsandends/wbr.html
						charCount = 2; // not sure why but testing bares this out
					}
					
				}
				// + "(ran " + iterations + " times)";
				txt = outputArray.join("");
	
	}
	
	
	/* Remaining angle-quotes become escaped */
	txt = txt.replace(/\u00AB/g, "&lt;").replace(/\u00BB/g, "&gt;");
	
	
	return txt;
}