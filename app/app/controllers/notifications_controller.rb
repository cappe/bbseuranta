class NotificationsController < ApplicationController
  protect_from_forgery with: :null_session

  def create
    User.find_each do |user|
      EpisodeNotification.with(lang: :fi).deliver_later(user)
    end

    head :no_content
  end

  def batch_update
    Notification
      .unread
      .where(id: params[:notification_ids])
      .each(&:mark_as_read!)

    head :no_content
  end
end
