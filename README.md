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

# Add dependencies to packages

```json
"test": "echo 'No tests'",
"deploy": "echo Deployment successfully"
```

# Add tasks

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["lint", "test", "^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^test"]
    },
    "deploy": {
      "dependsOn": ["build"]
    }
  }
}
```

# Generage pdf graph

```sh
npx turbo run build --graph=graph.pdf
```

# Create graph script

```json
"graph": "turbo-graph -o"

```

# Create deploy script

```json
  "deploy": "turbo deploy",
```
