cd ../lox-zig
zig build -Dwasm
cd ../main
cp ../lox-zig/zig-out/lib/lox.wasm ./public/assets/lox.wasm