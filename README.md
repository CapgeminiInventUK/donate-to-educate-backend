## Donate to Educate Backend

The repo contains the backend code for the application which the majority is AWS lambda code.

### Running locally

You might be able to run the code locally by using the `npm start` command however, if this does not work you will need to write tests to verify your changes. We want to utilise localstack in the future however, this is currently not setup and working.

### Auto-generating types from GRAPHQL

Running the command `npm run codegen` will generate the types from the schema.graphql file. This one in this repo is the source of truth and is currently replicated to the FE repo and automatically copied in the pipeline to an s3 bucket where it is picked up and deployed to the infrastructure using Terraform.
