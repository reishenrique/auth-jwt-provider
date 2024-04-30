import { app } from '../src/app'
import 'dotenv/config'

const port = process.env.PORT || 3000

export const serverConnection = async () => {
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`)
    })
}

serverConnection()