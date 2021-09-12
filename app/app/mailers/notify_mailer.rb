class NotifyMailer < ApplicationMailer
  before_action :set_recipient
  before_action :set_user_link

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.notify_mailer.episode_notification.subject
  #
  def episode_notification
    mail to: @recipient.email,
         subject: 'Big Brotherissa tapahtuu!'
  end

  def confirmation
    mail to: @recipient.email,
         subject: 'BB 24/7 seuranta toimii nyt!'
  end

  private

    def set_recipient
      @recipient = params[:recipient]
    end

    def set_user_link
      @user_link = "https://bbseuranta.fi?id=#{@recipient.id}"
    end
end
