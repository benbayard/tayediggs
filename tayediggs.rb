require 'sinatra'

get %r{^(?!.*sass|stylesheets|images).*} do
  File.read(File.join('public', 'index.html'))
end