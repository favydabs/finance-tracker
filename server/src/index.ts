import express, {Express} from 'express';
import mongoose from 'mongoose';
import financialRecordRouter from './routes/financial-record';


const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Connect to MongoDB
const mogoURL: string ="mongodb+srv://rangmakfavour:GfAUWRcz34BsFWgp@financetracker.stfnm.mongodb.net/";
mongoose.connect(mogoURL)
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.log(error));

// Routes
app.use('/financial-record', financialRecordRouter);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});