commitlint:
	npm install
	npm install -g commitizen
	mkdir .husky
	echo "npx --no -- commitlint --edit \$$1" > .husky/commit-msg
