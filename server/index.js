const Factory = require('./src/Factory');
require('dotenv').config();

 function bootstrap(){
    const app = new Factory();
    app.create();
    app.middleware();
    app.router();
    app.listen(process.env.PORT || 5000);
}

bootstrap(); 