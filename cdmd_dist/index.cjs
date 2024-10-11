/*! @license
The MIT License (MIT)

Copyright (c) 2024 dfordp

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
"use strict";Object.defineProperty(exports,"__esModule",{value:true});function _export(target,all){for(var name in all)Object.defineProperty(target,name,{enumerable:true,get:all[name]})}_export(exports,{default:function(){return transform},parser:function(){return parser}});function transform(file,api,options){const j=api.jscodeshift;const root=j(file.source);let dirtyFlag=false;root.find(j.VariableDeclaration).forEach(path=>{const declaration=path.node.declarations[0];if(j.VariableDeclarator.check(declaration)&&j.CallExpression.check(declaration.init)){const callee=declaration.init.callee;if(j.Identifier.check(callee)&&callee.name==="require"){const args=declaration.init.arguments;if(args.length===1&&j.Literal.check(args[0])&&args[0].value==="tsconfig-paths-webpack-plugin"){j(path).remove();dirtyFlag=true}}}});root.find(j.ObjectExpression).forEach(path=>{const properties=path.node.properties;properties.forEach((property,index)=>{if(j.ObjectProperty.check(property)&&j.Identifier.check(property.key)&&property.key.name==="resolve"){const resolveValue=property.value;if(j.ObjectExpression.check(resolveValue)){resolveValue.properties.forEach((resolveProp,resolveIndex)=>{if(j.ObjectProperty.check(resolveProp)&&j.Identifier.check(resolveProp.key)&&resolveProp.key.name==="plugins"){const pluginsValue=resolveProp.value;if(j.ArrayExpression.check(pluginsValue)&&pluginsValue.elements.length>0){const firstElement=pluginsValue.elements[0];if(j.NewExpression.check(firstElement)&&(j.Identifier.check(firstElement.callee)||j.MemberExpression.check(firstElement.callee))){const calleeName=j.Identifier.check(firstElement.callee)?firstElement.callee.name:firstElement.callee.object.name;if(calleeName==="TsconfigPathsPlugin"){resolveValue.properties[resolveIndex]=j.objectProperty(j.identifier("tsConfig"),j.objectExpression([]));dirtyFlag=true}}}}})}}})});return dirtyFlag?root.toSource():undefined}const parser="tsx";