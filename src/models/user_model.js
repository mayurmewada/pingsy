const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
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
    chatIds: {
        type: Array,
        default: [],
    },
});

const userModel = mongoose?.models.users || mongoose.model("users", userSchema);

export default userModel;
