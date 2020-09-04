.PHONY: default lerna-make npm-install lerna-bootstrap


default: npm-install lerna-bootstrap lerna-make

npm-install:
	npm i

lerna-make:
	./node_modules/.bin/lerna exec make --stream

lerna-bootstrap:
	./node_modules/.bin/lerna bootstrap

lerna-clean:
	./node_modules/.bin/lerna clean --yes

lerna-publish:
	./node_modules/.bin/lerna publish --force-publish --loglevel debug
