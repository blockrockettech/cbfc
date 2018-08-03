#!/usr/bin/env bash

node ./node_modules/.bin/truffle-flattener ./contracts/Migrations.sol > ./contracts-flat/Migrations-flat.sol;

node ./node_modules/.bin/truffle-flattener ./contracts/KOTA.sol > ./contracts-flat/KOTA-flat.sol;
