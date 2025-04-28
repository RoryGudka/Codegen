interface EndTaskParams {
  isSuccess: boolean;
}

const endTaskHandler = async ({ isSuccess }: EndTaskParams) => {
  return await new Promise<string>(() => {
    if (isSuccess) {
      console.info("Task completed successfully");
    } else {
      console.log("Task failed");
    }
  });
};

export { endTaskHandler };
