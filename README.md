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

You need the [netlify CLI](https://docs.netlify.com/cli/get-started/) to run the functions in development.

In the `/site` directory run;
1. `yarn start`
2. `netlify dev`
