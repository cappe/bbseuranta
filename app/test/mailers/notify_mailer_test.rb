require "test_helper"

class NotifyMailerTest < ActionMailer::TestCase
  test "episode_notification" do
    mail = NotifyMailer.episode_notification
    assert_equal "Episode notification", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end

end
