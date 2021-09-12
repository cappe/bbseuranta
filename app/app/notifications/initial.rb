# To deliver this notification:
#
# Initial.with(post: @post).deliver_later(current_user)
# Initial.with(post: @post).deliver(current_user)

class Initial < Noticed::Base
  deliver_by :email,
             mailer: "NotifyMailer",
             method: :confirmation,
             if: :deliver_by_email?

  deliver_by :webpush,
             class: "DeliveryMethods::Webpush",
             template: 'initial/webpush/initial',
             event_name: 'INITIAL',
             if: :deliver_by_webpush?

  param :delivery_method,
        :lang

  private

    def delivery_method
      params[:delivery_method]
    end

    def deliver_by_email?
      delivery_method == :email
    end

    def deliver_by_webpush?
      delivery_method == :webpush
    end
end
