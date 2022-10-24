# ccij-water-search
Water article search

## Development

The project is split into two directories;

    /nlp
    /site

`/nlp` contains Python scripts which update data files in `/site` e.g. `/site/src/data/db.json`.

`/site` is then served as a static website with all searching, filtering etc. done client side.

### Site

To update client side portions of the static website e.g. to add new UI, pages etc. edit non-data `/site` files .e.g `/site/src/index.html`. 

To run it locally run `yarn start` in the `/site` directory and then go to `http://localhost:1234`

Data files should not be updated manually in `/site` as the `/nlp` scripts may overwrite any changes you make.
