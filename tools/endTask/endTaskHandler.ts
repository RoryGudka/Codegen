interface EndTaskParams {
  isSuccess: boolean;
}

const endTaskHandler = async ({
  isSuccess,
}: EndTaskParams): Promise<string> => {
  if (isSuccess) {
    process.exit(0);
  } else {
    process.exit(1);
  }
};

export { endTaskHandler };
