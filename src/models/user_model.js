const { default: mongoose } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: () => uuidv4(),
    },
    username: {
        require: true,
        type: String,
        unique: true,
    },
    email: {
        require: true,
        type: String,
    },
    password: {
        require: true,
        type: String,
    },
    privateKey: {
        require: true,
        type: String,
    },
    iv: {
        require: true,
        type: String,
    },
    publicKey: {
        require: true,
        type: String,
    },
    friends: {
        type: Array,
        default: [],
    },
    request: {
        type: Array,
        default: [],
    },
});

const userModel = mongoose?.models.users || mongoose.model("users", userSchema);

export default userModel;
