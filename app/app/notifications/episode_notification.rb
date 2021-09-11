# To deliver this notification:
#
# EpisodeNotification.with(post: @post).deliver_later(current_user)
# EpisodeNotification.with(post: @post).deliver(current_user)

class EpisodeNotification < Noticed::Base
  # Add your delivery methods
  #
  deliver_by :database
  deliver_by :webpush,
             class: "DeliveryMethods::Webpush",
             template: 'episode_notification/webpush/episode_notification',
             event_name: 'EPISODE_NOTIFICATION'
  # deliver_by :email, mailer: "UserMailer"
  # deliver_by :slack
  # deliver_by :custom, class: "MyDeliveryMethod"

  # Add required params
  #
  param :lang

  # Define helper methods to make rendering easier.
  #
  # def message
  #   t(".message")
  # end
  #
  # def url
  #   post_path(params[:post])
  # end
end
