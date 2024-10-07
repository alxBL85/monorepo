# Export env variables

```sh
export NPM_CONFIG_REGISTRY=https://registry.npmjs.org/

```

# We have to create the monorepo

```sh
pnpm dlx create-turbo@latest demo --package-manager=pnpm
```

# Install graph dependencies

```sh
sudo apt install graphviz
cd demo
pnpm i @yeger/turbo-graph -w
```

```

```
