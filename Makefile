# Get package subdirectories
export PKGDIRS := $(wildcard packages/*)

# Make targets for package directories
export PKGCMDS := clean build test

# Phone so pkg dir targets actually do something
.PHONY: default setup $(PKGDIRS) $(PKGCMDS) 

# Put Node bins in path
export PATH := node_modules/.bin:$(PATH)
export SHELL := /bin/bash

default: build

setup: $(PKGDIRS)
	yarn install
	$(MAKE) -C example setup

lint: $(PKGDIRS)
	$(MAKE) -C example lint

$(PKGCMDS): $(PKGDIRS)
$(PKGDIRS):
	$(MAKE) -C $@ $(MAKECMDGOALS)
