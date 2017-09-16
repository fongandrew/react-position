.PHONY: default clean build lint test

# Put Node bins in path
export PATH := ../../node_modules/.bin:$(PATH)
export SHELL := /bin/bash

default: build

clean:
	rm -rf lib

build: clean
	tsc -p tsconfig.build.json

test:
	ts-node --project tsconfig.test.json \
		../../node_modules/.bin/tape \
			-r tsconfig-paths/register \
			-r '../../test-helpers/setup-dom.ts' \
			'src/**/*.test.*' | tap-spec
