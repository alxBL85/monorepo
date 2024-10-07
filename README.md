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
      "dependsOn": ["build", "^deploy"]
    }
  }
}
```

# Create deploy script

```json
"deploy": "turbo deploy",
```

# Create graph script

```json
"graph": "turbo-graph -o",

```
