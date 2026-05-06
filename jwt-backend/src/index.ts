import { app } from "./app";
import {config} from "dotenv";



config();

const init = async () => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log("Server running on port 3000");
    });
};



init();