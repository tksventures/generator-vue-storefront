const GitDownload = require('download-git-repo');
const chalk = require('chalk');
const recursive = require('recursive-readdir');
const { Spinner } = require('cli-spinner');

const spinnerType = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
const spinner = new Spinner('Downloading project folders %s');
spinner.setSpinnerString(spinnerType);

function downloadRepo(
  repo,
  tag,
  folderName,
  terminal,
  chalkColour = 'green',
) {
  const repoLocation = `${repo}${tag ? `#v${tag}` : ''}`;
  spinner.setSpinnerTitle(chalk.yellow(`Downloading ${repoLocation} %s`));
  if (!spinner.isSpinning()) {
    spinner.start();
  }

  return new Promise((resolve) => {
    GitDownload(repoLocation, folderName, async (err) => {
      await spinner.stop(true);

      if (err) {
        const message = new Error(`Error generating '${repoLocation}' => ${err.message}`);
        terminal(message, 'red');
        return resolve(false);
      }
      terminal(`Downloaded ${repoLocation}!`, chalkColour);
      return resolve(true);
    });
  });
}

function getFiles(path) {
  return new Promise((resolve, reject) => {
    recursive(path, (err, files) => {
      if (err) {
        return reject(err);
      }

      return resolve(files);
    });
  });
}

async function copyFromTemplate(fs, fromPath, toPath, params, terminal, colour) {
  spinner.setSpinnerTitle(chalk.yellow(`Applying ${toPath} %s`));

  if (!spinner.isSpinning()) {
    spinner.start();
  }

  try {
    await fs.copyTpl(
      fromPath,
      toPath,
      params,
    );
    spinner.stop(true);
    terminal(`Applied ${fromPath} to ${toPath}`, colour);
    return { [toPath]: true };
  } catch (e) {
    spinner.stop(true);
    terminal(`Failed to apply ${toPath}: ${e.message}`, colour);
    return { [toPath]: false };
  }
}

async function copyFiles(
  fs,
  files,
  templatePath,
  destinationPath,
  repo,
  terminal,
  params,
  colour = 'cyan',
) {
  spinner.setSpinnerTitle(chalk[colour](`Applying updates to ${repo} %s`));

  if (!spinner.isSpinning()) {
    spinner.start();
  }

  const promises = [];
  for (let x = 0; x < files.length; x += 1) {
    const file = files[x];

    promises.push(copyFromTemplate(fs, file, `${destinationPath}${file.replace(templatePath, '')}`, params, terminal, colour));
  }

  const results = await Promise.all(promises);
  spinner.stop();
  terminal(`Applied changes to ${repo}`, colour);
  return results;
}

module.exports = {
  downloadRepo,
  getFiles,
  copyFromTemplate,
  copyFiles,
};
