.PHONY: default setup clean build lint test

# Put Node bins in path
export PATH := node_modules/.bin:$(PATH)
export SHELL := /bin/bash

default: build

setup:
	yarn install
	lerna bootstrap

clean:
	$(MAKE) -C packages/react-append clean

build: clean
	$(MAKE) -C packages/react-append build

lint:
	$(MAKE) -C packages/react-append lint

test:
	$(MAKE) -C packages/react-append test
