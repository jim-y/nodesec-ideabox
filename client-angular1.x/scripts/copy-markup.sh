#!/usr/bin/env bash

echo "Copying markup.."
node node_modules/cpx/bin/index.js "app/**/*.html" dist
