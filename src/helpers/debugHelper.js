import chalk from 'chalk';

export default {
  error: (debug, error) => debug(chalk.red(error.message)),
};
