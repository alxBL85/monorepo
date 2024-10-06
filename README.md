# MONOREPOS LEVEL 0: PNPM WORKSPACES

Step by step guide to mount a Monorepo with PNPM Workspaces:

## Initial Configuration

> Make sure the directory **monorepo** does not exist or delete it in such case, if you want to start from the beginning

```sh {"id":"01J9GBSYKXHEFK4S2PKTFH4QQQ"}
rm -rf monorepo
```

```sh {"id":"01J9G72R2QW8QY4MR6PH1933CY"}
mkdir monorepo
cd monorepo
git init
pnpm init
touch pnpm-workspace.yaml
tee -a pnpm-workspace.yaml <<EOF
packages:
 - 'projects/*'
 - '!**/test/**'
EOF
```

```sh {"cwd":"./monorepo","id":"01J9GF9FG1MFHHXS2N1KWRBBRD"}
tee .gitignore<<EOF
**/node_modules/*
**/dist/*

.nx/cache
.nx/workspace-data

# Next.js
.next
out
EOF
```

```sh {"cwd":"","id":"01J9GAMQ1BBZ97AG9P3QH0QRQB","name":"MONOREPO_DIRECTORY"}
cd monorepo
pwd
```

### Install common dependencies to all subprojects:

```bash {"cwd":"./monorepo","id":"01J9G6W8VHY1FV0DVHJ85AQK60"}
pnpm add typescript jest eslint prettier -w
pnpm add "@typescript-eslint/eslint-plugin" "@typescript-eslint/parser"  -w
pnpm add "eslint-config-prettier" "eslint-plugin-prettier" -w
pnpm add "source-map-support" "ts-jest" "ts-loader" "ts-node" "tsconfig-paths" -w
pnpm add "@types/jest" -D -w
```

> Flag -w indicates the dependency will be installed in "workspace root" (the main project) but it will be available for all projects

### Global Configurations

> In all of the following configuration files, I’m mostly using the default values created by NestJS CLI.

#### Typescript

Create a tsconfig.json file with the following values:

```sh {"cwd":"./monorepo","id":"01J9G6W8VHY1FV0DVHJACQGWNG"}
pnpm exec tsc --init
tee tsconfig.json <<EOF
{
  "compilerOptions": {
    "module": "es6",
    "target": "es6",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
EOF
```

#### TS Config

```sh {"cwd":"./monorepo","id":"01J9GCB8Z84MTNBCJQ3K9G345F"}
tee tsconfig.build.json <<EOF
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "dist", "test", "**/*spec.ts"]
  "outDir": "./dist"
}
EOF
```

#### PRETTIER

Configure Prettier updating the file `.prettierrc`:

```sh {"cwd":"./monorepo","id":"01J9G6W8VHY1FV0DVHJDMRMT1Z"}
touch .prettierrc
tee .prettierrc <<EOF
{
  "singleQuote": true,
  "trailingComma": "all"
}
EOF
```

### Eslint

```sh {"cwd":"./monorepo","id":"01J9GCJF2G9ZDN2ZEARGYTJHKZ"}
tee .eslintrc.js<<EOF
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
EOF
```

### JEST

```sh {"cwd":"./monorepo","id":"01J9GCQ7PQ7K9391W6V1ZZPWQQ"}
touch jest.config.js
tee jest.config.js<<EOF
module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  rootDir: '.',
  testRegex: '.*\.test\.ts$',
  transform: {
    '^.+\.(t|j)s$': 'ts-jest'
  },
  collectCoverageFrom: [
    '**/*.(t|j)s'
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node'
}
EOF
```

## Creation of sub projects:

In this section we are going to create 3 sub projects:

1. Core: It will contain all those generic Interfaces, Classes, Enums, and such; that are going to be reused in other projects.
2. Backend: It will contain an HTTP API, built with **Nestjs** that exposes the project's business logic.
3. Frontend: It will show a quick webpage, built with **Nextjs** that allows to interact with the project

```sh {"cwd":"./monorepo","id":"01J9GC7EF2RJA0BGH79W05Y4FS"}
mkdir projects
cd projects
mkdir core
cd core
tree ./projects

```

### Core:

1. Inside ./projects/core, execute:

Let's init and install some local dependencies:

```sh {"id":"01J9GJDKJT7XTNE9AGX03A4VJM"}
pnpm init
pnpm add typescript --filter core -D
pnpm add zod --filter core
```

Check that both **typescript** and **Zod** are installed as a symlink from the root node_modules

```sh {"cwd":"./monorepo/projects/core","id":"01J9GJFS5RGTKNVDSA0X9DEJJ0"}
tree -L 2 node_modules
```

Let's add some configuration files as extension of the root files:

```bash {"cwd":"./monorepo/projects/core","id":"01J9G6W8VHY1FV0DVHJH9M8RNM"}

tee tsconfig.json<<EOF
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
  "outDir": "./dist"},
}
EOF
tee tsconfig.build.json<<EOF
{
  "extends": "../../tsconfig.build.json"
}
EOF
tee jest.config.js<<EOF
const config = require('../../jest.config');
 
module.exports = {
  ...config
}
EOF
```

```bash {"cwd":"./monorepo","id":"01J9GESQEG1SDQMCV0GYBRXPKN"}
tree -L 2 ./projects
```

Let's update the package.json **scripts** with the following scripts:

```json {"id":"01J9GGAYE8WS8W7SZHJYJV7PN3"}
{
"test": "jest",
"build": "tsc"
}

```

