## Auth JWT Provider [Project in Progress]

1. An authentication provider is a service or platform that offers functionalities related to user authentication. It typically manages the authentication process, verifying the credential provided by users (such as username and password) and granting access to protected resources if the credentials are valid.

2. The primary function of an authentication provider is to ensure the security of systems, applications, or services by verifying the identity of users before granting access. This is essential for protecting sensitive information and restricting access to resources only to authorized users.

### Main techonologies used for development
- [Node.js (v18.16.0)](https://nodejs.org/en)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)
- [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken)
- [Zod](https://zod.dev/) 
- [Docker](https://www.docker.com/)
- [Mongoose-ODM](https://mongoosejs.com/)
- [Nodemailer](https://nodemailer.com/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Http-status-codes](https://www.npmjs.com/package/http-status-codes)
- [BullMQ](https://docs.bullmq.io/)
- [Redis](https://redis.io/)

### Key features
1. JWT token generation and validation: Ability to generate JWT tokens based on user credentials and validate these tokens during the authentication process.
2. Expiration time configuration: Allowing configuration of an expiration time for JWT tokens, ensuring they become invalid after a specific period, enhancing system security.
3. Token renewal: Ability to renew expired tokens without the need to re-request user credentials, maintaining the session active seamlessly.
4. Integration with popular frameworks and libraries: Offering easy integration with web frameworks and popular libraries in various programming languages to simplify the authentication process in web and mobile applications.
5. Management of signature keys: Facilitating the management of signature keys used to verify the authenticity of JWT tokens, including key rotation and protection against key leakage.
6. Asynchronous processing: The implementation consists of adding asynchronous processing to user creation, using BullMQ along with a Redis connection instance.


### Important Note!
- This project is being carried out for testing and personal studies purposes. All decisions made are for study cases. 
- If you have any suggestions, improvements, or feedback that could contribute to the enhancement and growth of the project, feel free to share your thoughts. I am open to discussing any ideas that could help improve the project.

### Starting the application locally
1º - Install the application dependencies using the command: ``npm install``

Note: The server will only run on a UNIX-based operating system (Linux or macOS) due to the Redis instance created for asynchronous processing. If you are using Windows, install WSL and Redis on your machine.

2º - Open a terminal in WSL just to start the Redis server, and type the command: ``redis-server``

3º - In another terminal, type the command: ``npm run dev`` and the application will run normally on your local machine for testing
