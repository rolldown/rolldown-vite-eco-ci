build:
    pnpm --filter './apps/**' --filter "!./apps/qwik-*" run build

setup:
    pnpm install -r
    just build

test:
    pnpm verify-build

