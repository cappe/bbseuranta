class WebpushClient
  include Callable

  def initialize(event_name:, payload:, subscription:)
    @event_name = event_name
    self.payload = payload
    @subscription = subscription
  end

  def call
    success = nil

    begin

      Webpush.payload_send(
        message: JSON.generate(payload),
        endpoint: endpoint,
        p256dh: p256dh,
        auth: auth,
        vapid: vapid
      )

      success = true

    rescue Webpush::InvalidSubscription,
      Webpush::ExpiredSubscription,
      Webpush::Unauthorized

      subscription.destroy

      success = false

    end

    success
  end

  private

    attr_reader :event_name,
                :payload,
                :subscription

    # Frontend's webpush control flow is based on the
    # event_name for which why it is enforced here.
    def payload=(payload)
      payload[:data] = {} unless payload[:data]
      payload[:data][:event_name] = event_name
      @payload = payload
    end

    def endpoint
      subscription.endpoint
    end

    def p256dh
      subscription.p256dh
    end

    def auth
      subscription.auth
    end

    def vapid
      {
        public_key: public_key,
        private_key: private_key
      }
    end

    def public_key
      credentials.fetch(:public)
    end

    def private_key
      credentials.fetch(:private)
    end

    def credentials
      Rails.application.credentials.vapid
    end
end
