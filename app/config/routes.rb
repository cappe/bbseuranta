require 'sidekiq/web'
require 'sidekiq-status/web'

Rails.application.routes.draw do
  root 'welcome#index'

  get 'public_vapid_key', to: 'users#public_vapid_key'
  get 'find_by_endpoint', to: 'users#show'

  resources :users, only: [:create, :destroy]
  resources :notifications, only: [:create]

  mount Sidekiq::Web => '/sidekiq'
end
