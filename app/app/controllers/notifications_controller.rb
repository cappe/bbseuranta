class NotificationsController < ApplicationController
  protect_from_forgery with: :null_session

  def create
    User.find_each do |user|
      EpisodeNotification.with(lang: :fi).deliver_later(user)
    end

    head :no_content
  end
end
