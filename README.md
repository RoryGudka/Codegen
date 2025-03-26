# Disclaimer

This project is currently a work in progress (WIP). Please be aware that not all security best practices have been implemented.

- **Codegen Directory**: Ensure that `.codegen` is included in your `.gitignore` file to prevent exposing sensitive credentials.
- **Assistant Tool Calls**: The assistant tool calls are not designed to prompt users for approval. Therefore, theoretically, harmful operations could be executed unintentionally.

Use this project at your own risk and always review changes carefully.

# Codegen - NPM Package

## Overview

Codegen is an npm package designed to facilitate the management and modification of large codebases through intuitive command-line operations. The package integrates with OpenAI's GPT models to assist in various tasks such as code generation, credential configuration, vector store computation, and result viewing.

## Installation

To install the Codegen package, run the following command:

```bash
npm install -g @rorygudka/codegen
```

## Features

- **Configure**: Setup credentials for OpenAI and Tavily.
- **Embeddings**: Generate a vector store for the codebase files.
- **Gen**: Modify files in the codebase based on a provided command input.
- **View**: Launch a local web server to render output files.

## Commands

### Configure

The configure command is used to setup the necessary credentials for the package to operate. This command will prompt for the OpenAI and Tavily API keys which are stored in a local `.codegen` folder.

**Usage:**

```bash
codegen configure
```

This will prompt:

- Enter your OPENAI_API_KEY
- Enter your TAVILY_API_KEY

The credentials are saved to a JSON file located at `.codegen/credentials.json`.

### Embeddings

The embeddings command computes a vector store representation of the entire codebase. This is essential for features that require context or similarity checks.

**Usage:**

```bash
codegen embeddings
```

This will generate vector embeddings for all files in the codebase and store them for further operations like code generation and file similarity checks.

### Gen

The gen command is the core functionality of Codegen, allowing you to modify files based on command inputs. You can specify a command, and optionally, the number of top relevant files to consider based on the embeddings.

**Usage:**

```bash
codegen gen <command> <n>
```

- `<command>`: Describe the intended changes or tasks. This input is sent to the OpenAI API for processing.
- `<n>`: Top n most relevant files computed from embeddings (optional, default is 0).

Example:

```bash
codegen gen "Add a new feature X" 5
```

This will consider the 5 most relevant files while adding feature X.

### View

The view command starts a local web server at `localhost:5000` that serves a simple webpage displaying the results of the last operation executed by the gen command.

**Usage:**

```bash
codegen view
```

The webpage automatically updates as new results become available, providing a real-time update display for any code generation tasks.

## License

This package is licensed under the MIT License. More details can be found in the LICENSE file.

## Author

Rory Gudka <rdgudka@gmail.com>
