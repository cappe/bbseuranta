class NotificationsController < ApplicationController
  protect_from_forgery with: :null_session

  def create
    current_user = User
                     .cooldown
                     .find_by_id(params[:user_id])

    if current_user
      User.find_each do |user|
        EpisodeNotification.with(lang: :fi).deliver_later(user)
      end

      current_user.touch(:prev_sent_at)
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
