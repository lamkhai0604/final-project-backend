const bodyParser = require('body-parser')
// ... 
const app = express();
const router = express.Router();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// use router
app.use(router);

const { 
    createAuthor, 
    // updateAuthor, 
    // deleteAuthor 
    } = require("./controllers/authorController");
  
  // ... 
  router
    .route("/authors")
    .post(createAuthor);