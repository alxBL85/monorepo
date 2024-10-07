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

# Generage pdf grah

```sh
npx turbo run build --graph=graph.pdf
```

# Create graph script

```json
"graph": "turbo-graph -o"

```

# Add dependencies to packages

```json
"test": "echo 'No tests'",
"deploy": "echo Deployment successfully"
```
