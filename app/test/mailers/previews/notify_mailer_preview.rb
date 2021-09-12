# Preview all emails at http://localhost:3000/rails/mailers/notify_mailer
class NotifyMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/notify_mailer/episode_notification
  def episode_notification
    NotifyMailer.episode_notification
  end

  def confirmation
    NotifyMailer.confirmation
  end

end
