async function createEditFileAssistant() {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Edit File Assistant",
      instructions: `You are a coding assistant specially designed to edit files with given instructions and context files. Make sure to follow the instructions carefully, and do NOT add placeholder text like \`\/\/Old code\/\/\`. Respond with the edited code only, not in a code block, and with no additional text.\n\n--------------------\nFILE TO EDIT: ${editFilePath}\n--------------------\n\n${editFileContent}\n\n${contextFileContents
        .map(
          ([path, content]) =>
            `--------------------\nCONTEXT FILE:${path}\n--------------------\n\n${content}`
        )
        .join("\n\n")}`,
      model: "gpt-4o",
    });

    console.log("Code Edit Assistant created successfully!");
    console.log("Assistant ID:", assistant.id);
    console.log("Assistant Name:", assistant.name);
    console.log("Edit Capabilities:", edit_capabilities);
    console.log("Target Languages:", target_languages);

    return assistant;
  } catch (error) {
    console.error("Error creating code edit assistant:", error);
    throw error;
  }
}

module.exports = {
  createEditFileAssistant,
};
