const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

exports.handler = async (event) => {
  const { code, language, inputs } = event.body;

  const fileExtension = getFileExtension(language);
  const filename = `/tmp/code.${fileExtension}`;
  const inputFile = `/tmp/input.txt`;

  require("fs").writeFileSync(filename, code);

  if (inputs) {
    require("fs").writeFileSync(inputFile, inputs.join("\n"));
  }

  // Execute the code
  try {
    const output = await executeCode(language, filename, inputFile);
    return {
      statusCode: 200,
      body: JSON.stringify({ output }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

function getFileExtension(language) {
  switch (language.toLowerCase()) {
    case "python":
      return "py";
    case "javascript":
      return "js";
    case "cpp":
      return "cpp";
    case "c":
      return "c";
    case "java":
      return "java";
    default:
      throw new Error("Unsupported language");
  }
}

async function executeCode(language, filename, inputFile) {
  let command;
  switch (language.toLowerCase()) {
    case "python":
      command = `python3 ${filename} <${inputFile}`;
      break;
    case "javascript":
      command = `node ${filename}`;
      break;
    case "cpp":
      await execAsync(`g++ -o /tmp/code ${filename}`);
      command = `/tmp/code < ${inputFile}`;
      break;
    case "c":
      await execAsync(`gcc -o /tmp/code ${filename}`);
      command = `/tmp/code < ${inputFile}`;
      break;
    case "java":
      await execAsync(`javac ${filename} -d /tmp`);
      const className = filename.split("/").pop().split(".")[0];
      command = `java -cp /tmp ${className} < ${inputFile}`;
      break;
    default:
      throw new Error("Unsupported language");
  }
  const { stdout, stderr } = await execAsync(command);
  if (stderr) throw new Error(stderr);
  return stdout;
}
