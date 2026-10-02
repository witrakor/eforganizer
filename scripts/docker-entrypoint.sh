#!/bin/sh
set -eu
node init-db.mjs
exec node server.js
