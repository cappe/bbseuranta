# To deliver this notification:
#
# Initial.with(post: @post).deliver_later(current_user)
# Initial.with(post: @post).deliver(current_user)

class Initial < Noticed::Base
  deliver_by :webpush,
             class: "DeliveryMethods::Webpush",
             template: 'initial/webpush/initial',
             event_name: 'INITIAL'

  param :lang
end
