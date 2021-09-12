# To deliver this notification:
#
# EpisodeNotification.with(post: @post).deliver_later(current_user)
# EpisodeNotification.with(post: @post).deliver(current_user)

class EpisodeNotification < Noticed::Base
  deliver_by :database

  deliver_by :email,
             mailer: "NotifyMailer",
             method: :episode_notification,
             if: :deliver_by_email?

  deliver_by :webpush,
             class: "DeliveryMethods::Webpush",
             template: 'episode_notification/webpush/episode_notification',
             event_name: 'EPISODE_NOTIFICATION',
             if: :deliver_by_webpush?

  param :lang

  private

    def deliver_by_email?
      not recipient.email.nil?
    end

    def deliver_by_webpush?
      not recipient.endpoint.nil?
    end
end