Lets update the **main** atribute to point to file: ./dist/index.js

```json {"id":"01J9GM8VETW86RS4ZG00EECT97"}
{"main": "./dist/index.js"}
```

Let's create our first index.ts file, the entry point

```sh {"cwd":"./monorepo/projects/core","id":"01J9G6W8VHY1FV0DVHJKT1HGE8"}
tee index.ts<<EOF
import { z } from 'zod';

export type BaseRecord = Record<string, any>;

export enum Status {
  SUCCESS = 1,
  FAIL = 0,
  UNKNOW = -1,
  WAITING = 2,
}

export const BaseDTO = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  status: z.nativeEnum(Status),
  payload: z.record(z.any()).optional(),
});

export function validateDTO(o: any) {
  const result = BaseDTO.safeParse(o);
  return result;
}
EOF

```

#### Testing

```sh {"cwd":"./monorepo/projects/core/","id":"01J9GKAEDTTZR30J4HB9FT7WYC"}
tee index.test.ts<<EOF
import { BaseRecord, Status, validateDTO } from "."

describe("Testing projects/core/index.ts", ()=>{
    describe("Testing validation:", ()=>{
        it("should pass a valid object:", ()=> {
            const anyObject = {
                id:1,
                name: "test",
                status: Status.SUCCESS,
                payload: {
                    name: "test"
                }
            } as BaseRecord

            const validation = validateDTO(anyObject);
            expect(validation.success).toBeTruthy();
        })
    })
})
EOF
```

```sh {"cwd":"./monorepo/projects/core","id":"01J9GKBQ2N1VC3QJ5HZ0KTVMAT"}
pnpm --filter core run test
```

#### Building

```sh {"cwd":"./monorepo/project/core","id":"01J9GFE8RQMRYHGWCHWFFPPE21"}
pnpm --filter core run build
```

### Backend

Inside ./monorepo/projects

```bash {"cwd":"./monorepo/projects","id":"01J9G6W8VHY1FV0DVHJQ47Q0ZF"}
nest new backend --skip-git
cd backend
```

You can run it using:

```bash {"cwd":"./monorepo/projects/backend","id":"01J9GMGW6ZXPPXWTNGK48K575E"}
pnpm run start:dev
```

### Frontend

Go to ```./monorepo/projects/``` execute the following interactive CLI to create the project **frontend**

```bash {"cwd":"./monorepo/projects","id":"01J9G6W8VHY1FV0DVHJRP6SNM1"}
npx create-next-app@latest
```

To change the default ports, let's update the scripts like this

```jsonl {"id":"01J9GNFE1WPSM174RRZ08K9K5Y"}
"scripts": {
    "dev": "next dev -p 8181",
    "build": "next build",
    "start": "next start -p 8080",
    "lint": "next lint"
  },
```

If you want to, you can execute it like this:

```bash {"cwd":"./monorepo/projects/frontend","id":"01J9GMTJG934ZJR6MBHJ7K0CVT"}
pnpm dev
```

### Interconnect dependencies:

1. Go to ./packages/backend
2. Update package.json to include the new dependency:

```sh {"cwd":"./monorepo/projects/backend","id":"01J9G6W8VHY1FV0DVHJSFWTPGR"}
pnpm add core --filter backend --workspace
```

Se creará una entrada en dependencies como esto:

```sh {"id":"01J9G6W8VHY1FV0DVHJT1GHKZJ"}
"core": "workspace:^"
```

1. Now go to the `app.service.ts` file and include the following code:

```typescript {"id":"01J9G6W8VHY1FV0DVHJW70KKWP"}
import { Injectable } from '@nestjs/common';
import { BaseRecord, Status, validateDTO } from 'core';

@Injectable()
export class AppService {
getHello(): any {
const baseObject: BaseRecord = {
id: 1,
name: 'Test',
payload: {
operation: 'Testing',
},
status: Status.SUCCESS,
};

    return validateDTO(baseObject);

}
}

```

Lets add the **core** dependency:

```sh {"cwd":"./monorepo/projects/frontend","id":"01J9GNSP4020G4Q9VQP32D5B2J"}
pnpm add core --filter frontend --workspace

```

You will see dependencies like this:

```typescript
 "dependencies": {
    "core": "workspace:^",
    "next": "14.2.14",
    "react": "^18",
    "react-dom": "^18"
  },
```

Update the file page.tsx:

Import:
```
import { BaseRecord, Status, validateDTO } from 'core';
```

Inside Home, add this snippet:
```
const base: BaseRecord = {
    id: 3,
    name: "Front Test",
    data: {
      result: Status.SUCCESS
    },
    status: Status.SUCCESS
  }

  const validation = validateDTO(base);
```

Inside the return add this chunk:

```
 <div>
          {JSON.stringify(validation.data)}
</div>
```

---

You can execute it like this:

```sh {"id":"01J9GPH2GWGSHCENGMB0RFEE4W"}
pnpm dev
```

## Quick Tips

> It is possible to execute scripts of each subproject from the root directory like this:

```bash {"id":"01J9G6W8VHY1FV0DVHJWQ1JX1K"}
pnpm --filter subproyect1 run build
```

---

### Open Questions:

#### How Can I:

1. List all subprojects?
2. Visualize the inter dependencies between projects?
3. Execute an specific command in one project?
4. Execute a command in all the subprojects? (test, build, ...)
5. Check the dependencies between my subprojects?
6. Publish my project only when my commits include a new feature?
7. Fight against **Dependency Hell** :fire

> There's a lot of room for improvement


