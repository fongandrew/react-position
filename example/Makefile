.PHONY: default clean build watch

# Put Node bins in path
export PATH := ../node_modules/.bin:$(PATH)
export SHELL := /bin/bash

default: build

clean:
	rm -rf public

build: clean
	webpack

lint:
	tslint --type-check --project tsconfig.json

watch: clean
	webpack-dev-server
