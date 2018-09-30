default: server

server:
	nodemon server

tests:
	mocha

monitor:
	pm2 monit

PHONY: server
