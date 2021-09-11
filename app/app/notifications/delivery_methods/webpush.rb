class DeliveryMethods::Webpush < Noticed::DeliveryMethods::Base
  options :event_name,
          :template

  def deliver
    WebpushClient.call format
  end

  private

    def format
      if (method = options[:format])
        notification.send(method)
      else
        {
          event_name: event_name,
          payload: payload,
          subscription: recipient
        }
      end
    end

    def event_name
      options[:event_name]
    end

    def payload
      raw_payload = TemplateRenderer.call(
        template: template,
        template_ext: '.json.erb',
        template_variables: template_variables,
        )

      payload = JSON.parse(
        raw_payload,
        symbolize_names: true,
        )

      {
        title: payload[:title],
        body: payload[:body],
        data: payload[:data] || {},
      }
    end

    def template
      options[:template]
    end

    def template_variables
      notification.params
    end
end
