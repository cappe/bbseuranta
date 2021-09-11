require 'sidekiq/web'
require 'sidekiq-status/web'

Rails.application.routes.draw do
  root 'welcome#index'
  mount Sidekiq::Web => '/sidekiq'
end
