class NotifyMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.notify_mailer.episode_notification.subject
  #
  def episode_notification(recipient)
    @recipient = recipient

    mail to: @recipient.email,
         subject: 'Big Brotherissa tapahtuu!'
  end

  def confirmation
    @recipient = params[:recipient]

    mail to: @recipient.email,
         subject: 'BB 24/7 seuranta toimii nyt!'
  end
end
