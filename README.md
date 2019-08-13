# Vue-Storefront Generator
A yeoman generator for the [vue-storefront ecommerce PWA](https://github.com/DivanteLtd/vue-storefront).

## Prerequisites
- Yeoman needs to be installed globally (`npm install -g yo`) to run this generator.
- By default, this generator will be applying additional code that will makes vue-storefront apps easier to work with in a docker environment so both `docker` and `docker-compose` are required to run the default generated code.

## Getting Started
- Install generator: `npm install -g generator-vue-storefront`
- Run generator: `yo vue-storefront`

You will be asked questions regarding your installation, including your project's name. After answering them, a copy of   [vue-storefront](https://github.com/DivanteLtd/vue-storefront) and the [vue-storefront-api](https://github.com/DivanteLtd/vue-storefront-api) will be available inside your project folder.

## Running vue-storefront
Among the files generated, there are `docker-compose.yml` files that are meant to run vue-storefront and its dependencies. along with `.env` files containing the default environmental variables.

```
.
├── vue-storefront-api
│   └── .env
│   └── docker-compose.yml
├── vue-storefront
│   └── .env
│   └── docker-compose.yml
├── docker-compose.yml

```

If both the vue-storefront and vue-storefront api are generated, one will be placed at the root directory and can be used to build and connect both apps through the following commands:

- `docker-compose build` to build the images. Volumes have already been assigned in the file to facilitate development in both apps.
- `docker-compose up` to activate both apps. It is recommended to first initialize the api (`docker-compose up vue-api`) so the dependencies can be properly built before connecting to he frontend store.

The vue-storefront-api will, by default, generate the same mock data present in the [vue-storefront Demo Site](https://demo.vuestorefront.io/).

## Options
Options can be written alongside the generator call to provide answers to the generator's questions in the same command or change the generator's behaviour. The following are the supported options:

- `--name`: Indicates name of project to which vue-storefront code will be added.
- `--api-tag`: Indicates which tagged version of the vue-storefront-api you would like to download.
- `--tag`: Indicates which tagged version of the vue-storefront you would like to download.
- `--frontend`: Indicates that you only wish for the vue-storefront to be downloaded without the api.
-  `--backend`: Indicates that you only wish for the vue-storefront-api code to be generated.
- `--docker-repo`: Used for modified `.travis.yml` files. Indicates the dockerhub username to which vue-storefront images can be pushed to.
- `--divate`: Indicates that you want to generate the exact vue-storefront and vue-storefront-api code

### Example

```
yo vue-storefront --name crypto-store --tag 1.9.2 --frontend --divante 
```

The above command will generate a project folder called crypto-store which will contain version 1.9.2 of Divante's vue-storefront without any of our additional code.
