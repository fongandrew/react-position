.PHONY: default clean build lint test

# Put Node bins in path
export PATH := ../../node_modules/.bin:$(PATH)
export SHELL := /bin/bash

default: build

clean:
	rm -rf lib

build: clean
	tsc -p tsconfig.build.json

lint:
	tslint --type-check --project tsconfig.build.json

test:
	ts-node --project tsconfig.test.json \
		../../node_modules/.bin/tape \
			-r '../../lib/setup-dom.ts' \
			'src/**/*.test.*' | tap-spec
