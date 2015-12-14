#!/bin/bash
mongoexport -h localhost:3001 -d meteor -c accounts -o accounts.json --jsonArray --pretty
mongoexport -h localhost:3001 -d meteor -c items -o items.json --jsonArray --pretty