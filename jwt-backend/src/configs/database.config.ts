import { createConnection, Pool } from "mysql";


let pool: Pool;

const connectToDatabase = async () => {
    try {
        pool = createConnection({
            host: process!.env!.MYSQL_HOST as string,
            port: parseInt(process!.env!.MYSQL_PORT as string),
            user: process!.env!.MYSQL_USER as string,
            
        })
    } catch (error) {
        
    }
}