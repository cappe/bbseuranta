require 'sidekiq/web'
require 'sidekiq-status/web'

Rails.application.routes.draw do
  root 'welcome#index'

  get 'public_vapid_key', to: 'users#public_vapid_key'
  get 'find_by_endpoint', to: 'users#show'

  resources :users, only: [:show, :create, :destroy]
  resources :notifications, only: [:create]

  namespace :notifications do
    patch :batch_update, to: 'batch_update'
  end

  mount Sidekiq::Web => '/sidekiq'
end
