## What is Nest Js
* Nest Js is a Node Js backend framework that embraces TypeScript and solves the weak point of Express Js which is architecture
    * It provides direction on have to structure and scale a project, while still using Express Js under the hood
* It allows for creation of testable, scalable, and easily maintainable applications
* Modularity is important for Nest Js and uses concepts like dependency injection (has been called Angular for backend)
* Nest Js provides good structure and modularity for apps, has support for TypeScript, GraphQL, microservices, and REST APIs

## Installing Nest Js
```
npm i -g @nestjs/cli
nest new <project-name>
```

## Modules
* app.module.ts is similar to the App file in a React or Vue application - it is the main module/the app that will import other modules
    * "A module is a class annotated with a @Module() decorator. The @Module() decorator provides metadata that Nest makes use of to organize the application structure."
* The export keyword allows a Module to be available across an application, otherwise it will only be available within a specific file - make sure to also import a module in the App imports statement
* main.ts is where the app is launched (manually change the port number from 3000 since 3000 is the default port number for REact)
* Nest CLI has an option to allow automatic generation of modules - it also automatically imports the module into the app
```
nest g module <name-of-module>
```

## Controllers and Services
* The logic for a Nest Js application is separated into two files - controllers and service
    * "Controllers are responsible for handling incoming requests and returning responses to the client." (annotated with @Controller())
    * Services (aka providers) are responsible for executing the business logic: "Providers are a fundamental concept in Nest. Many of the basic Nest classes may be treated as a provider – services, repositories, factories, helpers, and so on. The main idea of a provider is that it can be injected as a dependency; this means objects can create various relationships with each other, and the function of "wiring up" these objects can largely be delegated to the Nest runtime system." (annotated with @Injectable())
* Don't forget to import the service and controller into the module file
* The controller receives a request from the internet and it calls a function from the service before returning the result of that function to the browser
* In classic JavaScript, the controller would have to instantiate an instance of the Service before being able to use it
* In Nest Js, we use dependency injection, which means that instead of the controller declaring and handling a new insance of the service, it receives the service as an argument in its constructor and Nest Js handles the instatiation of the service
    * Dependency injection in Nest Js basically allows us to not have to handle dependency management
* Nest Js also converts the datatype in the headers of the response based on the datatype of the returned value
* The controllers handle the request and return the body if needed - might check headers or any work required by the request - the execution is offloaded to the service
* Usually the pattern is that there is a matching function in the service for each of the routes defined in the controller

## Connecting a Containerized Database and ORM
* In the root directory, create a docker-compose.yml file and use the following command to run the docker database container
```
docker compose up dev-db -d
```
* You can also check the status of the container by using the following command
```
docker logs <container-id>
```
* This tutorial uses postgres relational database and uses Prisma as the ORM
    * Prisma is like a query builder where you define a model and you can get those models from your JS or TS code
