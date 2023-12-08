import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
      title: 'Nuit de l\'info 2023',
      description: 'API du backend de la nuit de l\'info 2023'
    },
    host: 'localhost:8080'
  };

const outputFile = './swagger_output.json';
const routes = ['./src/app.ts'];

swaggerAutogen()(outputFile, routes, doc);
