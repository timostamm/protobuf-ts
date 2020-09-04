.PHONY: default clean build test

default: test build

build: clean
	@./node_modules/.bin/ng build runtime-angular --prod

test:
	@./node_modules/.bin/ng test runtime-angular

clean:
	@find dist \( -name '*.__ivy_ngcc_bak' -or -name '*.metadata.json' -or -name '*.map' -or -name '*.ts' -or -name '*.js' \) -delete;
