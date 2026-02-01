const mongoose = require('mongoose')

const dbConnect = async() =>{
    await mongoose.connect('mongodb+srv://anup94622:p6lH5fryb0udg2Hc@learningmongo.8gbbg2w.mongodb.net/devConnect')
}

module.exports = dbConnect;

