"use strict";

const { types, operator } = require("putout");
const operators = ["+", "*", "-","/"];

const { replaceWith } = operator;
const { valueToNode, isUpdateExpression, isAssignmentExpression } = types;

module.exports.report = () => `replace const assignment`;

module.exports.fix = ({ path, leftPath, rightPath }) => {
  const rightNode = rightPath.node;
  const { name } = leftPath.node;

  const binding = path.scope.getBinding(name);

  if (!binding?.referenced) return;

  const { referencePaths } = binding;

  const targetNodes = [];

  for (const rPath of referencePaths) {
    if (
      rPath.isIdentifier() &&
      ((rPath.parentPath.isUnaryExpression() &&
        rPath.parent.operator === "-") ||
        (rPath.parentPath.isBinaryExpression() &&
          (rPath.key === "right" ||
            operators.includes(rPath.parent.operator))) ||
        rPath.parentPath.isArrayExpression() ||
        rPath.parentPath.isMemberExpression() ||
        rPath.parentPath.isCallExpression() ||
        rPath.parentPath.isVariableDeclarator())
      //fixKeys.includes(rPath.inList ? rPath.listKey : rPath.key)
    ) {
      targetNodes.push(rPath.isUnaryExpression() ? rPath.argument : rPath);
    } else if (
      isUpdateExpression(rPath.parent) ||
      isAssignmentExpression(rPath.parent)
    ) {
      return;
    }
  }

  const sourceNode = valueToNode(rightNode.value);
  targetNodes.forEach((node) => replaceWith(node, sourceNode));
};

module.exports.traverse = ({ push }) => ({
  AssignmentExpression: (path) => {
    const leftPath = path.get("left");
    const rightPath = path.get("right");

    if (leftPath.isIdentifier() && rightPath.isNumericLiteral()) {
      push({
        path,
        leftPath,
        rightPath,
      });
    }
  },

  VariableDeclarator: (path) => {
    const leftPath = path.get("id");
    const rightPath = path.get("init");

    if (leftPath.isIdentifier() && rightPath.isNumericLiteral()) {
      push({
        path,
        leftPath,
        rightPath,
      });
    }
  },
});
