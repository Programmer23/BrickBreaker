require 'bundler'
Bundler.require

DB = Sequel.connect(ENV['DATABASE_URL'] || 'sqlite://db/main.db')
require './models.rb'

use Rack::Session::Cookie, :key => 'rack.session',
    :expire_after => 2592000,
    :secret => SecureRandom.hex(64)

use OmniAuth::Builder do
  provider :facebook, ENV['FACEBOOK_CLIENT_ID'], ENV['FACEBOOK_CLIENT_SECRET'],
           {
               :name => 'facebook',
               :scope => 'public_profile',
               :image_size => 'square',
               :provider_ignores_state => true # Using Rack::Protection::AuthenticityToken
           }
end

include BCrypt

get '/' do
  erb :index
end

post '/' do
  user = User.first(:name => params[:username])
  if user.name == params[:username] && user.password == params[:password]
    redirect '/play'
  else
    @correct = false
    session["message"] = "Username or Password is incorrect"
  end
end

get '/signup' do
  @message = session["message"]
  @correct = true
  session["message"] = nil

  erb :signup
end

post '/signup' do
  if (params[:new_password] == params[:new_password2])
    u = User.new
    u.name = params[:new_username]
    u.password = params[:new_password]
    u.save
  else
    session["message"] = "Passwords do not match"
  end

  redirect '/'
end

get '/play' do
  erb :main
end

get '/leaderboard' do
  erb :highscores
end

# Auth Routes and Helpers
%w(get post).each do |method|
  send(method, '/auth/:provider/callback') do
    uid = request.env['omniauth.auth'].uid
    provider_name = request.env['omniauth.auth'].provider
    info = request.env['omniauth.auth'].info.to_hash
    credentials = request.env['omniauth.auth'].credentials.to_hash

    puts "UID: #{uid}"

    unless user = User.first(:uid => uid)
      user = User.new
      user.uid = uid

      user.name = info['name']
      user.image = info['image']

      user.save
    end

    session[:uid] = user.id

    status 200
  end
end

get '/auth/logout' do
  session.clear

  redirect url('/')
end

helpers do
  def current_user
    if authenticated?
      User.first(:uid => session[:uid])
    else
      halt(401, 'Not authenticated')
    end
  end

  def authenticated?
    session[:uid] && User.first(:uid => session[:uid])
  end
end