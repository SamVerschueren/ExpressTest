/**
 * This user model defines the schema of a user that can be used to authenticate
 * someone in the NodeJS application. It uses a salt and the sha256 encryption method
 * toe ncrypt the passwords.
 * 
 * @author  Bram Vandewalle     <bram.vandewalle@endare.com>
 * @author  Sam Verschueren     <sam.verscheuren@endare.com>
 * @since   23 Sept. 2013
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var validator = require('validator');

// Define the schema of the User model
var UserSchema = new Schema({
    firstName:          {type: String, default: ''},
    lastName:           {type: String, default: ''},
    email:              {type: String, default: ''},
    hashed_password:    {type: String, default: ''},
    salt:               {type: String, default: ''}
});

/**
 * Define virtual methods.
 */
UserSchema
    .virtual('fullName')
    .set(function(fullName)
    {
        var split = setFullNameTo.split(' ');
        this.firstName = split[0];
        this.lastName = split[1];
    })
    .get(function()
    {
        return this.firstName + ' ' + this.lastName;
    });
    
UserSchema
    .virtual('password')
    .set(function(password)
    {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function()
    {
        return this._password;
    });
    
/**
 * Validations
 */
var validatePresenceOf = function(value)
{
    return value && value.length;
};
 
UserSchema.path('firstName').validate(function(firstName)
{
    return firstName.length;
}, 'Please provide a firstname.');
 
UserSchema.path('lastName').validate(function(lastName)
{
    return lastName.length;
}, 'Please provide a lastname.');
 
UserSchema.path('email').validate(function(email)
{
    return email.length;
}, 'The email address can not be blank.');
 
UserSchema.path('email').validate(function(email)
{
    try
    {
        console.log('Is ' + email + ' valid?');
        return validator.isEmail(email);
    }
    catch(err)
    {
        return false;
    }
}, 'Please provide a valid email address.');
 
UserSchema.path('email').validate(function(email, fn)
{
    var User = mongoose.model('User');
    if(this.isNew || this.isModified('email'))
    {
        User.find({email: email}).exec(function(err, users)
        {
            fn(err || users.length === 0);
        });
    }
    else fn(true);
}, 'The email provided already exists.');
 
UserSchema.path('hashed_password').validate(function(hashed_password)
{
    return hashed_password.length;
}, 'The password of the user can not be blank.');
 
/**
 * Presave hook
 */
UserSchema.pre('save', function(next)
{
    if(!this.isNew)
        return next();
    if(!validatePresenceOf(this.password))
        next(new Error('Invalid password'));
    else
        next();
});

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Check if the passwords are the same, if so it will return true, else it will
     * return false.
     * 
     * @param  String  plainText    The password we wish to authenticate with.
     * @return Boolean              A boolean indicating if we are succesfully authenticated or not.
     */
    authenticate: function(plainText)
    {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
     
    /**
     * This method will generate a random salt that we can use to encrypt the password with.
     * 
     * @return A randomly generated salt.
     */
    makeSalt: function()
    {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },
      
    /**
     * This method will encrypt the password in combination with the salt of this user 
     * with the sha256 algorithm.
     * 
     * @param  String password      The password that should be encrypted.
     * @return String               The encrypted password.
     */
    encryptPassword: function(password)
    {
        if(!password)
            return '';

        try
        {
            var encrypted = crypto.createHmac('sha256', this.salt).update(password).digest('hex');
            return encrypted;
        }
        catch(err)
        {
            return '';
        }
    }
};

// Create the model depending on the schema
mongoose.model('User', UserSchema);