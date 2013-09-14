FILES = `find . -regex ".*test.*\.js" | grep -v node_modules  | sort`
REPORTER ?= dot

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha -R $(REPORTER) $(FILES) --check-leaks

testwatch:
	@NODE_ENV=test nodemon ./node_modules/mocha/bin/mocha -R $(REPORTER) $(FILES) --check-leaks

.PHONY: test

