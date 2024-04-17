const mongoose = require('mongoose');
const event =mongoose.Schema({
    EventName:{
        type:String,
        reguired:[true,"please enter event name"]
    },
    date:{
        type:Date,
        required:[true,"please enter event date"]
    },
    location:{
        type:String,
        required:[true,"please enter location"]

    },
    price:{
        type:Number,
        required:[true,"please enter price"]
    }
    
},{
    timestamps:true
})

module.exports = mongoose.model("events",event)