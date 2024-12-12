import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import sequence from "mongoose-sequence";
import { boolean } from "zod";

const AutoIncrement = sequence(mongoose);

const userSchema = new mongoose.Schema( {
    username: {
        type:String,
        require:true
    },
    email: {
        type:String,
        require:true
    },
    password: {
        type:String,
        require:true
    },
    isAdmin: {
        type:Boolean,
        require:true
    },
    joinedOn: {
        type: Date,
        default: Date.now
    }
});

userSchema.plugin(AutoIncrement, {inc_field: "userId"});

userSchema.pre("save", async function (next) {
    const curr = this;
    if (!curr.isModified("password")) {
        next();
    }
    curr.password = await hashPassword(curr.password);
});

userSchema.methods.checkPassword = async function(enteredPass) {
    const isCorrect = bcrypt.compareSync(enteredPass, this.password);
    return isCorrect;
}

userSchema.methods.generateToken = async function() {
    try {
        return jwt.sign(
            {
                userId: this._id.toString(),
                email: this.email,
                role: this.role
            }, 
            process.env.JWT_GENERATING_STRING, 
            {
                expiresIn: "30d"
            }
        );
    }
    catch(error) {
        console.log(error);
    }
};

async function hashPassword(input_password) {
    try {
        const saltRounds = await bcrypt.genSalt(10);
        return await bcrypt.hash(input_password, saltRounds);
    }
    catch(error) {
        next(error);
    }
}

const User = mongoose.model("User", userSchema);
export default User;