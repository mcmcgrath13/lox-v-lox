# lox-v-lox

A web app comparing the results of [lox-rs](https://github.com/mcmcgrath13/lox-rs) and lox-zig interpreters for the same program.  Both lox's are compiled to wasm, so this is a serverless app.

## Prereqs

- Node 16
- [rsw-rs](https://github.com/rwasm/rsw-rs) - 🦞 wasm-pack based build tool
_

## Quick Start

RSW is looking for the lox implementations in sibling directories to the root directory of this project.

### Development
```bash
npm install
npm run watch

# in a different tab
npm run dev
```

**Note**: The web workers do not work in development mode, so to test that functionality, build and run the app locally.

```bash
npm run build
python3 -m http.server -d dist
```

### Production
```bash
npm install
npm run build-gh
```
