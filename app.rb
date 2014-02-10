require 'sinatra'
require "sinatra/json"

set :public_folder, File.dirname(__FILE__) + '/build'

get '/' do
	File.read(File.join('build', 'index.html'))    
end

get '/:handle/followers' do
	json :data => "
    {
        \"followers\": [
            {
                \"id\": 0,
                \"name\": \"twitter\"
            },
            {
                \"id\": 1,
                \"name\": \"github\"
            }
        ]
    }"
	#File.read(File.join('build', 'index.html'))
end
