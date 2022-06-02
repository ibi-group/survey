# Survey

## What is it

This is a collection of survey components. They can be combined into a survey via a config file. The app will take the user results and upload them.

## Exploring the components

Storybook stories have been created for each of the survey components. To view these stories, run

```bash
yarn install
yarn storybook
```

## How to run it

A config file has been prepared which demonstrates available functionality. Feel free to use it as a starting point and edit it, or to start from scratch. All available options are used and described in the shipped `config.yaml` file.

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To see the localization support, append a language code at the end of the URL (for example, [http://localhost:3000/fr](http://localhost:3000/fr) will render French strings). The system will attempt to map that key to languages defined in the `next.config.js`. Language strings are stored in `config.yaml`.

### How to get the S3 upload to work

An `env.example` file is provided. By placing AWS credentials and a bucket name in the corresponding slots, next will pick up on them and automatically upload results into the specified bucket.
