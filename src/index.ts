export default function transform(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let dirtyFlag = false;

  // Remove the require statement for 'tsconfig-paths-webpack-plugin'
  root.find(j.VariableDeclaration).forEach((path) => {
    const declaration = path.node.declarations[0];
    if (
      j.VariableDeclarator.check(declaration) &&
      j.CallExpression.check(declaration.init)
    ) {
      const callee = declaration.init.callee;
      if (j.Identifier.check(callee) && callee.name === 'require') {
        const args = declaration.init.arguments;
        if (
          args.length === 1 &&
          j.Literal.check(args[0]) &&
          args[0].value === 'tsconfig-paths-webpack-plugin'
        ) {
          j(path).remove();
          dirtyFlag = true;
        }
      }
    }
  });

  // Transform the resolve.plugins array to resolve.tsConfig
  root.find(j.ObjectExpression).forEach((path) => {
    const properties = path.node.properties;
    properties.forEach((property, index) => {
      if (
        j.ObjectProperty.check(property) &&
        j.Identifier.check(property.key) &&
        property.key.name === 'resolve'
      ) {
        const resolveValue = property.value;
        if (j.ObjectExpression.check(resolveValue)) {
          resolveValue.properties.forEach(
            (resolveProp, resolveIndex) => {
              if (
                j.ObjectProperty.check(resolveProp) &&
                j.Identifier.check(resolveProp.key) &&
                resolveProp.key.name === 'plugins'
              ) {
                const pluginsValue = resolveProp.value;
                if (
                  j.ArrayExpression.check(pluginsValue) &&
                  pluginsValue.elements.length > 0
                ) {
                  const firstElement =
                    pluginsValue.elements[0];
                  if (
                    j.NewExpression.check(firstElement) &&
                    (j.Identifier.check(
                        firstElement.callee,
                      ) ||
                      j.MemberExpression.check(
                        firstElement.callee,
                      ))
                  ) {
                    const calleeName = j.Identifier.check(
                        firstElement.callee,
                      ) ?
                      firstElement.callee.name :
                      firstElement.callee.object.name;
                    if (
                      calleeName === 'TsconfigPathsPlugin'
                    ) {
                      resolveValue.properties[
                        resolveIndex
                      ] = j.objectProperty(
                        j.identifier('tsConfig'),
                        j.objectExpression([]),
                      );
                      dirtyFlag = true;
                    }
                  }
                }
              }
            },
          );
        }
      }
    });
  });

  return dirtyFlag ? root.toSource() : undefined;
}

export const parser = 'tsx';