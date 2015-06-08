require 'bundler'
Bundler.require

DB = Sequel.connect(ENV['DATABASE_URL'] || '//sqlite://db/main.db')
require 'models.rb'

get '/' do
  erb :index
end

get '/play' do
  erb :main
end