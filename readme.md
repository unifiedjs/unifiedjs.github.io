<!-- lint disable first-heading-level -->

# [`unifiedjs.com`][site]

[![][screenshot]][site]

## Build

Do `npm i` and then `npm t`, which checks and builds the site.
This basic build uses two shortcuts over the full build:

* Images are not optimized
* Data is not crawled

The full build is a slow site to properly build!
Takes about 20 minutes (🤯) on my tiny trusted 12 inch MacBook.
The reason for this is that it crawls the whole ecosystem.
We contact 5 API’s: GitHub, npm, npms, OpenCollective, and BundlePhobia.
When generating, it builds a performant static site.
Everything is minified.
Images are highly optimized.

To fully build the site, create a `.env` file with the following tokens:

```ini
GH_TOKEN=123123123
NPM_TOKEN=456456456
OC_TOKEN=789789789
```

Then, `npm install` and `UNIFIED_OPTIMIZE_IMAGES=1 npm test` should do the
trick!

```sh
npm i && UNIFIED_OPTIMIZE_IMAGES=1 npm t
```

[site]: https://unifiedjs.com

[screenshot]: screenshot.png