* Primsa will be used to define the database connection logic
* Install Prisma CLI to create schemas, run migrations, and deploy migrations into the database
```
npm i prisma@latest --save-dev
```
* Install Prisma client - Prisma has many clients, so we're installing the one for JavaScript
```
npm i @prisma/client
```
* Once installed, initialize Prisma by running
```
npx prisma init
```
* This will generate several files including a .env file (which contains a default postgres connection string that needs to be updated with the correct user, password, port, and database variables) and a prisma directory in the root directory which has a schema file where we will declare our models (similar to GraphQL)
    * Uses the prisma client js library and postgrest (but Prisma also supports MySQL and MongoDB)
    * The Url is the connection string which grabs the value from the first environment file it finds (here it's the .env in the root folder, but if there was a .dnv in the prisma folder, it would use that one)
* The Prisma schema file uses Prisma syntax

## Running Prisma Migrations
* After creating the models in the schema file, run the following command
```
npx prisma migrate dev
```
* This will generate the migrations in the prisma folder
    * The dev version of this command will delete the data, but there is another command that can be run for production to avoid this
* The migrate dev command automatically runs the generate command (npx prisma generate - which creates Typescript types for the schema and allows us to directly use those types in our code) and also pushes the migrations to the database (can view it in the docker logs for the db container)
* You also run this command to run existing migrations, if the database is not up to date, but this is the less recommended option, instead run the following command to apply all pending migrations in production/staging
```
prisma migrate deploy
```
* Prisma also provides a GUI, which can be initialized using
```
npx prisma studio
```

## Creating the Prisma Module
* We are going to encapsulate all thel ogic required to connect the database to the application in a Prisma model
```
nest g module prisma
```
* Service files also need to be generated, but just running nest g service prisma will automatically generate spec (test) files, which aren't needed, so add the --no-spec flag
```
nest g service prisma --no-spec
```
* This module and service will allow Prisma to connect to the database
    * The @Global() decorator and exporting the Prisma service in the Prisma module avoids having to import the Prisma module in the target module and services for each module you want to have access to the database - it would just be available to all the modules in the app (just make sure the global module is imported into the App module)

## DTOs
* Because Nest Js uses Express Js under the hood, you can access the Express request object directly, such as in @Req() req: Request - but directly accessing the request object is not best practice (because it's possible to change the underlying framework in the future, making the code non-reusable)
* DTOs are Data Transfer Objects - it's an object where you push your data (such as from a request) and you can run validation on it and can use the shape of those DTOs (because req.body for example is not descriptive of the data contained in the body)
* This tutorial uses the Barrel Export Pattern for DTOs, where the index.ts file re-exports specified exports from another file, which provides the main advantage of being able to import the dto folder itself, instead of including an import statement for each dto
* This enforces structure, but it doesn't provide validation (i.e. if a specified property is not part of the body, it gets assigned its default value)

## Pipes
* "A pipe is a class annotated with the @Injectable() decorator, which implements the PipeTransform interface. Pipes have two typical use cases:
    * transformation: transform input data to the desired form (e.g., from string to integer)
    * validation: evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception"
* Pipes are functions that transform your data
    * For example, you can use built in pipes to transform specific data fields to be other data types, automatically throwing an error if the data cannot be transformed, such as in @Body('password', ParseIntPipe) password: string, which isolates the password property of the request body and attempts to convert the string datatype to an int datatype
* However, it becomes cumbersome to apply pipes to individual properties as they are received as arguments, so we can implement pipes directly in the DTO file instead (don't forget to set the .useGlobalPipes(new ValidationPipe()) property in main.ts)
* This tutorial uses class validators and class transformers to implement pipes, run the following command to install
```
npm i --save class-validator class-transformer
```
* This allows the use of decorators to apply type validations and automatic error generation
* This app also uses argon as its hashing package (as opposed to bcrypt because it allows for hasing of refresh tokens that are not limited to the first 72 characters)
```
npm i argon2
```

## Validation
* You can use a combination of Prisma decorators and Nest Js Pipes to validate information as it is received and returned
    * Nest Js Pipes can help validate data shapes and types using DTOs and decorators
    * Prisma has decorators that integrate database data validation (e.g. setting a unique property) and also provides custom error objects/error messages

## Custom Scripts
* This tutorial adds custom scripts to package.json to automate postgres restart and apply prisma migrations
* prisma:dev:deploy will apply all pending migrations to the postgres database
```
    "prisma:dev:deploy": "prisma migrate deploy",
```
* db:dev:restart will remove the postgres container and then rebuild and restart it 
    * -s is stop containers before removing, -f is force without confirming removal, -v is remove anonymous volumes attached to containers, -d is obviously start in detached mode
* Because the database might take time to spin up, add one second of sleep or pause before running the prisma command to apply migrations to the database
```
    "db:dev:rm": "docker compose rm dev-db -s -f -v",
    "db:dev:up": "docker compose up dev-db -d",
    "db:dev:restart": "npm run db:dev:rm && npm run db:dev:up && npm run prisma:dev:deploy",
```

## Config, JWT's, and Sessions
* The existing login logic is known as simple authentication, which does allow verification of credentials, but would require the username and password to be sent with every APi request
* For user experience, we want the user to only login once, to allow the server to track the user to knwo who the user is - there are two techniques: Sessions and JSON Web Tokens
    * This process is called authentication and authorization - we authenticate the user when they provide credentials, but then we need to return something to the user so we can authorize that user through subsequent requests
* We have thus far created our own modules, but Nest Js provides some out of the box modules for use
* In this tutorial, we use the config module, which allows us to add a config file and avoid using our hard-coded database connection string
```
npm install @nestjs/config
```
* The config module is usually implemented in the root App module, but it can also be implemented in a custom module where you can add validation or custom type checking
    * Under the hood, this module uses the dotenv library
* To add it to the App module, include it in the import statement with the .forRoot({}) method
    * Make sure to also set the property isGlobal to true within the forRoot() method so it is accessible across the app
* Because this is just a pre-built module, it also has its own corresponding service which can be imported into other modules in our app (such as in the PrismaService service)
    * The @Injectable() annotation allows for dependency injection to be handled by Prisma - if your class does not require any arguments to be passed in as a dependency, you don't need the decorator
* Nest Js has documentation on authentication and authorization, and under the hood uses Passport
* Passport is an authentication framework (middleware) for Node Js that has a lot of strategies
    * Lets you login with other accoutns, such as Facebook, Google, etc.
* This tutorial just uses JWT's (which again, are basically strings with a signature, some data, and a description of kind of string it is and what algorithm it is using)
    * Within it is some JSON encoded in base 64 and includes some information that the server can pass to the client (e.g. username, email, expiration, etc.) and you can add as many fields (claims) as you want
* The server creates this data when a user logs in and passes that information back and forth between the client and the server each time a request is made to verify whether a user is authorized to access specific resources
    * This is very similar to sessions, except with sessions,this information is passed automatically, whereas JWT's need to be passed manually with code
* Install the packages for Nest Js passport (passport and the support packages for Nest to use passport)
```
npm install -- save @nestjs/passport passport
```
* In addition, install JWT-specific libraries including JWT, Nest support for JWT's, and the types for JWT
```
npm install --save @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-jwt
```
* @nestjs/jwt is basically used to sign and decode tokens (uses the JWT library under the hood - is basically a Nest Js modularization version of it)
* The JwtModule is a Module, which means it also has a corresponding service, so make sure to import both
    * You can also add additional properties to the JwtModule when registering it, but in this tutorial it is left blank, so it is easier to customize secrets for example for different parts of the app
* Authorizatin and authentication are separated into two parts: authorization (creating the JWT on login/signup) is included in the auth service, and authenticating that a user is allowed to access specific parts of our app (intercepting requests to retrieve and read JWTs) is part of the strategy
* The steps for the strategy: a JWT access is generated and returned to a user upon signing in or signing up, another route is then called to retrieve information about the current user, an authorization/bearer token is then included in the header which acts as an access token
    * The logic to verify that the bearer token is correct is called a strategy
* The strategy protects some of our routes so that they are only accessible if you have a valid bearer token (implement the strategy using decorators)