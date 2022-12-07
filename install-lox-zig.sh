here=$PWD
cd ../lox-zig
zig build -Dwasm -Drelease-fast
cd $here
cp ../lox-zig/zig-out/lib/lox.wasm ./public/assets/lox.wasm