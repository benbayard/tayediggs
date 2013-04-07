# TayeDiggs

TayeDiggs is the codename for the Moovweb team's PhotoHackDay 4 hackathon entry.

## Getting Started

Clone the repo.

    $ git clone git@github.com:benbayard/tayediggs.git
    $ cd tayediggs

Install Sinatra.

    $ rvm gemset create tayediggs
    $ rvm gemset use tayediggs
    $ gem install bundler
    $ bundle install
    
Start the local Sinatra server.

    $ rackup
    
You should be able to hit the site inside your browser by accessing `localhost:9292`.

**Alternatively you can view just the static files by opening `public/index.html` in your browser.**

## Deploying to Heroku

Chances are that you haven't uploaded an SSH key to Heroku from the computer you're using for PhotoHackDay.

### Step 1: Generate a new SSH Key

See these helpful [Github instructions](https://devcenter.heroku.com/articles/keys). **I strongly recommend you provide
a unique name for the new ssh key-pair you're generating, such as `heroku_id_rsa`.**

### Step 2: Add your Heroku keys

Inside the **terminal**, you'll need to login to heroku and add your new ssh key-pair.

    $ heroku login
    $ heroku keys:add
    
Then, login to the Heroku web interface and access your [account](https://dashboard.heroku.com/account).
If you scroll down, you will see a section called "SSH Keys".

Assuming the new SSH key-pair you just generated is called `heroku_id_rsa`, you'll want to print out your **public** key.

    $ cat ~/.ssh/heroku_id_rsa.pub
    
**It's very important you append the `.pub` suffix - otherwise you'd be printing and uploading your private key!!!**
Just copy and paste the public key signature to Heroku.

### Step 3: Deploy

Add the Heroku remote and then push.
    
    $ git remote add heroku git@heroku.com:tayediggs.git
    $ git push heroku master

### Troubleshooting

When you try to deploy by pushing to Github, you might run into an error that will say something like "unauthorized fingerprint".
This is most likely because you have multiple Heroku accounts and your computer doesn't know which ssh-key to use to authenticate
with Heroku, and it's using the wrong one.

To fix this, open your computer's SSH config with a text editor (following example using TextMate): 

    $ mate ~/.ssh/config

Edit the second line of this section:

    host heroku.com
    IdentityFile ~/.ssh/personal_heroku_id_rsa
    
You'll want to point `IdentityFile` to whatever your Heroku ssh key-pair is (probably the one you just generated if you
followed the setup instructions above).

## Adding files and making changes

You should be able to add stuff to the `public/` folder like a normal HTML project.
