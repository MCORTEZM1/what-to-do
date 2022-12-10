const { Schema, model, isNew, isModified } = require('mongoose'); 
const bcrypt = require('bcrypt');

const userSchema = new Schema(
    {
        firstName: { 
            type: String, 
            required: true, 
            trim: true
        },
        lastName: {
            type: String, 
            required: true,
            trim: true
        }, 
        userName: { 
            type: String, 
            required: true, 
            trim: true, 
            unique: true
        }, 
        email: { 
            type: String, 
            required: true, 
            trim: true, 
            unique: true, 
            match: [
                /(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                "Must enter a valid email address"
            ]
        }, 
        passwiord: { 
            type: String, 
            required: true, 
            minLength: 5
        },

    },
    {
        toJSON: {
            virtuals: true,
        }
    }
);

userSchema.pre('save', async function(next) {
    if ( this.isNew || this.isModified('password')) { 
        const saltRounds = 10; 
        this.password = await bcrypt.hash(this.password, saltRounds); 
    }

    next();
}); 


const User = model('User', userSchema);

module.exports = User