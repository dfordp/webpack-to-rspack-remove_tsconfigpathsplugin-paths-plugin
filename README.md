Handles the migration of the TsconfigPathsPlugin web pack plug into an included plugin in rspack.

### Before

```ts
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  resolve: {
    plugins: [new TsconfigPathsPlugin({})],
  },
};
```

### After

```ts
module.exports = {
  resolve: {
    tsConfig: {},
  },
};
```
,This codemod turns X into Y. It also does Z.
Note: this is a contrived example. Please modify it.

### Before

```ts
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  resolve: {
    plugins: [new TsconfigPathsPlugin.TsconfigPathsPlugin()],
  },
};
```

### After

```ts
module.exports = {
  resolve: {
    tsConfig: {},
  },
};
```

