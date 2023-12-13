#!/bin/sh

# Run database migrations
npx typeorm-ts-node-esm --dataSource=dist/database/data-source.js migration:run

# Run the main container command
exec "$@"