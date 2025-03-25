interface EndTaskParams {
  isSuccess: boolean;
}

const endTaskHandler = async ({
  isSuccess,
}: EndTaskParams): Promise<string> => {
  if (isSuccess) {
    return "Task completed successfully. Exiting...";
  } else {
    return "Task failed to complete. Exiting...";
  }
};

export { endTaskHandler };
