require 'sinatra'
require 'json'
require 'net/http'
require 'uri'
require 'oauth'
require 'oauth/consumer'

enable :sessions

before do
  session[:oauth] ||= {}
  @callback_url = "http://www.tumblr.com/oauth"
  @consumer ||=OAuth::Consumer.new "m5ullCnVK24E87WPwaLRZz6jRJ8gd1T2wMaOpP2zlP2ofBodJw", "xrA3XIwrBg9tetaWaW1fBP3Ookmtf3rXVAZo8oIx5EAqPaOvJA", {
    :site => "http://www.tumblr.com/oauth/request_token"
  }

  if !session[:oauth][:request_token].nil? && !session[:oauth][:request_token_secret].nil?
    @request_token = OAuth::RequestToken.new(@consumer, session[:oauth][:request_token], session[:oauth][:request_token_secret])
  end

  if !session[:oauth][:access_token].nil? && !session[:oauth][:access_token_secret].nil?
    @access_token = OAuth::AccessToken.new(@consumer, session[:oauth][:access_token], session[:oauth][:access_token_secret])
  end
end

post '/' do
  
  # Respond to the incoming request
  puts " POST to / !!!!"
  puts request.to_s
  puts request.params.to_s
  content_type :json
  { :success => true, :error => ""}.to_json
  
  # POST with the tumblr api data
  
end

get "/oauth/request" do
  puts "GET /oauth/request"
  @request_token = @consumer.get_request_token(:oauth_callback => @callback_url)
  session[:oauth][:request_token] = @request_token.token
  session[:oauth][:request_token_secret] = @request_token.secret
  redirect @request_token.authorize_url(:oauth_callback => @callback_url)
end

get "/oauth/callback" do
  puts "GET /oauth/callback"
  @access_token = @request_token.get_access_token :oauth_verifier => params[:oauth_verifier]
  session[:oauth][:access_token] = @access_token.token
  session[:oauth][:access_token_secret] = @access_token.secret
  redirect "/"
end

get %r{^(?!.*sass|stylesheets|images).*} do
  File.read(File.join('public', 'index.html'))
end