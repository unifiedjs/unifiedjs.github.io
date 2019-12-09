<!-- lint disable lint-first-heading-level -->

# [`unifiedjs.com`][site]

[![][screenshot]][site]

## Build

This is a slow site to build!
Takes about 20 minutes (🤯) on my tiny trusted 12 inch MacBook.
The reason for this is that it crawls the whole ecosystem.
We contact 5 API’s: GitHub, npm, npms, OpenCollective, and BundlePhobia.
When generating, it builds a performant static site.
Everything is minified.
Images are highly optimised.

To build the site, create a `.env` file with the following tokens:

```ini
GH_TOKEN=123123123
NPM_TOKEN=456456456
OC_TOKEN=789789789
```

Then, `npm install` and `npm test` should do the trick!

```sh
npm i && npm t
```

If you are contributing, for example, by writing an article in the learning
section, then make changes to `learn/` and instead use `npm run format` to
check if everything’s OK.

[site]: https://unifiedjs.com

[screenshot]: screenshot.png
