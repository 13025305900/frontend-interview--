function convertToJavaScript(json) {
  function processBlock(block) {
    let code = "";
    switch (block.type) {
      case "当开始运行":
        code += "当开始运行(() => {\n";
        if (block.next) {
          code += processBlock(block.next);
        }
        code += "});\n";
        break;

      case "永远循环":
        code += "  永远循环(() => {\n";
        if (block.statements && block.statements.DO) {
          code += processBlock(block.statements.DO);
        }
        code += "  });\n";
        break;

      case "如果":
        code += "    if (";
        if (block.inputs.IF0) {
          code += processBlock(block.inputs.IF0);
        }
        code += ") {\n";
        if (block.statements.DO0) {
          code += processBlock(block.statements.DO0);
        }
        if (block.statements.ELSE) {
          code += "    } else {\n";
          code += processBlock(block.statements.ELSE);
        }
        code += "    }\n";
        break;

      case "判断角色碰撞":
        code += `判断角色碰撞("${block.fields.sprite}", "${block.fields.sprite1}")`;
        break;

      case "移动步数":
        code += `      移动步数(${block.inputs.steps ? processBlock(block.inputs.steps) : ""});\n`;
        break;

      case "移到位置":
        code += `      移到位置(${block.inputs.x ? processBlock(block.inputs.x) : ""}, ${block.inputs.y ? processBlock(block.inputs.y) : ""});\n`;
        break;

      case "math_number":
        code += block.fields.NUM;
        break;

      default:
        throw new Error(`Unknown block type: ${block.type}`);
    }
    return code;
  }

  return processBlock(json);
}

// 测试代码
const jsonData = {
  "type": "当开始运行",
  "next": {
    "type": "永远循环",
    "statements": {
      "DO": {
        "type": "如果",
        "inputs": {
          "IF0": {
            "type": "判断角色碰撞",
            "fields": {
              "sprite": "自己",
              "sprite1": "鼠标"
            },
            "is_output": true
          }
        },
        "statements": {
          "DO0": {
            "type": "移动步数",
            "inputs": {
              "steps": {
                "type": "math_number",
                "fields": {
                  "NUM": 10
                },
                "is_output": true
              }
            }
          },
          "ELSE": {
            "type": "移到位置",
            "inputs": {
              "x": {
                "type": "math_number",
                "fields": {
                  "NUM": 0
                },
                "is_output": true
              },
              "y": {
                "type": "math_number",
                "fields": {
                  "NUM": -100
                },
                "is_output": true
              }
            }
          }
        }
      }
    }
  }
};

const result = convertToJavaScript(jsonData);
console.log(result);