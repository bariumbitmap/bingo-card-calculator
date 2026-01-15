lint :
	tidy -errors -quiet index.html
	npx semistandard script.js
