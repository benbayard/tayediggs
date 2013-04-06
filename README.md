# tayediggs

Moovweb PHD.

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

## Adding files and making changes

You should be able to add stuff to the `public/` folder like a normal HTML project.
