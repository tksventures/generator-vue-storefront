const Generator = require('yeoman-generator');
const chalk = require('chalk');

const {
  downloadRepo,
  getFiles,
  copyFiles,
  copyFromTemplate,
} = require('./helpers');

module.exports = class extends Generator {
  constructor(args, opts) {
    const options = opts;
    options.force = true;

    super(args, options);
    this.options.force = true;
    this.appname = 'reli-vue-storefront';
    this.answers = {};
    this.status = {};
    this.backendRepo = 'DivanteLtd/vue-storefront-api';
    this.frontendRepo = 'DivanteLtd/vue-storefront';
    this.apiServer = 'https://demo.vuestorefront.io';

    this.terminal = (msg, colour) => (
      this.log(chalk[colour](msg))
    );
  }

  async prompting() {
    const prompts = [];
    const { options } = this;
    const {
      name,
      divante,
    } = options;
    const dockerRepo = options['docker-repo'];

    if (!name) {
      prompts.push({
        type: 'input',
        name: 'name',
        message: "what is your project's name?",
        default: this.appname,
      });
    }

    if (!dockerRepo && !divante) {
      prompts.push({
        type: 'input',
        name: 'dockerRepo',
        message: 'What is your dockerhub username?',
      });
    }

    if (prompts.length > 0) {
      this.answers = await this.prompt(prompts);
    }

    if (!this.answers.name) {
      this.answers.name = options.name;
    }

    if (!this.answers.dockerRepo) {
      this.answers.dockerRepo = options['docker-repo'];
    }

    this.project = this.answers.name.toLowerCase().replace(' ', '-');
  }

  async download() {
    const {
      tag,
      apiTag,
      frontend,
      backend,
    } = this.options;

    if (!frontend) {
      this.backendError = !(await downloadRepo(this.backendRepo, apiTag, `${this.project}/vue-storefront-api`, this.terminal, 'yellow'));
      this.backendGenerated = true;
    } else {
      this.backendError = false;
    }

    if (!backend) {
      this.frontendError = !(await downloadRepo(this.frontendRepo, tag, `${this.project}/vue-storefront`, this.terminal, 'cyan'));
      this.frontendGenerated = true;
    } else {
      this.frontendError = false;
    }
  }

  async writeBackend() {
    const templates = this.sourceRoot();

    if (this.backendGenerated && !this.options.divante) {
      this.apiServer = 'http://localhost:8080';

      const backendParams = {
        apiServer: this.apiServer,
        name: this.answers.name,
        dockerRepo: this.answers.dockerRepo,
      };
      const backendFiles = await getFiles(`${templates}/vue-storefront-api`);
      const backendDestination = this.destinationPath(`${this.project}/vue-storefront-api`);

      await copyFiles(
        this.fs,
        backendFiles,
        `${templates}/vue-storefront-api`,
        backendDestination,
        this.backendRepo,
        this.terminal,
        backendParams
        , 'yellow',
      );

      await copyFromTemplate(
        this.fs,
        this.templatePath('vue-storefront-api/docker/vue-storefront-api/default.env'),
        this.destinationPath(`${this.project}/vue-storefront-api/.env`),
        backendParams,
        this.terminal,
        'blue',
      );
    }
  }

  async writeFrontend() {
    const templates = this.sourceRoot();

    if (this.frontendGenerated && !this.options.divante) {
      const frontendParams = {
        apiServer: this.apiServer,
        name: this.answers.name,
        dockerRepo: this.answers.dockerRepo,
      };

      const frontendFiles = await getFiles(`${templates}/vue-storefront`);
      const frontendDestination = this.destinationPath(`${this.project}/vue-storefront`);
      await copyFiles(
        this.fs,
        frontendFiles,
        `${templates}/vue-storefront`,
        frontendDestination,
        this.frontendRepo,
        this.terminal,
        frontendParams,
        'cyan',
      );

      await copyFromTemplate(
        this.fs,
        this.templatePath('vue-storefront/docker/vue-storefront/default.env'),
        this.destinationPath(`${this.project}/vue-storefront/.env`),
        frontendParams,
        this.terminal,
        'cyan',
      );

      if (this.options['reset-linting']) {
        await copyFromTemplate(
          this.fs,
          this.templatePath('vue-storefront/.eslintrc-copy.js'),
          this.destinationPath(`${this.project}/vue-storefront/.eslintrc.js`),
          frontendParams,
          this.terminal,
          'blue',
        );
      }
    }
  }

  async writeSharedFiles() {
    if (this.backendGenerated && this.frontendGenerated && !this.options.divante) {
      await copyFromTemplate(
        this.fs,
        this.templatePath('docker-compose.yml'),
        this.destinationPath(`${this.project}/docker-compose.yml`),
        {},
        this.terminal,
        'blue',
      );
    }
  }

  end() {
    if (this.backendError || this.frontendError) {
      return this.terminal('\nThere were errors when generating your project!', 'red');
    }

    return this.terminal(`\nSuccess! Your vue-storefront project(${this.project}) has been created!`, 'green');
  }
};
